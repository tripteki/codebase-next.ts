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

const WRAPPER_KEYS = new Set ([ "errors", "detail", "message", "success", ]);

const unwrapErrorPayload = (
    data: Record<string, unknown>
): ApiErrorPayload =>
{
    const nested = data.data;

    if (
        nested
        && typeof nested === "object"
        && ! Array.isArray (nested)
        && (
            "errors" in nested
            || "success" in nested
            || "detail" in nested
            || "message" in nested
        )
    )
    {
        return nested as ApiErrorPayload;
    }

    return data as ApiErrorPayload;
};

const isFieldErrorsRecord = (
    data: Record<string, unknown>
): data is Record<string, string | string[]> =>
{
    const keys = Object.keys (data);

    if (keys.length === 0)
    {
        return false;
    }

    if (keys.some ((key) => WRAPPER_KEYS.has (key)))
    {
        return false;
    }

    return Object.values (data).every ((value) =>
        typeof value === "string"
        || (
            Array.isArray (value)
            && value.length > 0
            && value.every ((item) => typeof item === "string")
        )
    );
};

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

const PASSWORD_MISMATCH_PATTERN = /password confirmation|password_confirmation|passwords? do not match|must match|mismatch/i;

const resolveDetailFields = (item: ApiValidationDetail): string[] =>
{
    const field = resolveFieldFromLoc (item.loc);

    if (field !== "general")
    {
        return [ field, ];
    }

    const message = item.msg ?? "";

    if (
        PASSWORD_MISMATCH_PATTERN.test (message)
        || item.type === "value_error.confirmed"
    )
    {
        return [ "password_confirmation", ];
    }

    return [ field, ];
};

export const focusPasswordMatchError = (
    errors: Record<string, string>,
    field: "password" | "password_confirmation"
): Record<string, string> =>
{
    const message = errors.password_confirmation || errors.password;

    if (! message)
    {
        return errors;
    }

    const next = { ... errors, };

    delete next.password;
    delete next.password_confirmation;
    next[field] = message;

    return next;
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

        for (const targetField of resolveDetailFields (item))
        {
            if (result[targetField])
            {
                result[targetField] = `${result[targetField]} ${item.msg}`;
            }
            else
            {
                result[targetField] = item.msg;
            }
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

    const payload = unwrapErrorPayload (data as Record<string, unknown>);

    if (isFieldErrorsRecord (payload as Record<string, unknown>))
    {
        return normalizeErrorsRecord (payload as Record<string, string | string[]>);
    }

    if (payload.errors && typeof payload.errors === "object")
    {
        return normalizeErrorsRecord (payload.errors);
    }

    if (Array.isArray (payload.detail))
    {
        const parsed = parseDetailArray (payload.detail);

        return Object.keys (parsed).length > 0
            ? parsed
            : { general: fallback, };
    }

    if (typeof payload.detail === "string" && payload.detail.length > 0)
    {
        return { general: payload.detail, };
    }

    if (typeof payload.message === "string" && payload.message.length > 0)
    {
        return { general: payload.message, };
    }

    return { general: fallback, };
};
