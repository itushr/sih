import pool from "../config/database.js";
import type { RunningWorkflow, WorkflowNode } from "../workflow/types.js";

function interpolateString(
    template: string,
    data: Record<string, unknown>
): string {
    if (typeof template !== "string") {
        return "";
    }

    return template.replace(
        /\{\{\s*([a-zA-Z0-9_.-]+)\s*\}\}/g,
        (match, key) => {
            const val = data[key];
            return val !== undefined && val !== null ? String(val) : match;
        }
    );
}

function interpolateValue(
    val: unknown,
    data: Record<string, unknown>
): unknown {
    if (typeof val === "string") {
        return interpolateString(val, data);
    }
    if (Array.isArray(val)) {
        return val.map((item) => interpolateValue(item, data));
    }
    if (val && typeof val === "object") {
        const result: Record<string, unknown> = {};
        for (const [k, v] of Object.entries(val)) {
            result[k] = interpolateValue(v, data);
        }
        return result;
    }
    return val;
}

export async function executeNotifyCitizen(
    workflow: RunningWorkflow,
    node: WorkflowNode
): Promise<void> {
    const workflowData =
        workflow.data && typeof workflow.data === "object"
            ? (workflow.data as Record<string, unknown>)
            : {};

    const citizen = workflowData.citizen;

    if (
        typeof citizen !== "string" ||
        !citizen.trim()
    ) {
        throw new Error(
            "Citizen ID not found in workflow data"
        );
    }

    const {
        type,
        title,
        message,
        payload = {},
        ...extraFields
    } = node.payload;

    if (
        typeof type !== "string" ||
        !type.trim()
    ) {
        throw new Error(
            "Notification type is required"
        );
    }

    if (
        typeof title !== "string" ||
        !title.trim()
    ) {
        throw new Error(
            "Notification title is required"
        );
    }

    if (
        typeof message !== "string" ||
        !message.trim()
    ) {
        throw new Error(
            "Notification message is required"
        );
    }

    const normalizedType = type.trim().toUpperCase().replace(/[-\s]/g, "_");

    const interpolatedTitle = interpolateString(title.trim(), workflowData);
    const interpolatedMessage = interpolateString(message.trim(), workflowData);

    // Merge nested payload and any top-level config fields (like documentType, consentPurpose, status)
    const combinedPayload = {
        ...(typeof extraFields === "object" ? extraFields : {}),
        ...(typeof payload === "object" ? payload : {}),
    };

    const interpolatedPayload = interpolateValue(combinedPayload, workflowData) as Record<string, unknown>;

    await pool.query(
        `
        INSERT INTO citizen_notifications (
            citizen,
            type,
            title,
            message,
            payload
        )
        VALUES ($1, $2, $3, $4, $5)
        `,
        [
            citizen.trim(),
            normalizedType,
            interpolatedTitle,
            interpolatedMessage,
            interpolatedPayload,
        ]
    );

    console.log(
        `[${normalizedType}] Notification saved for citizen ${citizen}: "${interpolatedTitle}"`
    );
}
