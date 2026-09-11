import pool from "../config/database.js";
import { enqueueWorkflowRun } from "../kafka/producer.js";
import {
    isNonEmptyString,
    isObject,
} from "../utils/validation.js";
import {
    deleteWorkflow,
    getRunningWorkflowById,
    getWorkflowById,
    getWorkflowNodeById,
    getWorkflowNodes,
    insertRunningWorkflow,
    insertWorkflow,
    listWorkflows,
    replaceWorkflowNodes,
    updateRunningWorkflow,
    updateWorkflowMeta,
} from "./repository.js";
import { ensureWorkflowTables } from "./schema.js";
import {
    WORKFLOW_NODE_TYPES,
    type WorkflowNodeInput,
    type WorkflowNodeType,
} from "./types.js";

let tablesReady = false;

export async function readyWorkflowStore(): Promise<void> {
    if (tablesReady) {
        return;
    }

    await ensureWorkflowTables();
    tablesReady = true;
}

const isUuid = (value: string) =>
    /^[0-9a-f]{8}-[0-9a-f]{4}-[1-8][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i.test(
        value
    );

const isNodeType = (
    value: unknown
): value is WorkflowNodeType => {
    return (
        typeof value === "string" &&
        WORKFLOW_NODE_TYPES.includes(
            value as WorkflowNodeType
        )
    );
};

export function validateWorkflowNodes(
    nodes: unknown,
    start: unknown
): string | null {
    if (!Array.isArray(nodes) || nodes.length === 0) {
        return "At least one workflow node is required";
    }

    if (!isNonEmptyString(start) || !isUuid(start)) {
        return "A valid start node is required";
    }

    const ids = new Set<string>();

    for (const node of nodes) {
        if (!isObject(node)) {
            return "Each node must be an object";
        }

        if (!isNonEmptyString(node.id) || !isUuid(node.id)) {
            return "Each node must have a valid UUID";
        }

        if (ids.has(node.id)) {
            return "Duplicate node IDs are not allowed";
        }

        ids.add(node.id);

        if (!isNodeType(node.type)) {
            return (
                "Unsupported node type. Allowed: " +
                WORKFLOW_NODE_TYPES.join(", ")
            );
        }

        if (
            node.payload !== undefined &&
            !isObject(node.payload)
        ) {
            return "Node payload must be an object";
        }

        if (
            node.on_success !== null &&
            node.on_success !== undefined &&
            (
                !isNonEmptyString(node.on_success) ||
                !isUuid(node.on_success)
            )
        ) {
            return "on_success must be a UUID or null";
        }

        if (
            node.on_error !== null &&
            node.on_error !== undefined &&
            (
                !isNonEmptyString(node.on_error) ||
                !isUuid(node.on_error)
            )
        ) {
            return "on_error must be a UUID or null";
        }

        const payloadError = validateNodePayload(
            node.type,
            isObject(node.payload) ? node.payload : {}
        );

        if (payloadError) {
            return payloadError;
        }
    }

    if (!ids.has(start)) {
        return "Start node must exist in the node list";
    }

    for (const node of nodes) {
        const typed = node as WorkflowNodeInput;

        if (
            typed.on_success &&
            !ids.has(typed.on_success)
        ) {
            return "on_success must reference a node in this workflow";
        }

        if (
            typed.on_error &&
            !ids.has(typed.on_error)
        ) {
            return "on_error must reference a node in this workflow";
        }
    }

    return null;
}

function validateNodePayload(
    type: WorkflowNodeType,
    payload: Record<string, unknown>
): string | null {
    if (type === "NOTIFY_CITIZEN") {
        if (!isNonEmptyString(payload.type)) {
            return "NOTIFY_CITIZEN requires payload.type";
        }

        const normalizedType = (payload.type as string).trim().toUpperCase().replace(/[-\s]/g, "_");
        const allowedTypes = [
            "STATUS_UPDATE",
            "TEXT_ONLY",
            "ACTION_REQUIRED",
            "CONSENT_REQUEST",
            "APPLICATION_UPDATE",
            "INFO",
        ];
        if (!allowedTypes.includes(normalizedType)) {
            return `NOTIFY_CITIZEN payload.type must be one of: STATUS_UPDATE, TEXT_ONLY, ACTION_REQUIRED, CONSENT_REQUEST`;
        }

        if (!isNonEmptyString(payload.title)) {
            return "NOTIFY_CITIZEN requires payload.title";
        }

        if (!isNonEmptyString(payload.message)) {
            return "NOTIFY_CITIZEN requires payload.message";
        }
    }

    if (type === "MANUAL_INPUT") {
        if (
            payload.fields !== undefined &&
            (
                !Array.isArray(payload.fields) ||
                !payload.fields.every(
                    (field) => typeof field === "string"
                )
            )
        ) {
            return "MANUAL_INPUT payload.fields must be an array of strings";
        }
    }

    if (type === "REDIRECT_WORKFLOW") {
        if (
            !isNonEmptyString(payload.targetWorkflowId) ||
            !isUuid(payload.targetWorkflowId)
        ) {
            return "REDIRECT_WORKFLOW requires payload.targetWorkflowId";
        }
    }

    return null;
}

export async function listPlatformWorkflows(
    platformId: string
) {
    await readyWorkflowStore();
    return listWorkflows(platformId);
}

export async function deletePlatformWorkflow(
    id: string,
    platformId: string
) {
    await readyWorkflowStore();
    return deleteWorkflow(id, platformId);
}

export async function getPlatformWorkflow(
    id: string,
    platformId: string
) {
    await readyWorkflowStore();

    const workflow = await getWorkflowById(id, platformId);

    if (!workflow) {
        return null;
    }

    const nodes = await getWorkflowNodes(workflow.id);

    return {
        ...workflow,
        nodes,
    };
}

export async function saveWorkflow(input: {
    id?: string;
    platformId: string;
    name: string;
    description: string | null;
    start: string;
    nodes: WorkflowNodeInput[];
}) {
    await readyWorkflowStore();

    const client = await pool.connect();

    try {
        await client.query("BEGIN");

        let workflowId = input.id;

        if (workflowId) {
            const existing = await getWorkflowById(
                workflowId,
                input.platformId
            );

            if (!existing) {
                await client.query("ROLLBACK");
                return { error: "not_found" as const };
            }

            await client.query(
                `UPDATE workflow_registry SET start = NULL WHERE id = $1`,
                [workflowId]
            );
        } else {
            const created = await insertWorkflow(client, {
                name: input.name,
                description: input.description,
                createdBy: input.platformId,
                start: null,
            });

            workflowId = created.id;
        }

        await replaceWorkflowNodes(
            client,
            workflowId,
            input.nodes
        );

        const workflow = await updateWorkflowMeta(client, {
            id: workflowId,
            name: input.name,
            description: input.description,
            start: input.start,
        });

        await client.query("COMMIT");

        const nodes = await getWorkflowNodes(workflow.id);

        return {
            workflow: {
                ...workflow,
                nodes,
            },
        };
    } catch (error) {
        await client.query("ROLLBACK");
        throw error;
    } finally {
        client.release();
    }
}

export async function startWorkflowRun(input: {
    workflowId: string;
    platformId: string;
    data: Record<string, unknown>;
}) {
    await readyWorkflowStore();

    const workflow = await getWorkflowById(
        input.workflowId,
        input.platformId
    );

    if (!workflow) {
        return { error: "not_found" as const };
    }

    if (!workflow.start) {
        return { error: "no_start" as const };
    }

    const startNode = await getWorkflowNodeById(
        workflow.start
    );

    if (!startNode || startNode.workflow !== workflow.id) {
        return { error: "no_start" as const };
    }

    const running = await insertRunningWorkflow({
        data: input.data,
        workflowId: workflow.id,
        start: workflow.start,
        current: workflow.start,
        status: "PENDING",
    });

    try {
        await enqueueWorkflowRun(running.id);
    } catch (error) {
        return {
            error: "enqueue_failed" as const,
            running,
            cause: error,
        };
    }

    return { running };
}

export async function resumeWorkflowRun(input: {
    runningWorkflowId: string;
    data?: Record<string, unknown>;
}) {
    await readyWorkflowStore();

    const running = await getRunningWorkflowById(
        input.runningWorkflowId
    );

    if (!running) {
        return { error: "not_found" as const };
    }

    if (
        running.status !== "PAUSED" &&
        running.status !== "WAITING_INPUT"
    ) {
        return { error: "not_waiting" as const };
    }

    const currentNode = await getWorkflowNodeById(
        running.current
    );

    if (!currentNode) {
        return { error: "node_missing" as const };
    }

    if (!currentNode.on_success) {
        return { error: "no_next" as const };
    }

    const nextData =
        running.status === "WAITING_INPUT"
            ? {
                ...(isObject(running.data)
                    ? running.data
                    : {}),
                ...(input.data ?? {}),
            }
            : isObject(running.data)
                ? running.data
                : {};

    await updateRunningWorkflow(running.id, {
        current: currentNode.on_success,
        status: "PENDING",
        data: nextData,
    });

    try {
        await enqueueWorkflowRun(running.id);
    } catch (error) {
        return {
            error: "enqueue_failed" as const,
            cause: error,
        };
    }

    const updated = await getRunningWorkflowById(
        running.id
    );

    return { running: updated };
}
