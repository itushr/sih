import { useEffect, useState } from "react"
import { ChevronLeft, FlaskConical, MoveLeft, Plus, Save } from "lucide-react"
import { Tree, TreeNode } from "react-organizational-chart"
import { useNavigate, useParams } from "react-router-dom"

import AdministrationLayout2 from "../../layout/AdministrationLayout2"
import NodeTypePopup from "./NodeTypePopup"
import NodeConfigPopup from "./NodeConfigPopup"
import {
    createWorkflow,
    getWorkflow,
    runWorkflow,
    updateWorkflow,
} from "./workflowApi"
import {
    buildWorkflowTree,
    createStartNode,
    deleteNode,
    flattenWorkflowTree,
    getNodeDisplayName,
    insertNode,
    updateNode,
} from "./workflowTree"

const NODE_TYPES = {
    START: "START",
    NODE: "NODE",
    END: "END",
    ADD: "ADD",
}

const createNode = (type) => {
    const node = {
        id: crypto.randomUUID(),
        type,
        name: type,
        payload: {},
        success: null,
        error: null,
    }
    node.name = getNodeDisplayName(node)
    return node
}

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
                        text-sm!
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
        <AdministrationLayout2 page="workflows">
            <WorkflowCanvas />
        </AdministrationLayout2>
    )
}

function WorkflowCanvas() {
    const navigate = useNavigate()
    const { workflowId } = useParams()
    const isNew = !workflowId || workflowId === "new"

    const [name, setName] = useState("Untitled workflow")
    const [description, setDescription] = useState("")
    const [savedId, setSavedId] = useState(isNew ? null : workflowId)
    const [workflow, setWorkflow] = useState(createStartNode())
    const [loading, setLoading] = useState(!isNew)
    const [saving, setSaving] = useState(false)
    const [running, setRunning] = useState(false)
    const [status, setStatus] = useState("")
    const [error, setError] = useState("")
    const [runOpen, setRunOpen] = useState(false)
    const [runData, setRunData] = useState('{\n  "citizen": ""\n}')

    const [nodeTypePopupOpen, setNodeTypePopupOpen] = useState(false)
    const [configPopupOpen, setConfigPopupOpen] = useState(false)
    const [pendingNodeId, setPendingNodeId] = useState(null)
    const [pendingBranch, setPendingBranch] = useState(null)
    const [selectedNode, setSelectedNode] = useState(null)

    useEffect(() => {
        if (isNew) {
            return
        }

        let cancelled = false

        getWorkflow(workflowId)
            .then((data) => {
                if (cancelled) {
                    return
                }

                setName(data.name)
                setDescription(data.description || "")
                setSavedId(data.id)
                setWorkflow(buildWorkflowTree(data.nodes, data.start))
            })
            .catch((cause) => {
                if (!cancelled) {
                    setError(cause.message)
                }
            })
            .finally(() => {
                if (!cancelled) {
                    setLoading(false)
                }
            })

        return () => {
            cancelled = true
        }
    }, [isNew, workflowId])

    const openAddNode = (nodeId, branch) => {
        setPendingNodeId(nodeId)
        setPendingBranch(branch)
        setNodeTypePopupOpen(true)
    }

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

        setSelectedNode(newNode)
        setConfigPopupOpen(true)
        setNodeTypePopupOpen(false)
        setPendingNodeId(null)
        setPendingBranch(null)
    }

    const openNodeConfig = (node) => {
        setSelectedNode(node)
        setConfigPopupOpen(true)
    }

    const saveNodeConfig = (payload) => {
        if (!selectedNode) {
            return
        }

        setWorkflow((current) =>
            updateNode(current, selectedNode.id, { payload })
        )
        setConfigPopupOpen(false)
        setSelectedNode(null)
    }

    const deleteSelectedNode = () => {
        if (!selectedNode || selectedNode.type === "START") {
            return
        }
        setWorkflow((current) => deleteNode(current, selectedNode.id))
        setConfigPopupOpen(false)
        setSelectedNode(null)
    }

    const persist = async ({ stay } = {}) => {
        setSaving(true)
        setError("")
        setStatus("")

        const payload = {
            name,
            description,
            start: workflow.id,
            nodes: flattenWorkflowTree(workflow),
        }

        try {
            const saved = savedId
                ? await updateWorkflow(savedId, payload)
                : await createWorkflow(payload)

            setSavedId(saved.id)
            setStatus("Workflow saved.")

            if (isNew && !stay) {
                navigate(`/administration/workflows/${saved.id}`, {
                    replace: true,
                })
            }

            return saved
        } catch (cause) {
            setError(cause.message)
            return null
        } finally {
            setSaving(false)
        }
    }

    const startRun = async () => {
        setRunning(true)
        setError("")
        setStatus("")

        try {
            const saved = await persist({ stay: true })

            if (saved && isNew) {
                navigate(`/administration/workflows/${saved.id}`, {
                    replace: true,
                })
            }

            if (!saved) {
                return
            }

            let data = {}

            try {
                data = JSON.parse(runData)
            } catch {
                setError("Run data must be valid JSON.")
                return
            }

            const runningWorkflow = await runWorkflow(saved.id, data)
            setRunOpen(false)
            setStatus(`Run started: ${runningWorkflow.id}`)
        } catch (cause) {
            setError(cause.message)
        } finally {
            setRunning(false)
        }
    }

    return (
        <div className="h-full w-full overflow-auto bg-background">
            <div className="sticky top-0 z-10 flex flex-wrap items-center gap-3 border-b border-[#dfe7df] px-6 py-2">
                <div
                    className="text-xs flex gap-1 cursor-pointer hover:opacity-70"
                    type="button"
                    onClick={() => navigate("/administration/workflows")}
                >
                    <MoveLeft size={15} />
                </div>
                <input
                    className="bg-transparent! border-none! py-1! flex-1 px-1! focus:outline-1!"
                    placeholder="Untitled Workflow"
                    value={name}
                    onChange={(event) => setName(event.target.value)}
                />
                {/* <input
                    className="min-w-72 flex-2 rounded-md border border-[#dfe7df] bg-white px-3 py-2 text-sm"
                    value={description}
                    onChange={(event) => setDescription(event.target.value)}
                    placeholder="Description"
                /> */}
                <button
                    className="flex items-center gap-1 px-2 py-1 uppercase rounded-md border text-xs! cursor-pointer"
                    type="button"
                    onClick={persist}
                    disabled={saving}
                >
                    <Save size={13} />
                    {saving ? "saving…" : "save"}
                </button>
                <button
                    className="flex items-center gap-1 px-2 py-1 uppercase rounded-md border text-xs! cursor-pointer"
                    type="button"
                    onClick={() => setRunOpen(true)}
                    disabled={running}
                >
                    <FlaskConical size={13} />
                    Test
                </button>
            </div>

            {(error || status) && (
                <div className="px-6 pt-4 text-sm">
                    {error && <p className="text-red-700">{error}</p>}
                    {status && <p className="text-emerald-700">{status}</p>}
                </div>
            )}

            <div className="flex min-w-max justify-center p-10">
                {loading ? (
                    <p className="text-sm text-[#637c6c]">Loading workflow…</p>
                ) : (
                    <WorkflowTree
                        node={workflow}
                        onAdd={openAddNode}
                        onNodeClick={openNodeConfig}
                    />
                )}
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
                    currentWorkflowId={savedId}
                    onSave={saveNodeConfig}
                    onDelete={selectedNode.type !== "START" ? deleteSelectedNode : null}
                    onClose={() => {
                        setConfigPopupOpen(false)
                        setSelectedNode(null)
                    }}
                />
            )}

            {runOpen && (
                <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm">
                    <div className="w-105 rounded-xl border border-border bg-slate-200 p-5 shadow-xl">
                        <h2 className="mb-3 text-sm font-semibold">Start workflow run</h2>
                        <p className="mb-3 text-xs">
                            Initial run data. NOTIFY_CITIZEN needs a <code>citizen</code> id.
                        </p>
                        <textarea
                            className="mb-4 h-40 w-full rounded-md border border-slate-300 bg-white p-2 font-mono text-xs"
                            value={runData}
                            onChange={(event) => setRunData(event.target.value)}
                        />
                        <div className="flex justify-end gap-2">
                            <button
                                className="outline-button"
                                type="button"
                                onClick={() => setRunOpen(false)}
                            >
                                Cancel
                            </button>
                            <button
                                className="solid-button compact"
                                type="button"
                                onClick={startRun}
                                disabled={running}
                            >
                                {running ? "Starting…" : "Start run"}
                            </button>
                        </div>
                    </div>
                </div>
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
