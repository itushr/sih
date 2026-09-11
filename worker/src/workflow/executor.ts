import type { RunningWorkflow } from "./types.js";

import {
    getRunningWorkflow,
    getWorkflowNode,
    updateCurrentNode,
    updateWorkflowStatus,
} from "./repository.js";

import { executeStart } from "../nodes/start.js";
import { executeNotifyCitizen } from "../nodes/notifyCitizen.js";
import { executePause } from "../nodes/pause.js";
import { executeManualInput } from "../nodes/manualInput.js";
import { executeRedirectWorkflow } from "../nodes/redirectWorkflow.js";
import { executeEnd } from "../nodes/end.js";

const WAITING_STATUSES = new Set([
    "COMPLETE",
    "PAUSED",
    "WAITING_INPUT",
]);

export async function executeWorkflow(
    runningWorkflowId: string
): Promise<void> {
    let workflow =
        await getRunningWorkflow(runningWorkflowId);

    if (!workflow) {
        console.warn(
            `[worker] Workflow run ${runningWorkflowId} not found in database (may be deleted or from a previous test). Skipping.`
        );

        return;
    }

    if (WAITING_STATUSES.has(workflow.status)) {
        console.log(
            `Workflow run ${runningWorkflowId} is ${workflow.status}.`
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
                case "START":
                    await executeStart(
                        workflow,
                        node
                    );

                    if (!await moveToNextNode(
                        workflow,
                        node.on_success
                    )) {
                        return;
                    }

                    break;

                case "NOTIFY_CITIZEN":
                    await executeNotifyCitizen(
                        workflow,
                        node
                    );

                    if (!await moveToNextNode(
                        workflow,
                        node.on_success
                    )) {
                        return;
                    }

                    break;

                case "PAUSE":
                    await executePause(
                        workflow,
                        node
                    );

                    return;

                case "MANUAL_INPUT":
                    await executeManualInput(
                        workflow,
                        node
                    );

                    return;

                case "REDIRECT_WORKFLOW":
                    await executeRedirectWorkflow(
                        workflow,
                        node
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
                        `Unsupported node type: ${String(
                            (node as { type: string }).type
                        )}`
                    );
            }
        } catch (error) {
            console.error(
                `Node ${node.id} failed:`,
                error
            );

            if (node.on_error) {
                if (!await moveToNextNode(
                    workflow,
                    node.on_error
                )) {
                    return;
                }

                workflow =
                    (await getRunningWorkflow(workflow.id))!;

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
                `Workflow run ${runningWorkflowId} disappeared`
            );
        }

        if (WAITING_STATUSES.has(workflow.status)) {
            return;
        }
    }
}

async function moveToNextNode(
    workflow: RunningWorkflow,
    nextNodeId: string | null
): Promise<boolean> {
    if (!nextNodeId) {
        console.log(
            `Workflow ${workflow.id} reached end of execution.`
        );

        await updateWorkflowStatus(
            workflow.id,
            "COMPLETE"
        );

        return false;
    }

    await updateCurrentNode(
        workflow.id,
        nextNodeId
    );

    return true;
}
