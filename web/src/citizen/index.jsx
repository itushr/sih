import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import {
  ApplicationDetailPage,
  LinkedServicesPage,
  AuditsPage,
  FetchPage,
  ConsentManagementPage,
} from "./pages/CitizenPages.jsx";
import CitizenChatbot from "./components/CitizenChatbot.jsx";

/* ─── 5 GovInterop Hero Slides (Poster Carousel with Actual Images) ─── */
const heroSlides = [
  {
    id: "data-exchange",
    title: "Smart Data Exchange. Faster Service Delivery.",
    subtitle: "Automated, paperless verification across municipal and state departments.",
    badge: "INSTANT VERIFICATION",
    image: "/banners/banner-1.jpg",
    targetSection: "fetch",
  },
  {
    id: "consent-gate",
    title: "Your Data. Your Consent.",
    subtitle: "DPDP compliant consent gates. You control and revoke who accesses records.",
    badge: "DATA SOVEREIGNTY",
    image: "/banners/banner-2.jpg",
    targetSection: "consent",
  },
  {
    id: "single-sign-on",
    title: "Secure Access, with Single Sign-On.",
    subtitle: "One trusted GovInterop digital identity for all public services and schemes.",
    badge: "DIGITAL IDENTITY",
    image: "/banners/banner-3.jpg",
    targetSection: "connections",
  },
  {
    id: "unified-experience",
    title: "From Fragmented Portals to a Unified Experience.",
    subtitle: "Track applications and welfare entitlements from a single intuitive dashboard.",
    badge: "UNIFIED PORTAL",
    image: "/banners/banner-4.jpg",
    targetSection: "applications",
  },
  {
    id: "digital-india",
    title: "A Connected Ecosystem for a Stronger Digital India.",
    subtitle: "Transparent, real-time audit trails with tamper-evident digital records.",
    badge: "DIGITAL INDIA",
    image: "/banners/banner-5.jpg",
    targetSection: "audits",
  },
];

// Continuous moving stream: duplicate slides for seamless infinite CSS marquee flow
const marqueeHeroSlides = [...heroSlides, ...heroSlides];

/* ─── Document Categories & Indian Governance Mock Data ─── */
const documentCategories = [
  { id: "all", label: "All Documents (12)", icon: "📁" },
  { id: "revenue", label: "Revenue & Land (4)", icon: "🏛️" },
  { id: "identity", label: "Identity & Civil (3)", icon: "🪪" },
  { id: "education", label: "Education & Skills (3)", icon: "🎓" },
  { id: "welfare", label: "Welfare & Subsidies (3)", icon: "🌾" },
  { id: "transport", label: "Transport & Utilities (2)", icon: "🚗" },
];

const indianDocumentsData = [
  {
    id: "doc-income",
    title: "Income Certificate (उत्पन्नाचा दाखला)",
    category: "revenue",
    dept: "Revenue Department, Maharashtra",
    issuer: "Tahsil Office / MahaOnline",
    status: "Ready to Auto-Fetch",
    statusTone: "green",
    docRef: "MH-REV-INC-2026-91823",
    validity: "Valid till 31 Mar 2027",
    linkedTo: "Childcare Allowance & PMAY",
    actionTarget: "fetch",
  },
  {
    id: "doc-712",
    title: "7/12 Land Record (सातबारा उतारा)",
    category: "revenue",
    dept: "Department of Land Records (Bhulekh)",
    issuer: "Pune District Talathi Office",
    status: "Verified in DigiLocker",
    statusTone: "green",
    docRef: "MH-SATBARA-411038",
    validity: "Updated Aug 2026",
    linkedTo: "PM-Kisan Subsidy",
    actionTarget: "fetch",
  },
  {
    id: "doc-domicile",
    title: "Domicile & Age Certificate (अधिवास प्रमाणपत्र)",
    category: "revenue",
    dept: "General Administration Dept",
    issuer: "Sub-Divisional Magistrate (SDM)",
    status: "Consent Active",
    statusTone: "blue",
    docRef: "MH-DOM-2024-8841",
    validity: "Permanent",
    linkedTo: "Skill Grant & Employment",
    actionTarget: "consent",
  },
  {
    id: "doc-aadhaar",
    title: "Aadhaar Card (UIDAI Masked e-KYC)",
    category: "identity",
    dept: "Unique Identification Authority of India",
    issuer: "Govt of India",
    status: "Primary e-KYC Active",
    statusTone: "green",
    docRef: "XXXX-XXXX-9842",
    validity: "Biometrics Locked",
    linkedTo: "All Linked Services",
    actionTarget: "connections",
  },
  {
    id: "doc-ration",
    title: "Digital Ration Card (NFSA / रेशन पत्रिका)",
    category: "identity",
    dept: "Food & Civil Supplies Dept, Maharashtra",
    issuer: "District Supply Office",
    status: "Linked & Verified",
    statusTone: "green",
    docRef: "RC-MH-27-0482910",
    validity: "Active Beneficiary",
    linkedTo: "Family Welfare Services",
    actionTarget: "fetch",
  },
  {
    id: "doc-caste",
    title: "Caste Validity Certificate (जात वैधता)",
    category: "identity",
    dept: "Social Justice & Special Assistance",
    issuer: "Divisional Caste Scrutiny Committee",
    status: "Available on-demand",
    statusTone: "amber",
    docRef: "MH-CSC-2022-7729",
    validity: "Permanent",
    linkedTo: "MahaDBT Education Support",
    actionTarget: "fetch",
  },
  {
    id: "doc-ssc",
    title: "SSC Board Certificate (इ. १० वी गुणपत्रिका)",
    category: "education",
    dept: "Maharashtra State Board (MSBSHSE)",
    issuer: "Pune Divisional Board",
    status: "Synced via DigiLocker",
    statusTone: "green",
    docRef: "MSB-SSC-2018-A4920",
    validity: "Verified",
    linkedTo: "Employment Mission Grant",
    actionTarget: "fetch",
  },
  {
    id: "doc-degree",
    title: "Higher Technical Diploma Transcript",
    category: "education",
    dept: "Directorate of Technical Education (DTE)",
    issuer: "MSBTE Mumbai",
    status: "Consent Granted",
    statusTone: "blue",
    docRef: "DTE-DIP-2022-1104",
    validity: "Permanent",
    linkedTo: "Skill Development Grant",
    actionTarget: "consent",
  },
  {
    id: "doc-pmay",
    title: "PMAY Housing Sanction Letter",
    category: "welfare",
    dept: "Housing Department, Maharashtra",
    issuer: "MHADA / State PMAY Mission",
    status: "Under Case Review",
    statusTone: "amber",
    docRef: "HSA-2026-04821",
    validity: "Stage 2 Inspection",
    linkedTo: "Housing Subsidy",
    actionTarget: "applications",
  },
  {
    id: "doc-childcare",
    title: "Childcare Nutrition & Health Card",
    category: "welfare",
    dept: "Women & Child Development (WCD)",
    issuer: "Anganwadi Center Pune-East",
    status: "Action Needed: Income Proof",
    statusTone: "coral",
    docRef: "WCD-MH-2026-09134",
    validity: "Pending Verification",
    linkedTo: "Childcare Allowance",
    actionTarget: "applications",
  },
  {
    id: "doc-dl",
    title: "Smart Card Driving License (वाहन चालक परवाना)",
    category: "transport",
    dept: "Motor Vehicles Dept (RTO Maharashtra)",
    issuer: "RTO Pune (MH-12)",
    status: "Synced via Sarathi 4.0",
    statusTone: "green",
    docRef: "MH12-20210049281",
    validity: "Valid till 2041",
    linkedTo: "Identity & Address Proof",
    actionTarget: "fetch",
  },
  {
    id: "doc-mseb",
    title: "Electricity Connection Bill (महावितरण MSEDCL)",
    category: "transport",
    dept: "Maharashtra State Electricity Board",
    issuer: "MSEDCL Urban Circle",
    status: "Address Verification Synced",
    statusTone: "green",
    docRef: "MSEB-CON-04829103",
    validity: "Latest FY 2026",
    linkedTo: "Address Proof Check",
    actionTarget: "fetch",
  },
];

const applicationsList = [
  {
    id: "housing-support",
    title: "Housing Support Scheme (PMAY)",
    department: "Social Services",
    status: "Under review",
    tone: "amber",
    next: "Verification in progress by case officer",
    ref: "HSA-2026-04821",
    letter: "H",
    updated: "28 Aug 2026",
  },
  {
    id: "childcare-allowance",
    title: "Childcare Allowance & Nutrition",
    department: "Family Services",
    status: "Action needed",
    tone: "coral",
    next: "Upload income verification",
    ref: "FCA-2026-09134",
    letter: "C",
    updated: "06 Sep 2026",
    urgent: true,
  },
  {
    id: "skill-development",
    title: "Skill Development & Employment Grant",
    department: "Employment Mission",
    status: "Approved",
    tone: "green",
    next: "₹15,000 DBT Disbursed to linked bank",
    ref: "SDG-2026-07653",
    letter: "S",
    updated: "01 Sep 2026",
  },
];

const liveFetches = [
  {
    dept: "Department of Social Services",
    record: "Income Certificate (FY 2025-26)",
    time: "Today, 09:42 AM",
    status: "Verified Instantly",
  },
  {
    dept: "Family Welfare Services",
    record: "Aadhaar & Family Composition",
    time: "05 Sep 2026",
    status: "Consent Active",
  },
  {
    dept: "Transport Authority",
    record: "Proof of Residence (MSEB Bill)",
    time: "29 Aug 2026",
    status: "Validated",
  },
];

export default function Citizen() {
  const [active, setActive] = useState("overview");
  const [selectedAppId, setSelectedAppId] = useState(null);
  const [lang, setLang] = useState("EN");
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchDocQuery, setSearchDocQuery] = useState("");
  const contentRef = useRef(null);

  const navigate = (id) => {
    setActive(id);
    setSelectedAppId(null);
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  const handleOpenAppDetail = (appId) => {
    setSelectedAppId(appId);
    setActive("applications");
    contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };


  // Filter documents by category & search query
  const filteredDocuments = indianDocumentsData.filter((doc) => {
    const matchesCategory = selectedCategory === "all" || doc.category === selectedCategory;
    const matchesSearch =
      doc.title.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.dept.toLowerCase().includes(searchDocQuery.toLowerCase()) ||
      doc.linkedTo.toLowerCase().includes(searchDocQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <div
      ref={contentRef}
      style={{
        minHeight: "100vh",
        width: "100%",
        background: "#f4f6f0",
        color: "#172321",
        fontFamily: "'DM Sans', sans-serif",
        display: "flex",
        flexDirection: "column",
        overflowX: "hidden",
      }}
    >
      {/* ── Subpage Header with Back-to-Dashboard action when inside any sub-section ── */}
      {active !== "overview" || selectedAppId ? (
        <div
          style={{
            position: "sticky",
            top: 0,
            zIndex: 40,
            width: "100%",
            background: "#ffffff",
            borderBottom: "1px solid #e2e8de",
            padding: "12px clamp(16px, 3vw, 36px)",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            boxShadow: "0 2px 10px rgba(0,0,0,0.03)",
          }}
        >
          <button
            type="button"
            onClick={() => {
              if (selectedAppId) setSelectedAppId(null);
              else setActive("overview");
              contentRef.current?.scrollTo({ top: 0, behavior: "smooth" });
            }}
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: "8px",
              padding: "8px 16px",
              borderRadius: "8px",
              background: "#182c25",
              color: "#ffffff",
              fontSize: "12px",
              fontWeight: 700,
              border: 0,
              cursor: "pointer",
              transition: "transform 0.15s ease",
            }}
            onMouseOver={(e) => (e.currentTarget.style.transform = "translateX(-2px)")}
            onMouseOut={(e) => (e.currentTarget.style.transform = "translateX(0)")}
          >
            <span>←</span> Back to Main Dashboard
          </button>

          <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
            <span style={{ fontSize: "12px", color: "#6b7d73", fontWeight: 600 }}>
              {selectedAppId ? "Application Detail" : active.toUpperCase()}
            </span>
            <span style={{ color: "#c1ccc3" }}>|</span>
            <Link
              to="/administration"
              style={{ fontSize: "11px", color: "#25533c", textDecoration: "none", fontWeight: 700 }}
            >
              Authority Console ↗
            </Link>
          </div>
        </div>
      ) : null}

      {/* ── FULL SCREEN FLUID MAIN WORKSPACE ── */}
      <main
        style={{
          width: "100%",
          maxWidth: "100%",
          padding: active === "overview" && !selectedAppId ? "0 0 60px 0" : "16px clamp(16px, 2.5vw, 36px) 60px",
          flex: 1,
          boxSizing: "border-box",
        }}
      >
        {selectedAppId ? (
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <ApplicationDetailPage
              applicationId={selectedAppId}
              onBack={() => setSelectedAppId(null)}
            />
          </div>
        ) : active === "applications" ? (
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <ApplicationsList onOpenDetail={handleOpenAppDetail} />
          </div>
        ) : active === "connections" ? (
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <LinkedServicesPage />
          </div>
        ) : active === "consent" ? (
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <ConsentManagementPage />
          </div>
        ) : active === "fetch" ? (
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <FetchPage />
          </div>
        ) : active === "audits" ? (
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <AuditsPage />
          </div>
        ) : active === "notifications" ? (
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <NotificationsView onNavigate={navigate} />
          </div>
        ) : active === "activity" ? (
          <div style={{ maxWidth: "1280px", margin: "0 auto" }}>
            <ActivityView onNavigate={navigate} />
          </div>
        ) : (
          /* ── 100% FULL-BLEED FULL PAGE OVERVIEW HOME PAGE ── */
          <div style={{ display: "flex", flexDirection: "column", width: "100%" }}>
            {/* ── 1. Top Brand Identity & Quick Switcher Strip (Full Width) ── */}
            <div
              style={{
                width: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                padding: "10px clamp(16px, 3vw, 40px)",
                background: "#ffffff",
                borderBottom: "1px solid #e1e7df",
                flexWrap: "wrap",
                gap: "12px",
                boxShadow: "0 1px 4px rgba(0,0,0,0.02)",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span
                  style={{
                    display: "grid",
                    placeItems: "center",
                    width: "32px",
                    height: "32px",
                    borderRadius: "8px",
                    background: "#d6f06e",
                    color: "#18231f",
                    fontWeight: 800,
                    fontSize: "18px",
                  }}
                >
                  i
                </span>
                <div>
                  <h1
                    style={{
                      margin: 0,
                      fontSize: "18px",
                      fontWeight: 800,
                      fontFamily: "'Space Grotesk', sans-serif",
                      letterSpacing: "-0.03em",
                      color: "#172d24",
                    }}
                  >
                    GovInterop <span style={{ fontSize: "11px", fontWeight: 500, color: "#62796e" }}>Citizen Portal</span>
                  </h1>
                </div>
              </div>

              <div style={{ display: "flex", alignItems: "center", gap: "10px", flexWrap: "wrap" }}>
                <span
                  style={{
                    fontSize: "11px",
                    fontWeight: 600,
                    padding: "4px 10px",
                    borderRadius: "20px",
                    background: "#eaf3e3",
                    color: "#28563d",
                    border: "1px solid #cce2c3",
                    display: "flex",
                    alignItems: "center",
                    gap: "6px",
                  }}
                >
                  <span style={{ width: "6px", height: "6px", borderRadius: "50%", background: "#48bb78" }} />
                  MH-DPDP Node Active
                </span>

                <button
                  type="button"
                  onClick={() => setLang((l) => (l === "EN" ? "MR" : "EN"))}
                  style={{
                    padding: "6px 12px",
                    borderRadius: "6px",
                    background: "#ffffff",
                    border: "1px solid #d2ded0",
                    color: "#27503c",
                    fontSize: "11px",
                    fontWeight: 700,
                    cursor: "pointer",
                  }}
                >
                  {lang === "EN" ? "English / मराठी" : "मराठी / English"}
                </button>

                <Link
                  to="/administration"
                  style={{
                    padding: "6px 14px",
                    borderRadius: "6px",
                    background: "#eef5eb",
                    border: "1px solid #a8cca0",
                    color: "#24553b",
                    fontSize: "11px",
                    fontWeight: 700,
                    textDecoration: "none",
                  }}
                >
                  Admin Console ↗
                </Link>
              </div>
            </div>

            {/* ── 2. CONTINUOUS HORIZONTAL MOVING ADS STREAM ── */}
            <section
              style={{
                width: "100%",
                maxWidth: "1600px",
                margin: "20px auto 0",
                padding: "0 clamp(12px, 2.5vw, 28px)",
                position: "relative",
                boxSizing: "border-box",
              }}
            >
              {/* Header Label: Official Updates Stream */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  marginBottom: "12px",
                  padding: "0 4px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span
                    style={{
                      display: "inline-flex",
                      alignItems: "center",
                      gap: "6px",
                      background: "#e8f2e4",
                      border: "1px solid #cde0c8",
                      padding: "4px 12px",
                      borderRadius: "16px",
                      fontSize: "11.5px",
                      fontWeight: 700,
                      color: "#1e4632",
                      letterSpacing: "0.02em",
                    }}
                  >
                    <span
                      className="live-ad-badge-dot"
                      style={{
                        width: "7px",
                        height: "7px",
                        borderRadius: "50%",
                        background: "#16a34a",
                        display: "inline-block",
                      }}
                    />
                    GOVINTEROP SPOTLIGHT
                  </span>
                  <span style={{ fontSize: "12.5px", color: "#687c71", fontWeight: 500 }}>
                    Continuous Public Announcements & Digital Services
                  </span>
                </div>
              </div>

              {/* Continuous Flow Marquee Container */}
              <div
                style={{
                  position: "relative",
                  width: "100%",
                  overflow: "hidden",
                  borderRadius: "18px",
                  padding: "6px 0",
                }}
              >
                {/* Left & Right Soft Edge Fades for Cinematic Effect */}
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    left: 0,
                    width: "60px",
                    background: "linear-gradient(to right, #f4f6f0 0%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 5,
                  }}
                />
                <div
                  style={{
                    position: "absolute",
                    top: 0,
                    bottom: 0,
                    right: 0,
                    width: "60px",
                    background: "linear-gradient(to left, #f4f6f0 0%, transparent 100%)",
                    pointerEvents: "none",
                    zIndex: 5,
                  }}
                />

                {/* Non-stop Continuous Moving Ads Track */}
                <div className="continuous-ads-track">
                  {marqueeHeroSlides.map((slide, idx) => (
                    <div
                      key={`${slide.id}-${idx}`}
                      onClick={() => navigate(slide.targetSection)}
                      style={{
                        flex: "0 0 clamp(540px, 52vw, 760px)",
                        marginRight: "22px",
                        position: "relative",
                        cursor: "pointer",
                        borderRadius: "18px",
                        overflow: "hidden",
                        boxShadow: "0 14px 36px rgba(16, 42, 34, 0.16), 0 3px 10px rgba(0,0,0,0.07)",
                        background: "#0c1813",
                        boxSizing: "border-box",
                        userSelect: "none",
                      }}
                      title={`Open ${slide.title}`}
                    >
                      <img
                        src={slide.image}
                        alt={slide.title}
                        loading="lazy"
                        draggable="false"
                        style={{
                          width: "100%",
                          height: "auto",
                          aspectRatio: "16 / 9",
                          objectFit: "cover",
                          display: "block",
                          borderRadius: "18px",
                        }}
                      />

                      {/* Floating Badge Tag */}
                      <div
                        style={{
                          position: "absolute",
                          top: "16px",
                          left: "16px",
                          display: "flex",
                          alignItems: "center",
                          gap: "8px",
                          zIndex: 3,
                        }}
                      >
                        <span
                          style={{
                            padding: "5px 12px",
                            borderRadius: "20px",
                            background: "rgba(12, 24, 19, 0.85)",
                            backdropFilter: "blur(10px)",
                            color: "#d6f06e",
                            fontSize: "11.5px",
                            fontWeight: 800,
                            letterSpacing: "0.04em",
                            border: "1px solid rgba(214, 240, 110, 0.35)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "6px",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                          }}
                        >
                          <span
                            style={{
                              width: "6px",
                              height: "6px",
                              borderRadius: "50%",
                              background: "#d6f06e",
                            }}
                          />
                          {slide.badge}
                        </span>
                      </div>

                      {/* Bottom Gradient Glass Overlay */}
                      <div
                        style={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          padding: "28px 24px 18px",
                          background:
                            "linear-gradient(to top, rgba(8, 20, 16, 0.94) 0%, rgba(8, 20, 16, 0.6) 60%, transparent 100%)",
                          display: "flex",
                          alignItems: "flex-end",
                          justifyContent: "space-between",
                          gap: "14px",
                          zIndex: 2,
                        }}
                      >
                        <div style={{ maxWidth: "78%" }}>
                          <h3
                            style={{
                              margin: 0,
                              color: "#ffffff",
                              fontSize: "clamp(15px, 1.6vw, 19px)",
                              fontWeight: 800,
                              fontFamily: "'Space Grotesk', sans-serif",
                              letterSpacing: "-0.01em",
                              textShadow: "0 2px 6px rgba(0,0,0,0.6)",
                            }}
                          >
                            {slide.title}
                          </h3>
                          <p
                            style={{
                              margin: "5px 0 0",
                              color: "#d1ded7",
                              fontSize: "clamp(12px, 1.15vw, 14px)",
                              fontWeight: 500,
                              lineHeight: 1.35,
                              display: "-webkit-box",
                              WebkitLineClamp: 1,
                              WebkitBoxOrient: "vertical",
                              overflow: "hidden",
                              textShadow: "0 1px 4px rgba(0,0,0,0.5)",
                            }}
                          >
                            {slide.subtitle}
                          </p>
                        </div>

                        <span
                          style={{
                            flexShrink: 0,
                            padding: "8px 16px",
                            borderRadius: "8px",
                            background: "#d6f06e",
                            color: "#13271e",
                            fontSize: "12px",
                            fontWeight: 800,
                            boxShadow: "0 4px 12px rgba(0,0,0,0.3)",
                            display: "inline-flex",
                            alignItems: "center",
                            gap: "5px",
                          }}
                        >
                          Explore ↗
                        </span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* ── 3. BELOW HERO: FULL SERVICES, DOCUMENTS & DIRECTORY HUB ── */}
            <div
              style={{
                width: "100%",
                maxWidth: "1520px",
                margin: "0 auto",
                padding: "28px clamp(16px, 3vw, 40px) 0",
                display: "flex",
                flexDirection: "column",
                gap: "28px",
                boxSizing: "border-box",
              }}
            >
              {/* High Priority Action Alert */}
              <div
                style={{
                  width: "100%",
                  background: "#fff8f0",
                border: "1px solid #fae1c5",
                borderLeft: "5px solid #ea580c",
                borderRadius: "12px",
                padding: "16px 22px",
                display: "flex",
                alignItems: "center",
                justifyContent: "space-between",
                gap: "16px",
                flexWrap: "wrap",
                boxShadow: "0 2px 8px rgba(234, 88, 12, 0.05)",
                boxSizing: "border-box",
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
                <span
                  style={{
                    width: "34px",
                    height: "34px",
                    borderRadius: "50%",
                    background: "#fed7aa",
                    color: "#9a3412",
                    display: "grid",
                    placeItems: "center",
                    fontWeight: "bold",
                    fontSize: "16px",
                    flexShrink: 0,
                  }}
                >
                  !
                </span>
                <div>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px", flexWrap: "wrap" }}>
                    <strong style={{ fontSize: "14px", color: "#431407" }}>
                      Action Required: Income Proof Upload
                    </strong>
                    <span style={{ fontSize: "10px", fontWeight: 700, color: "#c2410c", background: "#ffedd5", padding: "2px 8px", borderRadius: "4px" }}>
                      Due 12 Sep
                    </span>
                  </div>
                  <p style={{ margin: "3px 0 0", fontSize: "12px", color: "#7c2d12" }}>
                    Childcare Allowance (Family Services) requires verified FY 2025-26 certificate to release benefit.
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => handleOpenAppDetail("childcare-allowance")}
                style={{
                  padding: "8px 18px",
                  borderRadius: "8px",
                  background: "#ea580c",
                  color: "#ffffff",
                  fontSize: "12px",
                  fontWeight: 700,
                  border: 0,
                  cursor: "pointer",
                  transition: "all 0.15s ease",
                  whiteSpace: "nowrap",
                }}
                onMouseOver={(e) => (e.currentTarget.style.background = "#c2410c")}
                onMouseOut={(e) => (e.currentTarget.style.background = "#ea580c")}
              >
                Upload & Complete →
              </button>
            </div>

            {/* ── 4. FULL-WIDTH EXPLORE SECTION: CATEGORIES & STATE DOCUMENTS ── */}
            <section
              style={{
                width: "100%",
                background: "#ffffff",
                border: "1px solid #e1e7df",
                borderRadius: "16px",
                padding: "clamp(18px, 2.5vw, 28px)",
                boxShadow: "0 2px 10px rgba(0,0,0,0.02)",
                boxSizing: "border-box",
              }}
            >
              {/* Explore Header & Search Bar */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                  gap: "16px",
                  flexWrap: "wrap",
                  marginBottom: "20px",
                }}
              >
                <div>
                  <span className="eyebrow" style={{ color: "#2b6345" }}>
                    {lang === "EN" ? "EXPLORE SERVICES & CERTIFICATES" : "शासकीय सेवा आणि प्रमाणपत्रे शोधा"}
                  </span>
                  <h3
                    style={{
                      margin: "2px 0 0",
                      fontSize: "22px",
                      fontWeight: 800,
                      fontFamily: "'Space Grotesk', sans-serif",
                      color: "#183226",
                    }}
                  >
                    {lang === "EN" ? "Explore Documents by Category" : "प्रकारानुसार कागदपत्रे व दाखले"}
                  </h3>
                  <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#6e8076" }}>
                    Select any category or search your state certificate to fetch, verify, or manage permissions.
                  </p>
                </div>

                {/* Search Box */}
                <div style={{ position: "relative", minWidth: "300px", flex: "1 1 300px", maxWidth: "420px" }}>
                  <input
                    type="text"
                    value={searchDocQuery}
                    onChange={(e) => setSearchDocQuery(e.target.value)}
                    placeholder="Search certificate, 7/12, caste, income..."
                    style={{
                      width: "100%",
                      padding: "10px 14px 10px 36px",
                      borderRadius: "8px",
                      border: "1px solid #ccd8c8",
                      fontSize: "13px",
                      background: "#f9fbf8",
                      color: "#183025",
                      outline: "none",
                      boxSizing: "border-box",
                    }}
                  />
                  <span
                    style={{
                      position: "absolute",
                      left: "12px",
                      top: "50%",
                      transform: "translateY(-50%)",
                      fontSize: "14px",
                      color: "#83958a",
                    }}
                  >
                    🔍
                  </span>
                  {searchDocQuery && (
                    <button
                      type="button"
                      onClick={() => setSearchDocQuery("")}
                      style={{
                        position: "absolute",
                        right: "12px",
                        top: "50%",
                        transform: "translateY(-50%)",
                        background: "transparent",
                        border: 0,
                        cursor: "pointer",
                        color: "#8b9c92",
                        fontSize: "13px",
                      }}
                    >
                      ✕
                    </button>
                  )}
                </div>
              </div>

              {/* Category Filter Pills */}
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  overflowX: "auto",
                  paddingBottom: "10px",
                  marginBottom: "18px",
                }}
              >
                {documentCategories.map((cat) => (
                  <button
                    key={cat.id}
                    type="button"
                    onClick={() => setSelectedCategory(cat.id)}
                    style={{
                      padding: "8px 16px",
                      borderRadius: "20px",
                      fontSize: "12px",
                      fontWeight: selectedCategory === cat.id ? 700 : 500,
                      background: selectedCategory === cat.id ? "#182c24" : "#f1f5ee",
                      color: selectedCategory === cat.id ? "#ffffff" : "#324d40",
                      border: selectedCategory === cat.id ? "1px solid #182c24" : "1px solid #d9e4d6",
                      cursor: "pointer",
                      whiteSpace: "nowrap",
                      display: "flex",
                      alignItems: "center",
                      gap: "6px",
                      transition: "all 0.15s ease",
                    }}
                  >
                    <span>{cat.icon}</span>
                    <span>{cat.label}</span>
                  </button>
                ))}
              </div>

              {/* Full Width Adaptive Documents Grid */}
              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "14px",
                  width: "100%",
                }}
              >
                {filteredDocuments.map((doc) => (
                  <div
                    key={doc.id}
                    onClick={() => navigate(doc.actionTarget)}
                    style={{
                      background: "#fcfdfa",
                      border: "1px solid #e2e8de",
                      borderRadius: "12px",
                      padding: "16px 18px",
                      display: "flex",
                      flexDirection: "column",
                      justifyContent: "space-between",
                      cursor: "pointer",
                      transition: "all 0.15s ease",
                    }}
                    onMouseOver={(e) => {
                      e.currentTarget.style.borderColor = "#90b87c";
                      e.currentTarget.style.transform = "translateY(-2px)";
                      e.currentTarget.style.boxShadow = "0 4px 14px rgba(23, 44, 40, 0.06)";
                    }}
                    onMouseOut={(e) => {
                      e.currentTarget.style.borderColor = "#e2e8de";
                      e.currentTarget.style.transform = "translateY(0)";
                      e.currentTarget.style.boxShadow = "none";
                    }}
                  >
                    <div>
                      <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "8px" }}>
                        <span style={{ fontSize: "11px", color: "#74887d", fontWeight: 600 }}>{doc.docRef}</span>
                        <span
                          style={{
                            fontSize: "9px",
                            fontWeight: 700,
                            padding: "2px 8px",
                            borderRadius: "4px",
                            background:
                              doc.statusTone === "green"
                                ? "#e6f4ea"
                                : doc.statusTone === "coral"
                                ? "#fce8e6"
                                : doc.statusTone === "amber"
                                ? "#fef7e0"
                                : "#e8f0fe",
                            color:
                              doc.statusTone === "green"
                                ? "#137333"
                                : doc.statusTone === "coral"
                                ? "#c5221f"
                                : doc.statusTone === "amber"
                                ? "#b06000"
                                : "#1a73e8",
                          }}
                        >
                          {doc.status}
                        </span>
                      </div>

                      <strong style={{ fontSize: "14px", color: "#183226", display: "block" }}>{doc.title}</strong>
                      <span style={{ fontSize: "11px", color: "#61746a", display: "block", marginTop: "3px" }}>
                        {doc.dept}
                      </span>
                    </div>

                    <div style={{ marginTop: "14px", paddingTop: "10px", borderTop: "1px solid #edf1ea", display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                      <span style={{ fontSize: "11px", color: "#85978e" }}>
                        Linked: <strong style={{ color: "#314f40" }}>{doc.linkedTo}</strong>
                      </span>
                      <span style={{ fontSize: "11px", fontWeight: 700, color: "#285a40" }}>
                        Access →
                      </span>
                    </div>
                  </div>
                ))}
              </div>
            </section>

            {/* ── 5. FULL-WIDTH DIRECT CITIZEN PORTAL MODULES ── */}
            <div style={{ width: "100%" }}>
              <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                <div>
                  <span className="eyebrow" style={{ color: "#2e6848" }}>PORTAL NAVIGATION</span>
                  <h3 style={{ margin: "2px 0 0", fontSize: "20px", color: "#183226", fontWeight: 700 }}>
                    Core Citizen Modules
                  </h3>
                </div>
                <span style={{ fontSize: "12px", color: "#74887d" }}>One-click direct entry</span>
              </div>

              <div
                style={{
                  display: "grid",
                  gridTemplateColumns: "repeat(auto-fill, minmax(280px, 1fr))",
                  gap: "14px",
                  width: "100%",
                }}
              >
                {/* 1. Applications */}
                <div
                  onClick={() => navigate("applications")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e1e7df",
                    borderRadius: "14px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#8dbb7a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e1e7df";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "28px" }}>📄</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#fef3c7", color: "#b45309" }}>
                      3 Active Schemes
                    </span>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <strong style={{ fontSize: "15px", color: "#183025" }}>My Applications</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#687a70", lineHeight: 1.4 }}>
                      Track scheme stages, PMAY housing, childcare allowances, and grant disbursement receipts.
                    </p>
                  </div>
                  <span style={{ marginTop: "16px", fontSize: "12px", fontWeight: 700, color: "#2d6349" }}>
                    Open Applications →
                  </span>
                </div>

                {/* 2. Connected Services */}
                <div
                  onClick={() => navigate("connections")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e1e7df",
                    borderRadius: "14px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#8dbb7a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e1e7df";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "28px" }}>🔗</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#ecfdf5", color: "#047857" }}>
                      4 Portals Linked
                    </span>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <strong style={{ fontSize: "15px", color: "#183025" }}>Connected Services</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#687a70", lineHeight: 1.4 }}>
                      DigiLocker, State Revenue, Transport & Employment portal synchronization status.
                    </p>
                  </div>
                  <span style={{ marginTop: "16px", fontSize: "12px", fontWeight: 700, color: "#2d6349" }}>
                    View Connections →
                  </span>
                </div>

                {/* 3. Consent Center */}
                <div
                  onClick={() => navigate("consent")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e1e7df",
                    borderRadius: "14px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#8dbb7a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e1e7df";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "28px" }}>🛡️</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#eff6ff", color: "#1d4ed8" }}>
                      6 Active Consents
                    </span>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <strong style={{ fontSize: "15px", color: "#183025" }}>Consent Center</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#687a70", lineHeight: 1.4 }}>
                      DPDP-2023 consent control. Grant, modify or revoke data permissions with 1 click.
                    </p>
                  </div>
                  <span style={{ marginTop: "16px", fontSize: "12px", fontWeight: 700, color: "#2d6349" }}>
                    Manage Consents →
                  </span>
                </div>

                {/* 4. Data Exchange */}
                <div
                  onClick={() => navigate("fetch")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e1e7df",
                    borderRadius: "14px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#8dbb7a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e1e7df";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "28px" }}>⇄</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#ecfdf5", color: "#047857" }}>
                      12 Auto Fetches
                    </span>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <strong style={{ fontSize: "15px", color: "#183025" }}>Data Exchange Hub</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#687a70", lineHeight: 1.4 }}>
                      Instant cross-department document pulls. Zero duplicate form submissions.
                    </p>
                  </div>
                  <span style={{ marginTop: "16px", fontSize: "12px", fontWeight: 700, color: "#2d6349" }}>
                    Test Data Exchange →
                  </span>
                </div>

                {/* 5. Audit Ledger */}
                <div
                  onClick={() => navigate("audits")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e1e7df",
                    borderRadius: "14px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#8dbb7a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e1e7df";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "28px" }}>📋</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#f1f5f9", color: "#475569" }}>
                      Immutable Log
                    </span>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <strong style={{ fontSize: "15px", color: "#183025" }}>Audit Ledger</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#687a70", lineHeight: 1.4 }}>
                      Cryptographic record of every government department data access under your consent.
                    </p>
                  </div>
                  <span style={{ marginTop: "16px", fontSize: "12px", fontWeight: 700, color: "#2d6349" }}>
                    Inspect Ledger →
                  </span>
                </div>

                {/* 6. Notifications & Alerts */}
                <div
                  onClick={() => navigate("notifications")}
                  style={{
                    background: "#ffffff",
                    border: "1px solid #e1e7df",
                    borderRadius: "14px",
                    padding: "20px",
                    cursor: "pointer",
                    transition: "all 0.2s ease",
                    display: "flex",
                    flexDirection: "column",
                    justifyContent: "space-between",
                  }}
                  onMouseOver={(e) => {
                    e.currentTarget.style.borderColor = "#8dbb7a";
                    e.currentTarget.style.transform = "translateY(-2px)";
                  }}
                  onMouseOut={(e) => {
                    e.currentTarget.style.borderColor = "#e1e7df";
                    e.currentTarget.style.transform = "translateY(0)";
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <span style={{ fontSize: "28px" }}>🔔</span>
                    <span style={{ fontSize: "10px", fontWeight: 700, padding: "2px 8px", borderRadius: "10px", background: "#fee2e2", color: "#b91c1c" }}>
                      3 Unread Alerts
                    </span>
                  </div>
                  <div style={{ marginTop: "14px" }}>
                    <strong style={{ fontSize: "15px", color: "#183025" }}>Notification Center</strong>
                    <p style={{ margin: "4px 0 0", fontSize: "12px", color: "#687a70", lineHeight: 1.4 }}>
                      Verification requests, status milestones, and state department alerts.
                    </p>
                  </div>
                  <span style={{ marginTop: "16px", fontSize: "12px", fontWeight: 700, color: "#2d6349" }}>
                    View Notifications →
                  </span>
                </div>
              </div>
            </div>

            {/* ── 6. FULL-WIDTH LIVE INTEROP STREAM & DPDP GUARANTEE ── */}
            <div
              style={{
                width: "100%",
                display: "grid",
                gridTemplateColumns: "repeat(auto-fit, minmax(360px, 1fr))",
                gap: "18px",
              }}
            >
              {/* Live Exchanges Log */}
              <div
                style={{
                  background: "#ffffff",
                  border: "1px solid #e1e7df",
                  borderRadius: "14px",
                  padding: "22px",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: "14px" }}>
                  <span className="eyebrow" style={{ color: "#326e4f" }}>LIVE INTEROP FEED</span>
                  <button type="button" className="text-button" onClick={() => navigate("audits")}>
                    All activity →
                  </button>
                </div>

                <div className="flex flex-col gap-3">
                  {liveFetches.map((item, idx) => (
                    <div
                      key={item.record}
                      className={`flex items-start gap-3 ${
                        idx < liveFetches.length - 1 ? "pb-3 border-b border-[#edf1ed]" : ""
                      }`}
                    >
                      <span className="w-2 h-2 rounded-full bg-emerald-500 mt-1.5 shrink-0" />
                      <div className="flex-1 min-w-0">
                        <p className="m-0 text-xs font-bold text-[#183027]">
                          {item.record}
                        </p>
                        <span className="text-[11px] text-[#788a80]">{item.dept}</span>
                      </div>
                      <div className="text-right shrink-0">
                        <span className="text-[10px] font-bold text-[#2f6b4b] bg-[#eef6eb] px-2 py-0.5 rounded">
                          {item.status}
                        </span>
                        <p className="m-0 mt-0.5 text-[10px] text-[#95a39a]">{item.time}</p>
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* DPDP-2023 Trust & Consent Box */}
              <div className="bg-[#eaf3e3] border border-[#c9dec2] rounded-2xl p-5 flex flex-col justify-between">
                <div>
                  <div className="flex items-center gap-2.5 mb-2.5">
                    <span className="text-2xl">🛡️</span>
                    <strong className="text-[15px] text-[#1a402d]">
                      DPDP-2023 Compliant Citizen Guarantee
                    </strong>
                  </div>
                  <p className="m-0 text-xs text-[#4f705d] leading-relaxed">
                    Under the Digital Personal Data Protection Act, no state department can access your data without your active consent. All data is fetched on-demand, never stored redundantly.
                  </p>
                </div>

                <div className="mt-4 flex items-center justify-between flex-wrap gap-2.5">
                  <span className="text-[11px] font-bold text-[#28563c]">
                    Encrypted • Revocable • Immutable
                  </span>
                  <button
                    type="button"
                    onClick={() => navigate("consent")}
                    className="px-4 py-2 rounded-md bg-[#183025] hover:bg-[#234337] text-white text-xs font-bold transition-all cursor-pointer shadow-sm"
                  >
                    Consent Settings →
                  </button>
                </div>
              </div>
            </div>
          </div>
        </div>
        )}
      </main>

      {/* ── FULL-WIDTH RICH INDIAN GOVERNANCE FOOTER (Tailwind) ── */}
      <footer className="w-full border-t border-[#dce4d9] bg-white px-4 sm:px-8 py-9 mt-auto box-border">
        <div className="w-full">
          {/* Footer Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-7 pb-6 border-b border-[#edf1ea]">
            {/* Col 1: Government Authority & Platform */}
            <div>
              <div className="flex items-center gap-2 mb-2">
                <span className="w-6.5 h-6.5 rounded-md bg-[#d6f06e] text-[#18231f] font-extrabold grid place-items-center text-sm">
                  i
                </span>
                <strong className="text-base text-[#163025]">GovInterop Maharashtra</strong>
              </div>
              <p className="text-xs text-[#667a70] leading-relaxed m-0 mb-2.5">
                Digital Public Infrastructure enabling seamless, consent-driven inter-departmental data exchange across Maharashtra State ministries and central nodes.
              </p>
              <div className="text-[11px] text-[#85978e]">
                Hosted at State Data Center (SDC), Mantralaya, Mumbai
              </div>
            </div>

            {/* Col 2: Citizen Portals & Linked Initiatives */}
            <div>
              <strong className="text-xs text-[#183026] uppercase tracking-wider">
                Key State Initiatives
              </strong>
              <ul className="list-none p-0 m-0 mt-2.5 text-xs text-[#546e62] flex flex-col gap-1.5">
                <li>MahaDBT (Direct Benefit Transfer)</li>
                <li>Aaple Sarkar (Citizen Services Portal)</li>
                <li>Mahabhulekh (7/12 Land Records)</li>
                <li>Sarathi & Vahan (Transport Dept)</li>
                <li>DigiLocker National Cloud Integration</li>
              </ul>
            </div>

            {/* Col 3: Compliance & Legal Directives */}
            <div>
              <strong className="text-xs text-[#183026] uppercase tracking-wider">
                Compliance & Standards
              </strong>
              <ul className="list-none p-0 m-0 mt-2.5 text-xs text-[#546e62] flex flex-col gap-1.5">
                <li onClick={() => navigate("consent")} className="cursor-pointer text-[#25533c] font-semibold hover:underline">
                  DPDP Act 2023 Consent Protocol →
                </li>
                <li>National Data Governance Framework (NDGF)</li>
                <li>ISO 27001 Certified Infrastructure</li>
                <li>e-Pramaan Single Sign-On Architecture</li>
                <li>India Stack Interoperability Standards</li>
              </ul>
            </div>

            {/* Col 4: National Helplines & Grievance */}
            <div>
              <strong className="text-xs text-[#183026] uppercase tracking-wider">
                Toll-Free Support & Helplines
              </strong>
              <div className="mt-2.5 flex flex-col gap-1.5 text-xs text-[#4f685c]">
                <div>📞 <strong>MahaDBT Citizen Helpline:</strong> 1800-120-8040</div>
                <div>📞 <strong>UIDAI Aadhaar Support:</strong> 1947</div>
                <div>📞 <strong>Aaple Sarkar Grievance:</strong> 1800-120-8041</div>
                <div>✉️ <strong>Support Desk:</strong> helpdesk.interop@maharashtra.gov.in</div>
              </div>
            </div>
          </div>

          {/* Bottom Copyright & Status Bar */}
          <div className="pt-4.5 flex items-center justify-between flex-wrap gap-3 text-xs text-[#7a8d83]">
            <div>
              © 2026 <strong>Government of Maharashtra · Department of Information Technology (DIT)</strong>. All rights reserved.
            </div>

            <div className="flex items-center gap-3.5">
              <span className="text-[11px] bg-[#edf5ea] px-2.5 py-1 rounded text-[#285a3f] font-semibold">
                Node v2.4.1 | Mumbai-WR-01
              </span>
              <button
                type="button"
                onClick={() => navigate("audits")}
                className="bg-transparent border-0 text-[#28563d] text-xs font-bold cursor-pointer hover:underline"
              >
                Inspect Audit Ledger
              </button>
              <span>•</span>
              <Link to="/administration" className="text-[#204a35] no-underline font-bold hover:underline">
                Authority Console ↗
              </Link>
            </div>
          </div>
        </div>
      </footer>

      {/* ── 3. GOOGLE GEMINI AI POWERED CITIZEN CHATBOT (Bottom Right) ── */}
      <CitizenChatbot onNavigateSection={navigate} />
    </div>
  );
}

/* ─────────────────────────────────────────────────────────────
   SUBPAGES / SECTIONS (Accessed directly in 1 click)
   ───────────────────────────────────────────────────────────── */

function ApplicationsList({ onOpenDetail }) {
  return (
    <div>
      <div className="section-intro" style={{ marginTop: 0 }}>
        <div>
          <span className="eyebrow">SCHEME MANAGEMENT</span>
          <h2>Track your applications</h2>
          <p>Every state scheme, department, and subsidy in one unified timeline.</p>
        </div>
      </div>

      <div className="application-stack">
        {applicationsList.map((app) => (
          <article
            key={app.id}
            className="application-row clickable"
            onClick={() => onOpenDetail(app.id)}
          >
            <span className={`service-badge ${app.tone}`}>{app.letter}</span>
            <div className="application-main">
              <strong>{app.title}</strong>
              <span>{app.department}</span>
              <small>{app.ref}</small>
            </div>
            <span className={`status-tag ${app.tone}`}>{app.status}</span>
            <div className="application-next">
              <small>Next step</small>
              <span>{app.next}</span>
            </div>
            <span className="row-arrow">→</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function NotificationsView({ onNavigate }) {
  const [unread, setUnread] = useState(3);

  return (
    <div>
      <div className="section-intro" style={{ marginTop: 0 }}>
        <div>
          <span className="eyebrow">NOTIFICATION CENTRE</span>
          <h2>Alerts & Updates</h2>
          <p>Real-time notifications on applications, consent requests, and department verifications.</p>
        </div>
        {unread > 0 && (
          <button type="button" className="text-button" onClick={() => setUnread(0)}>
            Mark all read
          </button>
        )}
      </div>

      <div className="application-stack">
        {[
          ["Action needed",      "Upload income proof",               "Childcare allowance · Family Services",        "Today",     "coral"],
          ["Consent request",    "Review address verification",       "Transport authority data access request",       "Today",     "amber"],
          ["Application update", "Housing support is under review",   "Social Services · No action needed",           "Yesterday", "green"],
          ["Service linked",     "Family Services verified",          "Connection active under DPDP",                 "02 Sep",    "blue"],
        ].map(([category, title, detail, time, tone], i) => (
          <article
            key={title}
            className="application-row clickable"
            onClick={() => onNavigate("applications")}
            style={{
              background: i < unread ? "#fdfef8" : "#fff",
              borderColor: i < unread ? "#cfe0c5" : undefined,
            }}
          >
            <span className={`service-badge ${tone}`}>🔔</span>
            <div className="application-main">
              <span className="eyebrow">{category}</span>
              <strong>{title}</strong>
              <small>{detail}</small>
            </div>
            <span className={`status-tag ${tone}`}>{time}</span>
            <div className="application-next">
              <small>Source</small>
              <span>Maharashtra GovInterop</span>
            </div>
            <span className="row-arrow">→</span>
          </article>
        ))}
      </div>
    </div>
  );
}

function ActivityView({ onNavigate }) {
  const events = [
    ["Today, 09:42", "Housing support accessed income record", "Automated eligibility check under active consent"],
    ["06 Sep 2026",  "Document requested by Family Services", "Income proof required for Childcare allowance"],
    ["05 Sep 2026",  "You linked Family Services", "Consent granted for childcare allowance"],
    ["29 Aug 2026",  "Transport authority requested address", "Request approved by you"],
    ["18 Aug 2026",  "Housing support application registered", "Initial submission with verified DigiLocker data"],
  ];

  return (
    <div>
      <div className="section-intro" style={{ marginTop: 0 }}>
        <div>
          <span className="eyebrow">AUDIT RECORD</span>
          <h2>Your data activity</h2>
          <p>Transparent, DPDP-aligned log of all inter-department data exchanges.</p>
        </div>
        <button type="button" className="text-button" onClick={() => onNavigate("audits")}>
          Full ledger →
        </button>
      </div>

      <div className="application-stack">
        {events.map(([time, title, detail]) => (
          <article key={title} className="application-row">
            <span className="service-badge green">✓</span>
            <div className="application-main">
              <strong>{title}</strong>
              <span>{detail}</span>
            </div>
            <span className="status-tag green">{time}</span>
            <div className="application-next">
              <small>Integrity</small>
              <span>Ledger Verified</span>
            </div>
            <span className="row-arrow">🔒</span>
          </article>
        ))}
      </div>
    </div>
  );
}
