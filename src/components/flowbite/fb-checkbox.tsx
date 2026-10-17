import {
    type ChangeEvent,
    type InputHTMLAttributes,
    type ReactElement,
    useEffect,
    useRef,
} from "react";

import { fbCheckbox, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

export type FbCheckboxProps = Omit<
    InputHTMLAttributes<HTMLInputElement>,
    "type" | "onChange"
> & {
    checked?: boolean;
    indeterminate?: boolean;
    onCheckedChange?: (checked: boolean) => void;
    onChange?: (event: ChangeEvent<HTMLInputElement>) => void;
};

const FbCheckbox = ({
    className,
    checked,
    indeterminate = false,
    onCheckedChange,
    onChange,
    ... props
}: FbCheckboxProps): ReactElement =>
{
    const inputRef = useRef<HTMLInputElement | null> (null);

    useEffect (() =>
    {
        if (inputRef.current)
        {
            inputRef.current.indeterminate = indeterminate;
        }
    }, [indeterminate, checked]);

    const handleChange = (event: ChangeEvent<HTMLInputElement>): void =>
    {
        onCheckedChange?. (event.target.checked);
        onChange?. (event);
    };

    return (
        <input
            {... props}
            ref={inputRef}
            type="checkbox"
            checked={checked}
            className={cn (fbCheckbox, className)}
            onChange={handleChange}
        />
    );
};

export default FbCheckbox;
