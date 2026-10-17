import { type ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import FbSkeleton from "@/components/flowbite/fb-skeleton";
import { fbCard, } from "@/libs/flowbite-classes";

const AdminDetailSkeleton = ({
    fields = 6,
}: {
    fields?: number;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");
    const rows = Array.from ({ length: fields, }, (_, index) => index + 1);

    return (
        <div className={fbCard} role="status" aria-busy="true" aria-live="polite">
            <span className="sr-only">{t ("loading")}</span>
            <dl className="grid gap-4 sm:grid-cols-2">
                {rows.map ((index) => (
                    <div key={index} className="space-y-2">
                        <FbSkeleton className="h-3 w-20" />
                        <FbSkeleton className="h-5 w-32 max-w-full" />
                    </div>
                ))}
            </dl>
        </div>
    );
};

export default AdminDetailSkeleton;
