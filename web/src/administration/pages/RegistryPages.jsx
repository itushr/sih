import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { endpoints } from "../data/mockData.js";
import { PageIntro, PanelHead, Status, TableShell } from "../components/AdminShared.jsx";
import { rules } from "../../shared/validation/rules.js";
import { useFormValidation } from "../../shared/validation/useFormValidation.js";
import { FormField, ErrorBanner } from "../../shared/components/FormField.jsx";
import { useConfirm } from "../../shared/dialog/ConfirmDialogContext.jsx";

export function RegistryPage() {
  const navigate = useNavigate();
  const [query, setQuery] = useState("");
  const [statusFilter, setStatusFilter] = useState("ALL");
  const [activeTestEndpoint, setActiveTestEndpoint] = useState(null);

  const filteredEndpoints = endpoints.filter(
    ([name, owner, status]) =>
      `${name} ${owner}`.toLowerCase().includes(query.toLowerCase()) &&
      (statusFilter === "ALL" || (statusFilter === "ATTENTION" ? status !== "ACTIVE" : status === statusFilter))
  );

  return (
    <>
      <PageIntro
        eyebrow="F2 / Service inventory"
        title="API Registry"
        description="A single operational view of the department services connected to interop. Verify health and test canonical mapping."
        action="＋ Register API"
        onAction={() => navigate("/administration/api-registry/new")}
      />

      {/* Health worker banner */}
      <section
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          background: "#ffffff",
          border: "1px solid #dfe7df",
          borderRadius: "8px",
          padding: "12px 20px",
          marginBottom: "20px",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
          <span style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#467454", display: "inline-block" }} />
          <span style={{ fontSize: "12px", color: "#173f3b", fontWeight: "700" }}>
            Automated Health Worker
          </span>
          <span style={{ fontSize: "12px", color: "#637c6c" }}>
            · Active 5-minute background ping (BullMQ) · Next run in 2m 14s
          </span>
        </div>
        <span style={{ fontSize: "11px", fontWeight: "800", color: "#467454", background: "#e6f1e5", padding: "3px 8px", borderRadius: "4px" }}>
          ALL 4 HEALTH RUNNERS ACTIVE
        </span>
      </section>

      <div className="filter-bar">
        <button className={statusFilter === "ALL" ? "filter-active" : ""} onClick={() => setStatusFilter("ALL")} type="button">
          All services <b>24</b>
        </button>
        <button className={statusFilter === "ACTIVE" ? "filter-active" : ""} onClick={() => setStatusFilter("ACTIVE")} type="button">
          Active <b>21</b>
        </button>
        <button className={statusFilter === "ATTENTION" ? "filter-active" : ""} onClick={() => setStatusFilter("ATTENTION")} type="button">
          Needs attention <b>3</b>
        </button>
        <label>
          ⌕ <input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search services or owner" />
        </label>
      </div>

      <TableShell headers={["Service / owner", "Status", "Latency", "Coverage", "Actions", ""]}>
        {filteredEndpoints.length > 0 ? (
          filteredEndpoints.map(([name, owner, status, latency, coverage], index) => (
            <div className="table-row" key={name}>
              <div className="table-primary">
                <span className={`service-dot ${status.toLowerCase()}`} />
                <strong>{name}</strong>
                <small>{owner}</small>
              </div>
              <Status tone={status === "DEGRADED" ? "amber" : status === "UNKNOWN" ? "coral" : "green"}>{status}</Status>
              <span className="table-muted">{latency}</span>
              <span className="table-muted">{coverage}</span>
              <div>
                <button
                  className="outline-button compact-outline"
                  type="button"
                  style={{ fontSize: "11px", padding: "3px 10px" }}
                  onClick={() => setActiveTestEndpoint({ name, owner, status, latency, index })}
                >
                  ⚡ Test (/test)
                </button>
              </div>
              <button className="row-arrow" type="button" aria-label={`Open ${name}`} onClick={() => navigate(`/administration/api-registry/${index}`)}>
                →
              </button>
            </div>
          ))
        ) : (
          <div className="registry-empty">
            <strong>No services found</strong>
            <span>Try a different search or status filter.</span>
          </div>
        )}
      </TableShell>

      {/* Test Endpoint Modal */}
      {activeTestEndpoint && (
        <EndpointTestModal endpoint={activeTestEndpoint} onClose={() => setActiveTestEndpoint(null)} />
      )}
    </>
  );
}

function EndpointTestModal({ endpoint, onClose }) {
  const [testing, setTesting] = useState(false);
  const [result, setResult] = useState(null);
  const [testParam, setTestParam] = useState("MH-CITIZEN-9021");

  const runTest = () => {
    setTesting(true);
    setResult(null);
    setTimeout(() => {
      setTesting(false);
      setResult({
        statusCode: endpoint.status === "DEGRADED" ? 504 : 200,
        statusText: endpoint.status === "DEGRADED" ? "Gateway Timeout (Upstream slow)" : "OK (Connected)",
        roundTripLatency: endpoint.status === "DEGRADED" ? "1,240 ms" : "58 ms",
        timestamp: new Date().toISOString(),
        verifiedFields: [
          { canonical: "identity.individual.full_name", sourceField: "citizen_fullname", value: "Ananya Deshmukh", status: "VALID" },
          { canonical: "identity.demographic.birth", sourceField: "student_dob", value: "1994-08-12", status: "VALID" },
          { canonical: "contact.current.district", sourceField: "res_district", value: "Pune", status: "VALID" },
        ],
        rawPayload: {
          success: true,
          data: {
            aadhaar_hash: "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
            citizen_fullname: "Ananya Deshmukh",
            student_dob: "1994-08-12",
            res_district: "Pune",
            verified_at: "2026-09-07T13:30:00Z"
          },
          meta: { latency_ms: endpoint.status === "DEGRADED" ? 1240 : 58, worker: "health-runner-01" }
        }
      });
    }, 450);
  };

  return (
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
      aria-labelledby="modal-title"
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "8px",
          width: "100%",
          maxWidth: "680px",
          maxHeight: "90vh",
          overflowY: "auto",
          boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
          border: "1px solid #dfe7df",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <div
          style={{
            padding: "16px 20px",
            borderBottom: "1px solid #dfe7df",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            background: "#f2f5f1",
          }}
        >
          <div>
            <span style={{ fontSize: "10px", fontWeight: "800", textTransform: "uppercase", color: "#45645b", letterSpacing: "0.08em" }}>
              API Registry Diagnostic Runner (F2)
            </span>
            <h3 id="modal-title" style={{ margin: 0, fontSize: "18px", color: "#173f3b" }}>
              Test Endpoint: {endpoint.name}
            </h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#637c6c" }}
            aria-label="Close dialog"
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <p style={{ margin: "0 0 16px 0", fontSize: "13px", color: "#45645b" }}>
            Execute a live synthetic probe against this registered endpoint to verify connectivity, latency SLA (p95 &lt;500ms), and canonical normalization.
          </p>

          <div style={{ display: "flex", gap: "10px", marginBottom: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#173f3b", display: "block", marginBottom: "4px" }}>
                Test Subject Identifier (Masked)
              </label>
              <input
                value={testParam}
                onChange={(e) => setTestParam(e.target.value)}
                style={{ width: "100%", padding: "7px 10px", borderRadius: "6px", border: "1px solid #dfe7df" }}
              />
            </div>
            <div style={{ display: "flex", alignItems: "flex-end" }}>
              <button
                className="solid-button compact"
                type="button"
                onClick={runTest}
                disabled={testing}
                style={{ height: "36px" }}
              >
                {testing ? "Testing..." : "⚡ Run /test probe"}
              </button>
            </div>
          </div>

          {result && (
            <div style={{ marginTop: "16px", border: "1px solid #dfe7df", borderRadius: "6px", overflow: "hidden" }}>
              <div
                style={{
                  padding: "10px 14px",
                  background: result.statusCode === 200 ? "#e6f1e5" : "#fff0d8",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                }}
              >
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <strong style={{ color: result.statusCode === 200 ? "#467454" : "#9a6e2d" }}>
                    HTTP {result.statusCode} {result.statusText}
                  </strong>
                </div>
                <span style={{ fontSize: "12px", fontWeight: "700", color: "#173f3b" }}>
                  Round-trip: {result.roundTripLatency}
                </span>
              </div>

              <div style={{ padding: "12px 16px", background: "#ffffff" }}>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#45645b", textTransform: "uppercase" }}>
                  Canonical Field Mappings Verified:
                </span>
                <div style={{ marginTop: "8px", display: "flex", flexDirection: "column", gap: "6px" }}>
                  {result.verifiedFields.map((f) => (
                    <div
                      key={f.canonical}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        fontSize: "12px",
                        padding: "4px 8px",
                        background: "#f7f8f3",
                        borderRadius: "4px",
                      }}
                    >
                      <span>
                        <code>{f.canonical}</code> ← <small>{f.sourceField}</small>
                      </span>
                      <span style={{ fontWeight: "700", color: "#467454" }}>✓ {f.value}</span>
                    </div>
                  ))}
                </div>

                <div style={{ marginTop: "12px" }}>
                  <span style={{ fontSize: "11px", fontWeight: "800", color: "#45645b", textTransform: "uppercase" }}>
                    Raw Response Envelope:
                  </span>
                  <pre style={{ margin: "6px 0 0 0", padding: "10px", background: "#172c28", color: "#d7edbd", borderRadius: "4px", fontSize: "11px" }}>
                    {JSON.stringify(result.rawPayload, null, 2)}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>

        <div
          style={{
            padding: "12px 20px",
            borderTop: "1px solid #dfe7df",
            display: "flex",
            justifyContent: "flex-end",
            background: "#f2f5f1",
          }}
        >
          <button className="outline-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function EndpointDetailPage({ endpointId, editing }) {
  const navigate = useNavigate();
  const [saved, setSaved] = useState(false);
  const [showTestModal, setShowTestModal] = useState(false);
  const [name, owner, status, latency, coverage] = endpoints[Number(endpointId)] || endpoints[0];

  const { getFieldProps, handleSubmit, errors, touched } = useFormValidation({
    initialValues: {
      name,
      owner,
      endpointUrl: `https://api.${owner.toLowerCase().replaceAll(" ", "-")}.gov.in/v1`,
      protocol: "REST",
    },
    validationRules: {
      name: [rules.required("Service name is required."), rules.minLength(3, "Service name must be at least 3 characters.")],
      owner: [rules.required("Department owner is required.")],
      endpointUrl: [rules.required("Base endpoint URL is required."), rules.validUrl("Must be a valid HTTP or HTTPS URL.")],
      protocol: [rules.required("Protocol is required.")],
    },
  });

  const onSave = handleSubmit(() => {
    setSaved(true);
  });

  return (
    <section className="endpoint-detail-page">
      <div className="detail-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/api-registry")}>
          ← API Registry
        </button>
        <div className="detail-title-row">
          <span className={`service-dot ${status.toLowerCase()}`} />
          <div>
            <span className="eyebrow">Registered endpoint / {owner}</span>
            <h2>{name}</h2>
          </div>
          <Status tone={status === "DEGRADED" ? "amber" : status === "UNKNOWN" ? "coral" : "green"}>{status}</Status>
        </div>
        <p>Operational configuration, health history, and endpoint metadata for this connected department service.</p>
      </div>

      <div className="detail-layout">
        <section className="detail-panel">
          <PanelHead eyebrow="Endpoint configuration" title={editing ? "Edit service details" : "Service details"} />
          {editing ? (
            <form className="detail-form" onSubmit={onSave} noValidate>
              <FormField label="Service name" htmlFor="name" required error={touched.name && errors.name}>
                <input {...getFieldProps("name")} />
              </FormField>
              <FormField label="Department owner" htmlFor="owner" required error={touched.owner && errors.owner}>
                <input {...getFieldProps("owner")} />
              </FormField>
              <FormField label="Base endpoint URL" htmlFor="endpointUrl" required error={touched.endpointUrl && errors.endpointUrl}>
                <input {...getFieldProps("endpointUrl")} />
              </FormField>
              <FormField label="Protocol" htmlFor="protocol" required error={touched.protocol && errors.protocol}>
                <select {...getFieldProps("protocol")}>
                  <option>REST</option>
                  <option>SOAP</option>
                  <option>GraphQL</option>
                </select>
              </FormField>
              <button className="solid-button compact" type="submit">
                Save changes
              </button>
              {saved && <span className="save-confirmation">Changes saved locally.</span>}
            </form>
          ) : (
            <div className="detail-list">
              <div>
                <span>Owner department</span>
                <strong>{owner}</strong>
              </div>
              <div>
                <span>Base endpoint</span>
                <strong>https://api.{owner.toLowerCase().replaceAll(" ", "-")}.gov.in/v1</strong>
              </div>
              <div>
                <span>Protocol</span>
                <strong>REST / JSON (HTTPS AES-256)</strong>
              </div>
              <div>
                <span>Registered</span>
                <strong>07 September 2026 · Admin network</strong>
              </div>
            </div>
          )}
        </section>

        <section className="detail-panel health-detail">
          <PanelHead eyebrow="Live signal" title="Health snapshot" />
          <div className="health-score">
            <strong>{latency}</strong>
            <span>current latency</span>
          </div>
          <div className="health-detail-grid">
            <div>
              <strong>99.96%</strong>
              <span>30-day uptime</span>
            </div>
            <div>
              <strong>{coverage}</strong>
              <span>registered coverage</span>
            </div>
          </div>
          <div className="health-line">
            <i />
            <i />
            <i />
            <i />
            <i />
            <i className="current" />
          </div>
          <span className="table-muted">Last automatic health check 2 minutes ago</span>
        </section>
      </div>

      <div className="detail-actions">
        <button className="outline-button" type="button" onClick={() => setShowTestModal(true)}>
          ⚡ Test endpoint (/test)
        </button>
        <button className="outline-button" type="button" onClick={() => navigate(`/administration/api-registry/${endpointId}/edit`)}>
          Edit endpoint
        </button>
        <button className="solid-button compact" type="button" onClick={() => navigate("/administration/access-policies/new")}>
          Create access policy →
        </button>
      </div>

      {showTestModal && (
        <EndpointTestModal
          endpoint={{ name, owner, status, latency, index: endpointId }}
          onClose={() => setShowTestModal(false)}
        />
      )}
    </section>
  );
}

export function RegisterEndpointPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [fields, setFields] = useState([
    { alias: "student_dob", description: "Candidate Date of Birth verified", canonical: "identity.demographic.birth", data: "res.data.aadhaar.demographic" },
    { alias: "citizen_fullname", description: "Full legal name of candidate person", canonical: "identity.individual.full_name", data: "res.data.citizen.profile.name" },
  ]);
  const [fieldErrors, setFieldErrors] = useState([]);
  const [saved, setSaved] = useState(false);

  const { getFieldProps, handleSubmit, errors, touched } = useFormValidation({
    initialValues: {
      alias: "uidai.demographic.verify",
      protocol: "REST",
      method: "POST",
      endpoint: "https://api.uidai.gov.in/auth/v2/verify",
    },
    validationRules: {
      alias: [rules.required("Endpoint alias is required."), rules.validSlug("Alias must follow entity.action format (e.g. uidai.demographic.verify).")],
      protocol: [rules.required("Protocol is required.")],
      method: [rules.required("HTTP method is required.")],
      endpoint: [rules.required("Endpoint URL is required."), rules.validUrl("Must be a valid HTTP or HTTPS URL.")],
    },
  });

  const updateField = (index, key, value) =>
    setFields((current) => current.map((field, fieldIndex) => (fieldIndex === index ? { ...field, [key]: value } : field)));

  const addField = () => setFields((current) => [...current, { alias: "", description: "", canonical: "", data: "" }]);

  const removeField = async (index) => {
    const field = fields[index];
    const fieldName = field?.alias || `Field #${index + 1}`;
    const ok = await confirm({
      title: "Remove Field Mapping?",
      message: `Are you sure you want to remove canonical mapping for "${fieldName}"?`,
      confirmText: "Remove field",
      tone: "danger",
    });
    if (!ok) return;
    setFields((current) => current.filter((_, fieldIndex) => fieldIndex !== index));
  };

  const validateCustomFields = () => {
    if (fields.length === 0) {
      setFieldErrors([{ message: "At least one canonical field mapping is required." }]);
      return false;
    }
    const errs = [];
    fields.forEach((field, index) => {
      if (!field.alias || field.alias.trim() === "") {
        errs.push({ index, key: "alias", message: "Field alias is required." });
      }
      if (!field.canonical || field.canonical.trim() === "") {
        errs.push({ index, key: "canonical", message: "Canonical name is required." });
      } else {
        const canonicalError = rules.validCanonicalField()(field.canonical);
        if (canonicalError) {
          errs.push({ index, key: "canonical", message: canonicalError });
        }
      }
    });
    setFieldErrors(errs);
    return errs.length === 0;
  };

  const onRegister = handleSubmit(() => {
    if (!validateCustomFields()) return;
    navigate("/administration/access-policies/new");
  });

  const onSaveDraft = handleSubmit(() => {
    if (!validateCustomFields()) return;
    setSaved(true);
  });

  const getFieldError = (index, key) => fieldErrors.find((err) => err.index === index && err.key === key)?.message;
  const globalMappingError = fieldErrors.find((err) => err.message && err.index === undefined)?.message;

  return (
    <section className="register-page">
      <div className="register-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/api-registry")}>
          ← API Registry
        </button>
        <span className="module-number">F2</span>
        <h2>Register New API Endpoint</h2>
        <p>Describe the endpoint, then normalize its response into GovInterop's canonical data language.</p>
      </div>

      {globalMappingError && (
        <div style={{ padding: "0 24px", paddingTop: 18 }}>
          <ErrorBanner message={globalMappingError} />
        </div>
      )}

      <form noValidate onSubmit={onRegister}>
        <div className="register-section">
          <div className="register-section-heading">
            <span>→ 1. Endpoint specifications</span>
            <small>Required connection details</small>
          </div>
          <div className="register-grid register-grid-top">
            <FormField label="Alias" htmlFor="alias" required error={touched.alias && errors.alias}>
              <input {...getFieldProps("alias")} placeholder="e.g. uidai.demographic.verify" />
            </FormField>
            <FormField label="Protocol" htmlFor="protocol" required error={touched.protocol && errors.protocol}>
              <select {...getFieldProps("protocol")}>
                <option>REST</option>
                <option>SOAP</option>
                <option>GraphQL</option>
              </select>
            </FormField>
            <FormField label="Method" htmlFor="method" required error={touched.method && errors.method}>
              <select {...getFieldProps("method")}>
                <option>POST</option>
                <option>GET</option>
                <option>PUT</option>
              </select>
            </FormField>
            <FormField label="Endpoint" htmlFor="endpoint" required error={touched.endpoint && errors.endpoint} className="endpoint-field">
              <input {...getFieldProps("endpoint")} placeholder="https://api.department.gov.in/v1" />
            </FormField>
          </div>
          <label className="register-label">
            Inputs
            <div className="input-search">
              ⌕ <input placeholder="Search or add parameters (e.g. aadhaar_hash, roll_no)..." />
            </div>
          </label>
          <div className="input-chips">
            <button type="button"># roll_no ×</button>
            <button type="button"># auth_token ×</button>
            <button type="button"># district_id ×</button>
          </div>
        </div>

        <div className="register-section mapping-section">
          <div className="register-section-heading">
            <span>⚯ 2. Canonical mappings &amp; normalization</span>
            <button className="outline-button compact-outline" type="button" onClick={addField}>
              ＋ Add Field
            </button>
          </div>
          {fields.map((field, index) => (
            <div className="mapping-card" key={`field-${index}`}>
              <div className="mapping-card-heading">
                <strong>● Field #{index + 1}</strong>
                <button className="delete-field" type="button" aria-label={`Remove field ${index + 1}`} onClick={() => removeField(index)}>
                  ♧
                </button>
              </div>
              <div className="mapping-grid">
                <FormField label="Field alias" htmlFor={`field-${index}-alias`} required error={getFieldError(index, "alias")}>
                  <input id={`field-${index}-alias`} value={field.alias} onChange={(event) => updateField(index, "alias", event.target.value)} />
                </FormField>
                <FormField label="Description" htmlFor={`field-${index}-desc`}>
                  <input id={`field-${index}-desc`} value={field.description} onChange={(event) => updateField(index, "description", event.target.value)} />
                </FormField>
                <FormField
                  label="Canonical name"
                  htmlFor={`field-${index}-canonical`}
                  required
                  hint="e.g. identity.demographic.birth"
                  error={getFieldError(index, "canonical")}
                >
                  <input id={`field-${index}-canonical`} value={field.canonical} onChange={(event) => updateField(index, "canonical", event.target.value)} />
                </FormField>
                <FormField label="Data source" htmlFor={`field-${index}-data`}>
                  <input id={`field-${index}-data`} value={field.data} onChange={(event) => updateField(index, "data", event.target.value)} />
                </FormField>
              </div>
            </div>
          ))}
        </div>

        <div className="register-footer">
          <span className={saved ? "save-confirmation" : ""}>
            {saved ? "Draft saved locally" : "All fields are stored in this workspace draft."}
          </span>
          <div>
            <button className="outline-button" type="button" onClick={onSaveDraft}>
              Save as Draft
            </button>
            <button className="solid-button compact" type="submit">
              ✓ Register &amp; Visit Access Policy
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
