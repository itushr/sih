export const WORKFLOW_NODE_TYPES = [
    "START",
    "NOTIFY_CITIZEN",
    "MANUAL_INPUT",
    "PAUSE",
    "REDIRECT_WORKFLOW",
    "END",
] as const;

export type WorkflowNodeType =
    (typeof WORKFLOW_NODE_TYPES)[number];

export type WorkflowRunStatus =
    | "PENDING"
    | "PAUSED"
    | "WAITING_INPUT"
    | "COMPLETE"
    | "ERROR";

export type WorkflowNodeInput = {
    id: string;
    type: WorkflowNodeType;
    payload?: Record<string, unknown>;
    on_success?: string | null;
    on_error?: string | null;
};

export type WorkflowNodeRecord = {
    id: string;
    workflow: string;
    type: WorkflowNodeType;
    payload: Record<string, unknown>;
    on_success: string | null;
    on_error: string | null;
};

export type WorkflowRecord = {
    id: string;
    name: string;
    description: string | null;
    start: string | null;
    created_by: string | null;
    created_at: Date;
    updated_at: Date;
};
