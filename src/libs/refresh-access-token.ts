import { publicRuntimeConfig, } from "@/libs/runtime-config";

import { callServer, } from "@/libs/call-server";

type RefreshTokenPayload = {
    accessToken?: string;
    refreshToken?: string;
    jwt?: string;
    accessTokenTtl?: number;
    refreshTokenTtl?: number;
    error?: string;
    accessTokenExpires?: number;
};

export async function refreshAccessToken (
    token: RefreshTokenPayload
): Promise<RefreshTokenPayload>
{
    if (! token.refreshToken)
    {
        return {
            ... token,
            error: "RefreshAccessTokenError",
        };
    }

    const response = await callServer ({
        baseUrl: publicRuntimeConfig.authURL,
        url: "/refresh",
        method: "PUT",
    }, token.refreshToken);

    if (response.isError || ! response.data?.accessToken)
    {
        return {
            ... token,
            error: "RefreshAccessTokenError",
        };
    }

    const accessTokenTtl = response.data.accessTokenTtl ?? 3600;

    return {
        ... token,
        accessToken: response.data.accessToken,
        refreshToken: response.data.refreshToken ?? token.refreshToken,
        jwt: response.data.accessToken,
        accessTokenExpires: Date.now () + accessTokenTtl * 1000,
        error: undefined,
    };
}
