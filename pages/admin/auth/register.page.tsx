import { GetServerSideProps, } from "next";
import { ReactElement, FormEvent, useState, ChangeEvent, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import AuthLayout from "@/layouts/auth/auth-layout";
import AlertError from "@/components/alert-error";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button, } from "@/components/ui/button";
import { Input, } from "@/components/ui/input";
import { Label, } from "@/components/ui/label";
import { Spinner, } from "@/components/ui/spinner";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/auth/register";
import { parseApiErrors, focusPasswordMatchError, } from "@/libs/parse-api-errors";
import { formatPageTitle, } from "@/libs/page-title";
import { cn, } from "@/libs/utils";
import { useRequireGuest, } from "@/hooks/auth-guard";


const Register = (): ReactElement | null =>
{
    const canRender = useRequireGuest ();
    const router = useRouter ();
    const { t, } = useTranslation ("auth");
    const [ data, setData, ] = useState ({
        name: "",
        email: "",
        password: "",
        password_confirmation: "",
    });
    const [ errors, setErrors, ] = useState<Record<string, string>> ({});
    const [ processing, setProcessing, ] = useState (false);

    const submit = async (e: FormEvent): Promise<void> =>
    {
        e.preventDefault ();
        setProcessing (true);
        setErrors ({});

        try
        {
            const response = await fetch ("/api/auth/register", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify (data),
            });
            const payload = await response.json ();

            if (! response.ok)
            {
                setErrors (focusPasswordMatchError (
                    parseApiErrors (payload, t ("registration_failed")),
                    "password_confirmation"
                ));

                return;
            }

            if (payload?.errors)
            {
                setErrors (focusPasswordMatchError (
                    parseApiErrors (payload, t ("registration_failed")),
                    "password_confirmation"
                ));

                return;
            }

            if (payload?.data || payload?.success)
            {
                router.push ({
                    pathname: "/admin/auth/login",
                    query: { status: t ("verification-sent"), },
                });

                return;
            }

            setErrors ({ general: t ("registration_failed"), });
        }
        catch (error)
        {
            setErrors ({ general: t ("registration_failed"), });
        }
        finally
        {
            setProcessing (false);
        }
    };

    if (! canRender)
    {
        return null;
    }

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("register"))}</title>
            </Head>

            <AuthLayout
                title={t ("register_title")}
                description={t ("register_description")}
            >
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-6"
                    noValidate
                >
                    <AlertError message={errors.general} />

                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="name">{t ("name")}</Label>
                            <Input
                                id="name"
                                type="text"
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="name"
                                name="name"
                                value={data.name}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, name: e.target.value, }))
                                }
                                placeholder={t ("username")}
                                aria-invalid={!! errors.name}
                                className={cn (
                                    errors.name && "border-destructive focus-visible:ring-destructive/30"
                                )}
                            />
                            <InputError message={errors.name} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="email">{t ("email_address")}</Label>
                            <Input
                                id="email"
                                type="email"
                                required
                                tabIndex={2}
                                autoComplete="email"
                                name="email"
                                value={data.email}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, email: e.target.value, }))
                                }
                                placeholder={t ("email_placeholder")}
                                aria-invalid={!! errors.email}
                                className={cn (
                                    errors.email && "border-destructive focus-visible:ring-destructive/30"
                                )}
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">{t ("password")}</Label>
                            <Input
                                id="password"
                                type="password"
                                required
                                tabIndex={3}
                                autoComplete="new-password"
                                name="password"
                                value={data.password}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, password: e.target.value, }))
                                }
                                placeholder={t ("password_placeholder")}
                                aria-invalid={!! errors.password}
                                className={cn (
                                    errors.password && "border-destructive focus-visible:ring-destructive/30"
                                )}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password_confirmation">
                                {t ("password_confirmation_label")}
                            </Label>
                            <Input
                                id="password_confirmation"
                                type="password"
                                required
                                tabIndex={4}
                                autoComplete="new-password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, password_confirmation: e.target.value, }))
                                }
                                placeholder={t ("password_confirmation_placeholder")}
                                aria-invalid={!! errors.password_confirmation}
                                className={cn (
                                    errors.password_confirmation && "border-destructive focus-visible:ring-destructive/30"
                                )}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-2 w-full"
                            tabIndex={5}
                            disabled={processing}
                            data-test="register-user-button"
                        >
                            {processing && <Spinner />}
                            {processing ? t ("registering") : t ("create_account")}
                        </Button>
                    </div>

                    <div className="text-center text-sm text-muted-foreground">
                        {t ("already_have_account")}{" "}
                        <TextLink href="/admin/auth/login" tabIndex={6}>
                            {t ("log_in")}
                        </TextLink>
                    </div>
                </form>
            </AuthLayout>
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "Register",
    namespaces: [ "auth", "common", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default Register;
