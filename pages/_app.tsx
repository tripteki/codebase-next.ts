"use strict";

import type { AppProps } from "next/app";
import { appWithTranslation, } from "next-i18next";
import { DefaultSeo, } from "next-seo";
import { SessionProvider, } from "next-auth/react";
import { AppCacheProvider, } from "@mui/material-nextjs/v15-pagesRouter";
import { ReactElement, } from "react";
import manifest, { url, } from "../app/manifest";
import Head from "next/head";
import site from "../next-seonext.config";
import "../assets/css/globals.css";
import "../assets/js/globals";

const { name, short_name, theme_color, background_color, icons, } = manifest ();
const defaultIcon = icons && icons.length > 0 ? icons[0].src : "/favicon.png";

export default appWithTranslation (({ Component, pageProps, }: AppProps): ReactElement =>
{
    return (

        <AppCacheProvider {... pageProps}>
            <SessionProvider session={pageProps.session}>
                <Head>
                    <meta name="robots" content="noindex" />
                    <meta name="viewport" content="minimum-scale=1, initial-scale=1, width=device-width, shrink-to-fit=no, user-scalable=no, viewport-fit=cover" />
                    <meta name="description" content={short_name} />
                    <meta name="theme-color" content={theme_color} />
                    <meta name="twitter:card" content="summary" />
                    <meta name="twitter:url" content={url} />
                    <meta name="twitter:title" content={name} />
                    <meta name="twitter:description" content={short_name} />
                    <meta name="twitter:image" content={defaultIcon} />
                    <meta property="og:type" content="website" />
                    <meta property="og:title" content={name} />
                    <meta property="og:description" content={short_name} />
                    <meta property="og:site_name" content={name} />
                    <meta property="og:url" content={url} />
                    <meta property="og:image" content={defaultIcon} />
                    <link rel="manifest" href="/api/manifest" />
                    <link rel="shortcut icon" href="/favicon.png" />
                    <link rel="mask-icon" href="/icons/mask-icon.svg" color={theme_color} />
                    <link rel="apple-touch-icon" href={defaultIcon} />
                    <link rel="apple-touch-startup-image" href="/manifest/apple_splash_2048.png" sizes="2048x2732" />
                </Head>

                <DefaultSeo {... site} />
                <Component {... pageProps} />
            </SessionProvider>
        </AppCacheProvider>
    );
});
