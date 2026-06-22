function normalizeOrderToken (token: string): string
{
    const trimmed = token.trim ();

    if (! trimmed)
    {
        return "";
    }

    if (trimmed.includes (":"))
    {
        return trimmed;
    }

    if (trimmed.startsWith ("-"))
    {
        return `${trimmed.slice (1)}:desc`;
    }

    return `${trimmed}:asc`;
}

function buildOrdersValue (
    options: {
        sort?: string;
        order?: string;
        defaultSort?: string;
        defaultOrder?: string;
    }
): string | undefined
{
    const raw = options.order
        ?? options.defaultOrder
        ?? options.sort
        ?? options.defaultSort;

    if (! raw)
    {
        return undefined;
    }

    const orders = raw
        .split (",")
        .map (normalizeOrderToken)
        .filter ((value) => value.length > 0);

    return orders.length > 0 ? orders.join (",") : undefined;
}

export function buildAdminListParams (
    options: {
        limit?: number;
        limitPage?: number;
        current_page?: number;
        currentPage?: number;
        sort?: string;
        order?: string;
        defaultLimit?: number;
        defaultPage?: number;
        defaultSort?: string;
        defaultOrder?: string;
    } = {}
): Record<string, string | number>
{
    const params: Record<string, string | number> = {
        limitPage: options.limitPage ?? options.limit ?? options.defaultLimit ?? 15,
        currentPage: options.currentPage ?? options.current_page ?? options.defaultPage ?? 1,
    };

    const orders = buildOrdersValue (options);

    if (orders)
    {
        params.orders = orders;
    }

    return params;
}

export function appendAdminListFilter (
    params: Record<string, string | number>,
    key: string,
    value: string | undefined,
    allowed?: readonly string[]
): void
{
    const trimmed = value?.trim ();

    if (! trimmed)
    {
        return;
    }

    if (allowed && ! allowed.includes (trimmed))
    {
        return;
    }

    const token = `${key}:${trimmed}`;
    const existing = params.filters;

    params.filters = typeof existing === "string" && existing.length > 0
        ? `${existing},${token}`
        : token;
}
