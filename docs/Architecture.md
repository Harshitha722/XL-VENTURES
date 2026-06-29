# Architecture

DECISIONMESH AI follows this horizontal decision-intelligence flow:

User -> Universal Ingestion Layer -> Hybrid RAG Layer -> Domain Detection Agent -> Planner Agent -> Dynamic Agent Factory -> Runtime Agent Registry -> Parallel Specialized Agents -> Business Reasoning Engine -> Domain-Aware Scenario Simulator -> Devil's Advocate Agent -> Recommendation Synthesizer -> Confidence Engine -> Human Review Layer -> Memory and Learning Layer -> Audit Logs -> Final Explainable Report.

## Backend Runtime

- `OntologyEngine` loads YAML ontologies and scores incoming tasks and evidence against ontology goals, KPIs, risks, opportunities, tools, and scenario templates.
- `HybridRAG` indexes uploaded documents locally and returns evidence with chunk, BM25, dense-overlap, and rerank metadata. The interface is ready for Qdrant and pgvector storage.
- `generate_agents(domain, task, ontology)` creates runtime agent specs from ontology capabilities. There are no static domain-specific agent classes.
- `RuntimeAgentRegistry` runs generated specs against retrieved evidence and returns typed findings.
- The reasoning engine merges findings, memory, and ontology context into risks, opportunities, missing information, assumptions, dependencies, and goals.
- The simulator turns ontology scenario templates into ranked, domain-aware scenarios.
- The critic challenges assumptions, evidence quality, alternative actions, and uncertainty.
- The synthesizer creates prioritized explainable recommendations.
- The confidence engine scores evidence quality, reasoning quality, agent agreement, memory matches, retrieval quality, and overall confidence.

## Governance

Human review remains authoritative. Reports below the confidence threshold are marked mandatory review. Every AI analysis and human decision is appended to a hash-linked audit log and stored in memory for future reasoning.
