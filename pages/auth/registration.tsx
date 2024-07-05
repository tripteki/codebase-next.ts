import getConfig from 'next/config';
import Head from 'next/head';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { useTranslation, } from 'next-i18next';
import { useSession, } from 'next-auth/react';
import { FC, FormEvent, ChangeEvent, useState, useEffect, } from "react";
import { serverSideTranslations, } from 'next-i18next/serverSideTranslations';
import { call, } from '@/lib/call';
import InputComponent from '@/components/InputComponent';

type FormField =
{
    isError: boolean;
    isSuccess: boolean;
    value: boolean | string;
    validationMessage: string;
};

const { publicRuntimeConfig, } = getConfig ();

const AuthRegistrationTemplate: FC = () =>
{
    const [ isLoading, setIsLoading, ] = useState<boolean>(false);
    const [ isLoaded, setIsLoaded, ] = useState<boolean>(false);

    const [ form, setForm, ] = useState<
    {
        name: FormField;
        email: FormField;
        password: FormField;
        password_confirmation: FormField;
        agreement: FormField;
    }>(
    {
        name:
        {
            isError: false,
            isSuccess: false,
            value: "",
            validationMessage: "",
        },

        email:
        {
            isError: false,
            isSuccess: false,
            value: "",
            validationMessage: "",
        },

        password:
        {
            isError: false,
            isSuccess: false,
            value: "",
            validationMessage: "",
        },

        password_confirmation:
        {
            isError: false,
            isSuccess: false,
            value: "",
            validationMessage: "",
        },

        agreement:
        {
            isError: false,
            isSuccess: false,
            value: false,
            validationMessage: "",
        },
    });

    const router = useRouter ();
    const { t, } = useTranslation ('auth');
    const { data: session, status: sessionStatus, } = useSession ();

    const load = () =>
    {
        setIsLoading (true);
        setIsLoaded (false);
    };

    const reset = () =>
    {
        setIsLoading (false);
        setIsLoaded (true);
    };

    const handleChange = (field: string) => (e) =>
    {
        var newValue = field === 'agreement' ? newValue = e.target.checked : e;

        setForm (prevForm => (
        {
            ... prevForm,
            [field]: {
                ... prevForm[field],
                value: newValue,
            },
        }));
    };

    const registration = async (e: FormEvent<HTMLFormElement>) =>
    {
        e.preventDefault ();

        load ();

        const {

            isLoading: dataIsLoading,
            isLoaded: dataIsLoaded,
            isError: dataIsError,
            isSuccess: dataIsSuccess,
            data,
            error,

        } = await call (
        {
            baseUrl: publicRuntimeConfig.authURL,
            url: "/register",
            method: "POST",
            data: {

                name: form.name.value,
                email: form.email.value,
                password: form.password.value,
                password_confirmation: form.password_confirmation.value,
                agreement: form.agreement.value,
            },
        });

        if (dataIsSuccess) {

            let dataSuccess = data;

            router.push ('/auth/login');

        } else if (dataIsError) {

            let dataError = error?.response?.data?.data;

            setForm (prevForm => (
            {
                ... prevForm,
                ['name']: {
                    ... prevForm['name'],
                    isError: dataError?.name?.[0] ? true : false,
                    validationMessage: dataError?.name?.[0],
                },
                ['email']: {
                    ... prevForm['email'],
                    isError: dataError?.email?.[0] ? true : false,
                    validationMessage: dataError?.email?.[0],
                },
                ['password']: {
                    ... prevForm['password'],
                    isError: dataError?.password?.[0] ? true : false,
                    validationMessage: dataError?.password?.[0],
                },
            }));
        }

        reset ();
    };

    useEffect (() => {

        if (sessionStatus === 'authenticated') router.push ('/admin/dashboard');

    }, [ router, sessionStatus, ]);

    return (

        <>
            <Head>
                <title>Registration</title>
            </Head>
            <div className="container mx-auto mt-3 text-center">
                <form className="grid grid-rows-none gap-8 p-3 border" onSubmit={registration}>
                    <div>
                        <InputComponent
                            modelValue={form.name.value as string}
                            type="text"
                            name="name"
                            label="Username"
                            placeholder="user"
                            isLoaded={true}
                            isError={form.name.isError}
                            validationMessage={form.name.validationMessage}
                            onChange={handleChange ('name')}
                        />
                    </div>
                    <div>
                        <InputComponent
                            modelValue={form.email.value as string}
                            type="email"
                            name="email"
                            label="E-Mail"
                            placeholder="user@email.com"
                            isLoaded={true}
                            isError={form.email.isError}
                            validationMessage={form.email.validationMessage}
                            onChange={handleChange ('email')}
                        />
                    </div>
                    <div>
                        <InputComponent
                            modelValue={form.password.value as string}
                            type="password"
                            name="password"
                            label="Password"
                            placeholder="********"
                            isLoaded={true}
                            isError={form.password.isError}
                            validationMessage={form.password.validationMessage}
                            onChange={handleChange ('password')}
                        />
                    </div>
                    <div>
                        <InputComponent
                            modelValue={form.password_confirmation.value as string}
                            type="password"
                            name="password_confirmation"
                            label="Password Confirmation"
                            placeholder="********"
                            isLoaded={true}
                            onChange={handleChange ('password_confirmation')}
                        />
                    </div>
                    <div>
                        <label htmlFor="agreement">{t ('agreement')}</label>
                        <input
                            checked={form.agreement.value as boolean}
                            type="checkbox"
                            name="agreement"
                            id="agreement"
                            onChange={handleChange ('agreement')}
                        />
                    </div>
                    <button type="submit" className="border">{t ('sign_up')}</button>
                </form>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, }) =>
{
    return {

        props: {

            ... (await serverSideTranslations (locale ?? 'en', [

                'auth',
            ])),
        },
    };
};

export default AuthRegistrationTemplate;