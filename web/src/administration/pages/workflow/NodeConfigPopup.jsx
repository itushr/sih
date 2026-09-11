import { X } from "lucide-react"

import NotifyCitizenConfig from "./node-config/NotifyCitizenConfig"
import FetchApiConfig from "./node-config/FetchApiConfig"
import PauseConfig from "./node-config/PauseConfig"
import RedirectConfig from "./node-config/RedirectConfig"
import ManualInputConfig from "./node-config/ManualInputConfig"
import EndConfig from "./node-config/EndConfig"
import BypassErrorConfig from "./node-config/BypassErrorConfig"

const CONFIG_COMPONENTS = {
    "NOTIFY_CITIZEN": NotifyCitizenConfig,
    "FETCH_API": FetchApiConfig,
    "PAUSE": PauseConfig,
    "MANUAL_INPUT": ManualInputConfig,
    "REDIRECT": RedirectConfig,
    "BYPASS_ERROR": BypassErrorConfig,
    "END": EndConfig
}

const GenericConfig = ({ type }) => {
    return (
        <div className="text-xs uppercase font-medium">
            {type}
        </div>
    )
}

const NodeConfigPopup = ({
    node,
    onClose,
}) => {
    const ConfigComponent =
        CONFIG_COMPONENTS[node.type] || GenericConfig

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-90 rounded-xl border border-border bg-slate-200 p-5 shadow-xl">

                <div className="mb-5 flex items-center justify-between">
                    <h2 className="text-sm font-semibold">
                        Configure node
                    </h2>

                    <button
                        type="button"
                        onClick={onClose}
                        className="rounded-md p-1 hover:bg-slate-300 transition"
                    >
                        <X size={15} />
                    </button>
                </div>

                <ConfigComponent
                    node={node}
                />

            </div>
        </div>
    )
}

export default NodeConfigPopup