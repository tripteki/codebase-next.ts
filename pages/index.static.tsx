import { GetStaticProps, } from "next";

import { type PagePropsOptions, withLayoutNamespaces, } from "@/libs/page-props.shared";

export { default, } from "./index.page";

const pageOptions: PagePropsOptions = {
    title: "Index",
    namespaces: withLayoutNamespaces ([]),
};

export const getStaticProps: GetStaticProps = async () =>
{
    const { loadStaticPageProps, } = await import ("@/libs/static-translations.server");

    return {
        props: await loadStaticPageProps (pageOptions),
    };
};
