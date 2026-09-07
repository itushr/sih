import { Router } from "express";
import { adminAuth } from "../middlewares/adminauth.middleware.js";
import { registerApi } from "../controllers/api.controller.js";
import { testApi } from "../controllers/api-test.controller.js";

const router = Router();

router.post("/register", adminAuth, registerApi);
router.post("/test", adminAuth, testApi);

export default router;