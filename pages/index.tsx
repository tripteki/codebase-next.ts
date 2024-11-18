import { GetServerSideProps, } from 'next';
import { NextSeo, } from "next-seo";
import { useRouter, } from 'next/router';
import { useTranslation, } from "next-i18next";
import { FC, useEffect, } from "react";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import DashboardLayout from "@/app/dashboard";
import dynamic from 'next/dynamic';

const ApexChart = dynamic (() => import ('react-apexcharts'),
{
    ssr: false,
});

const IndexTemplate: FC = () =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("common");

    useEffect (() => {

        router.push ('/auth/login');

    }, [ router, ]);

    return (

        <DashboardLayout>
            <NextSeo title="Index"></NextSeo>
            <div className="underline">{t ("welcome")}</div>
            {/* <ApexChart /> */}
        </DashboardLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async ({ locale, }) =>
{
    return {

        props: {

            ... (await serverSideTranslations (locale ?? 'en', [

                'common',
            ])),
        },
    };
};

export default IndexTemplate;
