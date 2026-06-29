from collections import Counter
import math
import re

from app.models.schemas import Evidence, IngestedDocument, SourceType

_TOKEN_RE = re.compile(r"[a-z0-9]+")


def _tokens(text: str) -> list[str]:
    return [token for token in _TOKEN_RE.findall(text.lower()) if len(token) > 2]


from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_core.documents import Document
from app.models.schemas import Evidence, IngestedDocument, SourceType

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
        self._vector_store = None
        self._embeddings = None

    @property
    def embeddings(self):
        if self._embeddings is None:
            self._embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        return self._embeddings

    @property
    def vector_store(self):
        return self._vector_store

    def index(self, documents: list[IngestedDocument]) -> int:
        self._fallback_docs = documents[:]
        docs_to_index = []
        for document in documents:
            chunks = _chunks(document.text) or [document.title]
            for chunk in chunks:
                docs_to_index.append(
                    Document(
                        page_content=chunk,
                        metadata={
                            "source_id": str(document.id),
                            "source_type": document.source_type or SourceType.other,
                            "title": document.title,
                            **(document.metadata or {})
                        }
                    )
                )
        if docs_to_index:
            try:
                self._vector_store = QdrantVectorStore.from_documents(
                    docs_to_index,
                    self.embeddings,
                    location=":memory:",
                    collection_name="decisionmesh_rag"
                )
            except Exception:
                # If OpenAI API key is missing or fails, we fallback
                pass
        return len(documents)

    def retrieve(self, query: str, documents: list[IngestedDocument] | None = None, limit: int = 6) -> list[Evidence]:
        if not self.vector_store:
            # Fallback to basic if vector store failed to initialize
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
        
        results = self.vector_store.similarity_search_with_score(query, k=limit)
        evidence: list[Evidence] = []
        for doc, score in results:
            relevance = min(1.0, max(0.4, score))
            evidence.append(
                Evidence(
                    source_id=doc.metadata.get("source_id", "unknown"),
                    source_type=doc.metadata.get("source_type", SourceType.other),
                    excerpt=doc.page_content[:520],
                    relevance=round(relevance, 3),
                    metadata=doc.metadata | {"retrieval": "qdrant_dense", "score": round(score, 3)},
                )
            )
        return evidence
