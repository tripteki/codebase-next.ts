import { GetServerSideProps, } from "next";
import { ReactElement, } from "react";
import Head from "next/head";
import { useTranslation, } from "next-i18next/pages";

import AuthVerifyEmailBanner from "@/components/auth-verify-email-banner";
import ProfileSettingsForm from "@/components/admin/profile-settings-form";
import HeaderLayout from "@/layouts/header.layout";
import FooterLayout from "@/layouts/footer.layout";
import {
    fbCard,
    fbCardDescription,
    fbCardTitle,
    fbMuted,
    fbPage,
} from "@/libs/flowbite-classes";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/settings";
import { formatPageTitle, } from "@/libs/page-title";

const ProfileSettings = (): ReactElement | null => {
    const canRender = useRequireAuth ();
    const { t, } = useTranslation ("common");

    if (! canRender) {
        return null;
    }

    return (
        <>
            <Head>
                <title>{formatPageTitle (t ("profile_settings"))}</title>
            </Head>

            <div className={fbPage}>
                <HeaderLayout showLogout={true} />

                <main className="flex-1 container mx-auto px-4 py-8">
                    <div className="mx-auto max-w-2xl space-y-6">
                        <AuthVerifyEmailBanner />

                        <div className="space-y-2">
                            <h1 className="text-3xl font-bold tracking-tight">
                                {t ("profile_settings")}
                            </h1>
                            <p className={fbMuted}>
                                {t ("profile_settings_description")}
                            </p>
                        </div>

                        <div className={fbCard}>
                            <div className="mb-6 space-y-1.5">
                                <h3 className={fbCardTitle}>{t ("personal_information")}</h3>
                                <p className={fbCardDescription}>
                                    {t ("personal_information_description")}
                                </p>
                            </div>
                            <ProfileSettingsForm />
                        </div>
                    </div>
                </main>

                <FooterLayout />
            </div>
        </>
    );
};

const pageOptions: PagePropsOptions = {
    title: "Profile settings",
    namespaces: ["common", "auth"],
};

export { pageAuth, };

export const getServerSideProps: GetServerSideProps = buildGetServerSideProps ({
    ...pageOptions,
    pageAuth,
});

export default ProfileSettings;
