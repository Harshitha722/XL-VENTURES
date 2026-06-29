# Architecture

DECISIONMESH AI follows this horizontal decision-intelligence flow:

User → Universal Ingestion Layer → Hybrid RAG Layer → Domain Detection Agent → Planner Agent → Dynamic Agent Factory → Runtime Agent Registry → Parallel Specialized Agents → Business Reasoning Engine → Domain-Aware Scenario Simulator → Devil's Advocate Agent → Recommendation Synthesizer → Confidence Engine → Human Review Layer → Memory and Learning Layer → Audit Logs → Final Explainable Report.

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

## Frontend Architecture

The frontend is a **Next.js App Router** application with a **custom dark glassmorphism design system**.

### Design Layer (`frontend/app/globals.css`)

All visual tokens, component classes, and animations are defined in a single CSS file:

- **CSS custom properties** — colors, gradients, shadows, border radii, sidebar width
- **Layout classes** — `.shell` (grid layout), `.sidebar` (sticky glass nav), `.main` (content area)
- **Component classes** — `.panel`, `.glass-card`, `.btn-*`, `.badge-*`, `.alert-*`, `.metric`, `.dropzone`, `.skeleton`, `.progress-bar`, `.timeline-item`, `.rec-card`, `.icon-box-*`
- **Animation keyframes** — `fadeInUp`, `shimmer`, `glow-pulse`, `float`, `spin`, `gradient-shift`
- **Utility classes** — `.gradient-text`, `.stagger-children`, `.animate-fade-in-up`, `.mono`, `.divider`

### Component Layer (`frontend/components/ui/`)

| Component | Responsibility |
|-----------|---------------|
| `NavLink` | Active-route detection, animated sidebar links |
| `Button` | 6 variants with loading state and shimmer ripple |
| `Section` | Page wrapper with gradient title and optional action slot |
| `MetricCard` | KPI card with icon box, skeleton loader, gradient value |

### State Layer

- **TanStack Query** — server data fetching with `refetchInterval` for live metrics
- **Zustand** (`store/useDecisionStore`) — client-side report and document state shared across pages

### Navigation Structure

```
/ (landing)
├── /workspace      → Live KPI metrics
├── /upload         → Evidence intake
├── /knowledge      → Domain ontology catalog
├── /analysis       → Run decision pipeline
├── /recommendations → AI recommendations + outcome tracking
├── /review         → Human authority gate
├── /audit          → Immutable event timeline
├── /settings       → Runtime configuration
└── /admin          → Full operational dashboard
```

## Governance

Human review remains authoritative. Reports below the confidence threshold are marked mandatory review. Every AI analysis and human decision is appended to a hash-linked audit log and stored in memory for future reasoning.
