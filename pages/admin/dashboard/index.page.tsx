import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import AuthVerifyEmailBanner from "@/components/auth-verify-email-banner";
import HeaderLayout from "@/layouts/header.layout";
import FooterLayout from "@/layouts/footer.layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, } from "@/components/ui/card";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { formatPageTitle, } from "@/libs/page-title";

const Dashboard = (): ReactElement =>
{
    useRequireAuth ();
    const { t, } = useTranslation ("common");

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("dashboard"))}</title>
            </Head>

            <div className="min-h-screen flex flex-col bg-background">
                <HeaderLayout showLogout={true} />

                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        <AuthVerifyEmailBanner />

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {t ("dashboard_title")}
                            </h1>
                            <p className="text-muted-foreground">
                                {t ("dashboard_description")}
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <Card>
                                <CardHeader>
                                    <CardTitle>{t ("overview")}</CardTitle>
                                    <CardDescription>
                                        {t ("overview_description")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {t ("overview_content")}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t ("statistics")}</CardTitle>
                                    <CardDescription>
                                        {t ("statistics_description")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {t ("statistics_content")}
                                    </p>
                                </CardContent>
                            </Card>

                            <Card>
                                <CardHeader>
                                    <CardTitle>{t ("activity")}</CardTitle>
                                    <CardDescription>
                                        {t ("activity_description")}
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <p className="text-sm text-muted-foreground">
                                        {t ("activity_content")}
                                    </p>
                                </CardContent>
                            </Card>
                        </div>
                    </div>
                </main>

                <FooterLayout />
            </div>
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "Dashboard",
    namespaces: [ "common", "auth", ],
};

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    requireAuth: true,
});

export default Dashboard;
