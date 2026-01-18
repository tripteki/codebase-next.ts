import { ReactElement, type ChangeEvent, useEffect, useState, } from "react";
import { useRouter, } from "next/router";

import { type LocaleType, useLocale, } from "@/hooks/i18n";

const I18nSwitcher = (): ReactElement =>
{
    const router = useRouter ();
    const { availableLocales, currentLocale, setCurrentLocale, }: LocaleType = useLocale ();
    const [ mounted, setMounted, ] = useState<boolean> (false);

    useEffect ((): void =>
    {
        setMounted (true);
    }, []);

    const handleChange = (e: ChangeEvent<HTMLSelectElement>): void =>
    {
        setCurrentLocale (e.target.value);
    };

    if (! mounted)
    {
        return (
            <select
                className="px-3 py-2 rounded-md border border-input bg-background text-sm focus:outline-none focus:ring-2 focus:ring-ring"
                disabled
            >
                <option value={router.locale || "en"}>
                    {(router.locale || "en").toUpperCase ()}
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
            {(availableLocales as string[])?.map ((langOption: string) => (
                <option key={`lang-${langOption}`} value={langOption}>
                    {langOption.toUpperCase ()}
                </option>
            ))}
        </select>
    );
};

export default I18nSwitcher;
