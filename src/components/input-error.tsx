import { ReactElement, type HTMLAttributes, } from "react";

import { cn, } from "@/libs/utils";

interface InputErrorProps extends HTMLAttributes<HTMLParagraphElement>
{
    message?: string;
};

const InputError = ({
    message,
    className = "",
    ... props
}: InputErrorProps): ReactElement | null =>
{
    return message
        ? (
            <p
                {... props}
                className={cn ("text-sm text-red-600 dark:text-red-400", className)}
            >
                {message}
            </p>
        )
        : null;
};

export default InputError;
