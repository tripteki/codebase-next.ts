import {
    type ChangeEvent,
    type InputHTMLAttributes,
    type ReactElement,
} from "react";

import { fbCheckbox, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

export type FbCheckboxProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
> & {
    checked?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FbCheckbox = ({
    className,
    checked,
    onCheckedChange,
    onChange,
    ... props
}: FbCheckboxProps): ReactElement => {
    const handleChange = (event: ChangeEvent<HTMLInputElement>): void => {
        onCheckedChange?. (event.target.checked);
        onChange?. (event);
    };

    return (
        <input
            type="checkbox"
            checked={checked}
            className={cn (fbCheckbox, className)}
            onChange={handleChange}
            {... props}
        />
    );
};

export default FbCheckbox;
