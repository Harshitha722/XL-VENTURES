"""
LLM-driven Domain Detector, Planner Agent, and Runtime Agent Registry.
Replaces all static YAML-ontology-driven logic with real pydantic_ai LLM calls.
"""

from __future__ import annotations

import asyncio
import os
from typing import Annotated

from pydantic import BaseModel, Field
from pydantic_ai import Agent

from app.models.schemas import AgentFinding, AgentSpec, DomainDetection, Evidence


# ─────────────────────────────────────────────────────────────────────────────
# Shared model string  (reads env so tests can override)
# ─────────────────────────────────────────────────────────────────────────────
def _model() -> str:
    return os.environ.get("GEMINI_MODEL", "google:gemini-1.5-flash")


# ─────────────────────────────────────────────────────────────────────────────
# Step 0: Meaningfulness guard — detect garbage / random input FIRST
# ─────────────────────────────────────────────────────────────────────────────
class _MeaningfulnessResult(BaseModel):
    is_meaningful: bool
    reason: str  # one-sentence explanation shown in the UI


async def _check_meaningfulness(task: str, text: str) -> _MeaningfulnessResult:
    """
    Ask the LLM to decide whether the user input is meaningful enough
    to warrant a decision analysis.  Random strings, gibberish, test
    keyboard-mashing, lorem-ipsum, single words with no context, or
    purely personal/social content all count as 'not meaningful'.
    """
    agent: Agent[None, _MeaningfulnessResult] = Agent(
        _model(),
        output_type=_MeaningfulnessResult,
        system_prompt=(
            "You are an input validation agent for an enterprise decision intelligence platform. "
            "Your ONLY job is to decide whether the supplied task description and evidence text "
            "contain meaningful business, technical, medical, legal, financial, or operational content "
            "that justifies a full decision analysis.\n\n"
            "Mark is_meaningful=false when input is:\n"
            "- Random characters, keyboard mashing (asdfjkl, qwerty, abc123…)\n"
            "- Pure gibberish or nonsense sentences with no real meaning\n"
            "- Trivial greetings, test messages ('hello', 'test', 'hi there')\n"
            "- Lorem ipsum or placeholder text\n"
            "- A single uncontextualised word or number\n"
            "- Purely personal/social content unrelated to any business decision\n\n"
            "Mark is_meaningful=true when input contains recognisable industry language, "
            "a business problem, a data set, a technical description, or a real decision scenario.\n\n"
            "Always return a single-sentence 'reason' explaining your verdict."
        ),
    )
    prompt = (
        f"Task: {task[:600]}\n\n"
        f"Evidence text (first 800 chars): {text[:800]}"
    )
    try:
        result = await agent.run(prompt)
        return result.output
    except Exception:
        # If LLM fails, optimistically allow the pipeline to continue
        return _MeaningfulnessResult(
            is_meaningful=True,
            reason="Validation unavailable — proceeding with analysis."
        )


# ─────────────────────────────────────────────────────────────────────────────
# Step 1: LLM Domain Detector
# ─────────────────────────────────────────────────────────────────────────────
class _LLMDomainResult(BaseModel):
    domain: str = Field(description="Short snake_case domain name, e.g. 'customer_success', 'healthcare', 'finance'")
    confidence: float = Field(ge=0.0, le=1.0, description="Detection confidence between 0 and 1")
    description: str = Field(description="One sentence describing what this domain covers")
    business_goals: list[str] = Field(description="3-5 key business goals for this domain")
    recommended_capabilities: list[str] = Field(
        description="4-6 snake_case agent capability names suited to this domain and task"
    )
    signals: dict[str, float] = Field(
        default_factory=dict,
        description="Key signal words found in the text mapped to their strength 0-1"
    )


async def llm_detect_domain(task: str, corpus: str) -> DomainDetection:
    """
    Uses the LLM to identify the business domain and recommend agent capabilities
    purely from the task description and evidence corpus.  No YAML files needed.
    """
    agent: Agent[None, _LLMDomainResult] = Agent(
        _model(),
        output_type=_LLMDomainResult,
        system_prompt=(
            "You are an expert domain detection agent for an enterprise decision intelligence platform. "
            "Given a task description and supporting evidence, identify:\n"
            "1. The primary business domain (e.g. customer_success, healthcare, finance, "
            "retail, manufacturing, insurance, education, legal, hr, supply_chain, cybersecurity, "
            "real_estate, marketing, operations, or another appropriate domain).\n"
            "2. Your confidence in this detection (0.0–1.0).\n"
            "3. A short description of what this domain involves.\n"
            "4. 3–5 concrete business goals applicable to this domain and task.\n"
            "5. 4–6 agent capability names in snake_case that would be most useful for this "
            "domain (e.g. risk_analysis, fraud_detection, customer_churn_prediction, "
            "compliance_review, inventory_optimisation, sentiment_analysis, etc.).\n"
            "6. Key domain-signal words you detected in the input and their strength.\n\n"
            "If the domain is unclear but the content is still business-relevant, "
            "use 'general' as the domain with 0.55 confidence."
        ),
    )
    prompt = (
        f"Task description: {task[:800]}\n\n"
        f"Evidence corpus (first 1500 chars): {corpus[:1500]}"
    )
    try:
        result = await agent.run(prompt)
        d = result.output
        return DomainDetection(
            domain=d.domain,
            confidence=round(d.confidence, 2),
            description=d.description,
            business_goals=d.business_goals,
            recommended_capabilities=d.recommended_capabilities,
            matched_ontology=d.domain,
            signals=d.signals,
        )
    except Exception as exc:
        # Graceful fallback
        return DomainDetection(
            domain="general",
            confidence=0.50,
            description=f"Domain detection failed ({exc!s:.80}); defaulting to general decision intelligence.",
            business_goals=["Improve decisions", "Reduce risk", "Drive business outcomes"],
            recommended_capabilities=["risk_analysis", "opportunity_analysis", "execution_planning"],
            matched_ontology="general",
            signals={},
        )


# ─────────────────────────────────────────────────────────────────────────────
# Step 2: LLM Planner Agent — designs the specialist agent squad
# ─────────────────────────────────────────────────────────────────────────────
class _AgentPlan(BaseModel):
    name: str = Field(description="PascalCase agent name ending in 'Agent', e.g. RiskAnalysisAgent")
    capability: str = Field(description="snake_case capability key, e.g. risk_analysis")
    objective: str = Field(description="One-sentence objective for this agent")
    tools: list[str] = Field(description="2-4 tool names this agent should use")
    priority: int = Field(ge=1, le=5, description="Priority 1=highest 5=lowest")


class _AgentPlanList(BaseModel):
    agents: list[_AgentPlan] = Field(description="3 to 6 specialist agents for this task")


async def llm_plan_agents(domain: DomainDetection, task: str) -> list[AgentSpec]:
    """
    Asks the LLM to design a bespoke set of specialist agents for the
    detected domain and task.  No capability list from YAML needed.
    """
    agent: Agent[None, _AgentPlanList] = Agent(
        _model(),
        output_type=_AgentPlanList,
        system_prompt=(
            "You are a multi-agent system architect for an enterprise decision intelligence platform. "
            "Given a detected business domain and a user task, design 3–6 specialist AI agents "
            "that together can analyse the evidence and produce reliable decision recommendations.\n\n"
            "Each agent must have:\n"
            "- A PascalCase name ending in 'Agent'\n"
            "- A snake_case capability key\n"
            "- A focused one-sentence objective\n"
            "- 2–4 relevant tools (choose from: hybrid_retrieval, memory_lookup, policy_lookup, "
            "scenario_simulation, risk_scorer, sentiment_analyser, compliance_checker, "
            "data_validator, market_intelligence, financial_modeller)\n"
            "- A priority score (1=must-run, 5=optional enrichment)\n\n"
            "Design agents that complement each other and cover the full decision space for the domain."
        ),
    )
    prompt = (
        f"Domain: {domain.domain} (confidence: {domain.confidence})\n"
        f"Domain description: {domain.description}\n"
        f"Business goals: {', '.join(domain.business_goals)}\n"
        f"Task: {task[:600]}\n"
        f"Recommended capability hints: {', '.join(domain.recommended_capabilities)}"
    )
    try:
        result = await agent.run(prompt)
        plans = result.output.agents
    except Exception:
        # Fallback: derive specs from domain.recommended_capabilities
        plans = [
            _AgentPlan(
                name="".join(p.capitalize() for p in cap.split("_")) + "Agent",
                capability=cap,
                objective=f"Evaluate {cap.replace('_', ' ')} for {domain.domain} decisions.",
                tools=["hybrid_retrieval", "memory_lookup"],
                priority=idx + 1,
            )
            for idx, cap in enumerate(domain.recommended_capabilities[:4])
        ]

    return [
        AgentSpec(
            name=plan.name,
            domain=domain.domain,
            capability=plan.capability,
            objective=plan.objective,
            tools=list(dict.fromkeys(plan.tools + ["hybrid_retrieval", "memory_lookup"])),
            priority=plan.priority,
            evidence_requirements=["retrieved_context", "memory", "human_review_policy"],
            guardrails=[
                "Do not make irreversible decisions without human approval.",
                "Surface missing evidence and confidence limits.",
                "Keep reasoning grounded in the provided evidence.",
            ],
        )
        for plan in plans
    ]


# ─────────────────────────────────────────────────────────────────────────────
# Step 3: Runtime Agent Registry — unchanged core, real LLM calls per agent
# ─────────────────────────────────────────────────────────────────────────────
class RuntimeAgentRegistry:
    def __init__(self) -> None:
        self._agents: dict[str, AgentSpec] = {}

    def register(self, specs: list[AgentSpec]) -> None:
        for spec in specs:
            self._agents[spec.name] = spec

    async def run(self, specs: list[AgentSpec], evidence: list[Evidence]) -> list[AgentFinding]:
        async def run_one(spec: AgentSpec) -> AgentFinding:
            agent: Agent[None, AgentFinding] = Agent(_model(), output_type=AgentFinding)
            evidence_text = "\n\n".join(
                f"[Source: {e.source_type} | Relevance: {e.relevance:.2f}]\n{e.excerpt}"
                for e in evidence[:5]
            )
            prompt = (
                f"You are {spec.name}.\n"
                f"Domain: {spec.domain}\n"
                f"Objective: {spec.objective}\n"
                f"Guardrails: {'; '.join(spec.guardrails)}\n\n"
                f"Analyse the evidence below and return your structured findings.\n"
                f"Be specific, evidence-grounded, and concise.\n\n"
                f"Evidence:\n{evidence_text}"
            )
            try:
                result = await agent.run(prompt)
                finding = result.output
                finding.agent_name = spec.name
                finding.capability = spec.capability
                finding.evidence = evidence[:3]
                return finding
            except Exception as exc:
                return AgentFinding(
                    agent_name=spec.name,
                    capability=spec.capability,
                    findings=[f"Agent {spec.name} could not complete analysis: {exc!s:.120}"],
                    risks=["LLM call failed — treat this agent's findings as unavailable"],
                    opportunities=[],
                    missing_information=["Re-run analysis with valid API credentials"],
                    evidence=evidence[:2],
                    confidence=0.0,
                )

        return list(await asyncio.gather(*[run_one(spec) for spec in specs]))
