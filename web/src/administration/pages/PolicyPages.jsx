import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { policies as initialPolicies } from "../data/mockData.js";
import { PageIntro, Status, TableShell } from "../components/AdminShared.jsx";
import { rules } from "../../shared/validation/rules.js";
import { useFormValidation } from "../../shared/validation/useFormValidation.js";
import { FormField, ErrorBanner } from "../../shared/components/FormField.jsx";
import { useConfirm } from "../../shared/dialog/ConfirmDialogContext.jsx";

export function PoliciesPage() {
  const navigate = useNavigate();
  const confirm = useConfirm();
  const [policyList, setPolicyList] = useState(
    initialPolicies.map(([name, source, target, fields, decision]) => ({
      name,
      source,
      target,
      fields,
      decision,
      status: "ACTIVE",
    }))
  );
  const [activeSimulation, setActiveSimulation] = useState(null);

  const handleToggleStatus = async (index) => {
    const policy = policyList[index];
    const newStatus = policy.status === "ACTIVE" ? "PAUSED" : "ACTIVE";
    const ok = await confirm({
      title: `${newStatus === "PAUSED" ? "Pause" : "Activate"} Access Policy?`,
      message: `Are you sure you want to ${newStatus.toLowerCase()} the policy "${policy.name}"? Inter-department data exchange between ${policy.source} and ${policy.target} will be ${newStatus === "PAUSED" ? "blocked immediately" : "resumed"}.`,
      confirmText: `${newStatus === "PAUSED" ? "Pause" : "Activate"} Policy`,
      tone: newStatus === "PAUSED" ? "danger" : "standard",
    });
    if (!ok) return;
    setPolicyList((prev) =>
      prev.map((p, i) => (i === index ? { ...p, status: newStatus } : p))
    );
  };

  const handleDeletePolicy = async (index) => {
    const policy = policyList[index];
    const ok = await confirm({
      title: "Delete Access Policy?",
      message: `Deleting "${policy.name}" is recorded permanently in the GovInterop audit ledger.`,
      confirmText: "Delete Policy",
      tone: "danger",
    });
    if (!ok) return;
    setPolicyList((prev) => prev.filter((_, i) => i !== index));
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
          onClick={() => navigate("/administration/access-policies/new#dry-run")}
        >
          Open simulator →
        </button>
      </section>

      <TableShell headers={["Policy / Status", "Source → target", "Fields", "Decision", "Actions", ""]}>
        {policyList.map((policy, index) => (
          <div className="table-row" key={policy.name}>
            <div className="table-primary">
              <strong>{policy.name}</strong>
              <small>
                <span
                  style={{
                    display: "inline-block",
                    width: "6px",
                    height: "6px",
                    borderRadius: "50%",
                    background: policy.status === "ACTIVE" ? "#467454" : "#a85f50",
                    marginRight: "6px",
                  }}
                />
                {policy.status} · Updated today
              </small>
            </div>
            <span className="table-muted">
              {policy.source} → {policy.target}
            </span>
            <span className="field-chips">{policy.fields}</span>
            <Status tone={policy.decision === "REVIEW" ? "amber" : "green"}>{policy.decision}</Status>
            <div style={{ display: "flex", gap: "6px" }}>
              <button
                className="outline-button compact-outline"
                type="button"
                style={{ fontSize: "11px", padding: "3px 8px" }}
                onClick={() =>
                  setActiveSimulation({
                    name: policy.name,
                    source: policy.source,
                    target: policy.target,
                    fields: policy.fields,
                    decision: policy.decision,
                  })
                }
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
                style={{ fontSize: "11px", padding: "3px 8px", color: "#a85f50" }}
                onClick={() => handleDeletePolicy(index)}
              >
                Delete
              </button>
            </div>
            <button
              className="row-arrow"
              type="button"
              aria-label={`Open ${policy.name}`}
              onClick={() => navigate("/administration/access-policies/new#dry-run")}
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
          borderRadius: "8px",
          width: "100%",
          maxWidth: "580px",
          boxShadow: "0 12px 36px rgba(0,0,0,0.18)",
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
              F3 / ABAC Policy Engine Evaluation
            </span>
            <h3 style={{ margin: 0, fontSize: "17px", color: "#173f3b" }}>{simulation.name}</h3>
          </div>
          <button
            type="button"
            onClick={onClose}
            style={{ background: "none", border: "none", fontSize: "20px", cursor: "pointer", color: "#637c6c" }}
          >
            ×
          </button>
        </div>

        <div style={{ padding: "20px" }}>
          <div
            style={{
              padding: "12px 16px",
              borderRadius: "6px",
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
              <strong style={{ color: "#467454" }}>✓ Enforced (Active Consent Required)</strong>
            </div>
            <div style={{ display: "flex", justifyContent: "space-between", padding: "6px 0", borderBottom: "1px solid #edf1ed" }}>
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
