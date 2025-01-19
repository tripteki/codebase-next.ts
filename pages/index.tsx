import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, } from "next";
import { NextSeo, } from "next-seo";
import { FC, } from "react";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useLocale, useChangeLocale, useTranslations, } from "@/hooks/i18n";
import DefaultLayout from "@/app/index";

const IndexTemplate: FC = () =>
{
    const { common, } = useTranslations ([ "common", ]);

    return (

        <DefaultLayout>
            <NextSeo title="Index"></NextSeo>

            <div className="mx-2">
                <div>{common.t ("welcome")}</div>
                <select onChange={useChangeLocale ()} value={useLocale ().currentLocale ()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-25 p-2.5 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500">
                    {useLocale ().availableLocales ().map ((locale) => (
                        <option key={locale} value={locale}>{locale.toUpperCase ()}</option>
                    ))}
                </select>
            </div>
        </DefaultLayout>
    );
};

export const getServerSideProps: GetServerSideProps = async (context: GetServerSidePropsContext): Promise<GetServerSidePropsResult<{[key: string]: any}>> =>
{
    return {
        props: {
            ... (await serverSideTranslations (context.locale as string, [
                "common",
            ])),
        },
    };
};

export default IndexTemplate;
