import { GetStaticProps, } from "next";

import { type PagePropsOptions, } from "@/libs/page-props.shared";

export { default, } from "./index.page";

const pageOptions: PagePropsOptions = {
    title: "Dashboard",
    namespaces: [ "common", "auth", ],
};

export const getStaticProps: GetStaticProps = async () =>
{
    const { loadStaticPageProps, } = await import ("@/libs/static-translations.server");

    return {
        props: await loadStaticPageProps (pageOptions),
    };
};
