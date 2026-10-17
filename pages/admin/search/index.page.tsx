import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import { AdminSearchPage, } from "@/components/admin/admin-search-page";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/search";
import { formatPageTitle, } from "@/libs/page-title";

const Page = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("search"))}</title>
            </Head>
            <AdminSearchPage />
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "search",
    namespaces: [ "common", "auth", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default Page;
