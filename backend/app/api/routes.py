from uuid import UUID

from fastapi import APIRouter, File, HTTPException, UploadFile

from app.audit.store import audit_store
from app.core.orchestrator import orchestrator
from app.memory.store import memory_store
from app.models.schemas import (
    AnalysisRequest,
    AuditEvent,
    CustomerOutcomeRecord,
    CustomerOutcomeRequest,
    DecisionReport,
    DomainCatalogItem,
    IngestedDocument,
    MemoryRecord,
    PlatformMetrics,
    ReviewRequest,
    SourceType,
)

router = APIRouter()


@router.post("/upload", response_model=list[IngestedDocument])
async def upload(files: list[UploadFile] = File(...)) -> list[IngestedDocument]:
    documents: list[IngestedDocument] = []
    for file in files:
        raw = await file.read()
        text = raw.decode("utf-8", errors="ignore").strip()
        suffix = (file.filename or "").split(".")[-1].lower()
        source_type = SourceType.pdf if suffix == "pdf" else SourceType.other
        if not text:
            text = f"Uploaded {source_type.value} file named {file.filename or 'uploaded-file'}."
        documents.append(
            IngestedDocument(
                title=file.filename or "uploaded-file",
                text=text,
                source_type=source_type,
                metadata={"filename": file.filename, "content_type": file.content_type},
            )
        )
    return documents


@router.post("/analyze", response_model=DecisionReport)
async def analyze(request: AnalysisRequest) -> DecisionReport:
    if not request.documents:
        raise HTTPException(status_code=400, detail="At least one document is required")
    return await orchestrator.analyze(request)


@router.post("/recommend")
async def recommend(request: AnalysisRequest):
    report = await orchestrator.analyze(request)
    return report.recommendations


@router.post("/review", response_model=AuditEvent)
async def review(request: ReviewRequest) -> AuditEvent:
    if not orchestrator.get_report(request.report_id):
        raise HTTPException(status_code=404, detail="Report not found")
    return orchestrator.review(request)


@router.post("/outcomes", response_model=CustomerOutcomeRecord)
async def record_outcome(request: CustomerOutcomeRequest) -> CustomerOutcomeRecord:
    if request.report_id and not orchestrator.get_report(request.report_id):
        raise HTTPException(status_code=404, detail="Report not found")
    return orchestrator.record_customer_outcome(request)


@router.get("/outcomes", response_model=list[CustomerOutcomeRecord])
async def outcomes() -> list[CustomerOutcomeRecord]:
    return orchestrator.list_customer_outcomes()


@router.post("/memory/approve", response_model=MemoryRecord)
async def memory_approve(payload: dict) -> MemoryRecord:
    return memory_store.remember_feedback("approve", payload)


@router.post("/memory/reject", response_model=MemoryRecord)
async def memory_reject(payload: dict) -> MemoryRecord:
    return memory_store.remember_feedback("reject", payload)


@router.post("/memory/override", response_model=MemoryRecord)
async def memory_override(payload: dict) -> MemoryRecord:
    return memory_store.remember_feedback("override", payload)


@router.get("/audit", response_model=list[AuditEvent])
async def audit() -> list[AuditEvent]:
    return audit_store.list()


@router.get("/report/{report_id}", response_model=DecisionReport)
async def report(report_id: UUID) -> DecisionReport:
    found = orchestrator.get_report(report_id)
    if not found:
        raise HTTPException(status_code=404, detail="Report not found")
    return found


@router.get("/reports", response_model=list[DecisionReport])
async def reports() -> list[DecisionReport]:
    return orchestrator.list_reports()


@router.get("/domains", response_model=list[DomainCatalogItem])
async def domains() -> list[DomainCatalogItem]:
    """
    Returns domains dynamically detected by the LLM across all completed analyses.
    No static YAML ontology catalog — every domain was identified from real evidence.
    """
    reports = orchestrator.list_reports()
    seen: dict[str, DomainCatalogItem] = {}
    for report in reports:
        d = report.domain
        key = d.domain.lower()
        if key not in seen:
            seen[key] = DomainCatalogItem(
                domain=d.domain,
                description=d.description,
                business_goals=d.business_goals,
                kpis=[],
                risks=report.reasoning.risks[:5],
                opportunities=report.reasoning.opportunities[:5],
                success_metrics=[s.success_metrics[0] for s in report.scenarios if s.success_metrics][:5],
                agent_capabilities=d.recommended_capabilities,
                tools=list({tool for agent in report.agents for tool in agent.tools})[:6],
                scenario_count=len(report.scenarios),
            )
    return list(seen.values())


@router.get("/memory", response_model=list[MemoryRecord])
async def memory() -> list[MemoryRecord]:
    return memory_store.list()


@router.get("/metrics", response_model=PlatformMetrics)
async def metrics() -> PlatformMetrics:
    return orchestrator.metrics()
