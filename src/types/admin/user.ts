import { UserRoleEnum, } from "@/libs/user-role";

export const ADMIN_ASSIGNABLE_ROLES = [
    UserRoleEnum.User,
    UserRoleEnum.Admin,
    UserRoleEnum.Superadmin,
] as const;

export type AdminUser = {
    id: string;
    name?: string | null;
    full_name?: string | null;
    email: string;
    role?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
    email_verified_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at: string | null;
};

export type AdminUserFormPayload = {
    name: string;
    full_name: string;
    email: string;
    password: string;
    password_confirmation: string;
    role: string;
};

export function assignableAdminRoles (isSuperadmin: boolean): readonly (typeof ADMIN_ASSIGNABLE_ROLES)[number][]
{
    return isSuperadmin ? ADMIN_ASSIGNABLE_ROLES : [UserRoleEnum.User];
}

export function canMutateAdminAccount (
    actorId: string | undefined,
    actorIsSuperadmin: boolean,
    target: Pick<AdminUser, "id" | "role">
): boolean
{
    if (actorId && target.id === actorId)
    {
        return false;
    }

    const privileged = target.role === UserRoleEnum.Admin || target.role === UserRoleEnum.Superadmin;

    return actorIsSuperadmin || ! privileged;
}

export function buildAdminUserBody (
    payload: AdminUserFormPayload,
    avatar?: File | null
): AdminUserFormPayload | FormData
{
    if (! (avatar instanceof File) || avatar.size === 0)
    {
        return payload;
    }

    const formData = new FormData ();

    formData.append ("name", payload.name);
    formData.append ("full_name", payload.full_name);
    formData.append ("email", payload.email);
    formData.append ("role", payload.role);

    if (payload.password)
    {
        formData.append ("password", payload.password);
        formData.append ("password_confirmation", payload.password_confirmation);
    }

    formData.append ("avatar", avatar);

    return formData;
}

const EMAIL_PATTERN = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export function validateAdminUserForm (
    form: Pick<AdminUserFormPayload, "full_name" | "email" | "password" | "password_confirmation">,
    mode: "create" | "edit",
    messages: { emailInvalid: string; passwordMin: string; passwordMismatch: string; fullNameRequired: string; }
): Partial<Record<"full_name" | "email" | "password" | "password_confirmation", string>>
{
    const errors: Partial<Record<"full_name" | "email" | "password" | "password_confirmation", string>> = {};
    const email = form.email.trim ();
    const passwordRequired = mode === "create" || form.password.length > 0 || form.password_confirmation.length > 0;

    if (! form.full_name.trim ())
    {
        errors.full_name = messages.fullNameRequired;
    }

    if (email && ! EMAIL_PATTERN.test (email))
    {
        errors.email = messages.emailInvalid;
    }

    if (passwordRequired && form.password.length < 8)
    {
        errors.password = messages.passwordMin;
    }

    if (passwordRequired && form.password !== form.password_confirmation)
    {
        errors.password_confirmation = messages.passwordMismatch;
    }

    return errors;
}

export function createDefaultUserForm (): AdminUserFormPayload
{
    return {
        name: "",
        full_name: "",
        email: "",
        password: "",
        password_confirmation: "",
        role: UserRoleEnum.User,
    };
}

export function userToFormPayload (user: AdminUser): AdminUserFormPayload
{
    return {
        name: user.name?.trim () || "",
        full_name: user.full_name?.trim () || "",
        email: user.email,
        password: "",
        password_confirmation: "",
        role: user.role || UserRoleEnum.User,
    };
}

export function resolveUserDisplayName (
    user: Pick<AdminUser, "full_name" | "name" | "email">
): string
{
    return user.full_name?.trim () || user.name?.trim () || user.email;
}

export type UserAccountStatus = "deactivated" | "unverified" | "active";

export function resolveUserAccountStatus (
    user: Pick<AdminUser, "deleted_at" | "email_verified_at">
): UserAccountStatus
{
    if (user.deleted_at)
    {
        return "deactivated";
    }

    if (! user.email_verified_at)
    {
        return "unverified";
    }

    return "active";
}

export function userStatusTone (status: UserAccountStatus): "active" | "pending" | "danger"
{
    if (status === "unverified")
    {
        return "pending";
    }

    if (status === "deactivated")
    {
        return "danger";
    }

    return "active";
}
