import pytest

from app.core.orchestrator import DecisionMeshOrchestrator
from app.models.schemas import (
    AnalysisRequest,
    CustomerOutcomeRequest,
    CustomerOutcomeStatus,
    IngestedDocument,
    ReviewDecision,
    ReviewRequest,
    SourceType,
)


@pytest.mark.asyncio
async def test_dynamic_analysis_generates_report():
    orchestrator = DecisionMeshOrchestrator()
    request = AnalysisRequest(
        task="Assess finance compliance and portfolio risk",
        documents=[
            IngestedDocument(
                title="committee notes",
                source_type=SourceType.transcript,
                text="The investment committee discussed portfolio exposure, fraud controls, compliance evidence, and risk mitigation.",
            )
        ],
    )

    report = await orchestrator.analyze(request)

    assert report.domain.domain == "finance"
    assert report.agents
    assert all(agent.name.endswith("Agent") for agent in report.agents)
    assert report.scenarios
    assert report.recommendations
    assert report.confidence.overall >= 0
    assert report.confidence.overall <= 100


@pytest.mark.asyncio
async def test_human_review_updates_report_and_audit():
    orchestrator = DecisionMeshOrchestrator()
    request = AnalysisRequest(
        task="Assess manufacturing quality risk and procurement resilience",
        documents=[
            IngestedDocument(
                title="plant notes",
                source_type=SourceType.transcript,
                text="Equipment failure, defect rate, quality containment, procurement delay, and production plan risk were discussed.",
            )
        ],
    )
    report = await orchestrator.analyze(request)
    event = orchestrator.review(
        ReviewRequest(
            report_id=report.id,
            decision=ReviewDecision.override,
            comments="Adjusted owner and timing.",
            modifications={"owner": "Operations VP", "timeline": "48 hours"},
        )
    )

    updated = orchestrator.get_report(report.id)
    assert updated is not None
    assert updated.review_status == "overridden"
    assert updated.review_history
    assert updated.recommendations[0].human_modifications
    assert event.event_hash


@pytest.mark.asyncio
async def test_customer_outcome_feedback_updates_learning_loop():
    orchestrator = DecisionMeshOrchestrator()
    request = AnalysisRequest(
        task="Recommend the next best action to convert a qualified customer into a completed deal",
        documents=[
            IngestedDocument(
                title="sales call",
                source_type=SourceType.transcript,
                text=(
                    "The customer likes the product but has a price objection, delayed buyer "
                    "commitment, unclear economic buyer alignment, and needs ROI proof."
                ),
            )
        ],
    )

    report = await orchestrator.analyze(request)
    recommendation = report.recommendations[0]
    outcome = orchestrator.record_customer_outcome(
        CustomerOutcomeRequest(
            report_id=report.id,
            recommendation_title=recommendation.title,
            customer_name="Acme Finance",
            outcome=CustomerOutcomeStatus.lost,
            reason="Budget owner did not approve pricing",
            blockers=["pricing", "economic buyer"],
            feedback="Need stronger ROI proof before final proposal.",
        )
    )

    assert recommendation.next_best_action
    assert recommendation.conversion_goal
    assert outcome.outcome == CustomerOutcomeStatus.lost
    assert outcome.recommended_action == recommendation.next_best_action
    assert "pricing" in outcome.improvement_insights[0]
    assert orchestrator.metrics().lost_deals == 1
    assert orchestrator.metrics().customer_outcomes == 1
