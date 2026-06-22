export const normalizeAuthEmailParam = (
    email: string
): string =>
{
    const trimmedEmail = email.trim ();

    if (! trimmedEmail)
    {
        return "";
    }

    try
    {
        return decodeURIComponent (trimmedEmail);
    }
    catch
    {
        return trimmedEmail;
    }
};

export const resolveAuthQueryParam = (
    value: string | string[] | undefined
): string =>
{
    if (Array.isArray (value))
    {
        return value[0] ?? "";
    }

    return value ?? "";
};
