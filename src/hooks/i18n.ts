import { NextRouter, useRouter, } from "next/router";
import { useTranslation, } from "next-i18next";
import { Dispatch, SetStateAction, useEffect, useState, } from "react";

export type LocaleType =
{
    availableLocales: readonly string[] | undefined;
    currentLocale: string | undefined;
    setCurrentLocale: Dispatch<SetStateAction<string | undefined>>;
};

export type TranslationType =
{
    [key: string]: ReturnType<typeof useTranslation>;
};

export const useLocale = (): LocaleType =>
{
    const router: NextRouter = useRouter ();
    const [ current, setCurrent, ]: [ string | undefined, Dispatch<SetStateAction<string | undefined>>, ] = useState<string | undefined> (router?.locale);

    useEffect ((): void =>
    {
        if (current !== router?.locale)
        {
            window.location.href = `/${current}`;
        }
    }, [ current, router?.locale, ]);

    return {
        availableLocales: router?.locales?.filter ((locale: string): boolean => locale != "default"),
        currentLocale: current != "default" ? current : process.env.NEXT_PUBLIC_APP_LANG,
        setCurrentLocale: setCurrent,
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
