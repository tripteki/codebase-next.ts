import { GetServerSideProps, } from "next";
import { ReactElement, useEffect, useState, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import NotificationItemPreview from "@/components/admin/notification-item-preview";
import HeaderLayout from "@/layouts/header.layout";
import FooterLayout from "@/layouts/footer.layout";
import { Button, } from "@/components/ui/button";
import { useRequireAuth, } from "@/hooks/auth-guard";
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

const NotificationsPage = (): ReactElement | null => {
    const canRender = useRequireAuth ();
    const { t, } = useTranslation ("common");
    const {
        items,
        meta,
        isLoading,
        fetchList,
        markAsRead,
        markAllAsRead,
        deleteNotification,
        actionId,
    } = useNotifications ();

    const [activeTab, setActiveTab] = useState<"all" | "unread" | "read">("all");
    const [currentPage, setCurrentPage] = useState (1);

    const statusFilter: NotificationStatusFilter =
        activeTab === "unread" ? "unread" : activeTab === "read" ? "read" : "";

    useEffect (() => {
        void fetchList ({
            current_page: currentPage,
            limit: 15,
            status: statusFilter,
        });
    }, [activeTab, currentPage, fetchList, statusFilter]);

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

            <div className="min-h-screen flex flex-col bg-background">
                <HeaderLayout showLogout={true} />

                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="mx-auto max-w-3xl space-y-6">
                        <div className="flex items-center justify-between gap-4">
                            <div>
                                <h1 className="text-3xl font-bold tracking-tight">
                                    {t ("notifications")}
                                </h1>
                                <p className="text-muted-foreground">
                                    {t ("notifications_description")}
                                </p>
                            </div>
                            <Button variant="outline" onClick={() => void markAllAsRead ()}>
                                {t ("mark_all_read")}
                            </Button>
                        </div>

                        <div className="flex gap-2">
                            {(["all", "unread", "read"] as const).map ((tab) => (
                                <Button
                                    key={tab}
                                    variant={activeTab === tab ? "default" : "outline"}
                                    size="sm"
                                    onClick={() => {
                                        setActiveTab (tab);
                                        setCurrentPage (1);
                                    }}
                                >
                                    {t (tab === "all" ? "all" : tab)}
                                </Button>
                            ))}
                        </div>

                        {isLoading ? (
                            <div className="py-8 text-center text-sm text-muted-foreground">
                                {t ("loading")}
                            </div>
                        ) : items.length === 0 ? (
                            <div className="rounded-lg border py-12 text-center text-sm text-muted-foreground">
                                {t ("no_notifications")}
                            </div>
                        ) : (
                            <div className="divide-y rounded-lg border">
                                {items.map ((item) => (
                                    <div
                                        key={item.id}
                                        className={cn (
                                            "flex items-start gap-3 px-4 py-4",
                                            notificationIsUnread (item) && "bg-muted/30"
                                        )}
                                    >
                                        <button
                                            type="button"
                                            className="min-w-0 flex-1 text-left"
                                            onClick={() => void handleClick (item.id)}
                                        >
                                            <NotificationItemPreview item={item} />
                                        </button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="shrink-0 text-destructive"
                                            disabled={actionId === item.id}
                                            onClick={() => void deleteNotification (item.id)}
                                        >
                                            {t ("delete")}
                                        </Button>
                                    </div>
                                ))}
                            </div>
                        )}

                        {meta && (meta.last_page ?? 1) > 1 && (
                            <div className="flex items-center justify-center gap-2">
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage <= 1}
                                    onClick={() => setCurrentPage ((page) => page - 1)}
                                >
                                    {t ("previous")}
                                </Button>
                                <span className="text-sm text-muted-foreground">
                                    {currentPage} / {meta.last_page}
                                </span>
                                <Button
                                    variant="outline"
                                    size="sm"
                                    disabled={currentPage >= (meta.last_page ?? 1)}
                                    onClick={() => setCurrentPage ((page) => page + 1)}
                                >
                                    {t ("next")}
                                </Button>
                            </div>
                        )}
                    </div>
                </main>

                <FooterLayout />
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
