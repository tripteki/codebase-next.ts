import { useCallback, } from "react";

import {
    appendAdminListFilter,
    buildAdminListParams,
} from "@/libs/admin-list-params";
import { call, } from "@/libs/call";
import {
    parsePaginatedResult,
} from "@/hooks/use-admin-list-state";
import {
    getNotificationStore,
    setNotificationStore,
    useNotificationStore,
} from "@/hooks/notifications-store";
import type {
    NotificationDto,
    NotificationUnreadDto,
} from "@/types/admin/notification";

export type NotificationStatusFilter = "" | "read" | "unread";

export function useNotifications () {
    const { unread, items, meta, isLoading, actionId, } = useNotificationStore ();

    const fetchUnread = useCallback (async (): Promise<void> => {
        const result = await call ({
            url: "/api/v1/notifications/unread",
            method: "GET",
        });

        if (result.isSuccess && result.data) {
            setNotificationStore ({
                unread: (result.data as NotificationUnreadDto).unread ?? 0,
            });
        }
    }, []);

    const fetchList = useCallback (async (
        options: {
            limit?: number;
            current_page?: number;
            order?: string;
            status?: NotificationStatusFilter;
        } = {}
    ): Promise<void> => {
        setNotificationStore ({ isLoading: true, });

        const params = buildAdminListParams ({
            limit: options.limit,
            current_page: options.current_page,
            order: options.order,
            defaultLimit: 10,
            defaultOrder: "-updated_at",
        });

        appendAdminListFilter (params, "status", options.status, [
            "read",
            "unread",
        ]);

        const result = await call ({
            url: "/api/v1/notifications",
            method: "GET",
            params,
        });

        const parsed = parsePaginatedResult<NotificationDto> (result);

        if (parsed)
        {
            setNotificationStore ({
                items: parsed.items,
                meta: parsed.meta,
            });
        }

        setNotificationStore ({ isLoading: false, });
    }, []);

    const fetchRecent = useCallback (async (
        limit = 10,
        status: NotificationStatusFilter = ""
    ): Promise<void> => {
        await fetchList ({ limit, status, });
    }, [fetchList]);

    const refresh = useCallback (async (): Promise<void> => {
        await fetchUnread ();
    }, [fetchUnread]);

    const markAsRead = useCallback (async (id: string): Promise<boolean> => {
        setNotificationStore ({ actionId: id, });

        try {
            const result = await call ({
                url: `/api/v1/notifications/read/${id}`,
                method: "PUT",
            });

            if (result.isSuccess) {
                await refresh ();
            }

            return result.isSuccess;
        } finally {
            setNotificationStore ({ actionId: null, });
        }
    }, [refresh]);

    const markAllAsRead = useCallback (async (): Promise<boolean> => {
        const result = await call ({
            url: "/api/v1/notifications/read-all",
            method: "PUT",
        });

        if (! result.isSuccess) {
            return false;
        }

        await refresh ();

        return true;
    }, [refresh]);

    const deleteNotification = useCallback (async (id: string): Promise<boolean> => {
        const result = await call ({
            url: `/api/v1/notifications/${id}`,
            method: "DELETE",
        });

        if (result.isSuccess) {
            await refresh ();
        }

        return result.isSuccess;
    }, [refresh]);

    const setUnread = useCallback ((value: number): void => {
        setNotificationStore ({ unread: value, });
    }, []);

    return {
        unread,
        items,
        meta,
        isLoading,
        actionId,
        fetchUnread,
        fetchList,
        fetchRecent,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        refresh,
        setUnread,
    };
}

export { getNotificationStore, setNotificationStore, };
