import { ReactElement, useEffect, useState, } from "react";
import Link from "next/link";
import { useTranslation, } from "next-i18next/pages";

import NotificationItemPreview from "@/components/admin/notification-item-preview";
import FbButton from "@/components/flowbite/fb-button";
import { fbLink, fbMuted, fbPopover, } from "@/libs/flowbite-classes";
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
    const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");

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
            "inline-flex flex-1 items-center justify-center rounded-full border px-3 py-1.5 text-xs font-medium transition-colors",
            activeTab === tab ? "tab-brand-active" : "tab-brand-inactive"
        );

    return (
        <div className="relative">
            <FbButton
                type="button"
                variant="ghost"
                size="icon"
                className="relative"
                aria-expanded={open}
                aria-label={t ("notifications")}
                onClick={() => void toggle ()}
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
                    <path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9" />
                    <path d="M10.3 21a1.94 1.94 0 0 0 3.4 0" />
                </svg>
                {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-600 px-1 text-[10px] font-bold text-white">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </FbButton>

            {open && (
                <div className={cn ("absolute right-0 z-50 mt-2 w-80", fbPopover)}>
                    <div className="flex items-center justify-between border-b border-gray-200 px-4 py-3 dark:border-gray-600">
                        <h3 className="text-sm font-semibold">{t ("notifications")}</h3>
                        {unread > 0 && (
                            <FbButton
                                variant="ghost"
                                size="sm"
                                className="h-auto px-2 py-1 text-xs"
                                onClick={() => void markAllAsRead ().then (loadDropdownItems)}
                            >
                                {t ("mark_all_read")}
                            </FbButton>
                        )}
                    </div>

                    <div className="flex gap-1 border-b border-gray-200 px-2 py-2 dark:border-gray-600">
                        {(["all", "unread", "read"] as const).map ((tab) => (
                            <button
                                key={tab}
                                type="button"
                                className={tabClass (tab)}
                                onClick={() => setActiveTab (tab)}
                            >
                                {t (tab === "all" ? "all" : tab)}
                            </button>
                        ))}
                    </div>

                    <div className="max-h-80 overflow-y-auto">
                        {dropdownLoading ? (
                            <div className={cn ("px-4 py-6 text-center text-xs", fbMuted)}>
                                {t ("loading")}
                            </div>
                        ) : items.length === 0 ? (
                            <div className={cn ("px-4 py-6 text-center text-xs", fbMuted)}>
                                {t ("no_notifications")}
                            </div>
                        ) : (
                            items.map ((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={cn (
                                        "flex w-full gap-3 border-b border-gray-200 px-4 py-3 text-left transition-colors hover:bg-gray-50 dark:border-gray-600 dark:hover:bg-gray-700/50",
                                        notificationIsUnread (item) && "bg-gray-50 dark:bg-gray-700/30"
                                    )}
                                    onClick={() => void handleNotificationClick (item.id)}
                                >
                                    <NotificationItemPreview item={item} />
                                </button>
                            ))
                        )}
                    </div>

                    <div className="border-t border-gray-200 px-4 py-2 dark:border-gray-600">
                        <Link
                            href="/notifications"
                            className={cn ("block text-center text-xs", fbLink)}
                            onClick={() => setOpen (false)}
                        >
                            {t ("view_all_notifications")}
                        </Link>
                    </div>
                </div>
            )}
        </div>
    );
};

export default NotificationDropdown;
