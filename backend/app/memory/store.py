from typing import Any
from uuid import UUID
from langchain_google_genai import GoogleGenerativeAIEmbeddings
from langchain_qdrant import QdrantVectorStore
from langchain_core.documents import Document

from app.models.schemas import CustomerOutcomeRecord, DecisionReport, MemoryRecord, MemoryType


class MemoryStore:
    def __init__(self) -> None:
        self.records: list[MemoryRecord] = []
        self._embeddings = None
        self._vector_store = None
        self._initialized = False
        
    @property
    def embeddings(self):
        if self._embeddings is None:
            self._embeddings = GoogleGenerativeAIEmbeddings(model="models/text-embedding-004")
        return self._embeddings

    @property
    def vector_store(self):
        if not self._initialized:
            self._initialized = True
            try:
                self._vector_store = QdrantVectorStore.from_documents(
                    [],
                    self.embeddings,
                    location=":memory:",
                    collection_name="decisionmesh_memory"
                )
            except Exception:
                self._vector_store = None
        return self._vector_store

    def remember(self, record: MemoryRecord) -> MemoryRecord:
        self.records.append(record)
        if self.vector_store:
            doc = Document(
                page_content=f"{record.task}\n{record.summary}",
                metadata={"domain": record.domain, "type": record.memory_type.value}
            )
            self.vector_store.add_documents([doc])
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
        if not self.vector_store or not self.records:
            return self.records[-limit:]
            
        try:
            results = self.vector_store.similarity_search(task, k=limit)
            if results:
                # Basic matching based on the semantic results
                return self.records[-limit:] # Simplified matching for now, as we want to return MemoryRecord objects
        except Exception:
            pass
            
        return self.records[-limit:]

    def list(self) -> list[MemoryRecord]:
        return self.records[:]

    def count(self) -> int:
        return len(self.records)


memory_store = MemoryStore()

