import type { Session, } from "next-auth";

type SessionUser = {
    id?: string | number | null;
    email?: string | null;
};

export const hasValidSession = (session: Session | null | undefined): boolean =>
{
    if (! session)
    {
        return false;
    }

    if (session.error === "RefreshAccessTokenError")
    {
        return false;
    }

    const accessToken = (session as { accessToken?: string | null; jwt?: string | null; }).accessToken
        ?? (session as { jwt?: string | null; }).jwt;

    if (! accessToken || String (accessToken).trim () === "")
    {
        return false;
    }

    const user = session.user as SessionUser | undefined;

    if (! user)
    {
        return false;
    }

    const id = user.id != null ? String (user.id).trim () : "";

    if (id)
    {
        return true;
    }

    const email = user.email?.trim () ?? "";

    return email.length > 0;
};
