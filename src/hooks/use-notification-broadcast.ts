import { useCallback, useEffect, useRef, } from "react";
import { useSession, } from "next-auth/react";

import { call, } from "@/libs/call";
import { socket, } from "@/libs/socket";
import type { RealtimeClient, } from "@/libs/realtime-client";
import { useNotifications, } from "@/hooks/use-notifications";
import type { NotificationDto, } from "@/types/admin/notification";

type NotificationCreatedPayload = {
    id?: string;
    unread?: number;
};

const NOTIFICATION_CREATED_EVENT = "v1.notification.created";

async function handleRealtimeNotification (
    notificationId: string
): Promise<void> {
    if (notificationId.trim () === "") {
        return;
    }

    const result = await call ({
        url: `/api/v1/notifications/${notificationId}`,
        method: "GET",
    });

    if (! result.isSuccess || ! result.data) {
        return;
    }

    const item = result.data as NotificationDto;
    const data = item.data ?? {};
    const title = typeof data.title === "string" ? data.title.trim () : "";
    const message =
        typeof data.message === "string" ? data.message.trim () : "";
    const body =
        title && message && title !== message
            ? `${title}: ${message}`
            : title || message || item.type;

    if (typeof window !== "undefined") {
        window.dispatchEvent (
            new CustomEvent ("notification:realtime", { detail: { body, type: item.type, }, })
        );
    }
}

export function useNotificationBroadcast (): {
    subscribe: () => Promise<void>;
    unsubscribe: () => Promise<void>;
} {
    const { data: session, status, } = useSession ();
    const { refresh, setUnread, } = useNotifications ();
    const clientRef = useRef<RealtimeClient | null>(null);

    const handleNotificationCreated = useCallback (async (
        payload: NotificationCreatedPayload
    ): Promise<void> => {
        if (typeof payload.unread === "number") {
            setUnread (payload.unread);
        } else {
            await refresh ();
        }

        if (typeof payload.id === "string" && payload.id.trim () !== "") {
            await handleRealtimeNotification (payload.id);
        }
    }, [refresh, setUnread]);

    const unsubscribe = useCallback (async (): Promise<void> => {
        if (! clientRef.current)
        {
            return;
        }

        clientRef.current.unsubscribe ();
        clientRef.current.disconnect ();
        clientRef.current = null;
    }, []);

    const subscribe = useCallback (async (): Promise<void> => {
        if (typeof window === "undefined")
        {
            return;
        }

        const userId = session?.user?.id;

        if (! userId || status !== "authenticated")
        {
            return;
        }

        await unsubscribe ();

        const { data: client, isSuccess, } = await socket ();

        if (! isSuccess || ! client)
        {
            return;
        }

        clientRef.current = client;

        client.subscribeUserEvent (
            String (userId),
            NOTIFICATION_CREATED_EVENT,
            (payload) => {
                void handleNotificationCreated (payload as NotificationCreatedPayload);
            }
        );
    }, [session?.user?.id, status, unsubscribe, handleNotificationCreated]);

    useEffect ((): (() => void) =>
    {
        if (status === "authenticated")
        {
            void subscribe ();
        }
        else
        {
            void unsubscribe ();
        }

        return (): void =>
        {
            void unsubscribe ();
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ status, session?.user?.id, ]);

    return { subscribe, unsubscribe, };
}
