import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import { AdminRoleFormPage, } from "@/components/admin/admin-roles-page";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/roles/[id]/edit";
import { formatPageTitle, } from "@/libs/page-title";

const Page = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("roles_edit"))}</title>
            </Head>
            <AdminRoleFormPage mode="edit" />
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "roles_edit",
    namespaces: [ "common", "auth", ],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ... pageOptions,
    pageAuth,
});

export default Page;
