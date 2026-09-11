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
        let token = req.cookies?.platform_token;

        if (!token && typeof req.headers.authorization === "string" && req.headers.authorization.startsWith("Bearer ")) {
            token = req.headers.authorization.slice(7).trim();
        }

        if (token) {
            const payload = verifyToken(token);

            if (payload?.platformId) {
                req.platformId = payload.platformId;
                return next();
            }
        }

        if (typeof req.headers["x-platform-id"] === "string" && req.headers["x-platform-id"].trim()) {
            req.platformId = req.headers["x-platform-id"].trim();
            return next();
        }

        // In development mode, fallback to the seeded platform if no token is provided
        if (process.env.NODE_ENV !== "production") {
            req.platformId = "64cbde22-4837-4c6d-9303-cf621e50508c";
            return next();
        }

        return res.status(401).json({
            error: "Authentication required",
        });
    } catch (error) {
        console.error("Platform auth error:", error);

        return res.status(401).json({
            error: "Invalid or expired authentication token",
        });
    }
};