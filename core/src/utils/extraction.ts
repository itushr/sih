export const getJsonPathValue = (
    data: unknown,
    path: string
): unknown => {
    const normalizedPath = path
        .replace(/^\$\./, "")
        .replace(/^\$/, "")
        .replace(/^\./, "");

    if (!normalizedPath) {
        return data;
    }

    const parts = normalizedPath
        .split(".")
        .filter(Boolean);

    let current: unknown = data;

    for (const part of parts) {
        if (
            current === null ||
            current === undefined
        ) {
            return undefined;
        }

        const arrayMatch = part.match(
            /^(.+)\[(\d+)\]$/
        );

        if (arrayMatch) {
            const [, key, index] = arrayMatch;

            if (
                key === undefined ||
                index === undefined
            ) {
                return undefined;
            }

            if (
                typeof current !== "object" ||
                current === null
            ) {
                return undefined;
            }

            const object =
                current as Record<string, unknown>;

            const array = object[key];

            if (!Array.isArray(array)) {
                return undefined;
            }

            current = array[Number(index)];

            continue;
        }

        if (
            typeof current !== "object" ||
            current === null
        ) {
            return undefined;
        }

        current = (
            current as Record<string, unknown>
        )[part];
    }

    return current;
};

export const getPlainValue = (
    data: unknown,
    path: string
): unknown => {
    if (
        typeof data !== "object" ||
        data === null
    ) {
        return undefined;
    }

    return (
        data as Record<string, unknown>
    )[path];
};

export const extractValue = (
    data: unknown,
    pathType: string,
    extractionPath: string
): unknown => {
    switch (pathType) {
        case "JSONPath":
            return getJsonPathValue(
                data,
                extractionPath
            );

        case "Plain/Key-Value":
            return getPlainValue(
                data,
                extractionPath
            );

        case "XPath":
            throw new Error(
                "XPath extraction is not implemented yet"
            );

        case "Protobuf Field Index":
            throw new Error(
                "Protobuf Field Index extraction is not implemented yet"
            );

        default:
            throw new Error(
                `Unsupported path type: ${pathType}`
            );
    }
};