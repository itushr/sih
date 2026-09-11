import type { PoolClient } from "pg";
import pool from "../config/database.js";
import type {
    WorkflowNodeInput,
    WorkflowNodeRecord,
    WorkflowRecord,
    WorkflowRunStatus,
} from "./types.js";

type WorkflowListRow = WorkflowRecord & {
    node_count: string;
};

export async function listWorkflows(
    platformId: string
): Promise<WorkflowListRow[]> {
    const result = await pool.query<WorkflowListRow>(
        `SELECT
            w.id,
            w.name,
            w.description,
            w.start,
            COALESCE(w.created_by, w.by_platform) as created_by,
            w.created_at,
            w.updated_at,
            (
                SELECT COUNT(*)::text
                FROM workflow_node_registry n
                WHERE n.workflow = w.id
            ) AS node_count
         FROM workflow_registry w
         WHERE w.created_by = $1 OR w.by_platform = $1
         ORDER BY w.updated_at DESC`,
        [platformId]
    );

    return result.rows;
}

export async function getWorkflowById(
    id: string,
    platformId?: string
): Promise<WorkflowRecord | null> {
    const params: string[] = [id];
    let platformFilter = "";

    if (platformId) {
        params.push(platformId);
        platformFilter = "AND (created_by = $2 OR by_platform = $2)";
    }

    const result = await pool.query<WorkflowRecord>(
        `SELECT
            id,
            name,
            description,
            start,
            COALESCE(created_by, by_platform) as created_by,
            created_at,
            updated_at
         FROM workflow_registry
         WHERE id = $1
         ${platformFilter}`,
        params
    );

    return result.rows[0] ?? null;
}

export async function getWorkflowNodes(
    workflowId: string
): Promise<WorkflowNodeRecord[]> {
    const result = await pool.query<WorkflowNodeRecord>(
        `SELECT
            id,
            workflow,
            type,
            payload,
            on_success,
            on_error
         FROM workflow_node_registry
         WHERE workflow = $1`,
        [workflowId]
    );

    return result.rows;
}

export async function getWorkflowNodeById(
    id: string
): Promise<WorkflowNodeRecord | null> {
    const result = await pool.query<WorkflowNodeRecord>(
        `SELECT
            id,
            workflow,
            type,
            payload,
            on_success,
            on_error
         FROM workflow_node_registry
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function insertWorkflow(
    client: PoolClient,
    input: {
        name: string;
        description: string | null;
        createdBy: string;
        start?: string | null;
    }
): Promise<WorkflowRecord> {
    const result = await client.query<WorkflowRecord>(
        `INSERT INTO workflow_registry (
            name,
            description,
            created_by,
            by_platform,
            start
        )
        VALUES ($1, $2, $3, $3, $4)
        RETURNING
            id,
            name,
            description,
            start,
            COALESCE(created_by, by_platform) as created_by,
            created_at,
            updated_at`,
        [input.name, input.description, input.createdBy, input.start ?? null]
    );

    return result.rows[0]!;
}

export async function deleteWorkflow(
    id: string,
    platformId: string
): Promise<boolean> {
    const result = await pool.query(
        `DELETE FROM workflow_registry
         WHERE id = $1 AND (created_by = $2 OR by_platform = $2)`,
        [id, platformId]
    );

    return (result.rowCount ?? 0) > 0;
}

export async function updateWorkflowMeta(
    client: PoolClient,
    input: {
        id: string;
        name: string;
        description: string | null;
        start: string | null;
    }
): Promise<WorkflowRecord> {
    const result = await client.query<WorkflowRecord>(
        `UPDATE workflow_registry
         SET
            name = $2,
            description = $3,
            start = $4,
            updated_at = NOW()
         WHERE id = $1
         RETURNING
            id,
            name,
            description,
            start,
            COALESCE(created_by, by_platform) as created_by,
            created_at,
            updated_at`,
        [input.id, input.name, input.description, input.start]
    );

    return result.rows[0]!;
}

export async function replaceWorkflowNodes(
    client: PoolClient,
    workflowId: string,
    nodes: WorkflowNodeInput[]
): Promise<void> {
    await client.query(
        `DELETE FROM workflow_node_registry
         WHERE workflow = $1`,
        [workflowId]
    );

    for (const node of nodes) {
        await client.query(
            `INSERT INTO workflow_node_registry (
                id,
                workflow,
                type,
                payload,
                on_success,
                on_error
            )
            VALUES ($1, $2, $3, $4, NULL, NULL)`,
            [
                node.id,
                workflowId,
                node.type,
                node.payload ?? {},
            ]
        );
    }

    for (const node of nodes) {
        if (node.on_success || node.on_error) {
            await client.query(
                `UPDATE workflow_node_registry
                 SET on_success = $2, on_error = $3
                 WHERE id = $1`,
                [
                    node.id,
                    node.on_success ?? null,
                    node.on_error ?? null,
                ]
            );
        }
    }
}

export async function insertRunningWorkflow(
    input: {
        data: Record<string, unknown>;
        workflowId: string;
        start: string;
        current: string;
        status?: WorkflowRunStatus;
    }
) {
    const result = await pool.query(
        `INSERT INTO running_workflow_registry (
            data,
            workflow,
            start,
            current,
            status
        )
        VALUES ($1, $2, $3, $4, $5)
        RETURNING
            id,
            data,
            workflow,
            start,
            current,
            status`,
        [
            input.data,
            input.workflowId,
            input.start,
            input.current,
            input.status ?? "PENDING",
        ]
    );

    return result.rows[0];
}

export async function getRunningWorkflowById(
    id: string
) {
    const result = await pool.query(
        `SELECT
            id,
            data,
            workflow,
            start,
            current,
            status
         FROM running_workflow_registry
         WHERE id = $1`,
        [id]
    );

    return result.rows[0] ?? null;
}

export async function updateRunningWorkflow(
    id: string,
    input: {
        current: string;
        status: WorkflowRunStatus;
        data?: Record<string, unknown>;
    }
) {
    if (input.data) {
        await pool.query(
            `UPDATE running_workflow_registry
             SET
                current = $2,
                status = $3,
                data = $4,
                updated_at = NOW()
             WHERE id = $1`,
            [id, input.current, input.status, input.data]
        );

        return;
    }

    await pool.query(
        `UPDATE running_workflow_registry
         SET
            current = $2,
            status = $3,
            updated_at = NOW()
         WHERE id = $1`,
        [id, input.current, input.status]
    );
}
