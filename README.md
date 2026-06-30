# DECISIONMESH AI

## Team Details

| Name | Roll Number |
|------|-------------|
| Harshitha Karedla | IT-23071A12F7 |
| Rahul Aligeti | IT-23071A12D3 |
| Varshitha | IT-23071A12D2 |

## Project Overview

Universal Agentic Decision Intelligence Platform.

DECISIONMESH AI transforms transcripts, CRM updates, emails, conversations, contracts, PDFs, customer history, and enterprise knowledge into risks, opportunities, missing information, business reasoning, domain-specific scenarios, next best actions, confidence scores, human review decisions, memory, and explainable recommendations. It includes a customer outcome loop: teams can record whether a recommendation helped win a deal, lost a deal, or ended in no decision, then reuse that feedback to improve future actions and business playbooks.

## GitHub Repository

👉 **https://github.com/Harshitha722/XL-VENTURES**

---

## What Is Included

- FastAPI backend with strict Pydantic schemas and OpenAPI docs.
- Dynamic agent generation through `generate_agents(domain, task)` with runtime registry execution.
- Domain ontology engine using `knowledge/ontology/*.yaml` with domain catalog and confidence signals, including revenue operations for customer conversion and lost-deal learning.
- Hybrid retrieval abstraction with chunking, BM25-style scoring, dense-overlap signal, and rerank metadata, ready for Qdrant and pgvector adapters.
- Business reasoning, domain-aware scenario simulation, devil's advocate critique, recommendation synthesis, confidence scoring, human review, customer outcome tracking, memory, and hash-linked audit logs.
- Next.js App Router frontend — fully redesigned with a **premium dark glassmorphism UI** — with workspace, upload, knowledge, analysis, recommendations, human review, audit, settings, and admin pages connected to backend APIs.
- Docker Compose, GitHub Actions, backend tests, and Playwright E2E navigation coverage.

---

## Core Workflow

1. Upload or load evidence in the **Upload Center** (drag-and-drop or paste text).
2. Run an analysis from the **Analysis Dashboard**.
3. Review domain detection, generated agents, reasoning, scenarios, critique, confidence, and recommendations.
4. Approve, reject, delegate, escalate, request more information, or override from **Human Review**.
5. From **Recommendations**, record customer outcomes such as won, lost, no decision, or in progress, including why the customer did not buy.
6. Inspect conversion metrics, immutable audit events, memory records, and customer outcome learning in **Workspace**, **Audit**, and **Admin**.

---

## Setup Instructions

### Backend

```bash
cd backend
pip install -e ".[dev]"
uvicorn app.main:app --reload
```

### Frontend

```bash
cd frontend
npm install
npm run dev
```

Open `http://localhost:3000`. OpenAPI docs are at `http://localhost:8000/docs`.

---
Frontend
Framework: Next.js (App Router, React 18)
Language: TypeScript
Styling: Tailwind CSS (v4) 
State Management: Zustand (for client-side state like useDecisionStore)
Data Fetching: React Query (@tanstack/react-query)
Icons: Lucide React

Backend
Framework: FastAPI (High-performance async Python framework)
Language: Python 3.13+
Data Validation: Pydantic (Strict typing and schemas)
AI Agent Orchestration: pydantic_ai (Pure LLM-driven pipelines)
LLM Provider: Google Gemini API (gemini-1.5-pro & gemini-1.5-flash)
Testing: Pytest
Server: Uvicorn (ASGI)

---

## Additional Notes

### Model Switching

Set `MODEL_PROVIDER` and `MODEL_NAME` in the backend environment. Supported provider targets are abstracted for Gemini 2.5 Flash, Qwen3, DeepSeek V3, Llama 4, and Mistral without code changes.

### Production Targets

| Layer | Target |
|-------|--------|
| Frontend | Vercel |
| Backend | Railway |
| Database | Supabase PostgreSQL with pgvector |
| Vector DB | Qdrant Cloud |
| Cache | Upstash Redis |
