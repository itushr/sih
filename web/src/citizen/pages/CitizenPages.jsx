import { useState } from "react";
import { useConfirm } from "../../shared/dialog/ConfirmDialogContext.jsx";

/* ─── F9: Application Detail ──────────────────────────────────── */
const applicationData = {
  "housing-support": {
    title: "Housing support",
    department: "Department of Social Services",
    status: "Under review",
    tone: "amber",
    ref: "HSA-2026-04821",
    submitted: "28 August 2026",
    fields: ["identity.full_name", "contact.phone", "address.residential", "revenue.income_certificate", "address.proof_of_residence", "identity.aadhaar"],
    purpose: "Eligibility assessment for housing assistance under Pradhan Mantri Awas Yojana",
    timeline: [
      ["07 Sep 2026, 09:42", "Department accessed your income record", "Automated verification via GovInterop", "access"],
      ["04 Sep 2026, 14:18", "Application moved to Under Review", "Assigned to case officer D. Patil", "status"],
      ["28 Aug 2026, 11:03", "Application submitted", "All required documents uploaded", "submit"],
      ["28 Aug 2026, 10:45", "Consent granted", "Income and residency data shared with Social Services", "consent"],
    ],
    nextStep: null,
  },
  "childcare-allowance": {
    title: "Childcare allowance",
    department: "Family Services",
    status: "Action needed",
    tone: "coral",
    ref: "FCA-2026-09134",
    submitted: "15 August 2026",
    fields: ["identity.full_name", "contact.phone", "identity.family_composition"],
    purpose: "Childcare support eligibility and disbursement",
    timeline: [
      ["06 Sep 2026, 16:30", "Action required: Upload income proof", "Document needed to proceed", "action"],
      ["02 Sep 2026, 09:12", "Application under preliminary review", "Automated checks passed", "status"],
      ["15 Aug 2026, 13:22", "Application submitted", "Partial documents uploaded", "submit"],
    ],
    nextStep: { label: "Upload income proof", due: "12 Sep 2026" },
  },
  "skill-development": {
    title: "Skill development grant",
    department: "Employment Mission",
    status: "Approved",
    tone: "green",
    ref: "SDG-2026-07653",
    submitted: "10 July 2026",
    fields: ["identity.full_name", "education.qualification", "employment.current_status"],
    purpose: "Skill enhancement programme under Maharashtra Employment Mission",
    timeline: [
      ["01 Sep 2026, 10:00", "Grant approved and disbursement initiated", "₹15,000 to linked bank account", "approve"],
      ["20 Aug 2026, 14:30", "Verification complete", "All documents verified by Employment Mission", "status"],
      ["10 Jul 2026, 09:15", "Application submitted", "All required documents uploaded", "submit"],
      ["10 Jul 2026, 09:10", "Consent granted", "Education and employment data shared", "consent"],
    ],
    nextStep: null,
  },
};

export function ApplicationDetailPage({ applicationId, onBack }) {
  const app = applicationData[applicationId] || applicationData["housing-support"];

  return (
    <section className="citizen-detail-page">
      <button className="back-link" type="button" onClick={onBack}>← Applications</button>
      <div className="citizen-detail-header">
        <span className={`service-badge ${app.tone}`}>{app.title.slice(0, 1)}</span>
        <div>
          <span className="eyebrow">Application / {app.department}</span>
          <h2>{app.title}</h2>
          <span className="ref-code">{app.ref}</span>
        </div>
        <span className={`status-tag ${app.tone}`}>{app.status}</span>
      </div>

      {app.nextStep && (
        <article className="attention-card">
          <span className="attention-icon">!</span>
          <div>
            <strong>{app.nextStep.label}</strong>
            <p>{app.department} · {app.title}</p>
            <button className="text-button" type="button">Continue application →</button>
          </div>
          <span className="due-label">Due {app.nextStep.due}</span>
        </article>
      )}

      <div className="citizen-detail-grid">
        <section className="citizen-panel">
          <span className="eyebrow">Application details</span>
          <h3>What was shared</h3>
          <div className="detail-list">
            <div><span>Department</span><strong>{app.department}</strong></div>
            <div><span>Purpose</span><strong>{app.purpose}</strong></div>
            <div><span>Submitted</span><strong>{app.submitted}</strong></div>
            <div><span>Reference</span><strong>{app.ref}</strong></div>
          </div>
          <div className="field-chips">
            <span className="eyebrow">Shared data fields</span>
            <div>{app.fields.map((f) => <code key={f}>{f}</code>)}</div>
          </div>
        </section>

        <section className="citizen-panel">
          <span className="eyebrow">Application timeline</span>
          <h3>Activity log</h3>
          <div className="app-timeline">
            {app.timeline.map(([time, title, detail, type]) => (
              <article className={`timeline-entry ${type}`} key={time}>
                <time>{time}</time>
                <span className="timeline-dot" />
                <div>
                  <strong>{title}</strong>
                  <p>{detail}</p>
                </div>
              </article>
            ))}
          </div>
          <small className="audit-note">All events recorded in GovInterop audit ledger</small>
        </section>
      </div>
    </section>
  );
}

/* ─── F10: Linked Services Management ─────────────────────────── */
const serviceDetails = [
  {
    name: "Department of Social Services",
    description: "Housing support, welfare benefits, and social assistance programmes",
    status: "Connected",
    since: "28 Aug 2026",
    consents: 3,
    lastAccess: "Today, 09:42",
    endpoints: ["Eligibility check", "Income verification", "Application status"],
    tone: "mint",
  },
  {
    name: "Family Services",
    description: "Childcare support, family composition records, and allowance disbursement",
    status: "Connected",
    since: "15 Aug 2026",
    consents: 2,
    lastAccess: "Yesterday, 16:30",
    endpoints: ["Family verification", "Allowance calculation"],
    tone: "peach",
  },
  {
    name: "Transport Authority",
    description: "Address records, vehicle registration, and driving licence verification",
    status: "Pending review",
    since: "06 Sep 2026",
    consents: 1,
    lastAccess: "06 Sep 2026",
    endpoints: ["Address lookup"],
    tone: "blue",
  },
  {
    name: "Employment Mission",
    description: "Skill development, employment exchange, and grant disbursement",
    status: "Connected",
    since: "10 Jul 2026",
    consents: 1,
    lastAccess: "01 Sep 2026",
    endpoints: ["Qualification verification", "Grant status", "Employment check"],
    tone: "sage",
  },
];

export function LinkedServicesPage() {
  const confirm = useConfirm();
  const [services, setServices] = useState(serviceDetails);
  const [selected, setSelected] = useState(null);

  const handleUnlink = async (name) => {
    const ok = await confirm({
      title: "Unlink Connected Service?",
      message: `Unlinking "${name}" will revoke all active consents and stop all data exchange. This action is recorded in your audit log. You can re-link at any time.`,
      confirmText: "Unlink service",
      cancelText: "Keep linked",
      tone: "danger",
    });
    if (ok) {
      setServices((prev) => prev.filter((s) => s.name !== name));
      setSelected(null);
    }
  };

  if (selected !== null) {
    const svc = services[selected];
    return (
      <section className="citizen-detail-page">
        <button className="back-link" type="button" onClick={() => setSelected(null)}>← Linked Services</button>
        <div className="citizen-detail-header">
          <span className={`service-badge ${svc.tone}`}>{svc.name.slice(0, 1)}</span>
          <div>
            <span className="eyebrow">Connected service</span>
            <h2>{svc.name}</h2>
          </div>
          <span className="status-tag green">● {svc.status}</span>
        </div>
        <div className="citizen-detail-grid">
          <section className="citizen-panel">
            <span className="eyebrow">Service details</span>
            <h3>Connection information</h3>
            <div className="detail-list">
              <div><span>Connected since</span><strong>{svc.since}</strong></div>
              <div><span>Last data access</span><strong>{svc.lastAccess}</strong></div>
              <div><span>Active consents</span><strong>{svc.consents}</strong></div>
              <div><span>Description</span><strong>{svc.description}</strong></div>
            </div>
          </section>
          <section className="citizen-panel">
            <span className="eyebrow">Available endpoints</span>
            <h3>What this service can do</h3>
            <div className="endpoint-list">
              {svc.endpoints.map((ep) => (
                <div className="endpoint-row" key={ep}>
                  <span className="endpoint-dot" />
                  <strong>{ep}</strong>
                  <span className="status-tag green">Available</span>
                </div>
              ))}
            </div>
            <div className="service-actions">
              <button className="outline-button" type="button" onClick={() => handleUnlink(svc.name)}>Unlink service</button>
            </div>
          </section>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="section-intro">
        <div>
          <span className="eyebrow">Connected services</span>
          <h2>Your linked services</h2>
          <p>Every department connection, its data access, and your active consents — in one place.</p>
        </div>
        <button className="solid-button compact" type="button">＋ Link a service</button>
      </div>
      <section className="service-summary-bar">
        <div><strong>{services.length}</strong><span>services linked</span></div>
        <div><strong>{services.reduce((sum, s) => sum + s.consents, 0)}</strong><span>active consents</span></div>
        <div><strong>{services.filter((s) => s.status === "Connected").length}</strong><span>fully connected</span></div>
      </section>
      <div className="service-detail-grid">
        {services.map((svc, index) => (
          <article className="service-detail-card" key={svc.name}>
            <div className="service-card-top">
              <span className={`service-badge ${svc.tone}`}>{svc.name.slice(0, 1)}</span>
              <span className={`status-tag ${svc.status === "Connected" ? "green" : "amber"}`}>● {svc.status}</span>
            </div>
            <h3>{svc.name}</h3>
            <p>{svc.description}</p>
            <div className="service-card-meta">
              <span>{svc.consents} consent{svc.consents !== 1 ? "s" : ""}</span>
              <span>Since {svc.since}</span>
            </div>
            <div className="service-card-actions">
              <button className="text-button" type="button" onClick={() => setSelected(index)}>View details →</button>
              <button className="text-button danger" type="button" onClick={() => handleUnlink(svc.name)}>Unlink</button>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}

/* ─── F11: Audits ─────────────────────────────────────────────── */
const auditEntries = [
  { time: "07 Sep 2026, 09:42", actor: "Social Services", action: "Data accessed", target: "Income record", fields: ["revenue.income_certificate"], purpose: "Housing eligibility verification", consent: "Active", anomaly: false },
  { time: "06 Sep 2026, 16:30", actor: "Family Services", action: "Document request", target: "Income proof", fields: ["revenue.income_certificate"], purpose: "Childcare allowance processing", consent: "Active", anomaly: false },
  { time: "06 Sep 2026, 10:15", actor: "Transport Authority", action: "Consent requested", target: "Address record", fields: ["address.residential"], purpose: "Address verification for licence renewal", consent: "Pending", anomaly: false },
  { time: "05 Sep 2026, 14:22", actor: "You", action: "Consent granted", target: "Family Services", fields: ["identity.family_composition"], purpose: "Childcare support application", consent: "Granted", anomaly: false },
  { time: "04 Sep 2026, 11:08", actor: "Social Services", action: "Application status change", target: "Housing support", fields: [], purpose: "Case officer assignment", consent: "N/A", anomaly: false },
  { time: "01 Sep 2026, 10:00", actor: "Employment Mission", action: "Grant approved", target: "Skill development grant", fields: ["employment.current_status"], purpose: "Grant disbursement", consent: "Active", anomaly: false },
  { time: "29 Aug 2026, 09:30", actor: "Unknown IP (flagged)", action: "Access attempt blocked", target: "Aadhaar record", fields: ["identity.aadhaar"], purpose: "Unverified request", consent: "None", anomaly: true },
  { time: "28 Aug 2026, 11:03", actor: "You", action: "Application submitted", target: "Housing support", fields: ["identity.full_name", "address.residential", "revenue.income_certificate"], purpose: "Housing assistance application", consent: "Granted", anomaly: false },
];

export function AuditsPage() {
  const [filter, setFilter] = useState("ALL");
  const [search, setSearch] = useState("");

  const filtered = auditEntries.filter((entry) => {
    const matchesFilter = filter === "ALL" || (filter === "ANOMALY" && entry.anomaly) || (filter === "CONSENT" && entry.action.toLowerCase().includes("consent")) || (filter === "ACCESS" && entry.action.toLowerCase().includes("access"));
    const matchesSearch = `${entry.actor} ${entry.action} ${entry.target}`.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <>
      <div className="section-intro">
        <div>
          <span className="eyebrow">Audit trail</span>
          <h2>Your complete data record</h2>
          <p>Every access, consent change, and department interaction — transparently logged and immutable.</p>
        </div>
        <button className="outline-button" type="button">Export audit log ↓</button>
      </div>

      <section className="audit-summary">
        <div><strong>{auditEntries.length}</strong><span>total events</span></div>
        <div><strong>{auditEntries.filter((e) => e.anomaly).length}</strong><span>flagged anomalies</span></div>
        <div><strong>{auditEntries.filter((e) => e.action.includes("Consent")).length}</strong><span>consent events</span></div>
        <div><strong>{auditEntries.filter((e) => e.action.includes("accessed")).length}</strong><span>data accesses</span></div>
      </section>

      <div className="audit-filters">
        <label>Search
          <input value={search} onChange={(e) => setSearch(e.target.value)} placeholder="Actor, action, or target" />
        </label>
        <label>Filter
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All events</option>
            <option value="ACCESS">Data access</option>
            <option value="CONSENT">Consent changes</option>
            <option value="ANOMALY">Anomalies only</option>
          </select>
        </label>
      </div>

      <div className="audit-list">
        {filtered.length ? filtered.map((entry) => (
          <article className={`audit-row ${entry.anomaly ? "anomaly" : ""}`} key={`${entry.time}-${entry.action}`}>
            <time>{entry.time}</time>
            <div className="audit-main">
              <div className="audit-heading">
                <strong>{entry.action}</strong>
                {entry.anomaly && <span className="status-tag coral">⚠ Anomaly</span>}
              </div>
              <span>by <b>{entry.actor}</b> → {entry.target}</span>
              <small>Purpose: {entry.purpose}</small>
              {entry.fields.length > 0 && (
                <div className="audit-fields">
                  {entry.fields.map((f) => <code key={f}>{f}</code>)}
                </div>
              )}
            </div>
            <span className={`consent-status ${entry.consent === "Active" || entry.consent === "Granted" ? "active" : entry.consent === "Pending" ? "review" : "revoked"}`}>
              Consent: {entry.consent}
            </span>
          </article>
        )) : (
          <div className="registry-empty">
            <strong>No audit entries found</strong>
            <span>Try adjusting your search or filter.</span>
          </div>
        )}
      </div>
      <small className="audit-note">All entries are cryptographically signed and stored in the GovInterop immutable ledger. Entries cannot be modified or deleted.</small>
    </>
  );
}

/* ─── F12: Fetch (Cross-department data retrieval) ────────────── */
const fetchHistory = [
  { id: "FTX-001", source: "Social Services", target: "Revenue Department", fields: ["revenue.income_certificate"], status: "COMPLETED", time: "07 Sep, 09:42", latency: "1.2s" },
  { id: "FTX-002", source: "Family Services", target: "Identity Authority", fields: ["identity.family_composition"], status: "COMPLETED", time: "06 Sep, 16:30", latency: "0.8s" },
  { id: "FTX-003", source: "Transport Authority", target: "Address Registry", fields: ["address.residential"], status: "PENDING", time: "06 Sep, 10:15", latency: "—" },
  { id: "FTX-004", source: "Employment Mission", target: "Education Board", fields: ["education.qualification"], status: "COMPLETED", time: "01 Sep, 10:00", latency: "2.1s" },
  { id: "FTX-005", source: "Social Services", target: "Identity Authority", fields: ["identity.aadhaar"], status: "FAILED", time: "29 Aug, 09:30", latency: "—" },
];

export function FetchPage() {
  const [activeRequest, setActiveRequest] = useState(null);
  const confirm = useConfirm();

  const handleRevoke = async (id) => {
    const ok = await confirm({
      title: "Revoke Fetch Consent?",
      message: `Revoking consent for fetch ${id} will block further data retrieval for this request. This action is logged permanently.`,
      confirmText: "Revoke consent",
      tone: "danger",
    });
    if (ok) {
      setActiveRequest(null);
    }
  };

  if (activeRequest !== null) {
    const req = fetchHistory[activeRequest];
    return (
      <section className="citizen-detail-page">
        <button className="back-link" type="button" onClick={() => setActiveRequest(null)}>← Fetch History</button>
        <div className="citizen-detail-header">
          <span className="fetch-icon">⤶</span>
          <div>
            <span className="eyebrow">Data fetch / {req.id}</span>
            <h2>{req.source} → {req.target}</h2>
          </div>
          <span className={`status-tag ${req.status === "COMPLETED" ? "green" : req.status === "PENDING" ? "amber" : "coral"}`}>{req.status}</span>
        </div>
        <div className="citizen-detail-grid">
          <section className="citizen-panel">
            <span className="eyebrow">Fetch details</span>
            <h3>What was retrieved</h3>
            <div className="detail-list">
              <div><span>Requesting department</span><strong>{req.source}</strong></div>
              <div><span>Source system</span><strong>{req.target}</strong></div>
              <div><span>Fetch time</span><strong>{req.time}</strong></div>
              <div><span>Latency</span><strong>{req.latency}</strong></div>
              <div><span>Transaction ID</span><strong>{req.id}</strong></div>
            </div>
            <div className="field-chips">
              <span className="eyebrow">Retrieved fields</span>
              <div>{req.fields.map((f) => <code key={f}>{f}</code>)}</div>
            </div>
          </section>
          <section className="citizen-panel">
            <span className="eyebrow">Consent & governance</span>
            <h3>Your control</h3>
            <p className="fetch-consent-note">
              This data retrieval was performed under your explicit consent. You can revoke consent at any time — this immediately blocks further access.
            </p>
            {req.status !== "FAILED" && (
              <button className="outline-button" type="button" onClick={() => handleRevoke(req.id)}>Revoke consent for this fetch</button>
            )}
          </section>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="section-intro">
        <div>
          <span className="eyebrow">Data fetch history</span>
          <h2>Cross-department data retrieval</h2>
          <p>Every time a department fetches your data from another system, it appears here — with full consent traceability.</p>
        </div>
      </div>

      <div className="fetch-callout">
        <span>◎</span>
        <div>
          <strong>Your data only moves with your consent.</strong>
          <p>Each fetch is verified against your active consent grants before any data leaves the source system.</p>
        </div>
      </div>

      <section className="fetch-summary">
        <div><strong>{fetchHistory.filter((f) => f.status === "COMPLETED").length}</strong><span>completed</span></div>
        <div><strong>{fetchHistory.filter((f) => f.status === "PENDING").length}</strong><span>pending</span></div>
        <div><strong>{fetchHistory.filter((f) => f.status === "FAILED").length}</strong><span>blocked / failed</span></div>
      </section>

      <div className="fetch-list">
        {fetchHistory.map((req, index) => (
          <article className="fetch-row" key={req.id}>
            <div className="fetch-flow">
              <span className="fetch-dept">{req.source}</span>
              <span className="fetch-arrow">→</span>
              <span className="fetch-dept">{req.target}</span>
            </div>
            <div className="fetch-meta">
              <code>{req.fields.join(", ")}</code>
              <time>{req.time}</time>
            </div>
            <span className={`status-tag ${req.status === "COMPLETED" ? "green" : req.status === "PENDING" ? "amber" : "coral"}`}>{req.status}</span>
            <button className="row-arrow" type="button" aria-label={`View fetch ${req.id}`} onClick={() => setActiveRequest(index)}>→</button>
          </article>
        ))}
      </div>
    </>
  );
}

/* ─── F13: Consent Management (PIN-gated) ─────────────────────── */
const consentGrants = [
  { id: "CON-001", department: "Social Services", fields: ["revenue.income_certificate", "address.residential", "identity.aadhaar"], purpose: "Housing eligibility assessment", duration: "Until 30 Sep 2026", granted: "28 Aug 2026", status: "Active" },
  { id: "CON-002", department: "Social Services", fields: ["identity.full_name", "contact.phone"], purpose: "Application communication", duration: "Until 30 Sep 2026", granted: "28 Aug 2026", status: "Active" },
  { id: "CON-003", department: "Family Services", fields: ["identity.family_composition", "contact.phone"], purpose: "Childcare allowance processing", duration: "Until 31 Dec 2026", granted: "15 Aug 2026", status: "Active" },
  { id: "CON-004", department: "Transport Authority", fields: ["address.residential"], purpose: "Address verification for licence renewal", duration: "One-time access", granted: "06 Sep 2026", status: "Review" },
  { id: "CON-005", department: "Employment Mission", fields: ["education.qualification", "employment.current_status"], purpose: "Skill development grant eligibility", duration: "Until 31 Mar 2027", granted: "10 Jul 2026", status: "Active" },
  { id: "CON-006", department: "Revenue Department", fields: ["identity.full_name", "address.residential"], purpose: "Property tax assessment", duration: "Until 31 Dec 2025", granted: "10 Jan 2025", status: "Expired" },
];

export function ConsentManagementPage() {
  const confirmDialog = useConfirm();
  const [consents, setConsents] = useState(consentGrants);
  const [pinVerified, setPinVerified] = useState(false);
  const [pinInput, setPinInput] = useState("");
  const [pinError, setPinError] = useState(null);
  const [selected, setSelected] = useState(null);
  const [filter, setFilter] = useState("ALL");

  const verifyPin = () => {
    if (pinInput.length === 4) {
      setPinVerified(true);
      setPinError(null);
    } else {
      setPinError("Enter your 4-digit GovInterop PIN");
    }
  };

  if (!pinVerified) {
    return (
      <section className="pin-gate">
        <div className="pin-card">
          <span className="pin-icon">◎</span>
          <h2>Verify your identity</h2>
          <p>Enter your 4-digit GovInterop PIN to access and manage your consent choices.</p>
          <div className="pin-input-row">
            {[0, 1, 2, 3].map((i) => (
              <input
                key={i}
                className="pin-digit"
                type="password"
                maxLength="1"
                value={pinInput[i] || ""}
                onChange={(e) => {
                  const val = e.target.value.replace(/\D/g, "");
                  if (val.length <= 1) {
                    const next = pinInput.split("");
                    next[i] = val;
                    setPinInput(next.join(""));
                    if (val && i < 3) {
                      const nextInput = e.target.parentElement.children[i + 1];
                      if (nextInput) nextInput.focus();
                    }
                  }
                }}
                onKeyDown={(e) => {
                  if (e.key === "Backspace" && !pinInput[i] && i > 0) {
                    const prevInput = e.target.parentElement.children[i - 1];
                    if (prevInput) prevInput.focus();
                  }
                }}
                aria-label={`PIN digit ${i + 1}`}
              />
            ))}
          </div>
          {pinError && <span className="pin-error">{pinError}</span>}
          <button className="solid-button" type="button" onClick={verifyPin}>Verify & continue</button>
          <small>Your PIN is never sent to any department. It stays within GovInterop.</small>
        </div>
      </section>
    );
  }

  const handleRevoke = async (consent) => {
    const ok = await confirmDialog({
      title: "Revoke Data Consent?",
      message: `Revoking consent "${consent.id}" will immediately stop ${consent.department} from accessing your ${consent.fields.join(", ")} data. This is permanently recorded.`,
      confirmText: "Revoke consent",
      cancelText: "Keep active",
      tone: "danger",
    });
    if (ok) {
      setConsents((prev) => prev.map((c) => c.id === consent.id ? { ...c, status: "Revoked" } : c));
    }
  };

  const handleGrant = async (consent) => {
    const ok = await confirmDialog({
      title: "Grant Data Consent?",
      message: `Allow ${consent.department} to access your ${consent.fields.join(", ")} for "${consent.purpose}"?`,
      confirmText: "Grant consent",
      tone: "standard",
    });
    if (ok) {
      setConsents((prev) => prev.map((c) => c.id === consent.id ? { ...c, status: "Active" } : c));
    }
  };

  const filtered = consents.filter((c) => filter === "ALL" || c.status.toUpperCase() === filter);

  if (selected !== null) {
    const consent = consents[selected];
    return (
      <section className="citizen-detail-page">
        <button className="back-link" type="button" onClick={() => setSelected(null)}>← Consent Centre</button>
        <div className="citizen-detail-header">
          <span className="consent-icon">◎</span>
          <div>
            <span className="eyebrow">Consent grant / {consent.id}</span>
            <h2>{consent.department}</h2>
          </div>
          <span className={`status-tag ${consent.status === "Active" ? "green" : consent.status === "Review" ? "amber" : "coral"}`}>{consent.status}</span>
        </div>
        <div className="citizen-detail-grid">
          <section className="citizen-panel">
            <span className="eyebrow">Consent details</span>
            <h3>What you agreed to</h3>
            <div className="detail-list">
              <div><span>Department</span><strong>{consent.department}</strong></div>
              <div><span>Purpose</span><strong>{consent.purpose}</strong></div>
              <div><span>Duration</span><strong>{consent.duration}</strong></div>
              <div><span>Granted on</span><strong>{consent.granted}</strong></div>
              <div><span>Consent ID</span><strong>{consent.id}</strong></div>
            </div>
            <div className="field-chips">
              <span className="eyebrow">Shared data fields</span>
              <div>{consent.fields.map((f) => <code key={f}>{f}</code>)}</div>
            </div>
          </section>
          <section className="citizen-panel">
            <span className="eyebrow">Your choice</span>
            <h3>Manage this consent</h3>
            <p className="consent-manage-note">Revoking consent takes effect immediately. The department will no longer be able to access the listed fields through GovInterop.</p>
            <div className="consent-detail-actions">
              {consent.status === "Active" && (
                <button className="outline-button" type="button" onClick={() => handleRevoke(consent)}>Revoke consent</button>
              )}
              {(consent.status === "Review" || consent.status === "Expired" || consent.status === "Revoked") && (
                <button className="solid-button compact" type="button" onClick={() => handleGrant(consent)}>Grant consent</button>
              )}
            </div>
          </section>
        </div>
      </section>
    );
  }

  return (
    <>
      <div className="section-intro">
        <div>
          <span className="eyebrow">Consent centre</span>
          <h2>Your data, your choice</h2>
          <p>Every consent grant — who accesses what, for how long, and why. Revoke instantly.</p>
        </div>
      </div>

      <div className="consent-banner">
        <span>◎</span>
        <div>
          <strong>Consent is always yours to change.</strong>
          <p>Revoking consent takes effect immediately and is permanently recorded in your audit trail under DPDP guidelines.</p>
        </div>
        <button className="text-button" type="button">Learn more →</button>
      </div>

      <section className="consent-summary">
        <div><strong>{consents.filter((c) => c.status === "Active").length}</strong><span>active grants</span></div>
        <div><strong>{consents.filter((c) => c.status === "Review").length}</strong><span>pending review</span></div>
        <div><strong>{consents.filter((c) => c.status === "Expired" || c.status === "Revoked").length}</strong><span>expired / revoked</span></div>
      </section>

      <div className="consent-filters">
        <label>Filter
          <select value={filter} onChange={(e) => setFilter(e.target.value)}>
            <option value="ALL">All consents</option>
            <option value="ACTIVE">Active only</option>
            <option value="REVIEW">Pending review</option>
            <option value="EXPIRED">Expired</option>
            <option value="REVOKED">Revoked</option>
          </select>
        </label>
      </div>

      <div className="consent-detail-stack">
        {filtered.map((consent, index) => (
          <article className={`consent-detail-row ${consent.status.toLowerCase()}`} key={consent.id}>
            <div className="consent-row-header">
              <strong>{consent.department}</strong>
              <span className={`status-tag ${consent.status === "Active" ? "green" : consent.status === "Review" ? "amber" : "coral"}`}>{consent.status}</span>
            </div>
            <p>{consent.purpose}</p>
            <div className="consent-row-fields">
              {consent.fields.map((f) => <code key={f}>{f}</code>)}
            </div>
            <div className="consent-row-meta">
              <span>{consent.duration}</span>
              <span>Granted {consent.granted}</span>
            </div>
            <div className="consent-row-actions">
              <button className="text-button" type="button" onClick={() => setSelected(consents.indexOf(consent))}>View details →</button>
              {consent.status === "Active" && (
                <button className="text-button danger" type="button" onClick={() => handleRevoke(consent)}>Revoke</button>
              )}
              {consent.status === "Review" && (
                <button className="text-button" type="button" onClick={() => handleGrant(consent)}>Grant</button>
              )}
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
