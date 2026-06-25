import { ReactElement, } from "react";
import Link from "next/link";
import { useSession, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import { getUserInitials, } from "@/libs/user-initials";
import type { UserMeDto, } from "@/types/admin/settings";

const HeaderProfileLink = (): ReactElement | null =>
{
    const { t, } = useTranslation ("common");
    const { data: session, } = useSession ();
    const user = (session as { user?: UserMeDto; } | null)?.user;
    const avatarUrl = user?.profile?.avatar_url ?? undefined;
    const initials = getUserInitials (
        user?.profile?.full_name ?? user?.name,
        user?.email
    );

    return (
        <Link
            href="/admin/settings"
            aria-label={t ("profile")}
            data-test="profile-link"
            className="rounded-full transition-opacity hover:opacity-80 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[var(--brand-primary)] focus-visible:ring-offset-2"
        >
            <div className="icon-avatar-brand flex h-8 w-8 items-center justify-center overflow-hidden rounded-full text-xs font-medium">
                {avatarUrl ? (
                    <img
                        src={avatarUrl}
                        alt=""
                        className="h-full w-full object-cover"
                    />
                ) : (
                    <span>{initials}</span>
                )}
            </div>
        </Link>
    );
};

export default HeaderProfileLink;
