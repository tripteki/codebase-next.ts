import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next";

const FooterLayout = (): ReactElement =>
{
    const { t, } = useTranslation ("common");

    return (
        <footer className="border-t mt-auto">
            <div className="container mx-auto px-4 py-4">
                <p className="text-center text-sm text-muted-foreground">
                    © {new Date ().getFullYear ()} {t ("all_rights_reserved")}
                </p>
            </div>
        </footer>
    );
};

export default FooterLayout;
