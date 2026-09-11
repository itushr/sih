import type { RunningWorkflow } from "./types.js";

import {
    getRunningWorkflow,
    getWorkflowNode,
    updateCurrentNode,
    updateWorkflowStatus,
} from "./repository.js";

import { executeNotifyCitizen } from "../nodes/notifyCitizen.js";
import { executeEnd } from "../nodes/end.js";

export async function executeWorkflow(
    workflowId: string
): Promise<void> {
    let workflow =
        await getRunningWorkflow(workflowId);

    if (!workflow) {
        throw new Error(
            `Workflow ${workflowId} not found`
        );
    }

    if (workflow.status === "COMPLETE") {
        console.log(
            `Workflow ${workflowId} already completed.`
        );

        return;
    }

    console.log(
        `Executing workflow ${workflow.id}`
    );

    while (true) {
        const node =
            await getWorkflowNode(workflow.current);

        if (!node) {
            throw new Error(
                `Node ${workflow.current} not found`
            );
        }

        console.log(
            `Executing node ${node.id}: ${node.type}`
        );

        try {
            switch (node.type) {
                case "NOTIFY_CITIZEN":
                    await executeNotifyCitizen(
                        workflow,
                        node
                    );

                    await moveToNextNode(
                        workflow,
                        node.on_success
                    );

                    break;

                case "END":
                    await executeEnd(
                        workflow,
                        node
                    );

                    return;

                default:
                    throw new Error(
                        `Unsupported node type: ${node.type}`
                    );
            }
        } catch (error) {
            console.error(
                `Node ${node.id} failed:`,
                error
            );

            if (node.on_error) {
                await moveToNextNode(
                    workflow,
                    node.on_error
                );

                continue;
            }

            await updateWorkflowStatus(
                workflow.id,
                "ERROR"
            );

            throw error;
        }

        workflow =
            (await getRunningWorkflow(workflow.id))!;

        if (!workflow) {
            throw new Error(
                `Workflow ${workflowId} disappeared`
            );
        }
    }
}

async function moveToNextNode(
    workflow: RunningWorkflow,
    nextNodeId: string | null
): Promise<void> {
    if (!nextNodeId) {
        throw new Error(
            `Workflow ${workflow.id} has no next node`
        );
    }

    await updateCurrentNode(
        workflow.id,
        nextNodeId
    );
}
