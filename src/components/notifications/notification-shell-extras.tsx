import { ReactElement, useEffect, } from "react";
import { useSession, } from "next-auth/react";

import WebPushEnableBanner from "@/components/web-push-enable-banner";
import NotificationRealtimeToastHost from "@/components/notifications/notification-realtime-toast-host";
import { useNotificationBroadcast, } from "@/hooks/use-notification-broadcast";
import { useNotifications, } from "@/hooks/use-notifications";

interface NotificationShellExtrasProps {
    bannerTopClass?: string;
}

const NotificationShellExtras = ({
    bannerTopClass = "top-16",
}: NotificationShellExtrasProps): ReactElement => {
    const { status, } = useSession ();
    const { refresh, } = useNotifications ();
    useNotificationBroadcast ();

    useEffect ((): void =>
    {
        if (status !== "authenticated")
        {
            return;
        }

        void refresh ();
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [ status, ]);

    return (
        <>
            <WebPushEnableBanner topClass={bannerTopClass} />
            <NotificationRealtimeToastHost />
        </>
    );
};

export default NotificationShellExtras;
