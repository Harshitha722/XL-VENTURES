from datetime import UTC, datetime
from enum import StrEnum
from typing import Any
from uuid import UUID, uuid4

from pydantic import BaseModel, Field


class SourceType(StrEnum):
    pdf = "pdf"
    email = "email"
    transcript = "transcript"
    contract = "contract"
    crm = "crm"
    conversation = "conversation"
    knowledge_article = "knowledge_article"
    customer_history = "customer_history"
    other = "other"


class ReviewDecision(StrEnum):
    approve = "approve"
    reject = "reject"
    override = "override"
    delegate = "delegate"
    escalate = "escalate"
    request_information = "request_information"


class ReviewStatus(StrEnum):
    pending = "pending"
    approved = "approved"
    rejected = "rejected"
    overridden = "overridden"
    delegated = "delegated"
    escalated = "escalated"
    information_requested = "information_requested"


class Priority(StrEnum):
    high = "HIGH"
    medium = "MEDIUM"
    low = "LOW"


class MemoryType(StrEnum):
    short_term = "short_term"
    long_term = "long_term"
    semantic = "semantic"
    episodic = "episodic"
    feedback = "feedback"
    customer_outcome = "customer_outcome"


class CustomerOutcomeStatus(StrEnum):
    won = "won"
    lost = "lost"
    no_decision = "no_decision"
    in_progress = "in_progress"


class Evidence(BaseModel):
    source_id: str
    source_type: SourceType
    excerpt: str
    relevance: float = Field(ge=0, le=1)
    metadata: dict[str, Any] = Field(default_factory=dict)


class IngestedDocument(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    source_type: SourceType = SourceType.other
    title: str
    text: str
    metadata: dict[str, Any] = Field(default_factory=dict)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class DomainDetection(BaseModel):
    domain: str
    confidence: float = Field(ge=0, le=1)
    description: str
    business_goals: list[str]
    recommended_capabilities: list[str]
    matched_ontology: str = "general"
    signals: dict[str, float] = Field(default_factory=dict)


class AgentSpec(BaseModel):
    name: str
    domain: str
    capability: str
    objective: str
    tools: list[str]
    priority: int = Field(default=3, ge=1, le=5)
    evidence_requirements: list[str] = Field(default_factory=list)
    guardrails: list[str] = Field(default_factory=list)


class AgentFinding(BaseModel):
    agent_name: str
    capability: str
    findings: list[str]
    risks: list[str] = Field(default_factory=list)
    opportunities: list[str] = Field(default_factory=list)
    missing_information: list[str] = Field(default_factory=list)
    evidence: list[Evidence] = Field(default_factory=list)
    confidence: float = Field(ge=0, le=1)


class ReasoningResult(BaseModel):
    risks: list[str]
    opportunities: list[str]
    missing_information: list[str]
    assumptions: list[str]
    dependencies: list[str]
    business_goals: list[str]


class Scenario(BaseModel):
    title: str
    assumptions: list[str]
    actions: list[str]
    expected_outcomes: list[str]
    risks: list[str]
    success_metrics: list[str]
    confidence: float = Field(ge=0, le=1)
    rank: int


class Critique(BaseModel):
    criticisms: list[str]
    missing_evidence: list[str]
    alternative_actions: list[str]
    uncertainty: float = Field(ge=0, le=1)


class Recommendation(BaseModel):
    title: str
    action: str
    next_best_action: str = "Execute the highest-confidence customer conversion step."
    conversion_goal: str = "Move the customer toward a measurable buying decision."
    deal_stage: str = "decision"
    objection_response: str = "Resolve the strongest buying blocker with evidence and a clear next step."
    success_signal: str = "Customer commits to a next step, purchase decision, or closed deal."
    rationale: str
    evidence: list[Evidence]
    confidence: int = Field(ge=0, le=100)
    impact: str
    priority: Priority
    owner: str
    timeline: str
    why: str
    scenarios_considered: list[str]
    critiques: list[str]
    human_modifications: list[str] = Field(default_factory=list)


class CustomerOutcomeRequest(BaseModel):
    report_id: UUID | None = None
    recommendation_title: str | None = None
    customer_id: str | None = None
    customer_name: str = "Unknown customer"
    domain: str | None = None
    outcome: CustomerOutcomeStatus
    reason: str = Field(default="", description="Why the customer bought, did not buy, or delayed.")
    feedback: str = Field(default="", description="Human notes from sales, success, or business teams.")
    blockers: list[str] = Field(default_factory=list)
    deal_value: float | None = Field(default=None, ge=0)
    next_follow_up: str | None = None
    source: str = "workspace"


class CustomerOutcomeRecord(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    report_id: UUID | None = None
    recommendation_title: str | None = None
    recommended_action: str | None = None
    customer_id: str | None = None
    customer_name: str
    domain: str
    outcome: CustomerOutcomeStatus
    reason: str
    feedback: str
    blockers: list[str] = Field(default_factory=list)
    deal_value: float | None = None
    next_follow_up: str | None = None
    learning_summary: str
    improvement_insights: list[str]
    source: str = "workspace"
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ConfidenceBreakdown(BaseModel):
    evidence_quality: int = Field(ge=0, le=100)
    reasoning_quality: int = Field(ge=0, le=100)
    agent_agreement: int = Field(ge=0, le=100)
    memory_matches: int = Field(ge=0, le=100)
    retrieval_quality: int = Field(ge=0, le=100)
    overall: int = Field(ge=0, le=100)


class AnalysisRequest(BaseModel):
    documents: list[IngestedDocument]
    task: str
    user_context: dict[str, Any] = Field(default_factory=dict)


class DecisionReport(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    domain: DomainDetection
    agents: list[AgentSpec]
    findings: list[AgentFinding]
    reasoning: ReasoningResult
    scenarios: list[Scenario]
    critique: Critique
    recommendations: list[Recommendation]
    confidence: ConfidenceBreakdown
    mandatory_review: bool
    review_status: ReviewStatus = ReviewStatus.pending
    review_history: list[dict[str, Any]] = Field(default_factory=list)
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class ReviewRequest(BaseModel):
    report_id: UUID
    decision: ReviewDecision
    comments: str | None = None
    modifications: dict[str, Any] = Field(default_factory=dict)
    reviewer: str = "human-reviewer"


class AuditEvent(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    report_id: UUID | None = None
    event_type: str
    ai_decision: dict[str, Any] = Field(default_factory=dict)
    human_decision: dict[str, Any] = Field(default_factory=dict)
    changes: dict[str, Any] = Field(default_factory=dict)
    comments: str | None = None
    evidence: list[Evidence] = Field(default_factory=list)
    previous_hash: str | None = None
    event_hash: str | None = None
    timestamp: datetime = Field(default_factory=lambda: datetime.now(UTC))


class MemoryRecord(BaseModel):
    id: UUID = Field(default_factory=uuid4)
    memory_type: MemoryType
    domain: str
    task: str
    summary: str
    payload: dict[str, Any] = Field(default_factory=dict)
    source_report_id: UUID | None = None
    created_at: datetime = Field(default_factory=lambda: datetime.now(UTC))


class DomainCatalogItem(BaseModel):
    domain: str
    description: str
    business_goals: list[str]
    kpis: list[str]
    risks: list[str]
    opportunities: list[str]
    success_metrics: list[str]
    agent_capabilities: list[str]
    tools: list[str]
    scenario_count: int


class PlatformMetrics(BaseModel):
    reports: int
    audit_events: int
    memory_records: int
    domains_available: int
    mandatory_reviews: int
    customer_outcomes: int = 0
    won_deals: int = 0
    lost_deals: int = 0
    no_decision_deals: int = 0
    deal_conversion_rate: int = Field(default=0, ge=0, le=100)
