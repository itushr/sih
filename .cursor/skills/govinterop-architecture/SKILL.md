---
name: govinterop-architecture
description: GovInterop system design mapped to core/web/mob. Use when adding routes, services, Redis, BullMQ, Prisma, JWT/RBAC, policy/consent gates, or inter-dept data flow.
---

# Architecture (mapped to this repo)

Frontends talk **only** to `core`. `core` talks to department systems **only** via API Registry.

```
web :5173  +  mob  →  HTTPS/REST  →  core (Express)  →  PostgreSQL + Redis
                                              └─ BullMQ workers → dept APIs (registry)
```

## Package rules

- Routes: HTTP + Zod parse + `next(error)`. No business logic.
- Services: no Express `req`/`res`. Prisma (target) or documented exception.
- Workers call services in-process, not via HTTP.
- No raw SQL unless Prisma cannot aggregate — comment why.
- Auth credentials in registry: AES-256-GCM at rest.

## Auth JWT payload

`sub`, `role`, `department_id`, `iat`, `exp`  
Access ~15m, refresh ~7d. httpOnly cookie preferred; Bearer also accepted.

## Route prefixes (implement under `core/src`)

| Prefix | Min role |
|---|---|
| `/api/auth/*` | public |
| `/api/dashboard/*` | OFFICIAL+ |
| `/api/registry/*` | DEPT_ADMIN+ |
| `/api/policies/*` | DEPT_ADMIN+ |
| `/api/logs/*` | OFFICIAL+ |
| `/api/events/*` | OFFICIAL+ / DEPT_ADMIN for registry |
| `/api/subscriptions/*` | OFFICIAL+ |
| `/api/orchestrations/*` | DEPT_ADMIN+ |
| `/api/citizen/*` | CITIZEN + consentGate on PII |

Existing `core/src/index.ts` already mounts `/api/auth`, `/api/events`, `/api/registry`, `/api/policies`, `/api/operations`. Align new code with those mounts; add `/api/dashboard` and `/api/citizen` as needed. CORS: include Vite `http://localhost:5173`.

## Authz layers (in order)

1. JWT  2. RBAC  3. policyGate (inter-dept)  4. consentGate (citizen data)  5. query scope by `department_id`

## Redis keys

`dashboard:stats:{dept_id}` 60s · `dashboard:activity:{dept_id}` 30s · `policy:{source}:{target}:{fields_hash}` 300s · `api:health:{endpoint_id}` 300s · `fetch:result:{request_id}` 86400s · `consent:active:{citizen_id}:{service_id}` 60s · `logs:stream:{dept_id}` · `rate:{policy_id}:{source_dept}`

Invalidate stats on application status change; policy cache on update; consent cache on grant/revoke.

## BullMQ queues

`health-checks` (5 min) · `event-dispatch` · `webhook-delivery` · `webhook-retry` · `orchestration-run` · `orchestration-step` · `citizen-fetch` · `consent-expiry` (nightly)

Jobs: attempts 3, exponential 60s, then DLQ.

## Inter-dept fetch

Policy(B→A) → consent if required → registry endpoint → decrypt auth → map canonical fields → **AuditLog** → return minimised fields only.

## Models (target Prisma)

User→Department · CitizenServiceLink (`interop_id`) · Consent · ApiEndpoint · AccessPolicy · EventType · Subscription · WebhookDelivery · Workflow/Run · AuditLog · ErrorLog (never hard-delete logs)

IDs: `@default(cuid())`. DB columns snake_case via `@map`.

Env: `DATABASE_URL`, `REDIS_URL`, `JWT_SECRET`, `JWT_REFRESH_SECRET`, `ENCRYPTION_KEY` (32-byte hex).

More: [boundaries.md](boundaries.md)
