import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, } from "next";
import { ReactElement, FormEvent, useState, ChangeEvent, } from "react";
import { useRouter, } from "next/router";
import Head from "next/head";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useTranslation, } from "next-i18next";
import getConfig from "next/config";

import AuthLayout from "@/layouts/auth/auth-layout";
import InputError from "@/components/input-error";
import TextLink from "@/components/text-link";
import { Button, } from "@/components/ui/button";
import { Input, } from "@/components/ui/input";
import { Label, } from "@/components/ui/label";
import { Spinner, } from "@/components/ui/spinner";
import { call, } from "@/libs/call";

const { publicRuntimeConfig, } = getConfig ();

const Register = (): ReactElement =>
{
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
            const response = await call ({
                baseUrl: publicRuntimeConfig.authURL,
                url: "/register",
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
                        setErrors ({ general: axiosError.response.data.message, });
                    }
                    else if (typeof axiosError.response.data === "string")
                    {
                        setErrors ({ general: axiosError.response.data, });
                    }
                    else
                    {
                        setErrors ({ general: t ("registration_failed"), });
                    }
                }
                else
                {
                    setErrors ({ general: t ("registration_failed"), });
                }
            }
            else if (response.isSuccess)
            {
                if (typeof response.data === "string")
                {
                    setErrors ({ general: response.data, });
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
                    setErrors ({ general: t ("registration_failed"), });
                }
            }
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

    return (
        <>
            <Head>
                <title>{t ("register")}</title>
            </Head>

            <AuthLayout
                title={t ("register_title")}
                description={t ("register_description")}
            >
                <form
                    onSubmit={submit}
                    className="flex flex-col gap-6"
                >
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
                            {processing && <Spinner className="mx-5" />}
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

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> =>
({
    props: {
        title: "Register",
        ... (await serverSideTranslations (context.locale as string, [
            "auth",
            "common",
        ])),
    },
});

export default Register;
