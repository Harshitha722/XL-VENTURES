"""
LLM-driven Business Reasoning Engine.
Replaces the static set-union of YAML risks/opportunities with a real LLM call.
"""

from __future__ import annotations

from pydantic import BaseModel, Field
from pydantic_ai import Agent

from app.agents.factory import _model
from app.models.schemas import AgentFinding, MemoryRecord, ReasoningResult


class _ReasoningOutput(BaseModel):
    risks: list[str] = Field(description="5-8 concrete, evidence-grounded business risks")
    opportunities: list[str] = Field(description="4-6 actionable business opportunities")
    missing_information: list[str] = Field(description="3-5 key pieces of evidence that are missing")
    assumptions: list[str] = Field(description="3-4 assumptions the analysis is making")
    dependencies: list[str] = Field(description="3-4 dependencies that must be in place")
    business_goals: list[str] = Field(description="3-5 business goals this decision serves")


class BusinessReasoningEngine:
    def reason(
        self,
        findings: list[AgentFinding],
        domain: str,
        task: str,
        memories: list[MemoryRecord],
    ) -> ReasoningResult:
        import asyncio
        return asyncio.get_event_loop().run_until_complete(
            self._reason_async(findings, domain, task, memories)
        )

    async def reason_async(
        self,
        findings: list[AgentFinding],
        domain: str,
        task: str,
        memories: list[MemoryRecord],
    ) -> ReasoningResult:
        return await self._reason_async(findings, domain, task, memories)

    async def _reason_async(
        self,
        findings: list[AgentFinding],
        domain: str,
        task: str,
        memories: list[MemoryRecord],
    ) -> ReasoningResult:
        agent: Agent[None, _ReasoningOutput] = Agent(
            _model(),
            output_type=_ReasoningOutput,
            system_prompt=(
                "You are the Business Reasoning Engine for an enterprise decision intelligence platform. "
                "You receive findings from multiple specialist AI agents and synthesise them into "
                "a coherent reasoning result.\n\n"
                "Your output must:\n"
                "- List the most critical RISKS with specific business impact\n"
                "- Identify genuine OPPORTUNITIES (not generic platitudes)\n"
                "- Surface MISSING INFORMATION that would change the recommendation\n"
                "- State key ASSUMPTIONS being made\n"
                "- Identify DEPENDENCIES that must be true for the recommendations to work\n"
                "- Clarify the BUSINESS GOALS this decision is trying to serve\n\n"
                "Be specific and grounded in the actual findings provided. "
                "Do not repeat generic industry phrases."
            ),
        )

        findings_text = "\n\n".join(
            f"=== {f.agent_name} (capability: {f.capability}, confidence: {f.confidence:.2f}) ===\n"
            f"Findings: {'; '.join(f.findings[:3])}\n"
            f"Risks: {'; '.join(f.risks[:3])}\n"
            f"Opportunities: {'; '.join(f.opportunities[:3])}\n"
            f"Missing info: {'; '.join(f.missing_information[:3])}"
            for f in findings
        )

        memory_text = ""
        if memories:
            memory_text = "\n\nRelevant historical context:\n" + "\n".join(
                f"- [{m.memory_type}] {m.summary}" for m in memories[:4]
            )

        prompt = (
            f"Domain: {domain}\n"
            f"Task: {task[:400]}\n\n"
            f"Agent Findings:\n{findings_text}"
            f"{memory_text}"
        )

        try:
            result = await agent.run(prompt)
            r = result.output
            return ReasoningResult(
                risks=r.risks,
                opportunities=r.opportunities,
                missing_information=r.missing_information,
                assumptions=r.assumptions,
                dependencies=r.dependencies,
                business_goals=r.business_goals,
            )
        except Exception as exc:
            # Fallback: merge agent findings manually
            risks = list({risk for f in findings for risk in f.risks})[:6]
            opportunities = list({opp for f in findings for opp in f.opportunities})[:5]
            missing = list({m for f in findings for m in f.missing_information})[:4]
            return ReasoningResult(
                risks=risks or ["LLM reasoning unavailable — review agent findings directly"],
                opportunities=opportunities or ["Proceed with human review of available evidence"],
                missing_information=missing or ["Additional evidence may improve confidence"],
                assumptions=[
                    "Available documents are representative of the current business context.",
                    "Human reviewers will validate business impact before final execution.",
                    f"Reasoning fallback active: {exc!s:.80}",
                ],
                dependencies=["Reliable source data", "Human review authority", "Outcome measurement"],
                business_goals=["Improve decision quality", "Reduce risk exposure", "Drive measurable outcomes"],
            )
