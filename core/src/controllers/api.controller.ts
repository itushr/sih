import type { Request, Response } from "express";

import pool from "../config/database.js";

import {
    isObject,
    isStringArray,
    validateApiFields,
    validateRequiredString,
} from "../utils/validation.js";

type ApiField = {
    alias: string;
    description?: string;
    canonicalFieldId: string;
    pathType: string;
    extractionPath: string;
    transformers?: string[];
};

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

        // --------------------------------
        // AUTHENTICATION
        // --------------------------------

        if (!platformId) {
            return res.status(401).json({
                error: "Unauthorized",
            });
        }

        // --------------------------------
        // API VALIDATION
        // --------------------------------

        const aliasError =
            validateRequiredString(
                alias,
                "API alias"
            );

        if (aliasError) {
            return res.status(400).json({
                error: aliasError,
            });
        }

        const protocolError =
            validateRequiredString(
                protocol,
                "Protocol"
            );

        if (protocolError) {
            return res.status(400).json({
                error: protocolError,
            });
        }

        const endpointUrlError =
            validateRequiredString(
                endpointUrl,
                "Endpoint URL"
            );

        if (endpointUrlError) {
            return res.status(400).json({
                error: endpointUrlError,
            });
        }

        // --------------------------------
        // PROTOCOL CONFIG VALIDATION
        // --------------------------------

        if (
            protocolConfig !== undefined &&
            !isObject(protocolConfig)
        ) {
            return res.status(400).json({
                error:
                    "Protocol config must be an object",
            });
        }

        // --------------------------------
        // INPUT VALIDATION
        // --------------------------------

        if (
            customInputs !== undefined &&
            !isStringArray(customInputs)
        ) {
            return res.status(400).json({
                error:
                    "Custom inputs must be an array of strings",
            });
        }

        if (
            canonicalInputs !== undefined &&
            !isStringArray(canonicalInputs)
        ) {
            return res.status(400).json({
                error:
                    "Canonical inputs must be an array of strings",
            });
        }

        // --------------------------------
        // FIELD VALIDATION
        // --------------------------------

        const fieldsError =
            validateApiFields(fields);

        if (fieldsError) {
            return res.status(400).json({
                error: fieldsError,
            });
        }

        const apiFields =
            fields as ApiField[];

        // --------------------------------
        // DATABASE TRANSACTION
        // --------------------------------

        await client.query("BEGIN");

        // --------------------------------
        // VALIDATE CANONICAL FIELDS
        // --------------------------------

        const canonicalFieldIds =
            apiFields.map(
                (field) =>
                    field.canonicalFieldId
            );

        if (
            canonicalFieldIds.length > 0
        ) {
            const canonicalResult =
                await client.query(
                    `SELECT id
                     FROM canonical_fields
                     WHERE id = ANY($1::uuid[])`,
                    [canonicalFieldIds]
                );

            const existingCanonicalIds =
                new Set(
                    canonicalResult.rows.map(
                        (row) => row.id
                    )
                );

            const missingCanonicalFields =
                [
                    ...new Set(
                        canonicalFieldIds.filter(
                            (id) =>
                                !existingCanonicalIds.has(
                                    id
                                )
                        )
                    ),
                ];

            if (
                missingCanonicalFields.length >
                0
            ) {
                await client.query(
                    "ROLLBACK"
                );

                return res.status(404).json({
                    error:
                        "One or more canonical fields were not found",
                    missingCanonicalFields,
                });
            }
        }

        // --------------------------------
        // VALIDATE TRANSFORMERS
        // --------------------------------

        const transformerIds = [
            ...new Set(
                apiFields.flatMap(
                    (field) =>
                        field.transformers || []
                )
            ),
        ];

        if (
            transformerIds.length > 0
        ) {
            const transformerResult =
                await client.query(
                    `SELECT id
                     FROM transformer_functions
                     WHERE id = ANY($1::uuid[])`,
                    [transformerIds]
                );

            const existingTransformerIds =
                new Set(
                    transformerResult.rows.map(
                        (row) => row.id
                    )
                );

            const missingTransformers =
                transformerIds.filter(
                    (id) =>
                        !existingTransformerIds.has(
                            id
                        )
                );

            if (
                missingTransformers.length > 0
            ) {
                await client.query(
                    "ROLLBACK"
                );

                return res.status(404).json({
                    error:
                        "One or more transformers were not found",
                    missingTransformers,
                });
            }
        }

        // --------------------------------
        // REGISTER API
        // --------------------------------

        const apiResult =
            await client.query(
                `INSERT INTO api_endpoints (
                    platform,
                    alias,
                    protocol,
                    endpoint_url,
                    protocol_config,
                    custom_inputs,
                    canonical_inputs
                )
                VALUES (
                    $1,
                    $2,
                    $3,
                    $4,
                    $5,
                    $6,
                    $7
                )
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

        const api =
            apiResult.rows[0];

        // --------------------------------
        // REGISTER DATA FIELDS
        // --------------------------------

        const registeredFields = [];

        for (const field of apiFields) {
            const fieldResult =
                await client.query(
                    `INSERT INTO data_field_registry (
                        alias,
                        description,
                        api_id,
                        canonical_field_id,
                        path_type,
                        extraction_path,
                        transformers
                    )
                    VALUES (
                        $1,
                        $2,
                        $3,
                        $4,
                        $5,
                        $6,
                        $7
                    )
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
                        field.description?.trim() ||
                            null,
                        api.id,
                        field.canonicalFieldId,
                        field.pathType,
                        field.extractionPath.trim(),
                        field.transformers || [],
                    ]
                );

            registeredFields.push(
                fieldResult.rows[0]
            );
        }

        // --------------------------------
        // COMMIT
        // --------------------------------

        await client.query("COMMIT");

        // --------------------------------
        // RESPONSE
        // --------------------------------

        return res.status(201).json({
            message:
                "API registered successfully",
            data: {
                ...api,
                fields: registeredFields,
            },
        });
    } catch (error) {
        // --------------------------------
        // ROLLBACK
        // --------------------------------

        await client.query("ROLLBACK");

        console.error(
            "Register API error:",
            error
        );

        return res.status(500).json({
            error:
                "Internal server error",
        });
    } finally {
        client.release();
    }
};