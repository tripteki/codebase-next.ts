import { describe, expect, it, } from "vitest";

import type { NotificationDto, } from "@/types/admin/notification";
import {
    notificationBody,
    notificationIsUnread,
    notificationTargetUrl,
    notificationTitle,
} from "@/libs/notification-presenter";

const baseNotification = (): NotificationDto => ({
    id: "1",
    user_id: "1",
    type: "App\\Notifications\\Example",
    data: {},
    read_at: null,
    created_at: "2026-01-01T00:00:00Z",
    updated_at: "2026-01-01T00:00:00Z",
});

describe ("notification-presenter", () =>
{
    it ("prefers title then message then type", () =>
    {
        const item = baseNotification ();

        expect (notificationTitle ({ ... item, type: "fallback", })).toBe ("fallback");

        expect (notificationTitle ({
            ... item,
            data: { message: "Body text", },
        })).toBe ("Body text");

        expect (notificationTitle ({
            ... item,
            data: { title: "Headline", message: "Body text", },
        })).toBe ("Headline");
    });

    it ("returns body only when title and message differ", () =>
    {
        expect (notificationBody ({
            ... baseNotification (),
            data: { title: "Headline", message: "Details", },
        })).toBe ("Details");

        expect (notificationBody ({
            ... baseNotification (),
            data: { title: "Same", message: "Same", },
        })).toBeNull ();
    });

    it ("resolves target url and unread state", () =>
    {
        expect (notificationTargetUrl ({
            ... baseNotification (),
            data: { url: "/notifications", },
        })).toBe ("/notifications");

        expect (notificationIsUnread ({ ... baseNotification (), read_at: null, })).toBe (true);
        expect (notificationIsUnread ({ ... baseNotification (), read_at: "", })).toBe (true);
        expect (notificationIsUnread ({
            ... baseNotification (),
            read_at: "2026-01-02T00:00:00Z",
        })).toBe (false);
    });
});
