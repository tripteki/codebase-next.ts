import { ReactElement, ComponentProps, } from "react";
import Link from "next/link";

import { fbLink, } from "@/libs/flowbite-classes";
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
            className={cn (fbLink, className)}
            {... props}
        >
            {children}
        </Link>
    );
};

export default TextLink;
