import type { Request, Response } from "express";
import pool from "../config/database.js";

export const saveCitizenNotification = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            citizen,
            type,
            title,
            message,
            payload
        } = req.body ?? {};

        if (
            typeof citizen !== "string" ||
            !citizen.trim()
        ) {
            return res.status(400).json({
                error: "Citizen ID is required",
            });
        }

        if (
            typeof type !== "string" ||
            !type.trim()
        ) {
            return res.status(400).json({
                error: "Notification type is required",
            });
        }

        if (
            typeof title !== "string" ||
            !title.trim()
        ) {
            return res.status(400).json({
                error: "Notification title is required",
            });
        }

        if (
            typeof message !== "string" ||
            !message.trim()
        ) {
            return res.status(400).json({
                error: "Notification message is required",
            });
        }

        const result = await pool.query(
            `INSERT INTO citizen_notifications (
                citizen,
                type,
                title,
                message,
                payload
            )
            VALUES ($1, $2, $3, $4, $5)
            RETURNING
                id,
                citizen,
                type,
                title,
                message,
                timestamp,
                payload`,
            [
                citizen.trim(),
                type.trim(),
                title.trim(),
                message.trim(),
                payload ?? {}
            ]
        );

        return res.status(201).json({
            message: "Citizen notification saved successfully",
            data: result.rows[0],
        });
    } catch (error) {
        console.error(
            "Save citizen notification error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};