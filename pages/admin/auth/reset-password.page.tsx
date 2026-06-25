import { GetServerSideProps, } from "next";
import { ReactElement, FormEvent, useState, ChangeEvent, useEffect, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import AuthLayout from "@/layouts/auth/auth-layout";
import AlertError from "@/components/alert-error";
import InputError from "@/components/input-error";
import FbButton from "@/components/flowbite/fb-button";
import FbInput from "@/components/flowbite/fb-input";
import FbLabel from "@/components/flowbite/fb-label";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/auth/reset-password";
import { type ResetPasswordProps, } from "@/types/admin/auth";
import { formatPageTitle, } from "@/libs/page-title";
import { parseApiErrors, focusPasswordMatchError, } from "@/libs/parse-api-errors";


const ResetPassword = ({
    token: tokenProp,
    email: emailProp,
}: ResetPasswordProps): ReactElement =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("auth");
    const token = tokenProp ?? (router.query.token as string) ?? "";
    const email = emailProp ?? (router.query.email as string) ?? "";
    const [ data, setData, ] = useState ({
        token,
        email,
        password: "",
        password_confirmation: "",
    });

    useEffect ((): void =>
    {
        setData ((prev) => ({
            ... prev,
            token,
            email,
        }));
    }, [ token, email, ]);
    const [ errors, setErrors, ] = useState<Record<string, string>> ({});
    const [ processing, setProcessing, ] = useState (false);

    const submit = async (e: FormEvent): Promise<void> =>
    {
        e.preventDefault ();
        setProcessing (true);
        setErrors ({});

        try
        {
            const response = await fetch ("/api/auth/reset-password", {
                method: "POST",
                headers: { "Content-Type": "application/json", },
                body: JSON.stringify ({
                    token: data.token || undefined,
                    email: data.email,
                    password: data.password,
                    password_confirmation: data.password_confirmation,
                }),
            });
            const payload = await response.json ();

            if (! response.ok)
            {
                setErrors (focusPasswordMatchError (
                    parseApiErrors (payload, t ("something_went_wrong")),
                    "password"
                ));

                return;
            }

            if (payload?.errors)
            {
                setErrors (focusPasswordMatchError (
                    parseApiErrors (payload, t ("something_went_wrong")),
                    "password"
                ));

                return;
            }

            if (payload?.success || payload?.message)
            {
                router.push ({
                    pathname: "/admin/auth/login",
                    query: { status: t ("password_reset"), },
                });
                return;
            }

            setErrors ({ password: t ("something_went_wrong"), });
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
                <title>{formatPageTitle (t ("reset_password"))}</title>
            </Head>

            <AuthLayout
                title={t ("reset_password_title")}
                description={t ("reset_password_description")}
            >
                <form onSubmit={submit} noValidate>
                    <AlertError message={errors.general} />

                    <div className="grid gap-6">
                        <div className="grid gap-2">
                            <FbLabel htmlFor="email">{t ("email")}</FbLabel>
                            <FbInput
                                id="email"
                                type="email"
                                name="email"
                                autoComplete="email"
                                value={email}
                                readOnly
                            />
                            <InputError message={errors.email} />
                        </div>

                        <div className="grid gap-2">
                            <FbLabel htmlFor="password">{t ("password")}</FbLabel>
                            <FbInput
                                id="password"
                                type="password"
                                name="password"
                                value={data.password}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, password: e.target.value, }))
                                }
                                autoComplete="new-password"
                                autoFocus
                                placeholder={t ("password_placeholder")}
                                invalid={!! errors.password}
                            />
                            <InputError message={errors.password} />
                        </div>

                        <div className="grid gap-2">
                            <FbLabel htmlFor="password_confirmation">
                                {t ("password_confirmation_label")}
                            </FbLabel>
                            <FbInput
                                id="password_confirmation"
                                type="password"
                                name="password_confirmation"
                                value={data.password_confirmation}
                                onChange={(e: ChangeEvent<HTMLInputElement>): void =>
                                    setData ((prev) => ({ ... prev, password_confirmation: e.target.value, }))
                                }
                                autoComplete="new-password"
                                placeholder={t ("password_confirmation_placeholder")}
                                invalid={!! errors.password_confirmation}
                            />
                            <InputError message={errors.password_confirmation} />
                        </div>

                        <FbButton
                            type="submit"
                            className="mt-4 w-full"
                            disabled={processing}
                            data-test="reset-password-button"
                        >
                            {processing && <FbSpinner />}
                            {processing ? t ("resetting") : t ("reset_password")}
                        </FbButton>
                    </div>
                </form>
            </AuthLayout>
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "Reset Password",
    namespaces: [ "auth", "common", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default ResetPassword;
