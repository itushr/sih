import type { RunningWorkflow, WorkflowNode } from "../workflow/types.js";
import { updateWorkflowStatus } from "../workflow/repository.js";

export async function executeEnd(
    workflow: RunningWorkflow,
    _node: WorkflowNode
): Promise<void> {
    console.log(
        `Workflow ${workflow.id} completed.`
    );

    await updateWorkflowStatus(
        workflow.id,
        "COMPLETE"
    );
}
