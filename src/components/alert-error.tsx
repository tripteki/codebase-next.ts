import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";
import { AlertCircleIcon, } from "lucide-react";

import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert";

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
        <Alert variant="destructive" className="mb-4">
            <AlertCircleIcon />
            {resolvedTitle ? (
                <AlertTitle>{resolvedTitle}</AlertTitle>
            ) : null}
            <AlertDescription>
                {items.length === 1 ? (
                    <p>{items[0]}</p>
                ) : (
                    <ul className="list-inside list-disc text-sm">
                        {Array.from (new Set (items)).map ((error, index) => (
                            <li key={index}>{error}</li>
                        ))}
                    </ul>
                )}
            </AlertDescription>
        </Alert>
    );
};

export default AlertError;
