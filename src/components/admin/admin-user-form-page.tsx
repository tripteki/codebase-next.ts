import { type FormEvent, type ReactElement, useEffect, useState, } from "react";
import { useSession, } from "next-auth/react";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminConfirmModal from "@/components/admin/admin-confirm-modal";
import AdminDetailSkeleton from "@/components/admin/admin-detail-skeleton";
import AdminFilePicker from "@/components/admin/admin-file-picker";
import AdminFormSkeleton from "@/components/admin/admin-form-skeleton";
import AdminFrame from "@/components/admin/admin-frame";
import AdminStatusDot from "@/components/admin/admin-status-dot";
import AdminUserSteps from "@/components/admin/admin-user-steps";
import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import FbButton from "@/components/flowbite/fb-button";
import FbInput from "@/components/flowbite/fb-input";
import FbLabel from "@/components/flowbite/fb-label";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import { createAdminUser, deactivateAdminUser, getAdminUser, updateAdminUser, verifyAdminUser, activateAdminUser, } from "@/libs/admin-api";
import { resolveCallErrorMessage, } from "@/libs/call-message";
import { formatStamp, } from "@/libs/format-display";
import { fbAdminShowBack, fbCard, fbInput, fbMuted, } from "@/libs/flowbite-classes";
import { UserRoleEnum, } from "@/libs/user-role";
import {
    assignableAdminRoles,
    createDefaultUserForm,
    canMutateAdminAccount,
    resolveUserAccountStatus,
    resolveUserDisplayName,
    userStatusTone,
    userToFormPayload,
    validateAdminUserForm,
    type AdminUser,
    type AdminUserFormPayload,
} from "@/types/admin/user";
import InputError from "@/components/input-error";

const AdminUserFormPage = ({ mode, }: { mode: "create" | "edit"; }): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { roles, } = useAdminAccess ();
    const router = useRouter ();
    const { data: session, } = useSession ();
    const { t, } = useTranslation ("common");
    const [form, setForm] = useState<AdminUserFormPayload> (createDefaultUserForm ());
    const [avatar, setAvatar] = useState<File | null> (null);
    const [avatarUrl, setAvatarUrl] = useState ("");
    const [avatarPreview, setAvatarPreview] = useState ("");
    const [error, setError] = useState ("");
    const [ready, setReady] = useState (mode !== "edit");
    const [fieldErrors, setFieldErrors] = useState<Partial<Record<"full_name" | "email" | "password" | "password_confirmation", string>>> ({});
    const [step, setStep] = useState<"profile" | "access"> ("profile");
    const id = String (router.query.id || "");
    const roleLocked = mode === "edit" && id === session?.user?.id;
    const rolesForForm = assignableAdminRoles (roles.includes (UserRoleEnum.Superadmin));

    useEffect (() =>
    {
        if (mode !== "edit" || ! id)
        {
            return;
        }

        void getAdminUser (id).then ((result) =>
        {
            if (result.isSuccess)
            {
                const user = result.data as AdminUser;

                setForm (userToFormPayload (user));
                setAvatarUrl (user.avatar_url || "");
            }

            setReady (true);
        });
    }, [mode, id]);

    async function submit (event: FormEvent): Promise<void>
    {
        event.preventDefault ();
        setError ("");
        const nextErrors = validateAdminUserForm (form, mode, {
            emailInvalid: t ("email_invalid"),
            passwordMin: t ("password_min"),
            passwordMismatch: t ("password_mismatch"),
            fullNameRequired: t ("full_name_required"),
        });

        setFieldErrors (nextErrors);

        if (Object.keys (nextErrors).length > 0)
        {
            if (mode === "create")
            {
                setStep ("profile");
            }

            return;
        }

        const payload = {
            ...form,
            name: form.name.trim () || form.full_name.trim (),
        };
        const result = mode === "create"
            ? await createAdminUser (payload, avatar)
            : await updateAdminUser (id, payload, avatar);

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        void router.push (mode === "create" ? "/admin/users" : `/admin/users/${id}`);
    }

    if (! canRender)
    {
        return null;
    }

    function roleLabel (key: string): string
    {
        const translated = t (`role_${key}`);

        if (translated === `role_${key}` || translated.endsWith (`.role_${key}`))
        {
            return key;
        }

        return translated;
    }

    function setValue (key: keyof AdminUserFormPayload, value: string): void
    {
        setForm ({ ...form, [key]: value, });
    }

    function goAccess (): void
    {
        const nextErrors = validateAdminUserForm (form, "create", {
            emailInvalid: t ("email_invalid"),
            passwordMin: t ("password_min"),
            passwordMismatch: t ("password_mismatch"),
            fullNameRequired: t ("full_name_required"),
        });

        setFieldErrors (nextErrors);

        if (Object.keys (nextErrors).length > 0)
        {
            return;
        }

        setStep ("access");
    }

    const showProfile = step === "profile";
    const showAccess = step === "access";
    const steps = [
        { key: "profile", label: t ("users_tab_profile"), },
        { key: "access", label: t ("users_tab_access"), },
    ];

    return (
        <AdminFrame title={t (mode === "create" ? "users_create" : "users_edit")} description={t (mode === "create" ? "users_create_description" : "users_edit_description")}>
            <AlertError message={error} />
            {! ready ? <AdminFormSkeleton fields={6} /> : (
                <form className={`${fbCard} max-w-3xl space-y-0 overflow-hidden p-0`} method="post" onSubmit={(event) => void submit (event)}>
                    <AdminUserSteps
                        value={step}
                        items={steps}
                        onChange={(next) =>
                        {
                            if (mode === "create" && next === "access")
                            {
                                goAccess ();

                                return;
                            }

                            setStep (next === "access" ? "access" : "profile");
                        }}
                    />
                    {showProfile ? (
                        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
                            <div className="sm:col-span-2">
                                <FbLabel className="text-center" htmlFor="admin-user-avatar">{t ("avatar")}</FbLabel>
                                <div className="flex flex-col items-center gap-4">
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                                        {(avatarPreview || avatarUrl)
                                            ? <img src={avatarPreview || avatarUrl} alt="" className="h-full w-full object-cover" />
                                            : (
                                                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                    </div>
                                    <div className="w-full max-w-xs">
                                    <AdminFilePicker id="admin-user-avatar" accept="image/*" value={avatar} onChange={(file) =>
                                    {
                                        if (avatarPreview)
                                        {
                                            URL.revokeObjectURL (avatarPreview);
                                        }

                                        setAvatar (file);
                                        setAvatarPreview (file ? URL.createObjectURL (file) : "");
                                    }} />
                                    </div>
                                </div>
                            </div>
                            <div>
                                <FbLabel className="text-center" htmlFor="admin-user-full-name">{t ("full_name")}</FbLabel>
                                <FbInput id="admin-user-full-name" name="full_name" icon="none" required placeholder={t ("full_name_placeholder")} invalid={Boolean (fieldErrors.full_name)} value={form.full_name} onChange={(event) => setValue ("full_name", event.target.value)} />
                                <InputError message={fieldErrors.full_name} />
                            </div>
                            <div>
                                <FbLabel className="text-center" htmlFor="admin-user-email">{t ("email")}</FbLabel>
                                <FbInput id="admin-user-email" name="email" type="email" required placeholder={t ("email_placeholder")} invalid={Boolean (fieldErrors.email)} value={form.email} onChange={(event) => setValue ("email", event.target.value)} />
                                <InputError message={fieldErrors.email} />
                            </div>
                            <div>
                                <FbLabel htmlFor="admin-user-password">{t (mode === "create" ? "password" : "new_password")}</FbLabel>
                                <FbInput id="admin-user-password" name="password" type="password" required={mode === "create"} placeholder={t (mode === "create" ? "password_placeholder" : "new_password_placeholder")} invalid={Boolean (fieldErrors.password)} value={form.password} onChange={(event) => setValue ("password", event.target.value)} />
                                <InputError message={fieldErrors.password} />
                            </div>
                            <div>
                                <FbLabel htmlFor="admin-user-password-confirmation">{t ("confirm_password")}</FbLabel>
                                <FbInput id="admin-user-password-confirmation" name="password_confirmation" type="password" required={mode === "create"} placeholder={t (mode === "create" ? "password_confirmation_placeholder" : "new_password_confirmation_placeholder")} invalid={Boolean (fieldErrors.password_confirmation)} value={form.password_confirmation} onChange={(event) => setValue ("password_confirmation", event.target.value)} />
                                <InputError message={fieldErrors.password_confirmation} />
                            </div>
                        </div>
                    ) : null}
                    {showAccess ? (
                        <div className="grid gap-4 p-4 sm:p-6">
                            <div>
                                <FbLabel htmlFor="admin-user-role">{t ("role")}</FbLabel>
                                <select id="admin-user-role" className={fbInput} value={form.role} disabled={roleLocked} onChange={(event) => setValue ("role", event.target.value)}>
                                    <option value="" disabled>{t ("users_role_placeholder")}</option>
                                    {rolesForForm.map ((role) => <option key={role} value={role}>{roleLabel (role)}</option>)}
                                </select>
                                {roleLocked ? <p className={`${fbMuted} mt-1 text-xs`}>{t ("role_locked_self")}</p> : null}
                            </div>
                        </div>
                    ) : null}
                    <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 px-4 py-4 sm:px-6 dark:border-gray-700">
                        {mode === "create" && step === "profile" ? <FbButton variant="outline" href="/admin/users">{t ("cancel")}</FbButton> : null}
                        {mode === "create" && step === "profile" ? <FbButton type="button" onClick={goAccess}>{t ("next")}</FbButton> : null}
                        {mode === "create" && step === "access" ? <FbButton variant="outline" type="button" onClick={() => setStep ("profile")}>{t ("back")}</FbButton> : null}
                        {mode === "edit" ? <FbButton variant="outline" href={`/admin/users/${id}`}>{t ("cancel")}</FbButton> : null}
                        {mode === "edit" ? <FbButton type="submit">{t ("save_changes")}</FbButton> : null}
                        {mode === "create" && step === "access" ? <FbButton type="submit">{t ("users_create")}</FbButton> : null}
                    </div>
                </form>
            )}
        </AdminFrame>
    );
};

export const AdminUserShowPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { can, roles, } = useAdminAccess ();
    const { data: session, } = useSession ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const [user, setUser] = useState<AdminUser | null> (null);
    const [error, setError] = useState ("");
    const [message, setMessage] = useState ("");
    const [confirmOpen, setConfirmOpen] = useState (false);
    const [confirmDanger, setConfirmDanger] = useState (false);
    const [confirmMessage, setConfirmMessage] = useState ("");
    const [confirmAction, setConfirmAction] = useState<(() => Promise<{ isSuccess: boolean; error: unknown; }>) | null> (null);
    const id = String (router.query.id || "");
    const isSuperadmin = roles.includes (UserRoleEnum.Superadmin);
    const canChange = user ? canMutateAdminAccount (session?.user?.id, isSuperadmin, user) : false;
    const [tab, setTab] = useState ("profile");
    const steps = [
        { key: "profile", label: t ("users_tab_profile"), },
        { key: "access", label: t ("users_tab_access"), },
    ];
    const showValue = "block w-full rounded-lg bg-gray-50 p-2.5 text-center text-sm text-gray-900 dark:bg-gray-700 dark:text-white";

    function roleLabel (key: string): string
    {
        const translated = t (`role_${key}`);

        if (translated === `role_${key}` || translated.endsWith (`.role_${key}`))
        {
            return key;
        }

        return translated;
    }

    function ask (messageText: string, action: () => Promise<{ isSuccess: boolean; error: unknown; }>, danger = false): void
    {
        setConfirmMessage (messageText);
        setConfirmDanger (danger);
        setConfirmAction (() => action);
        setConfirmOpen (true);
    }

    async function runConfirm (): Promise<void>
    {
        const action = confirmAction;

        setConfirmOpen (false);
        setConfirmAction (null);

        if (action)
        {
            await run (action);
        }
    }

    async function load (): Promise<void>
    {
        if (! id)
        {
            return;
        }

        const result = await getAdminUser (id);

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        setUser (result.data as AdminUser);
    }

    useEffect (() =>
    {
        void load ();
    }, [id, t]);

    async function run (action: () => Promise<{ isSuccess: boolean; error: unknown; }>): Promise<void>
    {
        setMessage ("");
        setError ("");
        const result = await action ();

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        setMessage (t ("saved"));
        await load ();
    }

    if (! canRender)
    {
        return null;
    }

    return (
        <AdminFrame title={t ("users_view_title")} description={user?.email}>
            <AlertSuccess message={message} />
            <AlertError message={error} />
            {! user && ! error ? <AdminDetailSkeleton /> : null}
            {user ? (
                <div className={`${fbCard} space-y-0 overflow-hidden p-0`}>
                    <AdminUserSteps value={tab} items={steps} onChange={setTab} />
                    {tab === "profile" ? (
                        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
                            <div className="sm:col-span-2">
                                <p className="mb-2 text-center text-sm font-medium">{t ("avatar")}</p>
                                <div className="flex justify-center">
                                    <div className="flex h-24 w-24 items-center justify-center overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                                        {user.avatar_url
                                            ? <img src={user.avatar_url} alt="" className="h-full w-full object-cover" />
                                            : (
                                                <svg className="h-12 w-12 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                                    <path fillRule="evenodd" d="M10 9a3 3 0 100-6 3 3 0 000 6zm-7 9a7 7 0 1114 0H3z" clipRule="evenodd" />
                                                </svg>
                                            )}
                                    </div>
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-center text-sm font-medium">{t ("full_name")}</p>
                                <div className={showValue}>{resolveUserDisplayName (user)}</div>
                            </div>
                            <div>
                                <p className="mb-2 text-center text-sm font-medium">{t ("email")}</p>
                                <div className={`${showValue} break-all`}>{user.email}</div>
                            </div>
                            <div className="sm:col-span-2">
                                <p className="mb-2 text-center text-sm font-medium">{t ("created_at")}</p>
                                <div className={showValue}>{formatStamp (user.created_at)}</div>
                            </div>
                        </div>
                    ) : (
                        <div className="grid gap-4 p-4 sm:grid-cols-2 sm:p-6">
                            <div>
                                <p className="mb-2 text-center text-sm font-medium">{t ("role")}</p>
                                <div className={showValue}>
                                    {user.role ? <span className="badge-brand-primary inline-flex rounded px-2.5 py-0.5 text-xs font-medium">{roleLabel (user.role)}</span> : "-"}
                                </div>
                            </div>
                            <div>
                                <p className="mb-2 text-center text-sm font-medium">{t ("status")}</p>
                                <div className={showValue}>
                                    <AdminStatusDot tone={userStatusTone (resolveUserAccountStatus (user))}>{t (`status_${resolveUserAccountStatus (user)}`)}</AdminStatusDot>
                                </div>
                            </div>
                        </div>
                    )}
                    <div className={`${fbAdminShowBack} flex flex-wrap items-center justify-between gap-2 px-4 pb-4 sm:px-6 sm:pb-6`}>
                        <FbButton variant="outline" href="/admin/users">{t ("back_to_users")}</FbButton>
                        <div className="flex flex-wrap gap-2">
                            {can ("user.update") && canChange ? <FbButton variant="outline" href={`/admin/users/${id}/edit`}>{t ("edit")}</FbButton> : null}
                            {can ("user.update") && canChange && ! user.deleted_at && ! user.email_verified_at
                                ? <FbButton variant="secondary" type="button" onClick={() => ask (t ("confirm_verify"), () => verifyAdminUser (id))}>{t ("verify")}</FbButton>
                                : null}
                            {can ("user.restore") && canChange && user.deleted_at
                                ? <FbButton variant="outline" type="button" onClick={() => ask (t ("confirm_activate"), () => activateAdminUser (id))}>{t ("activate")}</FbButton>
                                : null}
                            {can ("user.delete") && canChange && ! user.deleted_at
                                ? <FbButton variant="outline" type="button" onClick={() => ask (t ("confirm_deactivate"), () => deactivateAdminUser (id), true)}>{t ("deactivate")}</FbButton>
                                : null}
                        </div>
                    </div>
                </div>
            ) : null}
            <AdminConfirmModal
                open={confirmOpen}
                titleId="user-show-confirm-title"
                title={t ("confirm")}
                message={confirmMessage}
                confirmLabel={t ("confirm")}
                danger={confirmDanger}
                onClose={() => setConfirmOpen (false)}
                onConfirm={() => void runConfirm ()}
            />
        </AdminFrame>
    );
};

export { AdminUserFormPage, };
export default AdminUserFormPage;
