from collections import Counter
import math
import os
import re

from google import genai
from app.models.schemas import Evidence, IngestedDocument, SourceType

def cosine_similarity(v1, v2):
    dot_product = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot_product / (mag1 * mag2)

_TOKEN_RE = re.compile(r"[a-z0-9]+")

def _tokens(text: str) -> list[str]:
    return [token for token in _TOKEN_RE.findall(text.lower()) if len(token) > 2]

def _chunks(text: str, size: int = 700, overlap: int = 120) -> list[str]:
    clean = " ".join(text.split())
    if not clean:
        return []
    chunks: list[str] = []
    step = max(1, size - overlap)
    for start in range(0, len(clean), step):
        chunk = clean[start : start + size]
        if chunk:
            chunks.append(chunk)
    return chunks

class HybridRAG:
    def __init__(self) -> None:
        self._fallback_docs: list[IngestedDocument] = []
        self._docs: list[dict] = []
        self._client = None
        self._initialized = False

    @property
    def client(self):
        if not self._initialized:
            api_key = os.environ.get("GOOGLE_API_KEY") or os.environ.get("GEMINI_API_KEY")
            if api_key:
                try:
                    self._client = genai.Client(api_key=api_key)
                except Exception:
                    pass
            self._initialized = True
        return self._client

    def embed_text(self, text: str) -> list[float] | None:
        if not self.client:
            return None
        try:
            response = self.client.models.embed_content(
                model='text-embedding-004',
                contents=text,
            )
            return response.embeddings[0].values
        except Exception:
            return None

    def embed_texts(self, texts: list[str]) -> list[list[float]] | None:
        if not self.client or not texts:
            return None
        try:
            response = self.client.models.embed_content(
                model='text-embedding-004',
                contents=texts,
            )
            return [e.values for e in response.embeddings]
        except Exception:
            return None

    def index(self, documents: list[IngestedDocument]) -> int:
        self._fallback_docs = documents[:]
        self._docs = []
        
        all_chunks = []
        metadata_list = []
        
        for document in documents:
            chunks = _chunks(document.text) or [document.title]
            for chunk in chunks:
                all_chunks.append(chunk)
                metadata_list.append({
                    "source_id": str(document.id),
                    "source_type": document.source_type or SourceType.other,
                    "title": document.title,
                    **(document.metadata or {})
                })
                
        if not all_chunks:
            return 0
            
        vectors = []
        for i in range(0, len(all_chunks), 100):
            batch = all_chunks[i:i+100]
            batch_vecs = self.embed_texts(batch)
            if batch_vecs:
                vectors.extend(batch_vecs)
            else:
                vectors.extend([None] * len(batch))
                
        for i, vec in enumerate(vectors):
            if vec:
                self._docs.append({
                    "content": all_chunks[i],
                    "vector": vec,
                    "metadata": metadata_list[i]
                })
        return len(documents)

    def retrieve(self, query: str, documents: list[IngestedDocument] | None = None, limit: int = 6) -> list[Evidence]:
        query_vector = self.embed_text(query)
        if not query_vector or not self._docs:
            return [
                Evidence(
                    source_id=str(doc.id),
                    source_type=doc.source_type or SourceType.other,
                    excerpt=(doc.text or doc.title)[:520],
                    relevance=0.35,
                    metadata=doc.metadata | {"retrieval": "fallback", "title": doc.title},
                )
                for doc in (documents or self._fallback_docs)[:limit]
            ]
        
        scored = []
        for doc in self._docs:
            score = cosine_similarity(query_vector, doc["vector"])
            scored.append((score, doc))
        
        scored.sort(key=lambda x: x[0], reverse=True)
        
        evidence: list[Evidence] = []
        for score, doc in scored[:limit]:
            relevance = min(1.0, max(0.4, score))
            evidence.append(
                Evidence(
                    source_id=doc["metadata"].get("source_id", "unknown"),
                    source_type=doc["metadata"].get("source_type", SourceType.other),
                    excerpt=doc["content"][:520],
                    relevance=round(relevance, 3),
                    metadata=doc["metadata"] | {"retrieval": "in_memory_dense", "score": round(score, 3)},
                )
            )
        return evidence
