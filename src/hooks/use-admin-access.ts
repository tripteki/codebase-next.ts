import { useEffect, useState, } from "react";

import { fetchAdminAccesses, } from "@/libs/admin-api";
import { UserRoleEnum, } from "@/libs/user-role";

export type AdminAccess = {
    permissions: string[];
    roles: string[];
};

export function useAdminAccess (): AdminAccess & {
    can: (permission?: string) => boolean;
    loaded: boolean;
}
{
    const [access, setAccess] = useState<AdminAccess> ({ permissions: [], roles: [], });
    const [loaded, setLoaded] = useState (false);

    useEffect (() =>
    {
        void fetchAdminAccesses ().then ((result) =>
        {
            if (! result.isSuccess)
            {
                setLoaded (true);

                return;
            }

            const payload = result.data ?? {};

            setAccess ({
                permissions: Array.isArray (payload.permissions) ? payload.permissions : [],
                roles: Array.isArray (payload.roles) ? payload.roles : [],
            });
            setLoaded (true);
        });
    }, []);

    function can (permission?: string): boolean
    {
        if (! permission || access.roles.includes (UserRoleEnum.Superadmin))
        {
            return true;
        }

        return access.permissions.includes (permission);
    }

    return { ...access, can, loaded, };
}
