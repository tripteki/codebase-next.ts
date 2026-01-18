import { useEffect, useState, } from "react";

export function useTheme (): {
    theme: string;
    setTheme: (theme: string) => void;
    toggleTheme: () => void;
    mounted: boolean;
}
{
    const [ theme, setThemeState, ] = useState<string> ("light");
    const [ mounted, setMounted, ] = useState<boolean> (false);

    useEffect ((): void =>
    {
        setMounted (true);
        const storedTheme = localStorage.getItem ("theme");
        if (storedTheme)
        {
            setThemeState (storedTheme);
        }
        else
        {
            setThemeState (window.matchMedia ("(prefers-color-scheme: dark)").matches ? "dark" : "light");
        }
    }, []);

    useEffect ((): void =>
    {
        if (! mounted)
        {
            return;
        }
        const root = window.document.documentElement;

        root.classList.remove ("light", "dark");

        if (theme === "dark")
        {
            root.classList.add ("dark");
        }
        else
        {
            root.classList.add ("light");
        }

        localStorage.setItem ("theme", theme);
    }, [ theme, mounted, ]);

    const setTheme = (newTheme: string): void =>
    {
        setThemeState (newTheme);
    };

    const toggleTheme = (): void =>
    {
        setThemeState ((prev) => prev === "dark" ? "light" : "dark");
    };

    return { theme, setTheme, toggleTheme, mounted, };
};
