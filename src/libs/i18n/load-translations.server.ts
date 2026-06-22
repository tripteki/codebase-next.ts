import { serverSideTranslations, } from "next-i18next/pages/serverSideTranslations";

import nextI18NextConfig from "../../../next-i18next.config.js";
import { SUPPORTED_LOCALES, type AppLocale, } from "./locale";

type I18nPageProps = {
    _nextI18Next: {
        initialI18nStore: Record<string, Record<string, unknown>>;
        initialLocale: AppLocale;
        ns: string[];
        userConfig: null;
    };
};

export const loadPageTranslations = async (
    locale: AppLocale,
    namespaces: string[]
): Promise<I18nPageProps> =>
{
    const initialI18nStore: Record<string, Record<string, unknown>> = {};

    for (const supportedLocale of SUPPORTED_LOCALES)
    {
        const { _nextI18Next, } = await serverSideTranslations (
            supportedLocale,
            namespaces,
            nextI18NextConfig
        );

        Object.assign (initialI18nStore, _nextI18Next.initialI18nStore);
    }

    return {
        _nextI18Next: {
            initialI18nStore,
            initialLocale: locale,
            ns: namespaces,
            userConfig: null,
        },
    };
};
