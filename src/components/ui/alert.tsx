import { cva, type VariantProps, } from "class-variance-authority";
import * as React from "react";

import { cn, } from "@/libs/utils";

const alertVariants = cva (
    "relative grid w-full grid-cols-[auto_minmax(0,1fr)] items-start gap-x-3 gap-y-1 rounded-lg border px-4 py-3.5 text-sm [&>svg]:mt-0.5 [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-current",
    {
        variants: {
            variant: {
                default: "bg-background text-foreground",
                destructive:
                    "border-destructive/50 bg-destructive/10 text-destructive [&>svg]:text-destructive *:data-[slot=alert-description]:text-destructive/90",
                success:
                    "border-success/40 bg-success-muted text-success-foreground [&>svg]:text-success-foreground *:data-[slot=alert-description]:text-success-foreground/90",
                warning:
                    "border-amber-500/40 bg-amber-500/10 text-amber-900 dark:text-amber-200 [&>svg]:text-amber-600 dark:[&>svg]:text-amber-400 *:data-[slot=alert-description]:text-amber-900/90 dark:*:data-[slot=alert-description]:text-amber-200/90",
            },
        },
        defaultVariants: {
            variant: "default",
        },
    }
);

const Alert = ({
    className,
    variant,
    ... props
}: React.ComponentProps<"div"> & VariantProps<typeof alertVariants>): React.ReactElement =>
{
    return (
        <div
            data-slot="alert"
            role="alert"
            className={cn (alertVariants ({ variant, }), className)}
            {... props}
        />
    );
};

const AlertTitle = ({ className, ... props }: React.ComponentProps<"div">): React.ReactElement =>
{
    return (
        <div
            data-slot="alert-title"
            className={cn (
                "col-start-2 line-clamp-1 min-h-4 font-medium tracking-tight",
                className
            )}
            {... props}
        />
    );
};

const AlertDescription = ({
    className,
    ... props
}: React.ComponentProps<"div">): React.ReactElement =>
{
    return (
        <div
            data-slot="alert-description"
            className={cn (
                "text-muted-foreground col-start-2 grid justify-items-start gap-1 text-sm [&_p]:leading-relaxed",
                className
            )}
            {... props}
        />
    );
};

export { Alert, AlertTitle, AlertDescription, };
