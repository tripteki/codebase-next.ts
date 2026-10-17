import { type ReactElement, type SVGProps, } from "react";

import { cn, } from "@/libs/utils";

const AdminSidebarIcon = ({
    name,
    size = "md",
    className,
}: {
    name: string;
    size?: "sm" | "md";
    className?: string;
}): ReactElement =>
{
    const box = size === "sm" ? "h-4 w-4 shrink-0" : "h-5 w-5 shrink-0";
    const common: SVGProps<SVGSVGElement> = {
        className: cn (box, className),
        viewBox: "0 0 24 24",
        fill: "none",
        stroke: "currentColor",
        strokeWidth: 1.75,
        strokeLinecap: "round",
        strokeLinejoin: "round",
        "aria-hidden": true,
    };

    if (name === "dashboard")
    {
        return (
            <svg className={cn ("admin-sidebar-icon", box, className)} viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
                <circle cx="4" cy="4" r="3" />
            </svg>
        );
    }

    if (name === "nav_accounts")
    {
        return (
            <svg className={cn ("admin-sidebar-icon me-3 h-5 w-5 shrink-0", className)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path d="M3 4a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v2H3V4Zm0 4h8v8H4a1 1 0 0 1-1-1V8Zm10 0h4v7a1 1 0 0 1-1 1h-3V8Z" />
            </svg>
        );
    }

    if (name === "users")
    {
        return (
            <svg {... common}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 21v-2a4 4 0 0 0-3-3.87" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        );
    }

    if (name === "nav_access")
    {
        return (
            <svg className={cn ("admin-sidebar-icon me-3 h-5 w-5 shrink-0", className)} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" aria-hidden="true">
                <path d="M9 12.75 11.25 15 15 9.75m-3-7.036A11.959 11.959 0 0 1 3.598 6 11.99 11.99 0 0 0 3 9.749c0 5.592 3.824 10.29 9 11.623 5.176-1.332 9-6.03 9-11.622 0-1.31-.21-2.571-.598-3.751h-.152c-3.196 0-6.1-1.248-8.25-3.285Z" />
            </svg>
        );
    }

    if (name === "roles")
    {
        return (
            <svg {... common}>
                <path d="M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2" />
                <circle cx="9" cy="7" r="4" />
                <path d="M22 11v2a4 4 0 0 1-4 4h-1" />
                <path d="M16 3.13a4 4 0 0 1 0 7.75" />
            </svg>
        );
    }

    if (name === "permissions")
    {
        return (
            <svg {... common}>
                <path d="M16.5 10.5V6.75a4.5 4.5 0 1 0-9 0v3.75" />
                <path d="M6.75 10.5h10.5a2.25 2.25 0 0 1 2.25 2.25v6.75a2.25 2.25 0 0 1-2.25 2.25H6.75a2.25 2.25 0 0 1-2.25-2.25v-6.75a2.25 2.25 0 0 1 2.25-2.25Z" />
                <circle cx="12" cy="15" r="1.25" />
            </svg>
        );
    }

    if (name === "nav_log")
    {
        return (
            <svg className={cn ("admin-sidebar-icon me-3 h-5 w-5 shrink-0", className)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm1-12a1 1 0 10-2 0v4a1 1 0 00.293.707l2.828 2.829a1 1 0 101.415-1.415L11 9.586V6z" clipRule="evenodd" />
            </svg>
        );
    }

    if (name === "activities")
    {
        return (
            <svg {... common}>
                <path d="M14 3v4a1 1 0 0 0 1 1h4" />
                <path d="M17 21H7a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h7l5 5v11a2 2 0 0 1-2 2z" />
                <path d="M9 9h6" />
                <path d="M9 13h6" />
                <path d="M9 17h4" />
            </svg>
        );
    }

    return (
        <svg className={cn (box, className)} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
            <path fillRule="evenodd" d="M11.49 3.17c-.38-1.56-2.6-1.56-2.98 0a1.532 1.532 0 01-2.286.948c-1.372-.836-2.942.734-2.106 2.106.54.886.061 2.042-.947 2.287-1.561.379-1.561 2.6 0 2.978a1.532 1.532 0 01.947 2.287c-.836 1.372.734 2.942 2.106 2.106a1.532 1.532 0 012.287.947c.379 1.561 2.6 1.561 2.978 0a1.533 1.533 0 012.287-.947c1.372.836 2.942-.734 2.106-2.106a1.533 1.533 0 01.947-2.287c1.561-.379 1.561-2.6 0-2.978a1.532 1.532 0 01-.947-2.287c.836-1.372-.734-2.942-2.106-2.106a1.532 1.532 0 01-2.287-.947zM10 13a3 3 0 100-6 3 3 0 000 6z" clipRule="evenodd" />
        </svg>
    );
};

export default AdminSidebarIcon;
