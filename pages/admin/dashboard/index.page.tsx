import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import AuthVerifyEmailBanner from "@/components/auth-verify-email-banner";
import HeaderLayout from "@/layouts/header.layout";
import FooterLayout from "@/layouts/footer.layout";
import {
    fbCard,
    fbCardDescription,
    fbCardTitle,
    fbMuted,
    fbPage,
} from "@/libs/flowbite-classes";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/dashboard";
import { formatPageTitle, } from "@/libs/page-title";

const Dashboard = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { t, } = useTranslation ("common");

    if (! canRender)
    {
        return null;
    }

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("dashboard"))}</title>
            </Head>

            <div className={fbPage}>
                <HeaderLayout showLogout={true} />

                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="space-y-8">
                        <AuthVerifyEmailBanner />

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {t ("dashboard_title")}
                            </h1>
                            <p className={fbMuted}>
                                {t ("dashboard_description")}
                            </p>
                        </div>

                        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
                            <div className={fbCard}>
                                <div className="mb-4 space-y-1.5">
                                    <h3 className={fbCardTitle}>{t ("overview")}</h3>
                                    <p className={fbCardDescription}>
                                        {t ("overview_description")}
                                    </p>
                                </div>
                                <p className={fbMuted}>
                                    {t ("overview_content")}
                                </p>
                            </div>

                            <div className={fbCard}>
                                <div className="mb-4 space-y-1.5">
                                    <h3 className={fbCardTitle}>{t ("statistics")}</h3>
                                    <p className={fbCardDescription}>
                                        {t ("statistics_description")}
                                    </p>
                                </div>
                                <p className={fbMuted}>
                                    {t ("statistics_content")}
                                </p>
                            </div>

                            <div className={fbCard}>
                                <div className="mb-4 space-y-1.5">
                                    <h3 className={fbCardTitle}>{t ("activity")}</h3>
                                    <p className={fbCardDescription}>
                                        {t ("activity_description")}
                                    </p>
                                </div>
                                <p className={fbMuted}>
                                    {t ("activity_content")}
                                </p>
                            </div>
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

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default Dashboard;
