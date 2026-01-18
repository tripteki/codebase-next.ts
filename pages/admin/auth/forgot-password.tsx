import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, } from "next";
import { ReactElement, FormEvent, useState, ChangeEvent, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useTranslation, } from "next-i18next";
import { LoaderCircle, } from "lucide-react";
import getConfig from "next/config";

import AuthLayout from "@/layouts/auth/auth-layout";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button, } from "@/components/ui/button";
import { Input, } from "@/components/ui/input";
import { Label, } from "@/components/ui/label";
import { type ForgotPasswordProps, } from "@/types/admin/auth";
import { call, } from "@/libs/call";

const { publicRuntimeConfig, } = getConfig ();

const ForgotPassword = ({
    status,
}: ForgotPasswordProps): ReactElement =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("auth");
    const [ data, setData, ] = useState ({
        email: "",
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
            const response = await call ({
                baseUrl: publicRuntimeConfig.authURL,
                url: "/forgot-password",
                method: "POST",
                data,
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
                        setErrors ({ email: axiosError.response.data.message, });
                    }
                    else if (typeof axiosError.response.data === "string")
                    {
                        setErrors ({ email: axiosError.response.data, });
                    }
                    else
                    {
                        setErrors ({ email: t ("something_went_wrong"), });
                    }
                }
                else
                {
                    setErrors ({ email: t ("something_went_wrong"), });
                }
            }
            else if (response.isSuccess)
            {
                if (typeof response.data === "string")
                {
                    setErrors ({ email: response.data, });
                }
                else if (response.data?.errors)
                {
                    setErrors (response.data.errors);
                }
                else if (response.data && typeof response.data === "object")
                {
                    router.push ({
                        pathname: "/admin/auth/login",
                        query: { status: t ("verification-sent"), },
                    });
                }
                else
                {
                    setErrors ({ email: t ("something_went_wrong"), });
                }
            }
        }
        catch (error)
        {
            setErrors ({ email: t ("something_went_wrong"), });
        }
        finally
        {
            setProcessing (false);
        }
    };

    return (
        <>
            <Head>
                <title>{t ("forgot_password")}</title>
            </Head>

            <AuthLayout
                title={t ("forgot_password_title")}
                description={t ("forgot_password_description")}
            >
                {status && (
                    <div className="mb-4 text-center text-sm font-medium text-green-600">
                        {status}
                    </div>
                )}

                <div className="space-y-6">
                    <form onSubmit={submit}>
                        <div className="grid gap-2">
                            <Label htmlFor="email">{t ("email_address")}</Label>
                            <Input
                                id="email"
                                type="email"
                                name="email"
                                value={data.email}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, email: e.target.value, }))
                                }
                                autoComplete="off"
                                autoFocus
                                placeholder={t ("email_placeholder")}
                            />

                            <InputError message={errors.email} />
                        </div>

                        <div className="my-6 flex items-center justify-start">
                            <Button
                                type="submit"
                                className="w-full"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && (
                                    <LoaderCircle className="h-4 w-4 animate-spin" />
                                )}
                                {processing ? t ("sending") : t ("email_password_reset_link")}
                            </Button>
                        </div>
                    </form>

                    <div className="space-x-1 text-center text-sm text-muted-foreground">
                        <span>{t ("or_return_to")}</span>
                        <TextLink href="/admin/auth/login">
                            {t ("log_in_lower")}
                        </TextLink>
                    </div>
                </div>
            </AuthLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> =>
{
    const status = context.query.status as string | undefined;

    return {
        props: {
            title: "Forgot Password",
            ... (status ? { status, } : {}),
            ... (await serverSideTranslations (context.locale as string, [
                "auth",
                "common",
            ])),
        },
    };
};

export default ForgotPassword;
