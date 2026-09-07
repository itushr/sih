import type { Request, Response } from "express";
import pool from "../config/database.js";
import { comparePassword } from "../utils/bcrypt.js";
import { generateToken } from "../utils/jwt.js";
import { setAuthCookie, clearAuthCookie } from "../utils/cookie.js"

export const adminLogin = async (
    req: Request,
    res: Response
) => {
    try {
        const { platformId, password } = req.body ?? {};

        if (
            typeof platformId !== "string" ||
            typeof password !== "string" ||
            !platformId.trim() ||
            !password.trim()
        ) {
            return res.status(400).json({
                error: "Platform ID and password are required",
            });
        }

        const result = await pool.query(
            `SELECT
              id,
              name,
              email,
              category,
              services,
              password_hash
            FROM platform_registry
            WHERE id = $1`,
            [platformId]
        );

        if (result.rows.length === 0) {
            return res.status(401).json({
                error: "Invalid Platform ID or Password",
            });
        }

        const platform = result.rows[0];

        const passwordValid = await comparePassword(
            password,
            platform.password_hash
        );

        if (!passwordValid) {
            return res.status(401).json({
                error: "Invalid Platform ID or Password",
            });
        }

        const token = generateToken(platform.id);

        setAuthCookie(res, token);

        return res.status(200).json({
            message: "Login successful",
            data: {
                id: platform.id,
                name: platform.name,
                email: platform.email,
                category: platform.category,
                services: platform.services,
            },
        });
    } catch (error) {
        console.error("Login error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};

export const adminLogout = (
    _req: Request,
    res: Response
) => {
    clearAuthCookie(res);

    return res.status(200).json({
        message: "Logout successful",
    });
};