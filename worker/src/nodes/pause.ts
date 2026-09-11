import type { RunningWorkflow, WorkflowNode } from "../workflow/types.js";
import { updateWorkflowStatus } from "../workflow/repository.js";

export async function executePause(
    workflow: RunningWorkflow,
    node: WorkflowNode
): Promise<void> {
    const reason =
        typeof node.payload.reason === "string"
            ? node.payload.reason
            : "Workflow paused";

    console.log(
        `Workflow ${workflow.id} paused at ${node.id}: ${reason}`
    );

    await updateWorkflowStatus(
        workflow.id,
        "PAUSED"
    );
}
