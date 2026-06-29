"""
LLM-driven Scenario Simulator.
Replaces template expansion from YAML scenario_templates with a real LLM call.
"""

from __future__ import annotations

from pydantic import BaseModel, Field
from pydantic_ai import Agent

from app.agents.factory import _model
from app.models.schemas import MemoryRecord, ReasoningResult, Scenario


class _ScenarioOutput(BaseModel):
    title: str = Field(description="Short descriptive scenario title")
    assumptions: list[str] = Field(description="2-3 key assumptions for this scenario")
    actions: list[str] = Field(description="3-5 concrete, ordered action steps")
    expected_outcomes: list[str] = Field(description="2-3 expected outcomes if actions are executed")
    risks: list[str] = Field(description="2-3 risks specific to this scenario")
    success_metrics: list[str] = Field(description="2-3 measurable success metrics")
    confidence: float = Field(ge=0.0, le=1.0, description="Confidence this scenario leads to success")
    rank: int = Field(ge=1, description="Rank among all scenarios (1 = best)")


class _ScenarioListOutput(BaseModel):
    scenarios: list[_ScenarioOutput] = Field(description="3 to 5 ranked decision scenarios")


class ScenarioSimulator:
    def simulate(
        self,
        domain: str,
        task: str,
        reasoning: ReasoningResult,
        memories: list[MemoryRecord],
    ) -> list[Scenario]:
        import asyncio
        return asyncio.get_event_loop().run_until_complete(
            self._simulate_async(domain, task, reasoning, memories)
        )

    async def simulate_async(
        self,
        domain: str,
        task: str,
        reasoning: ReasoningResult,
        memories: list[MemoryRecord],
    ) -> list[Scenario]:
        return await self._simulate_async(domain, task, reasoning, memories)

    async def _simulate_async(
        self,
        domain: str,
        task: str,
        reasoning: ReasoningResult,
        memories: list[MemoryRecord],
    ) -> list[Scenario]:
        agent: Agent[None, _ScenarioListOutput] = Agent(
            _model(),
            output_type=_ScenarioListOutput,
            system_prompt=(
                "You are a decision scenario simulator for an enterprise intelligence platform. "
                "Given a business domain, task, and reasoning results, generate 3–5 realistic, "
                "ranked decision scenarios that a business team could actually execute.\n\n"
                "Each scenario should represent a distinct strategic pathway:\n"
                "- Scenario 1: Conservative / low-regret action\n"
                "- Scenario 2: Balanced optimisation\n"
                "- Scenario 3: Aggressive / high-upside action\n"
                "- Additional scenarios: niche or hybrid pathways if relevant\n\n"
                "Actions must be concrete and domain-specific — not generic placeholders. "
                "Rank 1 = highest recommended scenario. "
                "Confidence must reflect realistic probability of success given the evidence."
            ),
        )

        memory_ctx = ""
        if memories:
            memory_ctx = "\nHistorical outcomes:\n" + "\n".join(
                f"- {m.summary}" for m in memories[:3]
            )

        prompt = (
            f"Domain: {domain}\n"
            f"Task: {task[:400]}\n\n"
            f"Identified risks: {'; '.join(reasoning.risks[:5])}\n"
            f"Identified opportunities: {'; '.join(reasoning.opportunities[:5])}\n"
            f"Missing information: {'; '.join(reasoning.missing_information[:4])}\n"
            f"Business goals: {'; '.join(reasoning.business_goals[:4])}"
            f"{memory_ctx}"
        )

        try:
            result = await agent.run(prompt)
            raw = result.output.scenarios
            return [
                Scenario(
                    title=s.title,
                    assumptions=s.assumptions,
                    actions=s.actions,
                    expected_outcomes=s.expected_outcomes,
                    risks=s.risks,
                    success_metrics=s.success_metrics,
                    confidence=round(s.confidence, 2),
                    rank=idx + 1,
                )
                for idx, s in enumerate(sorted(raw, key=lambda x: x.rank))
            ]
        except Exception:
            # Fallback scenarios derived from reasoning
            fallback_scenarios = [
                {
                    "title": "Conservative evidence-led action",
                    "actions": [
                        "Collect and validate missing evidence before committing",
                        "Assign clear owner and timeline for each identified risk",
                        "Execute the lowest-regret mitigation steps first",
                    ],
                    "confidence": 0.72,
                },
                {
                    "title": "Balanced opportunity optimisation",
                    "actions": [
                        f"Prioritise top opportunity: {reasoning.opportunities[0] if reasoning.opportunities else 'key business opportunity'}",
                        "Mitigate the highest-impact risk in parallel",
                        "Set a 14-day review checkpoint with measurable success metrics",
                    ],
                    "confidence": 0.64,
                },
                {
                    "title": "Accelerated goal delivery",
                    "actions": [
                        f"Commit resources to: {reasoning.business_goals[0] if reasoning.business_goals else 'primary business goal'}",
                        "Escalate blockers to decision authority immediately",
                        "Track daily against agreed success metrics",
                    ],
                    "confidence": 0.54,
                },
            ]
            return [
                Scenario(
                    title=s["title"],
                    assumptions=reasoning.assumptions[:2],
                    actions=s["actions"],
                    expected_outcomes=["Improved decision clarity", "Reduced unmanaged risk"],
                    risks=reasoning.risks[:2],
                    success_metrics=["Decision executed on time", "Measurable business impact recorded"],
                    confidence=s["confidence"],
                    rank=idx + 1,
                )
                for idx, s in enumerate(fallback_scenarios)
            ]
