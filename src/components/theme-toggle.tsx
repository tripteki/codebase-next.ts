import { type ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { useTheme, } from "@/hooks/theme";
import { cn, } from "@/libs/utils";

const ThemeToggle = ({
    id,
    className,
    onDark = false,
}: {
    id?: string;
    className?: string;
    onDark?: boolean;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");
    const { theme, toggleTheme, } = useTheme ();

    return (
        <button
            id={id}
            type="button"
            className={cn (
                "inline-flex h-9 w-9 items-center justify-center rounded-lg transition-colors focus:outline-none focus:ring-2",
                onDark
                    ? "text-white/88 hover:bg-white/10 hover:text-white focus:ring-white/25"
                    : "p-2 text-gray-500 hover:bg-gray-100 hover:text-gray-900 focus:ring-gray-100 dark:text-gray-400 dark:hover:bg-gray-700 dark:hover:text-white dark:focus:ring-gray-700",
                className
            )}
            aria-label={t ("toggle_theme")}
            onClick={toggleTheme}
        >
            {theme === "dark" ? (
                <svg className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <circle cx="12" cy="12" r="4" />
                    <path d="M12 2v2M12 20v2M4.93 4.93l1.41 1.41M17.66 17.66l1.41 1.41M2 12h2M20 12h2M6.34 17.66l-1.41 1.41M19.07 4.93l-1.41 1.41" />
                </svg>
            ) : (
                <svg className="h-5 w-5 shrink-0" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                    <path d="M21.752 15.002A9.718 9.718 0 0 1 18 15.75c-5.385 0-9.75-4.365-9.75-9.75 0-1.33.266-2.597.748-3.752A9.753 9.753 0 0 0 3 11.25C3 16.635 7.365 21 12.75 21a9.753 9.753 0 0 0 9.002-5.998z" />
                </svg>
            )}
        </button>
    );
};

export default ThemeToggle;
