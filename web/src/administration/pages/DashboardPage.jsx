import { useState, useEffect } from "react";
import { PanelHead } from "../components/AdminShared.jsx";

const departmentData = {
  "Platform-wide": {
    metrics: [
      ["Active services", "24", "+3 connected this month", "teal"],
      ["Pending applications", "186", "12 need attention", "blue"],
      ["Cross-dept requests", "4,812", "+14% vs last week", "lake"],
      ["Consent grants today", "1,284", "+8.4% vs yesterday", "amber"],
      ["Error rate", "0.18%", "Within 0.5% SLA", "coral"],
      ["Avg processing time", "420 ms", "p95 under 500ms target", "grove"],
    ],
    activity: [
      ["09:42", "Consent policy updated", "Housing support API", "Published"],
      ["09:18", "Subscription renewed", "Tax authority / Benefits", "Completed"],
      ["08:56", "Orchestration paused", "Application #8F2A (Residency)", "Review"],
      ["08:31", "API key rotated", "Civil registry service", "Completed"],
      ["08:14", "Health check passed", "Employment Exchange Gateway", "Active"],
      ["07:49", "DPDP consent revoked", "Citizen #MH-9021 (Address)", "Logged"],
    ],
    uptime: "99.96%",
    pulse: [42, 58, 48, 70, 61, 78, 67, 88, 72, 91, 80, 97],
  },
  "Housing department": {
    metrics: [
      ["Active services", "8", "Housing Support Gateway live", "teal"],
      ["Pending applications", "64", "4 require document review", "blue"],
      ["Cross-dept requests", "1,420", "Income verification queries", "lake"],
      ["Consent grants today", "412", "Active citizen grants", "amber"],
      ["Error rate", "0.09%", "Optimal reliability", "coral"],
      ["Avg processing time", "280 ms", "Direct gateway latency", "grove"],
    ],
    activity: [
      ["09:42", "Consent policy updated", "Housing support API", "Published"],
      ["08:56", "Orchestration paused", "Application #8F2A (Residency)", "Review"],
      ["07:30", "Bulk eligibility fetch", "Revenue income registry", "Completed"],
    ],
    uptime: "99.98%",
    pulse: [65, 70, 60, 80, 75, 85, 90, 88, 92, 95, 94, 98],
  },
  "Revenue department": {
    metrics: [
      ["Active services", "6", "Tax Authority Services live", "teal"],
      ["Pending applications", "82", "Annual income certifications", "blue"],
      ["Cross-dept requests", "2,190", "High demand from Housing & Skills", "lake"],
      ["Consent grants today", "620", "Financial record consents", "amber"],
      ["Error rate", "0.34%", "Upstream latency spike noted", "coral"],
      ["Avg processing time", "610 ms", "Cached query fallback", "grove"],
    ],
    activity: [
      ["09:18", "Subscription renewed", "Tax authority / Benefits", "Completed"],
      ["08:12", "Gateway timeout warning", "Upstream Tax DB #4", "Open"],
      ["07:15", "Access policy validated", "Housing assistance eligibility", "Active"],
    ],
    uptime: "99.82%",
    pulse: [50, 45, 60, 55, 65, 70, 68, 72, 75, 80, 78, 85],
  },
  "Skills & employment": {
    metrics: [
      ["Active services", "5", "Employment Exchange Gateway", "teal"],
      ["Pending applications", "40", "Skill development grant checks", "blue"],
      ["Cross-dept requests", "1,202", "Certification data feeds", "lake"],
      ["Consent grants today", "252", "Education and trade records", "amber"],
      ["Error rate", "0.12%", "Healthy channel throughput", "coral"],
      ["Avg processing time", "340 ms", "Redis cache hit rate 92%", "grove"],
    ],
    activity: [
      ["08:31", "API key rotated", "Civil registry service", "Completed"],
      ["08:14", "Health check passed", "Employment Exchange Gateway", "Active"],
      ["06:50", "Batch certificate sync", "Technical Board Gateway", "Completed"],
    ],
    uptime: "99.94%",
    pulse: [55, 62, 58, 68, 72, 70, 78, 82, 85, 88, 86, 92],
  },
  "Transport authority": {
    metrics: [
      ["Active services", "5", "Vehicle & Driving License API", "teal"],
      ["Pending applications", "28", "Address change verifications", "blue"],
      ["Cross-dept requests", "890", "Address lookup exchanges", "lake"],
      ["Consent grants today", "190", "Vehicle registration records", "amber"],
      ["Error rate", "0.08%", "Zero downtime today", "coral"],
      ["Avg processing time", "210 ms", "Direct index query", "grove"],
    ],
    activity: [
      ["09:05", "Address verification", "Citizen #MH-4421 approved", "Completed"],
      ["07:49", "DPDP consent revoked", "Citizen #MH-9021 (Address)", "Logged"],
    ],
    uptime: "99.99%",
    pulse: [70, 75, 80, 82, 85, 88, 90, 92, 94, 96, 95, 99],
  },
};

export default function DashboardPage() {
  const [role, setRole] = useState("SUPER_ADMIN");
  const [department, setDepartment] = useState("Platform-wide");
  const [autoPoll, setAutoPoll] = useState(true);
  const [lastSynced, setLastSynced] = useState("Just now");
  const [refreshing, setRefreshing] = useState(false);

  // When role changes to OFFICIAL or DEPT_ADMIN, lock scope to their department
  const handleRoleChange = (newRole) => {
    setRole(newRole);
    if (newRole === "OFFICIAL" || newRole === "DEPT_ADMIN") {
      setDepartment("Housing department");
    } else {
      setDepartment("Platform-wide");
    }
  };

  const handleManualRefresh = () => {
    setRefreshing(true);
    setTimeout(() => {
      setLastSynced("Just now");
      setRefreshing(false);
    }, 450);
  };

  useEffect(() => {
    if (!autoPoll) return;
    const interval = setInterval(() => {
      setLastSynced(new Date().toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" }));
    }, 30000);
    return () => clearInterval(interval);
  }, [autoPoll]);

  const activeDeptData = departmentData[department] || departmentData["Platform-wide"];

  const exportReport = () => {
    const report = [
      "==================================================",
      "GovInterop Official Dashboard Report",
      "==================================================",
      `Role: ${role}`,
      `Department Scope: ${department}`,
      `Generated: ${new Date().toLocaleString()}`,
      `Uptime: ${activeDeptData.uptime}`,
      "",
      "--- KPI METRICS ---",
      ...activeDeptData.metrics.map(([label, value, note]) => `${label}: ${value} (${note})`),
      "",
      "--- RECENT CROSS-DEPARTMENT ACTIVITY ---",
      ...activeDeptData.activity.map(([time, event, subject, status]) => `[${time}] ${event} - ${subject} [${status}]`),
    ].join("\n");

    const link = document.createElement("a");
    link.href = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
    link.download = `govinterop-dashboard-${department.toLowerCase().replace(/\s+/g, "-")}.txt`;
    link.click();
    URL.revokeObjectURL(link.href);
  };

  return (
    <>
      <section className="admin-banner">
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
            <span className="status-live">
              <i className={refreshing ? "spin-indicator" : ""} />
              {refreshing ? "Refreshing..." : "Live overview"}
            </span>
            <span style={{ fontSize: "11px", color: "#45645b", fontWeight: "600" }}>
              Synced: {lastSynced}
            </span>
            <button
              className="text-button"
              type="button"
              onClick={() => setAutoPoll(!autoPoll)}
              style={{ fontSize: "11px", textDecoration: "underline" }}
            >
              {autoPoll ? "● 30s auto-poll active" : "○ Auto-poll paused"}
            </button>
            <button
              className="outline-button compact-outline"
              type="button"
              onClick={handleManualRefresh}
              style={{ padding: "2px 8px", fontSize: "11px" }}
            >
              ↻ Refresh
            </button>
          </div>
          <p style={{ marginTop: "4px" }}>
            {role === "OFFICIAL"
              ? "Scoped to assigned departmental records under DPDP security isolation."
              : role === "DEPT_ADMIN"
              ? "Departmental administration view with policy and API registry controls."
              : "Platform-wide operational telemetry and cross-department interoperability signals."}
          </p>
        </div>

        <div className="dashboard-scope" style={{ display: "flex", gap: "12px", alignItems: "center" }}>
          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <label htmlFor="user-role" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#74847a", fontWeight: "800" }}>
              Active Role
            </label>
            <select
              id="user-role"
              value={role}
              onChange={(e) => handleRoleChange(e.target.value)}
              style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #dfe7df", background: "#ffffff", fontWeight: "700", color: "#173f3b" }}
            >
              <option value="SUPER_ADMIN">SUPER_ADMIN (All depts)</option>
              <option value="DEPT_ADMIN">DEPT_ADMIN (Housing)</option>
              <option value="OFFICIAL">OFFICIAL (Housing)</option>
            </select>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
            <label htmlFor="department-scope" style={{ fontSize: "10px", textTransform: "uppercase", letterSpacing: "0.08em", color: "#74847a", fontWeight: "800" }}>
              Department Scope
            </label>
            {role === "OFFICIAL" || role === "DEPT_ADMIN" ? (
              <div
                id="department-scope"
                style={{
                  padding: "5px 12px",
                  borderRadius: "6px",
                  background: "#e6efe1",
                  color: "#23483f",
                  fontWeight: "700",
                  fontSize: "13px",
                  border: "1px solid #dbe5da",
                  display: "flex",
                  alignItems: "center",
                  gap: "6px"
                }}
              >
                <span>🔒</span> {department}
              </div>
            ) : (
              <select
                id="department-scope"
                value={department}
                onChange={(event) => setDepartment(event.target.value)}
                style={{ padding: "5px 10px", borderRadius: "6px", border: "1px solid #dfe7df", background: "#ffffff", fontWeight: "700", color: "#173f3b" }}
              >
                <option>Platform-wide</option>
                <option>Housing department</option>
                <option>Revenue department</option>
                <option>Skills &amp; employment</option>
                <option>Transport authority</option>
              </select>
            )}
          </div>
        </div>
      </section>

      {/* Role restriction banner for OFFICIAL */}
      {role === "OFFICIAL" && (
        <div
          style={{
            margin: "0 0 16px 0",
            padding: "10px 16px",
            background: "#fff9eb",
            border: "1px solid #fae1a0",
            borderRadius: "6px",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            fontSize: "12px",
            color: "#8c6000",
          }}
        >
          <span>
            <strong>Security Boundary (F1 / DPDP Law):</strong> You are signed in as an <code>OFFICIAL</code>. Cross-department records are strictly masked outside your authorized jurisdiction.
          </span>
          <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", background: "#f5d47a", padding: "2px 6px", borderRadius: "3px" }}>
            Enforced
          </span>
        </div>
      )}

      {/* 6 Role-scoped KPI cards per DESIGN.md */}
      <section className="admin-metrics">
        {activeDeptData.metrics.map(([label, value, note, tone]) => (
          <article className={`admin-metric ${tone}`} key={label}>
            <span>{label}</span>
            <strong>{value}</strong>
            <small>{note}</small>
          </article>
        ))}
      </section>

      <section className="admin-grid">
        <article className="admin-panel">
          <PanelHead
            eyebrow={`Operational Feed / ${department}`}
            title="Recent activity"
            action={`${activeDeptData.activity.length} events logged`}
          />
          <div className="admin-activity">
            {activeDeptData.activity.map(([time, event, subject, status]) => (
              <div key={`${time}-${event}`}>
                <time>{time}</time>
                <i />
                <div>
                  <strong>{event}</strong>
                  <span>{subject}</span>
                </div>
                <b className={status.toLowerCase()}>{status}</b>
              </div>
            ))}
          </div>
        </article>
        <PulsePanel uptime={activeDeptData.uptime} pulse={activeDeptData.pulse} department={department} />
      </section>

      <button className="dashboard-export" type="button" onClick={exportReport}>
        ↓ Export current operational report ({department})
      </button>
    </>
  );
}

function PulsePanel({ uptime, pulse, department }) {
  return (
    <article className="admin-panel pulse-panel">
      <PanelHead eyebrow="Service health" title="Network pulse" />
      <strong className="pulse-value">{uptime}</strong>
      <div className="pulse-bars">
        {pulse.map((height, index) => (
          <i
            style={{ height: `${height}%` }}
            className={index === pulse.length - 1 ? "current" : ""}
            key={index}
            title={`Period ${index + 1}: ${height}% throughput`}
          />
        ))}
      </div>
      <div className="pulse-meta">
        <span>● Active uptime</span>
        <span>{department} · Last 30 days</span>
      </div>
      <div className="health-message">
        <strong>All endpoints healthy</strong>
        <span>Telemetry verified by background worker (5-minute cycle).</span>
      </div>
    </article>
  );
}
