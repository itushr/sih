import { useState } from "react"
import { Plus, RobotArmIcon } from "lucide-react"
import { Tree, TreeNode } from "react-organizational-chart"

import AdministrationLayout2 from "../../layout/AdministrationLayout2"
import NodeTypePopup from "./NodeTypePopup"
import NodeConfigPopup from "./NodeConfigPopup"

const NODE_TYPES = {
    START: "START",
    NODE: "NODE",
    END: "END",
    ADD: "ADD",
}

const createNode = (type) => ({
    id: crypto.randomUUID(),
    type,
    name: type,
    success: null,
    error: null,
})

const WorkflowNode = ({ type, name, onClick }) => {
    return (
        <div className="flex justify-center">
            {type === NODE_TYPES.ADD ? (
                <div className="border aspect-square p-2 mt-1 rotate-45">
                    <Plus size={13} className="-rotate-45" />
                </div>
            ) : (
                <button
                    type="button"
                    onClick={onClick}
                    className="
                        uppercase
                        text-xs
                        bg-[#2a4b41]
                        text-white
                        pl-4
                        pr-5
                        py-1.5
                        rounded-full
                        flex
                        gap-2
                        items-center
                        cursor-pointer
                        hover:bg-[#31594d]
                        transition
                    "
                >
                    <RobotArmIcon size={15} />
                    {name}
                </button>
            )}
        </div>
    )
}

const SuccessLabel = () => (
    <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-emerald-600">
        Success
    </div>
)

const ErrorLabel = () => (
    <div className="flex items-center justify-center gap-1.5 text-[10px] font-medium uppercase tracking-wider text-red-500">
        Error
    </div>
)

const WorkflowBranch = ({ label, children }) => {
    return (
        <TreeNode
            label={
                <div className="px-20">
                    {label}
                </div>
            }
        >
            {children}
        </TreeNode>
    )
}

const AddNode = ({ onClick }) => {
    return (
        <TreeNode
            label={
                <button
                    type="button"
                    onClick={onClick}
                >
                    <WorkflowNode type={NODE_TYPES.ADD} />
                </button>
            }
        />
    )
}

export default function Page() {
    return (
        <AdministrationLayout2>
            <WorkflowCanvas />
        </AdministrationLayout2>
    )
}

function WorkflowCanvas() {
    const [workflow, setWorkflow] = useState({
        id: "start",
        type: NODE_TYPES.START,
        name: "Start",
        success: null,
        error: null,
    })

    const [nodeTypePopupOpen, setNodeTypePopupOpen] =
        useState(false)

    const [configPopupOpen, setConfigPopupOpen] =
        useState(false)

    const [pendingNodeId, setPendingNodeId] =
        useState(null)

    const [pendingBranch, setPendingBranch] =
        useState(null)

    const [selectedNode, setSelectedNode] =
        useState(null)

    /*
     * Open "Select node type"
     */
    const openAddNode = (nodeId, branch) => {
        setPendingNodeId(nodeId)
        setPendingBranch(branch)
        setNodeTypePopupOpen(true)
    }

    /*
     * Select node type
     */
    const addNode = (type) => {
        const newNode = createNode(type)

        setWorkflow((current) =>
            insertNode(
                current,
                pendingNodeId,
                pendingBranch,
                newNode
            )
        )

        /*
         * Immediately open configuration popup
         * for the newly created node.
         */
        setSelectedNode(newNode)
        setConfigPopupOpen(true)

        setNodeTypePopupOpen(false)
        setPendingNodeId(null)
        setPendingBranch(null)
    }

    /*
     * Click an existing node
     */
    const openNodeConfig = (node) => {
        setSelectedNode(node)
        setConfigPopupOpen(true)
    }

    /*
     * Close configuration popup
     */
    const closeNodeConfig = () => {
        setConfigPopupOpen(false)
        setSelectedNode(null)
    }

    return (
        <div className="h-full w-full overflow-auto bg-background p-10">
            <div className="flex min-w-max justify-center">
                <WorkflowTree
                    node={workflow}
                    onAdd={openAddNode}
                    onNodeClick={openNodeConfig}
                />
            </div>

            {nodeTypePopupOpen && (
                <NodeTypePopup
                    onSelect={addNode}
                    onClose={() => {
                        setNodeTypePopupOpen(false)
                        setPendingNodeId(null)
                        setPendingBranch(null)
                    }}
                />
            )}

            {configPopupOpen && selectedNode && (
                <NodeConfigPopup
                    node={selectedNode}
                    onClose={closeNodeConfig}
                />
            )}
        </div>
    )
}

const WorkflowTree = ({
    node,
    onAdd,
    onNodeClick,
}) => {
    if (!node) {
        return null
    }

    if (node.type === NODE_TYPES.END) {
        return (
            <TreeNode
                label={
                    <WorkflowNode
                        type={NODE_TYPES.NODE}
                        name="END"
                        onClick={() => onNodeClick(node)}
                    />
                }
            />
        )
    }

    return (
        <Tree
            lineWidth="1px"
            lineColor="hsl(var(--border))"
            lineBorderRadius="8px"
            label={
                <WorkflowNode
                    type={
                        node.type === NODE_TYPES.START
                            ? NODE_TYPES.START
                            : NODE_TYPES.NODE
                    }
                    name={node.name}
                    onClick={() => onNodeClick(node)}
                />
            }
        >
            <WorkflowBranch label={<SuccessLabel />}>
                {node.success ? (
                    <WorkflowTree
                        node={node.success}
                        onAdd={onAdd}
                        onNodeClick={onNodeClick}
                    />
                ) : (
                    <AddNode
                        onClick={() =>
                            onAdd(node.id, "success")
                        }
                    />
                )}
            </WorkflowBranch>

            <WorkflowBranch label={<ErrorLabel />}>
                {node.error ? (
                    <WorkflowTree
                        node={node.error}
                        onAdd={onAdd}
                        onNodeClick={onNodeClick}
                    />
                ) : (
                    <AddNode
                        onClick={() =>
                            onAdd(node.id, "error")
                        }
                    />
                )}
            </WorkflowBranch>
        </Tree>
    )
}

const insertNode = (
    node,
    targetNodeId,
    branch,
    newNode
) => {
    if (!node) {
        return null
    }

    if (node.id === targetNodeId) {
        return {
            ...node,
            [branch]: newNode,
        }
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
    }
}