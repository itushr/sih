import type { Request, Response, NextFunction } from "express";
import { verifyToken } from "../utils/jwt.js";

declare global {
    namespace Express {
        interface Request {
            platformId?: string;
        }
    }
}

export const adminAuth = (
    req: Request,
    res: Response,
    next: NextFunction
) => {
    try {
        const token = req.cookies?.platform_token;

        if (!token) {
            return res.status(401).json({
                error: "Authentication required",
            });
        }

        const payload = verifyToken(token);

        if (!payload?.platformId) {
            return res.status(401).json({
                error: "Invalid authentication token",
            });
        }

        req.platformId = payload.platformId;

        next();
    } catch (error) {
        console.error("Platform auth error:", error);

        return res.status(401).json({
            error: "Invalid or expired authentication token",
        });
    }
};