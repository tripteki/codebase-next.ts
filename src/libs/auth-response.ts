import { parseApiErrors, } from "@/libs/parse-api-errors";

export type AuthTokenResponse = {
    accessToken: string;
    refreshToken?: string;
    accessTokenTtl?: number;
};

export const isAuthTokenResponse = (
    data: unknown
): data is AuthTokenResponse =>
    typeof data === "object"
    && data !== null
    && typeof (data as AuthTokenResponse).accessToken === "string";

export const parseAuthLoginFailure = (
    data: unknown,
    fallback: string
): Record<string, string> | null =>
{
    if (typeof data === "string" && data.length > 0)
    {
        return parseApiErrors (data, fallback);
    }

    if (data && typeof data === "object" && ! isAuthTokenResponse (data))
    {
        const errors = parseApiErrors (data as Record<string, unknown>, fallback);

        if (Object.keys (errors).length > 0)
        {
            return errors;
        }
    }

    return null;
};

export const validatePasswordConfirmation = (
    password: string | undefined,
    passwordConfirmation: string | undefined,
    message: string
): Record<string, string> | null =>
{
    if (password !== passwordConfirmation)
    {
        return { password_confirmation: message, };
    }

    return null;
};

export const isE2eLoginSuccessful = async (
    response: Response
): Promise<boolean> =>
{
    if (! response.ok)
    {
        return false;
    }

    const text = await response.text ();

    try
    {
        const body = JSON.parse (text);

        return isAuthTokenResponse (body);
    }
    catch
    {
        return false;
    }
};
