---
name: govinterop-standards
description: GovInterop TypeScript and security coding law. Use when writing or reviewing core, web, or mob code — AppError, Prisma, Redis, TanStack Query, Zod, no any.
---

# Coding standards (non-negotiable)

## TypeScript

- `strict`, `noImplicitAny`, `strictNullChecks`
- No `any`. Catch as `unknown`.
- Interfaces for object shapes; string unions/enums for statuses — define once (prefer shared types)
- Declare return types on services and handlers
- Files >300 lines: split

## Backend

- Throw `AppError(code, message, statusCode, details?)` only — never raw `Error` for domain failures
- Thin routes; services have zero Express types
- Scope OFFICIAL/DEPT_ADMIN queries by JWT `departmentId`
- Slow dept I/O → BullMQ, return `{ requestId, status: 'PENDING' }`
- Cache-aside Redis as in architecture skill
- Encrypt `authConfig` and webhook secrets before persist
- Zod on every mutating/body route
- Global `errorHandler` **last**; AppError → envelope; else `INTERNAL_ERROR` 500 without leaking stack to client
- Never log Aadhaar, PAN, tokens, raw API keys

```ts
throw new AppError('CONSENT_NOT_FOUND', 'No active consent found for requested fields', 404);
res.json({ success: true, data: result });
```

Error codes: `CONSENT_NOT_FOUND`, `CONSENT_EXPIRED`, `POLICY_VIOLATION`, `ENDPOINT_UNAVAILABLE`, `INVALID_PAYLOAD`, `UNAUTHORIZED`, `FORBIDDEN`

## Frontend (`web`)

- Server state: TanStack Query. UI state: Zustand (e.g. selected dept). No `useEffect`+`useState` fetch.
- Loading / error / empty on every async view
- Prefer existing CSS classes in `web/src/index.css` + `DESIGN.md` over new palettes
- shadcn only if introducing a primitive that is not already in the CSS (do not restyle the whole app)
- No prop drilling >2 levels
- API client unwraps `{ success, data }`; 401 → refresh
- `import.meta.env.VITE_*` (Vite) — never hardcode `localhost:4000`

## Mobile (`mob`)

- Same citizen tokens as `DESIGN.md` / existing `mob/src/app/index.tsx`
- Expo SDK: read `mob/AGENTS.md` (pinned docs version) before APIs

## Git

Branches: `feature/F1-dashboard`, `fix/consent-expiry-check`  
Commits: `feat(F1): ...` / `fix(F4): ...` / `chore: ...`

Do not commit unless the user asks.
