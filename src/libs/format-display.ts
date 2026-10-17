export function parseApiDate (value: string): Date
{
    const naive = /^\d{4}-\d{2}-\d{2}[T ]\d{2}:\d{2}(:\d{2}(\.\d+)?)?$/.test (value);

    return new Date (naive ? `${value.replace (" ", "T")}Z` : value);
}

export function formatStamp (value: string | null | undefined): string
{
    if (! value)
    {
        return "-";
    }

    const date = parseApiDate (value);

    if (Number.isNaN (date.getTime ()))
    {
        return value;
    }

    return new Intl.DateTimeFormat ("en-GB", {
        day: "2-digit",
        month: "short",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
    }).format (date);
}

export function humanizeToken (value: string): string
{
    const raw = value.trim ();

    if (/^[a-z0-9]+$/i.test (raw))
    {
        return raw.charAt (0).toUpperCase () + raw.slice (1);
    }

    if (! /^[a-z0-9]+(?:[._-][a-z0-9]+)+$/i.test (raw))
    {
        return raw;
    }

    return raw
        .replace (/[._-]+/g, " ")
        .replace (/\b\w/g, (char) => char.toUpperCase ());
}
