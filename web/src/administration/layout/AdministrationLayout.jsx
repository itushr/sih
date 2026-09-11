import { useState } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { adminNavigation, pageDetails } from "../data/mockData.js";

export default function AdministrationLayout({ page = "overview", children }) {
  const navigate = useNavigate();
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [title, heading] = pageDetails[page] || pageDetails.overview;

  return (
    <div className="admin-app">
      {/* Mobile Backdrop */}
      {sidebarOpen && (
        <div
          className="admin-mobile-backdrop"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* ── CLEAN CITIZEN-STYLE ADMIN SIDEBAR ── */}
      <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
        {/* Brand Header */}
        <div className="admin-brand">
          <Link to="/administration" className="brand-inner">
            <span className="brand-symbol">i</span>
            <div>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <strong>GovInterop</strong>
                <span className="admin-badge-tag">ADMIN</span>
              </div>
              <small>Authority Console · MahaGov</small>
            </div>
          </Link>
          <button
            className="admin-sidebar-close"
            type="button"
            onClick={() => setSidebarOpen(false)}
            aria-label="Close sidebar"
          >
            ✕
          </button>
        </div>

        {/* Section Heading */}
        <div className="admin-side-title">Authority Modules</div>

        {/* Navigation Links */}
        <nav aria-label="Administration navigation">
          {adminNavigation.map(([id, label, number, icon, path]) => (
            <NavLink
              className={({ isActive }) =>
                `admin-link ${isActive || (page === "overview" && id === "overview") ? "active" : ""}`
              }
              key={id}
              to={path}
              end={id === "overview"}
              onClick={() => setSidebarOpen(false)}
            >
              <span className="admin-link-icon" aria-hidden="true">
                {icon}
              </span>
              <span className="admin-link-label">{label}</span>
              <span className="admin-link-number">{number}</span>
            </NavLink>
          ))}
        </nav>

        {/* Sidebar Bottom (Clean DPDP-2023 Card + Switch to Citizen Space + User Info) */}
        <div className="admin-sidebar-bottom">
          {/* DPDP-2023 Compliant Node Box */}
          <div className="admin-dpdp-card">
            <div className="admin-dpdp-header">
              <span className="dpdp-shield">🛡️</span>
              <div>
                <strong>DPDP-2023 Node Active</strong>
                <small>Maharashtra Interoperability</small>
              </div>
            </div>
            <div className="admin-node-status">
              <span className="node-live-dot" />
              <span>Node: Mumbai-WR-01 · Operational</span>
            </div>
          </div>

          {/* Quick Switch to Citizen Space */}
          <Link to="/" className="switch-to-citizen-link" title="Switch to citizen portal">
            <span>←</span> Switch to Citizen Portal
          </Link>

          {/* Admin User Info */}
          <div className="admin-user">
            <span className="admin-user-avatar">AN</span>
            <div className="admin-user-info">
              <strong>Admin Network</strong>
              <small>Central authority · MahaGov</small>
            </div>
          </div>
        </div>
      </aside>

      {/* ── MAIN WORKSPACE ── */}
      <main className="admin-main">
        <header className="admin-header">
          <div className="admin-header-left">
            <button
              className="admin-mobile-menu-btn"
              type="button"
              aria-label="Toggle menu"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              ☰
            </button>
            <div>
              <span className="eyebrow">Authority workspace / {title}</span>
              <h1>{heading}</h1>
            </div>
          </div>

          <div className="admin-actions">
            {/* Left group: citizen link + notifications */}
            <div className="admin-action-group">
              <Link to="/" className="citizen-switch-button" title="Switch to citizen portal">
                ← Citizen Space
              </Link>

              <div className="notification-wrap">
                <button
                  className="notif-btn"
                  type="button"
                  aria-label="Notifications (3 unread)"
                  aria-expanded={notificationsOpen}
                  onClick={() => setNotificationsOpen((current) => !current)}
                >
                  <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/>
                    <path d="M13.73 21a2 2 0 0 1-3.46 0"/>
                  </svg>
                  <span className="notif-badge">3</span>
                </button>
                {notificationsOpen && (
                  <div className="notif-panel" role="dialog" aria-label="Notifications">
                    <div className="notif-panel-head">
                      <div>
                        <strong>Notifications</strong>
                        <span className="notif-count">3 unread</span>
                      </div>
                      <button
                        className="notif-mark-read"
                        type="button"
                        onClick={() => setNotificationsOpen(false)}
                      >
                        Mark all read
                      </button>
                    </div>

                    <div className="notif-list">
                      <div className="notif-item unread">
                        <span className="notif-icon amber">⚡</span>
                        <div className="notif-body">
                          <strong>Latency spike detected</strong>
                          <p>Tax Authority Services response exceeded 1.2s SLA threshold.</p>
                          <time>09:47 · Today</time>
                        </div>
                      </div>

                      <div className="notif-item unread">
                        <span className="notif-icon teal">◈</span>
                        <div className="notif-body">
                          <strong>New policy published</strong>
                          <p>ABAC consent policy updated for Revenue Department gateway.</p>
                          <time>08:31 · Today</time>
                        </div>
                      </div>

                      <div className="notif-item unread">
                        <span className="notif-icon green">✓</span>
                        <div className="notif-body">
                          <strong>Health worker completed</strong>
                          <p>BullMQ 5-minute round finished: 4/4 endpoints alive.</p>
                          <time>08:14 · Today</time>
                        </div>
                      </div>
                    </div>

                    <button
                      className="notif-view-all"
                      type="button"
                      onClick={() => { setNotificationsOpen(false); }}
                    >
                      View all activity →
                    </button>
                  </div>
                )}
              </div>
            </div>

            {/* Divider */}
            <span className="admin-header-divider" aria-hidden="true" />

            {/* Right group: export + new workflow */}
            <div className="admin-action-group">
              <button
                className="outline-button"
                type="button"
                onClick={() => {
                  const report = [
                    "==================================================",
                    "GovInterop Authority Console — Operational Report",
                    "==================================================",
                    `Generated: ${new Date().toLocaleString()}`,
                    `Platform: Maharashtra Interoperability Middleware v1.4.2`,
                    "",
                    "All systems operational. Full telemetry available in dashboard.",
                  ].join("\n");
                  const link = document.createElement("a");
                  link.href = URL.createObjectURL(new Blob([report], { type: "text/plain" }));
                  link.download = `govinterop-report-${Date.now()}.txt`;
                  link.click();
                  URL.revokeObjectURL(link.href);
                }}
              >
                ↓ Export report
              </button>
              <button
                className="solid-button compact"
                type="button"
                onClick={() => navigate("/administration/orchestrations")}
              >
                ＋ New workflow
              </button>
            </div>
          </div>
        </header>

        {children}
      </main>
    </div>
  );
}
