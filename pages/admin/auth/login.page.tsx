import { GetServerSideProps, } from "next";
import { ReactElement, FormEvent, useState, ChangeEvent, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { signIn, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import AuthLayout from "@/layouts/auth/auth-layout";
import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button, } from "@/components/ui/button";
import { Checkbox, } from "@/components/ui/checkbox";
import { Input, } from "@/components/ui/input";
import { Label, } from "@/components/ui/label";
import { Spinner, } from "@/components/ui/spinner";
import { useRequireGuest, } from "@/hooks/auth-guard";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/auth/login";
import { formatPageTitle, } from "@/libs/page-title";
import { cn, } from "@/libs/utils";
import { parseApiErrors, } from "@/libs/parse-api-errors";
import { type LoginProps, } from "@/types/admin/auth";

const Login = ({
    status,
    canResetPassword = true,
    canRegister = true,
}: LoginProps): ReactElement | null =>
{
    const router = useRouter ();
    const canRender = useRequireGuest ();
    const { t, } = useTranslation ("auth");
    const [ data, setData, ] = useState ({
        identifier: "",
        password: "",
        remember: false,
    });
    const [ errors, setErrors, ] = useState<Record<string, string>> ({});
    const [ processing, setProcessing, ] = useState (false);
    const displayStatus = status ?? (router.query.status as string | undefined);

    const submit = async (e: FormEvent): Promise<void> =>
    {
        e.preventDefault ();
        setProcessing (true);
        setErrors ({});

        try
        {
            const result = await signIn ("credentials", {
                identifier: data.identifier,
                password: data.password,
                remember: data.remember,
                redirect: false,
            });

            if (result?.error)
            {
                try
                {
                    const errorData = JSON.parse (result.error);
                    setErrors (parseApiErrors (errorData, t ("authentication_failed")));
                }
                catch
                {
                    setErrors ({ general: result.error, });
                }
            }
            else if (result?.ok)
            {
                router.push ("/admin/dashboard");
            }
        }
        catch (error)
        {
            setErrors ({ general: t ("authentication_failed"), });
        }
        finally
        {
            setProcessing (false);
        }
    };

    const identifierError = errors.email || errors.identifier;
    const passwordError = errors.password;

    if (! canRender)
    {
        return null;
    }

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("login"))}</title>
            </Head>

            <AuthLayout
                title={t ("login_title")}
                description={t ("login_description")}
            >
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-6"
                    noValidate
                >
                    <AlertSuccess message={displayStatus} />
                    <AlertError message={errors.general} />

                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t ("email_address")}</Label>
                            <Input
                                id="email"
                                type="text"
                                name="identifier"
                                value={data.identifier}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, identifier: e.target.value, }))
                                }
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="username"
                                placeholder={t ("email_placeholder")}
                                aria-invalid={!! identifierError}
                                className={cn (
                                    identifierError && "border-destructive focus-visible:ring-destructive/30"
                                )}
                            />
                            <InputError message={identifierError} />
                        </div>

                        <div className="grid gap-2">
                            <div className="flex items-center">
                                <Label htmlFor="password">{t ("password")}</Label>
                                {canResetPassword && (
                                    <TextLink
                                        href="/admin/auth/forgot-password"
                                        className="ml-auto text-sm"
                                        tabIndex={5}
                                    >
                                        {t ("forgot_password_link")}
                                    </TextLink>
                                )}
                            </div>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, password: e.target.value, }))
                                }
                                required
                                tabIndex={2}
                                autoComplete="current-password"
                                placeholder={t ("password_placeholder")}
                                aria-invalid={!! passwordError}
                                className={cn (
                                    passwordError && "border-destructive focus-visible:ring-destructive/30"
                                )}
                            />
                            <InputError message={passwordError} />
                        </div>

                        <div className="flex items-center space-x-3">
                            <Checkbox
                                id="remember"
                                name="remember"
                                checked={data.remember}
                                onCheckedChange={(checked: boolean | "indeterminate"): void =>
                                    setData ((prev) => ({ ... prev, remember: checked === true, }))
                                }
                                tabIndex={3}
                            />
                            <Label htmlFor="remember">{t ("remember_me")}</Label>
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            tabIndex={4}
                            disabled={processing}
                            data-test="login-button"
                        >
                            {processing && <Spinner />}
                            {processing ? t ("logging_in") : t ("log_in")}
                        </Button>
                    </div>

                    {canRegister && (
                        <div className="text-center text-sm text-muted-foreground">
                            {t ("dont_have_account")}{" "}
                            <TextLink
                                href="/admin/auth/register"
                                tabIndex={5}
                            >
                                {t ("sign_up")}
                            </TextLink>
                        </div>
                    )}
                </form>
            </AuthLayout>
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "Login",
    namespaces: [ "auth", "common", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default Login;
