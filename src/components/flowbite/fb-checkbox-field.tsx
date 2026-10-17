import { type ReactElement, type ReactNode, } from "react";

import FbCheckbox, { type FbCheckboxProps, } from "@/components/flowbite/fb-checkbox";
import { fbCheckboxLabel, fbCheckboxRow, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

export type FbCheckboxFieldProps = FbCheckboxProps & {
    id: string;
    children: ReactNode;
    wrapperClassName?: string;
    labelClassName?: string;
};

const FbCheckboxField = ({
    id,
    children,
    wrapperClassName,
    labelClassName,
    disabled,
    className,
    ... checkboxProps
}: FbCheckboxFieldProps): ReactElement => (
    <div className={cn (fbCheckboxRow, wrapperClassName)}>
        <FbCheckbox id={id} disabled={disabled} className={className} {... checkboxProps} />
        <label
            htmlFor={id}
            className={cn (
                fbCheckboxLabel,
                labelClassName,
                disabled && "cursor-not-allowed opacity-50"
            )}
        >
            {children}
        </label>
    </div>
);

export default FbCheckboxField;
