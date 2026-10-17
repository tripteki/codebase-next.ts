export enum UserRoleEnum
{
    Superadmin = "superadmin",
    Admin = "admin",
    User = "user",
}

export function userRoleValues (): UserRoleEnum[]
{
    return Object.values (UserRoleEnum);
}

export function userRoleNotify (): UserRoleEnum[]
{
    return [
        UserRoleEnum.Superadmin,
        UserRoleEnum.Admin,
    ];
}

export function userRoleActivityReaders (): UserRoleEnum[]
{
    return userRoleNotify ();
}

export function userRoleSystemSettings (): UserRoleEnum[]
{
    return [
        UserRoleEnum.Superadmin,
    ];
}

export function userRolePrivileged (): UserRoleEnum[]
{
    return userRoleNotify ();
}
