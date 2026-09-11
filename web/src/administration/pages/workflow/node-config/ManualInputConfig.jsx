import { useState } from "react"

const ManualInputConfig = ({ node, onSave }) => {
    const payload = node.payload || {}
    const [prompt, setPrompt] = useState(payload.prompt || "")
    const [fields, setFields] = useState(
        Array.isArray(payload.fields) && payload.fields.length
            ? payload.fields.join(", ")
            : "citizen"
    )

    return (
        <form
            className="space-y-3 text-xs"
            onSubmit={(event) => {
                event.preventDefault()
                onSave({
                    prompt,
                    fields: fields
                        .split(",")
                        .map((field) => field.trim())
                        .filter(Boolean),
                })
            }}
        >
            <p>
                This node stops the run until
                {" "}
                <code>POST /api/workflows/runs/:runId/resume</code>
                {" "}
                sends <code>data</code> for the fields below.
            </p>
            <label className="block">
                <span className="mb-1 block font-medium uppercase">Prompt</span>
                <input
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                    value={prompt}
                    onChange={(event) => setPrompt(event.target.value)}
                    placeholder="Collect the missing citizen id"
                />
            </label>
            <label className="block">
                <span className="mb-1 block font-medium uppercase">Fields</span>
                <input
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                    value={fields}
                    onChange={(event) => setFields(event.target.value)}
                    placeholder="citizen, applicationId"
                />
            </label>
            <button className="solid-button compact" type="submit">
                Save node
            </button>
        </form>
    )
}

export default ManualInputConfig
