import { ReactElement, } from "react";
import { CheckCircle2Icon, } from "lucide-react";

import { Alert, AlertDescription, AlertTitle, } from "@/components/ui/alert";
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
        <Alert variant="success" className={cn ("mb-4", className)}>
            <CheckCircle2Icon />
            {title ? <AlertTitle>{title}</AlertTitle> : null}
            <AlertDescription>
                <p>{message}</p>
            </AlertDescription>
        </Alert>
    );
};

export default AlertSuccess;
