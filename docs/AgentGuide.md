# Agent Guide

Agents are generated dynamically by `generate_agents(domain, task, ontology)`. The planner selects capabilities from ontology and task intent, then creates `AgentSpec` records that the runtime registry executes.

Forbidden pattern: static domain-specific agent classes. Required pattern: capabilities such as `risk_analysis`, `compliance_review`, or `portfolio_review` become runtime agent specs.
