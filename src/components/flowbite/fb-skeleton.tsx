import { type CSSProperties, type ReactElement, } from "react";

import { fbSkeleton, } from "@/libs/flowbite-classes";

const FbSkeleton = ({
    className = "h-4 w-full",
    style,
}: {
    className?: string;
    style?: CSSProperties;
}): ReactElement =>
{
    return <div aria-hidden="true" className={`${fbSkeleton} ${className}`} style={style} />;
};

export default FbSkeleton;
