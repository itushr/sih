import { Router } from "express";
import { saveCitizenNotification } from "../controllers/save-citizen-notification.controller.js";
import { adminAuth } from "../middlewares/adminauth.middleware.js";

const router = Router();

router.post("/citizen/save", adminAuth, saveCitizenNotification);

export default router;