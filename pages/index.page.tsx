import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import Link from "next/link";
import { useTranslation, } from "next-i18next/pages";

import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, withLayoutNamespaces, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/index";
import { formatPageTitle, } from "@/libs/page-title";
import { publicRuntimeConfig, } from "@/libs/runtime-config";
import { resolveApiDocsUrl, } from "@/libs/api-base";

import HeaderLayout from "@/layouts/header.layout";
import FooterLayout from "@/layouts/footer.layout";
import { Button, } from "@/components/ui/button";

const Page = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("welcome"))}</title>
            </Head>

            <div className="min-h-screen flex flex-col bg-background">
                <HeaderLayout />

                <main className="flex-1 flex items-center justify-center px-4 py-16">
                    <div className="text-center space-y-8 max-w-2xl">
                        <div className="space-y-4">
                            <h2 className="text-4xl font-bold tracking-tight sm:text-5xl">
                                {t ("title")}
                                <br />
                                <span className="text-primary">{t ("subtitle")}</span>
                            </h2>

                            <p className="text-xl text-muted-foreground">
                                {t ("description")}
                            </p>
                        </div>

                        <div className="flex gap-4 justify-center">
                            <Button size="lg" asChild>
                                <Link href="/admin/auth/login">
                                    {t ("get_started")}
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <a
                                    href={resolveApiDocsUrl (publicRuntimeConfig)}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                >
                                    {t ("view_docs")}
                                </a>
                            </Button>
                        </div>
                    </div>
                </main>

                <FooterLayout />
            </div>
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "Index",
    namespaces: withLayoutNamespaces ([]),
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default Page;
