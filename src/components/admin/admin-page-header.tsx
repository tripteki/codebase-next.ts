import { type ReactElement, type ReactNode, } from "react";
import Link from "next/link";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminCrumbIcon from "@/components/admin/admin-crumb-icon";
import { adminPageCrumbs, } from "@/libs/admin-page-crumbs";
import {
    fbAdminBreadcrumb,
    fbAdminBreadcrumbCurrent,
    fbAdminPageHeader,
    fbMuted,
} from "@/libs/flowbite-classes";

const AdminPageHeader = ({
    title,
    description,
    actions,
}: {
    title: string;
    description?: string;
    actions?: ReactNode;
}): ReactElement =>
{
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const items = adminPageCrumbs (router.asPath, title, t);

    return (
        <div className={fbAdminPageHeader}>
            <div className="mb-1 w-full">
            <nav className="mb-5 flex" aria-label={t ("aria_breadcrumb")}>
                <ol className="inline-flex flex-wrap items-center gap-y-1 text-sm font-medium md:gap-x-2">
                    {items.map ((item, index) => (
                        <li key={`${item.label}-${index}`} className="inline-flex items-center">
                            {index > 0 ? (
                                <svg className="mx-1 h-6 w-6 shrink-0 text-gray-400" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                    <path fillRule="evenodd" d="M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z" clipRule="evenodd" />
                                </svg>
                            ) : null}
                            {item.to ? (
                                <Link href={item.to} className={`${fbAdminBreadcrumb}${index > 0 ? " ms-1 md:ms-2" : ""}`}>
                                    <span className="me-2 inline-flex h-4 w-4 shrink-0" aria-hidden="true">
                                        <AdminCrumbIcon name={item.icon} />
                                    </span>
                                    {item.label}
                                </Link>
                            ) : (
                                <span className={`${fbAdminBreadcrumbCurrent} inline-flex items-center${index > 0 ? " ms-1 md:ms-2" : ""}`} aria-current="page">
                                    <span className="me-2 inline-flex h-4 w-4 shrink-0" aria-hidden="true">
                                        <AdminCrumbIcon name={item.icon} />
                                    </span>
                                    {item.label}
                                </span>
                            )}
                        </li>
                    ))}
                </ol>
            </nav>
            <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                <div className="min-w-0">
                    <h1 className="min-w-0 break-words text-xl font-semibold text-gray-900 sm:text-2xl dark:text-white">
                        {title}
                    </h1>
                    {description ? <p className={`${fbMuted} mt-1`}>{description}</p> : null}
                </div>
                {actions ? <div className="flex w-full shrink-0 flex-nowrap items-center justify-end gap-2 sm:ms-auto sm:w-auto">{actions}</div> : null}
            </div>
            </div>
        </div>
    );
};

export default AdminPageHeader;
