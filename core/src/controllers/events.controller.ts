import type { Request, Response } from "express";
import pool from "../config/database.js";

export const getPlatformEvents = async (
    req: Request,
    res: Response
) => {
    try {
        const { platformId } = req.params;

        if (
            typeof platformId !== "string" ||
            !platformId.trim()
        ) {
            return res.status(400).json({
                error: "Platform ID is required",
            });
        }

        const result = await pool.query(
            `SELECT
                id,
                name,
                description,
                created_by,
                created_at
             FROM event_registry
             WHERE created_by = $1
             ORDER BY created_at DESC`,
            [platformId]
        );

        return res.status(200).json({
            message: "Events fetched successfully",
            data: result.rows,
        });
    } catch (error) {
        console.error("Get platform events error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};



export const registerEvent = async (
    req: Request,
    res: Response
) => {
    try {
        const { name, description } = req.body ?? {};
        const platformId = req.platformId;


        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        if (
            typeof name !== "string" ||
            !name.trim()
        ) {
            return res.status(400).json({
                error: "Event name is required",
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

        const result = await pool.query(
            `INSERT INTO event_registry (
                name,
                description,
                created_by
            )
            VALUES ($1, $2, $3)
            RETURNING
            id,
            name,
            description,
            created_by,
            created_at`,
            [
                name.trim(),
                description?.trim() || null,
                platformId,
            ]
        );

        return res.status(201).json({
            message: "Event registered successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Register event error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }

};
