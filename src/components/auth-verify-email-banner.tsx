import { ReactElement, useState, } from "react";
import { useSession, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import AlertError from "@/components/alert-error";
import AlertSuccess from "@/components/alert-success";
import { Alert, } from "@/components/ui/alert";
import { Button, } from "@/components/ui/button";
import { Spinner, } from "@/components/ui/spinner";

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
            <Alert className="mb-0 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <p className="text-sm text-muted-foreground">
                    {t ("email_not_verified_message")}
                </p>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0"
                    disabled={processing}
                    onClick={(): void => { void resend (); }}
                >
                    {processing && <Spinner />}
                    {processing ? t ("resending_verification_email") : t ("resend_verification_email")}
                </Button>
            </Alert>

            <AlertSuccess message={successMessage || undefined} />
            <AlertError message={errorMessage || undefined} />
        </div>
    );
};

export default AuthVerifyEmailBanner;
