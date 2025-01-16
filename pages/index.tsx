import { GetServerSideProps, } from "next";
import { NextSeo, } from "next-seo";
import { useTranslation, } from "next-i18next";
import { FC, } from "react";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import DefaultLayout from "@/app/index";

const IndexTemplate: FC = () =>
{
    const { t, } = useTranslation ("common");

    return (

        <DefaultLayout>
            <NextSeo title="Index"></NextSeo>
            <div className="underline">{t ("welcome")}</div>
        </DefaultLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, }) =>
{
    return {

        props: {

            ... (await serverSideTranslations (locale as string, [

                "common",
            ])),
        },
    };
};

export default IndexTemplate;
