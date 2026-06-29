from statistics import mean

from app.models.schemas import AgentFinding, ConfidenceBreakdown, Critique, Evidence


class ConfidenceEngine:
    def score(
        self,
        evidence: list[Evidence],
        findings: list[AgentFinding],
        critique: Critique,
        memory_count: int,
    ) -> ConfidenceBreakdown:
        evidence_quality = round(mean([item.relevance for item in evidence]) * 100) if evidence else 35
        reasoning_quality = round(mean([item.confidence for item in findings]) * 100) if findings else 40
        capability_count = len({item.capability for item in findings})
        agent_agreement = max(35, 96 - capability_count * 4)
        memory_matches = min(100, 45 + memory_count * 9)
        retrieval_quality = min(100, evidence_quality + (8 if len(evidence) >= 3 else 0))
        uncertainty_penalty = round(critique.uncertainty * 22)
        overall = round(
            mean([evidence_quality, reasoning_quality, agent_agreement, memory_matches, retrieval_quality])
            - uncertainty_penalty
        )
        return ConfidenceBreakdown(
            evidence_quality=max(0, min(100, evidence_quality)),
            reasoning_quality=max(0, min(100, reasoning_quality)),
            agent_agreement=max(0, min(100, agent_agreement)),
            memory_matches=max(0, min(100, memory_matches)),
            retrieval_quality=max(0, min(100, retrieval_quality)),
            overall=max(0, min(100, overall)),
        )
