"use strict";

import type { AppProps } from "next/app";
import { appWithTranslation, } from "next-i18next";
import { DefaultSeo, } from "next-seo";
import { SessionProvider, } from 'next-auth/react';
import site from "../next-seonext.config";
import "../assets/css/globals.css";

export default appWithTranslation (({ Component, pageProps, }: AppProps): JSX.Element =>
{
    return (

        <SessionProvider session={pageProps.session}>
            <DefaultSeo {...site} />
            <Component {...pageProps} />
        </SessionProvider>
    );
});
