const API_BASE = import.meta.env.VITE_API_URL || "";

async function request(path, options = {}) {
    const response = await fetch(`${API_BASE}${path}`, {
        credentials: "include",
        headers: {
            "Content-Type": "application/json",
            ...(options.headers || {}),
        },
        ...options,
    });

    const body = await response.json().catch(() => ({}));

    if (!response.ok) {
        throw new Error(
            body.error || `Request failed (${response.status})`
        );
    }

    return body.data;
}

export const listWorkflows = () =>
    request("/api/workflows");

export const getWorkflow = (workflowId) =>
    request(`/api/workflows/${workflowId}`);

export const createWorkflow = (payload) =>
    request("/api/workflows", {
        method: "POST",
        body: JSON.stringify(payload),
    });

export const updateWorkflow = (workflowId, payload) =>
    request(`/api/workflows/${workflowId}`, {
        method: "PUT",
        body: JSON.stringify(payload),
    });

export const deleteWorkflow = (workflowId) =>
    request(`/api/workflows/${workflowId}`, {
        method: "DELETE",
    });

export const runWorkflow = (workflowId, data) =>
    request(`/api/workflows/${workflowId}/run`, {
        method: "POST",
        body: JSON.stringify({ data }),
    });

export const resumeWorkflow = (runId, data) =>
    request(`/api/workflows/runs/${runId}/resume`, {
        method: "POST",
        body: JSON.stringify({ data }),
    });
