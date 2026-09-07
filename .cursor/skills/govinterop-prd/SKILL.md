---
name: govinterop-prd
description: GovInterop product requirements for SIH26129. Use when implementing or judging features F1–F13, roles, DPDP consent, KPIs, or acceptance criteria.
---

# GovInterop PRD

**SIH26129** · Government of Maharashtra · Skills, Employment, Entrepreneurship & Innovation.

Middleware that connects portals/registries **without replacing them**. Consent-aware, audit-logged, standards-based.

## Users / roles

| Role | Need | Access |
|---|---|---|
| `CITIZEN` | Track apps, consents, own data | Mobile-first, EN/MR, 375px |
| `OFFICIAL` | Own-dept unified view | Desktop |
| `DEPT_ADMIN` | APIs, policies, workflows, logs | Desktop |
| `SUPER_ADMIN` | Platform health, cross-dept | Desktop |

## Canonical statuses

Applications: `DRAFT | SUBMITTED | UNDER_REVIEW | PENDING_DOCS | APPROVED | REJECTED | COMPLETED`  
Endpoints: `ACTIVE | INACTIVE | DEGRADED | UNKNOWN`  
Consent: `PENDING | ACTIVE | REVOKED | EXPIRED`  
Delivery: `PENDING | DELIVERED | FAILED | RETRYING`

## Feature checklist (build to acceptance)

**Official — P0:** F1 Dashboard (<2s, role-scoped KPIs + 30s activity poll) · F2 API Registry (register/test/health 5min) · F3 Access Policy (ABAC + dry-run ALLOW/DENY, 100% block)

**Official — P1/P2:** F4 Logs (SSE, resolve not delete) · F5 Event registry (`{entity}.{action}` + JSON Schema) · F6 Subscriptions (HMAC-SHA256, retry 1m/5m/30m) · F7 Orchestrations (sequential HTTP/consent/notify)

**Citizen — P0:** F8 Home (stats, last 5, quick actions, PWA) · F9 Track apps (<5s) · F10 Link services (`interop_id`, unlink revokes consents) · F13 Consent (<2s grant/revoke, PIN, DPDP purpose)

**Citizen — P1:** F11 Audits (own only, unusual flags, PDF) · F12 Fetch on demand (consent gate, BullMQ, Redis 24h, mask Aadhaar/PAN)

## Interop vocabulary (never invent aliases)

`identity.full_name`, `identity.aadhaar_number`, `identity.pan_number`, `identity.date_of_birth`, `contact.mobile_number`, `contact.email_address`, `contact.address_line1`, `contact.pincode`, `employment.*`, `revenue.annual_income`, `agriculture.land_holding_acres`, `health.disability_status`, `education.highest_qualification`

## NFRs (do not skip)

API p95 <500ms · dashboard <2s · citizen <3s on 4G · JWT all routes · AES-256 secrets at rest · audit immutable · WCAG 2.1 AA

## Non-goals

No replacement portals, no new ID system, no DMS, no payments, no grievance module in v1.

Details: [features.md](features.md)
