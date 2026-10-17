import { type ReactElement, type ReactNode, } from "react";

import FbButton from "@/components/flowbite/fb-button";

type AdminRowIcon = "view" | "edit" | "delete" | "deactivate" | "activate" | "verify";

const AdminRowButton = ({
    icon,
    href,
    disabled,
    onClick,
    children,
}: {
    icon: AdminRowIcon;
    href?: string;
    disabled?: boolean;
    onClick?: () => void;
    children: ReactNode;
}): ReactElement =>
{
    const variant = icon === "delete" || icon === "deactivate"
        ? "danger"
        : icon === "edit"
            ? "tertiary"
            : icon === "activate" || icon === "verify"
                ? "secondary"
                : "primary";

    return (
        <FbButton
            className="whitespace-nowrap"
            variant={variant}
            size="xs"
            href={href}
            disabled={disabled}
            type="button"
            onClick={onClick}
        >
            {children}
        </FbButton>
    );
};

export default AdminRowButton;
