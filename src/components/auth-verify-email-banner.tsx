import { ReactElement, useState, } from "react";
import { useSession, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import FbButton from "@/components/flowbite/fb-button";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { fbMuted, fbSurfacePanel, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

const AuthVerifyEmailBanner = (): ReactElement | null =>
{
    const { data: session, } = useSession ();
    const { t, } = useTranslation ("auth");
    const [ processing, setProcessing, ] = useState (false);
    const [ successMessage, setSuccessMessage, ] = useState ("");
    const [ errorMessage, setErrorMessage, ] = useState ("");

    const user = (session as any)?.user as { email_verified_at?: string | null; } | undefined;
    const isUnverified = Boolean (user && ! user.email_verified_at);

    if (! isUnverified)
    {
        return null;
    }

    const resend = async (): Promise<void> =>
    {
        setProcessing (true);
        setSuccessMessage ("");
        setErrorMessage ("");

        try
        {
            const response = await fetch ("/api/auth/verification-notification", {
                method: "POST",
            });
            const payload = await response.json ();

            if (! response.ok)
            {
                setErrorMessage (t ("something_went_wrong"));
                return;
            }

            setSuccessMessage (payload.message || t ("verification-sent"));
        }
        catch
        {
            setErrorMessage (t ("something_went_wrong"));
        }
        finally
        {
            setProcessing (false);
        }
    };

    return (
        <div className="space-y-3">
            <div
                className={cn (
                    fbSurfacePanel,
                    "mb-0 flex flex-col gap-3 p-4 sm:flex-row sm:items-center sm:justify-between"
                )}
            >
                <p className={fbMuted}>
                    {t ("email_not_verified_message")}
                </p>

                <FbButton
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    disabled={processing}
                    onClick={(): void => { void resend (); }}
                >
                    {processing && <FbSpinner className="h-4 w-4" />}
                    {processing ? t ("resending_verification_email") : t ("resend_verification_email")}
                </FbButton>
            </div>

            <AlertSuccess message={successMessage || undefined} />
            <AlertError message={errorMessage || undefined} />
        </div>
    );
};

export default AuthVerifyEmailBanner;
