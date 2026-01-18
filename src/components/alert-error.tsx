import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next";
import { AlertCircleIcon, } from "lucide-react";

import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert";

interface AlertErrorProps
{
    errors: string[];
    title?: string;
};

const AlertError = ({
    errors,
    title,
}: AlertErrorProps): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <Alert variant="destructive">
            <AlertCircleIcon />
            <AlertTitle>{title || t ("something_went_wrong")}</AlertTitle>
            <AlertDescription>
                <ul className="list-inside list-disc text-sm">
                    {Array.from (new Set (errors)).map ((error, index) => (
                        <li key={index}>{error}</li>
                    ))}
                </ul>
            </AlertDescription>
        </Alert>
    );
};

export default AlertError;
