import { useRouter, } from "next/router";
import { useSession, } from "next-auth/react";
import { useEffect, } from "react";

const isStaticBuild: boolean = process.env.NEXT_PUBLIC_BUILD_STATIC === "true";

export const useRequireAuth = (
    redirectTo: string = "/admin/auth/login"
): void =>
{
    const router = useRouter ();
    const { status, } = useSession ();

    useEffect ((): void =>
    {
        if (! isStaticBuild || status === "loading")
        {
            return;
        }

        if (status === "unauthenticated")
        {
            router.replace (redirectTo);
        }
    }, [ status, router, redirectTo, ]);
};

export const useRequireGuest = (
    redirectTo: string = "/admin/dashboard"
): void =>
{
    const router = useRouter ();
    const { status, } = useSession ();

    useEffect ((): void =>
    {
        if (! isStaticBuild || status === "loading")
        {
            return;
        }

        if (status === "authenticated")
        {
            router.replace (redirectTo);
        }
    }, [ status, router, redirectTo, ]);
};
