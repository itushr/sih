# GovInterop agent guide

SIH26129 — Maharashtra interoperability middleware. **Connect, don't replace.**

## Repo (this codebase)

| Package | Role | Stack |
|---|---|---|
| `web/` | Citizen + official UI | Vite + React Router (`/` citizen, `/administration` official) |
| `mob/` | Citizen mobile | Expo / React Native |

The backend is intentionally deferred and will be recreated after the frontend work is complete.

Do **not** scaffold a parallel Next.js `apps/` tree unless the user explicitly asks. Implement PRD features inside these packages.

## Always follow

1. Read `.cursor/skills/govinterop-build/SKILL.md` before implementing a feature.
2. Visual work must match root `DESIGN.md` (tokens already live in `web/src/index.css`).
3. Coding law: `.cursor/skills/govinterop-standards/SKILL.md` — no `any`, AppError envelope, thin routes, consent gate on citizen PII.
4. Phases: `.cursor/skills/govinterop-phases/SKILL.md` — current delivery slice is Phase 3 (F1–F3) once foundation is real in this repo.

## Non-goals

Not a replacement portal, not a new identity system, not DMS, not payments, not grievance (v1).
