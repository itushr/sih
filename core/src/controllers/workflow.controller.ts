import type { Request, Response } from "express";
import {
    isNonEmptyString,
    isObject,
} from "../utils/validation.js";
import {
    deletePlatformWorkflow,
    getPlatformWorkflow,
    listPlatformWorkflows,
    resumeWorkflowRun,
    saveWorkflow,
    startWorkflowRun,
    validateWorkflowNodes,
} from "../workflow/service.js";
import type { WorkflowNodeInput } from "../workflow/types.js";

export const listWorkflows = async (
    req: Request,
    res: Response
) => {
    try {
        const platformId = req.platformId;

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const workflows =
            await listPlatformWorkflows(platformId);

        return res.status(200).json({
            message: "Workflows fetched successfully",
            data: workflows,
        });
    } catch (error) {
        console.error("List workflows error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export const getWorkflow = async (
    req: Request,
    res: Response
) => {
    try {
        const platformId = req.platformId;
        const { workflowId } = req.params;

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        if (!isNonEmptyString(workflowId)) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        const workflow = await getPlatformWorkflow(
            workflowId,
            platformId
        );

        if (!workflow) {
            return res.status(404).json({
                error: "Workflow not found",
            });
        }

        return res.status(200).json({
            message: "Workflow fetched successfully",
            data: workflow,
        });
    } catch (error) {
        console.error("Get workflow error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

const readWorkflowBody = (body: unknown) => {
    if (!isObject(body)) {
        return {
            error: "Request body must be an object",
        };
    }

    const nameError = !isNonEmptyString(body.name)
        ? "Workflow name is required"
        : null;

    if (nameError) {
        return { error: nameError };
    }

    if (
        body.description !== undefined &&
        body.description !== null &&
        typeof body.description !== "string"
    ) {
        return {
            error: "Description must be a string",
        };
    }

    const nodesError = validateWorkflowNodes(
        body.nodes,
        body.start
    );

    if (nodesError) {
        return { error: nodesError };
    }

    return {
        name: (body.name as string).trim(),
        description:
            typeof body.description === "string"
                ? body.description.trim() || null
                : null,
        start: body.start as string,
        nodes: body.nodes as WorkflowNodeInput[],
    };
};

export const createWorkflow = async (
    req: Request,
    res: Response
) => {
    try {
        const platformId = req.platformId;

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        const parsed = readWorkflowBody(req.body ?? {});

        if ("error" in parsed) {
            return res.status(400).json({
                error: parsed.error,
            });
        }

        const result = await saveWorkflow({
            platformId,
            name: parsed.name,
            description: parsed.description,
            start: parsed.start,
            nodes: parsed.nodes,
        });

        if ("error" in result) {
            return res.status(404).json({
                error: "Workflow not found",
            });
        }

        return res.status(201).json({
            message: "Workflow created successfully",
            data: result.workflow,
        });
    } catch (error) {
        console.error("Create workflow error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export const updateWorkflow = async (
    req: Request,
    res: Response
) => {
    try {
        const platformId = req.platformId;
        const { workflowId } = req.params;

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        if (!isNonEmptyString(workflowId)) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        const parsed = readWorkflowBody(req.body ?? {});

        if ("error" in parsed) {
            return res.status(400).json({
                error: parsed.error,
            });
        }

        const result = await saveWorkflow({
            id: workflowId,
            platformId,
            name: parsed.name,
            description: parsed.description,
            start: parsed.start,
            nodes: parsed.nodes,
        });

        if ("error" in result) {
            return res.status(404).json({
                error: "Workflow not found",
            });
        }

        return res.status(200).json({
            message: "Workflow updated successfully",
            data: result.workflow,
        });
    } catch (error) {
        console.error("Update workflow error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export const runWorkflow = async (
    req: Request,
    res: Response
) => {
    try {
        const platformId = req.platformId;
        const { workflowId } = req.params;
        const data = req.body?.data ?? {};

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        if (!isNonEmptyString(workflowId)) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        if (!isObject(data)) {
            return res.status(400).json({
                error: "data must be an object",
            });
        }

        const result = await startWorkflowRun({
            workflowId,
            platformId,
            data,
        });

        if (result.error === "not_found") {
            return res.status(404).json({
                error: "Workflow not found",
            });
        }

        if (result.error === "no_start") {
            return res.status(400).json({
                error: "Workflow has no start node",
            });
        }

        if (result.error === "enqueue_failed") {
            console.error(
                "Enqueue workflow error:",
                result.cause
            );

            return res.status(503).json({
                error: "Workflow run was created but could not be queued",
                data: result.running,
            });
        }

        return res.status(201).json({
            message: "Workflow run started",
            data: result.running,
        });
    } catch (error) {
        console.error("Run workflow error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export const resumeWorkflow = async (
    req: Request,
    res: Response
) => {
    try {
        const { runId } = req.params;
        const data = req.body?.data;

        if (!isNonEmptyString(runId)) {
            return res.status(400).json({
                error: "Run ID is required",
            });
        }

        if (data !== undefined && !isObject(data)) {
            return res.status(400).json({
                error: "data must be an object",
            });
        }

        const result = await resumeWorkflowRun(
            isObject(data)
                ? {
                    runningWorkflowId: runId,
                    data,
                }
                : {
                    runningWorkflowId: runId,
                }
        );

        if (result.error === "not_found") {
            return res.status(404).json({
                error: "Workflow run not found",
            });
        }

        if (result.error === "not_waiting") {
            return res.status(409).json({
                error: "Workflow run is not waiting to be resumed",
            });
        }

        if (result.error === "node_missing") {
            return res.status(409).json({
                error: "Current workflow node is missing",
            });
        }

        if (result.error === "no_next") {
            return res.status(409).json({
                error: "Paused node has no on_success target",
            });
        }

        if (result.error === "enqueue_failed") {
            console.error(
                "Resume enqueue error:",
                result.cause
            );

            return res.status(503).json({
                error: "Workflow run was resumed but could not be queued",
            });
        }

        return res.status(200).json({
            message: "Workflow run resumed",
            data: result.running,
        });
    } catch (error) {
        console.error("Resume workflow error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export const deleteWorkflow = async (
    req: Request,
    res: Response
) => {
    try {
        const platformId = req.platformId;
        const { workflowId } = req.params;

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        if (!isNonEmptyString(workflowId)) {
            return res.status(400).json({
                error: "Workflow ID is required",
            });
        }

        const deleted = await deletePlatformWorkflow(workflowId, platformId);

        if (!deleted) {
            return res.status(404).json({
                error: "Workflow not found",
            });
        }

        return res.status(200).json({
            message: "Workflow deleted successfully",
        });
    } catch (error) {
        console.error("Delete workflow error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};
