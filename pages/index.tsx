"use strict";

import DashboardLayout from "@/app/dashboard";
import { useTranslation, } from "next-i18next";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { NextSeo, } from "next-seo";

export default () =>
{
    const { t, } = useTranslation ("common");

    return (

        <DashboardLayout>
            <NextSeo title="Index"></NextSeo>
            <div>{t ("welcome")}</div>
        </DashboardLayout>
    );
};

export const getServerSideProps = async ({ locale, }) =>
{
    return {

        props: {

            ... (await serverSideTranslations (locale, [

                "common",
            ])),
        },
    };
};
