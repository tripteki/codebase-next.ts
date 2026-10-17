import { useCallback, useSyncExternalStore, } from "react";

import type { PaginatedMeta, } from "@/types/admin/notification";

type NotificationStore = {
    unread: number;
    items: import ("@/types/admin/notification").NotificationDto[];
    meta: PaginatedMeta | undefined;
    isLoading: boolean;
    actionId: string | null;
};

let snapshot: NotificationStore = {
    unread: 0,
    items: [],
    meta: undefined,
    isLoading: false,
    actionId: null,
};

const listeners = new Set<() => void>();

function emit (): void {
    listeners.forEach ((listener) => listener ());
}

export function getNotificationStore (): NotificationStore {
    return snapshot;
}

export function setNotificationStore (patch: Partial<NotificationStore>): void {
    snapshot = {
        ...snapshot,
        ...patch,
    };
    emit ();
}

export function useNotificationStore (): NotificationStore {
    return useSyncExternalStore (
        useCallback ((listener) => {
            listeners.add (listener);

            return () => listeners.delete (listener);
        }, []),
        () => snapshot,
        () => snapshot
    );
}
