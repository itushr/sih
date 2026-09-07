import { Router } from "express";
import { adminAuth } from "../middlewares/adminauth.middleware.js";
import { registerApi } from "../controllers/api.controller.js";

const router = Router();

router.post("/register", adminAuth, registerApi);

export default router;