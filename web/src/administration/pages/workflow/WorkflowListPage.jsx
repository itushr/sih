import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdministrationLayout from "../../layout/AdministrationLayout.jsx";
import { PageIntro, Status } from "../../components/AdminShared.jsx";
import { deleteWorkflow, listWorkflows, runWorkflow } from "./workflowApi.js";

export default function WorkflowListPage() {
  return (
    <AdministrationLayout page="workflows">
      <WorkflowList />
    </AdministrationLayout>
  );
}

function WorkflowList() {
  const navigate = useNavigate();
  const [workflows, setWorkflows] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [runTarget, setRunTarget] = useState(null);
  const [runData, setRunData] = useState('{\n  "citizen": ""\n}');
  const [runStatus, setRunStatus] = useState("");

  const load = () => {
    setLoading(true);
    setError("");
    listWorkflows()
      .then((items) => setWorkflows(items || []))
      .catch((cause) => setError(cause.message))
      .finally(() => setLoading(false));
  };

  useEffect(() => {
    load();
  }, []);

  const startRun = async () => {
    if (!runTarget) {
      return;
    }

    setRunStatus("");

    try {
      const data = JSON.parse(runData);
      const running = await runWorkflow(runTarget.id, data);
      setRunStatus(`Run started: ${running.id}`);
      setRunTarget(null);
    } catch (cause) {
      setRunStatus(cause.message);
    }
  };

  const handleDelete = async (workflow) => {
    if (!window.confirm(`Delete workflow "${workflow.name}"? This cannot be undone.`)) {
      return;
    }
    try {
      await deleteWorkflow(workflow.id);
      setWorkflows((prev) => prev.filter((w) => w.id !== workflow.id));
    } catch (cause) {
      setError(cause.message);
    }
  };

  return (
    <>
      <PageIntro
        eyebrow="F7 / Workflow control"
        title="Workflows"
        description="Design and run notification and redirect flows."
        action="＋ New workflow"
        onAction={() => navigate("/administration/workflows/new")}
      />

      {error && (
        <div className="registry-empty" style={{ marginBottom: 16 }}>
          <strong>Could not load workflows</strong>
          <span>{error}</span>
        </div>
      )}

      {runStatus && !runTarget && (
        <p style={{ marginBottom: 16, color: "#467454", fontSize: 13 }}>{runStatus}</p>
      )}

      {loading ? (
        <p style={{ color: "#637c6c" }}>Loading workflows…</p>
      ) : workflows.length === 0 && !error ? (
        <div className="registry-empty">
          <strong>No workflows yet</strong>
          <span>Create a workflow, then add NOTIFY_CITIZEN or REDIRECT_WORKFLOW nodes.</span>
        </div>
      ) : (
        <div className="workflow-grid">
          {workflows.map((workflow) => (
            <article className="workflow-card" key={workflow.id}>
              <div className="workflow-card-top">
                <span className="workflow-icon">↗</span>
                <Status>{Number(workflow.node_count || 0)} nodes</Status>
              </div>
              <h3>{workflow.name}</h3>
              <p>{workflow.description || "No description"}</p>
              <div className="workflow-footer">
                <span>
                  Updated {new Date(workflow.updated_at).toLocaleString()}
                </span>
                <div style={{ display: "flex", gap: 12 }}>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => setRunTarget(workflow)}
                  >
                    Start run
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    onClick={() => navigate(`/administration/workflows/${workflow.id}`)}
                  >
                    Open workflow →
                  </button>
                  <button
                    className="text-button"
                    type="button"
                    style={{ color: "#dc2626" }}
                    onClick={() => handleDelete(workflow)}
                  >
                    Delete
                  </button>
                </div>
              </div>
            </article>
          ))}
        </div>
      )}

      {runTarget && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
          <div className="w-[420px] rounded-xl border border-border bg-slate-200 p-5 shadow-xl">
            <h2 className="mb-3 text-sm font-semibold">Start {runTarget.name}</h2>
            <textarea
              className="mb-4 h-40 w-full rounded-md border border-slate-300 bg-white p-2 font-mono text-xs"
              value={runData}
              onChange={(event) => setRunData(event.target.value)}
            />
            {runStatus && <p className="mb-3 text-xs text-red-700">{runStatus}</p>}
            <div className="flex justify-end gap-2">
              <button
                className="outline-button"
                type="button"
                onClick={() => {
                  setRunTarget(null);
                  setRunStatus("");
                }}
              >
                Cancel
              </button>
              <button className="solid-button compact" type="button" onClick={startRun}>
                Start run
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
