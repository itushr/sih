import type { Request, Response } from "express";
import pool from "../config/database.js";

const PATH_TYPES = [
    "JSONPath",
    "XPath",
    "Protobuf Field Index",
    "Plain/Key-Value",
];

export const registerApi = async (
    req: Request,
    res: Response
) => {
    const client = await pool.connect();

    try {
        const {
            alias,
            protocol,
            endpointUrl,
            protocolConfig,
            customInputs,
            canonicalInputs,
            fields,
        } = req.body ?? {};

        const platformId = req.platformId;

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        //api validation

        if (
            typeof alias !== "string" ||
            !alias.trim()
        ) {
            return res.status(400).json({
                error: "API alias is required",
            });
        }

        if (
            typeof protocol !== "string" ||
            !protocol.trim()
        ) {
            return res.status(400).json({
                error: "Protocol is required",
            });
        }

        if (
            typeof endpointUrl !== "string" ||
            !endpointUrl.trim()
        ) {
            return res.status(400).json({
                error: "Endpoint URL is required",
            });
        }

        if (
            protocolConfig !== undefined &&
            (
                typeof protocolConfig !== "object" ||
                protocolConfig === null ||
                Array.isArray(protocolConfig)
            )
        ) {
            return res.status(400).json({
                error: "Protocol config must be an object",
            });
        }

        //input validation

        if (
            customInputs !== undefined &&
            !Array.isArray(customInputs)
        ) {
            return res.status(400).json({
                error: "Custom inputs must be an array",
            });
        }

        if (
            canonicalInputs !== undefined &&
            !Array.isArray(canonicalInputs)
        ) {
            return res.status(400).json({
                error: "Canonical inputs must be an array",
            });
        }

        //field validation

        if (
            fields !== undefined &&
            !Array.isArray(fields)
        ) {
            return res.status(400).json({
                error: "Fields must be an array",
            });
        }

        for (const field of fields || []) {
            if (
                typeof field !== "object" ||
                field === null ||
                Array.isArray(field)
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
                field.description !== undefined &&
                typeof field.description !== "string"
            ) {
                return res.status(400).json({
                    error: "Field description must be a string",
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
                typeof field.pathType !== "string" ||
                !PATH_TYPES.includes(field.pathType)
            ) {
                return res.status(400).json({
                    error: `Invalid path type. Allowed values: ${PATH_TYPES.join(", ")}`,
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

            if (field.transformers) {
                for (const transformerId of field.transformers) {
                    if (
                        typeof transformerId !== "string" ||
                        !transformerId.trim()
                    ) {
                        return res.status(400).json({
                            error: "Each transformer ID must be a string",
                        });
                    }
                }
            }
        }


        await client.query("BEGIN");

        //cononical field validation

        for (const field of fields || []) {
            const canonicalFieldResult = await client.query(
                `SELECT id
                 FROM canonical_fields
                 WHERE id = $1`,
                [field.canonicalFieldId]
            );

            if (canonicalFieldResult.rows.length === 0) {
                await client.query("ROLLBACK");

                return res.status(404).json({
                    error: `Canonical field not found: ${field.canonicalFieldId}`,
                });
            }
        }

        //transformer validation

        for (const field of fields || []) {
            for (const transformerId of field.transformers || []) {
                const transformerResult = await client.query(
                    `SELECT id
                     FROM transformer_functions
                     WHERE id = $1`,
                    [transformerId]
                );

                if (transformerResult.rows.length === 0) {
                    await client.query("ROLLBACK");

                    return res.status(404).json({
                        error: `Transformer not found: ${transformerId}`,
                    });
                }
            }
        }

        //register API

        const apiResult = await client.query(
            `INSERT INTO api_endpoints (
                platform,
                alias,
                protocol,
                endpoint_url,
                protocol_config,
                custom_inputs,
                canonical_inputs
            )
            VALUES ($1, $2, $3, $4, $5, $6, $7)
            RETURNING
                id,
                platform,
                alias,
                protocol,
                endpoint_url,
                protocol_config,
                custom_inputs,
                canonical_inputs,
                created_at,
                updated_at`,
            [
                platformId,
                alias.trim(),
                protocol.trim(),
                endpointUrl.trim(),
                protocolConfig || {},
                customInputs || [],
                canonicalInputs || [],
            ]
        );

        const api = apiResult.rows[0];

        // register data fields

        const registeredFields = [];

        for (const field of fields || []) {
            const fieldResult = await client.query(
                `INSERT INTO data_field_registry (
                    alias,
                    description,
                    api_id,
                    canonical_field_id,
                    path_type,
                    extraction_path,
                    transformers
                )
                VALUES ($1, $2, $3, $4, $5, $6, $7)
                RETURNING
                    id,
                    alias,
                    description,
                    api_id,
                    canonical_field_id,
                    path_type,
                    extraction_path,
                    transformers,
                    created_at,
                    updated_at`,
                [
                    field.alias.trim(),
                    field.description?.trim() || null,
                    api.id,
                    field.canonicalFieldId,
                    field.pathType,
                    field.extractionPath.trim(),
                    field.transformers || [],
                ]
            );

            registeredFields.push(fieldResult.rows[0]);
        }

        await client.query("COMMIT");

        return res.status(201).json({
            message: "API registered successfully",
            data: {
                ...api,
                fields: registeredFields,
            },
        });
    } catch (error) {
        await client.query("ROLLBACK");

        console.error("Register API error:", error);

        return res.status(500).json({
            error: "Internal server error",
        });
    } finally {
        client.release();
    }
};