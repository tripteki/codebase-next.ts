import { ReactElement, } from "react";
import Link from "next/link";
import { getSession, signOut, useSession, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import AppLogo from "@/components/app-logo";
import HeaderProfileLink from "@/components/header-profile-link";
import NotificationDropdown from "@/components/admin/notification-dropdown";
import { Button, } from "@/components/ui/button";
import ThemeToggle from "@/components/theme-toggle";
import I18nSwitcher from "@/components/i18n-switcher";
import { hasValidSession, } from "@/libs/auth-session";
import { unsubscribeWebPush, } from "@/libs/webpush-session";
import { LogIn, LogOut, } from "lucide-react";

interface HeaderLayoutProps
{
    showLogout?: boolean;
};

const HeaderLayout = ({
    showLogout = false,
}: HeaderLayoutProps): ReactElement =>
{
    const { t: tCommon, } = useTranslation ("common");
    const { t: tAuth, } = useTranslation ("auth");
    const { data: session, status, } = useSession ();
    const isLoading = status === "loading";
    const isAuthenticated = status === "authenticated" && hasValidSession (session);

    const showAccountNav = showLogout && isAuthenticated;
    const homeHref = isAuthenticated ? "/admin/dashboard" : "/";

    const handleLogout = (): void =>
    {
        void getSession ().then ((session) =>
        {
            const accessToken = (session as any)?.accessToken ?? (session as any)?.jwt;

            void unsubscribeWebPush (accessToken);
        });

        void (async () =>
        {
            try
            {
                await fetch ("/api/auth/logout", { method: "POST", });
            }
            catch
            {
                //
            }

            try
            {
                await signOut ({ redirect: false, });
            }
            catch
            {
                //
            }

            window.location.assign ("/admin/auth/login?signedOut=1");
        }) ();
    };

    return (
        <header className="border-b">
            <div className="container mx-auto px-4 py-4 flex justify-between items-center">
                <div className="flex items-center gap-4">
                    <Link
                        href={homeHref}
                        className="flex items-center hover:opacity-80"
                    >
                        <AppLogo />
                        <span className="sr-only">{tCommon ("welcome")}</span>
                    </Link>
                </div>

                <div className="flex items-center gap-4">
                    <I18nSwitcher />
                    <ThemeToggle />
                    {showAccountNav && <NotificationDropdown />}
                    {showAccountNav && <HeaderProfileLink />}
                    {isAuthenticated && (
                        <Button
                            type="button"
                            variant="ghost"
                            size="icon"
                            data-test="logout-button"
                            aria-label={tAuth ("logout")}
                            onClick={handleLogout}
                        >
                            <LogOut className="h-5 w-5" />
                        </Button>
                    )}
                    {! isAuthenticated && ! isLoading && (
                        <Button variant="ghost" size="icon" asChild>
                            <Link
                                href="/admin/auth/login"
                                aria-label={tAuth ("log_in")}
                            >
                                <LogIn className="h-5 w-5" />
                            </Link>
                        </Button>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderLayout;
