import { resolveLocale, } from "./i18n/locale";
import { loadPageTranslations, } from "./i18n/load-translations.server";
import { staticLocale, type PagePropsOptions, } from "./page-props.shared";

export const loadStaticPageProps = async (
    options: PagePropsOptions
): Promise<Record<string, unknown>> =>
({
    title: options.title,
    ... (await loadPageTranslations (resolveLocale (staticLocale), options.namespaces)),
});
