export type AdminNavigationItem = {
    key: string;
    to: string;
    permission?: string;
};

export const ADMIN_NAVIGATION: AdminNavigationItem[] = [
    { key: "dashboard", to: "/admin/dashboard", },
    { key: "users", to: "/admin/users", permission: "user.view", },
    { key: "roles", to: "/admin/roles", permission: "role.view", },
    { key: "permissions", to: "/admin/permissions", permission: "permission.view", },
    { key: "activities", to: "/admin/activities", permission: "activity.view", },
];

export const ADMIN_TOP_NAVIGATION: AdminNavigationItem[] = [
    { key: "dashboard", to: "/admin/dashboard", },
];

export const ADMIN_NAVIGATION_GROUPS: Array<{ key: string; items: AdminNavigationItem[]; }> = [
    {
        key: "nav_accounts",
        items: [
            { key: "users", to: "/admin/users", permission: "user.view", },
        ],
    },
    {
        key: "nav_access",
        items: [
            { key: "roles", to: "/admin/roles", permission: "role.view", },
            { key: "permissions", to: "/admin/permissions", permission: "permission.view", },
        ],
    },
    {
        key: "nav_log",
        items: [
            { key: "activities", to: "/admin/activities", permission: "activity.view", },
        ],
    },
];
