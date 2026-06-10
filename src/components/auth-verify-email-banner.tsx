import { ReactElement, useState, } from "react";
import { useSession, } from "next-auth/react";
import { useTranslation, } from "next-i18next/pages";

import { Alert, AlertDescription, } from "@/components/ui/alert";
import { Button, } from "@/components/ui/button";
import { Spinner, } from "@/components/ui/spinner";

const AuthVerifyEmailBanner = (): ReactElement | null =>
{
    const { data: session, } = useSession ();
    const { t, } = useTranslation ("auth");
    const [ processing, setProcessing, ] = useState (false);
    const [ message, setMessage, ] = useState ("");

    const user = (session as any)?.user as { email_verified_at?: string | null; } | undefined;
    const isUnverified = Boolean (user && ! user.email_verified_at);

    if (! isUnverified)
    {
        return null;
    }

    const resend = async (): Promise<void> =>
    {
        setProcessing (true);
        setMessage ("");

        try
        {
            const response = await fetch ("/api/auth/verification-notification", {
                method: "POST",
            });
            const payload = await response.json ();

            if (! response.ok)
            {
                setMessage (t ("something_went_wrong"));
                return;
            }

            setMessage (payload.message || t ("verification-sent"));
        }
        catch
        {
            setMessage (t ("something_went_wrong"));
        }
        finally
        {
            setProcessing (false);
        }
    };

    return (
        <div className="space-y-3">
            <Alert className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
                <AlertDescription>
                    {t ("email_not_verified_message")}
                </AlertDescription>

                <Button
                    type="button"
                    variant="outline"
                    size="sm"
                    className="shrink-0 gap-2"
                    disabled={processing}
                    onClick={(): void => { void resend (); }}
                >
                    {processing && <Spinner className="h-4 w-4" />}
                    {processing ? t ("resending_verification_email") : t ("resend_verification_email")}
                </Button>
            </Alert>

            {message && (
                <p className="text-sm font-medium text-green-600">
                    {message}
                </p>
            )}
        </div>
    );
};

export default AuthVerifyEmailBanner;
