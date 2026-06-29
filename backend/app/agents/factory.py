from statistics import mean

from app.models.schemas import AgentFinding, AgentSpec, DomainDetection, Evidence
from app.ontology.engine import DomainOntology


def _agent_name(capability: str) -> str:
    return "".join(part.capitalize() for part in capability.split("_")) + "Agent"


def _capability_priority(capability: str, task: str) -> int:
    capability_terms = set(capability.replace("_", " ").split())
    task_terms = set(task.lower().split())
    signal = len(capability_terms & task_terms)
    if signal >= 2:
        return 1
    if signal == 1:
        return 2
    return 3


def generate_agents(
    domain: str,
    task: str,
    ontology: DomainOntology,
    detection: DomainDetection | None = None,
) -> list[AgentSpec]:
    capabilities = list(dict.fromkeys(ontology.agent_capabilities))
    if len(capabilities) < 3:
        capabilities.extend(["risk_analysis", "opportunity_analysis", "execution_planning"])
    selected = list(dict.fromkeys(capabilities))[:6]
    specs = [
        AgentSpec(
            name=_agent_name(capability),
            domain=domain,
            capability=capability,
            objective=f"Evaluate {capability.replace('_', ' ')} for {domain} decision-making.",
            tools=list(dict.fromkeys([*ontology.tools, "hybrid_retrieval", "memory_lookup"])),
            priority=_capability_priority(capability, task),
            evidence_requirements=["retrieved_context", "domain_ontology", "memory", "human_review_policy"],
            guardrails=[
                "Do not make irreversible decisions without human approval.",
                "Surface missing evidence and confidence limits.",
                "Keep reasoning domain-agnostic and ontology-driven.",
            ],
        )
        for capability in selected
    ]
    return sorted(specs, key=lambda spec: (spec.priority, spec.name))


import asyncio
from pydantic_ai import Agent

class RuntimeAgentRegistry:
    def __init__(self) -> None:
        self._agents: dict[str, AgentSpec] = {}
        # Hardcoding the model for the hackathon project, can be configured via env
        self.model = "google:gemini-1.5-flash"

    def register(self, specs: list[AgentSpec]) -> None:
        for spec in specs:
            self._agents[spec.name] = spec

    async def run(self, specs: list[AgentSpec], evidence: list[Evidence]) -> list[AgentFinding]:
        findings: list[AgentFinding] = []
        
        async def run_agent(spec: AgentSpec) -> AgentFinding:
            # We use pydantic_ai to ensure the LLM strictly returns the AgentFinding schema
            agent = Agent(self.model, output_type=AgentFinding)
            prompt = (
                f"You are the {spec.name}. Domain: {spec.domain}.\n"
                f"Objective: {spec.objective}\n"
                f"Guardrails: {', '.join(spec.guardrails)}\n\n"
                f"Analyze the following evidence and produce your findings. Be concise.\n\n"
            )
            for item in evidence:
                prompt += f"Evidence:\n{item.excerpt}\n\n"
            
            try:
                result = await agent.run(prompt)
                finding = result.data
                # Enforce context tracking
                finding.agent_name = spec.name
                finding.capability = spec.capability
                finding.evidence = evidence[:3]
                return finding
            except Exception as e:
                # Fallback on failure
                return AgentFinding(
                    agent_name=spec.name,
                    capability=spec.capability,
                    findings=[f"Failed to run agent {spec.name}: {e}"],
                    risks=["LLM Error"],
                    opportunities=[],
                    missing_information=[],
                    evidence=evidence[:3],
                    confidence=0.0
                )
            
        tasks = [run_agent(spec) for spec in specs]
        findings = await asyncio.gather(*tasks)
        return findings


def detect_domain(task: str, text: str, ontology: DomainOntology) -> DomainDetection:
    combined = f"{task}\n{text}".lower()
    ontology_terms = ontology.searchable_text().lower().split()
    query_terms = set(combined.split())
    score = len(query_terms & set(ontology_terms)) / max(1, len(query_terms))
    return DomainDetection(
        domain=ontology.domain,
        confidence=0.78 if ontology.domain != "general" else 0.55,
        description=ontology.description,
        business_goals=ontology.business_goals,
        recommended_capabilities=ontology.agent_capabilities,
        matched_ontology=ontology.domain,
        signals={ontology.domain: round(score, 3)},
    )
