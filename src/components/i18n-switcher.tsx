import { ReactElement, type ChangeEvent, } from "react";

import { type AppLocale, } from "@/libs/i18n/locale";
import { type LocaleType, useLocale, } from "@/hooks/i18n";

const I18nSwitcher = (): ReactElement =>
{
    const { availableLocales, currentLocale, setCurrentLocale, }: LocaleType = useLocale ();

    const handleChange = (e: ChangeEvent<HTMLSelectElement>): void =>
    {
        setCurrentLocale (e.target.value as AppLocale);
    };

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
