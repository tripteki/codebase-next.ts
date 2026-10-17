import { type ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import FbSkeleton from "@/components/flowbite/fb-skeleton";
import { fbCard, } from "@/libs/flowbite-classes";

const AdminFormSkeleton = ({
    fields = 5,
    showActions = true,
}: {
    fields?: number;
    showActions?: boolean;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");
    const rows = Array.from ({ length: fields, }, (_, index) => index + 1);

    return (
        <div className={fbCard} role="status" aria-busy="true" aria-live="polite">
            <span className="sr-only">{t ("loading")}</span>
            <div className="space-y-4">
                {rows.map ((index) => (
                    <div key={index} className="space-y-2">
                        <FbSkeleton className="h-4 w-24" />
                        <FbSkeleton className="h-10 w-full rounded-lg" />
                    </div>
                ))}
                {showActions ? (
                    <div className="flex justify-end gap-2 border-t border-gray-100 pt-4 dark:border-gray-700">
                        <FbSkeleton className="h-10 w-24 rounded-lg" />
                        <FbSkeleton className="h-10 w-24 rounded-lg" />
                    </div>
                ) : null}
            </div>
        </div>
    );
};

export default AdminFormSkeleton;
