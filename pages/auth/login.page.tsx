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
import FbButton from "@/components/flowbite/fb-button";
import FbCheckboxField from "@/components/flowbite/fb-checkbox-field";
import FbInput from "@/components/flowbite/fb-input";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { useRequireGuest, } from "@/hooks/auth-guard";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/auth/login";
import { formatPageTitle, } from "@/libs/page-title";
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
    const [ needsVerification, setNeedsVerification, ] = useState (false);
    const [ resending, setResending, ] = useState (false);
    const [ resendSuccess, setResendSuccess, ] = useState ("");
    const displayStatus = status ?? (router.query.status as string | undefined);

    const submit = async (e: FormEvent): Promise<void> =>
    {
        e.preventDefault ();

        if (! data.identifier.trim () || ! data.password)
        {
            setErrors ({
                ...(! data.identifier.trim () ? { identifier: t ("email_required"), } : {}),
                ...(! data.password ? { password: t ("password_required"), } : {}),
            });

            return;
        }

        setProcessing (true);
        setErrors ({});
        setNeedsVerification (false);
        setResendSuccess ("");

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
                    const parsed = parseApiErrors (errorData, t ("authentication_failed"));

                    setErrors (parsed);
                    setNeedsVerification (parsed.code === "email_not_verified");
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

    const resendVerification = async (): Promise<void> =>
    {
        const email = data.identifier.trim ();

        if (! email.includes ("@") || resending)
        {
            return;
        }

        setResending (true);
        setResendSuccess ("");
        setErrors ({});

        try
        {
            const response = await fetch ("/api/auth/resend-verification", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify ({ email, }),
            });
            const payload = await response.json () as { message?: string; errors?: Record<string, string>; };

            if (! response.ok)
            {
                setErrors (parseApiErrors (payload, t ("something_went_wrong")));

                return;
            }

            setResendSuccess (payload.message || t ("verification-sent"));
            setNeedsVerification (false);
        }
        catch
        {
            setErrors ({ general: t ("something_went_wrong"), });
        }
        finally
        {
            setResending (false);
        }
    };

    const identifierError = errors.email || errors.identifier || errors.identifierValue;
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
                variant="hero"
                title=""
            >
                <form
                    method="post"
                    onSubmit={submit}
                    className="flex flex-col gap-4"
                    noValidate
                >
                    <AlertSuccess message={displayStatus || resendSuccess} />
                    <AlertError message={errors.general} />
                    {needsVerification ? (
                        <div className="auth-resend-box p-3 text-sm">
                            <p>{t ("email_not_verified_message")}</p>
                            <FbButton
                                type="button"
                                variant="outline"
                                className="mt-3"
                                disabled={resending || ! data.identifier.includes ("@")}
                                onClick={() => void resendVerification ()}
                            >
                                {resending ? <FbSpinner /> : null}
                                {resending ? t ("resending_verification_email") : t ("resend_verification_email")}
                            </FbButton>
                        </div>
                    ) : null}

                    <div className="grid gap-4">
                        <div className="grid gap-1.5">
                            <FbInput
                                icon="none"
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
                                invalid={!! identifierError}
                            />
                            <InputError message={identifierError} />
                        </div>

                        <div className="grid gap-1.5">
                            <FbInput
                                icon="none"
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
                                invalid={!! passwordError}
                            />
                            <InputError message={passwordError} />
                        </div>

                        <div className="flex flex-col gap-3 pt-2 sm:gap-4">
                            <div className="flex min-h-[1.25rem] items-center justify-between gap-4">
                                <FbCheckboxField
                                    id="remember"
                                    name="remember"
                                    checked={data.remember}
                                    onCheckedChange={(checked: boolean): void =>
                                        setData ((prev) => ({ ... prev, remember: checked, }))
                                    }
                                    tabIndex={3}
                                    className="checkbox-auth-primary h-4 w-4 cursor-pointer rounded border-white/40 bg-white/10"
                                    labelClassName="font-normal text-white/80"
                                >
                                    {t ("remember_me")}
                                </FbCheckboxField>
                                {canResetPassword ? (
                                    <TextLink
                                        href="/auth/forgot-password"
                                        className="ml-auto text-sm"
                                        tabIndex={5}
                                    >
                                        {t ("forgot_password_link")}
                                    </TextLink>
                                ) : null}
                            </div>
                            <FbButton
                                type="submit"
                                className="w-full"
                                tabIndex={4}
                                disabled={processing}
                                data-test="login-button"
                            >
                                {processing && <FbSpinner />}
                                {processing ? t ("logging_in") : t ("continue")}
                            </FbButton>
                        </div>
                    </div>

                    {canRegister ? (
                        <p className="text-center text-sm text-white/80">
                            <TextLink href="/auth/register" className="underline" tabIndex={5}>
                                {t ("create_account")}
                            </TextLink>
                        </p>
                    ) : null}
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
