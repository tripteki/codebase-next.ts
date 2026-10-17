import { type ReactElement, useEffect, useMemo, useState, } from "react";
import Link from "next/link";
import { useTranslation, } from "next-i18next/pages";

import AdminChartSkeleton from "@/components/admin/admin-chart-skeleton";
import AdminFrame from "@/components/admin/admin-frame";
import AlertError from "@/components/alert-error";
import FbApexChart from "@/components/flowbite/fb-apex-chart";
import FbButton from "@/components/flowbite/fb-button";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { fetchAdminDashboard, } from "@/libs/admin-api";
import { resolveCallErrorMessage, } from "@/libs/call-message";
import { formatStamp, humanizeToken, } from "@/libs/format-display";
import { fbCard, fbCardTitle, fbMuted, } from "@/libs/flowbite-classes";
import type { AdminDashboard, } from "@/types/admin/dashboard";

const AdminDashboardPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { t, } = useTranslation ("common");
    const [dashboard, setDashboard] = useState<AdminDashboard | null> (null);
    const [error, setError] = useState ("");

    function notificationHref (url?: string | null): string
    {
        const fallback = dashboard?.links.notifications || "/notifications";
        const target = (url || "").trim ();

        if (! target)
        {
            return fallback;
        }

        if (target.startsWith ("http://") || target.startsWith ("https://") || target.startsWith ("/"))
        {
            return target;
        }

        return `/${target}`;
    }

    function notificationIsExternal (url: string): boolean
    {
        return url.startsWith ("http://") || url.startsWith ("https://");
    }

    async function load (): Promise<void>
    {
        const result = await fetchAdminDashboard ();

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        setError ("");
        setDashboard (result.data as AdminDashboard);
    }

    useEffect (() =>
    {
        void load ();
    }, [t]);

    function roleLabel (key: string): string
    {
        const translated = t (`role_${key}`);

        if (translated === `role_${key}` || translated.endsWith (`.role_${key}`))
        {
            return key;
        }

        return translated;
    }

    const roleChart = useMemo (() =>
    {
        const rows = dashboard?.users?.by_role ?? {};
        const keys = Object.keys (rows);

        return {
            series: [
                {
                    name: t ("by_role"),
                    data: keys.map ((key) => Number (rows[key] ?? 0)),
                },
            ],
            options: {
                dataLabels: { enabled: true, },
                chart: { parentHeightOffset: 0, toolbar: { show: false, }, },
                grid: { padding: { left: 8, right: 16, }, },
                plotOptions: {
                    bar: { horizontal: true, borderRadius: 4, barHeight: "55%", },
                },
                xaxis: { categories: keys.map ((key) => roleLabel (key)), },
            },
        };
    }, [dashboard, t]);

    if (! canRender)
    {
        return null;
    }

    const users = dashboard?.users;

    return (
        <AdminFrame
            title={t ("dashboard_title")}
            description={t ("dashboard_description")}
            refreshScopes={["users", "roles", "permissions", "activities"]}
            onRefresh={() => void load ()}>
            <AlertError message={error} />
            {! dashboard && ! error ? <AdminChartSkeleton /> : null}
            {users ? (
                <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-5">
                    <div className={`${fbCard} text-center`}><h3 className={fbCardTitle}>{t ("total_users")}</h3><p className="mt-2 text-3xl font-bold">{users.total}</p></div>
                    <div className={`${fbCard} text-center`}><h3 className={fbCardTitle}>{t ("active_users")}</h3><p className="mt-2 text-3xl font-bold">{users.active}</p></div>
                    <div className={`${fbCard} text-center`}><h3 className={fbCardTitle}>{t ("deactivated_users")}</h3><p className="mt-2 text-3xl font-bold">{users.deactivated}</p></div>
                    <div className={`${fbCard} text-center`}><h3 className={fbCardTitle}>{t ("unverified_users")}</h3><p className="mt-2 text-3xl font-bold">{users.unverified}</p></div>
                    <div className={`${fbCard} text-center`}><h3 className={fbCardTitle}>{t ("new_in_period")}</h3><p className="mt-2 text-3xl font-bold">{users.new_in_period}</p></div>
                </div>
            ) : null}
            {dashboard ? (
                <div className="grid gap-4 lg:grid-cols-2">
                    {users ? (
                        <div className={fbCard}>
                            <div className="mb-3 flex items-center justify-between gap-2">
                                <div>
                                    <h3 className={fbCardTitle}>{t ("by_role")}</h3>
                                    <p className={fbMuted}>{t ("dashboard_users_by_role_description")}</p>
                                </div>
                                <FbButton variant="outline" size="sm" href={dashboard.links.users}>{t ("users")}</FbButton>
                            </div>
                            <FbApexChart type="bar" height={320} series={roleChart.series} options={roleChart.options} />
                        </div>
                    ) : null}
                    <div className={fbCard}>
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <div>
                                <h3 className={fbCardTitle}>{t ("recent_notifications")}</h3>
                                <p className={fbMuted}>{dashboard.unread_notifications} {t ("unread_count")}</p>
                            </div>
                            <FbButton variant="outline" size="sm" href={dashboard.links.notifications}>{t ("notifications")}</FbButton>
                        </div>
                        {! dashboard.recent_notifications.length ? <p className={fbMuted}>{t ("dashboard_notifications_empty")}</p> : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {dashboard.recent_notifications.map ((notification) => {
                                    const href = notificationHref (notification.url);
                                    const external = notificationIsExternal (href);
                                    const body = (
                                        <>
                                            <p className="font-medium">{humanizeToken (notification.title || notification.type || "")}</p>
                                            <p className={`${fbMuted} text-sm`}>{notification.body || formatStamp (notification.created_at)}</p>
                                        </>
                                    );

                                    return (
                                        <li key={notification.id} className="py-3">
                                            {external ? (
                                                <a className="block hover:opacity-90" href={href} target="_blank" rel="noopener noreferrer">{body}</a>
                                            ) : (
                                                <Link className="block hover:opacity-90" href={href}>{body}</Link>
                                            )}
                                        </li>
                                    );
                                })}
                            </ul>
                        )}
                    </div>
                    <div className={fbCard}>
                        <div className="mb-3 flex items-center justify-between gap-2">
                            <div>
                                <h3 className={fbCardTitle}>{t ("recent_activities")}</h3>
                                <p className={fbMuted}>{t (dashboard.activities_scope === "own" ? "dashboard_activities_own" : "dashboard_activities_all")}</p>
                            </div>
                            <FbButton variant="outline" size="sm" href={dashboard.links.activities}>{t ("activities")}</FbButton>
                        </div>
                        {! dashboard.recent_activities?.length ? <p className={fbMuted}>{t ("dashboard_activities_empty")}</p> : (
                            <ul className="divide-y divide-gray-200 dark:divide-gray-700">
                                {dashboard.recent_activities.map ((activity) => (
                                    <li key={activity.id} className="py-3">
                                        <Link className="block" href={`${dashboard.links.activities}/${activity.id}`}>
                                            <p className="font-medium">{activity.description}</p>
                                            <p className={`${fbMuted} text-sm`}>{formatStamp (activity.created_at)}</p>
                                        </Link>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            ) : null}
        </AdminFrame>
    );
};

export default AdminDashboardPage;
