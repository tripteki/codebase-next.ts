import { ReactElement, } from "react";

import { fbAlertSuccess, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

interface AlertSuccessProps
{
    message?: string;
    title?: string;
    className?: string;
}

const AlertSuccess = ({
    message,
    title,
    className,
}: AlertSuccessProps): ReactElement | null =>
{
    if (! message)
    {
        return null;
    }

    return (
        <div className={cn (fbAlertSuccess, className)} role="alert">
            <svg
                className="me-3 inline h-4 w-4 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 8.207-4 4a1 1 0 0 1-1.414 0l-2-2a1 1 0 0 1 1.414-1.414L9 10.586l3.293-3.293a1 1 0 0 1 1.414 1.414Z" />
            </svg>
            <div>
                {title ? <span className="font-medium">{title}</span> : null}
                <p>{message}</p>
            </div>
        </div>
    );
};

export default AlertSuccess;
