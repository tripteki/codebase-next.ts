import { ReactElement, useEffect, useState, } from "react";
import Link from "next/link";
import { useTranslation, } from "next-i18next/pages";
import { Bell, } from "lucide-react";

import NotificationItemPreview from "@/components/admin/notification-item-preview";
import { Button, } from "@/components/ui/button";
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
            "inline-flex flex-1 items-center justify-center rounded-full px-3 py-1.5 text-xs font-medium transition-colors",
            activeTab === tab
                ? "bg-primary text-primary-foreground"
                : "text-muted-foreground hover:bg-muted"
        );

    return (
        <div className="relative">
            <Button
                type="button"
                variant="ghost"
                size="icon"
                className="relative"
                aria-expanded={open}
                aria-label={t ("notifications")}
                onClick={() => void toggle ()}
            >
                <Bell className="h-5 w-5" />
                {unread > 0 && (
                    <span className="absolute -right-0.5 -top-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-destructive px-1 text-[10px] font-bold text-destructive-foreground">
                        {unread > 99 ? "99+" : unread}
                    </span>
                )}
            </Button>

            {open && (
                <div className="absolute right-0 z-50 mt-2 w-80 rounded-lg border bg-popover text-popover-foreground shadow-lg">
                    <div className="flex items-center justify-between border-b px-4 py-3">
                        <h3 className="text-sm font-semibold">{t ("notifications")}</h3>
                        {unread > 0 && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-auto px-2 py-1 text-xs"
                                onClick={() => void markAllAsRead ().then (loadDropdownItems)}
                            >
                                {t ("mark_all_read")}
                            </Button>
                        )}
                    </div>

                    <div className="flex gap-1 border-b px-2 py-2">
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
                            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                                {t ("loading")}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="px-4 py-6 text-center text-xs text-muted-foreground">
                                {t ("no_notifications")}
                            </div>
                        ) : (
                            items.map ((item) => (
                                <button
                                    key={item.id}
                                    type="button"
                                    className={cn (
                                        "flex w-full gap-3 border-b px-4 py-3 text-left transition-colors hover:bg-muted/50",
                                        notificationIsUnread (item) && "bg-muted/30"
                                    )}
                                    onClick={() => void handleNotificationClick (item.id)}
                                >
                                    <NotificationItemPreview item={item} />
                                </button>
                            ))
                        )}
                    </div>

                    <div className="border-t px-4 py-2">
                        <Link
                            href="/notifications"
                            className="block text-center text-xs text-primary hover:underline"
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
