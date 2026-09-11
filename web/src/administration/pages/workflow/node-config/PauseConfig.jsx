import { useState } from "react"

const PauseConfig = ({ node, onSave }) => {
    const [reason, setReason] = useState(node.payload?.reason || "")

    return (
        <form
            className="space-y-3 text-xs"
            onSubmit={(event) => {
                event.preventDefault()
                onSave({ reason })
            }}
        >
            <p>
                This node stops the run. Resume later with
                {" "}
                <code>POST /api/workflows/runs/:runId/resume</code>.
            </p>
            <label className="block">
                <span className="mb-1 block font-medium uppercase">Reason</span>
                <input
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                    value={reason}
                    onChange={(event) => setReason(event.target.value)}
                    placeholder="Waiting for an external trigger"
                />
            </label>
            <button className="solid-button compact" type="submit">
                Save node
            </button>
        </form>
    )
}

export default PauseConfig
