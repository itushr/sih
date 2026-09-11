export const SUPPORTED_NODE_TYPES = [
    "NOTIFY_CITIZEN",
    "REDIRECT_WORKFLOW",
    "END",
];

export const NODE_TYPE_METADATA = {
    NOTIFY_CITIZEN: {
        label: "Notify Citizen",
        description: "Send status update, text message, document upload action, or consent request.",
        icon: "bell",
    },
    REDIRECT_WORKFLOW: {
        label: "Redirect Workflow",
        description: "Hand over this run to another registered workflow's start node.",
        icon: "corner-down-right",
    },
    END: {
        label: "End Workflow",
        description: "Mark this branch as successfully completed.",
        icon: "check-circle",
    },
};

export const NOTIFICATION_TYPES = [
    {
        id: "STATUS_UPDATE",
        label: "Status Update",
        description: "Inform citizen of an application or case status change.",
    },
    {
        id: "TEXT_ONLY",
        label: "Text Only",
        description: "Direct informative text message or notice.",
    },
    {
        id: "ACTION_REQUIRED",
        label: "Action Required (Upload Document)",
        description: "Request the citizen to upload mandatory documents.",
    },
    {
        id: "CONSENT_REQUEST",
        label: "Consent Request",
        description: "Request citizen consent for data access and sharing.",
    },
];
