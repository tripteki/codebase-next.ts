import type { MetadataRoute, } from "next";
import type { DocumentProps, } from "next/document";
import { Html, Head, Main, NextScript, } from "next/document";
import { ReactElement, } from "react";
import manifest, { url, } from "@/app/manifest";

const { short_name, description, }: MetadataRoute.Manifest = manifest ();

const Page = (
    props: DocumentProps
): ReactElement =>
{
    return (

        <Html lang={props.__NEXT_DATA__.locale != "default" ? props.__NEXT_DATA__.locale : process.env.NEXT_PUBLIC_APP_LANG}>
            <Head>
                <meta name="robots" content="index, follow" />
                <meta name="description" content={description} />
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={short_name} />
                <meta property="og:description" content={description} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={short_name} />
                <meta name="twitter:description" content={description} />
                <link rel="canonical" href={url} />
                <link rel="manifest" href="/manifest.webmanifest" />
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

export default Page;
