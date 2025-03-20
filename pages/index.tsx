import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, } from "next";
import { NextSeo, } from "next-seo";
import { FC, Fragment, } from "react";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useLocale, useChangeLocale, useTranslations, } from "@/hooks/i18n";

const IndexPage: FC = () =>
{
    const { common, } = useTranslations ([ "common", ]);

    return (

        <Fragment>
            <NextSeo title="Index"></NextSeo>

            <div className="mx-2">
                <div>{common.t ("welcome")}</div>
                <select onChange={useChangeLocale ()} value={useLocale ().currentLocale ()} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-25 p-2.5 ">
                    {useLocale ().availableLocales ().map ((locale) => (
                        <option key={locale} value={locale}>{locale.toUpperCase ()}</option>
                    ))}
                </select>
            </div>
        </Fragment>
    );
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{[key: string]: any}>> =>
({
    props: {
        ... (await serverSideTranslations (context.locale as string, [
            "common",
        ])),
    },
});

export default IndexPage;
