import { type ReactElement, useEffect, useRef, useState, } from "react";
import Link from "next/link";
import { useSession, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import { useAdminAccess, } from "@/hooks/use-admin-access";
import {
    resolveAccountAvatarUrl,
    resolveAccountDisplayName,
    resolveAccountInitials,
    resolveEmailPrefix,
    resolveSessionUser,
} from "@/libs/account-display";

const AdminAccountDropdown = ({
    onLogout,
}: {
    onLogout: () => void;
}): ReactElement =>
{
    const { t: tCommon, } = useTranslation ("common");
    const { t: tAuth, } = useTranslation ("auth");
    const { data, } = useSession ();
    const { roles, } = useAdminAccess ();
    const [open, setOpen] = useState (false);
    const [mounted, setMounted] = useState (false);
    const root = useRef<HTMLDivElement | null> (null);
    const user = resolveSessionUser (data);
    const userLabel = resolveAccountDisplayName (user, tCommon ("profile"));
    const avatarUrl = resolveAccountAvatarUrl (user);
    const emailPrefix = resolveEmailPrefix (user?.email);
    const primaryRole = roles[0]?.trim () ?? "";
    const translatedRole = primaryRole ? tCommon (`role_${primaryRole}`) : "";
    const roleLabel = ! primaryRole
        ? ""
        : translatedRole === `role_${primaryRole}` || translatedRole.endsWith (`.role_${primaryRole}`)
            ? primaryRole
            : translatedRole;
    const initials = mounted ? resolveAccountInitials (userLabel) : "·";

    useEffect (() =>
    {
        setMounted (true);

        function onPointerDown (event: PointerEvent): void
        {
            const target = event.target;

            if (! (target instanceof Node) || ! root.current?.contains (target))
            {
                setOpen (false);
            }
        }

        document.addEventListener ("pointerdown", onPointerDown);

        return (): void =>
        {
            document.removeEventListener ("pointerdown", onPointerDown);
        };
    }, []);

    function avatar (): ReactElement
    {
        return (
            <span className="inline-flex h-8 w-8 shrink-0 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-xs font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                {avatarUrl ? <img src={avatarUrl} alt={userLabel} className="h-full w-full object-cover" /> : <span>{initials}</span>}
            </span>
        );
    }

    return (
        <div ref={root} className="relative">
            <button
                type="button"
                className="inline-flex items-center gap-2 rounded-full border border-transparent bg-slate-100/90 px-1.5 py-1 transition-colors hover:border-slate-200 hover:bg-white dark:bg-slate-800 dark:hover:border-slate-600 dark:hover:bg-slate-700"
                aria-expanded={open}
                aria-label={userLabel}
                data-test="account-dropdown-toggle"
                onClick={(event) =>
                {
                    event.stopPropagation ();
                    setOpen ((value) => ! value);
                }}
            >
                {avatar ()}
                <span className="hidden min-w-0 max-w-[10.5rem] flex-col items-start text-left leading-tight xl:flex">
                    <span className="w-full truncate text-xs font-semibold text-slate-900 dark:text-white">{userLabel}</span>
                    {emailPrefix ? <span className="w-full truncate text-[0.7rem] text-slate-500 dark:text-slate-400">{emailPrefix}</span> : null}
                    {roleLabel ? <span className="w-full truncate text-[0.7rem] capitalize text-slate-500 dark:text-slate-400">{roleLabel}</span> : null}
                </span>
                <svg className="mr-1 hidden h-3 w-3 shrink-0 text-slate-500 dark:text-slate-400 xl:inline" xmlns="http://www.w3.org/2000/svg" fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                    <path d="M7.247 11.14 2.451 5.658C1.885 5.013 2.345 4 3.204 4h9.592a1 1 0 0 1 .753 1.659l-4.796 5.48a1 1 0 0 1-1.506 0z" />
                </svg>
            </button>
            {open ? (
                <div className="absolute end-0 top-12 z-50 w-[15.5rem] overflow-hidden rounded-xl border border-slate-200/90 bg-white text-sm shadow-lg dark:border-slate-600 dark:bg-slate-800" onClick={(event) => event.stopPropagation ()}>
                    <div className="border-b border-slate-100 px-3.5 py-3.5 text-center dark:border-slate-700">
                        <span className="inline-flex h-14 w-14 items-center justify-center overflow-hidden rounded-full bg-slate-200 text-base font-semibold text-slate-700 dark:bg-slate-700 dark:text-slate-200">
                            {avatarUrl ? <img src={avatarUrl} alt={userLabel} className="h-full w-full object-cover" /> : <span>{initials}</span>}
                        </span>
                        <div className="mt-3 truncate text-sm font-semibold text-slate-900 dark:text-white">{userLabel}</div>
                        {emailPrefix ? <div className="mt-0.5 truncate text-xs text-slate-500 dark:text-slate-400">{emailPrefix}</div> : null}
                        {roleLabel ? (
                            <div className="mt-1.5">
                                <span className="inline-flex max-w-full truncate rounded-full bg-slate-100 px-2 py-0.5 text-[0.65rem] font-semibold uppercase tracking-wide text-slate-600 dark:bg-slate-700 dark:text-slate-300">{roleLabel}</span>
                            </div>
                        ) : null}
                        <Link href="/admin/settings/personal" className="mt-3 inline-flex text-sm font-medium underline" data-test="account-menu-settings" onClick={() => setOpen (false)}>
                            {tCommon ("profile_settings")}
                        </Link>
                    </div>
                    <div className="p-2">
                        <Link href="/admin/dashboard" className="flex items-center gap-2.5 rounded-lg px-2.5 py-2 text-sm font-medium text-slate-700 hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-slate-700/70" onClick={() => setOpen (false)}>
                            {tCommon ("dashboard")}
                        </Link>
                    </div>
                    <div className="border-t border-slate-100 p-2 dark:border-slate-700">
                        <button
                            type="button"
                            className="flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm font-medium text-rose-600 hover:bg-rose-50 dark:text-rose-400 dark:hover:bg-rose-950/40"
                            data-test="logout-button"
                            onClick={() =>
                            {
                                setOpen (false);
                                onLogout ();
                            }}
                        >
                            {tAuth ("logout")}
                        </button>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default AdminAccountDropdown;
