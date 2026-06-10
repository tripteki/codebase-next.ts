import NextAuth, { NextAuthOptions, } from "next-auth";
import { publicRuntimeConfig, serverRuntimeConfig, } from "@/libs/runtime-config";
import CredentialsProvider from "next-auth/providers/credentials";

import { callServer, } from "@/libs/call-server";
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
                    (session as any).jwt = token?.accessToken || token?.jwt;
                    (session as any).accessToken = token?.accessToken;
                    (session as any).refreshToken = token?.refreshToken;
                    (session as any).user = token?.user;
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
                    const isEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test (identifier);

                    const formData = {
                        identifierKey: isEmail ? "email" : "username",
                        identifierValue: identifier,
                        password: credentials?.password,
                    };

                    let tokenResponse = await callServer ({
                        baseUrl: publicRuntimeConfig.authURL,
                        url: "/login",
                        method: "POST",
                        data: formData,
                    });

                    if (tokenResponse.isError)
                    {
                        throw new Error (JSON.stringify (parseApiErrors (
                            tokenResponse.error?.response?.data,
                            t ("authentication_failed")
                        )));
                    }

                    const accessToken = tokenResponse.data?.accessToken;
                    const refreshToken = tokenResponse.data?.refreshToken;
                    const accessTokenTtl = tokenResponse.data?.accessTokenTtl ?? 3600;

                    if (! accessToken)
                    {
                        throw new Error (t ("authentication_failed"));
                    }

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
