import { GetServerSideProps, } from "next";
import { ReactElement, useEffect, useState, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import NotificationItemPreview from "@/components/admin/notification-item-preview";
import AdminConfirmModal from "@/components/admin/admin-confirm-modal";
import AdminPagination from "@/components/admin/admin-pagination";
import AdminDetailSkeleton from "@/components/admin/admin-detail-skeleton";
import AdminPageHeader from "@/components/admin/admin-page-header";
import AdminSidebar from "@/components/admin/admin-sidebar";
import HeaderLayout from "@/layouts/header.layout";
import FooterLayout from "@/layouts/footer.layout";
import FbButton from "@/components/flowbite/fb-button";
import { adminSegmentTabClass, } from "@/libs/admin-tabs";
import { fbCard, fbInput, fbMuted, fbPage, fbSurfacePanel, } from "@/libs/flowbite-classes";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import {
    type NotificationStatusFilter,
    useNotifications,
} from "@/hooks/use-notifications";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/notifications";
import { formatPageTitle, } from "@/libs/page-title";
import {
    notificationIsUnread,
    notificationTargetUrl,
} from "@/libs/notification-presenter";
import { cn, } from "@/libs/utils";

function notificationTabIcon (tab: "all" | "unread" | "read"): string
{
    if (tab === "unread")
    {
        return "M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3Z";
    }

    if (tab === "read")
    {
        return "M5 13l4 4L19 7";
    }

    return "M4 6h16M4 12h16M4 18h16";
}

const NotificationsPage = (): ReactElement | null => {
    const canRender = useRequireAuth ();
    const { t, } = useTranslation ("common");
    const {
        items,
        meta,
        unread,
        isLoading,
        fetchList,
        refresh,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        deleteAll,
        actionId,
    } = useNotifications ();
    const { can, } = useAdminAccess ();

    const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
    const [currentPage, setCurrentPage] = useState (1);
    const [confirmKind, setConfirmKind] = useState<"" | "one" | "all" | "read"> ("");
    const [confirmId, setConfirmId] = useState ("");

    const statusFilter: NotificationStatusFilter =
        activeTab === "unread" ? "unread" : activeTab === "read" ? "read" : "";

    useEffect (() => {
        void Promise.all ([
            fetchList ({
                current_page: currentPage,
                limit: 15,
                status: statusFilter,
            }),
            refresh (),
        ]);
    }, [activeTab, currentPage, fetchList, refresh, statusFilter]);

    useEffect (() => {
        const onRealtime = (): void => {
            void fetchList ({
                current_page: currentPage,
                limit: 15,
                status: statusFilter,
            });
        };

        window.addEventListener ("admin:notifications-refresh", onRealtime);

        return () => window.removeEventListener ("admin:notifications-refresh", onRealtime);
    }, [currentPage, fetchList, statusFilter]);

    const markOne = async (id: string): Promise<void> =>
    {
        const ok = await markAsRead (id);

        if (ok)
        {
            void fetchList ({
                current_page: currentPage,
                limit: 15,
                status: statusFilter,
            });
        }
    };

    const handleClick = async (id: string): Promise<void> => {
        const item = items.find ((entry) => entry.id === id);
        const targetUrl = item ? notificationTargetUrl (item) : null;

        await markAsRead (id);

        if (targetUrl?.startsWith ("http")) {
            window.open (targetUrl, "_blank");
        } else if (targetUrl) {
            window.location.href = targetUrl;
        }
    };

    if (! canRender)
    {
        return null;
    }

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("notifications"))}</title>
            </Head>

            <div className={`${fbPage} lg:pl-64`}>
                <AdminSidebar />
                <HeaderLayout showLogout={true} />

                <main id="admin-main-content" className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6 lg:px-6">
                    <div className="space-y-6">
                        <AdminPageHeader
                            title={t ("notifications")}
                            description={t ("notifications_description")}
                            actions={(
                                <>
                                    {unread > 0 ? (
                                        <FbButton size="sm" disabled={isLoading} onClick={() => setConfirmKind ("read")}>
                                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                            </svg>
                                            {t ("mark_all_read")}
                                        </FbButton>
                                    ) : null}
                                    {can ("notification.delete") && items.length ? (
                                        <FbButton variant="tertiary" size="sm" disabled={isLoading} onClick={() => setConfirmKind ("all")}>
                                            <svg className="h-3.5 w-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                            </svg>
                                            {t ("delete_all")}
                                        </FbButton>
                                    ) : null}
                                </>
                            )}
                        />

                        <div className={cn (fbSurfacePanel, "shadow")}>
                            <div className="border-b border-gray-200 p-4 sm:p-5 dark:border-gray-700">
                                <div className="sm:hidden">
                                    <label className="sr-only" htmlFor="notification-tabs">{t ("notifications")}</label>
                                    <select
                                        id="notification-tabs"
                                        className={fbInput}
                                        value={activeTab}
                                        onChange={(event) =>
                                        {
                                            const value = event.target.value;

                                            if (value === "all" || value === "unread" || value === "read")
                                            {
                                                setActiveTab (value);
                                                setCurrentPage (1);
                                            }
                                        }}
                                    >
                                        <option value="all">{t ("all")}</option>
                                        <option value="unread">{t ("notifications_tab_new")}</option>
                                        <option value="read">{t ("read")}</option>
                                    </select>
                                </div>
                                <ul
                                    className="hidden text-center text-sm font-medium text-gray-500 sm:flex sm:-space-x-px dark:text-gray-400"
                                    role="tablist"
                                    aria-label={t ("notifications")}
                                >
                                    {([
                                        ["all", "all", "rounded-l-lg"],
                                        ["unread", "notifications_tab_new", ""],
                                        ["read", "read", "rounded-r-lg"],
                                    ] as const).map (([tab, label, edge]) => (
                                        <li key={tab} className="w-full" role="presentation">
                                            <button
                                                type="button"
                                                role="tab"
                                                aria-selected={activeTab === tab}
                                                className={cn (adminSegmentTabClass (activeTab === tab), edge)}
                                                onClick={() =>
                                                {
                                                    setActiveTab (tab);
                                                    setCurrentPage (1);
                                                }}
                                            >
                                                <svg className="h-4 w-4 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d={notificationTabIcon (tab)} />
                                                </svg>
                                                {t (label)}
                                            </button>
                                        </li>
                                    ))}
                                </ul>
                            </div>
                            <div className="p-3 sm:p-4" role="tabpanel">
                                {isLoading ? (
                                    <AdminDetailSkeleton fields={4} />
                                ) : items.length === 0 ? (
                                    <div className={cn (fbCard, "p-12 text-center")}>
                                        <svg className="mx-auto h-12 w-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 17h5l-1.405-1.405A1.932 1.932 0 0118 14.158V11a6.002 6.002 0 00-4-5.659V5a2 2 0 10-4 0v.341C7.67 6.165 6 8.388 6 11v3.159c0 .538-.214 1.055-.595 1.436L4 17h5m6 0v1a3 3 0 11-6 0v-1m6 0H9" />
                                        </svg>
                                        <p className={cn ("mt-4 text-sm", fbMuted)}>{t ("no_notifications")}</p>
                                    </div>
                                ) : (
                                    <div className="space-y-4">
                                        {items.map ((item) => (
                                            <div
                                                key={item.id}
                                                className={cn (
                                                    "relative rounded-lg border p-3 shadow-sm sm:p-4",
                                                    notificationIsUnread (item)
                                                        ? "surface-brand-soft"
                                                        : "border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800"
                                                )}
                                            >
                                                {notificationIsUnread (item) ? (
                                                    <span className="notification-dot pointer-events-none absolute end-3 top-3 h-2 w-2 rounded-full sm:end-4 sm:top-4" aria-hidden="true" />
                                                ) : null}
                                                <div className={cn ("flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between", notificationIsUnread (item) && "pe-4")}>
                                                    <div
                                                        role="button"
                                                        tabIndex={0}
                                                        className="min-w-0 flex-1 cursor-pointer text-left"
                                                        onClick={() => void handleClick (item.id)}
                                                        onKeyDown={(event) => {
                                                            if (event.key === "Enter") {
                                                                void handleClick (item.id);
                                                            }
                                                        }}
                                                    >
                                                        <NotificationItemPreview item={item} compact={false} />
                                                    </div>
                                                    <div className="flex shrink-0 items-center gap-3">
                                                        {notificationIsUnread (item) ? (
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center gap-1 text-sm text-blue-600 hover:underline dark:text-blue-400"
                                                                disabled={actionId === item.id}
                                                                onClick={() => void markOne (item.id)}
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                                                </svg>
                                                                {t ("mark_as_read")}
                                                            </button>
                                                        ) : null}
                                                        {can ("notification.delete") ? (
                                                            <button
                                                                type="button"
                                                                className="inline-flex items-center gap-1 text-sm text-red-600 hover:underline dark:text-red-400"
                                                                disabled={actionId === item.id}
                                                                onClick={() =>
                                                                {
                                                                    setConfirmId (item.id);
                                                                    setConfirmKind ("one");
                                                                }}
                                                            >
                                                                <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                                </svg>
                                                                {t ("delete")}
                                                            </button>
                                                        ) : null}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>

                        {! isLoading && items.length ? (
                            <div className={fbSurfacePanel}>
                                <AdminPagination
                                    meta={meta}
                                    page={currentPage}
                                    onChange={setCurrentPage}
                                />
                            </div>
                        ) : null}
                    </div>
                </main>

                <FooterLayout />
                <AdminConfirmModal
                    open={confirmKind !== ""}
                    titleId="notifications-confirm-title"
                    title={t ("confirm")}
                    message={confirmKind === "read" ? t ("confirm_mark_all_read") : confirmKind === "all" ? t ("confirm_delete_all") : t ("confirm_delete")}
                    confirmLabel={confirmKind === "read" ? t ("mark_all_read") : t ("delete")}
                    danger={confirmKind !== "read"}
                    onClose={() => setConfirmKind ("")}
                    onConfirm={() =>
                    {
                        const kind = confirmKind;
                        const id = confirmId;

                        setConfirmKind ("");

                        if (kind === "read")
                        {
                            void markAllAsRead ().then (() =>
                            {
                                void fetchList ({ current_page: currentPage, limit: 15, status: statusFilter, });
                            });

                            return;
                        }

                        if (kind === "all")
                        {
                            void deleteAll ().then ((ok) =>
                            {
                                if (ok)
                                {
                                    void fetchList ({ current_page: currentPage, limit: 15, status: statusFilter, });
                                }
                            });

                            return;
                        }

                        void deleteNotification (id).then ((ok) =>
                        {
                            if (ok)
                            {
                                void fetchList ({ current_page: currentPage, limit: 15, status: statusFilter, });
                            }
                        });
                    }}
                />
            </div>
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "Notifications",
    namespaces: ["common", "auth"],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ...pageOptions,
    pageAuth,
});

export default NotificationsPage;
