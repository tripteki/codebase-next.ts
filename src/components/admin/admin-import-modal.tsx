import { type FormEvent, type ReactElement, useEffect, useState, } from "react";
import { useTranslation, } from "next-i18next/pages";

import AdminFilePicker from "@/components/admin/admin-file-picker";
import AdminFormModal from "@/components/admin/admin-form-modal";
import AdminImportSampleLink from "@/components/admin/admin-import-sample-link";
import FbButton from "@/components/flowbite/fb-button";
import FbLabel from "@/components/flowbite/fb-label";
import { fbFieldHint, } from "@/libs/flowbite-classes";

const AdminImportModal = ({
    open,
    i18nPrefix = "users",
    accept,
    processing = false,
    onClose,
    onSample,
    onConfirm,
}: {
    open: boolean;
    i18nPrefix?: string;
    accept: string;
    processing?: boolean;
    onClose: () => void;
    onSample: () => void;
    onConfirm: (file: File) => void;
}): ReactElement | null =>
{
    const { t, } = useTranslation ("common");
    const [file, setFile] = useState<File | null> (null);
    const [fileError, setFileError] = useState ("");

    useEffect (() =>
    {
        if (! open)
        {
            setFile (null);
            setFileError ("");
        }
    }, [open]);

    function submit (event: FormEvent): void
    {
        event.preventDefault ();

        if (! file)
        {
            setFileError (t (`${i18nPrefix}_import_file_required`));

            return;
        }

        onConfirm (file);
    }

    return (
        <AdminFormModal
            open={open}
            title={t (`${i18nPrefix}_import_title`)}
            titleId="admin-import-title"
            description={t (`${i18nPrefix}_import_description`)}
            processing={processing}
            onClose={onClose}
        >
            <form className="space-y-4" onSubmit={submit}>
                <div>
                    <FbLabel htmlFor="admin-import-file">{t (`${i18nPrefix}_import_select_file`)}</FbLabel>
                    <AdminFilePicker
                        id="admin-import-file"
                        accept={accept}
                        value={file}
                        invalid={Boolean (fileError)}
                        disabled={processing}
                        onChange={(nextFile) =>
                        {
                            setFile (nextFile);
                            setFileError ("");
                        }}
                    />
                    {fileError ? <p className="text-sm text-red-600">{fileError}</p> : null}
                    <p className={fbFieldHint}>{t (`${i18nPrefix}_import_file_hint`)}</p>
                </div>
                <AdminImportSampleLink label={t ("download_sample")} processing={processing} onClick={onSample} />
                <div className="flex items-center justify-between gap-3 border-t border-gray-200 pt-4 dark:border-gray-600">
                    <FbButton variant="outline" type="button" disabled={processing} onClick={onClose}>{t ("cancel")}</FbButton>
                    <FbButton type="submit" disabled={processing}>{t ("import_file")}</FbButton>
                </div>
            </form>
        </AdminFormModal>
    );
};

export default AdminImportModal;
