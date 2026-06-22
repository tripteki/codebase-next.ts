import { useTranslation, } from "next-i18next/pages";
import { Dispatch, SetStateAction, useCallback, useEffect, useRef, useState, } from "react";

import {
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
    const { i18n, } = useTranslation ();
    const [ currentLocale, setCurrentLocaleState, ] = useState<AppLocale> ((): AppLocale =>
        resolveLocale (i18n.language)
    );
    const currentLocaleRef = useRef (currentLocale);

    useEffect ((): void =>
    {
        currentLocaleRef.current = currentLocale;
    }, [ currentLocale, ]);

    useEffect ((): void =>
    {
        const syncedLocale = resolveLocale (i18n.language);

        currentLocaleRef.current = syncedLocale;
        setCurrentLocaleState ((previousLocale: AppLocale): AppLocale =>
            previousLocale === syncedLocale ? previousLocale : syncedLocale
        );
    }, [ i18n.language, ]);

    const setCurrentLocale = useCallback ((nextLocale: SetStateAction<AppLocale>): void =>
    {
        const resolvedLocale = resolveLocale (
            typeof nextLocale === "function"
                ? nextLocale (currentLocaleRef.current)
                : nextLocale
        );

        if (resolvedLocale === currentLocaleRef.current)
        {
            return;
        }

        currentLocaleRef.current = resolvedLocale;
        setLocaleCookie (resolvedLocale);
        setCurrentLocaleState (resolvedLocale);
        void i18n.changeLanguage (resolvedLocale);
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

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
