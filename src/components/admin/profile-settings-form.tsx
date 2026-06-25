import { ReactElement, FormEvent, useEffect, useState, } from "react";
import { useTranslation, } from "next-i18next/pages";

import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import InputError from "@/components/input-error";
import WebPushEnableSettings from "@/components/admin/web-push-enable-settings";
import FbButton from "@/components/flowbite/fb-button";
import FbInput from "@/components/flowbite/fb-input";
import FbLabel from "@/components/flowbite/fb-label";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { fbInput, fbMuted, } from "@/libs/flowbite-classes";
import { useUserProfile, } from "@/hooks/use-user-profile";
import { actionErrors, } from "@/libs/admin-action";
import type { UserMeDto, } from "@/types/admin/settings";

const ProfileSettingsForm = (): ReactElement => {
    const { t, } = useTranslation ("common");
    const {
        isLoading,
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
    const [avatarFile, setAvatarFile] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
    const [currentAvatarUrl, setCurrentAvatarUrl] = useState<string | null>(null);
    const [errors, setErrors] = useState<Record<string, string>>({});
    const [successMessage, setSuccessMessage] = useState ("");

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
        void (async () => {
            const [meResult, suggestions] = await Promise.all ([
                fetchMe (),
                fetchInterestSuggestions (),
            ]);

            if (meResult.success && meResult.data) {
                applyUser (meResult.data);
            }

            void suggestions;
        })();
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

        if (result.data) {
            applyUser (result.data);
        }

        setSuccessMessage (t ("settings_personal_updated"));
    };

    if (isLoading) {
        return (
            <div className={`flex items-center gap-2 ${fbMuted}`}>
                <FbSpinner className="h-4 w-4" />
                {t ("loading")}
            </div>
        );
    }

    return (
        <form className="space-y-6" noValidate onSubmit={(event) => void handleSubmit (event)}>
            {errors.general && <AlertError message={errors.general} />}

            <AlertSuccess message={successMessage || undefined} />

            <WebPushEnableSettings />

            <div className="space-y-2">
                <FbLabel htmlFor="avatar">{t ("avatar")}</FbLabel>
                <div className="flex items-center gap-4">
                    <div className="size-20 shrink-0 overflow-hidden rounded-full border border-gray-200 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                        {(avatarPreview || currentAvatarUrl) && (
                            <img
                                src={avatarPreview ?? currentAvatarUrl ?? undefined}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <input
                        id="avatar"
                        type="file"
                        accept="image/*"
                        className={fbInput}
                        onChange={(event) => {
                            const file = event.target.files?.[0] ?? null;
                            setAvatarFile (file);
                            setAvatarPreview (file ? URL.createObjectURL (file) : null);
                        }}
                    />
                </div>
                <InputError message={errors.avatar} />
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <FbLabel htmlFor="name">{t ("name")}</FbLabel>
                    <FbInput
                        id="name"
                        name="name"
                        value={form.name}
                        required
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
                        value={form.full_name}
                        invalid={!! errors.full_name}
                        onChange={(event) =>
                            setForm ({ ...form, full_name: event.target.value, })
                        }
                    />
                    <InputError message={errors.full_name} />
                </div>
            </div>

            <div className="space-y-2">
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
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <FbLabel htmlFor="password">{t ("new_password")}</FbLabel>
                    <FbInput
                        id="password"
                        type="password"
                        name="password"
                        autoComplete="new-password"
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

            <FbButton type="submit" disabled={isSaving}>
                {isSaving && <FbSpinner />}
                {t ("save_changes")}
            </FbButton>
        </form>
    );
};

export default ProfileSettingsForm;
