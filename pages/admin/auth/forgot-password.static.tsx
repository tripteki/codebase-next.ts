import { GetStaticProps, } from "next";

import { type PagePropsOptions, } from "@/libs/page-props.shared";

export { default, } from "./forgot-password.page";

const pageOptions: PagePropsOptions = {
    title: "Forgot Password",
    namespaces: [ "auth", "common", ],
};

export const getStaticProps: GetStaticProps = async () =>
{
    const { loadStaticPageProps, } = await import ("@/libs/static-translations.server");

    return {
        props: await loadStaticPageProps (pageOptions),
    };
};
