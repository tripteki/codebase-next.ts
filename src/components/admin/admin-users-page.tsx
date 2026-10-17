import { type ReactElement, useEffect, useState, } from "react";
import Link from "next/link";
import { useSession, } from "next-auth/react";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminConfirmModal from "@/components/admin/admin-confirm-modal";
import AdminExportModal from "@/components/admin/admin-export-modal";
import AdminFrame from "@/components/admin/admin-frame";
import AdminRowButton from "@/components/admin/admin-row-button";
import AdminListFilterPanel from "@/components/admin/admin-list-filter-panel";
import AdminSearchInput from "@/components/admin/admin-search-input";
import AdminSortableTableHead from "@/components/admin/admin-sortable-table-head";
import AdminImportModal from "@/components/admin/admin-import-modal";
import AdminPagination from "@/components/admin/admin-pagination";
import AdminTableSkeleton from "@/components/admin/admin-table-skeleton";
import AdminStatusDot from "@/components/admin/admin-status-dot";
import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import FbButton from "@/components/flowbite/fb-button";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import { applyPaginatedResult, useAdminListState, } from "@/hooks/use-admin-list-state";
import {
    activateAdminUser,
    deactivateAdminUser,
    exportAdminUsers,
    fetchAdminUsers,
    forceDeleteAdminUser,
    importAdminUsers,
    verifyAdminUser,
    type UserExportFormat,
} from "@/libs/admin-api";
import { toggleAdminListOrder, } from "@/libs/admin-list-params";
import { adminListRouteQuery, readAdminListRoute, } from "@/libs/admin-list-route";
import { resolveCallErrorMessage, } from "@/libs/call-message";
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
    fbLink,
    fbMuted,
    fbSelect,
} from "@/libs/flowbite-classes";
import { formatStamp, } from "@/libs/format-display";
import { downloadUserImportSample, } from "@/libs/samples/users";
import { UserRoleEnum, userRoleValues, } from "@/libs/user-role";
import {
    canMutateAdminAccount,
    resolveUserAccountStatus,
    resolveUserDisplayName,
    userStatusTone,
    type AdminUser,
} from "@/types/admin/user";

const EXPORT_FORMATS: UserExportFormat[] = ["csv", "xlsx", "xls"];
const listDefaults = { q: "", role: "", status: "active", order: "created_at:desc", page: "1", };
const roleOptions = userRoleValues ();

const AdminUsersPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { data: session, } = useSession ();
    const { can, roles, } = useAdminAccess ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const { items, setItems, meta, setMeta, isLoading, setIsLoading, } = useAdminListState<AdminUser> ();
    const [q, setQ] = useState ("");
    const [role, setRole] = useState ("");
    const [status, setStatus] = useState ("active");
    const [filterOpen, setFilterOpen] = useState (false);
    const [order, setOrder] = useState ("created_at:desc");
    const [exportType, setExportType] = useState<UserExportFormat> ("csv");
    const [importOpen, setImportOpen] = useState (false);
    const [exportOpen, setExportOpen] = useState (false);
    const [confirmOpen, setConfirmOpen] = useState (false);
    const [confirmDanger, setConfirmDanger] = useState (false);
    const [confirmMessage, setConfirmMessage] = useState ("");
    const [confirmAction, setConfirmAction] = useState<(() => Promise<{ isSuccess: boolean; data: unknown; error: unknown; }>) | null> (null);
    const [page, setPage] = useState (1);
    const [hydrated, setHydrated] = useState (false);
    const [message, setMessage] = useState ("");
    const [error, setError] = useState ("");
    const isSuperadmin = roles.includes (UserRoleEnum.Superadmin);

    function listQuery (nextPage = page)
    {
        return { q, role, status, order, currentPage: nextPage, };
    }

    function canChange (user: AdminUser): boolean
    {
        return canMutateAdminAccount (session?.user?.id, isSuperadmin, user);
    }

    function roleLabel (key: string): string
    {
        const translated = t (`role_${key}`);

        if (translated === `role_${key}` || translated.endsWith (`.role_${key}`))
        {
            return key;
        }

        return translated;
    }

    async function load (
        nextPage = page,
        nextOrder = order,
        filters: { q?: string; role?: string; status?: string; } = {}
    ): Promise<void>
    {
        const nextQ = filters.q ?? q;
        const nextRole = filters.role ?? role;
        const nextStatus = filters.status ?? status;
        const query = adminListRouteQuery ({
            q: nextQ,
            role: nextRole,
            status: nextStatus,
            order: nextOrder,
            page: String (nextPage),
        }, listDefaults);
        const current = adminListRouteQuery (readAdminListRoute (router.query, listDefaults), listDefaults);

        if (JSON.stringify (query) !== JSON.stringify (current))
        {
            void router.replace ({ pathname: "/admin/users", query, }, undefined, { shallow: true, });
        }

        setPage (nextPage);
        setIsLoading (true);
        setError ("");
        const result = await fetchAdminUsers ({ q: nextQ, role: nextRole, status: nextStatus, order: nextOrder, currentPage: nextPage, });

        setIsLoading (false);

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        applyPaginatedResult (result, setItems, setMeta);
    }

    async function runJob (action: () => Promise<{ isSuccess: boolean; data: unknown; error: unknown; }>): Promise<void>
    {
        setMessage ("");
        setError ("");
        const result = await action ();

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        setMessage (typeof result.data === "string" ? result.data : t ("job_started"));
        await load ();
    }

    function confirmJob (prompt: string, action: () => Promise<{ isSuccess: boolean; data: unknown; error: unknown; }>, danger = false): void
    {
        setConfirmMessage (prompt);
        setConfirmDanger (danger);
        setConfirmAction (() => action);
        setConfirmOpen (true);
    }

    async function runConfirm (): Promise<void>
    {
        const action = confirmAction;

        setConfirmOpen (false);

        if (action)
        {
            await runJob (action);
        }
    }

    function clearFilters (): void
    {
        setQ ("");
        setRole ("");
        setStatus ("active");
        setPage (1);
        void load (1, order, { q: "", role: "", status: "active", });
    }

    function sortBy (field: string): void
    {
        const nextOrder = toggleAdminListOrder (order, field);

        setOrder (nextOrder);
        void load (1, nextOrder);
    }

    useEffect (() =>
    {
        if (! router.isReady)
        {
            return;
        }

        const initial = readAdminListRoute (router.query, listDefaults);

        setQ (initial.q);
        setRole (initial.role);
        setStatus (initial.status);
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

    if (! canRender)
    {
        return null;
    }

    return (
        <AdminFrame
            title={t ("all_users")}
            description={t ("users_index_description")}
            refreshScopes={["users"]}
            onRefresh={() => void load ()}
            actions={(
                <>
                    {can ("user.import") ? <FbButton variant="tertiary" size="xs" type="button" onClick={() => setImportOpen (true)}>{t ("import_file")}</FbButton> : null}
                    {can ("user.export") ? <FbButton variant="secondary" size="xs" type="button" onClick={() => setExportOpen (true)}>{t ("export")}</FbButton> : null}
                    {can ("user.create") ? <FbButton size="xs" href="/admin/users/create">{t ("users_create")}</FbButton> : null}
                </>
            )}
        >
            <AlertSuccess message={message} />
            <AlertError message={error} />
            <div className={fbAdminIndexShell}>
            <div className={fbAdminIndexToolbar}>
                <div className="min-w-0 max-w-xl flex-1" role="search">
                    <label htmlFor="users-search" className="sr-only">{t ("search")}</label>
                    <AdminSearchInput
                        id="users-search"
                        placeholder={t ("users_search_placeholder")}
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
                    activeCount={(role ? 1 : 0) + (status !== "active" ? 1 : 0)}
                    onToggle={() => setFilterOpen ((value) => ! value)}
                    onClear={clearFilters}
                >
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{t ("role")}</label>
                    <select className={fbSelect} value={role} onChange={(event) => { const nextRole = event.target.value; setRole (nextRole); void load (1, order, { role: nextRole, }); }}>
                        <option value="">{t ("users_filter_role_all")}</option>
                        {roleOptions.map ((item) => <option key={item} value={item}>{roleLabel (item)}</option>)}
                    </select>
                    <label className="mb-2 mt-4 block text-sm font-medium text-gray-900 dark:text-white">{t ("status")}</label>
                    <select className={fbSelect} value={status} onChange={(event) => { const nextStatus = event.target.value; setStatus (nextStatus); void load (1, order, { status: nextStatus, }); }}>
                        <option value="active">{t ("status_active")}</option>
                        <option value="unverified">{t ("status_unverified")}</option>
                        <option value="deactivated">{t ("status_deactivated")}</option>
                        <option value="all">{t ("all")}</option>
                    </select>
                </AdminListFilterPanel>
            </div>
            {isLoading ? <AdminTableSkeleton cols={5} /> : (
                <div className={fbAdminIndexScroll}>
                    {items.length === 0 ? (
                        <div className="px-6 py-8 text-center"><p className={fbMuted}>{t ("users_empty")}</p></div>
                    ) : (
                        <table className={fbAdminTable}>
                            <thead className={fbAdminTableHead}>
                                <tr>
                                    <th className={fbAdminTableHeadCell}>{t ("full_name")}</th>
                                    <th className={`${fbAdminTableHeadCell} hidden xl:table-cell`}>{t ("role")}</th>
                                    <AdminSortableTableHead className="hidden whitespace-nowrap xl:table-cell" label={t ("created_at")} field="created_at" sort={order} onSort={sortBy} />
                                    <AdminSortableTableHead className="hidden whitespace-nowrap md:table-cell" label={t ("status")} field="status" sort={order} onSort={sortBy} />
                                    <th className={`${fbAdminTableHeadCell} ${fbAdminTableHeadActions}`}>{t ("actions")}</th>
                                </tr>
                            </thead>
                            <tbody>
                                {items.map ((user) => (
                                    <tr key={user.id} className={fbAdminTableRow}>
                                        <td className={`${fbAdminTableCellPrimary} max-w-[18rem] overflow-hidden`}>
                                            <span className="flex w-full min-w-0 items-center">
                                                <span className="inline-flex h-10 w-10 shrink-0 items-center justify-center overflow-hidden rounded-full bg-gray-100 text-sm font-medium text-gray-600 dark:bg-gray-700 dark:text-gray-300">
                                                    {user.avatar_url
                                                        ? <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                                                        : <span>{resolveUserDisplayName (user).slice (0, 2).toUpperCase ()}</span>}
                                                </span>
                                                <span className="ml-3 w-[6rem] min-w-0 max-w-[6rem] sm:ml-4 sm:w-[10rem] sm:max-w-[10rem]">
                                                    <Link className={`${fbLink} block truncate text-sm`} href={`/admin/users/${user.id}`}>{resolveUserDisplayName (user)}</Link>
                                                    <span className="block truncate text-sm text-gray-500 dark:text-gray-400">{user.email}</span>
                                                    <span className="mt-1 flex flex-wrap items-center gap-x-3 gap-y-1 xl:hidden">
                                                        {user.role ? <span className="badge-brand-primary inline-flex max-w-full items-center truncate rounded-full px-2.5 py-0.5 text-xs font-medium">{roleLabel (user.role)}</span> : null}
                                                        <AdminStatusDot className="text-xs md:hidden" tone={userStatusTone (resolveUserAccountStatus (user))}>{t (`status_${resolveUserAccountStatus (user)}`)}</AdminStatusDot>
                                                    </span>
                                                </span>
                                            </span>
                                        </td>
                                        <td className={`${fbAdminTableCell} hidden whitespace-nowrap xl:table-cell`}>
                                            {user.role ? <span className="badge-brand-primary inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium">{roleLabel (user.role)}</span> : <span>-</span>}
                                        </td>
                                        <td className={`${fbAdminTableCell} hidden whitespace-nowrap xl:table-cell`}>{formatStamp (user.created_at)}</td>
                                        <td className={`${fbAdminTableCell} hidden whitespace-nowrap md:table-cell`}>
                                            <AdminStatusDot tone={userStatusTone (resolveUserAccountStatus (user))}>{t (`status_${resolveUserAccountStatus (user)}`)}</AdminStatusDot>
                                        </td>
                                        <td className={`${fbAdminTableCell} ${fbAdminTableCellActions}`}>
                                            <div className={fbAdminTableActions}>
                                                <AdminRowButton icon="view" href={`/admin/users/${user.id}`}>{t ("view")}</AdminRowButton>
                                                {can ("user.update") && canChange (user) ? <AdminRowButton icon="edit" href={`/admin/users/${user.id}/edit`}>{t ("edit")}</AdminRowButton> : null}
                                                {can ("user.update") && canChange (user) && ! user.deleted_at && ! user.email_verified_at
                                                    ? <AdminRowButton icon="verify" onClick={() => void confirmJob (t ("confirm_verify"), () => verifyAdminUser (user.id))}>{t ("verify")}</AdminRowButton>
                                                    : null}
                                                {user.deleted_at && can ("user.restore") && canChange (user)
                                                    ? <AdminRowButton icon="activate" onClick={() => void confirmJob (t ("confirm_activate"), () => activateAdminUser (user.id))}>{t ("activate")}</AdminRowButton>
                                                    : null}
                                                {! user.deleted_at && can ("user.delete") && canChange (user)
                                                    ? <AdminRowButton icon="deactivate" onClick={() => void confirmJob (t ("confirm_deactivate"), () => deactivateAdminUser (user.id), true)}>{t ("deactivate")}</AdminRowButton>
                                                    : null}
                                                {can ("user.delete") && canChange (user)
                                                    ? <AdminRowButton icon="delete" onClick={() => void confirmJob (t ("confirm_force_delete"), () => forceDeleteAdminUser (user.id), true)}>{t ("force_delete")}</AdminRowButton>
                                                    : null}
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
            <AdminConfirmModal open={confirmOpen} titleId="users-confirm-title" title={t ("confirm")} message={confirmMessage} confirmLabel={t ("confirm")} danger={confirmDanger} onClose={() => setConfirmOpen (false)} onConfirm={() => void runConfirm ()} />
            <AdminImportModal open={importOpen} i18nPrefix="users" accept=".csv,.txt,.xls,.xlsx" onClose={() => setImportOpen (false)} onSample={() => downloadUserImportSample ()} onConfirm={(file) => { setImportOpen (false); void runJob (() => importAdminUsers (file)); }} />
            <AdminExportModal open={exportOpen} i18nPrefix="users" formats={[...EXPORT_FORMATS]} onClose={() => setExportOpen (false)} onConfirm={(format) => { const nextFormat = format as UserExportFormat; setExportType (nextFormat); setExportOpen (false); void runJob (() => exportAdminUsers ({ ...listQuery (), }, nextFormat)); }} />
        </AdminFrame>
    );
};

export { AdminUsersPage, };
export default AdminUsersPage;
