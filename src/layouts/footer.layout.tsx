import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { fbMuted, } from "@/libs/flowbite-classes";

const FooterLayout = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <footer className="mt-auto border-t border-gray-200 bg-gray-100 px-4 py-2 dark:border-gray-800 dark:bg-gray-900">
            <div className="py-2">
                <p className={`text-center ${fbMuted}`}>
                    © {new Date ().getFullYear ()} {t ("all_rights_reserved")}
                </p>
            </div>
        </footer>
    );
};

export default FooterLayout;
