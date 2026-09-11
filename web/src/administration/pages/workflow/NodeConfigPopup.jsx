import { X } from "lucide-react"

import NotifyCitizenConfig from "./node-config/NotifyCitizenConfig"
import RedirectConfig from "./node-config/RedirectConfig"
import EndConfig from "./node-config/EndConfig"
import { NODE_TYPE_METADATA } from "./data"

const CONFIG_COMPONENTS = {
    NOTIFY_CITIZEN: NotifyCitizenConfig,
    REDIRECT_WORKFLOW: RedirectConfig,
    END: EndConfig,
}

const GenericConfig = ({ type, onSave }) => {
    return (
        <div className="space-y-3 text-xs uppercase font-medium">
            <div>{type}</div>
            <button
                className="solid-button compact"
                type="button"
                onClick={() => onSave({})}
            >
                Save node
            </button>
        </div>
    )
}

const NodeConfigPopup = ({
    node,
    currentWorkflowId,
    onSave,
    onDelete,
    onClose,
}) => {
    const ConfigComponent =
        CONFIG_COMPONENTS[node.type] || GenericConfig

    const meta = NODE_TYPE_METADATA[node.type]
    const title = meta ? `Configure: ${meta.label}` : `Configure ${node.type}`

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-90 rounded-xl border border-border bg-slate-200 p-5 shadow-xl">
                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">{title}</h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-slate-300 transition"
                    >
                        <X size={15} />
                    </button>
                </div>

                {meta && (
                    <p className="mb-4 text-xs text-slate-500">{meta.description}</p>
                )}

                <ConfigComponent
                    node={node}
                    type={node.type}
                    currentWorkflowId={currentWorkflowId}
                    onSave={onSave}
                />

                {onDelete && (
                    <div className="mt-4 border-t border-slate-300 pt-3">
                        <button
                            type="button"
                            className="text-xs text-red-600 hover:underline"
                            onClick={onDelete}
                        >
                            Delete this node
                        </button>
                    </div>
                )}
            </div>
        </div>
    )
}

export default NodeConfigPopup
