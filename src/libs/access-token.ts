export function rawAccessToken (token: string | null | undefined): string
{
    return (token ?? "").trim ().replace (/^bearer\s+/i, "");
}

export function authorizationHeader (token: string | null | undefined): string
{
    const raw = rawAccessToken (token);

    return raw ? `Bearer ${raw}` : "";
}
