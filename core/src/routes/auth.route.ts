import { Router } from "express";
import {
    adminLogin,
    adminLogout,
} from "../controllers/adminauth.controller.js";

const router = Router();

router.post("/admin-login", adminLogin);
router.post("/admin-logout", adminLogout);

export default router;