import pool from "../config/database.js";
import type {
    RunningWorkflow,
    WorkflowDefinition,
    WorkflowNode,
    WorkflowRunStatus,
} from "./types.js";

export async function getRunningWorkflow(
    id: string
): Promise<RunningWorkflow | null> {
    const result = await pool.query(
        `
        SELECT
            id,
            data,
            workflow,
            start,
            current,
            status
        FROM running_workflow_registry
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function getWorkflowNode(
    id: string
): Promise<WorkflowNode | null> {
    const result = await pool.query(
        `
        SELECT
            id,
            type,
            payload,
            on_success,
            on_error
        FROM workflow_node_registry
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function getWorkflowDefinition(
    id: string
): Promise<WorkflowDefinition | null> {
    const result = await pool.query(
        `
        SELECT
            id,
            name,
            start
        FROM workflow_registry
        WHERE id = $1
        `,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function updateCurrentNode(
    workflowId: string,
    nodeId: string
): Promise<void> {
    await pool.query(
        `
        UPDATE running_workflow_registry
        SET current = $1
        WHERE id = $2
        `,
        [nodeId, workflowId]
    );
}

export async function updateWorkflowStatus(
    workflowId: string,
    status: WorkflowRunStatus
): Promise<void> {
    await pool.query(
        `
        UPDATE running_workflow_registry
        SET status = $1
        WHERE id = $2
        `,
        [status, workflowId]
    );
}

export async function updateRunningWorkflowTarget(
    runningWorkflowId: string,
    workflowId: string,
    currentNodeId: string
): Promise<void> {
    await pool.query(
        `
        UPDATE running_workflow_registry
        SET
            workflow = $1,
            current = $2,
            status = 'PENDING'
        WHERE id = $3
        `,
        [workflowId, currentNodeId, runningWorkflowId]
    );
}
