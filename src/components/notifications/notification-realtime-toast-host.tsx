import { ReactElement, useEffect, useState, } from "react";

type RealtimeDetail = {
    body: string;
    type: string;
};

const NotificationRealtimeToastHost = (): ReactElement | null => {
    const [toast, setToast] = useState<RealtimeDetail | null>(null);

    useEffect (() => {
        const handler = (event: Event): void => {
            const detail = (event as CustomEvent<RealtimeDetail>).detail;

            if (! detail?.body) {
                return;
            }

            setToast (detail);
            window.setTimeout (() => setToast (null), 5000);
        };

        window.addEventListener ("notification:realtime", handler);

        return () => window.removeEventListener ("notification:realtime", handler);
    }, []);

    if (! toast) {
        return null;
    }

    const isError = toast.type.includes ("failed");

    return (
        <div
            className={`fixed left-1/2 top-4 z-50 max-w-md -translate-x-1/2 rounded-lg border px-4 py-3 text-sm shadow-lg ${
                isError
                    ? "border-destructive/30 bg-destructive/10 text-destructive"
                    : "border-success/30 bg-success-muted text-success-foreground"
            }`}
            role="status"
        >
            {toast.body}
        </div>
    );
};

export default NotificationRealtimeToastHost;
