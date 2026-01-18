import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import Link from "next/link";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useTranslation, } from "next-i18next";

import HeaderLayout from "@/layouts/header.layout";
import FooterLayout from "@/layouts/footer.layout";
import { Button, } from "@/components/ui/button";

const Page = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <>
            <Head>
                <title>{t ("welcome")}</title>
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
                                <Link href="/admin/dashboard">
                                    {t ("get_started")}
                                </Link>
                            </Button>
                            <Button variant="outline" size="lg" asChild>
                                <Link href="/api/docs">
                                    {t ("view_docs")}
                                </Link>
                            </Button>
                        </div>
                    </div>
                </main>

                <FooterLayout />
            </div>
        </>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> =>
({
    props: {
        title: "Index",
        ... (await serverSideTranslations (context.locale as string, [
            "common",
        ])),
    },
});

export default Page;
