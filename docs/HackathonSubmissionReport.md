# DECISIONMESH AI - Hackathon Submission Report

## 1. Project Title

**DECISIONMESH AI**  
**Tagline:** Universal Agentic Decision Intelligence Platform

DECISIONMESH AI is a horizontal agentic decision intelligence platform that transforms enterprise evidence into explainable risks, opportunities, scenarios, recommendations, confidence scores, human-review decisions, memory records, and audit trails.

## 2. Problem Statement

Modern teams make important decisions from scattered information: meeting transcripts, emails, contracts, CRM updates, PDFs, customer history, policy documents, and enterprise knowledge bases. This information is often incomplete, domain-specific, and difficult to reason over consistently.

Traditional dashboards and chatbots usually summarize information, but they do not produce structured decision reasoning, scenario analysis, confidence scoring, human review workflows, and auditability in one connected flow.

DECISIONMESH AI solves this by providing a reusable decision intelligence layer that can work across multiple domains such as healthcare, finance, retail, manufacturing, insurance, education, and customer success.

## 3. Proposed Solution

DECISIONMESH AI ingests business evidence and runs it through a multi-stage agentic pipeline:

1. Evidence ingestion
2. Hybrid retrieval
3. Domain detection
4. Dynamic agent generation
5. Runtime agent execution
6. Business reasoning
7. Scenario simulation
8. Devil's advocate critique
9. Recommendation synthesis
10. Confidence scoring
11. Human review
12. Memory and audit logging

The result is a structured decision report that explains what the platform recommends, why it recommends it, what evidence supports it, what risks remain, and whether human review is mandatory.

## 4. Key Features

- **Universal domain support:** Uses ontology files to support multiple industries instead of hard-coded domain logic.
- **Dynamic agent generation:** Agents are generated at runtime from domain capabilities and task context.
- **Hybrid RAG prototype:** Evidence is chunked, scored, ranked, and returned with retrieval metadata.
- **Business reasoning engine:** Produces risks, opportunities, missing information, assumptions, dependencies, and goals.
- **Scenario simulation:** Generates ranked domain-aware scenarios with actions, outcomes, risks, metrics, and confidence.
- **Devil's advocate critique:** Challenges assumptions, missing evidence, alternative actions, and uncertainty.
- **Explainable recommendations:** Each recommendation includes rationale, evidence, confidence, priority, owner, timeline, critiques, and scenarios considered.
- **Confidence engine:** Scores evidence quality, reasoning quality, agent agreement, memory matches, retrieval quality, and overall confidence.
- **Human-in-the-loop review:** Supports approve, reject, override, delegate, escalate, and request-information actions.
- **Memory layer:** Stores report memory and human feedback memory for future reasoning.
- **Audit trail:** Creates hash-linked audit events for AI and human decisions.
- **Frontend dashboard:** Provides pages for workspace, upload, knowledge, analysis, recommendations, review, audit, settings, and admin.

## 5. Architecture Overview

The platform follows this flow:

User -> Universal Ingestion Layer -> Hybrid RAG Layer -> Domain Detection -> Dynamic Agent Factory -> Runtime Agent Registry -> Parallel Agent Findings -> Business Reasoning Engine -> Scenario Simulator -> Devil's Advocate Critique -> Recommendation Synthesizer -> Confidence Engine -> Human Review -> Memory -> Audit Logs -> Explainable Report

### Backend

The backend is built with **FastAPI** and **Pydantic**. It exposes typed APIs for upload, analysis, recommendations, review, memory, audit, reports, metrics, and domain catalog.

Important backend modules:

- `app/models/schemas.py`: Pydantic schemas for all report, review, memory, audit, and recommendation objects.
- `app/ontology/engine.py`: Loads domain ontologies and performs domain detection scoring.
- `app/rag/hybrid.py`: Implements the local hybrid retrieval prototype.
- `app/agents/factory.py`: Generates runtime agent specifications dynamically.
- `app/core/orchestrator.py`: Coordinates the full decision pipeline.
- `app/reasoning/*`: Reasoning, critique, confidence, and synthesis modules.
- `app/simulation/simulator.py`: Produces ranked scenarios.
- `app/memory/store.py`: Stores in-process memory records.
- `app/audit/store.py`: Stores hash-linked audit events.

### Frontend

The frontend is built with **Next.js App Router**, **TypeScript**, **TanStack Query**, **Zustand**, and a **custom dark glassmorphism design system**.

Important frontend pages:

- `/workspace`: Runtime metric cards with icon boxes, badge-tagged report status, skeleton loaders.
- `/upload`: Animated glow drag-and-drop zone, file type detection badges, per-file size display.
- `/knowledge`: Domain ontology cards with goal and capability badge grids.
- `/analysis`: Confidence progress bar, dual-column risk/opportunity layout, animated result cards.
- `/recommendations`: Animated recommendation cards with priority badges and color-coded outcome buttons.
- `/review`: Card-style review action buttons with descriptions and confidence bar.
- `/audit`: Color-coded event timeline with cryptographic hash display and skeleton loaders.
- `/admin`: Full metric card grid, dual-column reports and outcome learning panels.
- `/settings`: Grouped configuration panels with icon headers.

New and updated UI components:

- `NavLink` (`components/ui/nav-link.tsx`): Active-route detection via `usePathname`, glowing cyan indicator dot, animated hover effects.
- `Button` (`components/ui/button.tsx`): 6 variants — primary (gradient glow), ghost, success, danger, warning, purple — with loading spinner and shimmer ripple.
- `Section` (`components/ui/section.tsx`): Gradient-underline title, optional subtitle prop.
- `MetricCard` (`components/ui/section.tsx`): Icon box, gradient value text, skeleton loading state.

## 6. Supported Domains

The prototype includes ontology files for:

- Healthcare
- Finance
- Retail
- Manufacturing
- Insurance
- Education
- Customer Success

Each ontology defines business goals, KPIs, risks, opportunities, success metrics, agent capabilities, tools, and scenario templates.

## 7. API Summary

Core APIs:

- `POST /upload`: Upload and normalize evidence files.
- `POST /analyze`: Generate a full decision report.
- `POST /recommend`: Generate recommendations for a request.
- `POST /review`: Record a human review decision.
- `GET /report/{id}`: Fetch one report.
- `GET /reports`: List reports in the current runtime.
- `GET /domains`: Return ontology catalog.
- `GET /memory`: Return memory records.
- `GET /audit`: Return audit events.
- `GET /metrics`: Return platform metrics.

## 8. Example User Flow

1. A user uploads a meeting transcript, contract, CRM note, or email.
2. The user enters a decision task such as: "Assess finance compliance and portfolio risk."
3. DECISIONMESH AI detects the domain as finance.
4. The platform generates finance-relevant runtime agents such as fraud, investment, portfolio, and compliance agents.
5. Agents evaluate evidence and produce findings.
6. The reasoning engine combines findings with ontology context and memory.
7. The simulator creates ranked scenarios.
8. The critique layer identifies blind spots and missing evidence.
9. The synthesizer produces prioritized recommendations.
10. The confidence engine determines whether review is mandatory.
11. A human reviewer approves, rejects, overrides, delegates, escalates, or requests more information.
12. The decision and review are saved to memory and audit logs.

## 9. Prototype Scope

This is a hackathon-ready functional prototype. It intentionally focuses on the complete user flow and explainable decision intelligence experience rather than enterprise-scale infrastructure.

Implemented for prototype:

- Working backend orchestration pipeline
- Working frontend dashboard pages
- Multi-domain ontology system
- Dynamic agent generation
- Hybrid retrieval prototype
- Scenario simulation
- Confidence scoring
- Human review workflow
- Memory records
- Audit logs
- Tests and build verification

Deferred for production:

- Persistent database storage
- Real pgvector and Qdrant deployment
- Authentication and role-based permissions
- Real hosted LLM provider calls
- Enterprise observability stack
- Multi-tenant deployment hardening

## 10. Technology Stack

Frontend:

- Next.js App Router
- TypeScript
- TanStack Query
- Zustand
- Custom dark glassmorphism design system (Inter + JetBrains Mono via Google Fonts)
- Tailwind CSS v4 (utility layer)
- Playwright for E2E tests

Backend:

- Python 3.13
- FastAPI
- Pydantic
- PyYAML
- Pytest
- Ruff

Architecture-ready integrations:

- LangGraph / LangChain style orchestration
- Qdrant / pgvector retrieval layer
- Redis / PostgreSQL persistence
- Model provider switching through environment variables

## 11. Testing And Verification

The following checks were completed successfully:

- Backend unit and integration tests: `6 passed`
- Backend linting with Ruff: passed
- Frontend TypeScript check: passed
- Frontend production build: passed
- Playwright E2E route smoke tests: `2 passed`

This confirms that the prototype builds, the backend pipeline runs, and the frontend routes render successfully.

## 12. Innovation Highlights

DECISIONMESH AI is not a chatbot. It is structured as a decision intelligence platform with reusable reasoning components.

Key innovation points:

- Runtime-generated agents instead of static domain agents
- Ontology-driven domain adaptation
- Explainability-first recommendations
- Scenario-based reasoning before recommendation
- Devil's advocate critique built into the pipeline
- Confidence scoring connected to mandatory human review
- Memory and audit as first-class parts of the workflow
- Horizontal design that can support many industries

## 13. Business Value

DECISIONMESH AI can help teams make better decisions by:

- Reducing decision ambiguity
- Surfacing missing information early
- Making risks and assumptions explicit
- Comparing possible scenarios
- Producing traceable next-best actions
- Keeping humans in final control
- Creating reusable organizational memory
- Supporting multiple business domains from one platform

Potential use cases include:

- Healthcare care-pathway review
- Finance compliance and portfolio risk analysis
- Retail inventory and promotion decisions
- Manufacturing quality and procurement planning
- Insurance claim and fraud review
- Education student intervention planning
- Customer success renewal and adoption decisions

## 14. UI/UX Design System

The frontend received a full visual redesign with a **premium dark glassmorphism** theme intended to look production-grade and impressive at first glance.

### Design Tokens

| Token | Value |
|-------|-------|
| Base background | `#050b15` deep navy |
| Panel background | `rgba(15, 30, 55, 0.6)` glass |
| Primary accent | Electric teal `#00d4ff` |
| Secondary accent | Indigo `#7c3aed` |
| Gradient | `135deg, #00d4ff → #7c3aed` |
| Font | Inter (Google Fonts) |
| Mono font | JetBrains Mono |

### Animations Implemented

| Animation | Purpose |
|-----------|---------|
| `fadeInUp` | Page entry for every card and section (staggered delays) |
| `shimmer` | Skeleton loaders and progress bar shimmer |
| `glow-pulse` | Nav icons, upload icon, CTA icon boxes |
| `float` | Hero background orbs on landing page |
| `spin` | Button loading spinner |
| `gradient-shift` | Animated gradient background text |

### Sidebar

- Sticky dark sidebar with glowing right-border gradient
- Route sections: Core / Intelligence / System
- Active page: glowing cyan dot + left accent bar
- Nav icon hover: `translateX(2px)` slide + teal glow filter
- Status indicator: live green pulse dot at the bottom

### Button System

All buttons have hover lift (`translateY(-2px)`), shimmer ripple on hover, and disabled opacity. Variants: `primary`, `ghost`, `success`, `danger`, `warning`, `purple`.

### Page-Level Highlights

| Page | Key Design Feature |
|------|--------------------|
| Landing | Animated gradient headline, stat strip, floating orbs |
| Upload | Glow drag-and-drop zone, animated file list with badges |
| Analysis | Confidence progress bar, dual-column reasoning display |
| Recommendations | Card top-border reveal, color-coded outcome buttons |
| Human Review | Card action buttons with icon + description |
| Audit | Color-coded timeline dots by event type |

## 15. Conclusion

DECISIONMESH AI is a complete hackathon prototype of a universal agentic decision intelligence platform. It demonstrates how enterprise evidence can be transformed into structured reasoning, ranked scenarios, explainable recommendations, confidence scores, human decisions, memory, and audit logs — all presented through a **premium dark glassmorphism UI** designed for maximum visual impact.

The project is ready for demo and submission as a functional prototype. Future production work would mainly involve connecting persistent databases, hosted model providers, authentication, and cloud-scale deployment infrastructure.
