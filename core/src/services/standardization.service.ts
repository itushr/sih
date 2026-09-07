import { extractValue } from "../utils/extraction.js";
import {
    applyTransformers,
} from "./transformation.service.js";

type FieldMapping = {
    alias: string;
    canonical_field_id: string;
    canonical_field_name: string;
    path_type: string;
    extraction_path: string;
    transformers: string[];
};

export const standardizeResponse = async (
    response: unknown,
    fields: FieldMapping[]
) => {
    const standardizedResponse: Record<
        string,
        unknown
    > = {};

    const errors = [];

    for (const field of fields) {
        try {
            let value = extractValue(
                response,
                field.path_type,
                field.extraction_path
            );

            if (value === undefined) {
                errors.push({
                    field: field.alias,
                    canonicalFieldId:
                        field.canonical_field_id,
                    canonicalFieldName:
                        field.canonical_field_name,
                    error:
                        "Value not found at extraction path",
                });

                continue;
            }

            value = await applyTransformers(
                value,
                field.transformers || []
            );

            standardizedResponse[
                field.canonical_field_name
            ] = {
                id: field.canonical_field_id,
                value,
            };
        } catch (error) {
            errors.push({
                field: field.alias,
                canonicalFieldId:
                    field.canonical_field_id,
                canonicalFieldName:
                    field.canonical_field_name,
                error:
                    error instanceof Error
                        ? error.message
                        : "Field transformation failed",
            });
        }
    }

    return {
        standardizedResponse,
        errors,
    };
};