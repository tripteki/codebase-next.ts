export const LOCALE_COOKIE_KEY = "i18n_redirected";

export const SUPPORTED_LOCALES = [ "en", "id", "ms", ] as const;

export type AppLocale = typeof SUPPORTED_LOCALES[number];

export const DEFAULT_LOCALE: AppLocale = (
    SUPPORTED_LOCALES.includes (process.env.NEXT_PUBLIC_APP_LANG as AppLocale)
        ? process.env.NEXT_PUBLIC_APP_LANG
        : "en"
) as AppLocale;

const parseCookieHeader = (
    cookieHeader?: string
): Record<string, string> =>
{
    if (! cookieHeader)
    {
        return {};
    }

    return cookieHeader.split (";").reduce<Record<string, string>> ((
        cookies: Record<string, string>,
        part: string
    ) =>
    {
        const [ key, ...valueParts ] = part.trim ().split ("=");

        if (! key)
        {
            return cookies;
        }

        cookies[key] = decodeURIComponent (valueParts.join ("="));

        return cookies;
    }, {});
};

export const resolveLocale = (
    locale?: string | null
): AppLocale =>
{
    if (locale && SUPPORTED_LOCALES.includes (locale as AppLocale))
    {
        return locale as AppLocale;
    }

    return DEFAULT_LOCALE;
};

export const getLocaleFromRequest = (req?: { headers?: Record<string, unknown>; cookies?: Record<string, string>; }): AppLocale =>
{
    const cookieLocale = req?.cookies?.[LOCALE_COOKIE_KEY]
        ?? parseCookieHeader (req?.headers?.cookie as string | undefined)[LOCALE_COOKIE_KEY];

    if (cookieLocale)
    {
        return resolveLocale (cookieLocale);
    }

    const acceptLanguage = req?.headers?.["accept-language"] as string | undefined;
    const headerLocale = acceptLanguage?.split (",")?.[0]?.split ("-")?.[0];

    return resolveLocale (headerLocale);
};

export const getClientLocale = (): AppLocale =>
{
    if (typeof document === "undefined")
    {
        return DEFAULT_LOCALE;
    }

    const cookieLocale = parseCookieHeader (document.cookie)[LOCALE_COOKIE_KEY];

    return resolveLocale (cookieLocale);
};

export const setLocaleCookie = (
    locale: AppLocale
): void =>
{
    if (typeof document === "undefined")
    {
        return;
    }

    const maxAge = 60 * 60 * 24 * 365;

    document.cookie = `${LOCALE_COOKIE_KEY}=${encodeURIComponent (locale)};path=/;max-age=${maxAge};SameSite=Lax`;
};
