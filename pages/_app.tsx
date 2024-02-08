"use strict";

import type { AppProps } from "next/app";
import { AppCacheProvider, } from "@mui/material-nextjs/v13-pagesRouter";
import { appWithTranslation, } from "next-i18next";
import { DefaultSeo, } from "next-seo";
import site from "../next-seonext.config";

export default appWithTranslation (({ Component, pageProps, }: AppProps): JSX.Element =>
{
    return (

        <AppCacheProvider {...pageProps}>
            <DefaultSeo {...site} />
            <Component {...pageProps} />
        </AppCacheProvider>
    );
});
