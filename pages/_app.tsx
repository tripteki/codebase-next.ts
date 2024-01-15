"use strict";

import type { AppProps, } from "next/app";
import React, { ReactElement, } from "react";
import { appWithTranslation, } from "next-i18next";
import { AppCacheProvider, } from "@mui/material-nextjs/v13-pagesRouter";

const Application = ({ Component, pageProps, }: AppProps): ReactElement =>
{
    const AnyComponent = Component as any;

    return (

        <AppCacheProvider {...pageProps}>
            <AnyComponent {...pageProps} />
        </AppCacheProvider>
    )
};

export default appWithTranslation (Application);
