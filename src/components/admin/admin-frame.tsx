import { type ReactElement, type ReactNode, } from "react";

import AdminPageHeader from "@/components/admin/admin-page-header";
import AdminSidebar from "@/components/admin/admin-sidebar";
import AuthVerifyEmailBanner from "@/components/auth-verify-email-banner";
import { useAdminRefresh, } from "@/hooks/use-admin-refresh";
import FooterLayout from "@/layouts/footer.layout";
import HeaderLayout from "@/layouts/header.layout";
import { fbPage, } from "@/libs/flowbite-classes";

const AdminFrame = ({
    title,
    description,
    refreshScopes = [],
    onRefresh,
    actions,
    children,
}: {
    title: string;
    description?: string;
    refreshScopes?: string[];
    onRefresh?: () => void;
    actions?: ReactNode;
    children: ReactNode;
}): ReactElement =>
{
    useAdminRefresh (refreshScopes, () =>
    {
        onRefresh?. ();
    });

    return (
        <div className={`${fbPage} lg:pl-64`}>
            <AdminSidebar />
            <HeaderLayout showLogout={true} />
            <main id="admin-main-content" className="mx-auto w-full max-w-screen-2xl flex-1 px-4 py-6 lg:px-6">
                <div className="space-y-6">
                    <AuthVerifyEmailBanner />
                    <AdminPageHeader title={title} description={description} actions={actions} />
                    {children}
                </div>
            </main>
            <FooterLayout />
        </div>
    );
};

export default AdminFrame;
