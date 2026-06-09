export type ApiValidationDetail = {
    type?: string;
    loc?: Array<string | number>;
    msg?: string;
    input?: unknown;
    ctx?: Record<string, unknown>;
};

export type ApiErrorPayload = {
    detail?: ApiValidationDetail[] | string;
    message?: string;
    errors?: Record<string, string | string[]>;
};

const LOCATION_PREFIXES = new Set ([ "body", "query", "path", "header", "cookie", ]);

export const resolveFieldFromLoc = (loc?: Array<string | number>): string =>
{
    if (! loc || loc.length === 0)
    {
        return "general";
    }

    const parts = loc.map (String);

    if (LOCATION_PREFIXES.has (parts[0]))
    {
        return parts.slice (1).join (".") || "general";
    }

    return parts.join (".");
};

export const normalizeErrorsRecord = (
    errors: Record<string, string | string[]>
): Record<string, string> =>
{
    const result: Record<string, string> = {};

    for (const [ key, value, ] of Object.entries (errors))
    {
        if (Array.isArray (value))
        {
            result[key] = value[0] ?? "";
        }
        else if (typeof value === "string")
        {
            result[key] = value;
        }
    }

    return result;
};

export const parseDetailArray = (
    detail: ApiValidationDetail[]
): Record<string, string> =>
{
    const result: Record<string, string> = {};

    for (const item of detail)
    {
        if (! item?.msg)
        {
            continue;
        }

        const field = resolveFieldFromLoc (item.loc);

        if (result[field])
        {
            result[field] = `${result[field]} ${item.msg}`;
        }
        else
        {
            result[field] = item.msg;
        }
    }

    return result;
};

export const parseApiErrors = (
    data: ApiErrorPayload | string | null | undefined,
    fallback = "Something went wrong."
): Record<string, string> =>
{
    if (! data)
    {
        return { general: fallback, };
    }

    if (typeof data === "string")
    {
        return { general: data, };
    }

    if (data.errors && typeof data.errors === "object")
    {
        return normalizeErrorsRecord (data.errors);
    }

    if (Array.isArray (data.detail))
    {
        const parsed = parseDetailArray (data.detail);

        return Object.keys (parsed).length > 0
            ? parsed
            : { general: fallback, };
    }

    if (typeof data.detail === "string")
    {
        return { general: data.detail, };
    }

    if (typeof data.message === "string")
    {
        return { general: data.message, };
    }

    return { general: fallback, };
};
