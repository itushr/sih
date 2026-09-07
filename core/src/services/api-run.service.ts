import {
    getApiById,
    getApiFields,
} from "../repositories/api.repository.js";

import {
    standardizeResponse,
} from "./standardization.service.js";

type RunApiOptions = {
    apiId: string;
    canonicalFields: string[];
    inputs?: Record<string, unknown>;
};

const buildRequestUrl = (
    endpointUrl: string,
    inputs: Record<string, unknown>
) => {
    const url = new URL(endpointUrl);

    for (
        const [key, value]
        of Object.entries(inputs)
    ) {
        if (
            value !== undefined &&
            value !== null
        ) {
            url.searchParams.set(
                key,
                String(value)
            );
        }
    }

    return url;
};

const executeRestApi = async (
    api: any,
    inputs: Record<string, unknown>
) => {
    const method =
        api.protocol_config?.method
            ?.toUpperCase();

    if (!method) {
        throw new Error(
            "REST API method is not configured"
        );
    }

    if (
        method !== "GET" &&
        method !== "POST"
    ) {
        throw new Error(
            `Unsupported REST method: ${method}`
        );
    }

    if (method === "GET") {
        const url = buildRequestUrl(
            api.endpoint_url,
            inputs
        );

        const response = await fetch(
            url.toString(),
            {
                method: "GET",
                headers: {
                    Accept:
                        "application/json",
                },
            }
        );

        if (!response.ok) {
            throw new Error(
                `External API returned ${response.status}`
            );
        }

        return response.json();
    }

    const response = await fetch(
        api.endpoint_url,
        {
            method: "POST",
            headers: {
                "Content-Type":
                    "application/json",
                Accept:
                    "application/json",
            },
            body: JSON.stringify(inputs),
        }
    );

    if (!response.ok) {
        throw new Error(
            `External API returned ${response.status}`
        );
    }

    return response.json();
};

export const runApi = async ({
    apiId,
    canonicalFields,
    inputs = {},
}: RunApiOptions) => {
    // --------------------------------
    // GET API
    // --------------------------------

    const api = await getApiById(apiId);

    if (!api) {
        throw new Error(
            "API not found"
        );
    }

    // --------------------------------
    // GET API FIELD MAPPINGS
    // --------------------------------

    const fields =
        await getApiFields(apiId);

    if (fields.length === 0) {
        throw new Error(
            "API has no registered fields"
        );
    }

    // --------------------------------
    // FIND REQUESTED FIELDS
    // --------------------------------

    const requestedFields =
        fields.filter(
            (field) =>
                canonicalFields.includes(
                    field.canonical_field_id
                ) ||
                canonicalFields.includes(
                    field.canonical_field_name
                )
        );

    if (
        requestedFields.length !==
        canonicalFields.length
    ) {
        const available =
            new Set(
                fields.flatMap(
                    (field) => [
                        field.canonical_field_id,
                        field.canonical_field_name,
                    ]
                )
            );

        const missing =
            canonicalFields.filter(
                (field) =>
                    !available.has(field)
            );

        throw new Error(
            `Canonical fields not available in this API: ${missing.join(", ")}`
        );
    }

    // --------------------------------
    // EXECUTE API
    // --------------------------------

    let response;

    switch (api.protocol) {
        case "REST":
            response =
                await executeRestApi(
                    api,
                    inputs
                );
            break;

        case "GraphQL":
            throw new Error(
                "GraphQL execution is not implemented yet"
            );

        case "SOAP":
            throw new Error(
                "SOAP execution is not implemented yet"
            );

        case "gRPC":
            throw new Error(
                "gRPC execution is not implemented yet"
            );

        default:
            throw new Error(
                `Unsupported protocol: ${api.protocol}`
            );
    }

    // --------------------------------
    // STANDARDIZE ONLY REQUESTED FIELDS
    // --------------------------------

    const result =
        await standardizeResponse(
            response,
            requestedFields
        );

    return result;
};