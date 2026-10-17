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
import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import FbButton from "@/components/flowbite/fb-button";
import FbInput from "@/components/flowbite/fb-input";
import FbLabel from "@/components/flowbite/fb-label";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import { applyPaginatedResult, useAdminListState, } from "@/hooks/use-admin-list-state";
import {
    createAdminPermission,
    deleteAdminPermission,
    exportAdminPermissions,
    type AclExportFormat,
    fetchAdminPermissions,
    getAdminPermission,
    importAdminPermissions,
    updateAdminPermission,
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
    fbShowLabel,
    fbShowValue,
} from "@/libs/flowbite-classes";
import { downloadPermissionImportSample, } from "@/libs/samples/permissions";
import { createDefaultPermissionForm, type AdminPermission, type AdminPermissionFormPayload, } from "@/types/admin/permission";

const listDefaults = { q: "", guard: "", order: "name:asc", page: "1", };

export const AdminPermissionsPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { can, } = useAdminAccess ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const { items, setItems, meta, setMeta, isLoading, setIsLoading, } = useAdminListState<AdminPermission> ();
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
            void router.replace ({ pathname: "/admin/permissions", query, }, undefined, { shallow: true, });
        }

        setPage (nextPage);
        setIsLoading (true);
        const result = await fetchAdminPermissions ({ q: nextQ, guard: nextGuard, order: nextOrder, currentPage: nextPage, });

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

    if (! canRender) return null;

    return (
        <AdminFrame
            title={t ("permissions")}
            description={t ("permissions_description")}
            refreshScopes={["permissions"]}
            onRefresh={() => void load ()}
            actions={(
                <>
                    {can ("permission.import") ? <FbButton variant="tertiary" size="xs" type="button" onClick={() => setImportOpen (true)}>{t ("import_file")}</FbButton> : null}
                    {can ("permission.export") ? <FbButton variant="secondary" size="xs" type="button" onClick={() => setExportOpen (true)}>{t ("export")}</FbButton> : null}
                    {can ("permission.create") ? <FbButton size="xs" href="/admin/permissions/create">{t ("permissions_create")}</FbButton> : null}
                </>
            )}
        >
            <AlertSuccess message={message} />
            <AlertError message={error} />
            <div className={fbAdminIndexShell}>
            <div className={fbAdminIndexToolbar}>
                <div className="min-w-0 max-w-xl flex-1" role="search">
                    <label htmlFor="permissions-search" className="sr-only">{t ("search")}</label>
                    <AdminSearchInput
                        id="permissions-search"
                        placeholder={t ("permissions_search_placeholder")}
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
                    <label className="mb-2 block text-sm font-medium text-gray-900 dark:text-white">{t ("permissions_column_guard")}</label>
                    <select className={fbSelect} value={guard} onChange={(event) => { const nextGuard = event.target.value; setGuard (nextGuard); void load (1, order, nextGuard); }}>
                        <option value="">{t ("permissions_filter_all")}</option>
                        <option value="web">web</option>
                        <option value="api">api</option>
                    </select>
                </AdminListFilterPanel>
            </div>
            {isLoading ? <AdminTableSkeleton cols={4} /> : (
                <div className={fbAdminIndexScroll}>
                    {items.length === 0 ? (
                        <div className="px-6 py-8 text-center"><p className={fbMuted}>{t ("permissions_empty")}</p></div>
                    ) : (
                        <table className={fbAdminTable}>
                            <thead className={fbAdminTableHead}><tr>
                                <AdminSortableTableHead label={t ("name")} field="name" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <AdminSortableTableHead label={t ("permissions_column_guard")} field="guard_name" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <AdminSortableTableHead label={t ("created_at")} field="created_at" sort={order} onSort={(field) => { const nextOrder = toggleAdminListOrder (order, field); setOrder (nextOrder); void load (1, nextOrder); }} />
                                <th className={`${fbAdminTableHeadCell} ${fbAdminTableHeadActions}`}>{t ("actions")}</th>
                            </tr></thead>
                            <tbody>
                                {items.map ((permission) => (
                                    <tr key={permission.id} className={fbAdminTableRow}>
                                        <td className={fbAdminTableCellPrimary}>
                                            <Link className={fbLink} href={`/admin/permissions/${permission.id}`}>{permission.name}</Link>
                                            {permission.is_protected ? <span className="ml-2 rounded bg-gray-100 px-2 py-0.5 text-xs dark:bg-gray-700">{t ("permissions_protected_badge")}</span> : null}
                                        </td>
                                        <td className={fbAdminTableCell}>{permission.guard_name}</td>
                                        <td className={`${fbAdminTableCell} whitespace-nowrap`}>{formatStamp (permission.created_at)}</td>
                                        <td className={`${fbAdminTableCell} ${fbAdminTableCellActions}`}>
                                            <div className={fbAdminTableActions}>
                                                <AdminRowButton icon="view" href={`/admin/permissions/${permission.id}`}>{t ("view")}</AdminRowButton>
                                                {can ("permission.update") && ! permission.is_protected ? <AdminRowButton icon="edit" href={`/admin/permissions/${permission.id}/edit`}>{t ("edit")}</AdminRowButton> : null}
                                                {can ("permission.delete") && ! permission.is_protected ? <AdminRowButton icon="delete" onClick={() => setConfirmId (permission.id)}>{t ("delete")}</AdminRowButton> : null}
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
            <AdminConfirmModal open={confirmId !== ""} titleId="permissions-confirm-title" title={t ("confirm")} message={t ("confirm_delete")} confirmLabel={t ("delete")} danger onClose={() => setConfirmId ("")} onConfirm={() => { const id = confirmId; setConfirmId (""); void runJob (() => deleteAdminPermission (id)); }} />
            <AdminImportModal open={importOpen} i18nPrefix="permissions" accept=".csv,.txt,.xls,.xlsx" onClose={() => setImportOpen (false)} onSample={() => downloadPermissionImportSample ()} onConfirm={(file) => { setImportOpen (false); void runJob (() => importAdminPermissions (file)); }} />
            <AdminExportModal open={exportOpen} i18nPrefix="permissions" formats={["csv", "xlsx"]} onClose={() => setExportOpen (false)} onConfirm={(format) => { const nextFormat = format as AclExportFormat; setExportType (nextFormat); setExportOpen (false); void runJob (() => exportAdminPermissions ({ q, guard, order, currentPage: page, }, nextFormat)); }} />
        </AdminFrame>
    );
};

export const AdminPermissionFormPage = ({ mode, }: { mode: "create" | "edit"; }): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const [form, setForm] = useState<AdminPermissionFormPayload> (createDefaultPermissionForm ());
    const [error, setError] = useState ("");
    const [saving, setSaving] = useState (false);
    const [ready, setReady] = useState (mode !== "edit");
    const id = String (router.query.id || "");

    useEffect (() =>
    {
        if (mode !== "edit" || ! id) return;

        void getAdminPermission (id).then ((result) =>
        {
            if (result.isSuccess)
            {
                const permission = result.data as AdminPermission;

                setForm ({ name: permission.name, guard_name: permission.guard_name === "api" ? "api" : "web", });
            }

            setReady (true);
        });
    }, [mode, id]);

    async function submit (event: FormEvent): Promise<void>
    {
        event.preventDefault ();
        setSaving (true);
        const result = mode === "create" ? await createAdminPermission (form) : await updateAdminPermission (id, form);

        setSaving (false);

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        void router.push (mode === "create" ? "/admin/permissions" : `/admin/permissions/${id}`);
    }

    if (! canRender) return null;

    return (
        <AdminFrame title={t (mode === "create" ? "permissions_create" : "permissions_edit")} description={t (mode === "create" ? "permissions_create_description" : "permissions_edit_description")}>
            <AlertError message={error} />
            {! ready ? <AdminFormSkeleton fields={3} /> : (
            <form className={`${fbCard} max-w-3xl space-y-6`} onSubmit={(event) => void submit (event)}>
                <div className="grid gap-4 sm:grid-cols-2">
                    <div>
                        <FbLabel htmlFor="permission-form-name">{t ("name")}</FbLabel>
                        <FbInput id="permission-form-name" name="name" icon="none" required placeholder={t ("permissions_name_placeholder")} value={form.name} onChange={(event) => setForm ({ ...form, name: event.target.value, })} />
                    </div>
                    <div>
                        <FbLabel htmlFor="permission-form-guard">{t ("permissions_column_guard")}</FbLabel>
                        <select id="permission-form-guard" className={fbInput} value={form.guard_name} onChange={(event) => setForm ({ ...form, guard_name: event.target.value === "api" ? "api" : "web", })}>
                            <option value="web">web</option>
                            <option value="api">api</option>
                        </select>
                    </div>
                </div>
                <AdminFormActions cancelTo={mode === "create" ? "/admin/permissions" : `/admin/permissions/${id}`} submitLabel={t ("save")} processing={saving} />
            </form>
            )}
        </AdminFrame>
    );
};

export const AdminPermissionShowPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const [permission, setPermission] = useState<AdminPermission | null> (null);
    const [error, setError] = useState ("");
    const id = String (router.query.id || "");

    useEffect (() =>
    {
        if (! id) return;

        void getAdminPermission (id).then ((result) =>
        {
            if (! result.isSuccess)
            {
                setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

                return;
            }

            setPermission (result.data as AdminPermission);
        });
    }, [id, t]);

    if (! canRender) return null;

    return (
        <AdminFrame title={permission?.name || t ("permissions")} description={permission?.guard_name}>
            <AlertError message={error} />
            {! permission && ! error ? <AdminDetailSkeleton fields={4} /> : null}
            {permission ? (
                <div className={`${fbCard} grid gap-4 md:grid-cols-2`}>
                    <div>
                        <p className={fbShowLabel}>{t ("name")}</p>
                        <div className={fbShowValue}>
                            {permission.name}
                            {permission.is_protected ? <span className="ms-2 rounded bg-white/70 px-2 py-0.5 text-xs dark:bg-gray-800">{t ("permissions_protected_badge")}</span> : null}
                        </div>
                    </div>
                    <div>
                        <p className={fbShowLabel}>{t ("permissions_column_guard")}</p>
                        <p className={fbShowValue}>{permission.guard_name}</p>
                    </div>
                    <div className={`${fbAdminShowBack} flex flex-wrap gap-2 md:col-span-2`}>
                        <FbButton variant="outline" href="/admin/permissions">{t ("back_to_permissions")}</FbButton>
                        {! permission.is_protected ? <FbButton variant="outline" href={`/admin/permissions/${permission.id}/edit`}>{t ("edit")}</FbButton> : null}
                    </div>
                </div>
            ) : null}
        </AdminFrame>
    );
};
