export type WorkflowNodeType =
    | "START"
    | "NOTIFY_CITIZEN"
    | "MANUAL_INPUT"
    | "PAUSE"
    | "REDIRECT_WORKFLOW"
    | "END";

export type WorkflowRunStatus =
    | "PENDING"
    | "PAUSED"
    | "WAITING_INPUT"
    | "COMPLETE"
    | "ERROR";

export interface WorkflowNode {
    id: string;
    type: WorkflowNodeType;
    payload: Record<string, unknown>;
    on_success: string | null;
    on_error: string | null;
}

export interface RunningWorkflow {
    id: string;
    data: Record<string, unknown>;
    workflow: string;
    start: string;
    current: string;
    status: WorkflowRunStatus;
}

export interface WorkflowDefinition {
    id: string;
    name: string;
    start: string | null;
}
