import { ReactElement, useState, } from "react";
import { useTranslation, } from "next-i18next/pages";

import AppLogoIcon from "@/components/app-logo-icon";
import { publicRuntimeConfig, } from "@/libs/runtime-config";
import { usePwaInstall, } from "@/hooks/use-pwa-install";

const PwaInstallBanner = (): ReactElement | null =>
{
    const { t, } = useTranslation ("common");
    const { visible, isInstalling, dismiss, install, } = usePwaInstall ();
    const [feedbackKey, setFeedbackKey] = useState<string | null>(null);

    if (! visible)
    {
        return null;
    }

    const appLabel =
        publicRuntimeConfig.appName.charAt (0).toUpperCase () +
        publicRuntimeConfig.appName.slice (1);

    const handleInstall = async (): Promise<void> =>
    {
        const messageKey = await install ();

        setFeedbackKey (messageKey);
    };

    return (
        <div
            className="pwa-install fixed bottom-4 right-4 z-[100] max-w-[min(100vw-1.5rem,18rem)] rounded-2xl border border-border bg-background/95 p-2 shadow-lg backdrop-blur-md max-sm:bottom-3 max-sm:right-3"
            role="region"
            aria-label={t ("pwa_install")}
        >
            <div className="flex items-start gap-2">
                <div className="flex h-14 w-14 shrink-0 items-center justify-center overflow-hidden rounded-2xl bg-muted">
                    <AppLogoIcon className="size-9 fill-current text-foreground" aria-hidden />
                </div>

                <div className="min-w-0 flex-1 pt-0.5">
                    <p className="truncate text-xs font-semibold leading-tight">
                        {appLabel}
                    </p>
                    <p className="mt-0.5 text-[10px] leading-snug text-muted-foreground">
                        {feedbackKey ? t (feedbackKey) : t ("pwa_install_hint")}
                    </p>
                </div>

                <button
                    type="button"
                    className="inline-flex h-7 w-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
                    aria-label={t ("close")}
                    onClick={dismiss}
                >
                    <svg
                        className="h-3.5 w-3.5"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24"
                        stroke="currentColor"
                        aria-hidden
                    >
                        <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="M6 18L18 6M6 6l12 12"
                        />
                    </svg>
                </button>
            </div>

            <button
                type="button"
                className="mt-2 flex w-full items-center justify-center gap-1.5 rounded-xl bg-primary px-3 py-2 text-xs font-semibold text-primary-foreground disabled:cursor-not-allowed disabled:opacity-60"
                disabled={isInstalling}
                onClick={() => void handleInstall ()}
            >
                <svg
                    className="h-4 w-4 shrink-0"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    stroke="currentColor"
                    aria-hidden
                >
                    <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        strokeWidth="2"
                        d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5m0 0l5-5m-5 5V4"
                    />
                </svg>
                <span>{isInstalling ? t ("pwa_installing") : t ("pwa_install")}</span>
            </button>
        </div>
    );
};

export default PwaInstallBanner;
