export type PageAuthMode = "public" | "guest" | "auth";

export type PageAuthConfig = {
    mode: PageAuthMode;
    redirectAuthenticatedTo?: string;
    redirectUnauthenticatedTo?: string;
};

export const AUTH_LOGIN_PATH = "/admin/auth/login";

export const AUTH_HOME_PATH = "/admin/dashboard";

type RegisteredPageAuth = PageAuthConfig & {
    path: string;
};

const registeredRoutes: RegisteredPageAuth[] = [];

const normalizePath = (pathname: string): string =>
{
    if (pathname.length > 1 && pathname.endsWith ("/"))
    {
        return pathname.slice (0, -1);
    }

    return pathname;
};

const pathMatchesPattern = (pattern: string, pathname: string): boolean =>
{
    const patternParts = normalizePath (pattern).split ("/").filter (Boolean);
    const pathParts = normalizePath (pathname).split ("/").filter (Boolean);

    if (patternParts.length !== pathParts.length)
    {
        return false;
    }

    return patternParts.every ((part, index) =>
        (part.startsWith ("[") && part.endsWith ("]")) || part === pathParts[index]
    );
};

export const definePageAuth = (
    path: string,
    config: PageAuthConfig
): PageAuthConfig =>
{
    registeredRoutes.push ({
        path: normalizePath (path),
        ... config,
    });

    return config;
};

export const resolvePageAuth = (pathname: string): PageAuthConfig | undefined =>
{
    const normalizedPath = normalizePath (pathname);

    const exact = registeredRoutes.find ((route) => route.path === normalizedPath);

    if (exact)
    {
        return exact;
    }

    const dynamic = registeredRoutes.find ((route) =>
        pathMatchesPattern (route.path, normalizedPath)
    );

    return dynamic;
};
