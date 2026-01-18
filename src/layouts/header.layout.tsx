import { ReactElement, } from "react";
import { useRouter, } from "next/router";
import { signOut, } from "next-auth/react";
import { useTranslation, } from "next-i18next";

import { Button, } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import I18nSwitcher from "@/components/i18n-switcher";

interface HeaderLayoutProps
{
    showLogout?: boolean;
};

const HeaderLayout = ({
    showLogout = false,
}: HeaderLayoutProps): ReactElement =>
{
    const router = useRouter ();
    const { t: tCommon, } = useTranslation ("common");
    const { t: tAuth, } = useTranslation ("auth");

    const handleLogout = async (): Promise<void> =>
    {
        try
        {
            await signOut ({
                redirect: true,
                callbackUrl: "/admin/auth/login",
            });
        }
        catch (error)
        {
            console.error ("Logout error:", error);
        }
    };

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <h1 className="text-xl font-bold">{tCommon ("welcome")}</h1>

                <div className="flex items-center gap-4">
                    <ThemeToggle />
                    <I18nSwitcher />
                    {showLogout && (
                        <Button
                            variant="outline"
                            onClick={handleLogout}
                        >
                            {tAuth ("logout")}
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderLayout;
