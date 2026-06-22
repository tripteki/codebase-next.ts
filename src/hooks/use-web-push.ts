import { useCallback, useEffect, useState, } from "react";
import { useSession, } from "next-auth/react";

import { publicRuntimeConfig, } from "@/libs/runtime-config";
import {
    isWebPushSupported,
    urlBase64ToUint8Array,
} from "@/libs/web-push";

const DISMISS_KEY = "webpush-enable-banner-dismissed";

export function useWebPush () {
    const { status, } = useSession ();
    const vapidPublicKey = publicRuntimeConfig.vapidPublicKey?.trim () ?? "";
    const [permission, setPermission] = useState<NotificationPermission>("default");
    const [isSubscribing, setIsSubscribing] = useState (false);
    const [bannerDismissed, setBannerDismissed] = useState (false);

    const isConfigured = vapidPublicKey.length > 0;
    const isSupported = isWebPushSupported (vapidPublicKey);
    const isAuthenticated = status === "authenticated";

    const showBanner =
        isConfigured &&
        isAuthenticated &&
        typeof window !== "undefined" &&
        isSupported &&
        permission === "default" &&
        ! bannerDismissed;

    const refreshPermission = useCallback ((): void => {
        if (typeof window === "undefined" || ! ("Notification" in window)) {
            return;
        }

        setPermission (Notification.permission);
    }, []);

    const dismissBanner = useCallback ((): void => {
        setBannerDismissed (true);

        try {
            window.localStorage.setItem (DISMISS_KEY, "1");
        } catch {
            //
        }
    }, []);

    const syncSubscription = useCallback (async (): Promise<void> => {
        if (! isSupported || ! vapidPublicKey || ! ("serviceWorker" in navigator)) {
            return;
        }

        if (Notification.permission !== "granted") {
            return;
        }

        const registration = await navigator.serviceWorker.ready;
        let subscription = await registration.pushManager.getSubscription ();

        if (! subscription) {
            subscription = await registration.pushManager.subscribe ({
                userVisibleOnly: true,
                applicationServerKey: urlBase64ToUint8Array (
                    vapidPublicKey
                ) as BufferSource,
            });
        }

        const session = await (await import ("next-auth/react")).getSession ();

        await fetch ("/api/webpush/subscribe", {
            method: "POST",
            headers: {
                Authorization: `Bearer ${session?.jwt ?? session?.accessToken ?? ""}`,
                "Content-Type": "application/json",
            },
            body: JSON.stringify (subscription.toJSON ()),
        });
    }, [isSupported, vapidPublicKey]);

    const requestPermission = useCallback (async (): Promise<void> => {
        if (! isSupported || ! vapidPublicKey) {
            return;
        }

        setIsSubscribing (true);

        try {
            if (! ("serviceWorker" in navigator)) {
                throw new Error ("Service Worker not supported.");
            }

            await navigator.serviceWorker.ready;

            if (Notification.permission === "denied") {
                throw new Error ("Permission denied.");
            }

            if (Notification.permission !== "granted") {
                const permissionResult = await Notification.requestPermission ();

                if (permissionResult !== "granted") {
                    throw new Error ("Permission not granted.");
                }
            }

            await syncSubscription ();
            refreshPermission ();
        } finally {
            setIsSubscribing (false);
        }
    }, [isSupported, vapidPublicKey, refreshPermission, syncSubscription]);

    useEffect (() => {
        try {
            setBannerDismissed (window.localStorage.getItem (DISMISS_KEY) === "1");
        } catch {
            setBannerDismissed (false);
        }

        refreshPermission ();
    }, [refreshPermission]);

    useEffect (() => {
        if (status === "authenticated" && isSupported && vapidPublicKey) {
            void syncSubscription ().catch (() => {
                //
            });
        }
    }, [status, isSupported, vapidPublicKey, syncSubscription]);

    return {
        isConfigured,
        isSupported,
        permission,
        showBanner,
        isSubscribing,
        dismissBanner,
        requestPermission,
        syncSubscription,
        refreshPermission,
    };
}
