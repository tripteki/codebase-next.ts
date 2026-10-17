import { cn, } from "@/libs/utils";

export function adminSegmentTabClass (active: boolean): string
{
    return cn (
        "inline-flex w-full cursor-pointer items-center justify-center gap-1.5 border px-4 py-2.5 text-sm font-medium leading-5 focus:outline-none focus:ring-2 focus:ring-inset",
        "focus:ring-[color-mix(in_srgb,var(--brand-primary)_45%,#ffffff_55%)]",
        active ? "tab-brand-active" : "tab-brand-inactive"
    );
}
