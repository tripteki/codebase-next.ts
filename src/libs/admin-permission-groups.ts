import type { AdminPermission, } from "@/types/admin/permission";

export type AdminPermissionGroup = {
    key: string;
    permissions: AdminPermission[];
};

export function groupAdminPermissions (
    permissions: AdminPermission[],
    guard: string,
    search: string
): AdminPermissionGroup[]
{
    const term = search.trim ().toLowerCase ();
    const buckets = new Map<string, AdminPermission[]> ();

    for (const permission of permissions)
    {
        if (guard && permission.guard_name !== guard)
        {
            continue;
        }

        if (term && ! permission.name.toLowerCase ().includes (term))
        {
            continue;
        }

        const key = permission.name.includes (".")
            ? (permission.name.split (".")[0] || "other")
            : "other";
        const bucket = buckets.get (key) ?? [];

        bucket.push (permission);
        buckets.set (key, bucket);
    }

    return [...buckets.entries ()]
        .sort ((left, right) => left[0].localeCompare (right[0]))
        .map (([key, items]) => ({
            key,
            permissions: [...items].sort ((left, right) => left.name.localeCompare (right.name)),
        }));
}
