import { ReactElement, } from "react";

import { fbAlertWarning, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

interface AlertWarningProps
{
    message?: string;
    title?: string;
    className?: string;
}

const AlertWarning = ({
    message,
    title,
    className,
}: AlertWarningProps): ReactElement | null =>
{
    if (! message)
    {
        return null;
    }

    return (
        <div className={cn (fbAlertWarning, className)} role="alert">
            <svg
                className="me-3 inline h-4 w-4 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM10 15a1 1 0 1 1 0-2 1 1 0 0 1 0 2Zm1-4a1 1 0 0 1-2 0V6a1 1 0 0 1 2 0v5Z" />
            </svg>
            <div>
                {title ? <span className="font-medium">{title}</span> : null}
                <p>{message}</p>
            </div>
        </div>
    );
};

export default AlertWarning;
