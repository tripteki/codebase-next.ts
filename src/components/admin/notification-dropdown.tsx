import { ReactElement, useEffect, useState, } from "react";
import Link from "next/link";
import { useTranslation, } from "next-i18next/pages";

import FbSkeleton from "@/components/flowbite/fb-skeleton";
import NotificationItemPreview from "@/components/admin/notification-item-preview";
import {
    type NotificationStatusFilter,
    useNotifications,
} from "@/hooks/use-notifications";
import {
    notificationIsUnread,
    notificationTargetUrl,
} from "@/libs/notification-presenter";
import { cn, } from "@/libs/utils";

const NotificationDropdown = (): ReactElement => {
    const { t, } = useTranslation ("common");
    const { unread, items, fetchRecent, markAsRead, markAllAsRead, refresh, } =
        useNotifications ();
    const [open, setOpen] = useState (false);
    const [dropdownLoading, setDropdownLoading] = useState (false);
    const [activeTab, setActiveTab] = useState<"all" | "unread" | "read"> ("all");

    const statusFilter: NotificationStatusFilter =
        activeTab === "unread" ? "unread" : activeTab === "read" ? "read" : "";

    const loadDropdownItems = async (): Promise<void> => {
        setDropdownLoading (true);

        try {
            await Promise.all ([refresh (), fetchRecent (10, statusFilter)]);
        } finally {
            setDropdownLoading (false);
        }
    };

    useEffect (() => {
        if (open) {
            void loadDropdownItems ();
        }
    }, [activeTab, open]);

    const toggle = async (): Promise<void> => {
        const nextOpen = ! open;
        setOpen (nextOpen);

        if (nextOpen) {
            await loadDropdownItems ();
        }
    };

    const handleNotificationClick = async (id: string): Promise<void> => {
        const item = items.find ((entry) => entry.id === id);
        const targetUrl = item ? notificationTargetUrl (item) : null;

        await markAsRead (id);
        setOpen (false);

        if (targetUrl?.startsWith ("http")) {
            window.open (targetUrl, "_blank");
        } else if (targetUrl) {
            window.location.href = targetUrl;
        }
    };

    const tabClass = (tab: "all" | "unread" | "read"): string =>
        cn (
            "inline-flex flex-1 cursor-pointer items-center justify-center gap-1 rounded-full px-3 py-1.5 text-xs font-medium leading-none transition-colors",
            activeTab === tab
                ? "nav-pill-brand-active"
                : "nav-pill-brand-inactive text-gray-600 dark:text-gray-400"
        );

    const tabLabel = (tab: "all" | "unread" | "read"): string => {
        if (tab === "unread") {
            return t ("notifications_tab_new");
        }

        return t (tab);
    };

    return (
        <div className="relative">
            <button
                type="button"
                className="relative inline-flex h-9 w-9 items-center justify-center rounded-lg text-gray-500 transition-colors hover:bg-gray-100 hover:text-gray-900 focus:outline-none focus:ring-2 focus:ring-gray-200 dark:text-gray-400 dark:hover:bg-gray-800 dark:hover:text-white dark:focus:ring-gray-700"
                aria-expanded={open}
                aria-label={t ("notifications")}
                onClick={(event) => {
                    event.stopPropagation ();
                    void toggle ();
                }}
            >
                {unread > 0 ? (
                    <svg className="notification-bell-icon" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 24 24">
                        <path d="M17.133 12.632v-1.8a5.406 5.406 0 0 0-4.154-5.262.955.955 0 0 0 .021-.106V3.1a1 1 0 0 0-2 0v2.364a.955.955 0 0 0 .021.106 5.406 5.406 0 0 0-4.154 5.262v1.8C6.867 15.018 5 15.614 5 16.807 5 17.4 5 18 5.538 18h12.924C19 18 19 17.4 19 16.807c0-1.193-1.867-1.789-1.867-4.175ZM6 6a1 1 0 0 1-.707-.293l-1-1a1 1 0 0 1 1.414-1.414l1 1A1 1 0 0 1 6 6Zm-2 4H3a1 1 0 0 1 0-2h1a1 1 0 1 1 0 2Zm14-4a1 1 0 0 1-.707-1.707l1-1a1 1 0 1 1 1.414 1.414l-1 1A1 1 0 0 1 18 6Zm3 4h-1a1 1 0 1 1 0-2h1a1 1 0 1 1 0 2ZM8.823 19a3.453 3.453 0 0 0 6.354 0H8.823Z" />
                    </svg>
                ) : (
                    <svg className="notification-bell-outline" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 5.365V3m0 2.365a5.338 5.338 0 0 1 5.133 5.368v1.8c0 2.386 1.867 2.982 1.867 4.175 0 .593 0 1.292-.538 1.292H5.538C5 18 5 17.301 5 16.708c0-1.193 1.867-1.789 1.867-4.175v-1.8A5.338 5.338 0 0 1 12 5.365ZM8.733 18c.094.852.306 1.54.944 2.112a3.48 3.48 0 0 0 4.646 0c.638-.572 1.236-1.26 1.33-2.112h-6.92Z" />
                    </svg>
                )}
                {unread > 0 ? (
                    <span className="notification-dot absolute end-1 top-1 h-2.5 w-2.5 translate-x-[35%] -translate-y-[35%] rounded-full shadow-[0_0_0_2px_white] dark:shadow-[0_0_0_2px_#1f2937]" aria-hidden="true" />
                ) : null}
            </button>

            {open ? (
                <div className="z-50 flex max-h-[460px] flex-col rounded-[14px] border border-gray-200 bg-white text-sm shadow-lg max-lg:fixed max-lg:left-1/2 max-lg:top-[3.5rem] max-lg:w-[calc(100vw-1.5rem)] max-lg:min-w-0 max-lg:max-w-[360px] max-lg:-translate-x-1/2 lg:absolute lg:end-0 lg:top-12 lg:w-80 lg:min-w-[320px] lg:max-w-[360px] lg:translate-x-0 dark:border-gray-600 dark:bg-gray-800">
                    <div className="sticky top-0 z-10 shrink-0 rounded-t-[14px] border-b border-gray-200 bg-white px-2 py-2 dark:border-gray-600 dark:bg-gray-800">
                        <div className="flex items-center justify-between px-2 pb-2">
                            <span className="font-semibold text-gray-900 dark:text-white">{t ("notifications")}</span>
                            {unread > 0 ? (
                                <button
                                    type="button"
                                    className="link-brand-primary inline-flex cursor-pointer items-center gap-1 text-xs"
                                    onClick={() => void markAllAsRead ().then (loadDropdownItems)}
                                >
                                    <svg className="h-3.5 w-3.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
                                    </svg>
                                    {t ("mark_all_read")}
                                </button>
                            ) : null}
                        </div>
                        <div className="flex items-center gap-1.5 rounded-full border border-gray-200 bg-gray-50 p-1 dark:border-gray-600 dark:bg-gray-700" role="tablist" aria-label={t ("notifications")}>
                            {(["all", "unread", "read"] as const).map ((tab) => (
                                <button
                                    key={tab}
                                    type="button"
                                    role="tab"
                                    aria-selected={activeTab === tab}
                                    className={tabClass (tab)}
                                    onClick={() => setActiveTab (tab)}
                                >
                                    {tabLabel (tab)}
                                </button>
                            ))}
                        </div>
                    </div>
                    <div className="min-h-0 flex-1 overflow-y-auto py-1" role="tabpanel">
                        {dropdownLoading ? (
                            <div className="space-y-3 px-4 py-4">
                                {[0, 1, 2, 3].map ((row) => (
                                    <FbSkeleton key={row} className="h-10 w-full" />
                                ))}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-gray-500 dark:text-gray-400">
                                {t ("no_notifications")}
                            </div>
                        ) : (
                            items.map ((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={cn (
                                        "relative mx-1.5 mb-1 flex w-[calc(100%-0.75rem)] cursor-pointer items-start gap-3 rounded-lg px-3.5 py-2.5 text-start transition-colors",
                                        notificationIsUnread (item)
                                            ? "surface-brand-soft pe-5"
                                            : "hover:bg-gray-50 dark:hover:bg-gray-700/50"
                                    )}
                                    onClick={() => void handleNotificationClick (item.id)}
                                >
                                    {notificationIsUnread (item) ? (
                                        <span className="notification-dot pointer-events-none absolute end-2 top-2 h-2 w-2 rounded-full" aria-hidden="true" />
                                    ) : null}
                                    <NotificationItemPreview item={item} />
                                </button>
                            ))
                        )}
                    </div>
                    <div className="sticky bottom-0 z-10 shrink-0 rounded-b-[14px] border-t border-gray-200 bg-white pb-2 pt-1 text-center dark:border-gray-600 dark:bg-gray-800">
                        <Link
                            href="/notifications"
                            className="inline-flex items-center justify-center rounded-full border border-gray-300 bg-white px-3 py-1.5 text-xs font-medium text-gray-700 transition-colors hover:bg-gray-50 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                            onClick={() => setOpen (false)}
                        >
                            {t ("view_all_notifications")}
                        </Link>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default NotificationDropdown;
