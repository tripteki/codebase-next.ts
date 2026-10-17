import { type ReactElement, useEffect, useState, } from "react";
import Link from "next/link";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminDetailSkeleton from "@/components/admin/admin-detail-skeleton";
import AdminFrame from "@/components/admin/admin-frame";
import AdminRowButton from "@/components/admin/admin-row-button";
import AdminListFilterPanel from "@/components/admin/admin-list-filter-panel";
import AdminSearchInput from "@/components/admin/admin-search-input";
import AdminSortableTableHead from "@/components/admin/admin-sortable-table-head";
import AdminPagination from "@/components/admin/admin-pagination";
import AdminTableSkeleton from "@/components/admin/admin-table-skeleton";
import AlertError from "@/components/alert-error";
import FbButton from "@/components/flowbite/fb-button";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import { resolveActivityCauserAdminPath, resolveActivitySubjectAdminPath, } from "@/libs/admin-activity-subject";
import { applyPaginatedResult, useAdminListState, } from "@/hooks/use-admin-list-state";
import { fetchAdminActivities, getAdminActivity, } from "@/libs/admin-api";
import { UserRoleEnum, } from "@/libs/user-role";
import { toggleAdminListOrder, } from "@/libs/admin-list-params";
import { adminListRouteQuery, readAdminListRoute, } from "@/libs/admin-list-route";
import { resolveCallErrorMessage, } from "@/libs/call-message";
import { formatStamp, } from "@/libs/format-display";
import {
    fbAdminIndexScroll,
    fbAdminIndexShell,
    fbAdminIndexToolbar,
    fbAdminTable,
    fbAdminTableActions,
    fbAdminTableCell,
    fbAdminTableCellActions,
    fbAdminTableCellPrimary,
    fbAdminTableHead,
    fbAdminTableHeadActions,
    fbAdminTableHeadCell,
    fbAdminTableRow,
    fbAdminShowBack,
    fbCard,
    fbInput,
    fbLink,
    fbSelect,
    fbMuted,
    fbShowLabel,
    fbShowValue,
} from "@/libs/flowbite-classes";
import { ACTIVITY_SUBJECT_TYPES, type AdminActivity, } from "@/types/admin/activity";

const listDefaults = { q: "", subject: "", from: "", to: "", causer: "", order: "created_at:desc", page: "1", };

export const AdminActivitiesPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { can, roles, } = useAdminAccess ();
    const seesAllActivities = roles.includes (UserRoleEnum.Admin) || roles.includes (UserRoleEnum.Superadmin);
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const { items, setItems, meta, setMeta, isLoading, setIsLoading, } = useAdminListState<AdminActivity> ();
    const [q, setQ] = useState ("");
    const [subjectType, setSubjectType] = useState ("");
    const [dateFrom, setDateFrom] = useState ("");
    const [dateTo, setDateTo] = useState ("");
    const [causer, setCauser] = useState ("");
    const [filterOpen, setFilterOpen] = useState (false);
    const [order, setOrder] = useState ("created_at:desc");
    const [page, setPage] = useState (1);
    const [hydrated, setHydrated] = useState (false);
    const [error, setError] = useState ("");

    async function load (
        nextPage = page,
        nextOrder = order,
        filters: { q?: string; subjectType?: string; dateFrom?: string; dateTo?: string; causer?: string; } = {},
    ): Promise<void>
    {
        const nextQ = filters.q ?? q;
        const nextSubject = filters.subjectType ?? subjectType;
        const nextFrom = filters.dateFrom ?? dateFrom;
        const nextTo = filters.dateTo ?? dateTo;
        const nextCauser = filters.causer ?? causer;
        const query = adminListRouteQuery ({
            q: nextQ,
            subject: nextSubject,
            from: nextFrom,
            to: nextTo,
            causer: nextCauser,
            order: nextOrder,
            page: String (nextPage),
        }, listDefaults);
        const current = adminListRouteQuery (readAdminListRoute (router.query, listDefaults), listDefaults);

        if (JSON.stringify (query) !== JSON.stringify (current))
        {
            void router.replace ({ pathname: "/admin/activities", query, }, undefined, { shallow: true, });
        }

        setPage (nextPage);
        setIsLoading (true);
        const result = await fetchAdminActivities ({
            q: nextQ,
            subjectType: nextSubject,
            dateFrom: nextFrom,
            dateTo: nextTo,
            causer: nextCauser,
            order: nextOrder,
            currentPage: nextPage,
        });

        setIsLoading (false);

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        applyPaginatedResult (result, setItems, setMeta);
    }

    useEffect (() =>
    {
        if (! router.isReady)
        {
            return;
        }

        const initial = readAdminListRoute (router.query, listDefaults);

        setQ (initial.q);
        setSubjectType (initial.subject);
        setDateFrom (initial.from);
        setDateTo (initial.to);
        setCauser (initial.causer);
        setOrder (initial.order);
        setPage (Number (initial.page) || 1);
        setHydrated (true);
    }, [router.isReady]);

    useEffect (() =>
    {
        if (! hydrated)
        {
            return;
        }

        void load (page, order);
    }, [hydrated]);

    if (! canRender) return null;

    return (
        <AdminFrame title={t ("activities")} description={t (seesAllActivities ? "activities_description" : "activities_own_description")} refreshScopes={["activities"]} onRefresh={() => void load ()}>
            <AlertError message={error} />
            <div className={fbAdminIndexShell}>
            <div className={fbAdminIndexToolbar}>
                <div className="min-w-0 max-w-xl flex-1" role="search">
                    <label htmlFor="activities-search" className="sr-only">{t ("search")}</label>
                    <AdminSearchInput
                        id="activities-search"
                        placeholder={t ("activities_search_placeholder")}
                        value={q}
                        onChange={setQ}
                        onSubmit={(nextQ) =>
                        {
                            setQ (nextQ);
                            setPage (1);
                            void load (1, order, { q: nextQ, });
                        }}
                    />
                </div>
                <AdminListFilterPanel
                    open={filterOpen}
                    activeCount={[subjectType, dateFrom, dateTo, causer,].filter ((value) => value.trim () !== "").length}
                    onToggle={() => setFilterOpen ((value) => ! value)}
                    onClear={() =>
                    {
                        setSubjectType ("");
                        setDateFrom ("");
                        setDateTo ("");
                        setCauser ("");
                        void load (1, order, { subjectType: "", dateFrom: "", dateTo: "", causer: "", });
                    }}
                >
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{t ("activities_column_subject")}</label>
                    <select className={fbSelect} value={subjectType} onChange={(event) => { const nextSubject = event.target.value; setSubjectType (nextSubject); void load (1, order, { subjectType: nextSubject, }); }}>
                        <option value="">{t ("activities_filter_all_subjects")}</option>
                        {ACTIVITY_SUBJECT_TYPES.map ((subject) => <option key={subject} value={subject}>{t (`activities_filter_subject_${subject.toLowerCase ()}`)}</option>)}
                    </select>
                    <label className="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white">{t ("activities_filter_date_from")}</label>
                    <input type="date" className={fbInput} value={dateFrom} onChange={(event) => { const nextFrom = event.target.value; setDateFrom (nextFrom); void load (1, order, { dateFrom: nextFrom, }); }} />
                    <label className="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white">{t ("activities_filter_date_to")}</label>
                    <input type="date" className={fbInput} value={dateTo} onChange={(event) => { const nextTo = event.target.value; setDateTo (nextTo); void load (1, order, { dateTo: nextTo, }); }} />
                    <label className="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white">{t ("activities_filter_causer")}</label>
                    <input className={fbInput} value={causer} placeholder={t ("activities_filter_causer")} onChange={(event) => { const nextCauser = event.target.value; setCauser (nextCauser); void load (1, order, { causer: nextCauser, }); }} />
                </AdminListFilterPanel>
            </div>
            {isLoading ? <AdminTableSkeleton cols={6} /> : (
                <div className={fbAdminIndexScroll}>
                    {items.length === 0 ? (
                        <div className="px-6 py-8 text-center"><p className={fbMuted}>{t ("activities_empty")}</p></div>
                    ) : (
                        <table className={fbAdminTable}>
                            <thead className={fbAdminTableHead}><tr>
                                <AdminSortableTableHead label={t ("activities_column_description")} field="description" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <th className={fbAdminTableHeadCell}>{t ("activities_column_causer")}</th>
                                <AdminSortableTableHead label={t ("activities_column_subject")} field="subject_type" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <AdminSortableTableHead label={t ("activities_column_event")} field="event" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <AdminSortableTableHead label={t ("activities_column_created")} field="created_at" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <th className={`${fbAdminTableHeadCell} ${fbAdminTableHeadActions}`}>{t ("actions")}</th>
                            </tr></thead>
                            <tbody>
                                {items.map ((activity) => (
                                    <tr key={activity.id} className={fbAdminTableRow}>
                                        <td className={fbAdminTableCellPrimary}>{activity.description}</td>
                                        <td className={fbAdminTableCell}>
                                            {resolveActivityCauserAdminPath (activity.causer?.id, can)
                                                ? <Link className={fbLink} href={resolveActivityCauserAdminPath (activity.causer?.id, can) || "#"}>{activity.causer?.full_name || activity.causer?.email}</Link>
                                                : (activity.causer?.email || "-")}
                                        </td>
                                        <td className={fbAdminTableCell}>
                                            {resolveActivitySubjectAdminPath (activity.subject_type_label || activity.subject_type, activity.subject_id, can)
                                                ? <Link className={fbLink} href={resolveActivitySubjectAdminPath (activity.subject_type_label || activity.subject_type, activity.subject_id, can) || "#"}>{activity.subject_type_label || activity.subject_type}</Link>
                                                : (activity.subject_type_label || activity.subject_type || "-")}
                                        </td>
                                        <td className={fbAdminTableCell}>{activity.event}</td>
                                        <td className={`${fbAdminTableCell} whitespace-nowrap`}>{formatStamp (activity.created_at)}</td>
                                        <td className={`${fbAdminTableCell} ${fbAdminTableCellActions}`}>
                                            <div className={fbAdminTableActions}>
                                                <AdminRowButton icon="view" href={`/admin/activities/${activity.id}`}>{t ("view")}</AdminRowButton>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    )}
                </div>
            )}
            <AdminPagination meta={meta} page={page} onChange={(next) => { setPage (next); void load (next); }} />
            </div>
        </AdminFrame>
    );
};

export const AdminActivityShowPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { can, } = useAdminAccess ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const [activity, setActivity] = useState<AdminActivity | null> (null);
    const [error, setError] = useState ("");
    const id = String (router.query.id || "");

    useEffect (() =>
    {
        if (! id) return;

        void getAdminActivity (id).then ((result) =>
        {
            if (! result.isSuccess)
            {
                setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

                return;
            }

            setActivity (result.data as AdminActivity);
        });
    }, [id, t]);

    if (! canRender) return null;

    return (
        <AdminFrame title={t ("activities_show_title")} description={t ("activities_show_description")}>
            <AlertError message={error} />
            {! activity && ! error ? <AdminDetailSkeleton /> : null}
            {activity ? (
                <div className={`${fbCard} grid min-w-0 gap-4 md:grid-cols-2`}>
                    <div className="md:col-span-2"><p className={fbShowLabel}>{t ("log_description")}</p><p className={fbShowValue}>{activity.description}</p></div>
                    <div><p className={fbShowLabel}>{t ("event")}</p><p className={fbShowValue}>{activity.event || "-"}</p></div>
                    <div><p className={fbShowLabel}>{t ("log_name")}</p><p className={fbShowValue}>{activity.log_name || "-"}</p></div>
                    <div>
                        <p className={fbShowLabel}>{t ("causer")}</p>
                        <div className={fbShowValue}>
                            {resolveActivityCauserAdminPath (activity.causer?.id, can)
                                ? <Link className={fbLink} href={resolveActivityCauserAdminPath (activity.causer?.id, can) || "#"}>{activity.causer?.full_name || activity.causer?.email}</Link>
                                : (activity.causer?.email || "-")}
                        </div>
                    </div>
                    <div>
                        <p className={fbShowLabel}>{t ("subject")}</p>
                        <div className={fbShowValue}>
                            {resolveActivitySubjectAdminPath (activity.subject_type_label || activity.subject_type, activity.subject_id, can)
                                ? <Link className={fbLink} href={resolveActivitySubjectAdminPath (activity.subject_type_label || activity.subject_type, activity.subject_id, can) || "#"}>{activity.subject_type_label || activity.subject_type}{activity.subject_id ? ` · ${activity.subject_id}` : ""}</Link>
                                : <>{activity.subject_type_label || activity.subject_type || "-"}{activity.subject_id ? ` · ${activity.subject_id}` : ""}</>}
                        </div>
                    </div>
                    <div className="md:col-span-2"><p className={fbShowLabel}>{t ("created_at")}</p><p className={fbShowValue}>{formatStamp (activity.created_at)}</p></div>
                    <div className="min-w-0 md:col-span-2">
                        <p className={fbShowLabel}>{t ("properties")}</p>
                        <pre className="mt-2 max-w-full overflow-x-auto rounded-lg bg-gray-50 p-3 text-xs text-gray-800 dark:bg-gray-900 dark:text-gray-100">{JSON.stringify (activity.properties || {}, null, 2)}</pre>
                    </div>
                    <div className={`${fbAdminShowBack} md:col-span-2`}>
                        <FbButton variant="outline" href="/admin/activities">{t ("back_to_activities")}</FbButton>
                    </div>
                </div>
            ) : null}
        </AdminFrame>
    );
};
