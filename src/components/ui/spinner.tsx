import { ReactElement, } from "react";
import { Loader2Icon, } from "lucide-react";
import { useTranslation, } from "next-i18next";

import { cn, } from "@/libs/utils";

const Spinner = ({ className, ... props }: React.ComponentProps<"svg">): React.ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <Loader2Icon
            role="status"
            aria-label={t ("loading")}
            className={cn ("size-4 animate-spin", className)}
            {... props}
        />
    );
};

export { Spinner, };
