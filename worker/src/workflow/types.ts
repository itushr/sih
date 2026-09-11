export type WorkflowNodeType =
    | "START"
    | "NOTIFY_CITIZEN"
    | "FETCH_API"
    | "PAUSE"
    | "RESUME"
    | "MANUAL_INPUT"
    | "CONDITIONAL_ROUTING"
    | "REDIRECT"
    | "ATTACH_DATA"
    | "END";

export type WorkflowRunStatus =
    | "PENDING"
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
