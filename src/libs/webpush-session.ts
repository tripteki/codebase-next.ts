import { authorizationHeader, } from "@/libs/access-token";

export async function unsubscribeWebPush (accessToken?: string | null): Promise<void> {
    if (! accessToken || typeof window === "undefined" || ! ("serviceWorker" in navigator)) {
        return;
    }

    try {
        const registration = await navigator.serviceWorker.ready;
        const subscription = await registration.pushManager.getSubscription ();

        if (! subscription) {
            return;
        }

        await fetch ("/api/webpush/unsubscribe", {
            method: "POST",
            headers: {
                Authorization: authorizationHeader (accessToken),
                "Content-Type": "application/json",
            },
            body: JSON.stringify (subscription.toJSON ()),
        });

        await subscription.unsubscribe ();
    } catch {
        //
    }
}
