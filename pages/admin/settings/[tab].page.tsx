import { GetServerSideProps, } from "next";
import { ReactElement, useEffect, } from "react";
import Head from "next/head";
import Link from "next/link";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminFrame from "@/components/admin/admin-frame";
import AdminSystemSettings from "@/components/admin/admin-system-settings";
import ProfileSettingsForm from "@/components/admin/profile-settings-form";
import { adminSegmentTabClass, } from "@/libs/admin-tabs";
import {
    fbCard,
    fbCardDescription,
    fbCardTitle,
    fbSurfacePanel,
} from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import { UserRoleEnum, } from "@/libs/user-role";
import { buildGetServerSideProps, } from "@/libs/page-props.server";
import { type PagePropsOptions, } from "@/libs/page-props.shared";
import { pageAuth, } from "@/page-auth/admin/settings/[tab]";
import { formatPageTitle, } from "@/libs/page-title";

const SettingsTab = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const { roles, loaded, } = useAdminAccess ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const tab = String (router.query.tab || "personal");
    const isSuperadmin = roles.includes (UserRoleEnum.Superadmin);

    useEffect (() =>
    {
        if (! router.isReady || ! loaded)
        {
            return;
        }

        if (tab !== "personal" && tab !== "system")
        {
            void router.replace ("/admin/settings/personal");

            return;
        }

        if (tab === "system" && ! isSuperadmin)
        {
            void router.replace ("/admin/settings/personal");
        }
    }, [router, router.isReady, loaded, tab, isSuperadmin]);

    if (! canRender)
    {
        return null;
    }

    const title = tab === "system" ? t ("settings_tab_system") : t ("settings_tab_personal");

    return (
        <>
            <Head>
                <title>{formatPageTitle (title)}</title>
            </Head>
            <AdminFrame title={title} description={tab === "system" ? t ("system_settings_description") : t ("profile_settings_description")}>
                <div className={cn (fbSurfacePanel, "shadow")}>
                    <div className="border-b border-gray-200 p-4 sm:p-5 dark:border-gray-700">
                        {loaded ? (
                            <ul
                                className="flex overflow-x-auto text-center text-xs font-medium text-gray-500 sm:-space-x-px sm:text-sm dark:text-gray-400"
                                role="tablist"
                                aria-label={t ("settings")}
                            >
                                <li className="w-full" role="presentation">
                                    <Link
                                        role="tab"
                                        aria-selected={tab === "personal"}
                                        className={cn (adminSegmentTabClass (tab === "personal"), isSuperadmin ? "rounded-l-lg" : "rounded-lg")}
                                        href="/admin/settings/personal"
                                    >
                                        {t ("settings_tab_personal")}
                                    </Link>
                                </li>
                                {isSuperadmin ? (
                                    <li className="w-full" role="presentation">
                                        <Link
                                            role="tab"
                                            aria-selected={tab === "system"}
                                            className={cn (adminSegmentTabClass (tab === "system"), "rounded-r-lg")}
                                            href="/admin/settings/system"
                                        >
                                            {t ("settings_tab_system")}
                                        </Link>
                                    </li>
                                ) : null}
                            </ul>
                        ) : null}
                    </div>
                </div>
                {tab === "personal" ? (
                    <div className="mx-auto max-w-2xl">
                        <div className={fbCard}>
                            <div className="mb-6 space-y-1.5">
                                <h3 className={fbCardTitle}>{t ("personal_information")}</h3>
                                <p className={fbCardDescription}>{t ("personal_information_description")}</p>
                            </div>
                            <ProfileSettingsForm />
                        </div>
                    </div>
                ) : null}
                {tab === "system" && isSuperadmin ? <AdminSystemSettings /> : null}
            </AdminFrame>
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

export default SettingsTab;
