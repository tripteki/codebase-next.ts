import { ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import { Button, } from "@/components/ui/button";
import { useWebPush, } from "@/hooks/use-web-push";

interface WebPushEnableBannerProps {
    topClass?: string;
}

const WebPushEnableBanner = ({
    topClass = "top-16",
}: WebPushEnableBannerProps): ReactElement | null => {
    const { t, } = useTranslation ("common");
    const { showBanner, isSubscribing, dismissBanner, requestPermission, } =
        useWebPush ();

    if (! showBanner) {
        return null;
    }

    return (
        <div
            className={`fixed left-4 right-4 z-40 sm:left-auto sm:right-6 sm:max-w-md ${topClass}`}
            role="region"
            aria-label={t ("webpush_enable_title")}
        >
            <div className="flex flex-wrap items-center justify-between gap-3 rounded-xl border border-amber-200/80 bg-amber-50/95 px-4 py-3 text-sm text-amber-950 shadow-sm dark:border-amber-500/30 dark:bg-amber-950/40 dark:text-amber-50">
                <div className="min-w-0 flex-1">
                    <p className="font-semibold">{t ("webpush_enable_title")}</p>
                    <p className="mt-0.5 text-xs opacity-90">{t ("webpush_enable_hint")}</p>
                </div>

                <div className="flex shrink-0 items-center gap-2">
                    <Button
                        type="button"
                        size="sm"
                        disabled={isSubscribing}
                        onClick={() => void requestPermission ()}
                    >
                        {t ("webpush_enable_button")}
                    </Button>

                    <button
                        type="button"
                        className="rounded-lg px-2 py-1 text-xs opacity-70 hover:opacity-100"
                        aria-label={t ("close")}
                        onClick={dismissBanner}
                    >
                        {t ("close")}
                    </button>
                </div>
            </div>
        </div>
    );
};

export default WebPushEnableBanner;
