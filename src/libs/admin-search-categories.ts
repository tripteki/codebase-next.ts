export const ADMIN_SEARCH_CATEGORIES = [
    { key: "all", permission: "", },
    { key: "users", permission: "user.view", },
    { key: "roles", permission: "role.view", },
    { key: "permissions", permission: "permission.view", },
    { key: "activities", permission: "activity.view", },
] as const;

export type AdminSearchCategory = (typeof ADMIN_SEARCH_CATEGORIES)[number]["key"];
