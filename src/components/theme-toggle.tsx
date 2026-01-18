import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next";
import { Moon, Sun, } from "lucide-react";

import { Button, } from "@/components/ui/button";
import { useTheme, } from "@/hooks/theme";

const ThemeToggle = (): ReactElement =>
{
    const { t, } = useTranslation ("common");
    const { theme, toggleTheme, mounted, } = useTheme ();

    return (
        <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            aria-label={t ("toggle_theme")}
        >
            {mounted && theme === "dark"
                ? (
                    <Sun className="h-5 w-5" />
                )
                : (
                    <Moon className="h-5 w-5" />
                )}
        </Button>
    );
};

export default ThemeToggle;
