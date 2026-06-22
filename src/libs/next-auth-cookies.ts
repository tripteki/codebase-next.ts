import type { NextApiRequest, NextApiResponse, } from "next";
import type { NextRequest, } from "next/server";

const usesSecureCookies = (): boolean =>
    process.env.NEXTAUTH_URL?.startsWith ("https://") ?? false;

const sessionCookiePrefix = (): string =>
    `${usesSecureCookies () ? "__Secure-" : ""}next-auth.session-token`;

const expiredCookie = (name: string, secure: boolean): string =>
{
    const parts = [
        `${name}=`,
        "Path=/",
        "Expires=Thu, 01 Jan 1970 00:00:00 GMT",
        "Max-Age=0",
        "HttpOnly",
        "SameSite=Lax",
    ];

    if (secure)
    {
        parts.push ("Secure");
    }

    return parts.join ("; ");
};

const collectSessionCookieNames = (req: NextApiRequest): string[] =>
{
    const prefix = sessionCookiePrefix ();
    const names = new Set<string> ([ prefix, ]);

    for (const name of Object.keys (req.cookies ?? {}))
    {
        if (name.startsWith (prefix))
        {
            names.add (name);
        }
    }

    for (const part of (req.headers.cookie ?? "").split (";"))
    {
        const name = part.trim ().split ("=")[0];

        if (name?.startsWith (prefix))
        {
            names.add (name);
        }
    }

    return [ ... names, ];
};

const hasSessionCookieName = (name: string): boolean =>
    name === "next-auth.session-token"
        || name === "__Secure-next-auth.session-token"
        || name.startsWith ("next-auth.session-token.")
        || name.startsWith ("__Secure-next-auth.session-token.");

export const requestHasSessionCookie = (req: NextRequest): boolean =>
    req.cookies.getAll ().some ((cookie) => hasSessionCookieName (cookie.name));

export const apiRequestHasSessionCookie = (
    req: { headers?: { cookie?: string; }; cookies?: Record<string, string>; }
): boolean =>
{
    for (const name of Object.keys (req.cookies ?? {}))
    {
        if (hasSessionCookieName (name))
        {
            return true;
        }
    }

    const cookieHeader = req.headers?.cookie ?? "";

    return cookieHeader.includes ("next-auth.session-token")
        || cookieHeader.includes ("__Secure-next-auth.session-token");
};

export const clearNextAuthSessionCookies = (
    req: NextApiRequest,
    res: NextApiResponse
): void =>
{
    const secure = usesSecureCookies ();

    res.setHeader (
        "Set-Cookie",
        collectSessionCookieNames (req).map ((name) => expiredCookie (name, secure))
    );
};
