export const createStartNode = () => ({
    id: crypto.randomUUID(),
    type: "START",
    name: "Start",
    payload: {},
    success: null,
    error: null,
});

export const flattenWorkflowTree = (node, acc = []) => {
    if (!node) {
        return acc;
    }

    acc.push({
        id: node.id,
        type: node.type,
        payload: node.payload || {},
        on_success: node.success?.id ?? null,
        on_error: node.error?.id ?? null,
    });

    flattenWorkflowTree(node.success, acc);
    flattenWorkflowTree(node.error, acc);

    return acc;
};

export const getNodeDisplayName = (node) => {
    if (!node) return "";
    if (node.type === "START") return "Start";
    if (node.type === "END") return "End";
    if (node.type === "NOTIFY_CITIZEN") {
        const subtype = node.payload?.type;
        if (subtype === "STATUS_UPDATE") return "Notify: Status Update";
        if (subtype === "TEXT_ONLY") return "Notify: Text Only";
        if (subtype === "ACTION_REQUIRED") return "Notify: Upload Document";
        if (subtype === "CONSENT_REQUEST") return "Notify: Consent Request";
        return "Notify Citizen";
    }
    if (node.type === "REDIRECT_WORKFLOW") {
        return "Redirect Workflow";
    }
    return node.type;
};

export const buildWorkflowTree = (nodes, startId) => {
    const map = new Map(
        (nodes || []).map((node) => [node.id, node])
    );

    const visited = new Set();

    const toTree = (id) => {
        if (!id || !map.has(id) || visited.has(id)) {
            return null;
        }

        visited.add(id);

        const node = map.get(id);

        return {
            id: node.id,
            type: node.type,
            name: getNodeDisplayName(node),
            payload: node.payload || {},
            success: toTree(node.on_success),
            error: toTree(node.on_error),
        };
    };

    return toTree(startId) || createStartNode();
};

export const deleteNode = (node, targetNodeId) => {
    if (!node) {
        return null;
    }

    if (node.id === targetNodeId) {
        // Cannot delete root node directly
        return node;
    }

    return {
        ...node,
        success:
            node.success?.id === targetNodeId
                ? null
                : deleteNode(node.success, targetNodeId),
        error:
            node.error?.id === targetNodeId
                ? null
                : deleteNode(node.error, targetNodeId),
    };
};

export const insertNode = (
    node,
    targetNodeId,
    branch,
    newNode
) => {
    if (!node) {
        return null;
    }

    if (node.id === targetNodeId) {
        return {
            ...node,
            [branch]: newNode,
        };
    }

    return {
        ...node,
        success: node.success
            ? insertNode(
                node.success,
                targetNodeId,
                branch,
                newNode
            )
            : null,
        error: node.error
            ? insertNode(
                node.error,
                targetNodeId,
                branch,
                newNode
            )
            : null,
    };
};

export const updateNode = (node, nodeId, patch) => {
    if (!node) {
        return null;
    }

    if (node.id === nodeId) {
        const merged = {
            ...node,
            ...patch,
            payload: patch.payload ?? node.payload ?? {},
        };
        merged.name = getNodeDisplayName(merged);
        return merged;
    }

    return {
        ...node,
        success: node.success
            ? updateNode(node.success, nodeId, patch)
            : null,
        error: node.error
            ? updateNode(node.error, nodeId, patch)
            : null,
    };
};
