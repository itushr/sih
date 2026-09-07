---
name: govinterop-design
description: GovInterop visual system for citizen and official UIs. Use when changing CSS, React/Expo screens, Stitch prompts, layout, colour, or typography. Read DESIGN.md before editing UI.
---

# Design skill

1. Read [`DESIGN.md`](../../../DESIGN.md) at the repo root (hex tokens, components, layouts).
2. Stitch mirror: [`.stitch/DESIGN.md`](../../../.stitch/DESIGN.md)
3. Prefer classes already in `web/src/index.css` (`authority-*`, `citizen-*`, metric/status).
4. Citizen = parchment + Georgia hero + 375px + bottom nav on small screens. Official = teak sidebar + KPI stripe cards.
5. No indigo SaaS redesign. No dark mode in v1. Masked PII. Colour + text for status.

When generating Stitch prompts, paste the block in `DESIGN.md` §7.
