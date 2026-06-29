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

## UI/UX — Design System (Updated June 2026)

The frontend received a full visual overhaul. Below is a summary of all changes made.

### Design Theme

| Property | Value |
|----------|-------|
| Theme | Dark glassmorphism |
| Primary background | `#050b15` (deep navy) |
| Panel background | `rgba(15, 30, 55, 0.6)` glass effect |
| Primary accent | Electric teal `#00d4ff` |
| Secondary accent | Indigo `#7c3aed` |
| Typography | **Inter** (Google Fonts), JetBrains Mono for code |
| Border treatment | Subtle `rgba` borders with glow on hover |

### New Components

| Component | File | Description |
|-----------|------|-------------|
| `NavLink` | `components/ui/nav-link.tsx` | Client-side active-route detection, glowing cyan dot indicator, animated hover |
| `Button` (updated) | `components/ui/button.tsx` | 5 variants (primary, ghost, danger, success, warning, purple), loading spinner, shimmer ripple on hover |
| `Section` (updated) | `components/ui/section.tsx` | Gradient underline title, optional subtitle |
| `MetricCard` | `components/ui/section.tsx` | Icon box, skeleton loading, gradient value text |

### Button Variants

| Variant | Appearance |
|---------|-----------|
| `primary` | Teal→indigo gradient, glow shadow lift on hover |
| `ghost` | Subtle border, teal tint on hover |
| `success` | Green tint + border |
| `danger` | Red tint + border |
| `warning` | Amber tint + border |
| `purple` | Indigo tint + border |

All buttons feature a **shimmer ripple** on hover and a **lift transform** (`translateY(-2px)`).

### Animations

| Animation | Used On |
|-----------|---------|
| `fadeInUp` | Page sections, cards (staggered with `animation-delay`) |
| `shimmer` | Skeleton loaders, progress bar fill |
| `glow-pulse` | Nav icons, upload icon, icon boxes |
| `float` | Hero background orbs |
| `spin` | Button loading spinner |
| `gradient-shift` | Background gradient text |

### Pages Changed

| Page | Key UI Improvements |
|------|---------------------|
| `/` (Landing) | Gradient headline, eyebrow badge, stats strip, glass feature cards, floating background orbs |
| `/workspace` | Icon-enhanced `MetricCard` grid, badge-tagged report status, skeleton loading |
| `/upload` | Animated glow drag-and-drop zone, file type badges, per-file size display, animated file list |
| `/analysis` | Confidence progress bar, dual-column risk/opportunity display, icon metric cards, empty state |
| `/recommendations` | `rec-card` with top-border reveal animation, priority + confidence badges, color-coded outcome buttons |
| `/review` | Card-style action buttons with icon + description, confidence bar, status alerts |
| `/audit` | Color-coded timeline dots by event type, hash display with mono font, skeleton loaders |
| `/knowledge` | Domain cards with goal/capability badges, scenario count badge |
| `/admin` | Full metric grid, dual-column reports/outcomes panel, learning record rows |
| `/settings` | Grouped config panels with icon headers, info alert notice |

### Sidebar Redesign

- **Sticky sidebar** with glass background and glowing right-border gradient
- **Section labels** grouping nav into: Core / Intelligence / System
- **Active route indicator**: glowing cyan dot + left-side accent bar
- **Hover effects**: `translateX(2px)` slide + teal glow on icon
- **Logo block**: gradient brand name, pulsing Zap icon, hover glow
- **Status indicator**: live green pulse dot at sidebar bottom

### Global CSS Classes Added (`globals.css`)

```
.btn, .btn-primary, .btn-ghost, .btn-danger, .btn-success, .btn-warning, .btn-purple
.panel, .panel-glow
.metric, .metric-value, .metric-label
.badge, .badge-primary, .badge-success, .badge-warning, .badge-danger, .badge-purple
.alert, .alert-success, .alert-error, .alert-info, .alert-warning
.form-input, .form-label, .form-label-text
.timeline-item
.dropzone, .dropzone-icon, .dropzone-title, .dropzone-sub
.skeleton
.spinner
.progress-bar, .progress-fill
.glass-card
.rec-card
.icon-box, .icon-box-primary, .icon-box-purple, .icon-box-green, .icon-box-gold, .icon-box-red
.gradient-text, .gradient-text-warm
.section-title, .section-header
.nav-link, .sidebar-logo, .nav-label
.status-dot, .status-dot.online
.animate-fade-in, .animate-fade-in-up, .animate-float, .animate-glow
.stagger-children (auto-delays first 6 children)
.mono, .divider, .file-item
```

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
