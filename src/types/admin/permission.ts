export type AdminPermission = {
    id: string;
    name: string;
    guard_name: string;
    is_protected: boolean;
    created_at: string | null;
    updated_at: string | null;
};

export type AdminPermissionFormPayload = {
    name: string;
    guard_name: "web" | "api";
};

export function createDefaultPermissionForm (): AdminPermissionFormPayload
{
    return {
        name: "",
        guard_name: "web",
    };
}
