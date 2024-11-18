import { useTranslation, } from "next-i18next";
import { FC, ReactNode, useState, ChangeEvent, } from "react";

type Target =
{
    target: string;
};

const InputComponent: FC<
{
    modelValue: string;
    name: string;
    type?: "text" | "number" | "email" | "password";
    label: string;
    placeholder?: string;
    isLoading?: boolean;
    isLoaded?: boolean;
    isError?: boolean;
    isSuccess?: boolean;
    validationMessage?: string;
    icon?: ReactNode;
    onChange?: (value: string) => void;

}> = ({

    modelValue,
    name,
    type = "text",
    label,
    placeholder,
    isLoading = false,
    isLoaded = true,
    isError = false,
    isSuccess = true,
    validationMessage = "",
    icon,
    onChange,

}) => {

    const { t, } = useTranslation ("auth");

    const [ value, setValue, ] = useState<string>(modelValue);

    const target: Target =
    {
        "target": "#" + name,
    };

    const handleInputChange = (event: ChangeEvent<HTMLInputElement>) =>
    {
        const newValue = event.target.value;

        setValue (newValue);

        if (onChange) {

            onChange (newValue);
        }
    };

    return (

        <div className="relative">
            <label htmlFor={name} className="block text-sm font-medium mb-2">{label}</label>
            <div className="relative">
                <input
                    id={name}
                    name={name}
                    type={type}
                    value={value}
                    placeholder={placeholder}
                    autoComplete="off"
                    onChange={handleInputChange}
                    className={`peer py-3 px-4 block w-full bg-gray-100 border-transparent rounded-lg text-sm focus:border-blue-500 focus:ring-blue-500 disabled:opacity-50 disabled:pointer-events-none light:bg-neutral-700 light:border-transparent light:text-neutral-400 light:placeholder-neutral-500 light:focus:ring-neutral-600 ${icon ? "ps-11" : ""}`}
                    aria-describedby={`${name}-helper`}
                    required
                    disabled={isLoading || ! isLoaded}
                />
                {type === "password" && (
                    <button type="button" data-hs-toggle-password={JSON.stringify (target)} className="absolute top-0 end-0 p-3.5 rounded-e-md">
                        <svg className="flex-shrink-0 size-3.5 text-gray-400 light:text-neutral-600" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                            <path className="hs-password-active:hidden" d="M9.88 9.88a3 3 0 1 0 4.24 4.24"></path>
                            <path className="hs-password-active:hidden" d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"></path>
                            <path className="hs-password-active:hidden" d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"></path>
                            <line className="hs-password-active:hidden" x1="2" x2="22" y1="2" y2="22"></line>
                            <path className="hidden hs-password-active:block" d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"></path>
                            <circle className="hidden hs-password-active:block" cx="12" cy="12" r="3"></circle>
                        </svg>
                    </button>
                )}
                <div className="absolute inset-y-0 start-0 flex items-center pointer-events-none ps-4 peer-disabled:opacity-50 peer-disabled:pointer-events-none">
                    {icon}
                </div>
                {isLoading || ! isLoaded ? (
                    <>
                        <div className="absolute top-0 start-0 size-full bg-white/50 rounded-lg light:bg-neutral-800/40"></div>
                        <div className="absolute top-1/2 start-1/2 transform -translate-x-1/2 -translate-y-1/2">
                            <div className="animate-spin inline-block size-6 border-[3px] border-current border-t-transparent text-blue-600 rounded-full light:text-blue-500" role="status" aria-label="loading">
                                <span className="sr-only">{t ("auth.component.loading")}</span>
                            </div>
                        </div>
                    </>
                ) : null}
            </div>
            {(isError || ! isSuccess) && (
                <p id={`${name}-helper`} className="text-sm text-red-600 mt-2">{validationMessage}</p>
            )}
        </div>
    );
};

export default InputComponent;