# Boundaries

| Boundary | Rule |
|---|---|
| Frontend ↔ backend | REST only; no frontend DB |
| Backend ↔ depts | API Registry only |
| Services ↔ DB | Prisma singleton (or one `database.ts` pool until Prisma lands) |
| Workers ↔ services | Direct function calls |
| Citizen PII routes | consentGate mandatory |

## Current core gaps vs target

`core/src/index.ts` uses `pg` pool, generic 500 handler, and imports some route files that may not exist yet. When touching backend: add `AppError` envelope, wire missing routes, keep CORS for 5173. Prefer introducing Prisma + Redis when adding Phase 3 models (`ApiEndpoint`, `AccessPolicy`) rather than expanding ad-hoc SQL.
