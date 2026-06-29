from pathlib import Path
import re
from typing import Any

import yaml
from pydantic import BaseModel, Field

from app.core.config import get_settings
from app.models.schemas import DomainCatalogItem, DomainDetection


_TOKEN_RE = re.compile(r"[a-z0-9]+")
_STOPWORDS = {
    "a", "an", "and", "are", "as", "at", "be", "for", "from", "in", "into", "is", "of", "on",
    "or", "the", "to", "with", "were", "was", "will", "this", "that", "it", "by", "across",
}


class DomainOntology(BaseModel):
    domain: str
    description: str
    business_goals: list[str]
    kpis: list[str]
    risks: list[str]
    opportunities: list[str]
    success_metrics: list[str]
    agent_capabilities: list[str]
    tools: list[str]
    scenario_templates: list[dict[str, Any]] = Field(default_factory=list)

    def searchable_text(self) -> str:
        return " ".join(
            [
                self.domain.replace("_", " "),
                self.description,
                *self.business_goals,
                *self.kpis,
                *self.risks,
                *self.opportunities,
                *self.success_metrics,
                *self.agent_capabilities,
                *self.tools,
                *[str(template.get("title", "")) for template in self.scenario_templates],
                *[" ".join(map(str, template.get("actions", []))) for template in self.scenario_templates],
            ]
        )


def _tokens(text: str) -> list[str]:
    return [token for token in _TOKEN_RE.findall(text.lower()) if token not in _STOPWORDS and len(token) > 2]


class OntologyEngine:
    def __init__(self, ontology_path: str | None = None) -> None:
        configured = Path(ontology_path or get_settings().ontology_path)
        self.ontology_path = self._resolve_path(configured)
        self._ontologies = self._load()

    def _resolve_path(self, configured: Path) -> Path:
        if configured.is_absolute() and configured.exists():
            return configured
        candidates = [
            Path.cwd() / configured,
            Path(__file__).resolve().parents[2] / configured,
            Path(__file__).resolve().parents[3] / configured,
        ]
        for candidate in candidates:
            if candidate.exists():
                return candidate.resolve()
        return candidates[0].resolve()

    def _load(self) -> dict[str, DomainOntology]:
        ontologies: dict[str, DomainOntology] = {}
        for file in sorted(self.ontology_path.glob("*.yaml")):
            payload = yaml.safe_load(file.read_text(encoding="utf-8"))
            ontology = DomainOntology.model_validate(payload)
            ontologies[ontology.domain.lower()] = ontology
        return ontologies

    def all(self) -> list[DomainOntology]:
        return list(self._ontologies.values())

    def catalog(self) -> list[DomainCatalogItem]:
        return [
            DomainCatalogItem(
                domain=item.domain,
                description=item.description,
                business_goals=item.business_goals,
                kpis=item.kpis,
                risks=item.risks,
                opportunities=item.opportunities,
                success_metrics=item.success_metrics,
                agent_capabilities=item.agent_capabilities,
                tools=item.tools,
                scenario_count=len(item.scenario_templates),
            )
            for item in self.all()
        ]

    def get(self, domain: str) -> DomainOntology:
        normalized = domain.lower()
        if normalized in self._ontologies:
            return self._ontologies[normalized]
        return self._synthesize(domain)

    def nearest(self, text: str) -> DomainOntology:
        return self.detect(text)[0]

    def detect(self, text: str) -> tuple[DomainOntology, DomainDetection]:
        scores = self.score(text)
        best_domain = max(scores, key=scores.get) if scores else "general"
        if scores and scores[best_domain] > 0:
            ontology = self.get(best_domain)
            confidence = min(0.96, max(0.58, 0.45 + scores[best_domain] * 0.55))
        else:
            ontology = self._synthesize("general")
            confidence = 0.52
        detection = DomainDetection(
            domain=ontology.domain,
            confidence=round(confidence, 2),
            description=ontology.description,
            business_goals=ontology.business_goals,
            recommended_capabilities=ontology.agent_capabilities,
            matched_ontology=ontology.domain,
            signals={domain: round(score, 3) for domain, score in sorted(scores.items())},
        )
        return ontology, detection

    def score(self, text: str) -> dict[str, float]:
        query = _tokens(text)
        if not query:
            return {ontology.domain: 0.0 for ontology in self.all()}
        query_set = set(query)
        scores: dict[str, float] = {}
        for ontology in self.all():
            ontology_tokens = _tokens(ontology.searchable_text())
            ontology_set = set(ontology_tokens)
            overlap = query_set & ontology_set
            if not ontology_set:
                scores[ontology.domain] = 0.0
                continue
            coverage = len(overlap) / max(1, len(query_set))
            specificity = len(overlap) / max(1, len(ontology_set))
            phrase_bonus = sum(1 for goal in ontology.business_goals if goal.lower() in text.lower()) * 0.04
            scores[ontology.domain] = min(1.0, coverage * 0.72 + specificity * 0.28 + phrase_bonus)
        return scores

    def _synthesize(self, domain: str) -> DomainOntology:
        title = domain.replace("-", " ").replace("_", " ").title()
        return DomainOntology(
            domain=domain.lower(),
            description=f"General decision intelligence ontology for {title}.",
            business_goals=["Improve decisions", "Reduce risk", "Increase operational leverage"],
            kpis=["Decision quality", "Cycle time", "Outcome accuracy"],
            risks=["Incomplete evidence", "Operational friction", "Compliance exposure"],
            opportunities=["Workflow optimization", "Revenue expansion", "Risk reduction"],
            success_metrics=["Approved action rate", "Measured business impact", "Feedback quality"],
            agent_capabilities=["risk_analysis", "opportunity_analysis", "compliance_review", "execution_planning"],
            tools=["hybrid_retrieval", "memory_lookup", "policy_lookup", "scenario_simulation"],
            scenario_templates=[
                {"title": "Conservative action", "actions": ["Validate missing evidence", "Execute low-regret mitigation"]},
                {"title": "Balanced optimization", "actions": ["Prioritize high-impact actions", "Monitor outcome metrics"]},
                {"title": "Aggressive intervention", "actions": ["Escalate ownership", "Commit resources to rapid change"]},
            ],
        )
