import type { RunningWorkflow, WorkflowNode } from "../workflow/types.js";
import {
    getWorkflowDefinition,
    updateRunningWorkflowTarget,
} from "../workflow/repository.js";

export async function executeRedirectWorkflow(
    workflow: RunningWorkflow,
    node: WorkflowNode
): Promise<void> {
    const targetWorkflowId = node.payload.targetWorkflowId;

    if (
        typeof targetWorkflowId !== "string" ||
        !targetWorkflowId.trim()
    ) {
        throw new Error(
            "Redirect target workflow is required"
        );
    }

    const target = await getWorkflowDefinition(
        targetWorkflowId.trim()
    );

    if (!target) {
        throw new Error(
            `Redirect target workflow ${targetWorkflowId} not found`
        );
    }

    if (!target.start) {
        throw new Error(
            `Redirect target workflow ${target.id} has no start node`
        );
    }

    console.log(
        `Redirecting workflow ${workflow.id} to ${target.id}`
    );

    await updateRunningWorkflowTarget(
        workflow.id,
        target.id,
        target.start
    );
}
