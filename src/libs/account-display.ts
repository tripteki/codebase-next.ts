import type { UserMeDto, } from "@/types/admin/settings";

export type SessionUser = Pick<UserMeDto, "name" | "email" | "profile">;

export function resolveAccountDisplayName (
    user: SessionUser | null | undefined,
    fallback = "",
): string
{
    const fullName = user?.profile?.full_name?.trim ();

    if (fullName)
    {
        return fullName;
    }

    const name = user?.name?.trim ();

    if (name)
    {
        return name;
    }

    const email = user?.email?.trim ();

    if (email)
    {
        return email.split ("@")[0] || email;
    }

    return fallback;
}

export function resolveAccountAvatarUrl (
    user: SessionUser | null | undefined,
): string | null
{
    const avatarUrl = user?.profile?.avatar_url?.trim ();

    return avatarUrl || null;
}

export function resolveAccountInitials (displayName: string): string
{
    const label = displayName.trim ();

    if (! label)
    {
        return "?";
    }

    return label.charAt (0).toUpperCase ();
}

export function resolveEmailPrefix (email?: string | null): string
{
    const value = email?.trim () ?? "";

    if (! value)
    {
        return "";
    }

    const prefix = value.split ("@")[0];

    return prefix || value;
}

function isSessionUserShape (value: object): boolean
{
    return "email" in value || "name" in value || "profile" in value;
}

export function resolveSessionUser (
    session: { user?: unknown; } | null | undefined,
): SessionUser | null
{
    if (! session || typeof session !== "object")
    {
        return null;
    }

    const nested = session.user;

    if (nested && typeof nested === "object")
    {
        return nested as SessionUser;
    }

    if (isSessionUserShape (session))
    {
        return session as SessionUser;
    }

    return null;
}
