import { ReactElement, } from "react";
import { AlertTriangleIcon, } from "lucide-react";

import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert";
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
        <Alert variant="warning" className={cn ("mb-4", className)}>
            <AlertTriangleIcon />
            {title ? <AlertTitle>{title}</AlertTitle> : null}
            <AlertDescription>
                <p>{message}</p>
            </AlertDescription>
        </Alert>
    );
};

export default AlertWarning;
