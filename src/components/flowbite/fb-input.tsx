import {
    type ChangeEvent,
    type InputHTMLAttributes,
    type ReactElement,
    useState,
} from "react";
import { useTranslation, } from "next-i18next/pages";

import {
    fbInput,
    fbInputError,
    fbInputIconWrap,
    fbInputWithIcon,
} from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

type FbInputIcon = "email" | "password" | "user";

function resolveFbInputIcon (options: {
    icon?: FbInputIcon | "none";
    type?: string;
    name?: string;
    autoComplete?: string;
}): FbInputIcon | null {
    if (options.icon === "none") {
        return null;
    }

    if (options.icon) {
        return options.icon;
    }

    if (options.type === "email") {
        return "email";
    }

    if (options.type === "password") {
        return "password";
    }

    if (options.name === "name" || options.autoComplete === "name") {
        return "user";
    }

    if (
        options.name === "identifier" ||
        options.name === "email" ||
        options.autoComplete?.includes ("email")
    ) {
        return "email";
    }

    return null;
}

export type FbInputProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "onChange"
> & {
    invalid?: boolean;
    icon?: FbInputIcon | "none";
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FbInput = ({
    className,
    invalid = false,
    icon,
    type,
    name,
    autoComplete,
    disabled,
    ... props
}: FbInputProps): ReactElement => {
    const { t, } = useTranslation ("common");
    const [visible, setVisible] = useState (false);
    const inputType = type === "password" && visible ? "text" : type;
    const resolvedIcon = resolveFbInputIcon ({
        icon,
        type,
        name,
        autoComplete,
    });

    return (
        <div className="relative">
            {resolvedIcon ? (
                <span className={fbInputIconWrap}>
                    {resolvedIcon === "email" ? (
                        <svg
                            className="h-4 w-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z"
                            />
                        </svg>
                    ) : null}
                    {resolvedIcon === "password" ? (
                        <svg
                            className="h-4 w-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z"
                            />
                        </svg>
                    ) : null}
                    {resolvedIcon === "user" ? (
                        <svg
                            className="h-4 w-4"
                            aria-hidden="true"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                            stroke="currentColor"
                            strokeWidth="2"
                        >
                            <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                            />
                        </svg>
                    ) : null}
                </span>
            ) : null}

            <input
                type={inputType}
                name={name}
                autoComplete={autoComplete}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                className={cn (
                    fbInput,
                    resolvedIcon && fbInputWithIcon,
                    invalid && fbInputError,
                    type === "password" && "pe-12",
                    disabled && "cursor-not-allowed opacity-60 dark:opacity-60",
                    className
                )}
                {... props}
            />
            {type === "password" ? (
                <button
                    type="button"
                    data-test="password-toggle"
                    className="absolute inset-y-0 end-0 flex items-center pe-3 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200"
                    aria-label={visible ? t ("hide_password") : t ("show_password")}
                    aria-pressed={visible}
                    onClick={() => setVisible ((value) => ! value)}
                >
                    {visible ? (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M10.5 10.5a2 2 0 0 0 2.9 2.9" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M9.9 5.2A10.8 10.8 0 0 1 12 5c4.5 0 8.3 2.9 9.5 7a11 11 0 0 1-4.2 5.2M6.2 6.2A11 11 0 0 0 2.5 12c1.2 4.1 5 7 9.5 7 1.6 0 3.1-.4 4.4-1" />
                        </svg>
                    ) : (
                        <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M15 12a3 3 0 1 1-6 0 3 3 0 0 1 6 0z" />
                            <path strokeLinecap="round" strokeLinejoin="round" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                        </svg>
                    )}
                </button>
            ) : null}
        </div>
    );
};

export default FbInput;
