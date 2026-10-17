import { type ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { paginationRange, } from "@/libs/pagination-range";
import { cn, } from "@/libs/utils";
import type { PaginatedMeta, } from "@/types/admin/api";

const pageButtonClass =
    "relative inline-flex items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 transition duration-150 ease-in-out hover:text-gray-500 focus:z-10 focus:border-[color-mix(in_srgb,var(--brand-primary)_35%,#e5e7eb_65%)] focus:outline-none active:bg-gray-100 active:text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600";

const edgeButtonClass =
    "relative inline-flex items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium leading-5 text-gray-500 transition duration-150 ease-in-out hover:text-gray-400 focus:z-10 focus:border-[color-mix(in_srgb,var(--brand-primary)_35%,#e5e7eb_65%)] focus:outline-none active:bg-gray-100 active:text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:hover:bg-gray-600";

const disabledEdgeClass =
    "relative inline-flex cursor-default items-center border border-gray-300 bg-white px-2 py-2 text-sm font-medium leading-5 text-gray-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white";

function Chevron ({ direction, }: { direction: "left" | "right"; }): ReactElement
{
    return (
        <svg className="h-5 w-5" fill="currentColor" viewBox="0 0 20 20" aria-hidden>
            <path
                fillRule="evenodd"
                d={direction === "left"
                    ? "M12.707 5.293a1 1 0 0 1 0 1.414L9.414 10l3.293 3.293a1 1 0 0 1-1.414 1.414l-4-4a1 1 0 0 1 0-1.414l4-4a1 1 0 0 1 1.414 0Z"
                    : "M7.293 14.707a1 1 0 0 1 0-1.414L10.586 10 7.293 6.707a1 1 0 0 1 1.414-1.414l4 4a1 1 0 0 1 0 1.414l-4 4a1 1 0 0 1-1.414 0Z"}
                clipRule="evenodd"
            />
        </svg>
    );
}

const AdminPagination = ({
    meta,
    page,
    onChange,
}: {
    meta?: PaginatedMeta;
    page: number;
    onChange: (page: number) => void;
}): ReactElement | null =>
{
    const { t, } = useTranslation ("common");
    const lastPage = meta?.last_page ?? 1;
    const summary = typeof meta?.total === "number" && typeof meta.from === "number" && typeof meta.to === "number"
        ? { from: meta.from, to: meta.to, total: meta.total, }
        : null;

    if (! summary && lastPage <= 1)
    {
        return null;
    }

    const pages = paginationRange (page, lastPage);

    function goTo (next: number): void
    {
        const target = Math.min (Math.max (1, next), lastPage);

        if (target === page)
        {
            return;
        }

        onChange (target);
    }

    return (
        <div className="mt-4 flex flex-col gap-4 border-t border-gray-200 px-4 py-3 sm:flex-row sm:items-center sm:justify-between dark:border-gray-700 md:px-6">
            {summary ? (
                <p className="shrink-0 text-sm leading-5 text-gray-700 dark:text-white">
                    {t ("table_pagination", summary)}
                </p>
            ) : null}
            {lastPage > 1 ? (
                <nav className="ms-auto inline-flex max-w-full shrink-0 overflow-x-auto rounded-md shadow-sm" aria-label={t ("aria_pagination")}>
                    <span className="relative z-0 inline-flex min-w-max rounded-md shadow-sm">
                        <button type="button" disabled={page <= 1} className={cn (page <= 1 ? disabledEdgeClass : edgeButtonClass, "rounded-l-md")} aria-label={t ("previous")} onClick={() => goTo (page - 1)}>
                            <Chevron direction="left" />
                        </button>
                        {pages.map ((item, index) => item === "..."
                            ? <span key={`gap-${index}`} className="relative -ml-px inline-flex cursor-default items-center border border-gray-300 bg-white px-4 py-2 text-sm font-medium leading-5 text-gray-700 dark:border-gray-600 dark:bg-gray-700 dark:text-white">...</span>
                            : item === page
                                ? <span key={item} aria-current="page" className="relative -ml-px inline-flex cursor-default items-center border border-gray-300 bg-gray-100 px-4 py-2 text-sm font-medium leading-5 text-gray-500 dark:border-gray-500 dark:bg-gray-500 dark:text-white">{item}</span>
                                : (
                                    <button key={item} type="button" className={cn (pageButtonClass, "-ml-px")} aria-label={t ("table_go_to_page", { page: item, })} onClick={() => goTo (item)}>
                                        {item}
                                    </button>
                                ))}
                        <button type="button" disabled={page >= lastPage} className={cn (page >= lastPage ? disabledEdgeClass : edgeButtonClass, "-ml-px rounded-r-md")} aria-label={t ("next")} onClick={() => goTo (page + 1)}>
                            <Chevron direction="right" />
                        </button>
                    </span>
                </nav>
            ) : null}
        </div>
    );
};

export default AdminPagination;
