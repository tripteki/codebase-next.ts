import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import FbButton from "@/components/flowbite/fb-button";
import FbSpinner from "@/components/flowbite/fb-spinner";
import { fbMuted, fbSurfacePanel, } from "@/libs/flowbite-classes";
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
        <section className={`${fbSurfacePanel} space-y-3 p-4`}>
            <div>
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                    {t ("webpush_settings_title")}
                </h3>
                <p className={`mt-1 ${fbMuted}`}>
                    {t ("webpush_settings_description")}
                </p>
            </div>

            <p className="text-sm font-medium text-gray-900 dark:text-white">{statusLabel}</p>

            <div className="flex flex-wrap gap-2">
                {permission !== "granted" && permission !== "denied" && (
                    <FbButton
                        type="button"
                        disabled={isSubscribing}
                        onClick={() => void requestPermission ()}
                    >
                        {isSubscribing && <FbSpinner />}
                        {t ("webpush_enable_button")}
                    </FbButton>
                )}

                {permission === "granted" && (
                    <FbButton
                        type="button"
                        variant="outline"
                        disabled={isSubscribing}
                        onClick={() => void syncSubscription ()}
                    >
                        {isSubscribing && <FbSpinner />}
                        {t ("webpush_sync_button")}
                    </FbButton>
                )}
            </div>

            {permission === "denied" && (
                <p className="text-xs text-gray-500 dark:text-gray-400">
                    {t ("webpush_status_denied_hint")}
                </p>
            )}
        </section>
    );
};

export default WebPushEnableSettings;
