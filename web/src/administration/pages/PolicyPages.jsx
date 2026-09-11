import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { policiesDetailed } from "../data/mockData.js";
import { PageIntro, Status, TableShell } from "../components/AdminShared.jsx";
import { rules } from "../../shared/validation/rules.js";
import { useFormValidation } from "../../shared/validation/useFormValidation.js";
import { FormField, ErrorBanner } from "../../shared/components/FormField.jsx";
import { useConfirm } from "../../shared/dialog/ConfirmDialogContext.jsx";

export function PoliciesPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [policyList, setPolicyList] = useState(policiesDetailed);
  const [query, setQuery] = useState("");
  const [filterStatus, setFilterStatus] = useState("ALL");
  const [activeSimulation, setActiveSimulation] = useState(null);

  const filteredPolicies = policyList.filter((p) => {
    const fieldsStr = Array.isArray(p.fields) ? p.fields.join(" ") : p.fields;
    const matchesQuery = (p.name + p.source + p.target + p.id + fieldsStr)
      .toLowerCase()
      .includes(query.toLowerCase());
    const matchesStatus = filterStatus === "ALL" || p.status === filterStatus;
    return matchesQuery && matchesStatus;
  });

  const handleToggleStatus = async (index) => {
    const policy = filteredPolicies[index];
    const newStatus = policy.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const ok = await confirm({
      title: `${newStatus === "PAUSED" ? "Pause" : "Activate"} Access Policy?`,
      message: `Are you sure you want to ${newStatus.toLowerCase()} the policy "${policy.name}"? Inter-department data exchange between ${policy.source} and ${policy.target} will be ${newStatus === "PAUSED" ? "blocked immediately" : "resumed"}.`,
      confirmText: `${newStatus === "PAUSED" ? "Pause" : "Activate"} Policy`,
      tone: newStatus === "PAUSED" ? "danger" : "standard",
    });
    if (!ok) return;
    setPolicyList((prev) =>
      prev.map((p) => (p.id === policy.id ? { ...p, status: newStatus } : p))
    );
  };

  const handleDeletePolicy = async (index) => {
    const policy = filteredPolicies[index];
    const ok = await confirm({
      title: "Delete Access Policy?",
      message: `Deleting "${policy.name}" (${policy.id}) is recorded permanently in the GovInterop audit ledger.`,
      confirmText: "Delete Policy",
      tone: "danger",
    });
    if (!ok) return;
    setPolicyList((prev) => prev.filter((p) => p.id !== policy.id));
  };

  return (
    <>
      <PageIntro
        eyebrow="F3 / Permission architecture"
        title="Access Policies"
        description="Control which departments can exchange which canonical fields, and enforce DPDP consent requirements before any record is served."
        action="＋ Create policy"
        onAction={() => navigate("/administration/access-policies/new")}
      />

      <section className="policy-callout">
        <div className="policy-callout-icon">◇</div>
        <div>
          <strong>Policy Dry-Run Simulator (ABAC Engine)</strong>
          <p>Test whether a proposed inter-department exchange passes ABAC rules and DPDP consent gates.</p>
        </div>
        <button
          className="outline-button"
          type="button"
          onClick={() => setActiveSimulation(filteredPolicies[0] || policyList[0])}
        >
          Open simulator →
        </button>
      </section>

      <div className="err-filter-bar mb-4">
        <input
          className="err-search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search policies by name, ID, or department..."
        />
        <select
          className="err-select w-44 shrink-0"
          value={filterStatus}
          onChange={(e) => setFilterStatus(e.target.value)}
        >
          <option value="ALL">All Statuses</option>
          <option value="ACTIVE">ACTIVE</option>
          <option value="PAUSED">PAUSED</option>
          <option value="DRAFT">DRAFT</option>
        </select>
      </div>

      <TableShell
        headers={["Policy / ID", "Source → Target", "Fields", "Decision", "Actions", ""]}
        rowClassName="policies-grid"
      >
        {filteredPolicies.length === 0 && (
          <div className="registry-empty">
            <strong>No access policies found</strong>
            <span>Adjust search query or status filter.</span>
          </div>
        )}
        {filteredPolicies.map((policy, index) => (
          <div className="table-row policies-grid" key={policy.id || policy.name}>
            <div className="table-primary">
              <strong className="text-xs font-bold text-[#1a302a]">{policy.name}</strong>
              <small className="flex items-center gap-1.5 mt-0.5">
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: policy.status === "ACTIVE" ? "#467454" : policy.status === "DRAFT" ? "#c08000" : "#b91c1c",
                  }}
                />
                <code className="text-[11px] font-bold text-[#2e5b47]">{policy.id}</code>
                <span>· {policy.status}</span>
              </small>
            </div>
            <div className="flex flex-col text-xs text-[#1a302a]">
              <span className="font-semibold">{policy.source}</span>
              <small className="text-[#7b8980]">→ {policy.target}</small>
            </div>
            <span className="field-chips">
              {Array.isArray(policy.fields) ? `${policy.fields.length} fields` : policy.fields}
            </span>
            <Status tone={policy.decision === "REVIEW" ? "amber" : "green"}>{policy.decision}</Status>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                className="outline-button compact-outline"
                type="button"
                style={{ fontSize: "11px", padding: "3px 8px" }}
                onClick={() => setActiveSimulation(policy)}
              >
                Simulate
              </button>
              <button
                className="outline-button compact-outline"
                type="button"
                style={{ fontSize: "11px", padding: "3px 8px" }}
                onClick={() => handleToggleStatus(index)}
              >
                {policy.status === "ACTIVE" ? "Pause" : "Resume"}
              </button>
              <button
                className="outline-button compact-outline"
                type="button"
                style={{ fontSize: "11px", padding: "3px 8px", color: "#b91c1c" }}
                onClick={() => handleDeletePolicy(index)}
              >
                Delete
              </button>
            </div>
            <button
              className="row-arrow"
              type="button"
              aria-label={`Open ${policy.name}`}
              onClick={() => setActiveSimulation(policy)}
            >
              →
            </button>
          </div>
        ))}
      </TableShell>

      {/* Quick Simulation Modal */}
      {activeSimulation && (
        <PolicySimulationModal simulation={activeSimulation} onClose={() => setActiveSimulation(null)} />
      )}
    </>
  );
}

function PolicySimulationModal({ simulation, onClose }) {
  const fieldsList = Array.isArray(simulation.fields) ? simulation.fields : [simulation.fields];

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
    >
      <div
        style={{
          background: "#ffffff",
          borderRadius: "10px",
          width: "100%",
          maxWidth: "580px",
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
              F3 / ABAC Policy Engine Evaluation · {simulation.id || "SIM"}
            </span>
            <h3 style={{ margin: 0, fontSize: "17px", color: "#173f3b", fontWeight: "700" }}>{simulation.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "22px", cursor: "pointer", color: "#637c6c", lineHeight: 1 }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "8px",
              background: simulation.decision === "ALLOW" ? "#e6f1e5" : "#fff0d8",
              border: `1px solid ${simulation.decision === "ALLOW" ? "#c9e59b" : "#fae1a0"}`,
              marginBottom: "16px",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
            }}
          >
            <div>
              <strong style={{ color: simulation.decision === "ALLOW" ? "#467454" : "#9a6e2d" }}>
                Decision: {simulation.decision}
              </strong>
              <p style={{ margin: "2px 0 0 0", fontSize: "12px", color: "#1d2d2b" }}>
                {simulation.decision === "ALLOW"
                  ? "Subject department is permitted to query target endpoint under active DPDP purpose."
                  : "Requires operational committee review prior to execution."}
              </p>
            </div>
          </div>

          <div style={{ display: "flex", flexDirection: "column", gap: "8px", fontSize: "12px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #edf1ed" }}>
              <span style={{ color: "#637c6c" }}>Subject (Requesting Dept):</span>
              <strong>{simulation.source}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #edf1ed" }}>
              <span style={{ color: "#637c6c" }}>Resource Owner (Target Dept):</span>
              <strong>{simulation.target}</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #edf1ed" }}>
              <span style={{ color: "#637c6c" }}>DPDP Consent Gate:</span>
              <strong style={{ color: "#467454" }}>✓ Enforced ({simulation.consent || "Active Consent Required"})</strong>
            </div>
            <div style={{ padding: "8px 0", borderBottom: "1px solid #edf1ed" }}>
              <span style={{ color: "#637c6c", display: "block", marginBottom: "6px" }}>
                Authorized Canonical Fields ({fieldsList.length}):
              </span>
              <div style={{ display: "flex", flexWrap: "wrap", gap: "5px" }}>
                {fieldsList.map((f) => (
                  <code key={f} style={{ fontSize: "11px", background: "#f0f4ee", padding: "2px 6px", borderRadius: "4px", color: "#1a302a" }}>
                    {f}
                  </code>
                ))}
              </div>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0" }}>
              <span style={{ color: "#637c6c" }}>Audit Log Ledger:</span>
              <strong>SHA-256 Chained Entry Ready</strong>
            </div>
          </div>
        </div>

        <div style={{ padding: "12px 20px", borderTop: "1px solid #dfe7df", display: "flex", justifyContent: "flex-end", background: "#f2f5f1" }}>
          <button className="outline-button" type="button" onClick={onClose}>
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export function PolicyCreatePage() {
  const navigate = useNavigate();
  const [fields, setFields] = useState(["identity.individual.full_name", "identity.demographic.birth", "address.current.district"]);
  const [fieldsError, setFieldsError] = useState(null);
  const [dryRunEvaluation, setDryRunEvaluation] = useState(null);

  const { values, getFieldProps, handleSubmit, errors, touched } = useFormValidation({
    initialValues: {
      name: "Housing assistance eligibility",
      source: "Revenue",
      target: "Housing",
      purpose: "Verify eligibility for housing assistance",
      requiresConsent: true,
    },
    validationRules: {
      name: [rules.required("Policy name is required."), rules.minLength(3, "Policy name must be at least 3 characters.")],
      purpose: [rules.required("Policy purpose is required."), rules.minLength(10, "Purpose must clearly specify the reason (min 10 characters).")],
      source: [rules.required("Source department is required.")],
      target: [
        rules.required("Target department is required."),
        rules.notMatching("source", "Source department", "Target department cannot be identical to Source department."),
      ],
    },
  });

  const toggleField = (field) => {
    setFields((current) => {
      const updated = current.includes(field) ? current.filter((item) => item !== field) : [...current, field];
      if (updated.length > 0) setFieldsError(null);
      return updated;
    });
  };

  const runDryRun = () => {
    const isFieldsValid = fields.length > 0;
    const isDeptsValid = values.source !== values.target;
    const isPurposeValid = (values.purpose || "").trim().length >= 10;

    if (!isFieldsValid) {
      setFieldsError("Select at least one canonical data field.");
    }

    const decision = isFieldsValid && isDeptsValid && isPurposeValid ? "ALLOW" : "DENY";

    const hasPii = fields.some((f) => f.startsWith("identity.") || f.startsWith("contact."));

    setDryRunEvaluation({
      decision,
      source: values.source,
      target: values.target,
      purpose: values.purpose,
      requiresConsent: values.requiresConsent,
      hasPii,
      reasons: [
        isDeptsValid
          ? `✓ Department boundary valid: ${values.source} → ${values.target}`
          : `✗ Department error: Source and target departments cannot be the same.`,
        isPurposeValid
          ? `✓ Purpose justification accepted (${(values.purpose || "").trim().length} chars)`
          : `✗ Purpose error: Legal justification must be at least 10 characters.`,
        isFieldsValid
          ? `✓ Field minimization: ${fields.length} canonical fields selected.`
          : `✗ Field error: At least one canonical field is required.`,
        values.requiresConsent && hasPii
          ? `✓ DPDP Rule: Citizen PII detected; consent gate strictly required.`
          : !values.requiresConsent && hasPii
          ? `⚠ Warning: PII fields requested without mandatory citizen consent toggle.`
          : `✓ Statutory non-PII exchange.`,
      ],
    });
  };

  const onSave = handleSubmit(() => {
    if (fields.length === 0) {
      setFieldsError("Select at least one canonical data field before saving policy.");
      return;
    }
    navigate("/administration/access-policies");
  });

  return (
    <section className="policy-create-page">
      <div className="policy-create-heading">
        <button className="back-link" type="button" onClick={() => navigate("/administration/access-policies")}>
          ← Access Policies
        </button>
        <span className="module-number">F3</span>
        <h2>Create Access Policy</h2>
        <p>Define who may request data, which fields are shared, and the reason for the exchange.</p>
      </div>

      <form noValidate onSubmit={onSave}>
        <div className="policy-form-grid">
          <section className="policy-form-section">
            <div className="register-section-heading">
              <span>1. Policy identity</span>
              <small>Required details</small>
            </div>
            <div className="policy-fields">
              <FormField label="Policy name" htmlFor="name" required error={touched.name && errors.name}>
                <input {...getFieldProps("name")} />
              </FormField>
              <FormField
                label="Purpose"
                htmlFor="purpose"
                required
                hint="Legal and operational reason for data access (DPDP requirement)"
                error={touched.purpose && errors.purpose}
              >
                <textarea {...getFieldProps("purpose")} rows="3" />
              </FormField>
            </div>
            <div className="department-pair">
              <FormField label="Source department" htmlFor="source" required error={touched.source && errors.source}>
                <select {...getFieldProps("source")}>
                  <option>Revenue</option>
                  <option>Skills</option>
                  <option>Citizen services</option>
                </select>
              </FormField>
              <span>→</span>
              <FormField label="Target department" htmlFor="target" required error={touched.target && errors.target}>
                <select {...getFieldProps("target")}>
                  <option>Housing</option>
                  <option>Citizen services</option>
                  <option>Urban development</option>
                </select>
              </FormField>
            </div>
            <label className="consent-toggle">
              <input type="checkbox" {...getFieldProps("requiresConsent", "checkbox")} />
              <span>
                <strong>Require citizen consent (DPDP Mandate)</strong>
                <small>Block requests until an active consent grant is present in the ledger.</small>
              </span>
            </label>
          </section>

          <section className="policy-form-section">
            <div className="register-section-heading">
              <span>2. Data fields</span>
              <small>{fields.length} selected</small>
            </div>
            <p className="policy-helper">Choose the canonical fields this policy allows the target department to request.</p>
            {fieldsError && <ErrorBanner message={fieldsError} />}
            <div className="canonical-options">
              {[
                "identity.individual.full_name",
                "identity.demographic.birth",
                "address.current.district",
                "identity.contact.mobile",
                "application.status",
              ].map((field) => (
                <label className={fields.includes(field) ? "canonical-option selected" : "canonical-option"} key={field}>
                  <input checked={fields.includes(field)} onChange={() => toggleField(field)} type="checkbox" />
                  <span>{field}</span>
                </label>
              ))}
            </div>
          </section>
        </div>

        <section className="dry-run-panel" id="dry-run">
          <div>
            <span className="eyebrow">Policy simulator (ABAC Engine)</span>
            <h2>Dry-run this policy</h2>
            <p>Simulate whether this policy passes ABAC access evaluation and DPDP consent requirements.</p>
          </div>
          <button className="solid-button compact" type="button" onClick={runDryRun}>
            Run evaluation probe
          </button>

          {dryRunEvaluation && (
            <div
              className={`dry-run-result ${dryRunEvaluation.decision.toLowerCase()}`}
              style={{ marginTop: "16px", display: "block" }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "8px" }}>
                <span style={{ fontSize: "16px", fontWeight: "900" }}>
                  {dryRunEvaluation.decision === "ALLOW" ? "✓" : "!"}
                </span>
                <strong>Decision: {dryRunEvaluation.decision}</strong>
              </div>
              <ul style={{ margin: "6px 0 0 0", paddingLeft: "20px", fontSize: "12px", lineHeight: "1.6" }}>
                {dryRunEvaluation.reasons.map((r, i) => (
                  <li key={i}>{r}</li>
                ))}
              </ul>
            </div>
          )}
        </section>

        <div className="register-footer">
          <span>Policy remains local until registered.</span>
          <div>
            <button className="outline-button" type="button" onClick={() => navigate("/administration/access-policies")}>
              Cancel
            </button>
            <button className="solid-button compact" type="submit">
              ✓ Save policy
            </button>
          </div>
        </div>
      </form>
    </section>
  );
}
