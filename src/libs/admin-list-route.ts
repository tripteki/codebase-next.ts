export function queryText (value: unknown): string
{
    if (Array.isArray (value))
    {
        return queryText (value[0]);
    }

    return typeof value === "string" ? value : "";
}

export function readAdminListRoute<T extends Record<string, string>> (
    query: Record<string, unknown>,
    defaults: T
): T
{
    const state: T = { ...defaults, };

    for (const key of Object.keys (defaults))
    {
        const value = queryText (query[key]);

        if (value)
        {
            state[key as keyof T] = value as T[keyof T];
        }
    }

    return state;
}

export function adminListRouteQuery (
    state: Record<string, string>,
    defaults: Record<string, string>
): Record<string, string>
{
    const query: Record<string, string> = {};

    for (const [key, value] of Object.entries (state))
    {
        if (value && value !== defaults[key])
        {
            query[key] = value;
        }
    }

    return query;
}
