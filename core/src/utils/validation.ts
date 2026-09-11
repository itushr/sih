export const PATH_TYPES = [
    "JSONPath",
    "XPath",
    "Protobuf Field Index",
    "Plain/Key-Value",
] as const;

export const isNonEmptyString = (
    value: unknown
): value is string => {
    return (
        typeof value === "string" &&
        value.trim().length > 0
    );
};

export const isObject = (
    value: unknown
): value is Record<string, unknown> => {
    return (
        typeof value === "object" &&
        value !== null &&
        !Array.isArray(value)
    );
};

export const isStringArray = (
    value: unknown
): value is string[] => {
    return (
        Array.isArray(value) &&
        value.every(
            (item) =>
                typeof item === "string" &&
                item.trim().length > 0
        )
    );
};

export const validateRequiredString = (
    value: unknown,
    fieldName: string
): string | null => {
    if (!isNonEmptyString(value)) {
        return `${fieldName} is required`;
    }

    return null;
};

export const validateApiField = (
    field: unknown
): string | null => {
    if (!isObject(field)) {
        return "Each field must be an object";
    }

    if (!isNonEmptyString(field.alias)) {
        return "Field alias is required";
    }

    if (
        !isNonEmptyString(
            field.canonicalFieldId
        )
    ) {
        return "Canonical field ID is required";
    }

    if (
        !isNonEmptyString(field.pathType) ||
        !PATH_TYPES.includes(
            field.pathType as typeof PATH_TYPES[number]
        )
    ) {
        return (
            "Invalid path type. Allowed values: " +
            PATH_TYPES.join(", ")
        );
    }

    if (
        !isNonEmptyString(
            field.extractionPath
        )
    ) {
        return "Extraction path is required";
    }

    if (
        field.description !== undefined &&
        typeof field.description !== "string"
    ) {
        return "Field description must be a string";
    }

    if (
        field.transformers !== undefined &&
        !isStringArray(field.transformers)
    ) {
        return (
            "Transformers must be an array of strings"
        );
    }

    return null;
};

export const validateApiFields = (
    fields: unknown
): string | null => {
    if (!Array.isArray(fields)) {
        return "Fields must be an array";
    }

    for (const field of fields) {
        const error =
            validateApiField(field);

        if (error) {
            return error;
        }
    }

    return null;
};