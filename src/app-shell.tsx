import type { AppProps, } from "next/app";
import { ReactElement, useEffect, } from "react";
import { getSession, useSession, } from "next-auth/react";
import Head from "next/head";
import NotificationShellExtras from "@/components/notifications/notification-shell-extras";
import PwaInstallBanner from "@/components/pwa-install-banner";
import { useSessionRefreshError, } from "@/hooks/use-session-refresh-error";
import { applyBrandCss, } from "@/libs/apply-brand-css";
import { attachPwaInstallListener, } from "@/libs/pwa-install";
import { resolveBrandColors, } from "@/libs/branding";
import { publicRuntimeConfig, } from "@/libs/runtime-config";

const AuthenticatedExtras = (): ReactElement | null =>
{
    const { status, } = useSession ();

    if (status !== "authenticated")
    {
        return null;
    }

    return <NotificationShellExtras />;
};

const AppShell = (
    { Component, pageProps, }: AppProps
): ReactElement =>
{
    useSessionRefreshError ();

    useEffect ((): void =>
    {
        applyBrandCss (document.documentElement, resolveBrandColors ());
    }, []);

    useEffect (() =>
    {
        attachPwaInstallListener ();
    }, []);

    useEffect (() =>
    {
        const handlePageShow = (event: PageTransitionEvent): void =>
        {
            if (event.persisted)
            {
                void getSession ();
            }
        };

        window.addEventListener ("pageshow", handlePageShow);

        return () =>
        {
            window.removeEventListener ("pageshow", handlePageShow);
        };
    }, []);

    useEffect ((): void =>
    {
        if (! ("serviceWorker" in navigator))
        {
            return;
        }

        if (process.env.NODE_ENV !== "production")
        {
            void navigator.serviceWorker.getRegistrations ().then ((registrations) =>
            {
                for (const registration of registrations)
                {
                    void registration.unregister ();
                }
            });

            return;
        }

        void navigator.serviceWorker.register ("/sw.js");
    }, []);

    const formattedAppName =
        publicRuntimeConfig.appName.charAt (0).toUpperCase () +
        publicRuntimeConfig.appName.slice (1);

    return (
        <>
            <Head>
                <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
                <meta name="apple-mobile-web-app-title" content={formattedAppName} />
                <meta name="application-name" content={formattedAppName} />
            </Head>

            <PwaInstallBanner />
            <AuthenticatedExtras />
            <Component {... pageProps} />
        </>
    );
};

export default AppShell;
