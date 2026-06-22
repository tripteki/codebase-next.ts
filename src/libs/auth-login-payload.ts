export type AuthLoginInput = {
    identifier: string;
    password: string;
    remember?: boolean;
};

export const buildAuthLoginPayload = ({
    identifier,
    password,
    remember,
}: AuthLoginInput): Record<string, unknown> => {
    const identifierValue = identifier.trim ();
    const identifierKey = identifierValue.includes ("@") ? "email" : "name";

    return {
        identifierKey,
        identifierValue,
        identifier: identifierValue,
        password,
        ...(remember !== undefined ? { remember } : {}),
    };
};
