import { type ReactElement, } from "react";

import { fbLink, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

const AdminImportSampleLink = ({
    label,
    processing = false,
    onClick,
}: {
    label: string;
    processing?: boolean;
    onClick: () => void;
}): ReactElement =>
{
    return (
        <button
            type="button"
            className={cn (fbLink, "mt-2 inline-flex items-center gap-1.5")}
            disabled={processing}
            onClick={onClick}
        >
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            {label}
        </button>
    );
};

export default AdminImportSampleLink;
