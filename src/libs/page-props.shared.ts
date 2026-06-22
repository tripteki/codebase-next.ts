import type { PageAuthConfig, } from "@/libs/page-auth";

export const isStaticBuild: boolean = process.env.BUILD_STATIC === "true";

export const staticLocale: string = process.env.NEXT_PUBLIC_APP_LANG || "en";

/** Header/footer auth actions (log in, logout) live in the auth namespace. */
export const LAYOUT_I18N_NAMESPACES = [ "common", "auth", ] as const;

export function withLayoutNamespaces (
    namespaces: readonly string[]
): string[]
{
    return Array.from (new Set ([ ...LAYOUT_I18N_NAMESPACES, ...namespaces, ]));
}

export type PagePropsOptions =
{
    title: string;
    namespaces: string[];
};

export type ServerSideOptions = PagePropsOptions &
{
    pageAuth?: PageAuthConfig;
    requireParams?: string[];
    requireQuery?: string[];
    redirectTo?: string;
};

export const emptyStaticPaths = async () =>
({
    paths: [],
    fallback: false as const,
});
