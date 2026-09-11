import { LineDotRightHorizontal, X } from "lucide-react";
import { SUPPORTED_NODE_TYPES } from "./data";

const NodeTypePopup = ({ onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
            <div className="w-90 rounded-xl border border-border bg-slate-200 p-5 shadow-xl">
                <div className="mb-4">
                    <div className="flex justify-between">
                        <h2 className="text-sm font-semibold mt-5">
                            Select node type
                        </h2>
                        <button
                            onClick={onClose}
                            className="-mt-5"
                        >
                            <X size={15} />
                        </button>
                    </div>

                    {/* <p className="mt-1 text-xs text-muted-foreground">
                        Choose the next workflow step.
                    </p> */}
                </div>

                <div className="space-y-1">
                    {SUPPORTED_NODE_TYPES.map((type) => (
                        <div
                            key={type}
                            type="button"
                            onClick={() => onSelect(type)}
                            className="flex w-full items-center gap-2 rounded-md px-3 py-2.5 text-left text-xs transition hover:bg-slate-300 cursor-pointer"
                        >
                            <LineDotRightHorizontal /> {type}
                        </div>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default NodeTypePopup;