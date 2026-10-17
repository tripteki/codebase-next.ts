import { type ReactElement, useMemo, useState, } from "react";
import { useTranslation, } from "next-i18next/pages";

import FbCheckbox from "@/components/flowbite/fb-checkbox";
import FbInput from "@/components/flowbite/fb-input";
import { groupAdminPermissions, } from "@/libs/admin-permission-groups";
import { fbMuted, } from "@/libs/flowbite-classes";
import type { AdminPermission, } from "@/types/admin/permission";

const AdminPermissionPicker = ({
    permissions,
    value,
    guard,
    loading = false,
    onChange,
}: {
    permissions: AdminPermission[];
    value: string[];
    guard: string;
    loading?: boolean;
    onChange: (ids: string[]) => void;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");
    const [search, setSearch] = useState ("");
    const groups = useMemo (
        () => groupAdminPermissions (permissions, guard, search),
        [permissions, guard, search]
    );

    function isChecked (id: string): boolean
    {
        return value.includes (id);
    }

    function setChecked (id: string, checked: boolean): void
    {
        if (checked && ! isChecked (id))
        {
            onChange ([ ...value, id, ]);

            return;
        }

        if (! checked)
        {
            onChange (value.filter ((item) => item !== id));
        }
    }

    function permissionIds (items: AdminPermission[]): string[]
    {
        return items.map ((item) => item.id);
    }

    function groupIndeterminate (ids: string[]): boolean
    {
        const selected = ids.filter ((id) => isChecked (id)).length;

        return selected > 0 && selected < ids.length;
    }

    function toggleGroup (ids: string[], checked: boolean): void
    {
        if (checked)
        {
            onChange ([...new Set ([ ...value, ...ids, ])]);

            return;
        }

        onChange (value.filter ((id) => ! ids.includes (id)));
    }

    return (
        <div className="space-y-3">
            <div className="flex flex-col gap-2 sm:flex-row sm:items-center sm:justify-between">
                <div>
                    <h3 className="text-sm font-semibold text-gray-900 dark:text-white">{t ("roles_permissions_title")}</h3>
                    <p className={fbMuted}>{t ("roles_permissions_description")}</p>
                </div>
                <FbInput type="search" className="sm:max-w-xs" value={search} placeholder={t ("roles_permissions_search")} onChange={(event) => setSearch (event.target.value)} />
            </div>
            {loading ? (
                <div className="h-24 animate-pulse rounded-lg border border-dashed border-gray-200 dark:border-gray-700" />
            ) : ! groups.length ? (
                <p className={`${fbMuted} rounded-lg border border-dashed border-gray-200 p-4 dark:border-gray-700`}>
                    {t ("roles_permissions_empty")}
                </p>
            ) : (
                <div className="space-y-4">
                    {groups.map ((group) =>
                    {
                        const ids = permissionIds (group.permissions);

                        return (
                            <div key={group.key} className="rounded-lg border border-gray-200 p-4 dark:border-gray-700">
                                <label className="mb-3 flex items-center gap-2 text-sm font-medium text-gray-900 dark:text-white">
                                    <FbCheckbox
                                        checked={ids.length > 0 && ids.every ((id) => isChecked (id))}
                                        indeterminate={groupIndeterminate (ids)}
                                        onCheckedChange={(checked) => toggleGroup (ids, checked)}
                                    />
                                    <span className="capitalize">{group.key}</span>
                                </label>
                                <div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3">
                                    {group.permissions.map ((permission) => (
                                        <label key={permission.id} className="flex items-center gap-2 text-sm text-gray-700 dark:text-gray-300">
                                            <FbCheckbox checked={isChecked (permission.id)} onCheckedChange={(checked) => setChecked (permission.id, checked)} />
                                            {permission.name}
                                        </label>
                                    ))}
                                </div>
                            </div>
                        );
                    })}
                </div>
            )}
        </div>
    );
};

export default AdminPermissionPicker;
