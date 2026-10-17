import { GetServerSideProps, } from "next";
import { ReactElement, useEffect, } from "react";
import { useRouter, } from "next/router";

import { pageAuth, } from "@/page-auth/admin/settings";

const SettingsIndex = (): ReactElement | null =>
{
    const router = useRouter ();

    useEffect (() =>
    {
        void router.replace ("/admin/settings/personal");
    }, [router]);

    return null;
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = async () =>
{
    return {
        redirect: {
            destination: "/admin/settings/personal",
            permanent: false,
        },
    };
};

export default SettingsIndex;
