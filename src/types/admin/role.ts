export type AdminRolePermission = {
    id: string;
    name: string;
    guard_name: string;
};

export type AdminRole = {
    id: string;
    name: string;
    guard_name: string;
    permissions: AdminRolePermission[];
    is_protected: boolean;
    users_count: number;
    created_at: string | null;
    updated_at: string | null;
};

export type AdminRoleFormPayload = {
    name: string;
    guard_name: "web" | "api";
    permission_ids: string[];
};

export function createDefaultRoleForm (): AdminRoleFormPayload
{
    return {
        name: "",
        guard_name: "web",
        permission_ids: [],
    };
}
