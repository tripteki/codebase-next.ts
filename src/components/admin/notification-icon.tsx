import { type ReactElement, } from "react";

import type { NotificationTheme, } from "@/libs/notification-presenter";
import { cn, } from "@/libs/utils";

const NotificationIcon = ({
    name = "default",
    isRead = false,
    theme = "success",
    size = "sm",
}: {
    name?: string;
    isRead?: boolean;
    theme?: NotificationTheme;
    size?: "xs" | "sm" | "lg";
}): ReactElement =>
{
    const normalized = name.toLowerCase ().replaceAll ("_", "-").trim ();
    const iconName = normalized === "" || ! /^[a-z0-9]+(?:-[a-z0-9]+)*$/.test (normalized)
        ? "default"
        : normalized;
    const sizeClass = size === "lg" ? "h-10 w-10" : size === "xs" ? "h-5 w-5" : "h-8 w-8";
    const iconClass = size === "lg" ? "h-5 w-5" : size === "xs" ? "h-2.5 w-2.5" : "h-4 w-4";
    const ring = isRead || size === "xs"
        ? "ring-2 ring-white dark:ring-gray-800"
        : theme === "danger"
            ? "ring-2 ring-red-200 dark:ring-red-700/80"
            : "ring-2 ring-[color-mix(in_srgb,var(--brand-primary)_18%,#ffffff_82%)] dark:ring-[color-mix(in_srgb,var(--brand-primary)_35%,#020617_65%)]";
    const wrapperClass = theme === "danger"
        ? cn ("flex shrink-0 items-center justify-center rounded-full bg-red-100 text-red-600 dark:bg-red-900/40 dark:text-red-300", sizeClass, ring)
        : cn ("icon-brand-soft flex shrink-0 items-center justify-center rounded-full", sizeClass, ring);

    if (iconName === "import")
    {
        return (
            <div className={wrapperClass}>
                <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="17 8 12 3 7 8" />
                    <line x1="12" y1="3" x2="12" y2="15" />
                </svg>
            </div>
        );
    }

    if (iconName === "export")
    {
        return (
            <div className={wrapperClass}>
                <svg className={iconClass} fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" viewBox="0 0 24 24" aria-hidden="true">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                    <polyline points="7 10 12 15 17 10" />
                    <line x1="12" y1="15" x2="12" y2="3" />
                </svg>
            </div>
        );
    }

    return (
        <div className={wrapperClass}>
            <svg className={iconClass} fill="currentColor" viewBox="0 0 16 16" aria-hidden="true">
                <path d="M8 16a2 2 0 0 0 2-2H6a2 2 0 0 0 2 2zM8 1.918l-.797.161A4.002 4.002 0 0 0 4 6c0 .628-.134 2.197-.459 3.742-.16.767-.376 1.566-.663 2.258h10.244c-.287-.692-.502-1.49-.663-2.258C12.134 8.197 12 6.628 12 6a4.002 4.002 0 0 0-3.203-3.92L8 1.917zM14.22 12c.223.447.481.801.78 1H1c.299-.199.557-.553.78-1C2.68 10.2 3 6.88 3 6c0-2.42 1.72-4.44 4.005-4.901a1 1 0 1 1 1.99 0A5.002 5.002 0 0 1 13 6c0 .88.32 4.2 1.22 6z" />
            </svg>
        </div>
    );
};

export default NotificationIcon;
