import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, } from "next";
import { ReactElement, useEffect, useState, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useTranslation, } from "next-i18next";
import getConfig from "next/config";

import AuthLayout from "@/layouts/auth/auth-layout";
import { Button, } from "@/components/ui/button";
import TextLink from "@/components/text-link";
import { Spinner, } from "@/components/ui/spinner";
import { call, } from "@/libs/call";

const { publicRuntimeConfig, } = getConfig ();

interface VerifyEmailProps
{
    email: string;
    signed: string;
};

const VerifyEmail = ({
    email,
    signed,
}: VerifyEmailProps): ReactElement =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("auth");
    const [ status, setStatus, ] = useState<"verifying" | "success" | "error"> ("verifying");
    const [ message, setMessage, ] = useState<string> ("");

    useEffect ((): void =>
    {
        const verifyEmail = async (): Promise<void> =>
        {
            try
            {
                const response = await call ({
                    baseUrl: publicRuntimeConfig.authURL,
                    url: `/verify-email/${email}`,
                    method: "POST",
                    data: {},
                    params: {
                        signed,
                    },
                });

                const getErrorMessage = (): string | null =>
                {
                    if (response.isError)
                    {
                        const axiosError = response.error as any;
                        if (axiosError?.response?.data?.message)
                        {
                            return axiosError.response.data.message;
                        }
                        if (axiosError?.response?.data?.errors?.general)
                        {
                            return axiosError.response.data.errors.general;
                        }
                        if (typeof axiosError?.response?.data === "string")
                        {
                            return axiosError.response.data;
                        }
                        return t ("verification_failed");
                    }

                    if (response.isSuccess)
                    {
                        if (typeof response.data === "string")
                        {
                            return response.data;
                        }
                        if (response.data?.errors?.general)
                        {
                            return response.data.errors.general;
                        }
                        if (response.data?.errors && response.data?.message)
                        {
                            return response.data.message;
                        }
                    }

                    return null;
                };

                const errorMessage = getErrorMessage ();
                const shouldRedirect = errorMessage && (
                    errorMessage.includes ("The selected User does not exist") ||
                    errorMessage.includes ("User does not exist") ||
                    errorMessage.includes ("Email verification failed")
                );

                if (shouldRedirect)
                {
                    router.push ("/");
                    return;
                }

                if (errorMessage)
                {
                    setStatus ("error");
                    setMessage (errorMessage);
                }
                else if (response.isSuccess && response.data && typeof response.data === "object" && ! response.data.errors)
                {
                    setStatus ("success");
                    setMessage (response.data.message || t ("email_verified"));
                }
                else
                {
                    setStatus ("error");
                    setMessage (t ("verification_failed"));
                }
            }
            catch (error)
            {
                setStatus ("error");
                setMessage (t ("verification_failed"));
            }
        };

        verifyEmail ();
    }, [ email, signed, t, router, ]);

    return (
        <>
            <Head>
                <title>{t ("verify_email")}</title>
            </Head>

            <AuthLayout
                title={t ("verify_email_title")}
                description={t ("verify_email_description")}
            >
                <div className="space-y-6">
                    {status === "verifying" && (
                        <div className="flex flex-col items-center gap-4">
                            <Spinner className="h-8 w-8" />
                            <p className="text-center text-sm text-muted-foreground">
                                {t ("verifying_email")}
                            </p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-green-50 dark:bg-green-900/20 p-4 text-center">
                                <p className="text-sm font-medium text-green-800 dark:text-green-200">
                                    {message}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={(): void =>
                                    {
                                        router.push ("/admin/auth/login");
                                    }}
                                    className="w-full"
                                >
                                    {t ("log_in")}
                                </Button>

                                <TextLink
                                    href="/"
                                    className="text-center text-sm"
                                >
                                    {t ("go_to_home")}
                                </TextLink>
                            </div>
                        </div>
                    )}

                    {status === "error" && (
                        <div className="space-y-4">
                            <div className="rounded-lg bg-red-50 dark:bg-red-900/20 p-4 text-center">
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    {message}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <Button
                                    onClick={(): void =>
                                    {
                                        router.push ("/admin/auth/login");
                                    }}
                                    variant="outline"
                                    className="w-full"
                                >
                                    {t ("go_to_login")}
                                </Button>

                                <TextLink
                                    href="/admin/auth/register"
                                    className="text-center text-sm"
                                >
                                    {t ("sign_up")}
                                </TextLink>
                            </div>
                        </div>
                    )}
                </div>
            </AuthLayout>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> =>
{
    const email = context.params?.email as string;
    const signed = context.query.signed as string;

    if (! email || ! signed)
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
            title: "Verify Email",
            email,
            signed,
            ... (await serverSideTranslations (context.locale as string, [
                "auth",
                "common",
            ])),
        },
    };
};

export default VerifyEmail;
