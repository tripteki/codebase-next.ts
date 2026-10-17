import { type ReactElement, } from "react";

import { fbAdminTableHeadCell, } from "@/libs/flowbite-classes";

const AdminSortableTableHead = ({
    label,
    field,
    sort,
    onSort,
    className,
}: {
    label: string;
    field: string;
    sort: string;
    onSort: (field: string) => void;
    className?: string;
}): ReactElement =>
{
    const direction = sort === `${field}:asc` ? "asc" : sort === `${field}:desc` ? "desc" : null;
    const ariaSort = direction === "asc" ? "ascending" : direction === "desc" ? "descending" : "none";

    return (
        <th scope="col" className={`${fbAdminTableHeadCell} select-none ${className ?? ""}`} aria-sort={ariaSort}>
            <button
                type="button"
                className="inline-flex cursor-pointer items-center gap-1.5 text-left font-semibold uppercase tracking-wide text-gray-700 hover:text-gray-900 dark:text-gray-300 dark:hover:text-white"
                onClick={() => onSort (field)}
            >
                <span>{label}</span>
                <span className="inline-flex flex-col text-[10px] leading-none text-gray-400">
                    <svg className={`h-2.5 w-2.5 ${direction === "asc" ? "text-[var(--brand-primary)]" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 3a1 1 0 0 1 .832.445l5 7a1 1 0 0 1-.832 1.555H5a1 1 0 0 1-.832-1.555l5-7A1 1 0 0 1 10 3Z" clipRule="evenodd" />
                    </svg>
                    <svg className={`h-2.5 w-2.5 ${direction === "desc" ? "text-[var(--brand-primary)]" : ""}`} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                        <path fillRule="evenodd" d="M10 17a1 1 0 0 1-.832-.445l-5-7a1 1 0 0 1 .832-1.555h10a1 1 0 0 1 .832 1.555l-5 7A1 1 0 0 1 10 17Z" clipRule="evenodd" />
                    </svg>
                </span>
            </button>
        </th>
    );
};

export default AdminSortableTableHead;
