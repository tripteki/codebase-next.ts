import { type ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import FbButton from "@/components/flowbite/fb-button";
import FbSpinner from "@/components/flowbite/fb-spinner";

const AdminFormActions = ({
    cancelTo,
    submitLabel,
    processing = false,
}: {
    cancelTo: string;
    submitLabel: string;
    processing?: boolean;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <div className="flex flex-wrap justify-end gap-2 border-t border-gray-200 pt-4 dark:border-gray-700">
            <FbButton variant="outline" type="button" href={cancelTo} disabled={processing}>
                {t ("cancel")}
            </FbButton>
            <FbButton type="submit" className="gap-2" disabled={processing}>
                {processing ? <FbSpinner className="h-4 w-4" /> : null}
                {submitLabel}
            </FbButton>
        </div>
    );
};

export default AdminFormActions;
