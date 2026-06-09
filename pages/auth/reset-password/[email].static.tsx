import { GetStaticPaths, GetStaticProps, } from "next";

import { emptyStaticPaths, type PagePropsOptions, } from "@/libs/page-props.shared";

export { default, } from "./[email].page";

const pageOptions: PagePropsOptions = {
    title: "Reset Password",
    namespaces: [ "auth", "common", ],
};

export const getStaticPaths: GetStaticPaths = emptyStaticPaths;

export const getStaticProps: GetStaticProps = async () =>
{
    const { loadStaticPageProps, } = await import ("@/libs/static-translations.server");

    return {
        props: await loadStaticPageProps (pageOptions),
    };
};
