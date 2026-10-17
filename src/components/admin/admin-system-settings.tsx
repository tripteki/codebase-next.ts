import { type ReactElement, useEffect, useState, } from "react";
import { useTranslation, } from "next-i18next/pages";

import AdminFilePicker from "@/components/admin/admin-file-picker";
import AdminFormSkeleton from "@/components/admin/admin-form-skeleton";
import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import FbButton from "@/components/flowbite/fb-button";
import FbInput from "@/components/flowbite/fb-input";
import FbLabel from "@/components/flowbite/fb-label";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { adminSectionClass, adminSectionFooterClass, } from "@/libs/admin-form-classes";
import { fetchAdminSettings, saveAdminSettings, } from "@/libs/admin-api";
import { resolveCallErrorMessage, } from "@/libs/call-message";
import { fbInput, fbLink, } from "@/libs/flowbite-classes";
import type { AdminSetting, AdminSettingDraft, } from "@/types/admin/setting";

function blankRow (): AdminSettingDraft
{
    return {
        id: "",
        key: "",
        value: "",
        value_kind: "text",
        value_url: null,
        file: null,
        remove: false,
    };
}

function toDraft (row: AdminSetting): AdminSettingDraft
{
    return {
        id: row.id,
        key: row.key,
        value: row.value ?? "",
        value_kind: row.value_kind === "file" ? "file" : "text",
        value_url: row.value_url,
        file: null,
        remove: false,
    };
}

function readRows (payload: unknown): AdminSetting[]
{
    if (! payload || typeof payload !== "object")
    {
        return [];
    }

    const data = (payload as { data?: unknown }).data;

    return Array.isArray (data) ? data as AdminSetting[] : [];
}

const AdminSystemSettings = (): ReactElement =>
{
    const { t, } = useTranslation ("common");
    const [rows, setRows] = useState<AdminSettingDraft[]> ([]);
    const [message, setMessage] = useState ("");
    const [error, setError] = useState ("");
    const [isLoading, setIsLoading] = useState (true);
    const [isSaving, setIsSaving] = useState (false);

    async function load (): Promise<void>
    {
        setIsLoading (true);
        setError ("");
        const result = await fetchAdminSettings ();

        setIsLoading (false);

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        const loaded = readRows (result.data).map (toDraft);

        setRows (loaded.length > 0 ? loaded : [blankRow (),]);
    }

    function removeRow (index: number): void
    {
        setRows ((current) =>
        {
            const next = current.map ((row, rowIndex) =>
                rowIndex === index ? { ...row, remove: true, file: null, } : row
            );
            const target = current[index];

            if (! target)
            {
                return current;
            }

            const withoutNew = target.id ? next : next.filter ((_, rowIndex) => rowIndex !== index);

            if (withoutNew.filter ((entry) => ! entry.remove).length === 0)
            {
                return [...withoutNew, blankRow (),];
            }

            return withoutNew;
        });
    }

    function updateRow (index: number, patch: Partial<AdminSettingDraft>): void
    {
        setRows ((current) => current.map ((row, rowIndex) =>
            rowIndex === index ? { ...row, ...patch, } : row
        ));
    }

    async function save (): Promise<void>
    {
        setMessage ("");
        setError ("");
        setIsSaving (true);
        const result = await saveAdminSettings (rows);

        setIsSaving (false);

        if (! result.isSuccess)
        {
            setError (resolveCallErrorMessage (result.error, t ("something_went_wrong")));

            return;
        }

        setRows (readRows (result.data).map (toDraft));
        setMessage (t ("saved"));
    }

    useEffect (() =>
    {
        void load ();
    }, []);

    return (
        <div className="space-y-6">
            <AlertSuccess message={message} />
            <AlertError message={error} />
            {isLoading ? <AdminFormSkeleton fields={4} /> : rows.map ((row, index) => row.remove ? null : (
                <div key={row.id || `new-${index}`} className={adminSectionClass}>
                    <div className="grid grid-cols-1 items-start gap-4 md:grid-cols-12">
                        <div className="md:col-span-4">
                            <FbLabel htmlFor={`setting-key-${index}`}>{t ("settings_column_key")}</FbLabel>
                            <FbInput id={`setting-key-${index}`} name="key" value={row.key} placeholder={t ("settings_key_placeholder")} onChange={(event) => updateRow (index, { key: event.target.value, })} />
                        </div>
                        <div className="space-y-3 md:col-span-7">
                            <FbLabel htmlFor={`setting-kind-${index}`}>{t ("settings_column_value")}</FbLabel>
                            <select id={`setting-kind-${index}`} className={fbInput} value={row.value_kind} onChange={(event) => updateRow (index, { value_kind: event.target.value === "file" ? "file" : "text", })}>
                                <option value="text">text</option>
                                <option value="file">file</option>
                            </select>
                            {row.value_kind === "text" ? (
                                <FbInput id={`setting-value-${index}`} name="value" value={row.value} placeholder={t ("settings_value_placeholder")} onChange={(event) => updateRow (index, { value: event.target.value, })} />
                            ) : (
                                <div className="space-y-3 rounded-lg border border-gray-200 bg-gray-50 p-4 dark:border-gray-600 dark:bg-gray-900/40">
                                    {row.value_url ? (
                                        <div className="flex items-center gap-2 rounded-lg border border-gray-200 bg-white px-3 py-2 dark:border-gray-600 dark:bg-gray-800">
                                            <a className={`${fbLink} min-w-0 truncate text-xs`} href={row.value_url} target="_blank" rel="noreferrer">
                                                {t ("settings_open_file")}
                                            </a>
                                        </div>
                                    ) : null}
                                    <AdminFilePicker
                                        id={`setting-file-${index}`}
                                        accept="image/jpeg,image/png,image/gif,image/webp,image/x-icon,.ico"
                                        value={row.file ?? null}
                                        selectedLabel={row.file ? undefined : (row.value || undefined)}
                                        onChange={(file) => updateRow (index, { file, value_kind: "file", })}
                                    />
                                </div>
                            )}
                        </div>
                        <div className="flex items-center justify-center md:col-span-1 md:justify-end md:self-center">
                            <button
                                type="button"
                                className="inline-flex h-8 w-8 items-center justify-center rounded-full bg-red-600 text-white transition-colors hover:bg-red-700"
                                title={t ("delete")}
                                aria-label={t ("delete")}
                                onClick={() => removeRow (index)}
                            >
                                ×
                            </button>
                        </div>
                    </div>
                </div>
            ))}
        {! isLoading ? (
            <div className={adminSectionFooterClass}>
                <FbButton variant="outline" type="button" className="inline-flex items-center gap-1 px-3 py-1.5 text-xs" disabled={isSaving} onClick={() => setRows ((current) => [...current, blankRow ()])}>
                    {t ("settings_add_row")}
                </FbButton>
                <FbButton type="button" className="inline-flex items-center gap-2 px-3 py-1.5 text-xs" disabled={isSaving} onClick={() => void save ()}>
                    {isSaving ? <FbSpinner className="h-4 w-4" /> : null}
                    {t ("save_changes")}
                </FbButton>
            </div>
        ) : null}
        </div>
    );
};

export default AdminSystemSettings;
