import { ReactElement, FormEvent, useEffect, useRef, useState, } from "react";
import { useTranslation, } from "next-i18next/pages";

import AdminFilePicker from "@/components/admin/admin-file-picker";
import AdminFormSkeleton from "@/components/admin/admin-form-skeleton";
import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import InputError from "@/components/input-error";
import WebPushEnableSettings from "@/components/admin/web-push-enable-settings";
import FbButton from "@/components/flowbite/fb-button";
import FbInput from "@/components/flowbite/fb-input";
import FbLabel from "@/components/flowbite/fb-label";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { adminSectionClass, adminSectionFooterClass, } from "@/libs/admin-form-classes";
import { fbInput, } from "@/libs/flowbite-classes";
import { useUserProfile, } from "@/hooks/use-user-profile";
import { actionErrors, } from "@/libs/admin-action";
import type { UserMeDto, } from "@/types/admin/settings";

const ProfileSettingsForm = (): ReactElement => {
    const { t, } = useTranslation ("common");
    const {
        isSaving,
        fetchMe,
        fetchInterestSuggestions,
        updatePersonal,
    } = useUserProfile ();

    const [form, setForm] = useState ({
        name: "",
        email: "",
        full_name: "",
        password: "",
        password_confirmation: "",
    });
    const [interests, setInterests] = useState<string[]>([]);
    const [newInterest, setNewInterest] = useState ("");
    const [interestSuggestions, setInterestSuggestions] = useState<string[]> ([]);
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState ("");
    const [hydrated, setHydrated] = useState (false);
    const profileLoaded = useRef (false);

    const applyUser = (user: UserMeDto): void => {
        setForm ({
            name: user.name ?? "",
            email: user.email ?? "",
            full_name: user.profile?.full_name ?? "",
            password: "",
            password_confirmation: "",
        });
        setInterests ([...(user.profile?.interests ?? [])]);
        setCurrentAvatarUrl (user.profile?.avatar_url ?? null);
        setAvatarFile (null);
        setAvatarPreview (null);
    };

    useEffect (() => {
        if (profileLoaded.current) {
            return;
        }

        let cancelled = false;

        void (async () => {
            const [meResult, suggestions] = await Promise.all ([
                fetchMe (),
                fetchInterestSuggestions (),
            ]);

            if (cancelled || profileLoaded.current) {
                return;
            }

            if (meResult.success && meResult.data) {
                applyUser (meResult.data);
            }

            setInterestSuggestions (suggestions);
            profileLoaded.current = true;
            setHydrated (true);
        })();

        return () => {
            cancelled = true;
        };
    }, [fetchMe, fetchInterestSuggestions]);

    const addInterest = (value?: string): void => {
        const tag = (value ?? newInterest).trim ();

        if (! tag || interests.includes (tag)) {
            setNewInterest ("");

            return;
        }

        setInterests ([...interests, tag]);
        setNewInterest ("");
    };

    const handleSubmit = async (event: FormEvent): Promise<void> => {
        event.preventDefault ();
        setErrors ({});
        setSuccessMessage ("");

        const result = await updatePersonal ({
            name: form.name.trim (),
            email: form.email.trim (),
            full_name: form.full_name.trim (),
            interests,
            password: form.password.trim () || undefined,
            password_confirmation: form.password_confirmation.trim () || undefined,
        }, avatarFile);

        if (! result.success) {
            setErrors (actionErrors (result, t ("something_went_wrong")));

            return;
        }

        const requestedEmail = form.email.trim ();
        const savedEmail = (result.data?.email ?? form.email).trim ();

        if (result.data) {
            applyUser (result.data);
        }

        setSuccessMessage (requestedEmail.toLowerCase () !== savedEmail.toLowerCase ()
            ? t ("settings_email_pending")
            : t ("settings_personal_updated"));
    };

    if (! hydrated) {
        return <AdminFormSkeleton fields={6} />;
    }

    return (
        <form className="space-y-6" noValidate onSubmit={(event) => void handleSubmit (event)}>
            {errors.general && <AlertError message={errors.general} />}

            <AlertSuccess message={successMessage || undefined} />

            <WebPushEnableSettings />

            <div className={adminSectionClass}>
                <div className="flex min-w-0 flex-col items-center gap-4 text-center">
                    <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-full border-4 border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                        {avatarPreview || currentAvatarUrl ? (
                            <img
                                src={avatarPreview ?? currentAvatarUrl ?? undefined}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        ) : (
                            <div className="flex h-full w-full items-center justify-center text-gray-400">
                                <svg className="h-12 w-12" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                </svg>
                            </div>
                        )}
                    </div>
                    <div className="w-full max-w-xs space-y-2">
                        <FbLabel htmlFor="avatar">{t ("avatar")}</FbLabel>
                        <AdminFilePicker
                            id="avatar"
                            accept="image/jpeg,image/png,image/gif,image/webp"
                            value={avatarFile}
                            invalid={Boolean (errors.avatar)}
                            onChange={(file) =>
                            {
                                setAvatarFile (file);
                                setAvatarPreview (file ? URL.createObjectURL (file) : null);
                            }}
                        />
                        <InputError message={errors.avatar} />
                    </div>
                </div>
            </div>

            <div className={`${adminSectionClass} grid gap-6 md:grid-cols-2`}>
                <div className="space-y-2">
                    <FbLabel htmlFor="name">{t ("name")}</FbLabel>
                    <FbInput
                        id="name"
                        name="name"
                        value={form.name}
                        required
                        placeholder={t ("name_placeholder")}
                        invalid={!! errors.name}
                        onChange={(event) =>
                            setForm ({ ...form, name: event.target.value, })
                        }
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <FbLabel htmlFor="email">{t ("email")}</FbLabel>
                    <FbInput
                        id="email"
                        type="email"
                        name="email"
                        placeholder={t ("email_placeholder")}
                        value={form.email}
                        required
                        invalid={!! errors.email}
                        onChange={(event) =>
                            setForm ({ ...form, email: event.target.value, })
                        }
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <FbLabel htmlFor="full_name">{t ("full_name")}</FbLabel>
                    <FbInput
                        id="full_name"
                        name="full_name"
                        placeholder={t ("full_name_placeholder")}
                        value={form.full_name}
                        invalid={!! errors.full_name}
                        onChange={(event) =>
                            setForm ({ ...form, full_name: event.target.value, })
                        }
                    />
                    <InputError message={errors.full_name} />
                </div>
            </div>

            <div className={`${adminSectionClass} space-y-2`}>
                <FbLabel>{t ("interests")}</FbLabel>
                <div className="flex flex-wrap gap-2">
                    {interests.map ((interest, index) => (
                        <span
                            key={interest}
                            className="inline-flex items-center gap-1 rounded-full bg-gray-100 px-3 py-1 text-xs dark:bg-gray-700"
                        >
                            {interest}
                            <button
                                type="button"
                                className="opacity-60 hover:opacity-100"
                                onClick={() =>
                                    setInterests (interests.filter ((_, i) => i !== index))
                                }
                            >
                                ×
                            </button>
                        </span>
                    ))}
                </div>
                <div className="flex gap-2">
                    <input
                        type="text"
                        value={newInterest}
                        className={fbInput}
                        placeholder={t ("add_interest")}
                        list="interest-suggestions"
                        onChange={(event) => setNewInterest (event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault ();
                                addInterest ();
                            }
                        }}
                    />
                    <FbButton type="button" variant="outline" onClick={() => addInterest ()}>
                        {t ("add")}
                    </FbButton>
                </div>
                <datalist id="interest-suggestions">
                    {interestSuggestions.map ((suggestion) => <option key={suggestion} value={suggestion} />)}
                </datalist>
            </div>

            <div className={`${adminSectionClass} grid gap-6 md:grid-cols-2`}>
                <div className="space-y-2">
                    <FbLabel htmlFor="password">{t ("new_password")}</FbLabel>
                    <FbInput
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
                        placeholder={t ("new_password_placeholder")}
                        value={form.password}
                        invalid={!! errors.password}
                        onChange={(event) =>
                            setForm ({ ...form, password: event.target.value, })
                        }
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <FbLabel htmlFor="password_confirmation">{t ("confirm_password")}</FbLabel>
                    <FbInput
                        id="password_confirmation"
                        type="password"
                        name="password_confirmation"
                        autoComplete="new-password"
                        placeholder={t ("new_password_confirmation_placeholder")}
                        value={form.password_confirmation}
                        invalid={!! errors.password_confirmation}
                        onChange={(event) =>
                            setForm ({
                                ...form,
                                password_confirmation: event.target.value,
                            })
                        }
                    />
                    <InputError message={errors.password_confirmation} />
                </div>
            </div>

            <div className={adminSectionFooterClass}>
                <FbButton type="submit" className="ms-auto inline-flex items-center gap-2 px-3 py-1.5 text-xs" disabled={isSaving}>
                    {isSaving ? <FbSpinner className="h-4 w-4" /> : null}
                    {t ("save_changes")}
                </FbButton>
            </div>
        </form>
    );
};

export default ProfileSettingsForm;
