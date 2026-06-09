import type { AppProps, } from "next/app";
import { ReactElement, useEffect, } from "react";
import { SessionProvider, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";
import Head from "next/head";
import { getClientLocale, } from "@/libs/i18n/locale";

const AppShell = (
    { Component, pageProps, }: AppProps
): ReactElement =>
{
    const { i18n, } = useTranslation ();

    useEffect ((): void =>
    {
        const locale = getClientLocale ();

        if (i18n.language !== locale)
        {
            void i18n.changeLanguage (locale);
        }
    }, [ i18n, ]);

    useEffect ((): void =>
    {
        if (process.env.NODE_ENV !== "production" || ! ("serviceWorker" in navigator))
        {
            return;
        }

        navigator.serviceWorker.register ("/sw.js")
                .then ((registration: ServiceWorkerRegistration) =>
                {
                    console.log (registration);
                })
                .catch ((throwable: unknown) =>
                {
                    console.error (throwable);
                });
    }, []);

    return (
        <SessionProvider session={pageProps.session}>
            <Head>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
            </Head>

            <Component {... pageProps} />
        </SessionProvider>
    );
};

export default AppShell;
