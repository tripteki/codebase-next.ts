import { ReactElement, ComponentProps, } from "react";
import Link from "next/link";

import { cn, } from "@/libs/utils";

type TextLinkProps = ComponentProps<typeof Link>;

const TextLink = ({
    className = "",
    children,
    ... props
}: TextLinkProps): ReactElement =>
{
    return (
        <Link
            className={cn (
                "text-foreground underline decoration-neutral-300 underline-offset-4 transition-colors duration-300 ease-out hover:decoration-current! dark:decoration-neutral-500",
                className,
            )}
            {... props}
        >
            {children}
        </Link>
    );
};

export default TextLink;
