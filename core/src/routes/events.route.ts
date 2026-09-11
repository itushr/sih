import { Router } from "express";
import { getPlatformEvents, registerEvent, subscribeToEvent } from "../controllers/events.controller.js";
import { adminAuth } from "../middlewares/adminauth.middleware.js";

const router = Router();

router.get("/by/:platformId", adminAuth, getPlatformEvents);
router.post("/register", adminAuth, registerEvent);
router.post("/subscribe", adminAuth, subscribeToEvent);

export default router;