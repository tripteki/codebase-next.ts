import { type ReactElement, type ReactNode, } from "react";
import { useTranslation, } from "next-i18next/pages";

import AdminFilterFunnelIcon from "@/components/admin/admin-filter-funnel-icon";
import FbButton from "@/components/flowbite/fb-button";

const AdminListFilterPanel = ({
    open,
    activeCount,
    onToggle,
    onClear,
    children,
}: {
    open: boolean;
    activeCount: number;
    onToggle: () => void;
    onClear: () => void;
    children: ReactNode;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <div id="page-table-filter" className="contents">
            <FbButton variant="tertiary" size="xs" type="button" className="inline-flex items-center gap-2 self-start sm:ms-auto" aria-expanded={open} onClick={onToggle}>
                {t ("table_filter")}
                {activeCount > 0 ? (
                    <span className="badge-brand-primary inline-flex min-w-5 items-center justify-center rounded-full px-2 py-0.5 text-xs font-medium">
                        {activeCount}
                    </span>
                ) : null}
                <AdminFilterFunnelIcon />
            </FbButton>
            {open ? (
                <div className="w-72 max-w-full self-start rounded-lg border border-gray-200 bg-white p-4 shadow-lg sm:ms-auto sm:basis-full dark:border-gray-700 dark:bg-gray-800">
                    {children}
                    <div className="mt-4 flex justify-end">
                        <FbButton variant="secondary" size="xs" type="button" disabled={activeCount === 0} onClick={onClear}>
                            {t ("table_filter_clear")}
                        </FbButton>
                    </div>
                </div>
            ) : null}
        </div>
    );
};

export default AdminListFilterPanel;
