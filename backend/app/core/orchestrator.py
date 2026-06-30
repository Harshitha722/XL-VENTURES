"""
DecisionMesh Orchestrator — fully LLM-driven intelligence pipeline.

Pipeline order:
  0. Meaningfulness guard (LLM) — reject garbage input early
  1. LLM Domain Detection
  2. RAG evidence retrieval
  3. LLM Agent Planning
  4. Parallel LLM Agent execution
  5. LLM Business Reasoning
  6. LLM Scenario Simulation
  7. LLM Devil's Advocate Critique
  8. Confidence scoring
  9. LLM Recommendation Synthesis
  10. Audit + Memory logging
"""

from uuid import UUID

from fastapi import HTTPException

from app.agents.factory import (
    RuntimeAgentRegistry,
    _check_meaningfulness,
    llm_detect_domain,
    llm_plan_agents,
)
from app.audit.store import audit_store
from app.memory.store import memory_store
from app.models.schemas import (
    AnalysisRequest,
    AuditEvent,
    CustomerOutcomeRecord,
    CustomerOutcomeRequest,
    CustomerOutcomeStatus,
    DecisionReport,
    PlatformMetrics,
    Recommendation,
    ReviewDecision,
    ReviewRequest,
    ReviewStatus,
)
from app.rag.hybrid import HybridRAG
from app.reasoning.confidence import ConfidenceEngine
from app.reasoning.devils_advocate import DevilsAdvocateAgent
from app.reasoning.engine import BusinessReasoningEngine
from app.reasoning.synthesizer import RecommendationSynthesizer
from app.simulation.simulator import ScenarioSimulator


_REVIEW_STATUS = {
    ReviewDecision.approve: ReviewStatus.approved,
    ReviewDecision.reject: ReviewStatus.rejected,
    ReviewDecision.override: ReviewStatus.overridden,
    ReviewDecision.delegate: ReviewStatus.delegated,
    ReviewDecision.escalate: ReviewStatus.escalated,
    ReviewDecision.request_information: ReviewStatus.information_requested,
}


def _find_recommendation(
    report: DecisionReport | None,
    recommendation_title: str | None,
) -> Recommendation | None:
    if not report or not report.recommendations:
        return None
    if recommendation_title:
        for recommendation in report.recommendations:
            if recommendation.title == recommendation_title:
                return recommendation
    return report.recommendations[0]


def _summarize_outcome(
    request: CustomerOutcomeRequest,
    recommended_action: str | None,
) -> tuple[str, list[str]]:
    reason = request.reason.strip() or "No outcome reason provided"
    blockers = request.blockers or ([reason] if reason else [])
    blocker_text = ", ".join(blockers) if blockers else "unknown buying blocker"
    action = recommended_action or "the recommended next best action"

    if request.outcome == CustomerOutcomeStatus.won:
        return (
            f"Won after applying {action}.",
            [
                "Reuse this action pattern for similar customers and domains.",
                "Capture the evidence that helped the buyer commit.",
                "Promote this playbook when confidence and buyer signals look similar.",
            ],
        )

    if request.outcome in {CustomerOutcomeStatus.lost, CustomerOutcomeStatus.no_decision}:
        label = "lost" if request.outcome == CustomerOutcomeStatus.lost else "no decision"
        return (
            f"Customer outcome was {label} because {reason}.",
            [
                f"Handle {blocker_text} earlier in qualification and recommendation ranking.",
                "Improve business playbooks with proof, pricing, onboarding, or risk evidence.",
                "Ask for a concrete follow-up owner before closing the conversation as no-buy.",
            ],
        )

    return (
        f"Deal still in progress; current blocker is {reason}.",
        [
            "Track the next customer commitment before marking the recommendation successful.",
            f"Keep {blocker_text} visible in the account plan.",
            "Update the outcome once the buyer commits, declines, or delays.",
        ],
    )


class DecisionMeshOrchestrator:
    def __init__(self) -> None:
        self.rag = HybridRAG()
        self.registry = RuntimeAgentRegistry()
        self.reasoner = BusinessReasoningEngine()
        self.simulator = ScenarioSimulator()
        self.critic = DevilsAdvocateAgent()
        self.confidence = ConfidenceEngine()
        self.synthesizer = RecommendationSynthesizer()
        self.reports: dict[UUID, DecisionReport] = {}
        self.customer_outcomes: list[CustomerOutcomeRecord] = []

    async def analyze(self, request: AnalysisRequest) -> DecisionReport:
        corpus = "\n".join([request.task, *[doc.text for doc in request.documents]])

        # ── Step 0: Meaningfulness guard ──────────────────────────────────────
        guard = await _check_meaningfulness(request.task, corpus)
        if not guard.is_meaningful:
            raise HTTPException(
                status_code=422,
                detail={
                    "error": "meaningless_input",
                    "message": (
                        "The provided input does not contain meaningful business, technical, "
                        "or operational content that can be analysed."
                    ),
                    "reason": guard.reason,
                    "hint": (
                        "Please provide a real decision task (e.g. 'Assess risk of expanding into "
                        "the EU market') and upload relevant evidence documents."
                    ),
                },
            )

        # ── Step 1 & 2: Domain Detection and RAG in parallel ──────────────────
        import asyncio
        
        def run_rag():
            self.rag.index(request.documents)
            return self.rag.retrieve(request.task, request.documents)
            
        domain, evidence = await asyncio.gather(
            llm_detect_domain(request.task, corpus),
            asyncio.to_thread(run_rag)
        )

        # ── Step 3: LLM Agent Planning and Memory Retrieval ───────────────────
        agents, memories = await asyncio.gather(
            llm_plan_agents(domain, request.task),
            asyncio.to_thread(memory_store.retrieve, domain.domain, request.task)
        )
        self.registry.register(agents)

        # ── Step 4: Parallel LLM Agent execution ──────────────────────────────
        findings = await self.registry.run(agents, evidence)

        # ── Step 5: LLM Business Reasoning ────────────────────────────────────
        reasoning = await self.reasoner.reason_async(findings, domain.domain, request.task, memories)

        # ── Step 6: LLM Scenario Simulation ───────────────────────────────────
        scenarios = await self.simulator.simulate_async(domain.domain, request.task, reasoning, memories)

        # ── Step 7: LLM Devil's Advocate Critique ─────────────────────────────
        critique = await self.critic.critique_async(reasoning, scenarios)

        # ── Step 8: Confidence scoring ────────────────────────────────────────
        confidence = self.confidence.score(evidence, findings, critique, len(memories))

        # ── Step 9: LLM Recommendation Synthesis ──────────────────────────────
        recommendations = await self.synthesizer.synthesize_async(
            reasoning, scenarios, critique, evidence, confidence,
            domain=domain.domain, task=request.task,
        )

        # ── Step 10: Persist report, audit, memory ────────────────────────────
        report = DecisionReport(
            domain=domain,
            agents=agents,
            findings=findings,
            reasoning=reasoning,
            scenarios=scenarios,
            critique=critique,
            recommendations=recommendations,
            confidence=confidence,
            mandatory_review=confidence.overall < 70,
        )
        self.reports[report.id] = report
        memory_store.remember_report(report, request.task)
        audit_store.append(
            AuditEvent(
                report_id=report.id,
                event_type="analysis_completed",
                ai_decision=report.model_dump(mode="json"),
                evidence=evidence,
            )
        )
        return report

    # ── Review, outcome, metrics — unchanged ──────────────────────────────────

    def review(self, request: ReviewRequest) -> AuditEvent:
        report = self.reports.get(request.report_id)
        payload = request.model_dump(mode="json")
        domain = report.domain.domain if report else "general"
        memory_store.remember_feedback(
            request.decision.value,
            payload,
            domain=domain,
            task="human review",
            source_report_id=request.report_id,
        )
        if report:
            status = _REVIEW_STATUS[request.decision]
            report.review_status = status
            report.review_history.append(payload)
            if request.decision == ReviewDecision.override and request.modifications:
                modification_summary = "; ".join(
                    f"{key}: {value}" for key, value in request.modifications.items()
                )
                for recommendation in report.recommendations:
                    recommendation.human_modifications.append(modification_summary)
        event = AuditEvent(
            report_id=request.report_id,
            event_type=f"human_{request.decision.value}",
            ai_decision=report.model_dump(mode="json") if report else {},
            human_decision=payload,
            changes=request.modifications,
            comments=request.comments,
        )
        return audit_store.append(event)

    def record_customer_outcome(self, request: CustomerOutcomeRequest) -> CustomerOutcomeRecord:
        report = self.reports.get(request.report_id) if request.report_id else None
        recommendation = _find_recommendation(report, request.recommendation_title)
        recommended_action = None
        if recommendation:
            recommended_action = recommendation.next_best_action or recommendation.action
        domain = request.domain or (report.domain.domain if report else "general")
        learning_summary, improvement_insights = _summarize_outcome(request, recommended_action)
        record = CustomerOutcomeRecord(
            report_id=request.report_id,
            recommendation_title=request.recommendation_title,
            recommended_action=recommended_action,
            customer_id=request.customer_id,
            customer_name=request.customer_name,
            domain=domain,
            outcome=request.outcome,
            reason=request.reason.strip() or "No outcome reason provided",
            feedback=request.feedback.strip(),
            blockers=request.blockers,
            deal_value=request.deal_value,
            next_follow_up=request.next_follow_up,
            learning_summary=learning_summary,
            improvement_insights=improvement_insights,
            source=request.source,
        )
        self.customer_outcomes.append(record)
        memory_store.remember_customer_outcome(record)
        audit_store.append(
            AuditEvent(
                report_id=request.report_id,
                event_type=f"customer_outcome_{record.outcome.value}",
                ai_decision={
                    "recommendation": recommendation.model_dump(mode="json") if recommendation else {}
                },
                human_decision=record.model_dump(mode="json"),
                changes={
                    "learning_summary": learning_summary,
                    "improvement_insights": improvement_insights,
                },
                comments=record.feedback or record.reason,
            )
        )
        return record

    def list_customer_outcomes(self) -> list[CustomerOutcomeRecord]:
        return self.customer_outcomes[:]

    def get_report(self, report_id: UUID) -> DecisionReport | None:
        return self.reports.get(report_id)

    def list_reports(self) -> list[DecisionReport]:
        return list(self.reports.values())

    def metrics(self) -> PlatformMetrics:
        reports = self.list_reports()
        outcomes = self.list_customer_outcomes()
        won_deals = sum(1 for o in outcomes if o.outcome == CustomerOutcomeStatus.won)
        lost_deals = sum(1 for o in outcomes if o.outcome == CustomerOutcomeStatus.lost)
        no_decision_deals = sum(
            1 for o in outcomes if o.outcome == CustomerOutcomeStatus.no_decision
        )
        completed_outcomes = won_deals + lost_deals + no_decision_deals
        conversion_rate = round((won_deals / completed_outcomes) * 100) if completed_outcomes else 0
        return PlatformMetrics(
            reports=len(reports),
            audit_events=audit_store.count(),
            memory_records=memory_store.count(),
            # No YAML ontology — report the number of unique domains seen
            domains_available=len({r.domain.domain for r in reports}) or 0,
            mandatory_reviews=sum(1 for r in reports if r.mandatory_review),
            customer_outcomes=len(outcomes),
            won_deals=won_deals,
            lost_deals=lost_deals,
            no_decision_deals=no_decision_deals,
            deal_conversion_rate=conversion_rate,
        )


orchestrator = DecisionMeshOrchestrator()
