import { type FormEvent, type ReactElement, useEffect, useState, } from "react";
import Link from "next/link";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminConfirmModal from "@/components/admin/admin-confirm-modal";
import AdminDetailSkeleton from "@/components/admin/admin-detail-skeleton";
import AdminFormActions from "@/components/admin/admin-form-actions";
import AdminFormSkeleton from "@/components/admin/admin-form-skeleton";
import AdminExportModal from "@/components/admin/admin-export-modal";
import AdminFrame from "@/components/admin/admin-frame";
import AdminRowButton from "@/components/admin/admin-row-button";
import AdminListFilterPanel from "@/components/admin/admin-list-filter-panel";
import AdminSearchInput from "@/components/admin/admin-search-input";
import AdminSortableTableHead from "@/components/admin/admin-sortable-table-head";
import AdminImportModal from "@/components/admin/admin-import-modal";
import AdminPagination from "@/components/admin/admin-pagination";
import AdminTableSkeleton from "@/components/admin/admin-table-skeleton";
import AdminPermissionPicker from "@/components/admin/admin-permission-picker";
import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import FbButton from "@/components/flowbite/fb-button";
import FbInput from "@/components/flowbite/fb-input";
import FbLabel from "@/components/flowbite/fb-label";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import { applyPaginatedResult, parsePaginatedResult, useAdminListState, } from "@/hooks/use-admin-list-state";
import {
    createAdminRole,
    deleteAdminRole,
    exportAdminRoles,
    fetchAdminPermissions,
    type AclExportFormat,
    fetchAdminRoles,
    getAdminRole,
    importAdminRoles,
    updateAdminRole,
} from "@/libs/admin-api";
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
    fbMuted,
    fbSelect,
    fbShowChip,
    fbShowLabel,
} from "@/libs/flowbite-classes";
import { downloadRoleImportSample, } from "@/libs/samples/roles";
import type { AdminPermission, } from "@/types/admin/permission";
import { createDefaultRoleForm, type AdminRole, type AdminRoleFormPayload, } from "@/types/admin/role";

const listDefaults = { q: "", guard: "", order: "name:asc", page: "1", };

export const AdminRolesPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { can, } = useAdminAccess ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const { items, setItems, meta, setMeta, isLoading, setIsLoading, } = useAdminListState<AdminRole> ();
    const [q, setQ] = useState ("");
    const [guard, setGuard] = useState ("");
    const [filterOpen, setFilterOpen] = useState (false);
    const [order, setOrder] = useState ("name:asc");
    const [exportType, setExportType] = useState<AclExportFormat> ("csv");
    const [importOpen, setImportOpen] = useState (false);
    const [exportOpen, setExportOpen] = useState (false);
    const [confirmId, setConfirmId] = useState ("");
    const [page, setPage] = useState (1);
    const [hydrated, setHydrated] = useState (false);
    const [message, setMessage] = useState ("");
    const [error, setError] = useState ("");

    async function load (nextPage = page, nextOrder = order, nextGuard = guard, nextQ = q): Promise<void>
    {
        const query = adminListRouteQuery ({ q: nextQ, guard: nextGuard, order: nextOrder, page: String (nextPage), }, listDefaults);
        const current = adminListRouteQuery (readAdminListRoute (router.query, listDefaults), listDefaults);

        if (JSON.stringify (query) !== JSON.stringify (current))
        {
            void router.replace ({ pathname: "/admin/roles", query, }, undefined, { shallow: true, });
        }

        setPage (nextPage);
        setIsLoading (true);
        const result = await fetchAdminRoles ({ q: nextQ, guard: nextGuard, order: nextOrder, currentPage: nextPage, });

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

    useEffect (() =>
    {
        if (! router.isReady)
        {
            return;
        }

        const initial = readAdminListRoute (router.query, listDefaults);

        setQ (initial.q);
        setGuard (initial.guard);
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
            title={t ("roles")}
            description={t ("roles_description")}
            refreshScopes={["roles"]}
            onRefresh={() => void load ()}
            actions={(
                <>
                    {can ("role.import") ? <FbButton variant="tertiary" size="xs" type="button" onClick={() => setImportOpen (true)}>{t ("import_file")}</FbButton> : null}
                    {can ("role.export") ? <FbButton variant="secondary" size="xs" type="button" onClick={() => setExportOpen (true)}>{t ("export")}</FbButton> : null}
                    {can ("role.create") ? <FbButton size="xs" href="/admin/roles/create">{t ("roles_create")}</FbButton> : null}
                </>
            )}
        >
            <AlertSuccess message={message} />
            <AlertError message={error} />
            <div className={fbAdminIndexShell}>
            <div className={fbAdminIndexToolbar}>
                <div className="min-w-0 max-w-xl flex-1" role="search">
                    <label htmlFor="roles-search" className="sr-only">{t ("search")}</label>
                    <AdminSearchInput
                        id="roles-search"
                        placeholder={t ("roles_search_placeholder")}
                        value={q}
                        onChange={setQ}
                        onSubmit={(nextQ) =>
                        {
                            setQ (nextQ);
                            setPage (1);
                            void load (1, order, guard, nextQ);
                        }}
                    />
                </div>
                <AdminListFilterPanel open={filterOpen} activeCount={guard ? 1 : 0} onToggle={() => setFilterOpen ((value) => ! value)} onClear={() => { setGuard (""); void load (1, order, ""); }}>
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{t ("roles_column_guard")}</label>
                    <select className={fbSelect} value={guard} onChange={(event) => { const nextGuard = event.target.value; setGuard (nextGuard); void load (1, order, nextGuard); }}>
                        <option value="">{t ("roles_filter_all")}</option>
                        <option value="web">web</option>
                        <option value="api">api</option>
                    </select>
                </AdminListFilterPanel>
            </div>
            {isLoading ? <AdminTableSkeleton cols={5} /> : (
                <div className={fbAdminIndexScroll}>
                    {items.length === 0 ? (
                        <div className="px-6 py-8 text-center"><p className={fbMuted}>{t ("roles_empty")}</p></div>
                    ) : (
                        <table className={fbAdminTable}>
                            <thead className={fbAdminTableHead}><tr>
                                <AdminSortableTableHead label={t ("name")} field="name" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <AdminSortableTableHead label={t ("roles_column_guard")} field="guard_name" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <th className={fbAdminTableHeadCell}>{t ("permissions")}</th>
                                <AdminSortableTableHead label={t ("created_at")} field="created_at" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <th className={`${fbAdminTableHeadCell} ${fbAdminTableHeadActions}`}>{t ("actions")}</th>
                            </tr></thead>
                            <tbody>
                                {items.map ((role) => (
                                    <tr key={role.id} className={fbAdminTableRow}>
                                        <td className={fbAdminTableCellPrimary}>
                                            <Link className={fbLink} href={`/admin/roles/${role.id}`}>{role.name}</Link>
                                            {role.is_protected ? <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">{t ("roles_protected_badge")}</span> : null}
                                        </td>
                                        <td className={fbAdminTableCell}>{role.guard_name}</td>
                                        <td className={fbAdminTableCell}>{role.permissions?.length ?? 0}</td>
                                        <td className={`${fbAdminTableCell} whitespace-nowrap`}>{formatStamp (role.created_at)}</td>
                                        <td className={`${fbAdminTableCell} ${fbAdminTableCellActions}`}>
                                            <div className={fbAdminTableActions}>
                                                <AdminRowButton icon="view" href={`/admin/roles/${role.id}`}>{t ("view")}</AdminRowButton>
                                                {can ("role.update") && ! role.is_protected ? <AdminRowButton icon="edit" href={`/admin/roles/${role.id}/edit`}>{t ("edit")}</AdminRowButton> : null}
                                                {can ("role.delete") && ! role.is_protected && ! role.users_count ? <AdminRowButton icon="delete" onClick={() => setConfirmId (role.id)}>{t ("delete")}</AdminRowButton> : null}
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
            <AdminConfirmModal open={confirmId !== ""} titleId="roles-confirm-title" title={t ("confirm")} message={t ("confirm_delete")} confirmLabel={t ("delete")} danger onClose={() => setConfirmId ("")} onConfirm={() => { const id = confirmId; setConfirmId (""); void runJob (() => deleteAdminRole (id)); }} />
            <AdminImportModal open={importOpen} i18nPrefix="roles" accept=".csv,.txt,.xls,.xlsx" onClose={() => setImportOpen (false)} onSample={() => downloadRoleImportSample ()} onConfirm={(file) => { setImportOpen (false); void runJob (() => importAdminRoles (file)); }} />
            <AdminExportModal open={exportOpen} i18nPrefix="roles" formats={["csv", "xlsx"]} onClose={() => setExportOpen (false)} onConfirm={(format) => { const nextFormat = format as AclExportFormat; setExportType (nextFormat); setExportOpen (false); void runJob (() => exportAdminRoles ({ q, guard, order, currentPage: page, }, nextFormat)); }} />
        </AdminFrame>
    );
};

export const AdminRoleFormPage = ({ mode, }: { mode: "create" | "edit"; }): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const [form, setForm] = useState<AdminRoleFormPayload> (createDefaultRoleForm ());
    const [permissions, setPermissions] = useState<AdminPermission[]> ([]);
    const [permissionsLoading, setPermissionsLoading] = useState (true);
    const [error, setError] = useState ("");
    const [saving, setSaving] = useState (false);
    const [ready, setReady] = useState (mode !== "edit");
    const id = String (router.query.id || "");

    useEffect (() =>
    {
        void fetchAdminPermissions ({ limitPage: 100, }).then ((result) =>
        {
            setPermissions (parsePaginatedResult<AdminPermission> (result)?.items ?? []);
            setPermissionsLoading (false);
        });

        if (mode === "edit" && id)
        {
            void getAdminRole (id).then ((result) =>
            {
                if (result.isSuccess)
                {
                    const role = result.data as AdminRole;

                    setForm ({
                        name: role.name,
                        guard_name: role.guard_name === "api" ? "api" : "web",
                        permission_ids: role.permissions.map ((item) => item.id),
                    });
                }

                setReady (true);
            });
        }
    }, [mode, id]);

    async function submit (event: FormEvent): Promise<void>
    {
        event.preventDefault ();
        setSaving (true);
        const result = mode === "create" ? await createAdminRole (form) : await updateAdminRole (id, form);

        setSaving (false);

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        void router.push (mode === "create" ? "/admin/roles" : `/admin/roles/${id}`);
    }

    if (! canRender)
    {
        return null;
    }

    return (
        <AdminFrame title={t (mode === "create" ? "roles_create" : "roles_edit")} description={t (mode === "create" ? "roles_create_description" : "roles_edit_description")}>
            <AlertError message={error} />
            {! ready ? <AdminFormSkeleton fields={4} /> : (
            <form className={`${fbCard} max-w-3xl space-y-6`} onSubmit={(event) => void submit (event)}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <FbLabel htmlFor="role-form-name">{t ("name")}</FbLabel>
                        <FbInput id="role-form-name" name="name" icon="none" required placeholder={t ("roles_name_placeholder")} value={form.name} onChange={(event) => setForm ({ ...form, name: event.target.value, })} />
                    </div>
                    <div>
                        <FbLabel htmlFor="role-form-guard">{t ("roles_column_guard")}</FbLabel>
                        <select id="role-form-guard" className={fbInput} value={form.guard_name} onChange={(event) => setForm ({ ...form, guard_name: event.target.value === "api" ? "api" : "web", })}>
                            <option value="web">web</option>
                            <option value="api">api</option>
                        </select>
                    </div>
                </div>
                <AdminPermissionPicker
                    permissions={permissions}
                    value={form.permission_ids}
                    guard={form.guard_name}
                    loading={permissionsLoading}
                    onChange={(permissionIds) => setForm ({ ...form, permission_ids: permissionIds, })}
                />
                <AdminFormActions cancelTo={mode === "create" ? "/admin/roles" : `/admin/roles/${id}`} submitLabel={t ("save")} processing={saving} />
            </form>
            )}
        </AdminFrame>
    );
};

export const AdminRoleShowPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const [role, setRole] = useState<AdminRole | null> (null);
    const [error, setError] = useState ("");
    const id = String (router.query.id || "");

    useEffect (() =>
    {
        if (! id)
        {
            return;
        }

        void getAdminRole (id).then ((result) =>
        {
            if (! result.isSuccess)
            {
                setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

                return;
            }

            setRole (result.data as AdminRole);
        });
    }, [id, t]);

    if (! canRender)
    {
        return null;
    }

    return (
        <AdminFrame title={role?.name || t ("roles")} description={role?.guard_name}>
            <AlertError message={error} />
            {! role && ! error ? <AdminDetailSkeleton fields={4} /> : null}
            {role ? (
                <div className={`${fbCard} space-y-4`}>
                    {role.is_protected ? <p className="text-center"><span className="rounded-full bg-gray-100 px-2.5 py-0.5 text-xs font-medium text-gray-900 dark:bg-gray-700 dark:text-white">{t ("roles_protected_badge")}</span></p> : null}
                    <p className={fbShowLabel}>{t ("roles_permissions_title")}</p>
                    {role.permissions?.length ? (
                        <ul className="flex flex-wrap justify-center gap-2">
                            {role.permissions.map ((permission) => <li key={permission.id} className={`${fbShowChip} font-mono text-xs`}>{permission.name}</li>)}
                        </ul>
                    ) : <p className={`${fbMuted} text-center text-sm`}>{t ("roles_permissions_empty")}</p>}
                    <div className={`${fbAdminShowBack} flex flex-wrap gap-2`}>
                        <FbButton variant="outline" href="/admin/roles">{t ("back_to_roles")}</FbButton>
                        {! role.is_protected ? <FbButton variant="outline" href={`/admin/roles/${role.id}/edit`}>{t ("edit")}</FbButton> : null}
                    </div>
                </div>
            ) : null}
        </AdminFrame>
    );
};
