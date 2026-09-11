import type { RunningWorkflow, WorkflowNode } from "../workflow/types.js";
import { updateWorkflowStatus } from "../workflow/repository.js";

export async function executeManualInput(
    workflow: RunningWorkflow,
    node: WorkflowNode
): Promise<void> {
    const prompt =
        typeof node.payload.prompt === "string"
            ? node.payload.prompt
            : "Waiting for manual input";

    console.log(
        `Workflow ${workflow.id} waiting for input at ${node.id}: ${prompt}`
    );

    await updateWorkflowStatus(
        workflow.id,
        "WAITING_INPUT"
    );
}
