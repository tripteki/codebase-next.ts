import { call, type CallResult, } from "@/libs/call";
import {
    buildSettingsFormData,
    buildSettingsPayload,
    settingsUseMultipart,
} from "@/libs/admin-settings-form";
import {
    appendAdminListFilter,
    buildAdminListParams,
} from "@/libs/admin-list-params";
import { adminCall, } from "@/hooks/use-admin-call";
import { UserRoleEnum, } from "@/libs/user-role";
import { buildAdminUserBody, type AdminUserFormPayload, } from "@/types/admin/user";
import type { AdminRoleFormPayload, } from "@/types/admin/role";
import type { AdminPermissionFormPayload, } from "@/types/admin/permission";
import type { AdminSettingDraft, } from "@/types/admin/setting";

export type UserExportFormat = "csv" | "xlsx" | "xls";
export type AclExportFormat = "csv" | "xlsx";

export type AdminUserListQuery = {
    q?: string;
    role?: string;
    status?: string;
    order?: string;
    currentPage?: number;
};

export type AdminRoleListQuery = {
    q?: string;
    guard?: string;
    order?: string;
    currentPage?: number;
};

export type AdminPermissionListQuery = {
    q?: string;
    guard?: string;
    order?: string;
    currentPage?: number;
    limitPage?: number;
};

export type AdminActivityListQuery = {
    q?: string;
    subjectType?: string;
    dateFrom?: string;
    dateTo?: string;
    causer?: string;
    order?: string;
    currentPage?: number;
};

function userListParams (query: AdminUserListQuery): Record<string, string | number>
{
    const params = buildAdminListParams ({
        currentPage: query.currentPage,
        limitPage: 15,
        order: query.order || "created_at:desc",
    });

    appendAdminListFilter (params, "q", query.q);
    appendAdminListFilter (params, "role", query.role);
    appendAdminListFilter (params, "status", query.status, [
        "active",
        "unverified",
        "deactivated",
        "all",
    ]);

    return params;
}

export function fetchAdminAccesses (): Promise<CallResult>
{
    return call ({ url: "/api/v1/users/me/accesses", method: "GET", });
}

export function fetchAdminUsers (query: AdminUserListQuery = {}): Promise<CallResult>
{
    return adminCall ({ path: "/users/", method: "GET", params: userListParams (query), });
}

export function getAdminUser (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/users/${id}`, method: "GET", });
}

export function createAdminUser (payload: AdminUserFormPayload, avatar?: File | null): Promise<CallResult>
{
    return adminCall ({ path: "/users/", method: "POST", data: buildAdminUserBody (payload, avatar), });
}

export function updateAdminUser (id: string, payload: AdminUserFormPayload, avatar?: File | null): Promise<CallResult>
{
    const data = avatar
        ? buildAdminUserBody (payload, avatar)
        : {
            name: payload.name,
            full_name: payload.full_name,
            email: payload.email,
            role: payload.role,
            ...(payload.password
                ? {
                    password: payload.password,
                    password_confirmation: payload.password_confirmation,
                }
                : {}),
        };

    return adminCall ({ path: `/users/${id}`, method: "PUT", data, });
}

export function verifyAdminUser (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/users/verify/${id}`, method: "PUT", });
}

export function activateAdminUser (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/users/activate/${id}`, method: "DELETE", });
}

export function deactivateAdminUser (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/users/deactivate/${id}`, method: "DELETE", });
}

export function forceDeleteAdminUser (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/users/force-delete/${id}`, method: "DELETE", });
}

export function importAdminUsers (file: File): Promise<CallResult>
{
    const formData = new FormData ();

    formData.append ("file", file);

    return adminCall ({ path: "/users/import", method: "POST", data: formData, });
}

export function exportAdminUsers (query: AdminUserListQuery = {}, exportType: UserExportFormat = "csv"): Promise<CallResult>
{
    return adminCall ({
        path: "/users/export",
        method: "POST",
        params: { export_type: exportType, ...userListParams (query), },
    });
}

export function fetchAdminRoles (query: AdminRoleListQuery = {}): Promise<CallResult>
{
    return adminCall ({ path: "/roles/", method: "GET", params: roleListParams (query), });
}

export function getAdminRole (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/roles/${id}`, method: "GET", });
}

export function createAdminRole (payload: AdminRoleFormPayload): Promise<CallResult>
{
    return adminCall ({ path: "/roles/", method: "POST", data: payload, });
}

export function updateAdminRole (id: string, payload: AdminRoleFormPayload): Promise<CallResult>
{
    return adminCall ({ path: `/roles/${id}`, method: "PUT", data: payload, });
}

export function deleteAdminRole (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/roles/${id}`, method: "DELETE", });
}

export function importAdminRoles (file: File): Promise<CallResult>
{
    const formData = new FormData ();

    formData.append ("file", file);

    return adminCall ({ path: "/roles/import", method: "POST", data: formData, });
}

export function exportAdminRoles (query: AdminRoleListQuery = {}, exportType: AclExportFormat = "csv"): Promise<CallResult>
{
    return adminCall ({
        path: "/roles/export",
        method: "POST",
        params: { export_type: exportType, ...roleListParams (query), },
    });
}

function roleListParams (query: AdminRoleListQuery): Record<string, string | number>
{
    const params = buildAdminListParams ({
        currentPage: query.currentPage,
        limitPage: 15,
        order: query.order || "name:asc",
    });

    appendAdminListFilter (params, "q", query.q);
    appendAdminListFilter (params, "guard_name", query.guard, ["web", "api"]);

    return params;
}

export function fetchAdminPermissions (query: AdminPermissionListQuery = {}): Promise<CallResult>
{
    return adminCall ({ path: "/permissions/", method: "GET", params: permissionListParams (query), });
}

export function getAdminPermission (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/permissions/${id}`, method: "GET", });
}

export function createAdminPermission (payload: AdminPermissionFormPayload): Promise<CallResult>
{
    return adminCall ({ path: "/permissions/", method: "POST", data: payload, });
}

export function updateAdminPermission (id: string, payload: AdminPermissionFormPayload): Promise<CallResult>
{
    return adminCall ({ path: `/permissions/${id}`, method: "PUT", data: payload, });
}

export function deleteAdminPermission (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/permissions/${id}`, method: "DELETE", });
}

export function importAdminPermissions (file: File): Promise<CallResult>
{
    const formData = new FormData ();

    formData.append ("file", file);

    return adminCall ({ path: "/permissions/import", method: "POST", data: formData, });
}

export function exportAdminPermissions (query: AdminPermissionListQuery = {}, exportType: AclExportFormat = "csv"): Promise<CallResult>
{
    return adminCall ({
        path: "/permissions/export",
        method: "POST",
        params: { export_type: exportType, ...permissionListParams (query), },
    });
}

function permissionListParams (query: AdminPermissionListQuery): Record<string, string | number>
{
    const params = buildAdminListParams ({
        currentPage: query.currentPage,
        limitPage: query.limitPage ?? 15,
        order: query.order || "name:asc",
    });

    appendAdminListFilter (params, "q", query.q);
    appendAdminListFilter (params, "guard_name", query.guard, ["web", "api"]);

    return params;
}

export function fetchAdminActivities (query: AdminActivityListQuery = {}): Promise<CallResult>
{
    const params = buildAdminListParams ({
        currentPage: query.currentPage,
        limitPage: 15,
        order: query.order || "created_at:desc",
    });

    appendAdminListFilter (params, "q", query.q);
    appendAdminListFilter (params, "subject_type", query.subjectType);
    appendAdminListFilter (params, "date_from", query.dateFrom);
    appendAdminListFilter (params, "date_to", query.dateTo);
    appendAdminListFilter (params, "causer", query.causer);

    return adminCall ({ path: "/activities/", method: "GET", params, });
}

export function getAdminActivity (id: string): Promise<CallResult>
{
    return adminCall ({ path: `/activities/${id}`, method: "GET", });
}

export function fetchAdminDashboard (period = "30d"): Promise<CallResult>
{
    return adminCall ({ path: "/dashboard/", method: "GET", params: { period, }, });
}

export function searchAdmin (q: string, category = "all"): Promise<CallResult>
{
    return adminCall ({ path: "/search/", method: "GET", params: { q, category, }, });
}

export function fetchAdminSettings (): Promise<CallResult>
{
    return adminCall ({ path: "/settings/", method: "GET", });
}

export function saveAdminSettings (rows: AdminSettingDraft[]): Promise<CallResult>
{
    const multipart = settingsUseMultipart (rows);

    return adminCall ({
        path: "/settings/",
        method: multipart ? "POST" : "PUT",
        data: multipart ? buildSettingsFormData (rows) : buildSettingsPayload (rows),
    });
}

export { UserRoleEnum, };
