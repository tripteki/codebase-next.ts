import { humanizeToken, } from "@/libs/format-display";
import type { NotificationDto, } from "@/types/admin/notification";

function notificationData (item: NotificationDto): Record<string, unknown> {
    return item.data ?? {};
}

export function notificationTitle (item: NotificationDto): string {
    const data = notificationData (item);

    if (typeof data.title === "string" && data.title.trim () !== "")
    {
        return humanizeToken (data.title);
    }

    if (typeof data.message === "string" && data.message.trim () !== "")
    {
        return humanizeToken (data.message);
    }

    return humanizeToken (item.type);
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

function notificationRawTarget (item: NotificationDto): { href: string; file: boolean } | null
{
    const data = notificationData (item);
    const fileUrl = typeof data.fileUrl === "string" ? data.fileUrl.trim () : "";
    const pdfUrl = typeof data.pdf_url === "string" ? data.pdf_url.trim () : "";
    const url = typeof data.url === "string" ? data.url.trim () : "";
    const raw = fileUrl || pdfUrl || url;

    if (raw === "")
    {
        return null;
    }

    const href = /^https?:\/\//i.test (raw) || raw.startsWith ("/") ? raw : `/${raw}`;

    return {
        href,
        file: fileUrl !== "" || pdfUrl !== "",
    };
}

export function notificationTargetUrl (item: NotificationDto): string | null
{
    return notificationRawTarget (item)?.href ?? null;
}

export function notificationTargetIsExternal (url: string): boolean
{
    return /^https?:\/\//i.test (url) || url.startsWith ("/storage/");
}

export function notificationTargetIsFile (item: NotificationDto): boolean
{
    return notificationRawTarget (item)?.file ?? false;
}

export function notificationIsUnread (item: NotificationDto): boolean {
    return item.read_at === null || item.read_at === "";
}

export type NotificationTheme = "success" | "danger";

export function notificationIconName (item: NotificationDto): string
{
    const data = notificationData (item);
    const candidates = [data.presentation_icon, data.icon, item.type];

    for (const candidate of candidates)
    {
        if (candidate === null || candidate === undefined || String (candidate).trim () === "")
        {
            continue;
        }

        const normalized = String (candidate)
            .toLowerCase ()
            .replaceAll ("_", "-")
            .replaceAll (".", "-")
            .trim ();

        if (normalized.includes ("import"))
        {
            return "import";
        }

        if (normalized.includes ("export"))
        {
            return "export";
        }

        if (/^[a-z0-9]+(?:-[a-z0-9]+)*$/.test (normalized))
        {
            return normalized;
        }
    }

    return "default";
}

export function notificationTheme (item: NotificationDto): NotificationTheme
{
    const data = notificationData (item);
    const failedRows = Number (data.failed_rows ?? 0);

    if (failedRows > 0 || item.type.includes ("failed"))
    {
        return "danger";
    }

    return "success";
}
