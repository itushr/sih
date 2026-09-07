import { useState } from "react";
import { Link } from "react-router-dom";
import { useConfirm } from "../shared/dialog/ConfirmDialogContext.jsx";
import {
  ApplicationDetailPage,
  LinkedServicesPage,
  AuditsPage,
  FetchPage,
  ConsentManagementPage,
} from "./pages/CitizenPages.jsx";

const navItems = [
  ["overview", "Overview", "01", "🏠"],
  ["applications", "Applications", "02", "📋"],
  ["connections", "Connections", "03", "🔗"],
  ["consent", "Consent Centre", "04", "🔒"],
  ["fetch", "Data Fetch", "05", "⚡"],
  ["audits", "Audit Ledger", "06", "📜"],
  ["notifications", "Notifications", "07", "🔔"],
  ["activity", "Activity Log", "08", "🕒"],
];

const applicationsList = [
  { id: "housing-support", title: "Housing support", department: "Social Services", status: "Under review", tone: "amber", next: "No action needed", ref: "HSA-2026-04821" },
  { id: "childcare-allowance", title: "Childcare allowance", department: "Family Services", status: "Action needed", tone: "coral", next: "Upload income proof", ref: "FCA-2026-09134" },
  { id: "skill-development", title: "Skill development grant", department: "Employment Mission", status: "Approved", tone: "green", next: "View approval letter", ref: "SDG-2026-07653" },
];

const recentActivity = [
  ["Today, 09:42", "Housing support accessed your income record", "Social Services"],
  ["05 Sep 2026", "You linked Family Services", "Consent granted for childcare allowance"],
  ["29 Aug 2026", "Transport authority requested your address", "Request approved by you"],
];

const initialNotifications = [
  ["Action needed", "Upload income proof", "Childcare allowance · Family Services", "Today", "coral"],
  ["Consent request", "Review a new data request", "Transport authority wants your address record", "Today", "amber"],
  ["Application update", "Housing support is under review", "Social Services · No action needed", "Yesterday", "green"],
  ["Service update", "Family Services connection verified", "Your connection is active", "02 Sep", "blue"],
];

function Brand() {
  return (
    <Link className="brand" to="/" aria-label="Interop home">
      <span className="brand-symbol">i</span>
      <span>interop</span>
    </Link>
  );
}

export default function Citizen() {
  const [active, setActive] = useState("overview");
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [lang, setLang] = useState("EN");
  const [mobileNavOpen, setMobileNavOpen] = useState(false);

  const handleNavClick = (id) => {
    setActive(id);
    setSelectedAppId(null);
    setMobileNavOpen(false);
  };

  const handleOpenAppDetail = (id) => {
    setSelectedAppId(id);
    setActive("applications");
  };

  return (
    <div className="citizen-app">
      <header className="citizen-topbar">
        <div className="topbar-left">
          <button
            className="mobile-nav-toggle"
            type="button"
            aria-label="Toggle navigation"
            onClick={() => setMobileNavOpen((prev) => !prev)}
          >
            ☰
          </button>
          <Brand />
          <div className="topbar-context">
            <span className="live-dot" />
            <span>Secure Citizen Space · Maharashtra</span>
          </div>
        </div>

        <div className="topbar-actions">
          <Link to="/administration" className="authority-switch-link" title="Switch to Authority Console">
            Authority Console ↗
          </Link>
          <button
            className="language-button"
            type="button"
            onClick={() => setLang((l) => (l === "EN" ? "MR" : "EN"))}
            title="Toggle language"
          >
            {lang === "EN" ? "EN / मराठी" : "मराठी / EN"}
          </button>
          <button
            className="notification-button"
            onClick={() => {
              setActive("notifications");
              setSelectedAppId(null);
            }}
            type="button"
            aria-label="Open notifications"
          >
            <span>◌</span>
            <b>3</b>
          </button>
          <button className="avatar-button" type="button" aria-label="Open profile">
            AM
          </button>
        </div>
      </header>

      <div className="citizen-layout">
        <aside className={`citizen-sidebar ${mobileNavOpen ? "open" : ""}`}>
          <div className="sidebar-welcome">
            <span className="eyebrow">Your workspace</span>
            <h1>{lang === "EN" ? "Hello, Ananya" : "नमस्कार, अनन्या"}</h1>
            <p>Everything connected to your verified public services.</p>
          </div>

          <nav className="citizen-nav" aria-label="Citizen navigation">
            {navItems.map(([id, label, number, icon]) => (
              <button
                className={active === id && !selectedAppId ? "nav-link active" : "nav-link"}
                key={id}
                onClick={() => handleNavClick(id)}
                type="button"
              >
                <span className="nav-icon">{icon}</span>
                <span className="nav-label">{label}</span>
                <b>→</b>
              </button>
            ))}
          </nav>

          <div className="privacy-note">
            <span className="privacy-icon">🔒</span>
            <strong>DPDP-Aligned Consent</strong>
            <p>Every connection is visible, cryptographically logged, and 100% revocable.</p>
            <button type="button" onClick={() => handleNavClick("consent")}>
              Review consents →
            </button>
          </div>
        </aside>

        <main className="citizen-content">
          {active === "overview" && (
            <Overview
              onNavigate={handleNavClick}
              onOpenApp={handleOpenAppDetail}
              lang={lang}
            />
          )}

          {active === "applications" && (
            selectedAppId ? (
              <ApplicationDetailPage
                applicationId={selectedAppId}
                onBack={() => setSelectedAppId(null)}
              />
            ) : (
              <ApplicationsList onOpenDetail={handleOpenAppDetail} />
            )
          )}

          {active === "connections" && <LinkedServicesPage />}

          {active === "consent" && <ConsentManagementPage />}

          {active === "fetch" && <FetchPage />}

          {active === "audits" && <AuditsPage />}

          {active === "notifications" && <NotificationsView />}

          {active === "activity" && <ActivityView onNavigate={handleNavClick} />}
        </main>
      </div>

      <footer className="citizen-footer">
        <div>
          <strong>Government of Maharashtra · GovInterop Middleware</strong>
          <span> · Connect, don't replace. Digital Public Infrastructure.</span>
        </div>
        <div className="footer-links">
          <span>Privacy notice</span>
          <span>·</span>
          <span>DPDP Compliance</span>
          <span>·</span>
          <span>Accessibility (WCAG 2.1 AA)</span>
          <span>·</span>
          <Link to="/administration">Authority Admin</Link>
        </div>
      </footer>
    </div>
  );
}

function SectionIntro({ eyebrow, title, description, action }) {
  return (
    <div className="section-intro">
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2>{title}</h2>
        {description && <p>{description}</p>}
      </div>
      {action}
    </div>
  );
}

function Overview({ onNavigate, onOpenApp, lang }) {
  return (
    <>
      <section className="citizen-hero">
        <div className="hero-copy">
          <span className="hero-kicker">Unified Citizen Gateway · Maharashtra</span>
          <h2>{lang === "EN" ? "Clarity for the things that matter." : "आपल्या शासकीय सेवा, एकाच ठिकाणी."}</h2>
          <p>
            Track progress across departments, control data sharing in real-time, and eliminate repetitive form filling.
          </p>
          <div className="hero-button-row">
            <button className="solid-button" onClick={() => onNavigate("applications")} type="button">
              Track applications <span>↗</span>
            </button>
            <button className="outline-button-hero" onClick={() => onNavigate("consent")} type="button">
              Manage Consents
            </button>
          </div>
        </div>
        <div className="hero-stamp">
          <span>IO</span>
          <small>
            CONNECTED<br />BY CHOICE
          </small>
        </div>
      </section>

      <SectionIntro
        eyebrow="At a glance"
        title="Your service overview"
        description="Live status across all linked state services and active data exchanges."
        action={
          <button className="text-button" onClick={() => onNavigate("activity")} type="button">
            See all activity →
          </button>
        }
      />

      <section className="overview-grid">
        <button onClick={() => onNavigate("applications")} type="button">
          <span>Active applications</span>
          <strong>03</strong>
          <small>1 needs your action</small>
          <b>→</b>
        </button>
        <button onClick={() => onNavigate("connections")} type="button">
          <span>Linked services</span>
          <strong>04</strong>
          <small>All connections active</small>
          <b>→</b>
        </button>
        <button onClick={() => onNavigate("consent")} type="button">
          <span>Consent choices</span>
          <strong>06</strong>
          <small>PIN-protected & revocable</small>
          <b>→</b>
        </button>
        <button onClick={() => onNavigate("fetch")} type="button">
          <span>Cross-dept fetches</span>
          <strong>05</strong>
          <small>Verified on demand</small>
          <b>→</b>
        </button>
      </section>

      <section className="home-columns">
        <div>
          <SectionIntro
            eyebrow="Action required"
            title="Needs your attention"
            description="Complete outstanding steps to keep your benefits processing."
          />
          <article className="attention-card">
            <span className="attention-icon">!</span>
            <div>
              <strong>Upload income proof</strong>
              <p>Childcare allowance · Family Services</p>
              <button
                className="text-button"
                type="button"
                onClick={() => onOpenApp("childcare-allowance")}
              >
                Continue application →
              </button>
            </div>
            <span className="due-label">Due 12 Sep</span>
          </article>
        </div>

        <div>
          <SectionIntro
            eyebrow="Latest verified actions"
            title="Recent activity"
            description="Your transparent data ledger in plain language."
          />
          <div className="activity-mini">
            {recentActivity.map(([time, title, detail]) => (
              <article key={title}>
                <span className="activity-icon">·</span>
                <div>
                  <strong>{title}</strong>
                  <small>{detail}</small>
                </div>
                <time>{time}</time>
              </article>
            ))}
          </div>
        </div>
      </section>
    </>
  );
}

function ApplicationsList({ onOpenDetail }) {
  return (
    <>
      <SectionIntro
        eyebrow="F9 / Applications"
        title="Track your applications"
        description="Every state scheme, department, and subsidy in one unified timeline."
        action={
          <button className="solid-button compact" type="button">
            ＋ Start an application
          </button>
        }
      />
      <div className="application-stack">
        {applicationsList.map((app) => (
          <article
            className="application-row clickable"
            key={app.id}
            onClick={() => onOpenDetail(app.id)}
            role="button"
            tabIndex={0}
            onKeyDown={(e) => e.key === "Enter" && onOpenDetail(app.id)}
          >
            <span className={`service-badge ${app.tone}`}>{app.title.slice(0, 1)}</span>
            <div className="application-main">
              <strong>{app.title}</strong>
              <span>{app.department} · Ref: {app.ref}</span>
              <small>Updated today</small>
            </div>
            <div className={`status-tag ${app.tone}`}>{app.status}</div>
            <div className="application-next">
              <small>Next step</small>
              <span>{app.next}</span>
            </div>
            <button
              className="row-arrow"
              type="button"
              aria-label={`Open ${app.title}`}
              onClick={(e) => {
                e.stopPropagation();
                onOpenDetail(app.id);
              }}
            >
              →
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function NotificationsView() {
  const [items, setItems] = useState(initialNotifications);
  const [unread, setUnread] = useState(3);

  const handleMarkAllRead = () => {
    setUnread(0);
  };

  return (
    <>
      <SectionIntro
        eyebrow="Notification centre"
        title="Alerts and Updates"
        description="Real-time updates regarding your applications, consent requests, and department alerts."
        action={
          unread > 0 && (
            <button className="outline-button" type="button" onClick={handleMarkAllRead}>
              Mark all as read
            </button>
          )
        }
      />
      <div className="notification-summary">
        <div>
          <strong>{unread}</strong>
          <span>unread notifications</span>
        </div>
        <p>
          Most recent update <b>today at 09:42</b>
        </p>
      </div>
      <div className="notification-list">
        {items.map(([category, title, detail, time, tone], index) => (
          <article
            className={index < unread ? "notification-row unread" : "notification-row"}
            key={title}
          >
            <span className={`notification-mark ${tone}`}>
              {index < unread ? "!" : "·"}
            </span>
            <div>
              <small>{category}</small>
              <strong>{title}</strong>
              <p>{detail}</p>
            </div>
            <time>{time}</time>
            <button className="row-arrow" type="button" aria-label={`Open notification: ${title}`}>
              →
            </button>
          </article>
        ))}
      </div>
    </>
  );
}

function ActivityView({ onNavigate }) {
  return (
    <>
      <SectionIntro
        eyebrow="Audit record"
        title="Your data activity"
        description="A transparent log of when information was requested, shared, or changed under DPDP guidelines."
        action={
          <button className="outline-button" type="button" onClick={() => onNavigate("audits")}>
            Full Audit Ledger →
          </button>
        }
      />
      <div className="timeline">
        {[
          ["Today, 09:42", "Social Services accessed your income record", "Automated eligibility check under active consent"],
          ["06 Sep 2026", "Document requested by Family Services", "Income proof required for Childcare allowance"],
          ["05 Sep 2026", "You linked Family Services", "Consent granted for childcare allowance"],
          ["29 Aug 2026", "Transport authority requested your address", "Request approved by you"],
          ["18 Aug 2026", "You approved a new consent", "Housing support application"],
        ].map(([time, title, detail]) => (
          <article key={title}>
            <time>{time}</time>
            <span className="activity-icon">·</span>
            <div>
              <strong>{title}</strong>
              <p>{detail}</p>
              <small>Recorded securely in GovInterop immutable audit log</small>
            </div>
          </article>
        ))}
      </div>
    </>
  );
}
