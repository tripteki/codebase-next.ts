import { ReactElement, type ImgHTMLAttributes, } from "react";

import { cn, } from "@/libs/utils";

const MANIFEST_LOGO_SRC = "/manifest/asset/logo.png";

const AppLogo = ({
    className,
    ... props
}: ImgHTMLAttributes<HTMLImageElement>): ReactElement =>
{
    return (
        <img
            src={MANIFEST_LOGO_SRC}
            alt=""
            width={120}
            height={32}
            className={cn ("h-8 w-auto object-contain", className)}
            {... props}
        />
    );
};

export default AppLogo;
