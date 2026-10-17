import { type ChangeEvent, type ReactElement, useEffect, useRef, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { cn, } from "@/libs/utils";

const AdminFilePicker = ({
    id,
    accept = "*/*",
    disabled = false,
    invalid = false,
    value = null,
    selectedLabel,
    onChange,
}: {
    id: string;
    accept?: string;
    disabled?: boolean;
    invalid?: boolean;
    value?: File | null;
    selectedLabel?: string;
    onChange: (file: File | null) => void;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");
    const inputRef = useRef<HTMLInputElement | null> (null);
    const fileLabel = value?.name ?? selectedLabel ?? t ("import_no_file");

    useEffect (() =>
    {
        if (! value && inputRef.current)
        {
            inputRef.current.value = "";
        }
    }, [value]);

    function handleChange (event: ChangeEvent<HTMLInputElement>): void
    {
        onChange (event.target.files?.[0] ?? null);
    }

    return (
        <div className={cn (
            "flex overflow-hidden rounded-lg border bg-gray-50 dark:bg-gray-700",
            invalid ? "border-red-500 dark:border-red-500" : "border-gray-300 dark:border-gray-600"
        )}>
            <button
                type="button"
                className="btn-brand-primary shrink-0 border-e border-gray-300 px-4 py-2.5 text-xs font-medium transition-colors disabled:cursor-not-allowed disabled:opacity-50 dark:border-gray-600"
                disabled={disabled}
                onClick={() => inputRef.current?.click ()}
            >
                {t ("import_browse")}
            </button>
            <div className="flex min-w-0 flex-1 items-center gap-2 px-3 py-2.5 text-sm text-gray-700 dark:text-gray-300" title={fileLabel}>
                <svg className="h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                    <path d="M4 3.5A1.5 1.5 0 0 1 5.5 2h5.086a1.5 1.5 0 0 1 1.06.44l3.914 3.914a1.5 1.5 0 0 1 .44 1.06V16.5A1.5 1.5 0 0 1 14.5 18h-9A1.5 1.5 0 0 1 4 16.5v-13Z" />
                </svg>
                <span className="truncate">{fileLabel}</span>
            </div>
            <input
                id={id}
                ref={inputRef}
                type="file"
                accept={accept}
                className="sr-only"
                disabled={disabled}
                onChange={handleChange}
            />
        </div>
    );
};

export default AdminFilePicker;
