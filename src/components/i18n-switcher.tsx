import { ReactElement, } from "react";

import { Button, } from "@/components/ui/button";
import { type AppLocale, } from "@/libs/i18n/locale";
import { LOCALE_FLAGS, LOCALE_LABELS, } from "@/libs/i18n/locale-flags";
import { type LocaleType, useLocale, } from "@/hooks/i18n";
import { cn, } from "@/libs/utils";

const I18nSwitcher = (): ReactElement =>
{
    const { availableLocales, currentLocale, setCurrentLocale, }: LocaleType = useLocale ();

    return (
        <div
            className="flex items-center gap-0.5 rounded-md border border-input bg-background p-0.5"
            role="group"
        >
            {availableLocales.map ((langOption: AppLocale) =>
            {
                const isActive = currentLocale === langOption;

                return (
                    <Button
                        key={`lang-${langOption}`}
                        type="button"
                        variant={isActive ? "secondary" : "ghost"}
                        size="icon"
                        className={cn (
                            "h-8 w-8 text-base leading-none",
                            ! isActive && "opacity-70 hover:opacity-100"
                        )}
                        aria-label={LOCALE_LABELS[langOption]}
                        aria-pressed={isActive}
                        onClick={(): void => setCurrentLocale (langOption)}
                    >
                        <span aria-hidden="true">{LOCALE_FLAGS[langOption]}</span>
                    </Button>
                );
            })}
        </div>
    );
};

export default I18nSwitcher;
