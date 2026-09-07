import { Router } from "express";
import { adminAuth } from "../middlewares/adminauth.middleware.js";
import { createCanonicalField } from "../controllers/standardization.controller.js";

const router = Router();

router.post("/create-cononical-field", adminAuth, createCanonicalField);

export default router;