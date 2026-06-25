import { ReactElement, } from "react";
import Link from "next/link";
import { getSession, signOut, useSession, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import AppLogo from "@/components/app-logo";
import HeaderProfileLink from "@/components/header-profile-link";
import NotificationDropdown from "@/components/admin/notification-dropdown";
import FbButton from "@/components/flowbite/fb-button";
import ThemeToggle from "@/components/theme-toggle";
import I18nSwitcher from "@/components/i18n-switcher";
import { hasValidSession, } from "@/libs/auth-session";
import { unsubscribeWebPush, } from "@/libs/webpush-session";

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
        <header className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
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
                        <FbButton
                            type="button"
                            variant="ghost"
                            size="icon"
                            data-test="logout-button"
                            aria-label={tAuth ("logout")}
                            onClick={handleLogout}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4" />
                                <polyline points="16 17 21 12 16 7" />
                                <line x1="21" x2="9" y1="12" y2="12" />
                            </svg>
                        </FbButton>
                    )}
                    {! isAuthenticated && ! isLoading && (
                        <FbButton
                            variant="ghost"
                            size="icon"
                            href="/admin/auth/login"
                            aria-label={tAuth ("log_in")}
                        >
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                className="h-5 w-5"
                            >
                                <path d="M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4" />
                                <polyline points="10 17 15 12 10 7" />
                                <line x1="15" x2="3" y1="12" y2="12" />
                            </svg>
                        </FbButton>
                    )}
                </div>
            </div>
        </header>
    );
};

export default HeaderLayout;
