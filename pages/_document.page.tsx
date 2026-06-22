import type { MetadataRoute, } from "next";
import type { DocumentContext, DocumentInitialProps, DocumentProps, } from "next/document";
import Document, { Html, Head, Main, NextScript, } from "next/document";
import { ReactElement, } from "react";
import manifest, { url, } from "@/libs/manifest";
import { DEFAULT_LOCALE, getLocaleFromRequest, type AppLocale, } from "@/libs/i18n/locale";
import { pwaSplashLinks, } from "@/libs/pwa-splash-links";
import { defaultBrandColors, } from "@/libs/branding";
import { brandCssInlineStyle, } from "@/libs/apply-brand-css";

const { short_name, description, }: MetadataRoute.Manifest = manifest ();

type DocumentPageProps = DocumentProps & {
    locale: AppLocale;
};

const Page = (
    props: DocumentPageProps
): ReactElement =>
{
    return (
        <Html lang={props.locale}>
            <Head>
                <style
                    dangerouslySetInnerHTML={{
                        __html: `:root { ${brandCssInlineStyle (defaultBrandColors)} }`,
                    }}
                />
                <meta name="robots" content="index, follow" />
                <meta name="description" content={description} />
                <meta name="theme-color" content={defaultBrandColors.primary} />
                <meta name="mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-capable" content="yes" />
                <meta name="apple-mobile-web-app-status-bar-style" content="default" />
                <meta property="og:url" content={url} />
                <meta property="og:type" content="website" />
                <meta property="og:title" content={short_name} />
                <meta property="og:description" content={description} />
                <meta name="twitter:card" content="summary" />
                <meta name="twitter:title" content={short_name} />
                <meta name="twitter:description" content={description} />
                <link rel="canonical" href={url} />
                <link rel="icon" href="/favicon.ico" sizes="any" />
                <link rel="apple-touch-icon" href="/manifest/icon-192x192.png" sizes="192x192" />
                <link rel="manifest" href={process.env.NEXT_PUBLIC_BUILD_STATIC === "true" ? "/manifest.webmanifest" : "/api/pwa/manifest"} />
                {pwaSplashLinks.map ((link) => (
                    <link
                        key={link.href}
                        rel={link.rel}
                        href={link.href}
                        media={link.media}
                    />
                ))}
            </Head>

            <body>
                <Main />
                <NextScript />
            </body>
        </Html>
    );
};

Page.getInitialProps = async (
    context: DocumentContext
): Promise<DocumentInitialProps & { locale: AppLocale; }> =>
{
    const initialProps = await Document.getInitialProps (context);
    const locale = context.req ? getLocaleFromRequest (context.req) : DEFAULT_LOCALE;

    return {
        ... initialProps,
        locale,
    };
};

export default Page;
