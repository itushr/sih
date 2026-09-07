---
name: govinterop-build
description: Routes GovInterop (SIH26129) implementation work to the correct product, architecture, standards, phase, and design skills. Use when building features, APIs, UI, Prisma/schema, workers, or anything for this interoperability platform.
---

# GovInterop build router

Read this first, then open only the files you need.

## This repo vs the architecture PDF

The written architecture mentions Next.js apps on 3001–3003. **This repository is:**

- `core/` — Express API (see `core/src/index.ts`)
- `web/` — Vite React: `/` citizen, `/administration` official
- `mob/` — Expo citizen app

Implement inside these trees. Map doc names as:

| Doc path | Actual path |
|---|---|
| `backend/` | `core/` |
| `apps/citizen-app` | `web/src/citizen/` + `mob/` |
| `apps/official-dashboard` + `admin-console` | `web/src/administration/` |
| `packages/shared` | create `packages/shared` only if types are duplicated 3+ times; otherwise colocate until then |

## Read next (by task)

| Task | Open |
|---|---|
| What to build / acceptance | [../govinterop-prd/SKILL.md](../govinterop-prd/SKILL.md) |
| Where it lives / APIs / cache / security | [../govinterop-architecture/SKILL.md](../govinterop-architecture/SKILL.md) |
| How to write code | [../govinterop-standards/SKILL.md](../govinterop-standards/SKILL.md) |
| What phase / order | [../govinterop-phases/SKILL.md](../govinterop-phases/SKILL.md) |
| UI tokens / layout | [../../../DESIGN.md](../../../DESIGN.md) |

## Core principle

Connect existing department systems. Never hardcode department URLs; go through API Registry. Never return citizen PII without consent + audit log.

## Response envelope

```ts
{ success: true, data: T, meta?: { total, page, limit, cursor? } }
{ success: false, error: { code: string, message: string, details?: unknown } }
```

## Feature IDs

F1 Dashboard · F2 API Registry · F3 Access Policy · F4 Logs · F5 Events · F6 Subscriptions · F7 Orchestrations · F8 Home · F9 Applications · F10 Linked services · F11 Audits · F12 Fetch · F13 Consent
