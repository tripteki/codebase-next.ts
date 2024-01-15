"use strict";

import type { GetServerSideProps, InferGetServerSidePropsType, } from "next";
import React, { ReactElement, } from "react";
import RootLayout from "@/app/layout";
import { serverSideTranslations, } from "next-i18next/serverSideTranslations";
import { useTranslation, } from "next-i18next";

type Props =
{
    //
};

export const getServerSideProps: GetServerSideProps<Props> = async ({ locale, }) => (
{
    props: {
        
        ... (await serverSideTranslations (locale, [
            
            "common",
        ])),
    },
});

const Index = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (

        <RootLayout>
            <div>{t ("welcome")}</div>
        </RootLayout>
    )
};

export default Index;
