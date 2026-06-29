"""
LLM-driven Devil's Advocate Critique Agent.
Replaces 4 hardcoded criticism strings with a real LLM call.
"""

from __future__ import annotations

from pydantic import BaseModel, Field
from pydantic_ai import Agent

from app.agents.factory import _model
from app.models.schemas import Critique, ReasoningResult, Scenario


class _CritiqueOutput(BaseModel):
    criticisms: list[str] = Field(
        description="4-6 specific, evidence-grounded criticisms of the reasoning and proposed scenarios"
    )
    missing_evidence: list[str] = Field(
        description="3-5 specific pieces of evidence that are missing and would change the outcome"
    )
    alternative_actions: list[str] = Field(
        description="3-4 alternative actions not considered in the main scenarios"
    )
    uncertainty: float = Field(
        ge=0.0, le=1.0,
        description="Overall uncertainty level (0=very certain, 1=highly uncertain)"
    )


class DevilsAdvocateAgent:
    def critique(self, reasoning: ReasoningResult, scenarios: list[Scenario]) -> Critique:
        import asyncio
        return asyncio.get_event_loop().run_until_complete(
            self._critique_async(reasoning, scenarios)
        )

    async def critique_async(self, reasoning: ReasoningResult, scenarios: list[Scenario]) -> Critique:
        return await self._critique_async(reasoning, scenarios)

    async def _critique_async(self, reasoning: ReasoningResult, scenarios: list[Scenario]) -> Critique:
        agent: Agent[None, _CritiqueOutput] = Agent(
            _model(),
            output_type=_CritiqueOutput,
            system_prompt=(
                "You are the Devil's Advocate agent for an enterprise decision intelligence platform. "
                "Your role is to rigorously challenge the reasoning and proposed scenarios BEFORE "
                "they become recommendations.\n\n"
                "You must:\n"
                "1. Identify specific weaknesses in the reasoning — not generic disclaimers\n"
                "2. Challenge assumptions that may not hold in practice\n"
                "3. Point out missing evidence that could completely change the recommendation\n"
                "4. Propose alternative actions that the main analysis missed\n"
                "5. Estimate the overall uncertainty honestly\n\n"
                "Be specific and critical. Generic phrases like 'more data may be needed' are NOT acceptable. "
                "Your criticisms must reference the actual content of the reasoning and scenarios provided."
            ),
        )

        scenarios_text = "\n".join(
            f"Scenario {s.rank} ({s.title}, confidence={s.confidence}): "
            f"Actions: {'; '.join(s.actions[:3])}"
            for s in scenarios[:4]
        )

        prompt = (
            f"Reasoning to critique:\n"
            f"- Risks: {'; '.join(reasoning.risks[:5])}\n"
            f"- Opportunities: {'; '.join(reasoning.opportunities[:4])}\n"
            f"- Missing info: {'; '.join(reasoning.missing_information[:4])}\n"
            f"- Assumptions: {'; '.join(reasoning.assumptions[:3])}\n\n"
            f"Scenarios to critique:\n{scenarios_text}"
        )

        try:
            result = await agent.run(prompt)
            c = result.output
            return Critique(
                criticisms=c.criticisms,
                missing_evidence=c.missing_evidence,
                alternative_actions=c.alternative_actions,
                uncertainty=round(c.uncertainty, 2),
            )
        except Exception:
            # Fallback critique derived from reasoning
            uncertainty = 0.28
            if reasoning.missing_information:
                uncertainty = min(0.70, uncertainty + len(reasoning.missing_information) * 0.05)
            return Critique(
                criticisms=[
                    "Reasoning quality depends on the completeness of uploaded evidence.",
                    "Scenario confidence scores may be overstated without historical validation.",
                    f"Missing information items ({len(reasoning.missing_information)}) represent gaps "
                    "that could materially change the recommendation.",
                    "Alternative explanations for the identified risks have not been independently verified.",
                ],
                missing_evidence=reasoning.missing_information[:5],
                alternative_actions=[s.actions[0] for s in scenarios if s.actions][:3],
                uncertainty=round(min(0.75, uncertainty), 2),
            )
