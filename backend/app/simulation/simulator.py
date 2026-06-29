from app.models.schemas import MemoryRecord, ReasoningResult, Scenario
from app.ontology.engine import DomainOntology


class ScenarioSimulator:
    def simulate(
        self,
        ontology: DomainOntology,
        reasoning: ReasoningResult,
        memories: list[MemoryRecord],
    ) -> list[Scenario]:
        templates = ontology.scenario_templates[:5]
        if len(templates) < 3:
            templates.extend(
                [
                    {"title": "Evidence completion", "actions": ["Request missing evidence", "Validate assumptions"]},
                    {"title": "Risk mitigation", "actions": ["Assign owner", "Execute mitigation plan"]},
                    {"title": "Opportunity acceleration", "actions": ["Prioritize high-impact action", "Track success metrics"]},
                ]
            )
        scenarios: list[Scenario] = []
        memory_lift = min(len(memories), 4) * 0.025
        for index, template in enumerate(templates[:5], start=1):
            actions = list(template.get("actions", [])) or ["Investigate evidence", "Assign accountable owner"]
            scenarios.append(
                Scenario(
                    title=str(template.get("title", f"{ontology.domain.title()} scenario {index}")),
                    assumptions=reasoning.assumptions,
                    actions=actions,
                    expected_outcomes=[
                        "Improved decision clarity",
                        "Reduced unmanaged risk",
                        "Measurable progress against business goals",
                    ],
                    risks=reasoning.risks[:4],
                    success_metrics=ontology.success_metrics[:5],
                    confidence=round(max(0.42, min(0.92, 0.84 - index * 0.06 + memory_lift)), 2),
                    rank=index,
                )
            )
        ranked = sorted(scenarios, key=lambda scenario: scenario.confidence, reverse=True)
        return [scenario.model_copy(update={"rank": rank}) for rank, scenario in enumerate(ranked, start=1)]
