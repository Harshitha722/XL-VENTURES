"""
LLM-driven Recommendation Synthesizer.
Replaces template-string logic with a real structured LLM call per recommendation.
"""

from __future__ import annotations

from pydantic import BaseModel, Field
from pydantic_ai import Agent

from app.agents.factory import _model
from app.models.schemas import (
    ConfidenceBreakdown,
    Critique,
    Evidence,
    Priority,
    Recommendation,
    ReasoningResult,
    Scenario,
)


class _RecommendationOutput(BaseModel):
    title: str = Field(description="Short, action-oriented recommendation title")
    action: str = Field(description="Full action description — what to do and how")
    next_best_action: str = Field(description="Single most important immediate action step")
    conversion_goal: str = Field(description="The business outcome this action is trying to achieve")
    deal_stage: str = Field(description="Current stage: e.g. discovery, objection_handling, close_ready, nurture")
    objection_response: str = Field(description="How to handle the main objection or blocker for this recommendation")
    success_signal: str = Field(description="How you will know this recommendation worked")
    rationale: str = Field(description="Why this is the right recommendation given the evidence and reasoning")
    why: str = Field(description="One-sentence plain-language explanation for a business audience")
    owner: str = Field(description="Role or team who should own this action")
    timeline: str = Field(description="Realistic execution timeline, e.g. 'Next 7 days' or 'Within 2 weeks'")
    impact: str = Field(description="Expected business impact: High, Medium, or Low")
    priority: str = Field(description="Priority level: HIGH, MEDIUM, or LOW")
    confidence: int = Field(ge=0, le=100, description="Confidence score 0-100")


class _RecommendationListOutput(BaseModel):
    recommendations: list[_RecommendationOutput] = Field(
        description="2 to 3 prioritised, actionable recommendations"
    )


class RecommendationSynthesizer:
    def synthesize(
        self,
        reasoning: ReasoningResult,
        scenarios: list[Scenario],
        critique: Critique,
        evidence: list[Evidence],
        confidence: ConfidenceBreakdown,
        domain: str = "general",
        task: str = "",
    ) -> list[Recommendation]:
        import asyncio
        return asyncio.get_event_loop().run_until_complete(
            self._synthesize_async(reasoning, scenarios, critique, evidence, confidence, domain, task)
        )

    async def synthesize_async(
        self,
        reasoning: ReasoningResult,
        scenarios: list[Scenario],
        critique: Critique,
        evidence: list[Evidence],
        confidence: ConfidenceBreakdown,
        domain: str = "general",
        task: str = "",
    ) -> list[Recommendation]:
        return await self._synthesize_async(
            reasoning, scenarios, critique, evidence, confidence, domain, task
        )

    async def _synthesize_async(
        self,
        reasoning: ReasoningResult,
        scenarios: list[Scenario],
        critique: Critique,
        evidence: list[Evidence],
        confidence: ConfidenceBreakdown,
        domain: str,
        task: str,
    ) -> list[Recommendation]:
        agent: Agent[None, _RecommendationListOutput] = Agent(
            _model(),
            output_type=_RecommendationListOutput,
            system_prompt=(
                "You are the Recommendation Synthesizer for an enterprise decision intelligence platform. "
                "You receive a complete picture: reasoning results, ranked scenarios, critique, "
                "evidence, and confidence scores. Your job is to produce 2–3 prioritised, "
                "actionable recommendations that a business team can execute.\n\n"
                "Requirements:\n"
                "- Each recommendation must be specific and grounded in the actual evidence provided\n"
                "- next_best_action must be the single most impactful immediate step\n"
                "- owner must be a real role (e.g. 'Account Executive', 'Risk Manager', 'CMO')\n"
                "- timeline must be concrete (e.g. 'Next 48 hours', 'By end of week')\n"
                "- confidence should reflect the evidence quality and critique uncertainty\n"
                "- Rank priority HIGH → MEDIUM → LOW across the 2-3 recommendations\n"
                "- Do NOT use generic corporate filler — be specific to the domain and task"
            ),
        )

        scenarios_text = "\n".join(
            f"[Rank {s.rank}] {s.title} (conf={s.confidence}): {'; '.join(s.actions[:3])}"
            for s in scenarios[:4]
        )

        evidence_excerpts = "\n".join(
            f"- [{e.source_type}] {e.excerpt[:200]}" for e in evidence[:4]
        )

        prompt = (
            f"Domain: {domain}\n"
            f"Task: {task[:300]}\n"
            f"Overall confidence: {confidence.overall}/100\n\n"
            f"Business goals: {'; '.join(reasoning.business_goals[:4])}\n"
            f"Top risks: {'; '.join(reasoning.risks[:4])}\n"
            f"Top opportunities: {'; '.join(reasoning.opportunities[:4])}\n"
            f"Missing info: {'; '.join(reasoning.missing_information[:3])}\n\n"
            f"Ranked scenarios:\n{scenarios_text}\n\n"
            f"Critique summary: {'; '.join(critique.criticisms[:3])}\n"
            f"Critique uncertainty: {critique.uncertainty}\n\n"
            f"Evidence excerpts:\n{evidence_excerpts}"
        )

        priority_map = {"HIGH": Priority.high, "MEDIUM": Priority.medium, "LOW": Priority.low}

        try:
            result = await agent.run(prompt)
            raw = result.output.recommendations
            recs = []
            for r in raw:
                recs.append(Recommendation(
                    title=r.title,
                    action=r.action,
                    next_best_action=r.next_best_action,
                    conversion_goal=r.conversion_goal,
                    deal_stage=r.deal_stage,
                    objection_response=r.objection_response,
                    success_signal=r.success_signal,
                    rationale=r.rationale,
                    why=r.why,
                    owner=r.owner,
                    timeline=r.timeline,
                    impact=r.impact,
                    priority=priority_map.get(r.priority.upper(), Priority.medium),
                    confidence=max(0, min(100, r.confidence)),
                    evidence=evidence[:4],
                    scenarios_considered=[s.title for s in scenarios],
                    critiques=critique.criticisms,
                    human_modifications=[],
                ))
            return recs or [self._fallback_rec(reasoning, scenarios, critique, evidence, confidence)]
        except Exception:
            return [self._fallback_rec(reasoning, scenarios, critique, evidence, confidence)]

    @staticmethod
    def _fallback_rec(
        reasoning: ReasoningResult,
        scenarios: list[Scenario],
        critique: Critique,
        evidence: list[Evidence],
        confidence: ConfidenceBreakdown,
    ) -> Recommendation:
        top_scenario = scenarios[0] if scenarios else None
        return Recommendation(
            title="Request additional evidence and rerun analysis",
            action="Collect the missing evidence items identified above, then rerun the analysis pipeline",
            next_best_action=(
                f"Collect: {reasoning.missing_information[0]}"
                if reasoning.missing_information
                else "Upload more evidence documents and rerun analysis"
            ),
            conversion_goal="Produce a reliable, evidence-grounded recommendation",
            deal_stage="evidence_gap",
            objection_response="The system cannot produce a reliable recommendation without sufficient evidence",
            success_signal="Missing evidence is collected and analysis confidence rises above 70",
            rationale="Insufficient evidence or LLM synthesis failure prevented a specific recommendation",
            why="More evidence is needed before committing to a course of action",
            owner="Human reviewer",
            timeline="Before next decision cycle",
            impact="High",
            priority=Priority.high,
            confidence=max(20, confidence.overall),
            evidence=evidence,
            scenarios_considered=[s.title for s in scenarios],
            critiques=critique.criticisms,
            human_modifications=[],
        )
