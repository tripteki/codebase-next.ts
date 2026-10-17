import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import { AdminUsersPage, } from "@/components/admin/admin-users-page";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/users";
import { formatPageTitle, } from "@/libs/page-title";

const Page = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("users"))}</title>
            </Head>
            <AdminUsersPage />
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "users",
    namespaces: [ "common", "auth", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default Page;
