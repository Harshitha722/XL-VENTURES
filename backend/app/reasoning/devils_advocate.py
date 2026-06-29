from app.models.schemas import Critique, ReasoningResult, Scenario


class DevilsAdvocateAgent:
    def critique(self, reasoning: ReasoningResult, scenarios: list[Scenario]) -> Critique:
        alternative_actions = [scenario.actions[0] for scenario in scenarios if scenario.actions][:4]
        uncertainty = 0.24
        if reasoning.missing_information:
            uncertainty += min(0.18, len(reasoning.missing_information) * 0.025)
        if not scenarios:
            uncertainty = 0.58
        return Critique(
            criticisms=[
                "Some recommendations may depend on evidence that is not independently verified.",
                "Scenario confidence could be overstated if historical outcomes are sparse.",
                "Alternative explanations should be checked before irreversible action.",
                "Ownership, timeline, and measurable business impact must be validated by a human reviewer.",
            ],
            missing_evidence=reasoning.missing_information[:6],
            alternative_actions=alternative_actions,
            uncertainty=round(min(0.75, uncertainty), 2),
        )
