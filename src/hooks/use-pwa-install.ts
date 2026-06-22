import { useCallback, useEffect, useMemo, useRef, useState, } from "react";

import {
    clearPwaInstallPrompt,
    getPwaInstallPrompt,
    isAndroidDevice,
    isChromiumInstallBrowser,
    isIosDevice,
    isServiceWorkerReady,
    isStandaloneDisplay,
    requestPwaInstall,
    supportsPwaInstallUi,
    waitForPwaInstallPrompt,
} from "@/libs/pwa-install";

const DISMISS_KEY = "pwa-install-dismissed";
const SW_POLL_INTERVAL_MS = 500;
const SW_POLL_MAX_ATTEMPTS = 6;

function wasDismissed (): boolean {
    try {
        return (
            window.localStorage.getItem (DISMISS_KEY) === "true" ||
            window.localStorage.getItem (DISMISS_KEY) === "1"
        );
    } catch {
        return false;
    }
}

export function usePwaInstall () {
    const [isClientReady, setIsClientReady] = useState (false);
    const [isInstalling, setIsInstalling] = useState (false);
    const [serviceWorkerReady, setServiceWorkerReady] = useState (false);
    const [fallbackVisible, setFallbackVisible] = useState (false);
    const pollAttemptsRef = useRef (0);

    const visible = useMemo (
        () =>
            isClientReady &&
            (serviceWorkerReady || fallbackVisible) &&
            supportsPwaInstallUi () &&
            ! isStandaloneDisplay () &&
            ! wasDismissed (),
        [fallbackVisible, isClientReady, serviceWorkerReady]
    );

    const dismiss = useCallback ((): void => {
        clearPwaInstallPrompt ();

        try {
            window.localStorage.setItem (DISMISS_KEY, "true");
        } catch {
            //
        }
    }, []);

    const getManualInstallMessage = useCallback ((): string => {
        if (isIosDevice ()) {
            return "pwa_install_manual_ios";
        }

        if (isAndroidDevice ()) {
            return "pwa_install_manual_android";
        }

        return "pwa_install_manual_chrome";
    }, []);

    const install = useCallback (async (): Promise<string | null> => {
        if (isInstalling) {
            return null;
        }

        setIsInstalling (true);

        try {
            if (! getPwaInstallPrompt ()) {
                await waitForPwaInstallPrompt (2_000);
            }

            if (getPwaInstallPrompt ()) {
                const outcome = await requestPwaInstall ();

                if (outcome === "dismissed") {
                    return "pwa_install_dismissed";
                }

                return null;
            }

            return getManualInstallMessage ();
        } catch (error) {
            console.error ("PWA install failed:", error);

            if (isChromiumInstallBrowser ()) {
                return getManualInstallMessage ();
            }

            return "pwa_install_failed";
        } finally {
            setIsInstalling (false);
        }
    }, [getManualInstallMessage, isInstalling]);

    useEffect (() => {
        setIsClientReady (true);

        let pollId: ReturnType<typeof setInterval> | undefined;
        const markReady = (): void => {
            setServiceWorkerReady (true);

            if (pollId !== undefined) {
                clearInterval (pollId);
            }
        };

        const refresh = (): void => {
            pollAttemptsRef.current += 1;

            if (pollAttemptsRef.current > SW_POLL_MAX_ATTEMPTS) {
                if (pollId !== undefined) {
                    clearInterval (pollId);
                }

                return;
            }

            void isServiceWorkerReady ().then ((ready) => {
                if (ready) {
                    markReady ();
                }
            });
        };

        refresh ();
        pollId = setInterval (refresh, SW_POLL_INTERVAL_MS);

        const fallbackTimerId = setTimeout (() => {
            setFallbackVisible (true);

            if (pollId !== undefined) {
                clearInterval (pollId);
            }
        }, 3_000);

        return () => {
            if (pollId !== undefined) {
                clearInterval (pollId);
            }

            clearTimeout (fallbackTimerId);
        };
    }, []);

    return {
        visible,
        isInstalling,
        dismiss,
        install,
    };
}
