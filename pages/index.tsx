import { GetServerSideProps, GetServerSidePropsContext, GetServerSidePropsResult, GetStaticProps, GetStaticPropsContext, } from "next";
import { ReactElement, ChangeEvent, } from "react";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { type LocaleType, type TranslationType, useLocale, useTranslations, } from "@/hooks/i18n";

const Page = (): ReactElement =>
{
    const { availableLocales, currentLocale, setCurrentLocale, }: LocaleType = useLocale ();
    const trans: TranslationType = useTranslations ([ "common", ]);

    return (<>

        <div className="mx-2">
            <div>{trans.common.t ("welcome")}</div>
            <select onChange={(e: ChangeEvent<HTMLSelectElement>) => { setCurrentLocale (e.target.value) }} value={currentLocale} className="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg focus:ring-blue-500 focus:border-blue-500 block w-25 p-2.5">
                {availableLocales?.map ((locale: string) =>
                    <option key={locale} value={locale}>{locale.toUpperCase ()}</option>
                )}
            </select>
        </div>
    </>);
};

export const getServerSideProps: GetServerSideProps = async (
    context: GetServerSidePropsContext
): Promise<GetServerSidePropsResult<{ [key: string]: any; }>> =>
({
    props: {
        title: "Index",
        ... (await serverSideTranslations (context.locale as string, [
            "common",
        ])),
    },
});

export default Page;
