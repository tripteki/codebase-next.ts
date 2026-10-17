const ACTIVITY_SUBJECT_ROUTES: Record<string, { path: (id: string) => string; permission: string; }> = {
    User: {
        path: (id) => `/admin/users/${id}`,
        permission: "user.view",
    },
    Role: {
        path: (id) => `/admin/roles/${id}`,
        permission: "role.view",
    },
    Permission: {
        path: (id) => `/admin/permissions/${id}`,
        permission: "permission.view",
    },
};

type CanAccess = (permission: string) => boolean;

export function resolveActivitySubjectAdminPath (
    subjectType: string | null | undefined,
    subjectId: string | null | undefined,
    can: CanAccess
): string | null
{
    const label = subjectType?.trim ();
    const id = subjectId?.trim ();

    if (! label || ! id)
    {
        return null;
    }

    const route = ACTIVITY_SUBJECT_ROUTES[label];

    return route && can (route.permission) ? route.path (id) : null;
}

export function resolveActivityCauserAdminPath (
    causerId: string | null | undefined,
    can: CanAccess
): string | null
{
    const id = causerId?.trim ();

    if (! id || ! can ("user.view"))
    {
        return null;
    }

    return `/admin/users/${id}`;
}
