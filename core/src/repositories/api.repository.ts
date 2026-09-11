import pool from "../config/database.js";

export const getApiById = async (
    apiId: string
) => {
    const result = await pool.query(
        `SELECT
            id,
            platform,
            alias,
            protocol,
            endpoint_url,
            protocol_config,
            custom_inputs,
            canonical_inputs
         FROM api_endpoints
         WHERE id = $1`,
        [apiId]
    );

    return result.rows[0] || null;
};

export const getApiFields = async (
    apiId: string
) => {
    const result = await pool.query(
        `SELECT
            dfr.id,
            dfr.alias,
            dfr.description,
            dfr.api_id,
            dfr.canonical_field_id,
            dfr.path_type,
            dfr.extraction_path,
            dfr.transformers,

            cf.name AS canonical_field_name,
            cf.description AS canonical_field_description

         FROM data_field_registry dfr

         INNER JOIN canonical_fields cf
             ON cf.id = dfr.canonical_field_id

         WHERE dfr.api_id = $1

         ORDER BY dfr.created_at ASC`,
        [apiId]
    );

    return result.rows;
};