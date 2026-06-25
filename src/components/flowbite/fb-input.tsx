import {
    type ChangeEvent,
    type InputHTMLAttributes,
    type ReactElement,
} from "react";

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
                type={type}
                name={name}
                autoComplete={autoComplete}
                disabled={disabled}
                aria-invalid={invalid || undefined}
                className={cn (
                    fbInput,
                    resolvedIcon && fbInputWithIcon,
                    invalid && fbInputError,
                    disabled && "cursor-not-allowed opacity-60 dark:opacity-60",
                    className
                )}
                {... props}
            />
        </div>
    );
};

export default FbInput;
