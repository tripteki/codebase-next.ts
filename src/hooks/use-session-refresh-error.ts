import { signOut, useSession, } from "next-auth/react";
import { useEffect, useRef, } from "react";

export const REFRESH_ACCESS_TOKEN_ERROR = "RefreshAccessTokenError";

export const useSessionRefreshError = (): void =>
{
    const { data: session, } = useSession ();
    const hasSignedOutRef = useRef (false);

    useEffect ((): void =>
    {
        if (
            hasSignedOutRef.current
            || (session as { error?: string; } | null)?.error !== REFRESH_ACCESS_TOKEN_ERROR
        )
        {
            return;
        }

        hasSignedOutRef.current = true;

        void signOut ({
            callbackUrl: "/admin/auth/login?signedOut=1",
        });
    }, [ session, ]);
};
