export const adminNavigation = [
  ["overview", "Dashboard", "01", "▦", "/administration"],
  ["registry", "API Registry", "02", "♧", "/administration/api-registry"],
  ["policies", "Access Policies", "03", "⬡", "/administration/access-policies"],
  ["logs", "Errors & Logs", "04", "◉", "/administration/errors-logs"],
  ["events", "Event Registry", "05", "⌘", "/administration/event-registry"],
  ["subscriptions", "Subscriptions", "06", "▤", "/administration/subscriptions"],
  ["workflows", "Workflows", "07", "⌗", "/administration/workflows"],
];

export const pageDetails = {
  overview: ["Dashboard", "Good morning, admin."],
  registry: ["API Registry", "Connected services"],
  register: ["API Registry / Register", "Register new API endpoint"],
  "registry-detail": ["API Registry / Endpoint", "Service endpoint details"],
  "registry-edit": ["API Registry / Edit", "Edit API endpoint"],
  policies: ["Access Policies", "Permission architecture"],
  "policy-create": ["Access Policies / Create", "Create access policy"],
  logs: ["Errors & Logs", "Operational signals"],
  "log-detail": ["Errors & Logs / Incident", "Incident detail"],
  events: ["Event Registry", "Platform vocabulary"],
  "event-create": ["Event Registry / Register", "Register new event"],
  "event-detail": ["Event Registry / Event", "Event contract details"],
  "event-edit": ["Event Registry / Edit", "Edit event contract"],
  subscriptions: ["Subscriptions", "Delivery channels"],
  "subscription-create": ["Subscriptions / Create", "Create subscription"],
  "subscription-detail": ["Subscriptions / Delivery", "Subscription detail"],
  orchestrations: ["Orchestrations", "Workflow control room"],
  "orchestration-create": ["Orchestrations / Create", "Create workflow"],
  workflows: ["Workflows", "Design and run workflows"],
};

export const dashboardMetrics = [["Active services", "24", "+3 this month", "teal"], ["Pending applications", "186", "12 need review", "blue"], ["Consent grants today", "1,284", "+8.4% vs yesterday", "amber"], ["Error rate", "0.18%", "Within target", "coral"]];
export const dashboardActivity = [["09:42", "Consent policy updated", "Housing support API", "Published"], ["09:18", "Subscription renewed", "Tax authority / Benefits", "Completed"], ["08:56", "Orchestration paused", "Application 8F2A", "Review"], ["08:31", "API key rotated", "Civil registry service", "Completed"]];
export const endpoints = [["Civil Registry API", "Identity & registration", "ACTIVE", "42 ms", "12 endpoints"], ["Housing Support Gateway", "Housing department", "ACTIVE", "86 ms", "8 endpoints"], ["Tax Authority Services", "Revenue department", "DEGRADED", "1.2 s", "16 endpoints"], ["Employment Exchange", "Skills & employment", "UNKNOWN", "—", "6 endpoints"]];
export const policies = [["Housing assistance eligibility", "Revenue", "Housing", "6 fields", "ALLOW"], ["Employment verification", "Skills", "Citizen services", "4 fields", "ALLOW"], ["Property ownership lookup", "Revenue", "Urban development", "3 fields", "REVIEW"]];
export const logs = [["09:47:18", "WARN", "Tax Authority Services", "Upstream response exceeded 1 second", "Open"], ["09:32:04", "ERROR", "Housing Support Gateway", "Connection reset while fetching eligibility", "Open"], ["08:58:46", "INFO", "Consent service", "Daily consent expiry sweep completed", "Resolved"], ["08:41:21", "ERROR", "Employment Exchange", "Endpoint health check returned 503", "Open"]];
export const events = [["application.submitted", "Application submitted", "12 subscribers", "ACTIVE"], ["consent.granted", "Consent granted", "8 subscribers", "ACTIVE"], ["service.fetch.completed", "Service fetch completed", "5 subscribers", "ACTIVE"], ["policy.violation", "Policy violation detected", "3 subscribers", "ACTIVE"]];
export const subscriptions = [["Citizen services audit stream", "application.submitted", "https://audit.gov.in/events", "DELIVERING", "99.8%"], ["Revenue notifications", "consent.granted", "https://revenue.gov.in/hooks", "DELIVERING", "100%"], ["Housing case updates", "service.fetch.completed", "https://housing.gov.in/webhook", "PAUSED", "94.2%"]];
export const workflows = [["New housing application", "EVENT", "4 steps", "RUNNING", "12 today"], ["Consent renewal reminder", "SCHEDULE", "3 steps", "ACTIVE", "Every morning"], ["Cross-department verification", "MANUAL", "6 steps", "PAUSED", "Last run yesterday"]];
