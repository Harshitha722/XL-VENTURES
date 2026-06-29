# UI/UX Changelog

## Release — June 2026 · Full Visual Overhaul

### Summary

Complete redesign of the DECISIONMESH AI frontend from a minimal inline-styled layout to a **premium dark glassmorphism design system**.

---

### Design System (`frontend/app/globals.css`)

**Before:** ~70 lines of basic variables and layout rules. Plain light background (`#f7f8fb`), Arial font, no animations.

**After:** ~650 lines covering a full design system:

| What was added | Details |
|----------------|---------|
| Dark palette | Base `#050b15`, surface `#0a1628`, glass panels `rgba(15,30,55,0.6)` |
| Accent system | Electric teal `#00d4ff`, indigo `#7c3aed`, green `#10b981`, amber `#f59e0b`, red `#ef4444` |
| Typography | Google Fonts Inter (300–900) + JetBrains Mono |
| Gradient tokens | `--gradient-primary`, `--gradient-surface`, `--gradient-glow` |
| Shadow tokens | `--shadow-sm/md/lg`, `--shadow-glow`, `--shadow-glow-purple` |
| Button system | `.btn`, `.btn-primary`, `.btn-ghost`, `.btn-danger`, `.btn-success`, `.btn-warning`, `.btn-purple` with shimmer ripple and hover lift |
| Badge system | `.badge`, `.badge-primary/success/warning/danger/purple` |
| Alert system | `.alert`, `.alert-success/error/info/warning` |
| Form inputs | `.form-input` (dark bg, teal focus ring), `.form-label`, `.form-label-text` |
| Panel/card | `.panel` (glass), `.glass-card`, `.panel-glow` |
| Metric cards | `.metric`, `.metric-value` (gradient text), `.metric-label` |
| Icon boxes | `.icon-box`, `.icon-box-primary/purple/green/gold/red` |
| Dropzone | `.dropzone`, `.dropzone-icon`, `.dropzone-title`, `.dropzone-sub` |
| Timeline | `.timeline-item` with dot glow |
| Progress | `.progress-bar`, `.progress-fill` with shimmer |
| Skeleton | `.skeleton` with shimmer animation |
| Spinner | `.spinner` CSS-only loading indicator |
| Recommendation | `.rec-card` with top-border reveal on hover |
| File list | `.file-item` with slide-in animation |
| Animations | `fadeInUp`, `fadeIn`, `shimmer`, `spin`, `pulse-green`, `gradient-shift`, `float`, `glow-pulse` |
| Utilities | `.gradient-text`, `.mono`, `.divider`, `.status-dot`, `.stagger-children` |
| Body orbs | `.hero-orb`, `.hero-orb-1`, `.hero-orb-2` for landing page ambient glow |

---

### New Components

#### `frontend/components/ui/nav-link.tsx` (**NEW**)

Client component that reads `usePathname()` and applies `.nav-link.active` class. Active items show a glowing cyan dot on the right and a left accent bar. Hover animates icon with teal glow filter.

#### `frontend/components/ui/button.tsx` (UPDATED)

| Before | After |
|--------|-------|
| Single unstyled button with inline `style` spread | 6 variants via CSS classes |
| No loading state | `loading` prop renders `.spinner` |
| No icon support | `icon` prop renders an icon before label |
| No hover animations | Shimmer ripple + lift via CSS |

#### `frontend/components/ui/section.tsx` (UPDATED)

| Before | After |
|--------|-------|
| Basic `<h1>` + children | Gradient-underline section title |
| No subtitle | `subtitle` prop below title |
| No animation | Children wrapped in `.animate-fade-in` |
| — | New `MetricCard` export: icon box, gradient value, skeleton |

---

### Layout (`frontend/app/layout.tsx`)

| Before | After |
|--------|-------|
| Plain logo link text | Branded glass logo block with animated Zap icon |
| Flat nav links | Section labels (Core / Intelligence / System) |
| No active state | `NavLink` component with active indicator dot |
| No status | Live "System operational" green pulse indicator |
| `Activity` import unused | Properly wired nav items |

---

### Page Changes

#### `/` — Landing Page

| Before | After |
|--------|-------|
| Plain `<h1>` + paragraph + simple link button | Animated gradient headline with eyebrow badge |
| 3 basic `.panel.metric` cards | Stats strip with icon boxes |
| — | Feature cards with icon box, badge, hover lift |
| — | Floating ambient orbs in background |

#### `/workspace` — Workspace Dashboard

| Before | After |
|--------|-------|
| Plain `<div className="panel metric">` | `MetricCard` with icon box per KPI |
| Inline value text | Gradient large number value |
| Plain text status | Badge-tagged report status with `CheckCircle`/`AlertTriangle` |
| No loading state | Skeleton loaders while data fetches |

#### `/upload` — Upload Center

| Before | After |
|--------|-------|
| Plain dashed border div | `.dropzone` with glow on hover and drag-over |
| Static icon | `.dropzone-icon` with `glow-pulse` animation |
| Plain file list as `<span>` | `.file-item` rows with source-type badge and file size |
| Basic button | Drag-state aware — icon + label changes |
| No error/success distinction | `alert-success`, `alert-error`, `alert-info` classes |
| No loaded-docs section label | Card panel with `CheckCircle` icon header |

#### `/analysis` — Analysis Dashboard

| Before | After |
|--------|-------|
| Simple textarea + button | `Target` icon header, styled textarea |
| 4 `.panel.metric` cards | Styled icon-box metric cards |
| Plain risks/opportunities text | Dual-column layout with `ChevronRight` list |
| No confidence visualization | `progress-bar` + animated `progress-fill` |
| No empty state | Centered empty state with faded icon |

#### `/recommendations` — Recommendations Dashboard

| Before | After |
|--------|-------|
| `<article className="panel">` | `.rec-card` with animated top-border reveal |
| Plain `<strong>` priority | `badge-danger/warning/success` priority badges |
| 4 basic outline buttons | `btn-success`, `btn-danger`, `btn-warning`, `btn-ghost` |
| No header section | Icon box + title + description in card header |
| — | Stagger animation on card list |
| — | Empty state with icon |

#### `/review` — Human Review Dashboard

| Before | After |
|--------|-------|
| 5 identical outline buttons in a row | Card-style buttons with icon + label + description |
| Plain textarea | Styled `.form-input` with icon header |
| Plain report text | Badge row: confidence, mandatory/optional, status |
| — | Confidence progress bar |
| — | `.panel-glow` highlight on report summary card |

#### `/audit` — Audit Timeline

| Before | After |
|--------|-------|
| Border-left div per event | `.timeline-item` with colored glow dot |
| Same color for all events | Event-type color mapping (green/red/amber/teal/purple) |
| Plain timestamp text | `Clock` icon + `badge` for event type |
| Plain hash text | `Hash` icon + `.mono` class |
| No loading state | 4 skeleton cards while loading |
| No empty state | Centered empty state with `Archive` icon |

#### `/knowledge` — Knowledge Base

| Before | After |
|--------|-------|
| Plain `.panel.metric` article | `.glass-card` with icon box header |
| Plain text goals/capabilities | `badge-success`/`badge-purple` tag chips |
| No scenario count display | `badge-primary` with scenario count |
| No loading state | 3 skeleton cards |

#### `/admin` — Admin Console

| Before | After |
|--------|-------|
| Inline `<span>` metrics | Full `MetricCard` grid (8 cards) |
| Plain text report list | Styled report rows with confidence badges |
| Plain text outcome list | Outcome rows with `TrendingUp/Down` icons + badge |
| Plain memory text | Badge-tagged memory type + summary row |
| Single panel for all | Split into metric grid + dual-column + memory panel |

#### `/settings` — Settings

| Before | After |
|--------|-------|
| Plain labels with read-only inputs | Grouped panels with icon headers |
| No context | `alert-info` notice about env variables |
| Plain layout | Icon box + section title per group |

---

### Files Changed

| File | Change |
|------|--------|
| `frontend/app/globals.css` | **Complete rewrite** — full dark design system |
| `frontend/app/layout.tsx` | Branded sidebar with NavLink, section grouping, status dot |
| `frontend/app/page.tsx` | Premium hero landing page |
| `frontend/app/workspace/page.tsx` | MetricCard grid, badge status |
| `frontend/app/upload/page.tsx` | Animated dropzone, file badges |
| `frontend/app/analysis/page.tsx` | Confidence bar, dual-column reasoning |
| `frontend/app/recommendations/page.tsx` | rec-cards, outcome buttons |
| `frontend/app/review/page.tsx` | Card action buttons, confidence bar |
| `frontend/app/audit/page.tsx` | Color timeline, skeleton loaders |
| `frontend/app/knowledge/page.tsx` | Glass cards, badge tags |
| `frontend/app/admin/page.tsx` | Full metric grid, split panels |
| `frontend/app/settings/page.tsx` | Grouped panels, info alert |
| `frontend/components/ui/button.tsx` | **Rewritten** — 6 variants, loading, shimmer |
| `frontend/components/ui/section.tsx` | **Updated** — subtitle, MetricCard export |
| `frontend/components/ui/nav-link.tsx` | **NEW** — active route NavLink |
