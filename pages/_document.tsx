// https://nextjs.org/docs/pages/api-reference/components //

import type { DocumentContext, DocumentInitialProps, DocumentProps, } from "next/document";
import Document, { Html, Head, Main, NextScript, } from "next/document";
import { ReactElement, } from "react";
import { useLocale, } from "@/hooks/i18n";

const DocumentPage = (props: DocumentProps): ReactElement =>
{
    return (

        <Html lang={useLocale ().currentLocale ()}>
            <Head>
                <meta name="robots" content="noindex" />
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

        ... (await Document.getInitialProps (context)),
    };
};

export default DocumentPage;
