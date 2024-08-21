"use strict";

// https://nextjs.org/docs/pages/api-reference/components //

import type { DocumentContext, DocumentInitialProps, DocumentProps, } from "next/document";
import type { DocumentHeadTagsProps, } from '@mui/material-nextjs/v13-pagesRouter';
import Document, { Html, Head, Main, NextScript, } from "next/document";
import { DocumentHeadTags, documentGetInitialProps, } from '@mui/material-nextjs/v13-pagesRouter';
import { ReactElement, } from 'react';
import i18nextConfig from "../next-i18next.config";

const Template = (props: DocumentProps & DocumentHeadTagsProps): ReactElement =>
{
    const i18n: string = i18nextConfig.i18n.defaultLocale;

    return (

        <Html lang={i18n}>
            <Head>
                <meta name="robots" content="noindex" />
                <link rel="preconnect" href="https://fonts.googleapis.com" />
                <link rel="preconnect" href="https://fonts.gstatic.com" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Roboto:wght@300;400;500;600;700&display=swap" />
                <link rel="stylesheet" href="https://fonts.googleapis.com/icon?family=Material+Icons" />
                <link rel="icon" type="image/png" href="/favicon.png" />

                <DocumentHeadTags {...props} />
            </Head>
            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

// https://nextjs.org/docs/pages/api-reference/functions //

export const getInitialProps = async (context: DocumentContext): Promise<DocumentInitialProps> =>
{
    return {

        ... (await documentGetInitialProps (context)),
    };
};

export default Template;
