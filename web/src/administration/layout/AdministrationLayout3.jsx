import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { adminNavigation, pageDetails } from "../data/mockData.js";

export default function AdministrationLayout3({ page = "workflows", children }) {
    const navigate = useNavigate();
    const [notificationsOpen, setNotificationsOpen] = useState(false);
    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [dark, setDark] = useState(() => localStorage.getItem("admin-theme") === "dark");
    const [title, heading] = pageDetails[page] || pageDetails.overview;

    // Apply / remove dark class on the admin-app root
    useEffect(() => {
        localStorage.setItem("admin-theme", dark ? "dark" : "light");
    }, [dark]);

    const toggleDark = () => setDark((d) => !d);

    return (
        <div className={`admin-app${dark ? " admin-dark" : ""}`}>
            {/* Mobile Backdrop */}
            {sidebarOpen && (
                <div
                    className="admin-mobile-backdrop"
                    onClick={() => setSidebarOpen(false)}
                    aria-hidden="true"
                />
            )}

            <aside className={`admin-sidebar ${sidebarOpen ? "open" : ""}`}>
                <div className="admin-brand">
                    <Link to="/administration" className="brand-inner">
                        <span className="brand-symbol">i</span>
                        <div>
                            <strong>interop</strong>
                            <small>authority console</small>
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

                {/* <div className="admin-side-title">Authority Modules</div> */}
                <nav aria-label="Administration navigation">
                    {adminNavigation.map(([id, label, number, icon, path]) => (
                        <NavLink
                            className={({ isActive }) =>
                                `admin-link ${isActive || (page === "workflows" && id === "workflows") ? "active" : ""}`
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

                <div className="admin-sidebar-bottom">
                    {/* Dark Mode Toggle in sidebar */}
                    {/* <button
            className="sidebar-dark-toggle"
            type="button"
            onClick={toggleDark}
            aria-label={dark ? "Switch to light mode" : "Switch to dark mode"}
          >
            <span className="sidebar-toggle-icon">{dark ? "☀️" : "🌙"}</span>
            <span>{dark ? "Light mode" : "Dark mode"}</span>
            <span className="sidebar-toggle-pill">{dark ? "ON" : "OFF"}</span>
          </button> */}
                    {/* <div className="health-indicator">
            <span />
            Systems operational · v1.4.2
          </div> */}
                    <div className="admin-user border-t border-gray-50/20">
                        <span>NM</span>
                        <div>
                            <strong>Mr Nivant Mishra</strong>
                            <p className="text-[9px] text-">Admin @ test.gov.in</p>
                        </div>
                    </div>
                </div>
            </aside>

            <main className="px-10 py-5">
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
                            {/* <Link to="/" className="citizen-switch-button" title="Switch to citizen portal">
                                ← Citizen Space
                            </Link> */}

                            <div className="notification-wrap">
                                <button
                                    className="notif-btn"
                                    type="button"
                                    aria-label="Notifications (3 unread)"
                                    aria-expanded={notificationsOpen}
                                    onClick={() => setNotificationsOpen((current) => !current)}
                                >
                                    <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                        <path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9" />
                                        <path d="M13.73 21a2 2 0 0 1-3.46 0" />
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
