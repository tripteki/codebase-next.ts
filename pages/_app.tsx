"use strict";

import type { AppProps } from "next/app";
import { appWithTranslation, } from "next-i18next";
import { DefaultSeo, } from "next-seo";
import { Fragment, } from "react";
import PrelineScript from "../app/components/PrelineScript";
import site from "../next-seonext.config";
import "../assets/css/globals.css";

export default appWithTranslation (({ Component, pageProps, }: AppProps): JSX.Element =>
{
    return (

        <Fragment>
            <DefaultSeo {...site} />
            <Component {...pageProps} />

            <PrelineScript />
        </Fragment>
    );
});
