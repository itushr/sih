import pool from "../config/database.js";

export const getTransformersByIds = async (
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
            category,
            inputs,
            output
         FROM transformer_functions
         WHERE id = ANY($1::uuid[])`,
        [ids]
    );

    return result.rows;
};