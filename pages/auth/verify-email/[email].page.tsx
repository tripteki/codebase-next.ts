import { GetServerSideProps, } from "next";
import { ReactElement, useEffect, useState, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import AuthLayout from "@/layouts/auth/auth-layout";
import TextLink from "@/components/text-link";
import FbButton from "@/components/flowbite/fb-button";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { fbAlertSuccess, fbMuted, } from "@/libs/flowbite-classes";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/auth/verify-email/[email]";
import { shouldRedirectVerifyEmailError, } from "@/libs/api-error-matchers";
import { formatPageTitle, } from "@/libs/page-title";
import {
    normalizeAuthEmailParam,
    resolveAuthQueryParam,
} from "@/libs/auth-email";


interface VerifyEmailProps
{
    email: string;
    signed: string;
};

const VerifyEmail = ({
    email: emailProp,
    signed: signedProp,
}: VerifyEmailProps): ReactElement =>
{
    const router = useRouter ();
    const { t, i18n, } = useTranslation ("auth");
    const email = normalizeAuthEmailParam (
        emailProp ?? resolveAuthQueryParam (router.query.email)
    );
    const signed = signedProp ?? resolveAuthQueryParam (router.query.signed);
    const [ status, setStatus, ] = useState<"verifying" | "success" | "error"> ("verifying");
    const [ message, setMessage, ] = useState<string> ("");

    useEffect ((): (() => void) | void =>
    {
        if (! email || ! signed)
        {
            return;
        }

        let cancelled = false;

        const verifyEmail = async (): Promise<void> =>
        {
            const translate = i18n.getFixedT (i18n.language, "auth");

            try
            {
                const response = await fetch ("/api/auth/verify-email", {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify ({
                        email,
                        signed,
                    }),
                });
                const payload = await response.json ();

                if (cancelled)
                {
                    return;
                }

                const getErrorMessage = (): string | null =>
                {
                    if (! response.ok)
                    {
                        if (payload?.errors?.general)
                        {
                            return payload.errors.general;
                        }

                        if (payload?.message)
                        {
                            return payload.message;
                        }

                        return translate ("verification_failed");
                    }

                    if (payload?.errors?.general)
                    {
                        return payload.errors.general;
                    }

                    if (payload?.message && ! payload.success)
                    {
                        return payload.message;
                    }

                    return null;
                };

                const errorMessage = getErrorMessage ();
                const shouldRedirect = errorMessage && shouldRedirectVerifyEmailError (errorMessage);

                if (shouldRedirect)
                {
                    void router.replace ("/");
                    return;
                }

                if (errorMessage)
                {
                    setStatus ("error");
                    setMessage (errorMessage);
                }
                else if (payload?.success)
                {
                    setStatus ("success");
                    setMessage (payload.message || translate ("email_verified"));
                }
                else
                {
                    setStatus ("error");
                    setMessage (translate ("verification_failed"));
                }
            }
            catch
            {
                if (! cancelled)
                {
                    setStatus ("error");
                    setMessage (translate ("verification_failed"));
                }
            }
        };

        void verifyEmail ();

        return (): void =>
        {
            cancelled = true;
        };
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ email, signed, ]);

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("verify_email"))}</title>
            </Head>

            <AuthLayout
                title={t ("verify_email_title")}
                description={t ("verify_email_description")}
            >
                <div className="space-y-6">
                    {status === "verifying" && (
                        <div className="flex flex-col items-center gap-4">
                            <FbSpinner className="h-8 w-8" />
                            <p className={`text-center text-sm ${fbMuted}`}>
                                {t ("verifying_email")}
                            </p>
                        </div>
                    )}

                    {status === "success" && (
                        <div className="space-y-4">
                            <div className={`${fbAlertSuccess} text-center`}>
                                <p className="font-medium">
                                    {message}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <FbButton
                                    className="w-full"
                                    href="/admin/auth/login"
                                >
                                    {t ("log_in")}
                                </FbButton>

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
                            <div className="rounded-lg bg-red-50 p-4 text-center dark:bg-red-900/20">
                                <p className="text-sm font-medium text-red-800 dark:text-red-200">
                                    {message}
                                </p>
                            </div>

                            <div className="flex flex-col gap-2">
                                <FbButton
                                    variant="outline"
                                    className="w-full"
                                    href="/admin/auth/login"
                                >
                                    {t ("go_to_login")}
                                </FbButton>

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

const pageOptions: PagePropsOptions = {
    title: "Verify Email",
    namespaces: [ "auth", "common", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
    requireParams: [ "email", ],
    requireQuery: [ "signed", ],
});

export default VerifyEmail;
