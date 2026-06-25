import { GetServerSideProps, } from "next";
import { ReactElement, FormEvent, useState, ChangeEvent, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import AuthLayout from "@/layouts/auth/auth-layout";
import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import FbButton from "@/components/flowbite/fb-button";
import FbInput from "@/components/flowbite/fb-input";
import FbLabel from "@/components/flowbite/fb-label";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { fbMuted, } from "@/libs/flowbite-classes";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/auth/forgot-password";
import { type ForgotPasswordProps, } from "@/types/admin/auth";
import { formatPageTitle, } from "@/libs/page-title";
import { parseApiErrors, } from "@/libs/parse-api-errors";
import { useRequireGuest, } from "@/hooks/auth-guard";


const ForgotPassword = ({
    status,
}: ForgotPasswordProps): ReactElement | null =>
{
    const canRender = useRequireGuest ();
    const router = useRouter ();
    const { t, } = useTranslation ("auth");
    const displayStatus = status ?? (router.query.status as string | undefined);
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
            const response = await fetch ("/api/auth/forgot-password", {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                },
                body: JSON.stringify (data),
            });
            const payload = await response.json ();

            if (! response.ok)
            {
                setErrors (parseApiErrors (payload, t ("something_went_wrong")));

                return;
            }

            if (payload?.errors)
            {
                setErrors (parseApiErrors (payload, t ("something_went_wrong")));

                return;
            }

            if (payload?.data || payload?.success)
            {
                router.push ({
                    pathname: "/admin/auth/login",
                    query: { status: t ("password_reset_link_sent"), },
                });

                return;
            }

            setErrors ({ email: t ("something_went_wrong"), });
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

    if (! canRender)
    {
        return null;
    }

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("forgot_password"))}</title>
            </Head>

            <AuthLayout
                title={t ("forgot_password_title")}
                description={t ("forgot_password_description")}
            >
                <AlertSuccess message={displayStatus} />

                <div className="space-y-6">
                    <form onSubmit={submit} noValidate>
                        <AlertError message={errors.general} />

                        <div className="grid gap-2">
                            <FbLabel htmlFor="email">{t ("email_address")}</FbLabel>
                            <FbInput
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
                                invalid={!! errors.email}
                            />

                            <InputError message={errors.email} />
                        </div>

                        <div className="my-6 flex items-center justify-start">
                            <FbButton
                                type="submit"
                                className="w-full"
                                disabled={processing}
                                data-test="email-password-reset-link-button"
                            >
                                {processing && <FbSpinner />}
                                {processing ? t ("sending") : t ("email_password_reset_link")}
                            </FbButton>
                        </div>
                    </form>

                    <div className={`space-x-1 text-center text-sm ${fbMuted}`}>
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

const pageOptions: PagePropsOptions = {
    title: "Forgot Password",
    namespaces: [ "auth", "common", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default ForgotPassword;
