import type { MetadataRoute, } from "next";
import type { AppProps, } from "next/app";
import { ReactElement, useEffect, } from "react";
import { SessionProvider, } from "next-auth/react";
import { appWithTranslation, } from "next-i18next";
import Head from "next/head";
import manifest from "@/app/manifest";
import "@/styles/globals.css";

const { name, }: MetadataRoute.Manifest = manifest ();

const Page = appWithTranslation ((
    { Component, pageProps, }: AppProps
): ReactElement =>
{
    useEffect ((): void => {
        if ("serviceWorker" in navigator) {
            navigator.serviceWorker.register ("/sw.js").then ((registration: ServiceWorkerRegistration) => {
                console.log (registration);
            }).catch ((throwable: unknown) => {
                console.error (throwable);
            });
        }
    }, []);

    return (

        <SessionProvider session={pageProps.session}>
            <Head>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
                <title>{`${name} | ${pageProps.title}`}</title>
            </Head>

            <Component {... pageProps} />
        </SessionProvider>
    );
});

export default Page;
