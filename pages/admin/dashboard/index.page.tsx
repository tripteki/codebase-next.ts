import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import AdminDashboardPage from "@/components/admin/admin-dashboard-page";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/dashboard";
import { formatPageTitle, } from "@/libs/page-title";

const Dashboard = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("dashboard"))}</title>
            </Head>
            <AdminDashboardPage />
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
