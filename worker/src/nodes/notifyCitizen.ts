import pool from "../config/database.js";
import type { RunningWorkflow, WorkflowNode } from "../workflow/types.js";

export async function executeNotifyCitizen(
    workflow: RunningWorkflow,
    node: WorkflowNode
): Promise<void> {
    const citizen = workflow.data.citizen;

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
            type.trim(),
            title.trim(),
            message.trim(),
            payload,
        ]
    );

    console.log(
        `Notification saved for citizen ${citizen}`
    );
}
