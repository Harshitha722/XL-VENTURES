import os
import math
from typing import Any
from uuid import UUID

from google import genai
from app.models.schemas import CustomerOutcomeRecord, DecisionReport, MemoryRecord, MemoryType

def cosine_similarity(v1, v2):
    dot_product = sum(a * b for a, b in zip(v1, v2))
    mag1 = math.sqrt(sum(a * a for a in v1))
    mag2 = math.sqrt(sum(b * b for b in v2))
    if mag1 == 0 or mag2 == 0:
        return 0.0
    return dot_product / (mag1 * mag2)

class MemoryStore:
    def __init__(self) -> None:
        self.records: list[MemoryRecord] = []
        self._embeddings: list[list[float]] = []
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

    def remember(self, record: MemoryRecord) -> MemoryRecord:
        self.records.append(record)
        vector = self.embed_text(f"{record.task}\n{record.summary}")
        self._embeddings.append(vector if vector else [])
        return record

    def remember_feedback(
        self,
        decision: str,
        payload: dict[str, Any],
        domain: str = "general",
        task: str = "human feedback",
        source_report_id: UUID | None = None,
    ) -> MemoryRecord:
        summary = f"Human {decision} feedback recorded"
        record = MemoryRecord(
            memory_type=MemoryType.feedback,
            domain=domain,
            task=task,
            summary=summary,
            payload={"decision": decision, **payload},
            source_report_id=source_report_id,
        )
        return self.remember(record)

    def remember_customer_outcome(self, record: CustomerOutcomeRecord) -> MemoryRecord:
        summary = (
            f"Customer outcome {record.outcome.value} recorded for {record.customer_name}: "
            f"{record.learning_summary}"
        )
        memory = MemoryRecord(
            memory_type=MemoryType.customer_outcome,
            domain=record.domain,
            task="customer outcome feedback",
            summary=summary,
            payload=record.model_dump(mode="json"),
            source_report_id=record.report_id,
        )
        return self.remember(memory)

    def remember_report(self, report: DecisionReport, task: str) -> list[MemoryRecord]:
        records = [
            MemoryRecord(
                memory_type=MemoryType.episodic,
                domain=report.domain.domain,
                task=task,
                summary=f"Decision report {report.id} produced {len(report.recommendations)} recommendation(s).",
                payload={
                    "confidence": report.confidence.overall,
                    "mandatory_review": report.mandatory_review,
                    "review_status": report.review_status,
                },
                source_report_id=report.id,
            ),
            MemoryRecord(
                memory_type=MemoryType.semantic,
                domain=report.domain.domain,
                task=task,
                summary="Business goals and reasoning patterns captured for reuse.",
                payload={
                    "business_goals": report.reasoning.business_goals,
                    "risks": report.reasoning.risks[:5],
                    "opportunities": report.reasoning.opportunities[:5],
                },
                source_report_id=report.id,
            ),
        ]
        for record in records:
            self.remember(record)
        return records

    def retrieve(self, domain: str, task: str, limit: int = 10) -> list[MemoryRecord]:
        if not self.records:
            return []
            
        task_vector = self.embed_text(task)
        if not task_vector:
            return self.records[-limit:]
            
        scored = []
        for i, record in enumerate(self.records):
            vec = self._embeddings[i]
            if vec:
                score = cosine_similarity(task_vector, vec)
                scored.append((score, record))
            else:
                scored.append((0.0, record))
                
        scored.sort(key=lambda x: x[0], reverse=True)
        return [r for s, r in scored[:limit]]

    def list(self) -> list[MemoryRecord]:
        return self.records[:]

    def count(self) -> int:
        return len(self.records)


memory_store = MemoryStore()

