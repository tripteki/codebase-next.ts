import { type ReactElement, type ReactNode, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { fbMuted, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

const AdminFormModal = ({
    open,
    title,
    titleId,
    description,
    processing = false,
    onClose,
    children,
}: {
    open: boolean;
    title: string;
    titleId: string;
    description?: string;
    processing?: boolean;
    onClose: () => void;
    children: ReactNode;
}): ReactElement | null =>
{
    const { t, } = useTranslation ("common");

    if (! open)
    {
        return null;
    }

    return (
        <div
            className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm"
            role="dialog"
            aria-modal="true"
            aria-labelledby={titleId}
            onClick={onClose}
        >
            <div
                className="relative flex max-h-[calc(100dvh-2rem)] w-full max-w-md flex-col overflow-hidden rounded-lg bg-white shadow dark:bg-gray-800"
                onClick={(event) => event.stopPropagation ()}
            >
                <div className="flex items-start justify-between border-b border-gray-200 p-4 md:p-5 dark:border-gray-600">
                    <div className="min-w-0 flex-1 pe-4">
                        <h3 id={titleId} className="text-lg font-semibold text-gray-900 dark:text-white">
                            {title}
                        </h3>
                        {description ? <p className={cn (fbMuted, "mt-1 text-sm")}>{description}</p> : null}
                    </div>
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 shrink-0 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                        disabled={processing}
                        onClick={onClose}
                    >
                        <span className="sr-only">{t ("modal_close")}</span>
                        <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
                <div className="min-h-0 overflow-y-auto p-4 md:p-5">
                    {children}
                </div>
            </div>
        </div>
    );
};

export default AdminFormModal;
