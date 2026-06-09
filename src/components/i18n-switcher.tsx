import { ReactElement, type ChangeEvent, useEffect, useState, } from "react";

import {
    DEFAULT_LOCALE,
    getClientLocale,
    type AppLocale,
} from "@/libs/i18n/locale";
import { type LocaleType, useLocale, } from "@/hooks/i18n";

const I18nSwitcher = (): ReactElement =>
{
    const { availableLocales, currentLocale, setCurrentLocale, }: LocaleType = useLocale ();
    const [ mounted, setMounted, ] = useState<boolean> (false);
    const [ displayLocale, setDisplayLocale, ] = useState<AppLocale> (DEFAULT_LOCALE);

    useEffect ((): void =>
    {
        setMounted (true);
        setDisplayLocale (getClientLocale ());
    }, []);

    useEffect ((): void =>
    {
        if (mounted)
        {
            setDisplayLocale (currentLocale);
        }
    }, [ currentLocale, mounted, ]);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>): void =>
    {
        setCurrentLocale (e.target.value as AppLocale);
    };

    if (! mounted)
    {
        return (
            <select
                className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                disabled
            >
                <option value={displayLocale}>
                    {displayLocale.toUpperCase ()}
                </option>
            </select>
        );
    }

    return (
        <select
            onChange={handleChange}
            value={currentLocale}
            className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
            {availableLocales.map ((langOption: AppLocale) => (
                <option key={`lang-${langOption}`} value={langOption}>
                    {langOption.toUpperCase ()}
                </option>
            ))}
        </select>
    );
};

export default I18nSwitcher;
