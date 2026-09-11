// ─── Sidebar Navigation (All 7 modules) ────────────────────────
export const adminNavigation = [
  ["overview",      "Dashboard",       "01", "▦", "/administration"],
  ["registry",      "API Registry",    "02", "♧", "/administration/api-registry"],
  ["policies",      "Access Policies", "03", "⬡", "/administration/access-policies"],
  ["logs",          "Errors & Logs",   "04", "◉", "/administration/errors-logs"],
  ["events",        "Event Registry",  "05", "⌘", "/administration/event-registry"],
  ["subscriptions", "Subscriptions",   "06", "▤", "/administration/subscriptions"],
  ["workflows",     "Workflows",       "07", "⌗", "/administration/workflows"],
];

export const pageDetails = {
  overview:              ["Dashboard",          "Good morning, admin."],
  registry:              ["API Registry",        "Connected services"],
  register:              ["API Registry / Register", "Register new API endpoint"],
  "registry-detail":     ["API Registry / Endpoint", "Service endpoint details"],
  "registry-edit":       ["API Registry / Edit", "Edit API endpoint"],
  policies:              ["Access Policies",     "Permission architecture"],
  "policy-create":       ["Access Policies / Create", "Create access policy"],
  logs:                  ["Errors & Logs",       "Operational signals"],
  "log-detail":          ["Errors & Logs / Incident", "Incident detail"],
  events:                ["Event Registry",      "Platform vocabulary"],
  "event-create":        ["Event Registry / Register", "Register new event"],
  "event-detail":        ["Event Registry / Event", "Event contract details"],
  "event-edit":          ["Event Registry / Edit", "Edit event contract"],
  subscriptions:         ["Subscriptions",       "Delivery channels"],
  "subscription-create": ["Subscriptions / Create", "Create subscription"],
  "subscription-detail": ["Subscriptions / Delivery", "Subscription detail"],
  workflows:             ["Workflows",           "Workflow control room"],
  "workflow-create":     ["Workflows / Create",  "Create workflow"],
  orchestrations:        ["Workflows",           "Workflow control room"],
  "orchestration-create":["Workflows / Create",  "Create workflow"],
};

// ─── Dashboard KPIs ─────────────────────────────────────────────
export const dashboardKPIs = [
  { label: "API Requests",   value: "2.84M",  delta: "+8.2%", trend: "up",   tone: "teal",  note: "Last 24 hours" },
  { label: "Success Rate",   value: "99.42%", delta: "+0.4%", trend: "up",   tone: "green", note: "Target: ≥99%" },
  { label: "Error Rate",     value: "0.58%",  delta: "−0.2%", trend: "down", tone: "coral", note: "Within 1% SLA" },
  { label: "Active Events",  value: "128",    delta: "+14",   trend: "up",   tone: "blue",  note: "Published today" },
  { label: "Subscriptions",  value: "346",    delta: "+7",    trend: "up",   tone: "lake",  note: "Active channels" },
  { label: "SLA Compliance", value: "98.7%",  delta: "+0.3%", trend: "up",   tone: "amber", note: "Target: ≥98%" },
];

// ─── System Health ───────────────────────────────────────────────
export const systemHealth = [
  { name: "Interop Gateway",       status: "Healthy",  latency: "42ms",  uptime: "99.98%" },
  { name: "Data Exchange Engine",  status: "Healthy",  latency: "61ms",  uptime: "99.95%" },
  { name: "Transformation Engine", status: "Healthy",  latency: "38ms",  uptime: "99.99%" },
  { name: "Event Engine",          status: "Healthy",  latency: "29ms",  uptime: "99.97%" },
  { name: "Workflow Engine",       status: "Degraded", latency: "1.24s", uptime: "97.82%" },
];

// ─── API Request Chart (bar heights as % of max) ─────────────────
export const chartData = {
  "7d":  [
    { label: "Mon", value: 63, requests: "1.80M" },
    { label: "Tue", value: 74, requests: "2.10M" },
    { label: "Wed", value: 69, requests: "1.95M" },
    { label: "Thu", value: 85, requests: "2.40M" },
    { label: "Fri", value: 92, requests: "2.60M" },
    { label: "Sat", value: 77, requests: "2.20M" },
    { label: "Sun", value: 100, requests: "2.84M" },
  ],
  "30d": [
    { label: "W1", value: 56, requests: "1.60M" },
    { label: "W2", value: 67, requests: "1.90M" },
    { label: "W3", value: 81, requests: "2.30M" },
    { label: "W4", value: 100, requests: "2.84M" },
  ],
  "1d": [
    { label: "00h", value: 39, requests: "1.10M" },
    { label: "06h", value: 63, requests: "1.80M" },
    { label: "12h", value: 88, requests: "2.50M" },
    { label: "18h", value: 100, requests: "2.84M" },
  ],
};

// ─── Error Categories ────────────────────────────────────────────
export const errorCategories = [
  { name: "Authentication",  count: 24, pct: 41 },
  { name: "Timeout",         count: 17, pct: 29 },
  { name: "Validation",      count: 9,  pct: 16 },
  { name: "Transformation",  count: 5,  pct: 9  },
  { name: "Provider",        count: 3,  pct: 5  },
];

// ─── Recent Events Feed ──────────────────────────────────────────
export const recentEventsFeed = [
  { code: "BIRTH_CERTIFICATE_CREATED", time: "2 seconds ago",  publisher: "Civil Registration, Mumbai" },
  { code: "ADDRESS_UPDATED",           time: "14 seconds ago", publisher: "Identity Authority, MH" },
  { code: "SSC_RESULT_UPDATED",        time: "32 seconds ago", publisher: "Maharashtra State Board" },
  { code: "HEALTH_RECORD_UPDATED",     time: "1 min ago",      publisher: "Health Services, Pune" },
  { code: "AADHAAR_LINKED",            time: "2 min ago",      publisher: "UIDAI Gateway" },
];

// ─── Subscription Health Summary ─────────────────────────────────
export const subscriptionHealthSummary = [
  { label: "Active",  count: 326, tone: "green" },
  { label: "Failed",  count: 8,   tone: "coral" },
  { label: "Paused",  count: 5,   tone: "amber" },
  { label: "Pending", count: 7,   tone: "blue"  },
];

// ─── Recent Activity ─────────────────────────────────────────────
export const dashboardActivity = [
  ["12:32", "Access policy modified",    "SSC Result Access Policy v1.2",      "Policies"],
  ["12:29", "Subscription failed",       "Vaccination Dept · BIRTH_CERT",      "Logs"],
  ["12:25", "Event schema updated",      "BIRTH_CERTIFICATE_CREATED v2.0",     "Events"],
  ["12:21", "API timeout detected",      "Health Platform · Get Health Record", "Logs"],
  ["12:17", "New subscription approved", "Scholarship Portal · SSC_RESULT",    "Subscriptions"],
  ["12:09", "Consent policy validated",  "Aadhaar Gateway · Revenue Dept",     "Policies"],
];

// ─── Access Policies ─────────────────────────────────────────────
export const policiesDetailed = [
  {
    id: "POL-001",
    name: "Housing Assistance Eligibility Policy",
    service: "Housing Verification API",
    provider: "Revenue Dept, MH",
    source: "Revenue Dept",
    target: "Housing Authority",
    allowedPlatforms: ["Housing Assistance Portal", "Urban Welfare Gateway"],
    status: "ACTIVE",
    consent: "Required",
    duration: "One Time",
    decision: "ALLOW",
    encryption: true,
    https: true,
    auditLog: true,
    created: "02 Sep 2026",
    modified: "10 Sep 2026",
    version: "v1.2",
    fields: ["citizen_aadhaar_ref", "annual_income", "ration_card_no", "family_members", "domicile_state", "property_owned"],
  },
  {
    id: "POL-002",
    name: "SSC Result Access Policy",
    service: "SSC Result API",
    provider: "Maharashtra State Board",
    source: "Education Board",
    target: "Scholarship Portal",
    allowedPlatforms: ["Education Portal", "Scholarship Portal"],
    status: "ACTIVE",
    consent: "Required",
    duration: "One Time",
    decision: "ALLOW",
    encryption: true,
    https: true,
    auditLog: true,
    created: "02 Sep 2026",
    modified: "10 Sep 2026",
    version: "v1.2",
    fields: ["student_id", "roll_number", "result", "marks", "grade", "year"],
  },
  {
    id: "POL-003",
    name: "Health Data Exchange Policy",
    service: "Health Record API",
    provider: "Health Services Dept",
    source: "Health Dept",
    target: "Vaccination Portal",
    allowedPlatforms: ["Vaccination Platform", "Hospital Registry"],
    status: "ACTIVE",
    consent: "Required",
    duration: "Fixed Period",
    decision: "ALLOW",
    encryption: true,
    https: true,
    auditLog: true,
    created: "05 Sep 2026",
    modified: "09 Sep 2026",
    version: "v1.0",
    fields: ["citizen_id", "health_id", "vaccination_status", "blood_group"],
  },
  {
    id: "POL-004",
    name: "Birth Certificate Access Policy",
    service: "Civil Registration API",
    provider: "Civil Registration, Mumbai",
    source: "Civil Registration",
    target: "Identity Authority",
    allowedPlatforms: ["Vaccination Dept", "Identity Authority"],
    status: "DRAFT",
    consent: "Required",
    duration: "One Time",
    decision: "REVIEW",
    encryption: true,
    https: true,
    auditLog: true,
    created: "10 Sep 2026",
    modified: "10 Sep 2026",
    version: "v0.1",
    fields: ["citizen_reference", "certificate_reference", "birth_date", "parent_id"],
  },
  {
    id: "POL-005",
    name: "Address Update Verification",
    service: "Identity Authority API",
    provider: "Identity Authority, MH",
    source: "Identity Authority",
    target: "PAN Database",
    allowedPlatforms: ["PAN Database", "Electoral Registry"],
    status: "ACTIVE",
    consent: "Not Required",
    duration: "Forever",
    decision: "ALLOW",
    encryption: true,
    https: true,
    auditLog: true,
    created: "01 Sep 2026",
    modified: "08 Sep 2026",
    version: "v2.1",
    fields: ["citizen_id", "address_current", "address_pincode", "district"],
  },
  {
    id: "POL-006",
    name: "Property Ownership Lookup",
    service: "Land Records API",
    provider: "Revenue & Land Survey",
    source: "Revenue Dept",
    target: "Urban Development",
    allowedPlatforms: ["Municipal Corporation", "Urban Land Tribunal"],
    status: "ACTIVE",
    consent: "Required",
    duration: "One Time",
    decision: "REVIEW",
    encryption: true,
    https: true,
    auditLog: true,
    created: "28 Aug 2026",
    modified: "07 Sep 2026",
    version: "v1.4",
    fields: ["property_id", "survey_number", "owner_name", "encumbrance_status"],
  },
];

export const policies = policiesDetailed.map((p) => [
  p.name,
  p.source,
  p.target,
  `${p.fields.length} fields`,
  p.decision,
]);

// ─── Errors & Logs ────────────────────────────────────────────────
export const logs = [
  ["09:47:18", "WARN",  "Tax Authority Services",  "Upstream response exceeded 1 second",        "Open"],
  ["09:32:04", "ERROR", "Housing Support Gateway", "Connection reset while fetching eligibility", "Open"],
  ["08:58:46", "INFO",  "Consent service",         "Daily consent expiry sweep completed",        "Resolved"],
  ["08:41:21", "ERROR", "Employment Exchange",     "Endpoint health check returned 503",          "Open"],
];

export const errorsSummary = { critical: 23, high: 71, medium: 184, low: 329 };

export const errorsDetailed = [
  {
    id: "ERR-98231", time: "12:31:02",
    service: "Health Platform", type: "Provider Timeout", severity: "HIGH", status: "Open",
    api: "Get Health Record", platform: "Vaccination Dept Portal", requestId: "REQ-829312",
    timeline: [
      { time: "12:31:01", event: "Request received",       ok: true },
      { time: "12:31:01", event: "Authentication",         ok: true },
      { time: "12:31:02", event: "Policy validation",      ok: true },
      { time: "12:31:02", event: "Provider request sent",  ok: true },
      { time: "12:31:32", event: "Provider timeout (30s)", ok: false },
      { time: "12:31:32", event: "Retry initiated",        ok: true },
      { time: "12:32:02", event: "Retry failed",           ok: false },
    ],
  },
  {
    id: "ERR-98198", time: "12:29:14",
    service: "SSC Board Gateway", type: "Validation Error", severity: "MEDIUM", status: "Resolved",
    api: "Get SSC Result", platform: "Scholarship Portal", requestId: "REQ-829198",
    timeline: [
      { time: "12:29:10", event: "Request received",   ok: true },
      { time: "12:29:11", event: "Authentication",     ok: true },
      { time: "12:29:11", event: "Payload validation", ok: false },
      { time: "12:29:12", event: "Error logged",       ok: true },
    ],
  },
  {
    id: "ERR-98156", time: "12:25:43",
    service: "PAN Database", type: "Authentication Failed", severity: "HIGH", status: "Investigating",
    api: "Verify PAN", platform: "Income Tax Portal", requestId: "REQ-829156",
    timeline: [
      { time: "12:25:40", event: "Request received",      ok: true },
      { time: "12:25:41", event: "Authentication failed", ok: false },
      { time: "12:25:42", event: "Error logged",          ok: true },
    ],
  },
];

export const auditLogs = [
  { time: "12:31", admin: "Authority User", action: "Updated Access Policy",       object: "SSC_RESULT_POLICY",          before: "Duration = Forever", after: "Duration = One Time", result: "Success" },
  { time: "12:18", admin: "Authority User", action: "Created Subscription",        object: "BIRTH_CERT → Vaccination Dept", before: "—",                after: "Status = Active",     result: "Success" },
  { time: "12:09", admin: "Authority User", action: "Approved Subscription Request", object: "SUB-82934",                before: "Status = Pending",   after: "Status = Active",     result: "Success" },
  { time: "11:54", admin: "Authority User", action: "Paused Subscription",         object: "Health Record Updates",      before: "Status = Active",    after: "Status = Paused",     result: "Success" },
];

// ─── Event Registry ──────────────────────────────────────────────
export const events = [
  ["application.submitted",   "Application Submitted",     "12 subscribers", "ACTIVE"],
  ["consent.granted",         "Consent Granted",           "8 subscribers",  "ACTIVE"],
  ["service.fetch.completed", "Service Fetch Completed",   "5 subscribers",  "ACTIVE"],
  ["policy.violation",        "Policy Violation Detected", "3 subscribers",  "ACTIVE"],
];

export const eventsDetailed = [
  {
    id: "EVT-001", code: "BIRTH_CERTIFICATE_CREATED", name: "Birth Certificate Created",
    publisher: "Civil Registration, Mumbai", subscribers: 8, status: "ACTIVE", version: "v2.0", eventsToday: 1284,
    schema: [
      { name: "event_id",              type: "UUID",     required: true },
      { name: "event_type",            type: "String",   required: true },
      { name: "timestamp",             type: "DateTime", required: true },
      { name: "citizen_reference",     type: "String",   required: true },
      { name: "certificate_reference", type: "String",   required: true },
      { name: "certificate_type",      type: "String",   required: false },
      { name: "source",                type: "String",   required: true },
    ],
  },
  {
    id: "EVT-002", code: "ADDRESS_UPDATED", name: "Address Updated",
    publisher: "Identity Authority, MH", subscribers: 12, status: "ACTIVE", version: "v1.1", eventsToday: 843,
    schema: [
      { name: "event_id",    type: "UUID",     required: true },
      { name: "citizen_id",  type: "String",   required: true },
      { name: "address_new", type: "String",   required: true },
      { name: "address_old", type: "String",   required: false },
      { name: "timestamp",   type: "DateTime", required: true },
    ],
  },
  {
    id: "EVT-003", code: "SSC_RESULT_UPDATED", name: "SSC Result Updated",
    publisher: "Maharashtra State Board", subscribers: 6, status: "ACTIVE", version: "v1.0", eventsToday: 412,
    schema: [
      { name: "event_id",    type: "UUID",     required: true },
      { name: "roll_number", type: "String",   required: true },
      { name: "result",      type: "String",   required: true },
      { name: "marks",       type: "Number",   required: true },
      { name: "year",        type: "String",   required: true },
      { name: "timestamp",   type: "DateTime", required: true },
    ],
  },
  {
    id: "EVT-004", code: "HEALTH_RECORD_UPDATED", name: "Health Record Updated",
    publisher: "Health Services, Pune", subscribers: 4, status: "PAUSED", version: "v1.2", eventsToday: 0,
    schema: [
      { name: "event_id",    type: "UUID",     required: true },
      { name: "health_id",   type: "String",   required: true },
      { name: "citizen_id",  type: "String",   required: true },
      { name: "record_type", type: "String",   required: true },
      { name: "timestamp",   type: "DateTime", required: true },
    ],
  },
  {
    id: "EVT-005", code: "AADHAAR_LINKED", name: "Aadhaar Linked",
    publisher: "UIDAI Gateway", subscribers: 14, status: "ACTIVE", version: "v3.0", eventsToday: 2841,
    schema: [
      { name: "event_id",   type: "UUID",     required: true },
      { name: "masked_uid", type: "String",   required: true },
      { name: "service",    type: "String",   required: true },
      { name: "timestamp",  type: "DateTime", required: true },
    ],
  },
];

// ─── Subscriptions ────────────────────────────────────────────────
export const subscriptions = [
  ["Citizen services audit stream", "application.submitted",   "https://audit.gov.in/events",    "DELIVERING", "99.8%"],
  ["Revenue notifications",          "consent.granted",         "https://revenue.gov.in/hooks",   "DELIVERING", "100%"],
  ["Housing case updates",           "service.fetch.completed", "https://housing.gov.in/webhook", "PAUSED",     "94.2%"],
];

export const subscriptionsDetailed = [
  {
    id: "SUB-82931", event: "BIRTH_CERTIFICATE_CREATED", eventName: "Birth Certificate Created",
    publisher: "Civil Registration, Mumbai", subscriber: "Vaccination Department",
    action: "Start Workflow", workflow: "Vaccination Eligibility Workflow",
    status: "ACTIVE", created: "08 Sep 2026", retries: 3, retryInterval: "5 min",
    deliveries: [
      { id: "EVT-82931", time: "12:31", status: "Success", duration: "320ms" },
      { id: "EVT-82930", time: "12:29", status: "Success", duration: "281ms" },
      { id: "EVT-82929", time: "12:25", status: "Failed",  duration: "30s"   },
      { id: "EVT-82928", time: "12:22", status: "Success", duration: "410ms" },
    ],
  },
  {
    id: "SUB-82920", event: "ADDRESS_UPDATED", eventName: "Address Updated",
    publisher: "Identity Authority, MH", subscriber: "PAN Database",
    action: "Update Data", workflow: "—",
    status: "ACTIVE", created: "06 Sep 2026", retries: 3, retryInterval: "5 min",
    deliveries: [
      { id: "EVT-82821", time: "12:30", status: "Success", duration: "190ms" },
      { id: "EVT-82820", time: "12:26", status: "Success", duration: "175ms" },
    ],
  },
  {
    id: "SUB-82910", event: "SSC_RESULT_UPDATED", eventName: "SSC Result Updated",
    publisher: "Maharashtra State Board", subscriber: "Scholarship Portal",
    action: "Call API", workflow: "—",
    status: "ACTIVE", created: "07 Sep 2026", retries: 3, retryInterval: "10 min",
    deliveries: [
      { id: "EVT-82731", time: "12:28", status: "Success", duration: "520ms" },
      { id: "EVT-82730", time: "12:15", status: "Success", duration: "498ms" },
    ],
  },
  {
    id: "SUB-82905", event: "HEALTH_RECORD_UPDATED", eventName: "Health Record Updated",
    publisher: "Health Services, Pune", subscriber: "National Health Registry",
    action: "Webhook", workflow: "—",
    status: "PAUSED", created: "04 Sep 2026", retries: 3, retryInterval: "15 min",
    deliveries: [],
  },
];

// ─── Legacy/Orchestrations (preserved for existing routes) ────────
export const workflows = [
  ["New housing application",       "EVENT",    "4 steps", "RUNNING", "12 today"],
  ["Consent renewal reminder",      "SCHEDULE", "3 steps", "ACTIVE",  "Every morning"],
  ["Cross-department verification", "MANUAL",   "6 steps", "PAUSED",  "Last run yesterday"],
];

export const endpoints = [
  ["Civil Registry API",      "Identity & registration", "ACTIVE",   "42 ms", "12 endpoints"],
  ["Housing Support Gateway", "Housing department",      "ACTIVE",   "86 ms", "8 endpoints"],
  ["Tax Authority Services",  "Revenue department",      "DEGRADED", "1.2 s", "16 endpoints"],
  ["Employment Exchange",     "Skills & employment",     "UNKNOWN",  "—",     "6 endpoints"],
];

export const dashboardMetrics = [
  ["Active services",      "24",    "+3 this month",      "teal"],
  ["Pending applications", "186",   "12 need review",     "blue"],
  ["Consent grants today", "1,284", "+8.4% vs yesterday", "amber"],
  ["Error rate",           "0.18%", "Within target",      "coral"],
];

