import { type ReactElement, type ReactNode, } from "react";
import { useTranslation, } from "next-i18next/pages";

import FbButton from "@/components/flowbite/fb-button";

const AdminConfirmModal = ({
    open,
    title,
    titleId,
    message,
    confirmLabel,
    danger = false,
    onClose,
    onConfirm,
}: {
    open: boolean;
    title: string;
    titleId: string;
    message: string;
    confirmLabel: string;
    danger?: boolean;
    onClose: () => void;
    onConfirm: () => void;
}): ReactElement | null =>
{
    const { t, } = useTranslation ("common");

    if (! open)
    {
        return null;
    }

    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-gray-900/50 p-4 backdrop-blur-sm" role="dialog" aria-modal="true" aria-labelledby={titleId} onClick={onClose}>
            <div className="w-full max-w-md rounded-lg bg-white shadow dark:bg-gray-800" onClick={(event) => event.stopPropagation ()}>
                <div className="flex items-center justify-between border-b border-gray-200 p-4 dark:border-gray-600">
                    <h3 id={titleId} className="text-lg font-semibold">{title}</h3>
                    <button
                        type="button"
                        className="inline-flex h-8 w-8 items-center justify-center rounded-lg text-gray-400 transition-colors hover:bg-gray-200 hover:text-gray-900 dark:hover:bg-gray-600 dark:hover:text-white"
                        onClick={onClose}
                    >
                        <span className="sr-only">{t ("modal_close")}</span>
                        <svg className="h-3 w-3" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 14 14">
                            <path stroke="currentColor" strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m1 1 6 6m0 0 6 6M7 7l6-6M7 7l-6 6" />
                        </svg>
                    </button>
                </div>
                <p className="p-4 text-sm">{message}</p>
                <div className="flex justify-end gap-2 border-t border-gray-200 p-4 dark:border-gray-600">
                    <FbButton variant="outline" type="button" onClick={onClose}>{t ("cancel")}</FbButton>
                    <FbButton type="button" variant={danger ? "danger" : "primary"} onClick={onConfirm}>{confirmLabel}</FbButton>
                </div>
            </div>
        </div>
    );
};

export type { ReactNode, };
export default AdminConfirmModal;
