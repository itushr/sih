import type { RunningWorkflow, WorkflowNode } from "../workflow/types.js";

export async function executeStart(
    workflow: RunningWorkflow,
    _node: WorkflowNode
): Promise<void> {
    console.log(
        `Workflow ${workflow.id} started`
    );
}
