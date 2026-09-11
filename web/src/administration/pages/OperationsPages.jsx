import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { logs, errorsDetailed, errorsSummary, auditLogs, eventsDetailed, subscriptionsDetailed, workflows } from "../data/mockData.js";
import { PageIntro, PanelHead, Status } from "../components/AdminShared.jsx";
import { rules } from "../../shared/validation/rules.js";
import { useFormValidation } from "../../shared/validation/useFormValidation.js";
import { FormField, ErrorBanner } from "../../shared/components/FormField.jsx";
import { useConfirm } from "../../shared/dialog/ConfirmDialogContext.jsx";


export function LogsPage() {
  const navigate = useNavigate();
  const [tab, setTab] = useState("errors");
  const [query, setQuery] = useState("");
  const [severity, setSeverity] = useState("ALL");
  const [selectedApiLog, setSelectedApiLog] = useState(null);
  const { critical, high, medium, low } = errorsSummary;
  const total = critical + high + medium + low;

  const filteredErrors = errorsDetailed.filter((e) => {
    const matchQ = (e.service + e.type + e.api + e.id + e.platform).toLowerCase().includes(query.toLowerCase());
    const matchS = severity === "ALL" || e.severity === severity;
    return matchQ && matchS;
  });

  const filteredLogs = logs.filter(([, level, service, msg]) =>
    (service + msg).toLowerCase().includes(query.toLowerCase()) &&
    (severity === "ALL" || level === severity)
  );

  const filteredAudit = auditLogs.filter((log) =>
    (log.time + log.admin + log.action + log.object + log.before + log.after + log.result)
      .toLowerCase()
      .includes(query.toLowerCase())
  );

  return (
    <>
      <div className="mod-intro-bar">
        <div>
          <span className="eyebrow">F3 / Operational signals</span>
          <h2>Errors &amp; Logs</h2>
          <p>Trace service health, delivery events and unresolved incidents across all API channels.</p>
        </div>
      </div>
      <div className="err-summary-cards">
        {[["Critical", critical, "err-critical"], ["High", high, "err-high"], ["Medium", medium, "err-medium"], ["Low", low, "err-low"], ["Total", total, "err-total"]].map(
          ([label, count, cls]) => (
            <div key={label} className={`err-summary-card ${cls}`}>
              <strong>{count}</strong><span>{label}</span>
            </div>
          )
        )}
      </div>
      <div className="err-tab-bar">
        {[["errors", "Errors"], ["api", "API Logs"], ["audit", "Audit Log"]].map(([key, label]) => (
          <button key={key} type="button" className={`err-tab ${tab === key ? "active" : ""}`}
            onClick={() => { setTab(key); setQuery(""); setSeverity("ALL"); }}>
            {label}
          </button>
        ))}
      </div>
      <div className="err-filter-bar flex items-center gap-3 px-7 py-4 w-full">
        <input
          className="err-search flex-1 min-w-0 px-3.5 py-2.5 rounded-lg border border-[#d8e4d2] text-sm bg-white text-[#1a302a] focus:outline-none focus:border-[#2e5b47] focus:ring-1 focus:ring-[#2e5b47]"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder={tab === "audit" ? "Search audit logs by admin, action, object or result..." : "Search by service, API, error ID or type..."}
        />
        {tab !== "audit" && (
          <select
            className="err-select shrink-0 w-44 px-3 py-2.5 rounded-lg border border-[#d8e4d2] text-xs bg-white text-[#1a302a] cursor-pointer"
            value={severity}
            onChange={(e) => setSeverity(e.target.value)}
          >
            <option value="ALL">All severities</option>
            {tab === "errors"
              ? ["CRITICAL", "HIGH", "MEDIUM", "LOW"].map((s) => <option key={s} value={s}>{s}</option>)
              : ["ERROR", "WARN", "INFO"].map((s) => <option key={s} value={s}>{s}</option>)}
          </select>
        )}
      </div>
      {tab === "errors" && (
        <div className="admin-table">
          <div className="table-row table-header errors-grid">
            {["Time", "Service", "Error Type", "Severity", "API / Platform", "Status", ""].map((h) => <span key={h}>{h}</span>)}
          </div>
          {filteredErrors.length === 0 && <div className="registry-empty"><strong>No errors found</strong><span>Adjust search query or severity filter.</span></div>}
          {filteredErrors.map((err) => (
            <div className="table-row errors-grid" key={err.id}>
              <div className="table-primary">
                <strong className={`log-level ${err.severity === "CRITICAL" || err.severity === "HIGH" ? "error" : "warn"}`}>{err.id}</strong>
                <small>{err.time}</small>
              </div>
              <span className="table-muted">{err.service}</span>
              <span className="font-semibold text-xs text-[#1a302a]">{err.type}</span>
              <span className={`err-sev-badge sev-${err.severity.toLowerCase()}`}>{err.severity}</span>
              <div className="flex flex-col">
                <strong className="text-xs font-semibold text-[#1a302a] leading-tight">{err.api}</strong>
                <small className="text-[11px] text-[#7b8980] leading-tight mt-0.5">{err.platform}</small>
              </div>
              <Status tone={err.status === "Resolved" ? "green" : err.status === "Investigating" ? "amber" : "coral"}>{err.status}</Status>
              <button className="row-arrow" type="button" onClick={() => navigate(`/administration/errors-logs/${err.id}`)}>→</button>
            </div>
          ))}
        </div>
      )}
      {tab === "api" && (
        <div className="admin-table">
          <div className="table-row table-header apilogs-grid">
            {["Time / Level", "Service", "Message", "State", ""].map((h) => <span key={h}>{h}</span>)}
          </div>
          {filteredLogs.length === 0 && <div className="registry-empty"><strong>No API logs found</strong><span>Adjust search query or level filter.</span></div>}
          {filteredLogs.map(([time, level, service, message, state], i) => (
            <div className="table-row apilogs-grid" key={`${time}-${service}-${i}`}>
              <div className="table-primary">
                <strong className={`log-level ${level.toLowerCase()}`}>{level}</strong>
                <small>{time} · Today</small>
              </div>
              <span className="table-muted">{service}</span>
              <span className="table-message">{message}</span>
              <Status tone={state === "Open" ? "coral" : "green"}>{state}</Status>
              <button
                className="row-arrow"
                type="button"
                onClick={() => setSelectedApiLog({ time, level, service, message, state, traceId: `TRC-${89230 + i}` })}
              >
                →
              </button>
            </div>
          ))}
        </div>
      )}
      {tab === "audit" && (
        <div className="admin-table">
          <div className="table-row table-header audit-grid">
            {["Time", "Admin", "Action", "Object", "Before", "After", "Result"].map((h) => <span key={h}>{h}</span>)}
          </div>
          {filteredAudit.length === 0 && <div className="registry-empty"><strong>No audit logs found</strong><span>Adjust search query.</span></div>}
          {filteredAudit.map((log) => (
            <div className="table-row audit-grid" key={`${log.time}-${log.action}-${log.object}`}>
              <span className="table-muted">{log.time}</span>
              <span className="font-semibold text-xs text-[#1a302a]">{log.admin}</span>
              <strong className="text-xs text-[#2e5b47]">{log.action}</strong>
              <code className="text-[11px] bg-[#f4f7f2] text-[#173f3b] px-1.5 py-0.5 rounded">{log.object}</code>
              <span className="table-muted text-[11px] font-mono">{log.before}</span>
              <span className="text-[11px] font-mono text-[#1a302a]">{log.after}</span>
              <Status tone={log.result === "Success" ? "green" : "coral"}>{log.result}</Status>
            </div>
          ))}
        </div>
      )}

      {/* API Log Inspection Modal */}
      {selectedApiLog && (
        <div
          style={{
            position: "fixed",
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: "rgba(23, 44, 40, 0.65)",
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            zIndex: 1000,
            padding: "20px",
            backdropFilter: "blur(2px)",
          }}
          role="dialog"
          aria-modal="true"
        >
          <div
            style={{
              background: "#ffffff",
              borderRadius: "10px",
              width: "100%",
              maxWidth: "540px",
              boxShadow: "0 16px 40px rgba(0,0,0,0.22)",
              border: "1px solid #dfe7df",
              overflow: "hidden",
            }}
          >
            <div
              style={{
                padding: "16px 20px",
                borderBottom: "1px solid #dfe7df",
                background: "#f2f5f1",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <div>
                <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", color: "#45645b" }}>
                  API Gateway Telemetry · {selectedApiLog.traceId}
                </span>
                <h3 style={{ margin: 0, fontSize: "16px", color: "#173f3b", fontWeight: "700" }}>{selectedApiLog.service}</h3>
              </div>
              <button
                type="button"
                onClick={() => setSelectedApiLog(null)}
                style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#637c6c", lineHeight: 1 }}
              >
                ×
              </button>
            </div>
            <div style={{ padding: "20px", fontSize: "12.5px", display: "flex", flexDirection: "column", gap: "10px" }}>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #edf1ed", paddingBottom: "8px" }}>
                <span style={{ color: "#7b8980" }}>Log Level:</span>
                <strong className={`log-level ${selectedApiLog.level.toLowerCase()}`}>{selectedApiLog.level}</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #edf1ed", paddingBottom: "8px" }}>
                <span style={{ color: "#7b8980" }}>Recorded Time:</span>
                <strong>{selectedApiLog.time} · Today</strong>
              </div>
              <div style={{ display: "flex", justifyContent: "space-between", borderBottom: "1px solid #edf1ed", paddingBottom: "8px" }}>
                <span style={{ color: "#7b8980" }}>Gateway State:</span>
                <Status tone={selectedApiLog.state === "Open" ? "coral" : "green"}>{selectedApiLog.state}</Status>
              </div>
              <div style={{ paddingTop: "4px" }}>
                <span style={{ color: "#7b8980", display: "block", marginBottom: "4px" }}>Message Details:</span>
                <p style={{ margin: 0, padding: "10px 12px", background: "#f9faf7", borderRadius: "6px", border: "1px solid #edf1eb", fontFamily: "monospace", color: "#1a302a", fontSize: "12px" }}>
                  {selectedApiLog.message}
                </p>
              </div>
            </div>
            <div style={{ padding: "12px 20px", borderTop: "1px solid #dfe7df", display: "flex", justifyContent: "flex-end", background: "#f2f5f1" }}>
              <button className="outline-button" type="button" onClick={() => setSelectedApiLog(null)}>
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}


export function LogDetailPage() {
  const navigate = useNavigate();
  const { logId } = useParams();
  const err = errorsDetailed.find((e) => e.id === logId) || errorsDetailed[Number(logId)] || errorsDetailed[0];
  const [resolved, setResolved] = useState(err.status === "Resolved");

  return (
    <section className="log-detail-page">
      <div className="detail-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/errors-logs")}>← Errors &amp; Logs</button>
        <div className="detail-title-row">
          <span className={`err-sev-badge sev-${err.severity.toLowerCase()}`}>{err.severity}</span>
          <div><span className="eyebrow">{err.id} / {err.service}</span><h2>{err.type}</h2></div>
          <Status tone={resolved ? "green" : err.status === "Investigating" ? "amber" : "coral"}>{resolved ? "Resolved" : err.status}</Status>
        </div>
      </div>
      <div className="log-detail-grid">
        <section className="detail-panel">
          <PanelHead eyebrow="Request context" title="Error timeline" />
          <div className="err-timeline">
            {err.timeline.map((step, i) => (
              <div key={i} className={`err-timeline-step ${step.ok ? "ok" : "fail"}`}>
                <span className="err-tl-dot" />
                <div><strong>{step.event}</strong><small>{step.time}</small></div>
              </div>
            ))}
          </div>
        </section>
        <section className="detail-panel">
          <PanelHead eyebrow="Incident metadata" title="Request details" />
          <div className="detail-list">
            {[["Error ID", err.id], ["Request ID", err.requestId], ["API", err.api], ["Platform", err.platform], ["Service", err.service]].map(([label, val]) => (
              <div key={label}><span>{label}</span><strong>{val}</strong></div>
            ))}
            <div><span>Severity</span><span className={`err-sev-badge sev-${err.severity.toLowerCase()}`}>{err.severity}</span></div>
          </div>
          <button className={resolved ? "outline-button" : "solid-button compact"} type="button"
            style={{ marginTop: "16px" }} onClick={() => setResolved((v) => !v)}>
            {resolved ? "Reopen incident" : "Mark as resolved"}
          </button>
        </section>
      </div>
    </section>
  );
}

export function EventsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const filtered = eventsDetailed.filter((e) =>
    (e.code + e.name + e.publisher).toLowerCase().includes(query.toLowerCase())
  );
  const totalEvents = eventsDetailed.reduce((s, e) => s + e.eventsToday, 0);

  return (
    <>
      <div className="mod-intro-bar">
        <div>
          <span className="eyebrow">F4 / Platform vocabulary</span>
          <h2>Event Registry</h2>
          <p>Define the signals that move work between existing department systems.</p>
        </div>
        <button className="solid-button compact" type="button" onClick={() => navigate("/administration/event-registry/new")}>＋ Register event</button>
      </div>
      <div className="evt-stat-row">
        {[["Active Events", eventsDetailed.filter((e) => e.status === "ACTIVE").length], ["Events Today", totalEvents.toLocaleString()], ["Publishers", "5"], ["Total Subscribers", eventsDetailed.reduce((s, e) => s + e.subscribers, 0)]].map(([label, value]) => (
          <div key={label} className="evt-stat"><strong>{value}</strong><span>{label}</span></div>
        ))}
      </div>
      <div className="err-filter-bar" style={{ marginBottom: "8px" }}>
        <input className="err-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search events..." />
      </div>
      <div className="admin-table">
        <div className="table-row table-header events-grid">
          {["Event Code", "Publisher", "Subscribers", "Events Today", "Version", "Status", ""].map((h) => <span key={h}>{h}</span>)}
        </div>
        {filtered.length === 0 && <div className="registry-empty"><strong>No events found</strong><span>Adjust search query.</span></div>}
        {filtered.map((ev) => (
          <div className="table-row events-grid" key={ev.id}>
            <div className="table-primary">
              <code style={{ fontSize: "12px", color: "#2e5b47", fontWeight: "700" }}>{ev.code}</code>
              <small>{ev.name}</small>
            </div>
            <span className="table-muted">{ev.publisher}</span>
            <span>{ev.subscribers}</span>
            <span>{ev.eventsToday.toLocaleString()}</span>
            <span className="table-muted">{ev.version}</span>
            <Status tone={ev.status === "ACTIVE" ? "green" : "amber"}>{ev.status}</Status>
            <button className="row-arrow" type="button" onClick={() => navigate(`/administration/event-registry/${ev.id}`)}>→</button>
          </div>
        ))}
      </div>
    </>
  );
}

export function EventDetailPage({ page = "event-detail" }) {
  const navigate = useNavigate();
  const { eventId } = useParams();
  const ev = eventsDetailed.find((e) => e.id === eventId || e.code === eventId) || eventsDetailed[Number(eventId)] || eventsDetailed[0];
  const [tab, setTab] = useState("schema");
  const [isEditing, setIsEditing] = useState(page === "event-edit");
  const [eventName, setEventName] = useState(ev.name);
  const [eventStatus, setEventStatus] = useState(ev.status);
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => {
      setIsEditing(false);
      setSaved(false);
    }, 1200);
  };

  return (
    <section className="event-detail-page">
      <div className="detail-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/event-registry")}>← Event Registry</button>
        <div className="detail-title-row">
          <span className="event-mark">⌘</span>
          <div>
            <span className="eyebrow">{ev.publisher} · {ev.id}</span>
            {isEditing ? (
              <input
                className="mt-1 px-3 py-1.5 border border-[#d8e4d2] rounded font-bold text-lg text-[#1a302a]"
                value={eventName}
                onChange={(e) => setEventName(e.target.value)}
              />
            ) : (
              <h2>{eventName}</h2>
            )}
          </div>
          {isEditing ? (
            <select
              className="px-3 py-1 border border-[#d8e4d2] rounded text-xs font-semibold"
              value={eventStatus}
              onChange={(e) => setEventStatus(e.target.value)}
            >
              <option value="ACTIVE">ACTIVE</option>
              <option value="PAUSED">PAUSED</option>
            </select>
          ) : (
            <Status tone={eventStatus === "ACTIVE" ? "green" : "amber"}>{eventStatus}</Status>
          )}
        </div>
      </div>
      <div className="evt-detail-stats">
        {[["Event code", ev.code], ["Version", ev.version], ["Subscribers", ev.subscribers], ["Events today", ev.eventsToday.toLocaleString()]].map(([label, val]) => (
          <div key={label}><strong>{val}</strong><span>{label}</span></div>
        ))}
      </div>
      <div className="err-tab-bar">
        {[["schema", "Schema"], ["subscribers", "Subscribers"]].map(([k, l]) => (
          <button key={k} type="button" className={`err-tab ${tab === k ? "active" : ""}`} onClick={() => setTab(k)}>{l}</button>
        ))}
      </div>
      {tab === "schema" && (
        <div className="detail-panel" style={{ marginTop: "0", border: "none" }}>
          <div className="schema-list">
            <div className="schema-row schema-header"><span>Field name</span><span>Type</span><span>Required</span></div>
            {ev.schema.map((f) => (
              <div className="schema-row" key={f.name}>
                <code style={{ fontWeight: "700", color: "#2e5b47" }}>{f.name}</code>
                <span className="table-muted">{f.type}</span>
                {f.required ? <Status tone="green">Required</Status> : <span className="table-muted">Optional</span>}
              </div>
            ))}
          </div>
        </div>
      )}
      {tab === "subscribers" && (
        <div className="detail-panel" style={{ marginTop: "0", border: "none" }}>
          <p style={{ color: "#7b8980", fontSize: "13px", padding: "12px 0" }}>
            {ev.subscribers} active subscribers are currently listening to <code>{ev.code}</code>.
          </p>
        </div>
      )}
      <div className="detail-actions flex items-center gap-3">
        {isEditing ? (
          <>
            <button className="solid-button compact" type="button" onClick={handleSave}>
              {saved ? "✓ Saved Changes" : "Save Changes"}
            </button>
            <button className="outline-button" type="button" onClick={() => setIsEditing(false)}>Cancel</button>
          </>
        ) : (
          <>
            <button className="outline-button" type="button" onClick={() => setIsEditing(true)}>Edit event</button>
            <button className="solid-button compact" type="button" onClick={() => navigate("/administration/subscriptions/new")}>Create subscription →</button>
          </>
        )}
      </div>
    </section>
  );
}

export function EventCreatePage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState([
    { name: "event_id", type: "UUID", required: true },
    { name: "citizen_reference", type: "String", required: true },
    { name: "timestamp", type: "DateTime", required: true },
  ]);
  const [schemaError, setSchemaError] = useState(null);
  const [saved, setSaved] = useState(false);

  const { getFieldProps, handleSubmit, errors, touched } = useFormValidation({
    initialValues: { name: "Birth Certificate Created", slug: "birth_certificate.created", description: "Published when a birth certificate is registered in the civil registry." },
    validationRules: {
      name: [rules.required("Event name is required."), rules.minLength(3, "Min 3 characters.")],
      slug: [rules.required("Slug is required."), rules.validSlug("Use entity.action format.")],
      description: [rules.required("Description is required."), rules.minLength(10, "Min 10 characters.")],
    },
  });

  const addField = () => setFields((f) => [...f, { name: "", type: "String", required: false }]);
  const removeField = (i) => setFields((f) => f.filter((_, fi) => fi !== i));
  const updateField = (i, key, val) => { setSchemaError(null); setFields((f) => f.map((field, fi) => fi === i ? { ...field, [key]: val } : field)); };
  const preview = JSON.stringify(Object.fromEntries(fields.filter((f) => f.name).map((f) => [f.name, f.type === "DateTime" ? "2026-09-07T09:42:00Z" : f.type === "UUID" ? "uuid-example" : "example"])), null, 2);
  const onRegister = handleSubmit(() => { if (!fields.length) { setSchemaError("Add at least one schema field."); return; } navigate("/administration/event-registry"); });

  return (
    <section className="event-editor-page">
      <div className="event-editor-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/event-registry")}>← Event Registry</button>
        <span className="module-number">F4</span>
        <h2>Register New Event</h2>
        <p>Define a stable event contract that departments and subscriptions can use.</p>
      </div>
      {schemaError && <div style={{ padding: "0 24px 16px" }}><ErrorBanner message={schemaError} /></div>}
      <form noValidate onSubmit={onRegister}>
        <div className="event-editor-grid">
          <section className="event-editor-form">
            <div className="register-section-heading"><span>1. Event identity</span><small>Public contract metadata</small></div>
            <div className="event-form-fields">
              <FormField label="Event name" htmlFor="name" required error={touched.name && errors.name}><input {...getFieldProps("name")} /></FormField>
              <FormField label="Event slug" htmlFor="slug" required hint="e.g. birth_certificate.created" error={touched.slug && errors.slug}><input {...getFieldProps("slug")} /></FormField>
              <FormField label="Description" htmlFor="description" required error={touched.description && errors.description}><textarea rows="3" {...getFieldProps("description")} /></FormField>
            </div>
            <div className="register-section-heading event-fields-heading"><span>2. Payload schema</span><button className="outline-button compact-outline" type="button" onClick={addField}>＋ Add field</button></div>
            {fields.map((field, i) => (
              <div className="event-field-row" key={i}>
                <label>Field name<input value={field.name} onChange={(e) => updateField(i, "name", e.target.value)} /></label>
                <label>Type<select value={field.type} onChange={(e) => updateField(i, "type", e.target.value)}><option>String</option><option>UUID</option><option>Number</option><option>Boolean</option><option>DateTime</option></select></label>
                <label className="required-check"><input checked={field.required} onChange={(e) => updateField(i, "required", e.target.checked)} type="checkbox" /> Required</label>
                <button className="delete-field" type="button" onClick={() => removeField(i)}>✕</button>
              </div>
            ))}
          </section>
          <aside className="event-preview">
            <div className="register-section-heading"><span>3. Example payload</span><Status>JSON</Status></div>
            <pre>{preview}</pre>
          </aside>
        </div>
        <div className="register-footer">
          <span className={saved ? "save-confirmation" : ""}>{saved ? "Draft saved locally" : "Schema changes remain in draft."}</span>
          <div>
            <button className="outline-button" type="button" onClick={() => setSaved(true)}>Save as Draft</button>
            <button className="solid-button compact" type="submit">✓ Register event</button>
          </div>
        </div>
      </form>
    </section>
  );
}

export function SubscriptionsPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const filtered = subscriptionsDetailed.filter((s) =>
    (s.event + s.subscriber + s.publisher + s.id).toLowerCase().includes(query.toLowerCase())
  );
  return (
    <>
      <div className="mod-intro-bar">
        <div>
          <span className="eyebrow">F5 / Delivery channels</span>
          <h2>Subscriptions</h2>
          <p>Monitor connections between published events and their subscriber actions.</p>
        </div>
        <button className="solid-button compact" type="button" onClick={() => navigate("/administration/subscriptions/new")}>＋ New subscription</button>
      </div>
      <div className="evt-stat-row">
        {[["Active", subscriptionsDetailed.filter((s) => s.status === "ACTIVE").length], ["Paused", subscriptionsDetailed.filter((s) => s.status === "PAUSED").length], ["Failed (24h)", 1], ["Pending", 0]].map(([label, value]) => (
          <div key={label} className="evt-stat"><strong>{value}</strong><span>{label}</span></div>
        ))}
      </div>
      <div className="err-filter-bar" style={{ marginBottom: "8px" }}>
        <input className="err-search" value={query} onChange={(e) => setQuery(e.target.value)} placeholder="Search subscriptions by event, subscriber, publisher or ID..." />
      </div>
      <div className="admin-table">
        <div className="table-row table-header subs-grid">{["Event", "Publisher → Subscriber", "Action", "Status", "Last delivery", ""].map((h) => <span key={h}>{h}</span>)}</div>
        {filtered.length === 0 && <div className="registry-empty"><strong>No subscriptions found</strong><span>Adjust search query.</span></div>}
        {filtered.map((sub) => (
          <div className="table-row subs-grid" key={sub.id}>
            <div className="table-primary">
              <code style={{ fontSize: "12px", color: "#2e5b47", fontWeight: "700" }}>{sub.event}</code>
              <small>{sub.id}</small>
            </div>
            <div className="flex flex-col text-xs">
              <span className="font-semibold text-[#1a302a]">{sub.publisher}</span>
              <small className="text-[#7b8980]">→ {sub.subscriber}</small>
            </div>
            <span className="font-medium text-xs text-[#1a302a]">{sub.action}</span>
            <Status tone={sub.status === "ACTIVE" ? "green" : "amber"}>{sub.status}</Status>
            <span className="table-muted text-xs">{sub.deliveries[0]?.time || "—"}</span>
            <button className="row-arrow" type="button" onClick={() => navigate(`/administration/subscriptions/${sub.id}`)}>→</button>
          </div>
        ))}
      </div>
    </>
  );
}

export function SubscriptionDetailPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const { subscriptionId } = useParams();
  const sub = subscriptionsDetailed.find((s) => s.id === subscriptionId) || subscriptionsDetailed[Number(subscriptionId)] || subscriptionsDetailed[0];
  const [paused, setPaused] = useState(sub.status === "PAUSED");
  const [retried, setRetried] = useState(false);

  const handleTogglePause = async () => {
    const action = paused ? "Resume" : "Pause";
    const ok = await confirm({ title: `${action} Subscription?`, message: `${action} deliveries for "${sub.id}"?`, confirmText: `${action} Delivery`, tone: paused ? "standard" : "danger" });
    if (ok) setPaused((v) => !v);
  };

  return (
    <section className="subscription-detail-page">
      <div className="detail-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/subscriptions")}>← Subscriptions</button>
        <div className="detail-title-row">
          <span className="workflow-icon">↗</span>
          <div><span className="eyebrow">{sub.event} / {sub.subscriber}</span><h2>{sub.id}</h2></div>
          <Status tone={paused ? "amber" : "green"}>{paused ? "PAUSED" : "DELIVERING"}</Status>
        </div>
      </div>
      <div className="sub-detail-grid">
        <section className="detail-panel">
          <PanelHead eyebrow="Subscription configuration" title="Delivery details" />
          <div className="detail-list">
            <div><span>Event</span><code style={{ fontSize: "12px" }}>{sub.event}</code></div>
            <div><span>Publisher</span><strong>{sub.publisher}</strong></div>
            <div><span>Subscriber</span><strong>{sub.subscriber}</strong></div>
            <div><span>Action</span><strong>{sub.action}</strong></div>
            {sub.workflow !== "—" && <div><span>Workflow</span><strong>{sub.workflow}</strong></div>}
            <div><span>Retry</span><strong>{sub.retries} attempts · {sub.retryInterval} interval</strong></div>
            <div><span>Created</span><strong>{sub.created}</strong></div>
          </div>
          <div style={{ marginTop: "16px" }}>
            <button className={paused ? "solid-button compact" : "outline-button"} type="button" onClick={handleTogglePause}>
              {paused ? "Resume delivery" : "Pause delivery"}
            </button>
          </div>
        </section>
        <section className="detail-panel">
          <PanelHead eyebrow="Delivery history" title="Recent attempts" />
          {sub.deliveries.length === 0 ? (
            <p style={{ color: "#7b8980", fontSize: "13px", padding: "12px 0" }}>No deliveries — subscription is paused.</p>
          ) : (
            <div className="delivery-history-list">
              {sub.deliveries.map((d) => (
                <div className="delivery-history-row" key={d.id}>
                  <time>{d.time}</time>
                  <span className={`delivery-status ${d.status === "Success" ? "delivered" : "failed"}`}>{d.status}</span>
                  <code style={{ fontSize: "11px" }}>{d.id}</code>
                  <span className="table-muted">{d.duration}</span>
                  {d.status === "Failed" && !retried && (
                    <button className="text-button" type="button" onClick={() => setRetried(true)}>Retry</button>
                  )}
                </div>
              ))}
            </div>
          )}
          {retried && <div className="retry-confirmation">Retry queued for the failed delivery.</div>}
        </section>
      </div>
    </section>
  );
}

export function SubscriptionCreatePage() {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const { values, getFieldProps, handleSubmit, errors, touched } = useFormValidation({
    initialValues: { name: "Vaccination eligibility trigger", event: "BIRTH_CERTIFICATE_CREATED", subscriber: "Vaccination Department", action: "Start Workflow", destination: "https://vaccination.gov.in/events" },
    validationRules: {
      name: [rules.required("Name is required."), rules.minLength(3, "Min 3 characters.")],
      event: [rules.required("Event is required.")],
      subscriber: [rules.required("Subscriber is required.")],
      destination: [rules.required("Destination is required."), rules.validUrl("Must be a valid URL.")],
    },
  });
  const onSave = handleSubmit(() => navigate("/administration/subscriptions"));
  const onDraft = handleSubmit(() => setSaved(true));

  return (
    <section className="subscription-editor-page">
      <div className="subscription-editor-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/subscriptions")}>← Subscriptions</button>
        <span className="module-number">F5</span>
        <h2>Create Subscription</h2>
        <p>Connect a published event to a subscriber action or webhook.</p>
      </div>
      <form noValidate onSubmit={onSave}>
        <div className="subscription-editor-grid">
          <section className="subscription-form">
            <div className="register-section-heading"><span>1. Subscription definition</span><small>Required fields</small></div>
            <div className="subscription-fields">
              <FormField label="Subscription name" htmlFor="name" required error={touched.name && errors.name}><input {...getFieldProps("name")} /></FormField>
              <FormField label="Event to subscribe" htmlFor="event" required error={touched.event && errors.event}>
                <select {...getFieldProps("event")}><option>BIRTH_CERTIFICATE_CREATED</option><option>ADDRESS_UPDATED</option><option>SSC_RESULT_UPDATED</option><option>HEALTH_RECORD_UPDATED</option><option>AADHAAR_LINKED</option></select>
              </FormField>
              <FormField label="Subscriber" htmlFor="subscriber" required error={touched.subscriber && errors.subscriber}><input {...getFieldProps("subscriber")} /></FormField>
              <FormField label="Action" htmlFor="action" required><select {...getFieldProps("action")}><option>Start Workflow</option><option>Call API</option><option>Webhook</option><option>Update Data</option></select></FormField>
              <FormField label="Destination URL" htmlFor="destination" required error={touched.destination && errors.destination}><input {...getFieldProps("destination")} /></FormField>
            </div>
          </section>
          <aside className="subscription-preview">
            <div className="register-section-heading"><span>2. Preview</span><Status>READY</Status></div>
            <div className="delivery-preview-card">
              <span className="workflow-icon">↗</span>
              <strong>{values.event}</strong>
              <small>→ {values.subscriber}</small>
              <div><span>{values.action}</span></div>
            </div>
            <div className="subscription-checklist">
              <strong>Before activating</strong>
              <span>✓ Destination responds to verification</span>
              <span>✓ Event contract is registered</span>
              <span>✓ Access policy allows this connection</span>
            </div>
          </aside>
        </div>
        <div className="register-footer">
          <span className={saved ? "save-confirmation" : ""}>{saved ? "Subscription saved locally" : "Draft not yet activated."}</span>
          <div>
            <button className="outline-button" type="button" onClick={onDraft}>Save as Draft</button>
            <button className="solid-button compact" type="submit">✓ Create subscription</button>
          </div>
        </div>
      </form>
    </section>
  );
}

export function OrchestrationsPage() {
  const navigate = useNavigate();
  return (
    <>
      <PageIntro eyebrow="F7 / Workflow control room" title="Orchestrations"
        description="Coordinate multi-department work without replacing the systems of record."
        action="＋ New workflow" onAction={() => navigate("/administration/orchestrations/new")} />
      <div className="workflow-grid">
        {workflows.map(([name, trigger, steps, state, runs]) => (
          <article className="workflow-card" key={name}>
            <div className="workflow-card-top">
              <span className="workflow-icon">↗</span>
              <Status tone={state === "PAUSED" ? "amber" : "green"}>{state}</Status>
            </div>
            <h3>{name}</h3>
            <p>{trigger} trigger · {steps}</p>
            <div className="workflow-footer"><span>{runs}</span><button className="text-button" type="button">Open workflow →</button></div>
          </article>
        ))}
      </div>
    </>
  );
}

export function OrchestrationCreatePage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [steps, setSteps] = useState([
    { type: "HTTP", name: "Verify application", detail: "Housing Support Gateway" },
    { type: "CONSENT", name: "Request consent", detail: "Income and residency records" },
  ]);
  const [saved, setSaved] = useState(false);
  const [stepError, setStepError] = useState(null);

  const { values, getFieldProps, handleSubmit, errors, touched } = useFormValidation({
    initialValues: { name: "New housing application", trigger: "EVENT", event: "application.submitted", description: "Coordinate review steps after a citizen submits a housing application." },
    validationRules: {
      name: [rules.required("Workflow name is required.")],
      description: [rules.required("Description is required."), rules.minLength(10, "Min 10 characters.")],
    },
  });

  const addStep = () => setSteps((s) => [...s, { type: "HTTP", name: "New step", detail: "Choose a service" }]);
  const updateStep = (i, k, v) => { setStepError(null); setSteps((s) => s.map((step, si) => si === i ? { ...step, [k]: v } : step)); };
  const removeStep = async (i) => {
    const ok = await confirm({ title: "Remove step?", message: `Remove "${steps[i].name}"?`, confirmText: "Remove", tone: "danger" });
    if (ok) setSteps((s) => s.filter((_, si) => si !== i));
  };
  const onSave = handleSubmit(() => { if (!steps.length) { setStepError("Add at least one step."); return; } navigate("/administration/orchestrations"); });

  return (
    <section className="workflow-editor-page">
      <div className="workflow-editor-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/orchestrations")}>← Orchestrations</button>
        <span className="module-number">F7</span>
        <h2>Create Workflow</h2>
        <p>Turn a cross-department sequence into a visible, reviewable operational flow.</p>
      </div>
      {stepError && <div style={{ padding: "0 24px 16px" }}><ErrorBanner message={stepError} /></div>}
      <form noValidate onSubmit={onSave}>
        <div className="workflow-editor-grid">
          <section className="workflow-form">
            <div className="register-section-heading"><span>1. Workflow definition</span><small>Trigger and purpose</small></div>
            <div className="workflow-fields">
              <FormField label="Workflow name" htmlFor="name" required error={touched.name && errors.name}><input {...getFieldProps("name")} /></FormField>
              <FormField label="Trigger type" htmlFor="trigger" required><select {...getFieldProps("trigger")}><option>EVENT</option><option>MANUAL</option><option>SCHEDULE</option></select></FormField>
              <FormField label="Trigger event" htmlFor="event" required><select {...getFieldProps("event")}><option>application.submitted</option><option>consent.granted</option><option>service.fetch.completed</option></select></FormField>
              <FormField label="Description" htmlFor="description" required error={touched.description && errors.description}><textarea rows="3" {...getFieldProps("description")} /></FormField>
            </div>
            <div className="register-section-heading workflow-steps-heading">
              <span>2. Steps</span>
              <button className="outline-button compact-outline" type="button" onClick={addStep}>＋ Add step</button>
            </div>
            {steps.map((step, i) => (
              <div className="workflow-step-row" key={i}>
                <span className="workflow-step-number">{String(i + 1).padStart(2, "0")}</span>
                <label>Name<input value={step.name} onChange={(e) => updateStep(i, "name", e.target.value)} /></label>
                <label>Action<select value={step.type} onChange={(e) => updateStep(i, "type", e.target.value)}><option>HTTP</option><option>CONSENT</option><option>NOTIFY</option></select></label>
                <label>Target<input value={step.detail} onChange={(e) => updateStep(i, "detail", e.target.value)} /></label>
                <button className="delete-field" type="button" onClick={() => removeStep(i)}>✕</button>
              </div>
            ))}
          </section>
          <aside className="workflow-preview">
            <div className="register-section-heading"><span>3. Run preview</span><Status>READY</Status></div>
            <div className="workflow-flow">
              <div className="flow-trigger">{values.event}</div>
              {steps.map((step, i) => (
                <div className="flow-step" key={i}><span>{String(i + 1).padStart(2, "0")}</span><div><strong>{step.name}</strong><small>{step.type} · {step.detail}</small></div></div>
              ))}
            </div>
          </aside>
        </div>
        <div className="register-footer">
          <span className={saved ? "save-confirmation" : ""}>{saved ? "Saved locally" : "Workflow remains a local draft."}</span>
          <div>
            <button className="outline-button" type="button" onClick={() => setSaved(true)}>Save as Draft</button>
            <button className="solid-button compact" type="submit">✓ Create workflow</button>
          </div>
        </div>
      </form>
    </section>
  );
}
