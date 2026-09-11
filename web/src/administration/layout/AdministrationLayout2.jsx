import { useState, useEffect } from "react";
import { NavLink, Link, useNavigate } from "react-router-dom";
import { adminNavigation, pageDetails } from "../data/mockData.js";

export default function AdministrationLayout2({ page = "workflows", children }) {
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

      <main>
        <header className="">
          <div className="admin-header-left p-2 md:p-0">
            <button
              className="admin-mobile-menu-btn"
              type="button"
              aria-label="Toggle menu"
              onClick={() => setSidebarOpen((prev) => !prev)}
            >
              ☰
            </button>
          </div>
        </header>
        {children}
      </main>
    </div>
  );
}
