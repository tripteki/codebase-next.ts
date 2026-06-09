import { readFileSync, } from "fs";
import { resolve, } from "path";

import { getLocaleFromRequest, } from "./locale";

export {
    DEFAULT_LOCALE,
    getClientLocale,
    getLocaleFromRequest,
    LOCALE_COOKIE_KEY,
    resolveLocale,
    setLocaleCookie,
    SUPPORTED_LOCALES,
    type AppLocale,
} from "./locale";

type TranslationObject = Record<string, any>;

const translationsCache: Record<string, TranslationObject> = {};

const getTranslationFile = (
    locale: string,
    namespace: string
): TranslationObject =>
{
    const cacheKey = `${locale}:${namespace}`;

    if (translationsCache[cacheKey])
    {
        return translationsCache[cacheKey];
    }

    try
    {
        const filePath = resolve (process.cwd (), "src/langs", locale, `${namespace}.json`);
        const fileContent = readFileSync (filePath, "utf-8");
        const translations = JSON.parse (fileContent);

        translationsCache[cacheKey] = translations;

        return translations;
    }
    catch (error)
    {
        console.error (`Failed to load translation file: ${locale}/${namespace}.json`, error);
        return {};
    }
};

export const getServerTranslation = (
    locale: string = "en",
    namespace: string = "common"
): ((key: string) => string) =>
{
    const translations = getTranslationFile (locale, namespace);

    return (key: string): string =>
    {
        const keys = key.split (".");
        let value: any = translations;

        for (const k of keys)
        {
            if (value && typeof value === "object" && k in value)
            {
                value = value[k];
            }
            else
            {
                return key;
            }
        }

        return typeof value === "string" ? value : key;
    };
};
