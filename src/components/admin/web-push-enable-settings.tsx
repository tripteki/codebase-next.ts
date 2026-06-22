import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { Button, } from "@/components/ui/button";
import { Spinner, } from "@/components/ui/spinner";
import { useWebPush, } from "@/hooks/use-web-push";

const WebPushEnableSettings = (): ReactElement | null => {
    const { t, } = useTranslation ("common");
    const {
        isConfigured,
        isSupported,
        permission,
        isSubscribing,
        requestPermission,
        syncSubscription,
    } = useWebPush ();

    if (! isConfigured || ! isSupported) {
        return null;
    }

    const statusLabel =
        permission === "granted"
            ? t ("webpush_status_granted")
            : permission === "denied"
              ? t ("webpush_status_denied")
              : t ("webpush_status_default");

    return (
        <section className="space-y-3 rounded-lg border p-4">
            <div>
                <h3 className="text-lg font-semibold">{t ("webpush_settings_title")}</h3>
                <p className="mt-1 text-sm text-muted-foreground">
                    {t ("webpush_settings_description")}
                </p>
            </div>

            <p className="text-sm font-medium">{statusLabel}</p>

            <div className="flex flex-wrap gap-2">
                {permission !== "granted" && permission !== "denied" && (
                    <Button
                        type="button"
                        disabled={isSubscribing}
                        onClick={() => void requestPermission ()}
                    >
                        {isSubscribing && <Spinner />}
                        {t ("webpush_enable_button")}
                    </Button>
                )}

                {permission === "granted" && (
                    <Button
                        type="button"
                        variant="outline"
                        disabled={isSubscribing}
                        onClick={() => void syncSubscription ()}
                    >
                        {isSubscribing && <Spinner />}
                        {t ("webpush_sync_button")}
                    </Button>
                )}
            </div>

            {permission === "denied" && (
                <p className="text-xs text-muted-foreground">
                    {t ("webpush_status_denied_hint")}
                </p>
            )}
        </section>
    );
};

export default WebPushEnableSettings;
