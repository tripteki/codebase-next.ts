import { type LabelHTMLAttributes, type ReactElement, } from "react";

import { fbInlineLabel, fbLabel, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

export type FbLabelProps = LabelHTMLAttributes<HTMLLabelElement> & {
    variant?: "field" | "inline";
};

const FbLabel = ({
    className,
    children,
    variant = "field",
    ... props
}: FbLabelProps): ReactElement => (
    <label
        className={cn (variant === "inline" ? fbInlineLabel : fbLabel, className)}
        {... props}
    >
        {children}
    </label>
);

export default FbLabel;
