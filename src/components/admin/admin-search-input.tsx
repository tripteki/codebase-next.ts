import { type KeyboardEvent, type ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { fbAdminSearch, fbInputIconWrap, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

const AdminSearchInput = ({
    id,
    placeholder,
    value,
    onChange,
    onSubmit,
}: {
    id: string;
    placeholder: string;
    value: string;
    onChange: (value: string) => void;
    onSubmit: (value: string) => void;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");

    function onKeyUp (event: KeyboardEvent<HTMLInputElement>): void
    {
        if (event.key === "Enter")
        {
            onSubmit (value);
        }
    }

    return (
        <div className="relative">
            <div className={fbInputIconWrap}>
                <img src="/manifest/asset/icon-search.svg" alt="" className="h-4 w-4 shrink-0 object-contain" />
            </div>
            <input
                id={id}
                type="search"
                value={value}
                className={cn (fbAdminSearch, "search-hide-native-clear", value.length > 0 && "pe-10")}
                placeholder={placeholder}
                onChange={(event) => onChange (event.target.value)}
                onKeyUp={onKeyUp}
            />
            {value.length > 0 ? (
                <button
                    type="button"
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                    aria-label={t ("search_clear")}
                    onClick={() =>
                    {
                        onChange ("");
                        onSubmit ("");
                    }}
                >
                    <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                    </svg>
                </button>
            ) : null}
        </div>
    );
};

export default AdminSearchInput;
