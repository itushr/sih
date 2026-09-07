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



export const subscribeToEvent = async (
    req: Request,
    res: Response
) => {
    try {
        const { eventId } = req.body ?? {};
        const platformId = req.platformId;

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        if (
            typeof eventId !== "string" ||
            !eventId.trim()
        ) {
            return res.status(400).json({
                error: "Event ID is required",
            });
        }

        const eventResult = await pool.query(
            `SELECT id
             FROM event_registry
             WHERE id = $1`,
            [eventId]
        );

        if (eventResult.rows.length === 0) {
            return res.status(404).json({
                error: "Event not found",
            });
        }

        const result = await pool.query(
            `INSERT INTO event_subscriptions (
                event_id,
                platform_id
            )
            VALUES ($1, $2)
            ON CONFLICT (event_id, platform_id)
            DO NOTHING
            RETURNING
                event_id,
                platform_id,
                created_at`,
            [
                eventId,
                platformId,
            ]
        );

        if (result.rows.length === 0) {
            return res.status(409).json({
                error: "Platform is already subscribed to this event",
            });
        }

        return res.status(201).json({
            message: "Subscribed to event successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error("Subscribe event error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};