import { ReactElement, FormEvent, useEffect, useState, } from "react";
import { useTranslation, } from "next-i18next/pages";

import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import InputError from "@/components/input-error";
import WebPushEnableSettings from "@/components/admin/web-push-enable-settings";
import { Button, } from "@/components/ui/button";
import { Input, } from "@/components/ui/input";
import { Label, } from "@/components/ui/label";
import { Spinner, } from "@/components/ui/spinner";
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
            <div className="flex items-center gap-2 text-sm text-muted-foreground">
                <Spinner className="h-4 w-4" />
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
                <Label htmlFor="avatar">{t ("avatar")}</Label>
                <div className="flex items-center gap-4">
                    <div className="size-20 shrink-0 overflow-hidden rounded-full border bg-muted">
                        {(avatarPreview || currentAvatarUrl) && (
                            <img
                                src={avatarPreview ?? currentAvatarUrl ?? undefined}
                                alt=""
                                className="h-full w-full object-cover"
                            />
                        )}
                    </div>
                    <Input
                        id="avatar"
                        type="file"
                        accept="image/*"
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
                    <Label htmlFor="name">{t ("name")}</Label>
                    <Input
                        id="name"
                        value={form.name}
                        required
                        onChange={(event) =>
                            setForm ({ ...form, name: event.target.value, })
                        }
                    />
                    <InputError message={errors.name} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="email">{t ("email")}</Label>
                    <Input
                        id="email"
                        type="email"
                        value={form.email}
                        required
                        onChange={(event) =>
                            setForm ({ ...form, email: event.target.value, })
                        }
                    />
                    <InputError message={errors.email} />
                </div>

                <div className="space-y-2 md:col-span-2">
                    <Label htmlFor="full_name">{t ("full_name")}</Label>
                    <Input
                        id="full_name"
                        value={form.full_name}
                        onChange={(event) =>
                            setForm ({ ...form, full_name: event.target.value, })
                        }
                    />
                    <InputError message={errors.full_name} />
                </div>
            </div>

            <div className="space-y-2">
                <Label>{t ("interests")}</Label>
                <div className="flex flex-wrap gap-2">
                    {interests.map ((interest, index) => (
                        <span
                            key={interest}
                            className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 text-xs"
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
                    <Input
                        value={newInterest}
                        placeholder={t ("add_interest")}
                        onChange={(event) => setNewInterest (event.target.value)}
                        onKeyDown={(event) => {
                            if (event.key === "Enter") {
                                event.preventDefault ();
                                addInterest ();
                            }
                        }}
                    />
                    <Button type="button" variant="outline" onClick={() => addInterest ()}>
                        {t ("add")}
                    </Button>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2">
                <div className="space-y-2">
                    <Label htmlFor="password">{t ("new_password")}</Label>
                    <Input
                        id="password"
                        type="password"
                        autoComplete="new-password"
                        value={form.password}
                        onChange={(event) =>
                            setForm ({ ...form, password: event.target.value, })
                        }
                    />
                    <InputError message={errors.password} />
                </div>

                <div className="space-y-2">
                    <Label htmlFor="password_confirmation">{t ("confirm_password")}</Label>
                    <Input
                        id="password_confirmation"
                        type="password"
                        autoComplete="new-password"
                        value={form.password_confirmation}
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

            <Button type="submit" disabled={isSaving}>
                {isSaving && <Spinner />}
                {t ("save_changes")}
            </Button>
        </form>
    );
};

export default ProfileSettingsForm;
