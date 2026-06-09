import { GetStaticProps, } from "next";

import { type PagePropsOptions, } from "@/libs/page-props.shared";

export { default, } from "./reset-password.page";

const pageOptions: PagePropsOptions = {
    title: "Reset Password",
    namespaces: [ "auth", "common", ],
};

export const getStaticProps: GetStaticProps = async () =>
{
    const { loadStaticPageProps, } = await import ("@/libs/static-translations.server");

    return {
        props: await loadStaticPageProps (pageOptions),
    };
};
