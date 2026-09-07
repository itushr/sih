import type { Request, Response } from "express";

import {
    runApi,
} from "../services/api-run.service.js";

export const runRegisteredApi = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            apiId,
            canonicalFields,
            inputs,
        } = req.body ?? {};

        // --------------------------------
        // VALIDATION
        // --------------------------------

        if (
            typeof apiId !== "string" ||
            !apiId.trim()
        ) {
            return res.status(400).json({
                error: "API ID is required",
            });
        }

        if (
            !Array.isArray(canonicalFields) ||
            canonicalFields.length === 0
        ) {
            return res.status(400).json({
                error:
                    "At least one canonical field is required",
            });
        }

        if (
            !canonicalFields.every(
                (field) =>
                    typeof field === "string" &&
                    field.trim()
            )
        ) {
            return res.status(400).json({
                error:
                    "Canonical fields must be strings",
            });
        }

        if (
            inputs !== undefined &&
            (
                typeof inputs !== "object" ||
                inputs === null ||
                Array.isArray(inputs)
            )
        ) {
            return res.status(400).json({
                error:
                    "Inputs must be an object",
            });
        }

        // --------------------------------
        // RUN API
        // --------------------------------

        const result = await runApi({
            apiId,
            canonicalFields,
            inputs: inputs || {},
        });

        return res.status(200).json({
            message:
                "API executed successfully",
            data: result,
        });
    } catch (error) {
        console.error(
            "Run API error:",
            error
        );

        if (
            error instanceof Error &&
            error.message === "API not found"
        ) {
            return res.status(404).json({
                error: error.message,
            });
        }

        return res.status(500).json({
            error:
                error instanceof Error
                    ? error.message
                    : "Internal server error",
        });
    }
};