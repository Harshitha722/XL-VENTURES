# RenewAI - Intelligent Next Best Action Platform

## SaaS Customer Success Domain

RenewAI is a multi-agent decision intelligence platform that turns raw customer documents into prioritized, explainable next best actions for Customer Success Managers.

## Architecture Overview

```text
Input Documents (meeting notes, emails, contracts)
        |
[Domain Detection Agent] - Classifies document domain using Gemini
        |
[Planner Agent] - Dynamically selects which agents to run
        |
[CustomerHealthAgent] - Extracts adoption, NPS, CSAT, sentiment, churn risk
[ContractAgent] - Extracts renewal, value, discount, SLA, contract risk
[CRMContextAgent] - Extracts stakeholders, escalations, expansion signals
[KnowledgeAgent] - Retrieves relevant enterprise playbooks with RAG
        |
[DataCompletenessAgent] - Detects missing decision fields
        |
[BusinessReasoningAgent] - Synthesizes risks, opportunities, and gaps
        |
[RecommendationAgent] - Generates prioritized next best actions
        |
[ExplanationAgent] - Explains recommendations with evidence and confidence
        |
Human Review - Approve / Reject - Stored in Memory
        |
Memory informs the next orchestration cycle
```

## Key Design Decisions

- Every Gemini-powered agent has a deterministic rule-based fallback.
- `parseJsonSafely` is used for every Gemini JSON response.
- Enterprise playbooks are embedded with `text-embedding-004` and retrieved by cosine similarity, with keyword fallback.
- Human approvals are stored in memory and injected into later recommendation prompts.
- Business thresholds live in `backend/src/config/businessRules.js`.
- Latest analysis is persisted to `backend/src/data/latestAnalysis.json` for the frontend.

## Setup

```bash
cd backend
cp .env.example .env
npm install
npm run dev
```

Add `GEMINI_API_KEY` to `backend/.env`.

```bash
cd frontend
npm install
npm run dev
```

## API Reference

| Endpoint | Method | Description |
|---|---|---|
| `/api/upload/analyze` | POST | Ingest documents and run the full agent pipeline |
| `/api/latest-analysis` | GET | Get the latest orchestration result |
| `/api/memory` | GET | View stored interactions and approvals |
| `/api/memory/approve-recommendation` | POST | Approve a recommendation for future memory |
| `/api/memory/review` | POST | Submit review feedback |
| `/api/metrics` | GET | Platform performance and business outcome metrics |
| `/api/knowledge/playbooks` | GET | View enterprise playbook corpus |
| `/api/business-rules` | GET | View configurable business rules |
| `/api/architecture` | GET | Get agent architecture metadata |

## Success Metrics

- Recommendation acceptance rate target: greater than 70%.
- Time-to-action reduction target: from 2 days to 30 minutes per account.
- NPS improvement after EBR target: +3 points.
- Adoption improvement after workshop target: +20%.
- Churn probability reduction target: -40%.
