# Developer Guide

## Repository Structure

```
XL-VENTURES/
├── backend/          # FastAPI decision intelligence API
├── frontend/         # Next.js App Router UI
│   ├── app/          # Pages (workspace, upload, analysis, ...)
│   ├── components/
│   │   └── ui/       # Button, Section, NavLink, MetricCard
│   └── app/globals.css  # Full design system (dark glassmorphism)
├── knowledge/
│   └── ontology/     # YAML domain ontology files
└── docs/             # Project documentation
```

## Backend Development

Backend code lives in `backend/app`. Add a new domain by creating a YAML ontology in `knowledge/ontology/` with business goals, KPIs, risks, opportunities, success metrics, agent capabilities, tools, and scenario templates. No new static agent class is required.

Run backend tests:
```bash
pytest
```

## Frontend Development

Frontend code lives in `frontend/app` (pages) and `frontend/components/ui` (components).

### Design System

All styling is in `frontend/app/globals.css`. The file defines:

- **CSS custom properties** for colors, gradients, shadows, and layout tokens
- **Component classes** — `.btn`, `.panel`, `.badge`, `.alert`, `.form-input`, `.dropzone`, `.skeleton`, etc.
- **Keyframe animations** — `fadeInUp`, `shimmer`, `glow-pulse`, `float`, `spin`
- **Utility classes** — `.gradient-text`, `.mono`, `.stagger-children`, `.animate-fade-in-up`

When adding a new page, use these existing class primitives rather than inline styles to keep the dark theme consistent.

### UI Components

| Component | File | Props |
|-----------|------|-------|
| `Button` | `components/ui/button.tsx` | `variant`, `size`, `loading`, `icon` |
| `ButtonLink` | `components/ui/button.tsx` | `href`, `variant`, `size` |
| `Section` | `components/ui/section.tsx` | `title`, `subtitle`, `action` |
| `MetricCard` | `components/ui/section.tsx` | `label`, `value`, `icon`, `variant`, `loading` |
| `NavLink` | `components/ui/nav-link.tsx` | `href`, `label`, `Icon` |

### Button Variants

`primary` · `ghost` · `success` · `danger` · `warning` · `purple`

### MetricCard Icon Variants

`primary` (teal) · `purple` · `green` · `gold` · `red`

### Adding a New Page

1. Create `frontend/app/<route>/page.tsx`
2. Add `"use client"` if the page uses hooks
3. Wrap content in `<Section title="..." subtitle="...">`
4. Use `.panel`, `.glass-card`, `.badge`, `.btn-*` classes from the design system
5. Register the route in `frontend/app/layout.tsx` nav array and add a `NavLink` entry

## Type Checks and Lint

```bash
# Frontend type check
npx tsc --noEmit

# Backend lint
ruff check backend/
```
