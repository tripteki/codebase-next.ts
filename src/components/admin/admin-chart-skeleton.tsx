import { type ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import FbSkeleton from "@/components/flowbite/fb-skeleton";
import { fbCard, } from "@/libs/flowbite-classes";

const AdminChartSkeleton = ({
    height = 280,
    embedded = false,
}: {
    height?: number;
    embedded?: boolean;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <div className={embedded ? undefined : fbCard} role="status" aria-busy="true" aria-live="polite">
            <span className="sr-only">{t ("loading")}</span>
            {embedded ? null : (
                <div className="mb-4 space-y-2">
                    <FbSkeleton className="h-5 w-40" />
                    <FbSkeleton className="h-4 w-56 max-w-full" />
                </div>
            )}
            <FbSkeleton className="w-full rounded-lg" style={{ height: `${height}px`, }} />
        </div>
    );
};

export default AdminChartSkeleton;
