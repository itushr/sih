import { Router } from "express";
import { adminAuth } from "../middlewares/adminauth.middleware.js";
import {
    createWorkflow,
    deleteWorkflow,
    getWorkflow,
    listWorkflows,
    resumeWorkflow,
    runWorkflow,
    updateWorkflow,
} from "../controllers/workflow.controller.js";

const router = Router();

router.get("/", adminAuth, listWorkflows);
router.post("/", adminAuth, createWorkflow);
router.post("/runs/:runId/resume", adminAuth, resumeWorkflow);
router.get("/:workflowId", adminAuth, getWorkflow);
router.put("/:workflowId", adminAuth, updateWorkflow);
router.delete("/:workflowId", adminAuth, deleteWorkflow);
router.post("/:workflowId/run", adminAuth, runWorkflow);

export default router;
