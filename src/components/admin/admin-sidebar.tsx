import { type ReactElement, useEffect, useState, } from "react";
import Link from "next/link";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminSearchBox from "@/components/admin/admin-search-box";
import AdminSidebarIcon from "@/components/admin/admin-sidebar-icon";
import AppLogo from "@/components/app-logo";
import I18nSwitcher from "@/components/i18n-switcher";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import { useAdminSidebar, } from "@/hooks/use-admin-sidebar";
import {
    ADMIN_NAVIGATION_GROUPS,
    ADMIN_TOP_NAVIGATION,
} from "@/libs/admin-navigation";
import { formatAppName, } from "@/libs/app-name";
import { publicRuntimeConfig, } from "@/libs/runtime-config";
import { cn, } from "@/libs/utils";

const linkClass = "flex items-center rounded-full px-3 py-2 text-sm font-medium text-[#e9f0ff] transition-all hover:bg-white/10 hover:text-white";
const subLinkClass = "flex items-center gap-2 rounded-full px-3 py-1.5 text-sm font-medium text-white/80 transition-all hover:bg-white/10 hover:text-white";
const footerActionClass = "rounded-lg p-2.5 text-white/70 transition-colors hover:bg-white/10 hover:text-white";

const AdminSidebar = (): ReactElement =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const { can, } = useAdminAccess ();
    const { open, close, } = useAdminSidebar ();
    const [openSection, setOpenSection] = useState<string | null> (null);
    const year = new Date ().getFullYear ();
    const appName = formatAppName (publicRuntimeConfig.appName);
    const groups = ADMIN_NAVIGATION_GROUPS
        .map ((group) => ({
            ...group,
            items: group.items.filter ((item) => can (item.permission)),
        }))
        .filter ((group) => group.items.length > 0);

    function active (path: string): boolean
    {
        const current = router.asPath.split ("?")[0];

        if (path === "/admin/dashboard")
        {
            return current === path;
        }

        return current === path || current.startsWith (`${path}/`);
    }

    useEffect (() =>
    {
        const match = groups.find ((group) => group.items.some ((item) => active (item.to)));

        if (match)
        {
            setOpenSection (match.key);
        }
    }, [router.asPath, groups.map ((group) => group.key).join (",")]);

    function scrollToTop (): void
    {
        document.getElementById ("admin-main-content")?.scrollIntoView ({
            behavior: "smooth",
            block: "start",
        });
    }

    return (
        <>
            {open ? <div className="fixed inset-0 z-30 bg-gray-900/50 lg:hidden" onClick={close} /> : null}
            <aside id="admin-sidebar" className={`admin-sidebar-gradient fixed inset-y-0 left-0 z-40 flex h-svh w-64 flex-col rounded-r-[20px] text-white transition-transform ${open ? "translate-x-0" : "-translate-x-full lg:translate-x-0"}`}>
                <div className="relative flex h-16 shrink-0 flex-col items-center justify-center px-4 py-3">
                    <button
                        type="button"
                        className="absolute end-3 inline-flex h-8 w-8 items-center justify-center rounded-lg text-white/80 hover:bg-white/10 lg:hidden"
                        aria-label={t ("close")}
                        onClick={() => close ()}
                    >
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" d="M6 6l12 12M18 6 6 18" />
                        </svg>
                    </button>
                    <Link href="/admin/dashboard" className="inline-flex h-8 max-w-[10rem] items-center justify-center transition hover:opacity-90" aria-label={appName} onClick={() => close ()}>
                        <AppLogo className="h-8 brightness-0 invert" />
                    </Link>
                </div>
                <nav className="flex-1 space-y-1 overflow-y-auto px-3 py-4">
                    <div className="mb-4 lg:hidden">
                        <AdminSearchBox variant="sidebar" />
                    </div>
                    {ADMIN_TOP_NAVIGATION.map ((item) => (
                        <Link key={item.to} href={item.to} className={cn (linkClass, active (item.to) && "admin-sidebar-link-active text-white")} onClick={() => close ()}>
                            <AdminSidebarIcon name={item.key} className="me-3" />
                            <span className="truncate">{t (item.key)}</span>
                        </Link>
                    ))}
                    {groups.map ((group) => (
                        <section key={group.key}>
                            <button
                                type="button"
                                data-test="sidebar-group-toggle"
                                className={cn (
                                    "flex w-full items-center justify-between rounded-full px-3 py-2 text-left text-sm font-medium text-[#e9f0ff] hover:bg-white/10 hover:text-white",
                                    openSection === group.key && "bg-white/10 text-white"
                                )}
                                aria-expanded={openSection === group.key}
                                onClick={() => setOpenSection ((value) => value === group.key ? null : group.key)}
                            >
                                <span className="inline-flex items-center">
                                    <AdminSidebarIcon name={group.key} />
                                    <span className="truncate">{t (group.key)}</span>
                                </span>
                                <svg className={cn ("h-4 w-4 shrink-0 transition-transform", openSection === group.key ? "" : "rotate-90")} viewBox="0 0 10 6" fill="none" aria-hidden="true">
                                    <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 4 4 4-4" />
                                </svg>
                            </button>
                            {openSection === group.key ? (
                                <div className="mt-1 space-y-1 pl-10">
                                    {group.items.map ((item) => (
                                        <Link key={item.to} href={item.to} className={cn (subLinkClass, active (item.to) && "admin-sidebar-link-active text-white")} onClick={() => close ()}>
                                            <AdminSidebarIcon name={item.key} size="sm" />
                                            <span className="truncate">{t (item.key)}</span>
                                        </Link>
                                    ))}
                                </div>
                            ) : null}
                        </section>
                    ))}
                </nav>
                <div className="shrink-0 border-t border-white/10 px-4 py-4">
                    <div className="mb-3 flex items-center justify-center gap-1">
                        <Link href="/admin/settings/personal" className={footerActionClass} title={t ("settings")} aria-label={t ("settings")} onClick={() => close ()}>
                            <AdminSidebarIcon name="settings" />
                        </Link>
                        <button type="button" className={footerActionClass} title={t ("admin_sidebar_scroll_to_top")} aria-label={t ("admin_sidebar_scroll_to_top")} onClick={scrollToTop}>
                            <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                                <path fillRule="evenodd" d="M5 4a1 1 0 00-2 0v7.268a2 2 0 000 3.464V16a1 1 0 102 0v-1.268a2 2 0 000-3.464V4zM11 4a1 1 0 10-2 0v1.268a2 2 0 000 3.464V16a1 1 0 102 0V8.732a2 2 0 000-3.464V4zM16 3a1 1 0 011 1v7.268a2 2 0 010 3.464V16a1 1 0 11-2 0v-1.268a2 2 0 010-3.464V4a1 1 0 011-1z" clipRule="evenodd" />
                            </svg>
                        </button>
                        <I18nSwitcher onDark menuPosition="top" />
                    </div>
                    <p className="text-center text-xs text-white/80">© {year} {appName}</p>
                </div>
            </aside>
        </>
    );
};

export default AdminSidebar;
