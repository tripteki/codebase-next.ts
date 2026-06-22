import type { NotificationDto, } from "@/types/admin/notification";

function notificationData (item: NotificationDto): Record<string, unknown> {
    return item.data ?? {};
}

export function notificationTitle (item: NotificationDto): string {
    const data = notificationData (item);

    if (typeof data.title === "string" && data.title.trim () !== "") {
        return data.title;
    }

    if (typeof data.message === "string" && data.message.trim () !== "") {
        return data.message;
    }

    return item.type;
}

export function notificationBody (item: NotificationDto): string | null {
    const data = notificationData (item);
    const message = typeof data.message === "string" ? data.message.trim () : "";
    const title = typeof data.title === "string" ? data.title.trim () : "";

    if (message !== "" && title !== "" && message !== title) {
        return message;
    }

    return null;
}

export function notificationTargetUrl (item: NotificationDto): string | null {
    const data = notificationData (item);

    if (typeof data.url === "string" && data.url.trim () !== "") {
        return data.url;
    }

    return null;
}

export function notificationIsUnread (item: NotificationDto): boolean {
    return item.read_at === null || item.read_at === "";
}
