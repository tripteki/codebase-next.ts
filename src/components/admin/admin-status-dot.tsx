import { type ReactElement, type ReactNode, } from "react";

const toneClass = {
    active: "bg-emerald-500",
    pending: "bg-amber-400",
    danger: "bg-red-500",
    muted: "bg-gray-400",
};

const AdminStatusDot = ({
    tone,
    className,
    children,
}: {
    tone: keyof typeof toneClass;
    className?: string;
    children: ReactNode;
}): ReactElement =>
{
    return (
        <span className={`inline-flex items-center ${className ?? ""}`}>
            <span className={`me-2 h-2.5 w-2.5 shrink-0 rounded-full ${toneClass[tone]}`} />
            {children}
        </span>
    );
};

export default AdminStatusDot;
