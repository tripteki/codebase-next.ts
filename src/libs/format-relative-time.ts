import { parseApiDate, } from "@/libs/format-display";

const LOCALE_MAP: Record<string, string> = {
    en: "en-MY",
    id: "id-ID",
    ms: "ms-MY",
};

function resolveIntlLocale (locale: string): string
{
    return LOCALE_MAP[locale] ?? "en-MY";
}

export function formatRelativeTime (
    value: string | Date | null | undefined,
    locale = "en"
): string
{
    const date = value instanceof Date
        ? value
        : typeof value === "string" && value.trim () !== ""
            ? parseApiDate (value)
            : null;

    if (! date || Number.isNaN (date.getTime ()))
    {
        return "";
    }

    const diffSeconds = Math.round ((date.getTime () - Date.now ()) / 1000);
    const absSeconds = Math.abs (diffSeconds);
    const rtf = new Intl.RelativeTimeFormat (resolveIntlLocale (locale), { numeric: "auto", });

    if (absSeconds < 60)
    {
        return rtf.format (diffSeconds, "second");
    }

    const diffMinutes = Math.round (diffSeconds / 60);

    if (Math.abs (diffMinutes) < 60)
    {
        return rtf.format (diffMinutes, "minute");
    }

    const diffHours = Math.round (diffMinutes / 60);

    if (Math.abs (diffHours) < 24)
    {
        return rtf.format (diffHours, "hour");
    }

    const diffDays = Math.round (diffHours / 24);

    if (Math.abs (diffDays) < 30)
    {
        return rtf.format (diffDays, "day");
    }

    const diffMonths = Math.round (diffDays / 30);

    if (Math.abs (diffMonths) < 12)
    {
        return rtf.format (diffMonths, "month");
    }

    return rtf.format (Math.round (diffMonths / 12), "year");
}
