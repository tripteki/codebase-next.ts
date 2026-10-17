import { type FormEvent, type ReactElement, useEffect, useState, } from "react";
import { useTranslation, } from "next-i18next/pages";

import AdminFormModal from "@/components/admin/admin-form-modal";
import FbButton from "@/components/flowbite/fb-button";
import { fbInputIconWrap, fbLabel, fbSelect, } from "@/libs/flowbite-classes";

const AdminExportModal = ({
    open,
    formats,
    i18nPrefix = "users",
    processing = false,
    onClose,
    onConfirm,
}: {
    open: boolean;
    formats: string[];
    i18nPrefix?: string;
    processing?: boolean;
    onClose: () => void;
    onConfirm: (format: string) => void;
}): ReactElement | null =>
{
    const { t, } = useTranslation ("common");
    const [format, setFormat] = useState (formats[0] || "csv");

    useEffect (() =>
    {
        if (open)
        {
            setFormat (formats[0] || "csv");
        }
    }, [open]);

    function submit (event: FormEvent): void
    {
        event.preventDefault ();
        onConfirm (format);
    }

    return (
        <AdminFormModal
            open={open}
            title={t (`${i18nPrefix}_export_title`)}
            titleId="admin-export-title"
            description={t (`${i18nPrefix}_export_description`)}
            processing={processing}
            onClose={onClose}
        >
            <form className="space-y-4" onSubmit={submit}>
                <div>
                    <label htmlFor="admin-export-format" className={fbLabel}>{t (`${i18nPrefix}_export_select_format`)}</label>
                    <div className="relative">
                        <span className={fbInputIconWrap}>
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15.172 7l-6.586 6.586a2 2 0 102.828 2.828l6.414-6.586a4 4 0 00-5.656-5.656l-6.415 6.585a6 6 0 108.486 8.486L20.5 13" />
                            </svg>
                        </span>
                        <select
                            id="admin-export-format"
                            className={`${fbSelect} ps-10`}
                            value={format}
                            disabled={processing}
                            onChange={(event) => setFormat (event.target.value)}
                        >
                            {formats.map ((item) => <option key={item} value={item}>{item.toUpperCase ()}</option>)}
                        </select>
                    </div>
                </div>
                <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-600">
                    <FbButton variant="outline" type="button" disabled={processing} onClick={onClose}>{t ("cancel")}</FbButton>
                    <FbButton type="submit" disabled={processing}>{t ("export")}</FbButton>
                </div>
            </form>
        </AdminFormModal>
    );
};

export default AdminExportModal;
