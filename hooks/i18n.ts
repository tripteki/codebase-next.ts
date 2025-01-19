import { NextRouter, useRouter, } from "next/router";
import { useTranslation, } from "next-i18next";
import { i18n, } from "../next-i18next.config";

export const useLocale = (): { currentLocale: () => string; availableLocales: () => string[]; } =>
{
    return {

        currentLocale: (): string => useTranslation ().i18n.language,
        availableLocales: (): string[] => i18n.locales,
    };
};

export const useChangeLocale = (): ((event: React.ChangeEvent<HTMLSelectElement>) => void) =>
{
    const

    router: NextRouter = useRouter (),
    changeI18N = (event: React.ChangeEvent<HTMLSelectElement>): void => {
        router.push (
            { pathname: router.pathname, query: router.query, },
            router.asPath,
            { locale: event.target.value, }
        );
    };

    return changeI18N;
};

export const useTranslations = (namespaces: string[]): {[key: string]: ReturnType<typeof useTranslation>} =>
{
    const translations = namespaces.reduce<{[key: string]: ReturnType<typeof useTranslation>}> ((acc, namespace) => {
        acc[namespace] = useTranslation (namespace); return acc;
    }, {});

    return translations;
};
