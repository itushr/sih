import pool from "../config/database.js";

export const getCanonicalFieldsByIds = async (
    ids: string[]
) => {
    if (ids.length === 0) {
        return [];
    }

    const result = await pool.query(
        `SELECT
            id,
            name,
            description,
            validation
         FROM canonical_fields
         WHERE id = ANY($1::uuid[])`,
        [ids]
    );

    return result.rows;
};

export const getCanonicalFieldsByNames = async (
    names: string[]
) => {
    if (names.length === 0) {
        return [];
    }

    const result = await pool.query(
        `SELECT
            id,
            name,
            description,
            validation
         FROM canonical_fields
         WHERE name = ANY($1::text[])`,
        [names]
    );

    return result.rows;
};