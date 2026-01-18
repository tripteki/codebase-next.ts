import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, } from "next";
import { ReactElement, FormEvent, useState, ChangeEvent, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useTranslation, } from "next-i18next";
import getConfig from "next/config";

import AuthLayout from "@/layouts/auth/auth-layout";
import InputError from "@/components/input-error";
import { Button, } from "@/components/ui/button";
import { Input, } from "@/components/ui/input";
import { Label, } from "@/components/ui/label";
import { Spinner, } from "@/components/ui/spinner";
import { call, } from "@/libs/call";

const { publicRuntimeConfig, } = getConfig ();

interface ResetPasswordProps
{
    email: string;
    signed?: string;
};

const ResetPassword = ({
    email,
    signed,
}: ResetPasswordProps): ReactElement =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("auth");
    const [ data, setData, ] = useState ({
        email,
        signed,
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
            const url = `/reset-password/${data.email}`;
            const params: Record<string, string> = {};

            if (data.signed)
            {
                params.signed = data.signed;
            }

            const response = await call ({
                baseUrl: publicRuntimeConfig.authURL,
                url,
                method: "POST",
                data: {
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                },
                params,
            });

            if (response.isError)
            {
                const axiosError = response.error as any;

                if (axiosError?.response?.data)
                {
                    if (axiosError.response.data.errors)
                    {
                        setErrors (axiosError.response.data.errors);
                    }
                    else if (axiosError.response.data.message)
                    {
                        setErrors ({ password: axiosError.response.data.message, });
                    }
                    else if (typeof axiosError.response.data === "string")
                    {
                        setErrors ({ password: axiosError.response.data, });
                    }
                    else
                    {
                        setErrors ({ password: t ("something_went_wrong"), });
                    }
                }
                else
                {
                    setErrors ({ password: t ("something_went_wrong"), });
                }
            }
            else if (response.isSuccess)
            {
                if (typeof response.data === "string")
                {
                    setErrors ({ password: response.data, });
                }
                else if (response.data?.errors)
                {
                    setErrors (response.data.errors);
                }
                else if (response.data && typeof response.data === "object")
                {
                    router.push ({
                        pathname: "/admin/auth/login",
                        query: { status: t ("password_reset"), },
                    });
                }
                else
                {
                    setErrors ({ password: t ("something_went_wrong"), });
                }
            }
        }
        catch (error)
        {
            setErrors ({ password: t ("something_went_wrong"), });
        }
        finally
        {
            setProcessing (false);
        }
    };

    return (
        <>
            <Head>
                <title>{t ("reset_password")}</title>
            </Head>

            <AuthLayout
                title={t ("reset_password_title")}
                description={t ("reset_password_description")}
            >
                <form onSubmit={submit}>
                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t ("email")}</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                className="mt-1 block w-full"
                                readOnly
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="password">{t ("password")}</Label>
                            <Input
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, password: e.target.value, }))
                                }
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                autoFocus
                                placeholder={t ("password_placeholder")}
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
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, password_confirmation: e.target.value, }))
                                }
                                autoComplete="new-password"
                                className="mt-1 block w-full"
                                placeholder={t ("password_confirmation_placeholder")}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <Button
                            type="submit"
                            className="mt-4 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <Spinner className="mx-5" />}
                            {processing ? t ("resetting") : t ("reset_password")}
                        </Button>
                    </div>
                </form>
            </AuthLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> =>
{
    const email = context.params?.email as string;
    const signed = context.query.signed as string | undefined;

    if (! email)
    {
        return {
            redirect: {
                destination: "/admin/auth/login",
                permanent: false,
            },
        };
    }

    return {
        props: {
            title: "Reset Password",
            email,
            ... (signed ? { signed, } : {}),
            ... (await serverSideTranslations (context.locale as string, [
                "auth",
                "common",
            ])),
        },
    };
};

export default ResetPassword;
