import { serverSideTranslations, } from "next-i18next/pages/serverSideTranslations";

import { staticLocale, type PagePropsOptions, } from "./page-props.shared";

export const loadStaticPageProps = async (
    options: PagePropsOptions
): Promise<Record<string, unknown>> =>
({
    title: options.title,
    ... (await serverSideTranslations (staticLocale, options.namespaces)),
});
