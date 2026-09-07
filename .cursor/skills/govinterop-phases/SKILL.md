---
name: govinterop-phases
description: GovInterop SIH delivery phases. Use when choosing what to implement next, scoping a PR, or checking definition of done. Phase 3 (F1–F3) is the current product slice.
---

# Delivery phases

Do not skip ahead of dependencies. **Judge completeness from this repo’s code**, not from an external checklist that marked Phase 1–2 done.

## Order

1. Foundation — auth, schema, envelopes, login shells  
2. Citizen core — consent/applications/audits APIs + basic UI  
3. **NEXT: Official dashboard** — F1 F2 F3 (this is the default when the user says “continue building”)  
4. Logs & events — F4 F5 F6  
5. Orchestrations + fetch + full consent — F7 F12 F13  
6. Linked services + home/apps/audits polish — F8 F9 F10 F11  
7. Demo, PWA, mock depts, scripts  

## Phase 3 definition of done

- `GET /api/dashboard/stats` + `activity` with Redis 60s/30s, role-scoped  
- OFFICIAL cannot see another dept  
- API Registry CRUD + `/test` + health worker 5 min  
- Access Policy CRUD + dry-run ALLOW/DENY with reason  
- `policyGate` middleware  
- Official UI: dashboard, api-registry, access-policy (under `web/src/administration/`)  
- Migrations for `ApiEndpoint`, `AccessPolicy` if Prisma is introduced  

## Phase 3 files to add (adapt names to `core/` / `web/`)

Backend: `dashboard` routes+service, `apiRegistry` + `healthCheckWorker`, `accessPolicy` + `policyGate`  
Frontend: stats grid, activity feed, dept filter, processing chart, registry and policy pages

## Verify (after a slice)

Happy path · 401/403 · dept scope · consent on PII · empty state · AppError envelope

```bash
# Token then dashboard (adjust port to core's PORT)
curl -H "Authorization: Bearer $TOKEN" http://localhost:3001/api/dashboard/stats
```

Rollback: additive migrations only; never delete audit/error rows.
