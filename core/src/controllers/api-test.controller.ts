import type { Request, Response } from "express";

import pool from "../config/database.js";

import {
    standardizeResponse,
} from "../services/standardization.service.js";

export const testApi = async (
    req: Request,
    res: Response
) => {
    try {
        const {
            response,
            fields,
        } = req.body ?? {};

        // --------------------------------
        // REQUEST VALIDATION
        // --------------------------------

        if (
            response === undefined ||
            response === null
        ) {
            return res.status(400).json({
                error: "API response is required",
            });
        }

        if (!Array.isArray(fields)) {
            return res.status(400).json({
                error: "Fields must be an array",
            });
        }

        // --------------------------------
        // FIELD VALIDATION
        // --------------------------------

        for (const field of fields) {
            if (
                typeof field !== "object" ||
                field === null
            ) {
                return res.status(400).json({
                    error: "Each field must be an object",
                });
            }

            if (
                typeof field.alias !== "string" ||
                !field.alias.trim()
            ) {
                return res.status(400).json({
                    error: "Field alias is required",
                });
            }

            if (
                typeof field.canonicalFieldId !== "string" ||
                !field.canonicalFieldId.trim()
            ) {
                return res.status(400).json({
                    error: "Canonical field ID is required",
                });
            }

            if (
                typeof field.pathType !== "string"
            ) {
                return res.status(400).json({
                    error: "Path type is required",
                });
            }

            if (
                typeof field.extractionPath !== "string" ||
                !field.extractionPath.trim()
            ) {
                return res.status(400).json({
                    error: "Extraction path is required",
                });
            }

            if (
                field.transformers !== undefined &&
                !Array.isArray(field.transformers)
            ) {
                return res.status(400).json({
                    error: "Transformers must be an array",
                });
            }
        }

        // --------------------------------
        // GET CANONICAL FIELD INFORMATION
        // --------------------------------

        const canonicalFieldIds =
            fields.map(
                (field) =>
                    field.canonicalFieldId
            );

        const canonicalResult =
            await pool.query(
                `SELECT
                    id,
                    name
                 FROM canonical_fields
                 WHERE id = ANY($1::uuid[])`,
                [canonicalFieldIds]
            );

        if (
            canonicalResult.rows.length !==
            canonicalFieldIds.length
        ) {
            return res.status(404).json({
                error:
                    "One or more canonical fields were not found",
            });
        }

        const canonicalFields =
            new Map(
                canonicalResult.rows.map(
                    (field) => [
                        field.id,
                        field,
                    ]
                )
            );

        // --------------------------------
        // PREPARE TEMPORARY FIELD MAPPINGS
        // --------------------------------

        const mappings = fields.map(
            (field) => ({
                alias: field.alias,
                canonical_field_id:
                    field.canonicalFieldId,
                canonical_field_name:
                    canonicalFields.get(
                        field.canonicalFieldId
                    )?.name,
                path_type: field.pathType,
                extraction_path:
                    field.extractionPath,
                transformers:
                    field.transformers || [],
            })
        );

        // --------------------------------
        // STANDARDIZE
        // --------------------------------

        const result =
            await standardizeResponse(
                response,
                mappings
            );

        return res.status(200).json({
            message:
                "API test completed successfully",
            data: result,
        });
    } catch (error) {
        console.error(
            "Test API error:",
            error
        );

        return res.status(500).json({
            error: "Internal server error",
        });
    }
};