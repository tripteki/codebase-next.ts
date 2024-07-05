import getConfig from 'next/config';
import Head from 'next/head';
import { GetServerSideProps, } from 'next';
import { useRouter, } from 'next/router';
import { serverSideTranslations, } from 'next-i18next/serverSideTranslations';
import { useTranslation, } from 'next-i18next';
import { signOut, getSession, } from 'next-auth/react';
import { FC, MouseEvent, } from 'react';
import { call, } from '@/lib/call';

const { publicRuntimeConfig, } = getConfig ();

const AdminDashboardTemplate: FC = () =>
{
    const router = useRouter ();
    const { t, } = useTranslation ('auth');

    const logout = async (e: MouseEvent<HTMLButtonElement>) =>
    {
        e.preventDefault ();

        try {

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
                url: "/logout",
                method: "POST",
            });

            await signOut (
            {
                redirect: true,
                callbackUrl: '/auth/login',
            });

        } catch (throwable) {

            console.error (throwable);
        }
    };

    return (

        <>
            <Head>
                <title>Dashboard</title>
            </Head>
            <div className="container mx-auto mt-3 text-center">
                <button onClick={logout} type="button" className="border">Sign out</button>
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (context) =>
{
    const locale = context.locale || 'en';
    const session = await getSession (context);

    if (! session) {

        return {

            redirect: {

                permanent: false,
                destination: '/auth/login',
            },
        };
    }

    return {

        props: {

            ... (await serverSideTranslations (locale ?? 'en', [

                'auth',
            ])),
        },
    };
};

export default AdminDashboardTemplate;