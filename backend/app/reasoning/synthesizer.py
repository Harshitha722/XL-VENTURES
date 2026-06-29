from app.models.schemas import ConfidenceBreakdown, Critique, Evidence, Priority, Recommendation, ReasoningResult, Scenario


def _conversion_goal(reasoning: ReasoningResult) -> str:
    goals = " ".join(reasoning.business_goals + reasoning.opportunities).lower()
    if any(term in goals for term in ["renewal", "retention", "adoption"]):
        return "Protect the account, prove customer value, and move the buyer toward renewal or expansion."
    if any(term in goals for term in ["revenue", "customer", "sales", "promotion", "expansion"]):
        return "Convert customer interest into a committed purchase step and measurable revenue outcome."
    return "Move the stakeholder from analysis to a committed decision with a clear owner and timeline."


def _deal_stage(index: int, confidence: ConfidenceBreakdown) -> str:
    if confidence.overall >= 78 and index == 0:
        return "close_ready"
    if index == 0:
        return "active_opportunity"
    if index == 1:
        return "objection_handling"
    return "nurture_or_recovery"


def _objection_response(reasoning: ReasoningResult, critique: Critique) -> str:
    missing = reasoning.missing_information[:2] or critique.missing_evidence[:2]
    if missing:
        return "Resolve buyer hesitation by collecting " + ", ".join(missing) + " and tying the response to business value."
    if critique.criticisms:
        return "Address the strongest uncertainty before asking for commitment: " + critique.criticisms[0]
    return "Confirm the customer's decision criteria, show value evidence, and ask for the next commitment."


def _success_signal(scenario: Scenario) -> str:
    metric = scenario.success_metrics[0] if scenario.success_metrics else "measured customer commitment"
    return f"Customer accepts the next step and {metric.lower()} improves."


class RecommendationSynthesizer:
    def synthesize(
        self,
        reasoning: ReasoningResult,
        scenarios: list[Scenario],
        critique: Critique,
        evidence: list[Evidence],
        confidence: ConfidenceBreakdown,
    ) -> list[Recommendation]:
        priorities = [Priority.high, Priority.medium, Priority.low]
        recommendations: list[Recommendation] = []
        conversion_goal = _conversion_goal(reasoning)
        objection_response = _objection_response(reasoning, critique)
        for index, scenario in enumerate(scenarios[:3]):
            priority = priorities[min(index, len(priorities) - 1)]
            action = "; ".join(scenario.actions[:3])
            next_best_action = scenario.actions[0] if scenario.actions else "Confirm buyer commitment and assign follow-up owner"
            recommendations.append(
                Recommendation(
                    title=scenario.title,
                    action=action,
                    next_best_action=next_best_action,
                    conversion_goal=conversion_goal,
                    deal_stage=_deal_stage(index, confidence),
                    objection_response=objection_response,
                    success_signal=_success_signal(scenario),
                    rationale=(
                        "Prioritizes the action most likely to convert customer intent into a committed "
                        "deal outcome while preserving evidence, confidence, critique, and human review."
                    ),
                    evidence=evidence[:4],
                    confidence=max(0, min(100, confidence.overall - index * 6)),
                    impact="High" if priority == Priority.high else "Medium",
                    priority=priority,
                    owner="Business decision owner",
                    timeline="Next 7-14 days" if priority == Priority.high else "Next 30 days",
                    why=(
                        "This action has the strongest fit with available evidence, conversion goals, "
                        "scenario ranking, and known buyer objections."
                    ),
                    scenarios_considered=[item.title for item in scenarios],
                    critiques=critique.criticisms,
                    human_modifications=[],
                )
            )
        if not recommendations:
            recommendations.append(
                Recommendation(
                    title="Request more information",
                    action="Collect missing evidence and rerun analysis",
                    next_best_action="Ask the customer or account owner for the missing buying criteria",
                    conversion_goal=conversion_goal,
                    deal_stage="discovery_gap",
                    objection_response=objection_response,
                    success_signal="Missing buying evidence is collected before the next recommendation.",
                    rationale="The system cannot produce a reliable recommendation without enough evidence.",
                    evidence=evidence,
                    confidence=max(20, confidence.overall),
                    impact="Medium",
                    priority=Priority.high,
                    owner="Human reviewer",
                    timeline="Before decision execution",
                    why="Missing evidence prevents accountable action and can hide why a customer will not buy.",
                    scenarios_considered=[],
                    critiques=critique.criticisms,
                )
            )
        return recommendations
