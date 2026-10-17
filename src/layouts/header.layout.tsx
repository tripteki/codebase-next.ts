import { ReactElement, } from "react";
import Link from "next/link";
import { getSession, signOut, useSession, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import AdminAccountDropdown from "@/components/admin/admin-account-dropdown";
import AdminSearchBox from "@/components/admin/admin-search-box";
import AppLogo from "@/components/app-logo";
import NotificationDropdown from "@/components/admin/notification-dropdown";
import FbButton from "@/components/flowbite/fb-button";
import ThemeToggle from "@/components/theme-toggle";
import { useAdminSidebar, } from "@/hooks/use-admin-sidebar";
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
    const { open, toggleOpen, } = useAdminSidebar ();
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

            window.location.assign ("/auth/login?signedOut=1");
        }) ();
    };

    return (
        <header className={showLogout ? "relative z-10 px-4 py-4 lg:px-6" : "border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"}>
            <div className={showLogout ? "relative flex items-center justify-between gap-3 rounded-lg border border-gray-200 bg-white/80 p-2 shadow-sm backdrop-blur dark:border-gray-600 dark:bg-gray-700/80" : "container mx-auto flex items-center gap-4 px-4 py-4"}>
                <div className={showLogout ? "flex min-w-0 flex-1 items-center gap-2" : "contents"}>
                    {showLogout ? (
                        <button
                            type="button"
                            className="hidden h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:inline-flex dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
                            aria-label={tCommon ("admin_toggle_sidebar")}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.75" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                                <path d="m15 18-6-6 6-6" />
                            </svg>
                        </button>
                    ) : null}
                    {showLogout ? (
                        <button
                            type="button"
                            className="inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-gray-200 lg:hidden dark:text-gray-400 dark:hover:bg-gray-800 dark:focus:ring-gray-700"
                            aria-expanded={open}
                            aria-controls="admin-sidebar"
                            aria-label={tCommon ("menu")}
                            onClick={toggleOpen}
                        >
                            <svg className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                                <path strokeLinecap="round" d="M4 7h16M4 12h16M4 17h16" />
                            </svg>
                        </button>
                    ) : null}
                    <Link
                        href={homeHref}
                        className={showLogout ? "inline-flex h-8 shrink-0 items-center justify-center transition hover:opacity-90 lg:hidden" : "flex shrink-0 items-center hover:opacity-80"}
                    >
                        <AppLogo />
                        <span className="sr-only">{tCommon ("welcome")}</span>
                    </Link>
                    {isAuthenticated ? <AdminSearchBox variant="desktop" /> : null}
                </div>
                <div className={showLogout ? "flex shrink-0 items-center gap-2" : "ml-auto flex shrink-0 items-center gap-4"}>
                    {showAccountNav ? <NotificationDropdown /> : null}
                    <ThemeToggle />
                    {isAuthenticated ? <AdminAccountDropdown onLogout={handleLogout} /> : null}
                    {! isAuthenticated && ! isLoading && (
                        <FbButton
                            variant="ghost"
                            size="icon"
                            href="/auth/login"
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
