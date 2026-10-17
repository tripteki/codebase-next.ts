import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import { AdminUserFormPage, } from "@/components/admin/admin-user-form-page";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/users/[id]/edit";
import { formatPageTitle, } from "@/libs/page-title";

const Page = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("users_edit"))}</title>
            </Head>
            <AdminUserFormPage mode="edit" />
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "users_edit",
    namespaces: [ "common", "auth", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default Page;
