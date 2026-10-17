export type AdminCrumb = {
    label: string;
    to?: string;
    icon: string;
};

const sectionKeys: Record<string, string> = {
    users: "users",
    roles: "roles",
    permissions: "permissions",
    activities: "activities",
    search: "search",
    settings: "settings",
    dashboard: "dashboard",
};

export function adminPageCrumbs (
    path: string,
    title: string,
    t: (key: string) => string,
): AdminCrumb[]
{
    const parts = path.split ("?")[0]?.split ("/").filter (Boolean) ?? [];
    const home: AdminCrumb = {
        label: t ("home"),
        to: "/admin/dashboard",
        icon: "home",
    };

    if (parts[0] === "notifications")
    {
        return [
            home,
            { label: t ("notifications"), icon: "notifications", },
        ];
    }

    const section = parts[1] ?? "";
    const sectionLabel = sectionKeys[section] ? t (sectionKeys[section]) : title;
    const sectionTo = section ? `/admin/${section}` : "";

    if (parts[0] === "admin" && section === "dashboard")
    {
        return [
            home,
            { label: t ("dashboard"), icon: "dashboard", },
        ];
    }

    if (parts[0] === "admin" && section === "settings")
    {
        return [
            home,
            { label: sectionLabel, to: "/admin/settings/personal", icon: "settings", },
            { label: title, icon: "list", },
        ];
    }

    if (parts[0] === "admin" && section === "search")
    {
        return [
            home,
            { label: sectionLabel, icon: "list", },
        ];
    }

    if (parts[0] === "admin" && parts.length === 2 && section)
    {
        return [
            home,
            { label: sectionLabel, to: sectionTo, icon: section, },
            { label: t ("list"), icon: "list", },
        ];
    }

    if (parts[0] === "admin" && parts.length === 3 && parts[2] === "create")
    {
        return [
            home,
            { label: sectionLabel, to: sectionTo, icon: section, },
            { label: title, icon: "list", },
        ];
    }

    if (parts[0] === "admin" && parts.length === 3)
    {
        return [
            home,
            { label: sectionLabel, to: sectionTo, icon: section, },
            { label: t ("view"), icon: "eye", },
        ];
    }

    if (parts[0] === "admin" && parts.length === 4 && parts[3] === "edit" && parts[2])
    {
        return [
            home,
            { label: sectionLabel, to: sectionTo, icon: section, },
            { label: title, icon: "list", },
        ];
    }

    return [
        home,
        { label: title, icon: "list", },
    ];
}
