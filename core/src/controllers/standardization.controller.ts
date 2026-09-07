import type { Request, Response } from "express";
import pool from "../config/database.js";

export const createCanonicalField = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            name,
            description,
            validation,
        } = req.body ?? {};
        const platformId = req.platformId;

        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            return res.status(400).json({
                error: "Canonical field name is required",
            });
        }

        if (
            description !== undefined &&
            typeof description !== "string"
        ) {
            return res.status(400).json({
                error: "Description must be a string",
            });
        }

        if (
            platformId !== undefined &&
            typeof platformId !== "string"
        ) {
            return res.status(400).json({
                error: "Platform ID must be a string",
            });
        }

        if (
            validation !== undefined &&
            (
                typeof validation !== "object" ||
                validation === null ||
                Array.isArray(validation)
            )
        ) {
            return res.status(400).json({
                error: "Validation must be an object",
            });
        }

        const result = await pool.query(
            `INSERT INTO canonical_fields (
                name,
                description,
                platform_id,
                validation
            )
            VALUES ($1, $2, $3, $4)
            RETURNING
                id,
                name,
                description,
                platform_id,
                validation`,
            [
                name.trim(),
                description?.trim() || null,
                platformId || null,
                validation || {},
            ]
        );

        return res.status(201).json({
            message: "Canonical field created successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Create canonical field error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};