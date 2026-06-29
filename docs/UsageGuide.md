# Usage Guide

## Getting Started

1. Start the backend: `cd backend && uvicorn app.main:app --reload`
2. Start the frontend: `cd frontend && npm run dev`
3. Open `http://localhost:3000`

## Workflow

### 1. Upload Evidence → `/upload`

- Drag and drop files into the glowing drop zone, or click **Browse files**
- Supported formats: `.txt`, `.md`, `.csv`, `.pdf`, `.eml`
- Alternatively, paste raw text in the **Fallback** section
- Uploaded files are shown with source-type badges (pdf, crm, email, transcript)
- Loaded documents persist in browser session via Zustand store

### 2. Run Analysis → `/analysis`

- Edit the decision task description in the text area
- Click **Run Analysis** (teal gradient button)
- Results appear with:
  - Domain, Confidence, Review requirement, Agent count — metric cards
  - Confidence progress bar
  - Risks and Opportunities in a two-column layout

### 3. Review Recommendations → `/recommendations`

- Fill in the Customer name, Reason, and Blockers fields
- Each AI recommendation card shows: title, priority badge, confidence badge, next best action, conversion goal, objection response, success signal, owner, and timeline
- Click a color-coded outcome button — **Won** (green), **Lost** (red), **No Decision** (amber), **In Progress** (grey) — to record the result

### 4. Human Review → `/review`

- The current report status and confidence bar are shown
- Add optional reviewer comments
- Click one of the five action cards: **Approve**, **Reject**, **Request Info**, **Delegate**, **Escalate**
- Each action is logged to audit and memory

### 5. Inspect Audit → `/audit`

- Color-coded timeline entries by event type
- Each entry shows event type badge, ISO timestamp, truncated cryptographic hash, and optional reviewer comments

### 6. Monitor → `/workspace` and `/admin`

- Workspace: live KPI metric cards (reports, conversion rate, outcomes, memory, audit events)
- Admin: full breakdown including runtime reports list, outcome learning records, and memory records

## UI Navigation

The sidebar groups pages into three sections:

| Section | Pages |
|---------|-------|
| Core | Workspace, Upload, Knowledge |
| Intelligence | Analysis, Recommendations, Human Review |
| System | Audit, Settings, Admin |

The active page is highlighted with a **glowing cyan dot** and a left accent bar. All nav icons glow teal on hover.
