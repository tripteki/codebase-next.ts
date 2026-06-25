import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { fbAlertDanger, } from "@/libs/flowbite-classes";

interface AlertErrorProps
{
    errors?: string[];
    message?: string;
    title?: string;
};

const AlertError = ({
    errors = [],
    message,
    title,
}: AlertErrorProps): ReactElement | null =>
{
    const { t, } = useTranslation ("common");
    const items = message
        ? [ message, ]
        : errors.filter ((error) => error !== "");

    if (items.length === 0)
    {
        return null;
    }

    const resolvedTitle = title ?? (items.length > 1 ? t ("something_went_wrong") : undefined);

    return (
        <div className={fbAlertDanger} role="alert">
            <svg
                className="me-3 inline h-4 w-4 shrink-0"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="currentColor"
                viewBox="0 0 20 20"
            >
                <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5Zm3.707 11.793a1 1 0 1 1-1.414 1.414L10 11.414l-2.293 2.293a1 1 0 0 1-1.414-1.414L8.586 10 6.293 7.707a1 1 0 0 1 1.414-1.414L10 8.586l2.293-2.293a1 1 0 0 1 1.414 1.414L11.414 10l2.293 2.293Z" />
            </svg>
            <div>
                {resolvedTitle ? (
                    <span className="font-medium">{resolvedTitle}</span>
                ) : null}
                {items.length === 1 ? (
                    <p>{items[0]}</p>
                ) : (
                    <ul className="mt-1.5 list-inside list-disc">
                        {Array.from (new Set (items)).map ((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
            </div>
        </div>
    );
};

export default AlertError;
