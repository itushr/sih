import { useEffect, useState } from "react"
import { listWorkflows } from "../workflowApi"

const RedirectConfig = ({ node, onSave, currentWorkflowId }) => {
    const [workflows, setWorkflows] = useState([])
    const [targetWorkflowId, setTargetWorkflowId] = useState(
        node.payload?.targetWorkflowId || ""
    )
    const [error, setError] = useState("")

    useEffect(() => {
        listWorkflows()
            .then((items) => {
                setWorkflows(
                    (items || []).filter(
                        (workflow) => workflow.id !== currentWorkflowId
                    )
                )
            })
            .catch((cause) => {
                setError(cause.message)
            })
    }, [currentWorkflowId])

    return (
        <form
            className="space-y-3 text-xs"
            onSubmit={(event) => {
                event.preventDefault()
                if (!targetWorkflowId) {
                    setError("Choose a workflow to redirect to.")
                    return
                }
                onSave({ targetWorkflowId })
            }}
        >
            <p>Jump this run onto another workflow’s start node.</p>
            {error && <p className="text-red-600">{error}</p>}
            <label className="block">
                <span className="mb-1 block font-medium uppercase">Target workflow</span>
                <select
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                    value={targetWorkflowId}
                    onChange={(event) => setTargetWorkflowId(event.target.value)}
                    required
                >
                    <option value="">Select workflow</option>
                    {workflows.map((workflow) => (
                        <option key={workflow.id} value={workflow.id}>
                            {workflow.name}
                        </option>
                    ))}
                </select>
            </label>
            <button className="solid-button compact" type="submit">
                Save node
            </button>
        </form>
    )
}

export default RedirectConfig
