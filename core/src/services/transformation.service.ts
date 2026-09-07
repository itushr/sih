const SAME_TRANSFORMER_ID =
    "90d8cd52-4a58-46c8-953d-cee4f540cf51";

export const runTransformer = async (
    value: unknown,
    transformerId: string
): Promise<unknown> => {
    // TODO:
    // Replace this with the actual transformer engine.

    if (
        transformerId === SAME_TRANSFORMER_ID
    ) {
        return value;
    }

    throw new Error(
        `Transformer execution is not implemented: ${transformerId}`
    );
};

export const applyTransformers = async (
    value: unknown,
    transformerIds: string[]
): Promise<unknown> => {
    let transformedValue = value;

    for (
        const transformerId of transformerIds
    ) {
        transformedValue =
            await runTransformer(
                transformedValue,
                transformerId
            );
    }

    return transformedValue;
};