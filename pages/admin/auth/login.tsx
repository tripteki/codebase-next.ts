import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, } from "next";
import { ReactElement, FormEvent, useState, ChangeEvent, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { signIn, } from "next-auth/react";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useTranslation, } from "next-i18next";

import AuthLayout from "@/layouts/auth/auth-layout";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button, } from "@/components/ui/button";
import { Checkbox, } from "@/components/ui/checkbox";
import { Input, } from "@/components/ui/input";
import { Label, } from "@/components/ui/label";
import { Spinner, } from "@/components/ui/spinner";
import { type LoginProps, } from "@/types/admin/auth";

const Login = ({
    status,
    canResetPassword = true,
    canRegister = true,
}: LoginProps): ReactElement =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("auth");
    const [ data, setData, ] = useState ({
        identifier: "",
        password: "",
        remember: false,
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
                    if (typeof errorData === "object" && errorData !== null)
                    {
                        setErrors (errorData);
                    }
                    else
                    {
                        setErrors ({ identifier: result.error, });
                    }
                }
                catch
                {
                    setErrors ({ identifier: result.error, });
                }
            }
            else if (result?.ok)
            {
                router.push ("/admin/dashboard");
            }
        }
        catch (error)
        {
            setErrors ({ identifier: t ("authentication_failed"), });
        }
        finally
        {
            setProcessing (false);
        }
    };

    return (
        <>
            <Head>
                <title>{t ("login")}</title>
            </Head>

            <AuthLayout
                title={t ("login_title")}
                description={t ("login_description")}
            >
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-6"
                >
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t ("email_address")}</Label>
                            <Input
                                id="email"
                                type="email"
                                name="identifier"
                                value={data.identifier}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, identifier: e.target.value, }))
                                }
                                required
                                autoFocus
                                tabIndex={1}
                                autoComplete="email"
                                placeholder={t ("email_placeholder")}
                            />
                            <InputError message={errors.email || errors.identifier} />
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
                            />
                            <InputError message={errors.password} />
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
                            {processing && <Spinner className="mx-5" />}
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

                {status && (
                    <div className="mb-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}
            </AuthLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> =>
{
    const { getServerSession, } = await import ("next-auth/next");
    const { authOptions, } = await import ("../../api/auth/[...nextauth]");

    const session = await getServerSession (context.req, context.res, authOptions);

    if (session)
    {
        return {
            redirect: {
                destination: "/admin/dashboard",
                permanent: false,
            },
        };
    }

    const status = context.query.status as string | undefined;

    return {
        props: {
            title: "Login",
            ... (status ? { status, } : {}),
            ... (await serverSideTranslations (context.locale as string, [
                "auth",
                "common",
            ])),
        },
    };
};

export default Login;
