import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next";
import { Dispatch, SetStateAction, useCallback, useEffect, useState, } from "react";

import {
    DEFAULT_LOCALE,
    getClientLocale,
    resolveLocale,
    setLocaleCookie,
    SUPPORTED_LOCALES,
    type AppLocale,
} from "@/libs/i18n/locale";

export type LocaleType =
{
    availableLocales: readonly AppLocale[];
    currentLocale: AppLocale;
    setCurrentLocale: Dispatch<SetStateAction<AppLocale>>;
};

export type TranslationType =
{
    [key: string]: ReturnType<typeof useTranslation>;
};

export const useLocale = (): LocaleType =>
{
    const router = useRouter ();
    const [ currentLocale, setCurrentLocaleState, ] = useState<AppLocale> (DEFAULT_LOCALE);

    useEffect ((): void =>
    {
        setCurrentLocaleState (getClientLocale ());
    }, []);

    const setCurrentLocale = useCallback ((nextLocale: SetStateAction<AppLocale>): void =>
    {
        setCurrentLocaleState ((previousLocale: AppLocale): AppLocale =>
        {
            const resolvedLocale = resolveLocale (
                typeof nextLocale === "function"
                    ? nextLocale (previousLocale)
                    : nextLocale
            );

            setLocaleCookie (resolvedLocale);
            router.reload ();

            return resolvedLocale;
        });
    }, [ router, ]);

    return {
        availableLocales: SUPPORTED_LOCALES,
        currentLocale: currentLocale,
        setCurrentLocale,
    };
};

export const useTranslations = (namespaces: string[]): TranslationType =>
{
    const translations = namespaces.reduce<TranslationType> ((translation: TranslationType, namespace: string) =>
    {
        // eslint-disable-next-line react-hooks/rules-of-hooks
        translation[namespace] = useTranslation (namespace);
        return translation;
    }, {});

    return translations;
};
