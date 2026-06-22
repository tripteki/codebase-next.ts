import { useRouter, } from "next/router";
import { getSession, useSession, } from "next-auth/react";
import { useEffect, useRef, useState, } from "react";

import { hasValidSession, } from "@/libs/auth-session";
import { isStaticBuild, } from "@/libs/page-props.shared";

export const useRequireAuth = (
    redirectTo: string = "/admin/auth/login"
): boolean =>
{
    const router = useRouter ();
    const { data: session, status, } = useSession ();
    const hasRedirectedRef = useRef (false);
    const [ staticReady, setStaticReady, ] = useState (! isStaticBuild);
    const isAuthenticated = status === "authenticated" && hasValidSession (session);

    useEffect (() =>
    {
        if (! isStaticBuild)
        {
            return undefined;
        }

        let cancelled = false;

        void getSession ().then ((nextSession) =>
        {
            if (cancelled)
            {
                return;
            }

            setStaticReady (true);

            if (! hasValidSession (nextSession) && ! hasRedirectedRef.current)
            {
                hasRedirectedRef.current = true;
                void router.replace (redirectTo);
            }
        });

        return (): void =>
        {
            cancelled = true;
        };
    }, [ redirectTo, router, ]);

    useEffect ((): void =>
    {
        if (status === "loading" || isAuthenticated || hasRedirectedRef.current)
        {
            return;
        }

        hasRedirectedRef.current = true;
        void router.replace (redirectTo);
    }, [ status, isAuthenticated, redirectTo, router, ]);

    if (isStaticBuild && ! staticReady)
    {
        return false;
    }

    if (status === "loading")
    {
        return false;
    }

    return isAuthenticated;
};

export const useRequireGuest = (
    redirectTo: string = "/admin/dashboard"
): boolean =>
{
    const router = useRouter ();
    const { data: session, status, } = useSession ();
    const hasRedirectedRef = useRef (false);
    const signedOut = router.query.signedOut === "1";
    const routerReady = router.isReady;
    const isAuthenticated = status === "authenticated" && hasValidSession (session);

    useEffect ((): void =>
    {
        if (! routerReady || status === "loading" || signedOut || hasRedirectedRef.current)
        {
            return;
        }

        if (isAuthenticated)
        {
            hasRedirectedRef.current = true;
            void router.replace (redirectTo);
        }
    }, [ isAuthenticated, status, routerReady, signedOut, redirectTo, router, ]);

    if (signedOut)
    {
        return true;
    }

    if (! routerReady || status === "loading")
    {
        return false;
    }

    return ! isAuthenticated;
};
