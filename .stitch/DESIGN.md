# Design System: GovInterop
**Project ID:** local-repo (no Stitch project bound yet)

This file mirrors the product design system. Full tokens, roles, and layout rules live in the repository root [`DESIGN.md`](../DESIGN.md). Always read that file before generating or editing screens.

## 1. Visual Theme & Atmosphere
Calm civic institution: forest teak, rice-paper and parchment canvases, editorial Georgia headlines, Trebuchet UI. Citizen is airy and mobile-first; authority is dense and operational. Flat, bordered, not SaaS-indigo.

## 2. Color Palette & Roles
- Deep monsoon teak (`#153d3a`) — authority chrome and primary actions
- Forest heading ink (`#23483f` / `#173f3b`) — titles and numerals
- Rice-paper (`#f2f5f1`) — official workspace
- Warm parchment (`#f8f7f2`) — citizen canvas
- Soft lime wash (`#dfe9cd`) — citizen hero
- Pale mint (`#d7edbd`) — brand mark and active nav accent
- Status grove (`#e6f1e5` / `#467454`), harvest (`#fff0d8` / `#9a6e2d`), terracotta (`#f6e4df` / `#a85f50`)

## 3. Typography Rules
UI: `"Trebuchet MS", "Segoe UI", sans-serif`. Display: `Georgia, serif`. Eyebrows 10px uppercase tracked. Citizen H1 large Georgia; authority H1 slightly smaller but still serif.

## 4. Component Stylings
- **Buttons:** Authority 6px corners teak fill; citizen 3px corners. Consent toggle is pill-shaped.
- **Cards:** White, sage hairline, 7–8px on official KPIs with coloured top stripe; citizen list cards nearly sharp.
- **Inputs:** Sage stroke, teak focus. PIN re-auth for consent grant/revoke.

## 5. Layout Principles
Official: 252px sidebar, 4 KPI columns, 1440px max main. Citizen: 375px minimum, bottom nav on PWA, hero + overview stats. See root `DESIGN.md` for hex-accurate component rules.
