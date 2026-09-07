# Design System: GovInterop
**Product:** GovInterop — Government Interoperability Platform  
**Problem:** SIH26129 · Government of Maharashtra  
**Surfaces:** Citizen PWA (`web` `/`, `mob`) · Official dashboard (`web` `/administration`)  
**Source of truth:** Existing screens in `web/src/index.css` plus this document. Stitch and UI work must match these tokens.

**Product promise:** Connect, don't replace. Every screen should make the existing department system, data owner, consent decision, or operational state visible rather than hiding it behind platform chrome.

**Delivery contract:** Phase 3 authority screens are the current build priority: Dashboard, API Registry, and Access Policy. Citizen Home, Applications, Linked Services, Audits, Fetch, and Consent use the same tokens but remain separate feature slices.

## 1. Visual Theme & Atmosphere

GovInterop should feel like a **calm state institution**, not a startup dashboard and not a consumer social app.

**Mood:** Trustworthy, clear, contemporary civic infrastructure. The new web experience uses a lighter service-workspace composition: a quiet citizen command centre and a focused authority console, with stronger wayfinding and less decorative dashboard chrome.

**Citizen surface:** A mobile-ready workspace with a persistent left rail that becomes horizontal navigation on smaller screens. The canvas is near-white (`#f7f8f3`), the hero uses a lime service signal (`#dceabf`), and each view gives the citizen one clear next action. Minimum viewport **375px**.

**Authority surface:** Precise, dense, operational. A deep evergreen sidebar (`#172c28`) anchors a pale workspace (`#f3f5f1`). Numbered navigation, KPI cards, activity rows, and a compact network pulse make the status of the platform scannable in seconds.

**Philosophy:** Connect, don’t replace. The UI should look like a **middleware layer sitting beside** existing department portals — restrained chrome, no playful illustration, no dark-mode gimmicks for v1.

**Accessibility atmosphere:** WCAG 2.1 AA. Colour is never the only signal (pair status colour with label text). Marathi + English must be able to share the same layout without breaking type scale.

---

## 2. Color Palette & Roles

### Shared civic greens

| Descriptive name | Hex | Role |
|---|---|---|
| Deep monsoon teak | `#153d3a` | Authority chrome, primary filled buttons, brand mark on citizen |
| Forest heading ink | `#173f3b` / `#23483f` | Page titles, KPI numerals, citizen headlines |
| Living-leaf body | `#1d2d2b` / `#25443d` | Default body copy |
| Moss muted | `#45645b` / `#637c6c` / `#74847a` | Secondary copy, descriptions |
| Sage whisper | `#91b1a7` / `#8a9b90` | Eyebrows, timestamps, inactive nav |
| Rice-paper canvas | `#f2f5f1` | Authority page background |
| Warm parchment | `#f8f7f2` | Citizen page background |
| Soft lime wash | `#dfe9cd` / `#e6efe1` | Citizen hero, authority intro banner |
| Pale mint chip | `#d7edbd` / `#c9e59b` | Brand mark fill, CTA arrow accent |
| White institutional | `#ffffff` | Cards, panels, form surfaces |
| Hairline sage | `#dfe7df` / `#e0e7dc` | Card borders, list dividers |

### Semantic status (always pair with text)

| Descriptive name | Fill / text | Role |
|---|---|---|
| Approved grove | `#e6f1e5` / `#467454` | APPROVED, COMPLETED, DELIVERED, ACTIVE health |
| Review harvest | `#fff0d8` / `#9a6e2d` | UNDER_REVIEW, PENDING, RETRYING |
| Action terracotta | `#f6e4df` / `#a85f50` | PENDING_DOCS, FAILED, open incidents, unusual audit |
| Live pulse | `#a9db86` / `#4d967d` | System healthy, chart current bar |
| Metric teal stripe | `#4b9684` | KPI card accent — Active Services |
| Metric lake stripe | `#779db8` | KPI card accent — volume / requests |
| Metric amber stripe | `#c8a25c` | KPI card accent — consent / policy |
| Metric rose stripe | `#bd7f75` | KPI card accent — errors / incidents |

### Ceremonial (use sparingly)

| Descriptive name | Hex | Role |
|---|---|---|
| Ashoka saffron | `#FF9933` | India/Maharashtra flag chip, demo footer, never as primary button |
| Ashoka green | `#138808` | Flag chip companion only |
| Sand avatar | `#d9b58b` / `#e5d0ad` | User initials disc (not a CTA) |

**Do not** introduce generic indigo/purple SaaS palettes. **Do not** use bright red for primary actions.

---

## 3. Typography Rules

**UI / labels / buttons:** `"DM Sans", sans-serif`  
**Display / page titles / KPI numbers:** `"Space Grotesk", sans-serif`

| Role | Treatment |
|---|---|
| Eyebrow / section kicker | Sans, 10px, weight 800, letter-spacing ~0.12em, uppercase, sage colour |
| Authority H1 | Georgia, clamp 30–48px, weight 500, letter-spacing −0.02em, teak ink |
| Citizen H1 | Georgia, clamp 38–62px, weight 500, line-height ~1.04, letter-spacing −0.025em |
| Panel H2 | Georgia, ~23–29px, weight 500 |
| KPI / overview numerals | Georgia, 32–34px (citizen overview) or 32px (authority cards) |
| Body | Sans, 13–14px, line-height 1.6–1.7, moss muted |
| Nav / meta / status chips | Sans, 9–12px, weight 800 |
| Numbered nav markers | Sans, 10px, weight 800, tabular feel (`01`, `02`) |

Marathi text: keep the same sizes; allow wrapping. Never truncate consent purpose copy.

---

## 4. Component Stylings

### Buttons

- **Primary (authority):** Deep monsoon teak fill (`#153d3a`), white type, 6px corners, min-height 38px, 12px / weight 800. Hover: `#24534e`.
- **Primary (citizen):** Same teak family (`#23483f`), **sharper 3px corners**, optional lime arrow (`#c9e59b`) inside the control.
- **Outline:** Transparent fill, `#cbd7cd` stroke, `#315752` type.
- **Icon:** 38×38, white fill, `#d5ded5` stroke, terracotta glyph (`#b77a56`).
- **Text / link:** No chrome, `#3c766a` or `#618159`, weight 800.
- **Consent toggle:** Pill-shaped (20px radius). Off: white + sage type. On: mint wash `#e7f1df`, grove type `#4f7d56`.

### Cards / containers

- Authority metric cards: white, 7px corners, 1px sage border, **3px coloured top stripe** (semantic). Whisper-flat — border, not drop shadow.
- Authority panels: 8px corners, 1px `#dfe7df`.
- Citizen list cards: **almost sharp** (0–4px), white, 1px `#e0e7dc`, 17px padding. Circular 38px service/application glyphs.
- Intro banner: 8px, `#e6efe1` fill, `#dbe5da` stroke.
- Fetch callout: dashed `#b8cdb0` border on `#f0f5ea`.

### Inputs / forms

- White field, 1px sage hairline, 6px corners on authority / 3px on citizen.
- Labels above fields, 11px sage, weight 800.
- Focus: teak ring, never generic browser blue if avoidable.
- Error: terracotta text + rose wash; success: grove chip.
- PIN re-auth: numeric, spaced digits, civic not banking-neon.

### Navigation

- **Authority:** 252px collapsible sidebar, teak field, active item `#24534e` with **inset 3px lime bar** (`#d7edbd`). Collapse to 76px icon rail under 900px.
- **Citizen web:** Top bar, underline-active (`#9fbd63` border). Bottom nav on small screens / PWA.
- **Citizen mobile (`mob`):** Same parchment canvas, numbered feature rows, Georgia title.

### Status chips

Tiny, 3–4px corners (not pills except consent toggle), 9px weight 800, uppercase-adjacent wording: Published, In review, Action needed.

### Charts / activity

- Activity rows: 5px moss dot with 4px wash halo; hairline dividers `#edf1ed`.
- Pulse bars: sage `#9dc9a5`, current period `#4d967d`, 3px top rounding only.

### Depth & elevation

**Mostly flat.** Borders and colour fields do the work. The only whisper-soft shadow is the citizen orbit core (`0 8px 25px #aabea055`). No heavy Material elevation, no glassmorphism.

---

## 5. Layout Principles

### Authority (desktop-first, inside government network)

- Shell: sidebar + main. Main capped at 1440px, padding 36px 50px 60px.
- KPI grid: **4 columns** → 2 at ≤900px → stacked details at ≤640px.
- Content split: ~1.55fr activity + ~0.85fr health/chart.
- Dashboard must feel complete in **under 2s**: skeleton cards with sage wash, not spinners covering the whole shell.

### Citizen (mobile-first, 375px minimum)

- Max content ~1184–1240px on desktop; 28px horizontal padding.
- Hero: two columns on desktop (copy + orbit); single column on ≤800px.
- Overview stats: 3 columns with 1px gutters; stack on mobile.
- Persistent **bottom navigation** on authenticated PWA routes.
- Offline: cached shell + stale home data banner, not a blank white page.

### Shared

- 8-ish spacing rhythm (10 / 12 / 18 / 24 / 36).
- One H1 per view. Eyebrow above it.
- Empty states: oversized Georgia feature number, short explanation, one outline action.
- Loading: skeleton blocks in card shape. Mutations: small spinner in the button.
- Never show raw Aadhaar/PAN; masked by default with explicit reveal pattern.

### Motion

- 200ms colour/background transitions on nav and buttons.
- No bounce, no parallax, no auto-playing video.

### Iconography & brand

- Wordmark: **interop** (lowercase). Mark: **IO** in a 34px rounded square (authority) or 30px circle (citizen).
- Numbered features `01`–`07` for official IA (Dashboard → Orchestrations).
- Language toggle (EN / मराठी) belongs in citizen header/footer, not buried in settings only.

---

## 6. Screen-specific notes (PRD mapping)

| Feature | Visual contract |
|---|---|
| F1 Dashboard | 6 KPI cards (role-scoped), activity list last 20, weekly pulse chart |
| F2 API Registry | Table + status dots ACTIVE/INACTIVE/DEGRADED/UNKNOWN |
| F3 Access Policy | Source/target dept, field chips, dry-run ALLOW/DENY banner |
| F8 Home | Stat cards, last 5 timeline events, alert banner, 4 quick actions |
| F9 Applications | Canonical status colours from §2; timeline + next-action prompt |
| F13 Consent | Who / what / how long / purpose; PIN gate; instant revoke |

### Authority dashboard data contract

- Show six role-scoped measures: Active Services, Pending Applications, Cross-Department Requests, Consent Grants Today, Error Rate, and Average Processing Time.
- The activity feed shows the latest 20 events and communicates loading, empty, error, and stale states without replacing the whole shell with a spinner.
- Processing trend is a restrained seven-period pulse chart: no 3D effects, no decorative gradients, and a text alternative for assistive technology.
- Department filters are visible only where the signed-in role can change scope. OFFICIAL and DEPT_ADMIN remain constrained to their department; SUPER_ADMIN may select platform-wide or a department.

### Citizen interaction contract

- Mobile-first at 375px, with a persistent bottom navigation pattern for authenticated PWA views.
- Every personal-data action names the requesting department, requested fields, purpose, duration, and consent state before submission.
- Sensitive identifiers are masked by default. Never make colour, animation, or an icon the sole indication of a status.
- English and Marathi labels may wrap naturally; layouts must not depend on truncation or fixed single-line labels.

### Accessibility and state contract

- Meet WCAG 2.1 AA contrast and keyboard focus expectations. Every icon-only control has an accessible name.
- Lists, tables, charts, and fetch flows provide explicit loading, error, empty, and success states.
- Statuses use the canonical vocabulary from the PRD: DRAFT, SUBMITTED, UNDER_REVIEW, PENDING_DOCS, APPROVED, REJECTED, COMPLETED, plus operational ACTIVE, DEGRADED, FAILED, and RETRYING.
- Audit surfaces identify actor, department, fields, purpose, consent, timestamp, and anomaly state without exposing raw secrets or Aadhaar/PAN values.

---

## 7. Stitch / generation prompt block

Use this block when generating or editing screens:

```
Civic interoperability platform for Government of Maharashtra.
Atmosphere: calm institutional, editorial serif headlines, forest-and-parchment, mostly flat.

DESIGN SYSTEM (REQUIRED):
- Citizen: mobile-first 375px, parchment canvas #f8f7f2, hero lime wash #dfe9cd, Georgia headlines #23483f, Trebuchet UI, sharp 3px primary buttons #23483f
- Authority: desktop sidebar #153d3a, workspace #f2f5f1, white cards with 7–8px corners, 3px semantic top stripe on KPIs, Georgia numerals
- Accents: pale mint #d7edbd, harvest amber chips, terracotta for action-needed — never generic indigo
- Elevation: flat borders; no glassmorphism; no heavy shadows
- Brand: lowercase "interop" + IO mark
```
