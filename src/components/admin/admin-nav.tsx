import { type ReactElement, } from "react";
import Link from "next/link";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminSearchBox from "@/components/admin/admin-search-box";
import { useAdminAccess, } from "@/hooks/use-admin-access";
import { ADMIN_NAVIGATION, } from "@/libs/admin-navigation";

const AdminNav = (): ReactElement =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const { can, } = useAdminAccess ();
    const items = ADMIN_NAVIGATION.filter ((item) => can (item.permission));

    return (
        <nav className="border-b border-gray-200 bg-white dark:border-gray-700 dark:bg-gray-800">
            <div className="container mx-auto flex flex-wrap items-center gap-3 px-4 py-3">
                {items.map ((item) =>
                {
                    const active = router.pathname.startsWith (item.to);

                    return (
                        <Link
                            key={item.key}
                            href={item.to}
                            className={active
                                ? "rounded-md bg-gray-900 px-3 py-1.5 text-sm text-white dark:bg-white dark:text-gray-900"
                                : "rounded-md px-3 py-1.5 text-sm text-gray-700 hover:bg-gray-100 dark:text-gray-200 dark:hover:bg-gray-700"}>
                            {t (item.key)}
                        </Link>
                    );
                })}
                <AdminSearchBox />
            </div>
        </nav>
    );
};

export default AdminNav;
