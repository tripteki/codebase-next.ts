import { useEffect, useRef, } from "react";
import { useSession, } from "next-auth/react";

import { socket, } from "@/libs/socket";
import type { RealtimeClient, } from "@/libs/realtime-client";

const ADMIN_REFRESH_EVENT = "v1.admin.refresh";

export function useAdminRefresh (scopes: string[], onRefresh: () => void): void
{
    const { data: session, status, } = useSession ();
    const clientRef = useRef<RealtimeClient | null> (null);
    const onRefreshRef = useRef (onRefresh);
    const scopeKey = scopes.join (",");

    onRefreshRef.current = onRefresh;

    useEffect ((): (() => void) =>
    {
        const wanted = scopeKey === "" ? [] : scopeKey.split (",");

        async function subscribe (): Promise<void>
        {
            if (typeof window === "undefined" || wanted.length === 0)
            {
                return;
            }

            const userId = session?.user?.id;

            if (! userId || status !== "authenticated")
            {
                return;
            }

            const { data: client, isSuccess, } = await socket ();

            if (! isSuccess || ! client)
            {
                return;
            }

            clientRef.current = client;
            client.subscribeUserEvent (String (userId), ADMIN_REFRESH_EVENT, (payload) =>
            {
                const incoming = Array.isArray (payload.scopes)
                    ? payload.scopes.map (String)
                    : [];

                if (incoming.some ((scope) => wanted.includes (scope)))
                {
                    onRefreshRef.current ();
                }
            });
        }

        function unsubscribe (): void
        {
            clientRef.current?.unsubscribe ();
            clientRef.current?.disconnect ();
            clientRef.current = null;
        }

        if (status === "authenticated")
        {
            void subscribe ();
        }

        return (): void =>
        {
            unsubscribe ();
        };
    }, [ status, session?.user?.id, scopeKey, ]);
}
