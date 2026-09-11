import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  dashboardKPIs,
  systemHealth,
  chartData,
  errorCategories,
  recentEventsFeed,
  subscriptionHealthSummary,
  dashboardActivity,
} from "../data/mockData.js";

export default function DashboardPage() {
  const navigate = useNavigate();
  const [chartRange, setChartRange] = useState("7d");
  const bars = chartData[chartRange] || chartData["7d"];
  const maxVal = Math.max(...bars.map((b) => b.value));

  return (
    <div className="dash-root">
      {/* A. KPI Cards */}
      <section className="dash-kpi-grid">
        {dashboardKPIs.map((kpi) => (
          <article key={kpi.label} className={`dash-kpi-card ${kpi.tone}`}>
            <span className="dash-kpi-label">{kpi.label}</span>
            <strong className="dash-kpi-value">{kpi.value}</strong>
            <div className="dash-kpi-footer">
              <span className={`dash-kpi-delta ${kpi.trend}`}>
                {kpi.trend === "up" ? "↑" : "↓"} {kpi.delta}
              </span>
              <span className="dash-kpi-note">{kpi.note}</span>
            </div>
          </article>
        ))}
      </section>

      <div className="dash-two-col">
        {/* B. System Health */}
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <span className="eyebrow">Infrastructure / Mumbai-WR-01</span>
              <h2>System Health</h2>
            </div>
            <span className="dash-panel-badge green">Live</span>
          </div>
          <div className="dash-health-list">
            {systemHealth.map((svc) => (
              <div key={svc.name} className="dash-health-row">
                <span className={`dash-health-dot ${svc.status === "Healthy" ? "green" : "amber"}`} />
                <span className="dash-health-name">{svc.name}</span>
                <span className="dash-health-latency">{svc.latency}</span>
                <span className={`dash-health-status ${svc.status === "Healthy" ? "green" : "amber"}`}>
                  {svc.status}
                </span>
              </div>
            ))}
          </div>
          <div className="dash-uptime-row">
            <span>Platform uptime (30 days)</span>
            <strong>99.96%</strong>
          </div>
        </section>

        {/* C. API Request Chart */}
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <span className="eyebrow">GovInterop Gateway</span>
              <h2>API Requests</h2>
            </div>
            <div className="dash-chart-tabs">
              {["1d", "7d", "30d"].map((r) => (
                <button
                  key={r}
                  type="button"
                  className={`dash-chart-tab ${chartRange === r ? "active" : ""}`}
                  onClick={() => setChartRange(r)}
                >
                  {r === "1d" ? "Today" : r === "7d" ? "7 days" : "30 days"}
                </button>
              ))}
            </div>
          </div>
          <div className="dash-chart">
            {bars.map((bar) => (
              <div key={bar.label} className="dash-chart-col">
                <span className="dash-chart-tip">{bar.requests}</span>
                <div
                  className="dash-chart-bar"
                  style={{ height: `${(bar.value / maxVal) * 100}%` }}
                  title={`${bar.label}: ${bar.requests}`}
                />
                <span className="dash-chart-label">{bar.label}</span>
              </div>
            ))}
          </div>
        </section>
      </div>

      <div className="dash-three-col">
        {/* D. Error Overview */}
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <span className="eyebrow">Today</span>
              <h2>Errors Today</h2>
            </div>
            <button
              type="button"
              className="dash-link-btn"
              onClick={() => navigate("/administration/errors-logs")}
            >
              View all →
            </button>
          </div>
          <div className="dash-error-bars">
            {errorCategories.map((cat) => (
              <div key={cat.name} className="dash-error-row">
                <span className="dash-error-name">{cat.name}</span>
                <div className="dash-error-track">
                  <div className="dash-error-fill" style={{ width: `${cat.pct}%` }} />
                </div>
                <span className="dash-error-count">{cat.count}</span>
              </div>
            ))}
          </div>
        </section>

        {/* E. Recent Events Feed */}
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <span className="eyebrow">Live stream</span>
              <h2>Recent Events</h2>
            </div>
            <button
              type="button"
              className="dash-link-btn"
              onClick={() => navigate("/administration/event-registry")}
            >
              Registry →
            </button>
          </div>
          <div className="dash-events-feed">
            {recentEventsFeed.map((ev) => (
              <div key={ev.code} className="dash-event-item">
                <span className="dash-event-dot" />
                <div>
                  <code className="dash-event-code">{ev.code}</code>
                  <span className="dash-event-meta">{ev.publisher}</span>
                  <span className="dash-event-time">{ev.time}</span>
                </div>
              </div>
            ))}
          </div>
        </section>

        {/* F. Subscription Health */}
        <section className="dash-panel">
          <div className="dash-panel-head">
            <div>
              <span className="eyebrow">Delivery channels</span>
              <h2>Subscription Health</h2>
            </div>
            <button
              type="button"
              className="dash-link-btn"
              onClick={() => navigate("/administration/subscriptions")}
            >
              Manage →
            </button>
          </div>
          <div className="dash-sub-health">
            {subscriptionHealthSummary.map((s) => (
              <div key={s.label} className={`dash-sub-item ${s.tone}`}>
                <strong>{s.count}</strong>
                <span>{s.label}</span>
              </div>
            ))}
          </div>
          <div className="dash-sub-bar">
            {subscriptionHealthSummary.map((s) => (
              <div
                key={s.label}
                className={`dash-sub-bar-seg ${s.tone}`}
                style={{ flex: s.count }}
                title={`${s.label}: ${s.count}`}
              />
            ))}
          </div>
          <span className="dash-sub-total">346 total · 3 need attention</span>
        </section>
      </div>

      {/* G. Recent Activity */}
      <section className="dash-panel dash-activity-panel">
        <div className="dash-panel-head">
          <div>
            <span className="eyebrow">Cross-module / Authority Console</span>
            <h2>Recent Activity</h2>
          </div>
          <span className="dash-panel-badge amber">6 events</span>
        </div>
        <div className="dash-activity-list">
          {dashboardActivity.map(([time, event, subject, module]) => (
            <div key={`${time}-${event}`} className="dash-activity-row">
              <time className="dash-activity-time">{time}</time>
              <span className="dash-activity-dot" />
              <div className="dash-activity-body">
                <strong>{event}</strong>
                <span>{subject}</span>
              </div>
              <button
                type="button"
                className={`dash-activity-module mod-${module.toLowerCase()}`}
                onClick={() => {
                  const routes = {
                    Policies: "/administration/access-policies",
                    Logs: "/administration/errors-logs",
                    Events: "/administration/event-registry",
                    Subscriptions: "/administration/subscriptions",
                  };
                  if (routes[module]) navigate(routes[module]);
                }}
              >
                {module} →
              </button>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
}
