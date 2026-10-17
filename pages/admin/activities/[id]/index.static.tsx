import { GetStaticPaths, GetStaticProps, } from "next";

import { emptyStaticPaths, type PagePropsOptions, } from "@/libs/page-props.shared";

export { default, } from "./index.page";

const pageOptions: PagePropsOptions = {
    title: "activities_show_title",
    namespaces: [ "common", "auth", ],
};

export const getStaticPaths: GetStaticPaths = emptyStaticPaths;

export const getStaticProps: GetStaticProps = async () =>
{
    const { loadStaticPageProps, } = await import ("@/libs/static-translations.server");

    return {
        props: await loadStaticPageProps (pageOptions),
    };
};
