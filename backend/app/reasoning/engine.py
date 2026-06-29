from app.models.schemas import AgentFinding, MemoryRecord, ReasoningResult
from app.ontology.engine import DomainOntology


class BusinessReasoningEngine:
    def reason(
        self,
        findings: list[AgentFinding],
        ontology: DomainOntology,
        memories: list[MemoryRecord],
    ) -> ReasoningResult:
        risks = sorted({risk for finding in findings for risk in finding.risks} | set(ontology.risks[:4]))
        opportunities = sorted(
            {item for finding in findings for item in finding.opportunities} | set(ontology.opportunities[:4])
        )
        missing = sorted({item for finding in findings for item in finding.missing_information})
        assumptions = [
            "Available documents are representative of the current business context.",
            "Domain ontology goals reflect the operating model.",
            "Human reviewers can validate business impact before final execution.",
        ]
        if memories:
            assumptions.append("Historical feedback is relevant to this decision pattern.")
        dependencies = [
            "Reliable source data",
            "Human review authority",
            "Outcome measurement",
            "Clear owner and timeline",
        ]
        return ReasoningResult(
            risks=risks,
            opportunities=opportunities,
            missing_information=missing,
            assumptions=assumptions,
            dependencies=dependencies,
            business_goals=ontology.business_goals,
        )
