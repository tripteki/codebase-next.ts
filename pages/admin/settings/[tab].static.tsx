import { GetStaticPaths, GetStaticProps, } from "next";

import { type PagePropsOptions, } from "@/libs/page-props.shared";

export { default, } from "./[tab].page";

const pageOptions: PagePropsOptions = {
    title: "Profile settings",
    namespaces: [ "common", "auth", ],
};

export const getStaticPaths: GetStaticPaths = () =>
{
    return {
        paths: [
            { params: { tab: "personal", }, },
            { params: { tab: "system", }, },
        ],
        fallback: false,
    };
};

export const getStaticProps: GetStaticProps = async () =>
{
    const { loadStaticPageProps, } = await import ("@/libs/static-translations.server");

    return {
        props: await loadStaticPageProps (pageOptions),
    };
};
