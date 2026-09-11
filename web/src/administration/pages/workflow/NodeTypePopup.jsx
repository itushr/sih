import { X, Bell, CornerDownRight, CheckCircle2 } from "lucide-react";
import { SUPPORTED_NODE_TYPES, NODE_TYPE_METADATA } from "./data";

const ICONS = {
    NOTIFY_CITIZEN: Bell,
    REDIRECT_WORKFLOW: CornerDownRight,
    END: CheckCircle2,
};

const NodeTypePopup = ({ onSelect, onClose }) => {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/30 backdrop-blur-sm">
            <div className="w-[420px] rounded-xl border border-[#dfe7df] bg-white p-6 shadow-2xl">
                <div className="mb-4 flex items-center justify-between border-b border-[#dfe7df] pb-3">
                    <div>
                        <h2 className="text-base font-semibold text-[#173f3b]">
                            Add Workflow Step
                        </h2>
                        <p className="text-xs text-[#637c6c]">
                            Select the type of step to append to this branch
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="rounded-md p-1.5 text-[#637c6c] hover:bg-slate-100 hover:text-slate-900 transition"
                    >
                        <X size={16} />
                    </button>
                </div>

                <div className="space-y-2.5">
                    {SUPPORTED_NODE_TYPES.map((type) => {
                        const meta = NODE_TYPE_METADATA[type] || { label: type, description: "" };
                        const IconComponent = ICONS[type] || Bell;
                        return (
                            <button
                                key={type}
                                type="button"
                                onClick={() => onSelect(type)}
                                className="group flex w-full items-start gap-3 rounded-lg border border-[#dfe7df] bg-[#fbfcfb] p-3 text-left transition hover:border-[#2a4b41] hover:bg-[#f2f6f3] cursor-pointer"
                            >
                                <div className="mt-0.5 flex h-7 w-7 shrink-0 items-center justify-center rounded-md bg-[#2a4b41]/10 text-[#2a4b41] group-hover:bg-[#2a4b41] group-hover:text-white transition">
                                    <IconComponent size={15} />
                                </div>
                                <div className="flex-1">
                                    <strong className="block text-xs font-semibold text-[#173f3b]">
                                        {meta.label}
                                    </strong>
                                    <p className="mt-0.5 text-[11px] leading-relaxed text-[#637c6c]">
                                        {meta.description}
                                    </p>
                                </div>
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default NodeTypePopup;
