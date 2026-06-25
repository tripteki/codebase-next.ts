import Link from "next/link";
import { type ButtonHTMLAttributes, type ReactElement, type ReactNode, } from "react";

import {
    fbButtonDanger,
    fbButtonGhost,
    fbButtonOutline,
    fbButtonPrimary,
    fbButtonSecondary,
} from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

type FbButtonVariant = "primary" | "outline" | "ghost" | "danger" | "secondary";
type FbButtonSize = "default" | "sm" | "lg" | "icon";

export type FbButtonProps = ButtonHTMLAttributes<HTMLButtonElement> & {
    variant?: FbButtonVariant;
    size?: FbButtonSize;
    href?: string;
    children?: ReactNode;
    className?: string;
};

function resolveVariantClass (variant: FbButtonVariant): string {
    switch (variant) {
        case "outline":
            return fbButtonOutline;
        case "ghost":
            return fbButtonGhost;
        case "danger":
            return fbButtonDanger;
        case "secondary":
            return fbButtonSecondary;
        default:
            return fbButtonPrimary;
    }
}

function resolveSizeClass (size: FbButtonSize): string {
    if (size === "lg") {
        return "px-6 py-3 text-base";
    }

    if (size === "sm") {
        return "px-3 py-1.5 text-xs";
    }

    if (size === "icon") {
        return "h-10 w-10 p-2.5";
    }

    return "";
}

const FbButton = ({
    variant = "primary",
    size = "default",
    href,
    className,
    children,
    type = "button",
    ... props
}: FbButtonProps): ReactElement => {
    const classes = cn (
        resolveVariantClass (variant),
        resolveSizeClass (size),
        className
    );

    if (href?.startsWith ("/")) {
        return (
            <Link href={href} className={classes}>
                {children}
            </Link>
        );
    }

    if (href) {
        return (
            <a
                href={href}
                className={classes}
                target="_blank"
                rel="noopener noreferrer"
            >
                {children}
            </a>
        );
    }

    return (
        <button type={type} className={classes} {... props}>
            {children}
        </button>
    );
};

export default FbButton;
