export const formatAppName = (name: string): string =>
{
    return name
        .split (/[\s_-]+/)
        .filter (Boolean)
        .map ((word) => word.charAt (0).toUpperCase () + word.slice (1))
        .join (" ");
};
