import NextAuth, { NextAuthOptions, } from "next-auth";
import { publicRuntimeConfig, serverRuntimeConfig, } from "@/libs/runtime-config";
import CredentialsProvider from "next-auth/providers/credentials";

import { callServer, } from "@/libs/call-server";
import { buildAuthLoginPayload, } from "@/libs/auth-login-payload";
import { isAuthTokenResponse, parseAuthLoginFailure, } from "@/libs/auth-response";
import { parseApiErrors, } from "@/libs/parse-api-errors";
import { getServerTranslation, getLocaleFromRequest, } from "@/libs/i18n/server";
import { refreshAccessToken, } from "@/libs/refresh-access-token";


const createAuthOptions = (locale: string = "en"): NextAuthOptions =>
{
    const t = getServerTranslation (locale, "auth");

    return {
        session: {
            strategy: "jwt",
            maxAge: 30 * 24 * 60 * 60,
        },
        secret: serverRuntimeConfig.secret,
        events: {
            async signOut ({ token, })
            {
                const accessToken = (token as any)?.accessToken ?? (token as any)?.jwt;

                if (! accessToken)
                {
                    return;
                }

                try
                {
                    await callServer ({
                        baseUrl: publicRuntimeConfig.authURL,
                        url: "/logout",
                        method: "POST",
                    }, accessToken);
                }
                catch
                {
                    //
                }
            },
        },
        callbacks: {
            async jwt ({ token, user, })
            {
                if (user)
                {
                    const accessToken = (user as any)?.accessToken;
                    const refreshToken = (user as any)?.refreshToken;
                    const accessTokenTtl = (user as any)?.accessTokenTtl ?? 3600;

                    return {
                        ... token,
                        accessToken,
                        refreshToken,
                        jwt: accessToken,
                        user: (user as any)?.user,
                        id: user.id,
                        name: user.name,
                        email: user.email,
                        accessTokenExpires: Date.now () + accessTokenTtl * 1000,
                    };
                }

                if ((token as any).error === "RefreshAccessTokenError")
                {
                    return token;
                }

                if (Date.now () < ((token.accessTokenExpires as number) || 0))
                {
                    return token;
                }

                return refreshAccessToken (token as any);
            },

            async session ({ session, token, })
            {
                if (token)
                {
                    (session as any).jwt = token?.accessToken || token?.jwt || null;
                    (session as any).accessToken = token?.accessToken ?? null;
                    (session as any).refreshToken = token?.refreshToken ?? null;
                    (session as any).user = token?.user ?? null;
                    (session as any).error = (token as any).error ?? null;
                    if (session.user)
                    {
                        (session.user as any).id = token.id as string;
                    }
                }
                return session;
            },
        },
        providers: [
            CredentialsProvider ({
                name: t ("credentials"),
                credentials: {
                    identifier: { label: t ("identifier"), type: "text", placeholder: t ("identifier_placeholder"), },
                    password: { label: t ("password"), type: "password", placeholder: t ("password_placeholder"), },
                    remember: { label: t ("remember_me"), type: "checkbox", },
                },

                async authorize (credentials)
                {
                    const identifier = credentials?.identifier || "";

                    let tokenResponse = await callServer ({
                        baseUrl: publicRuntimeConfig.authURL,
                        url: "/login",
                        method: "POST",
                        data: buildAuthLoginPayload ({
                            identifier,
                            password: credentials?.password || "",
                            remember: credentials?.remember === "true",
                        }),
                    });

                    if (tokenResponse.isError)
                    {
                        throw new Error (JSON.stringify (parseApiErrors (
                            tokenResponse.error?.response?.data,
                            t ("authentication_failed")
                        )));
                    }

                    const loginFailure = parseAuthLoginFailure (
                        tokenResponse.data,
                        t ("authentication_failed")
                    );

                    if (loginFailure)
                    {
                        throw new Error (JSON.stringify (loginFailure));
                    }

                    if (! isAuthTokenResponse (tokenResponse.data))
                    {
                        throw new Error (t ("authentication_failed"));
                    }

                    const accessToken = tokenResponse.data.accessToken;
                    const refreshToken = tokenResponse.data.refreshToken;
                    const accessTokenTtl = tokenResponse.data.accessTokenTtl ?? 3600;

                    let userResponse = await callServer ({
                        baseUrl: publicRuntimeConfig.authURL,
                        url: "/me",
                        method: "GET",
                    }, accessToken);

                    if (userResponse.isError)
                    {
                        throw new Error (t ("authentication_failed"));
                    }

                    const user = userResponse.data;

                    return {
                        id: user?.id?.toString () || user?.email || "",
                        email: user?.email || "",
                        name: user?.name || user?.username || "",
                        accessToken,
                        refreshToken,
                        accessTokenTtl,
                        user,
                    };
                },
            }),
        ],
    };
};

export const authOptions = createAuthOptions ("en");

export default NextAuth (authOptions);
