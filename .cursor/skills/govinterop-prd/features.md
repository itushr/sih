# Feature details

## F1 Dashboard

KPI: Active Services, Pending Applications, Cross-Dept Requests, Consent Grants (today), Error Rate, Avg Processing Time.  
Role-scoped. Activity last 20, poll 30s. Weekly processing chart.

## F2 API Registry

Auth types: API Key, OAuth2, JWT, None. OpenAPI import. Live test. BullMQ health every 5 min.

## F3 Access Policy

Attributes: source dept, target dept, fields, roles, time window, consent required, rate limit. Dry-run before live.

## F8 / F9 / F10 / F13 (citizen P0)

Home: Linked Services, Active Applications, Consents Given, Alerts + 4 quick actions.  
Link: select service → external ID → verify against dept API → `interop_id`. Categories: Identity, Revenue, Employment, Agriculture, Health, Education, Other.  
Consent: who, what, duration, purpose; revoke cancels in-flight fetches.

## Success metrics

>60% less duplicate field entry · status in <30s · cross-dept share <60s · 100% accesses tied to consent · 100% cross-dept events audited · health lag <5 min.
