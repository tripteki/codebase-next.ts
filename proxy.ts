import "@/libs/page-auth.bootstrap";

import { NextRequest, NextResponse, } from "next/server";

import { AUTH_LOGIN_PATH, resolvePageAuth, } from "@/libs/page-auth";
import { requestHasSessionCookie, } from "@/libs/next-auth-cookies";

export function proxy (request: NextRequest): NextResponse
{
    const { pathname, } = request.nextUrl;
    const pageAuth = resolvePageAuth (pathname);

    if (pageAuth?.mode !== "auth")
    {
        return NextResponse.next ();
    }

    if (! requestHasSessionCookie (request))
    {
        const loginUrl = request.nextUrl.clone ();

        loginUrl.pathname = pageAuth.redirectUnauthenticatedTo ?? AUTH_LOGIN_PATH;
        loginUrl.search = "";

        return NextResponse.redirect (loginUrl);
    }

    return NextResponse.next ();
}

export const config = {
    matcher: [
        "/((?! _next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|webmanifest)$).*)",
    ],
};
