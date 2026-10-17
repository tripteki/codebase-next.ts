import { type ReactElement, useEffect, useRef, useState, } from "react";

import I18nFlag from "@/components/i18n-flag";
import { type LocaleType, useLocale, } from "@/hooks/i18n";
import { type AppLocale, } from "@/libs/i18n/locale";
import { LOCALE_SWITCHER_LABELS, } from "@/libs/i18n/locale-flags";
import { cn, } from "@/libs/utils";

const I18nSwitcher = ({
    onDark = false,
    menuPosition = "bottom",
    menuAlign = "end",
}: {
    onDark?: boolean;
    menuPosition?: "top" | "bottom";
    menuAlign?: "start" | "end" | "center";
}): ReactElement =>
{
    const { availableLocales, currentLocale, setCurrentLocale, }: LocaleType = useLocale ();
    const [open, setOpen,] = useState (false);
    const rootRef = useRef<HTMLDivElement | null> (null);

    useEffect (() =>
    {
        function handleDocumentClick (event: MouseEvent): void
        {
            if (! rootRef.current?.contains (event.target as Node))
            {
                setOpen (false);
            }
        }

        document.addEventListener ("click", handleDocumentClick);

        return () =>
        {
            document.removeEventListener ("click", handleDocumentClick);
        };
    }, []);

    function localeLabel (locale: string): string
    {
        return LOCALE_SWITCHER_LABELS[locale as AppLocale] ?? locale.toUpperCase ();
    }

    function selectLocale (locale: AppLocale): void
    {
        setCurrentLocale (locale);
        setOpen (false);
    }

    return (
        <div ref={rootRef} className="relative">
            <button
                type="button"
                className={cn (
                    "i18n-trigger inline-flex items-center gap-2 rounded-full border-0 bg-transparent px-3 py-2 text-sm font-medium shadow-none transition-all focus:outline-none focus:ring-2",
                    onDark
                        ? "text-white/80 hover:bg-white/10 hover:text-white focus:ring-white/25"
                        : "text-gray-600 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-200 dark:text-gray-300 dark:hover:bg-gray-700/80 dark:hover:text-white dark:focus:ring-gray-600"
                )}
                aria-expanded={open}
                aria-label={localeLabel (currentLocale)}
                onClick={(event) =>
                {
                    event.stopPropagation ();
                    setOpen ((value) => ! value);
                }}
            >
                <I18nFlag locale={currentLocale} />
                <span className="i18n-trigger__code uppercase">{currentLocale}</span>
                <svg
                    className={cn ("i18n-trigger__chevron h-3 w-3 transition-transform", open && "rotate-180")}
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                    xmlns="http://www.w3.org/2000/svg"
                    aria-hidden="true"
                >
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 9l-7 7-7-7" />
                </svg>
            </button>
            {open ? (
                <div
                    className={cn (
                        "absolute z-[60] min-w-[11rem] w-max overflow-hidden rounded-xl border border-gray-200 bg-white shadow-xl dark:border-gray-600 dark:bg-gray-800",
                        menuAlign === "start"
                            ? "start-0"
                            : menuAlign === "center"
                                ? "left-1/2 -translate-x-1/2"
                                : "end-0 -translate-x-2",
                        menuPosition === "top" ? "bottom-full mb-2" : "top-full mt-2"
                    )}
                    role="menu"
                    onClick={(event) => event.stopPropagation ()}
                >
                    {availableLocales.map ((langOption) => (
                        <button
                            key={`lang-${langOption}`}
                            type="button"
                            role="menuitem"
                            className={cn (
                                "flex w-full items-center gap-2.5 px-4 py-2.5 text-sm transition-colors",
                                langOption === currentLocale
                                    ? "bg-gray-50 text-gray-900 dark:bg-gray-700/60 dark:text-white"
                                    : "text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700/40"
                            )}
                            onClick={() => selectLocale (langOption)}
                        >
                            <I18nFlag locale={langOption} />
                            <span className="whitespace-nowrap text-start">{localeLabel (langOption)}</span>
                            {langOption === currentLocale ? (
                                <svg className="h-4 w-4 shrink-0 text-[var(--brand-primary)]" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                </svg>
                            ) : null}
                        </button>
                    ))}
                </div>
            ) : null}
        </div>
    );
};

export default I18nSwitcher;
