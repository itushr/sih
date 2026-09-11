import { useState } from "react"
import { NOTIFICATION_TYPES } from "../data"

const NotifyCitizenConfig = ({ node, onSave }) => {
    const payload = node.payload || {}
    const [type, setType] = useState(payload.type || NOTIFICATION_TYPES[0].id)
    const [title, setTitle] = useState(payload.title || "")
    const [message, setMessage] = useState(payload.message || "")
    // ACTION_REQUIRED
    const [documentType, setDocumentType] = useState(payload.documentType || "")
    // CONSENT_REQUEST
    const [consentPurpose, setConsentPurpose] = useState(payload.consentPurpose || "")
    const [dataRequested, setDataRequested] = useState(payload.dataRequested || "")

    const handleSubmit = (event) => {
        event.preventDefault()
        const extra = {}
        if (type === "ACTION_REQUIRED") {
            extra.documentType = documentType
        } else if (type === "CONSENT_REQUEST") {
            extra.consentPurpose = consentPurpose
            extra.dataRequested = dataRequested
        }
        onSave({ type, title, message, ...extra })
    }

    return (
        <form className="space-y-3 text-xs" onSubmit={handleSubmit}>
            {/* Notification type */}
            <label className="block">
                <span className="mb-1 block font-medium uppercase">Notification Type</span>
                <select
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                    value={type}
                    onChange={(e) => setType(e.target.value)}
                    required
                >
                    {NOTIFICATION_TYPES.map((nt) => (
                        <option key={nt.id} value={nt.id}>
                            {nt.label}
                        </option>
                    ))}
                </select>
            </label>

            {/* Title */}
            <label className="block">
                <span className="mb-1 block font-medium uppercase">Title</span>
                <input
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="e.g. Application {{status}} update"
                    required
                />
            </label>

            {/* Message */}
            <label className="block">
                <span className="mb-1 block font-medium uppercase">Message</span>
                <textarea
                    className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                    rows="3"
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="e.g. Your application {{applicationId}} has been {{status}}."
                    required
                />
            </label>

            {/* ACTION_REQUIRED extra fields */}
            {type === "ACTION_REQUIRED" && (
                <label className="block">
                    <span className="mb-1 block font-medium uppercase">Document Type</span>
                    <input
                        className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                        value={documentType}
                        onChange={(e) => setDocumentType(e.target.value)}
                        placeholder="e.g. Aadhaar Card, Income Certificate"
                        required
                    />
                </label>
            )}

            {/* CONSENT_REQUEST extra fields */}
            {type === "CONSENT_REQUEST" && (
                <>
                    <label className="block">
                        <span className="mb-1 block font-medium uppercase">Consent Purpose</span>
                        <input
                            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                            value={consentPurpose}
                            onChange={(e) => setConsentPurpose(e.target.value)}
                            placeholder="e.g. Identity verification"
                            required
                        />
                    </label>
                    <label className="block">
                        <span className="mb-1 block font-medium uppercase">Data Requested</span>
                        <input
                            className="w-full rounded-md border border-slate-300 bg-white px-2 py-1.5"
                            value={dataRequested}
                            onChange={(e) => setDataRequested(e.target.value)}
                            placeholder="e.g. Aadhaar number, name, date of birth"
                            required
                        />
                    </label>
                </>
            )}

            {/* Template hint */}
            <p className="text-[10px] text-slate-500">
                Tip: use <code className="font-mono">{"{{variable}}"}</code> in title or message to
                interpolate values from workflow run data.
            </p>

            <button className="solid-button compact" type="submit">
                Save node
            </button>
        </form>
    )
}

export default NotifyCitizenConfig
