export const isStaticBuild: boolean = process.env.BUILD_STATIC === "true";

export const staticLocale: string = process.env.NEXT_PUBLIC_APP_LANG || "en";

export type PagePropsOptions =
{
    title: string;
    namespaces: string[];
};

export type ServerSideOptions = PagePropsOptions &
{
    requireAuth?: boolean;
    requireGuest?: boolean;
    requireParams?: string[];
    requireQuery?: string[];
    redirectTo?: string;
};

export const emptyStaticPaths = async () =>
({
    paths: [],
    fallback: false as const,
});
