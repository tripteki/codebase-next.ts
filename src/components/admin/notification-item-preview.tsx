import { ReactElement, } from "react";

import {
    notificationBody,
    notificationIsUnread,
    notificationTitle,
} from "@/libs/notification-presenter";
import { cn, } from "@/libs/utils";
import type { NotificationDto, } from "@/types/admin/notification";

interface NotificationItemPreviewProps {
    item: NotificationDto;
}

const NotificationItemPreview = ({
    item,
}: NotificationItemPreviewProps): ReactElement => {
    const isUnread = notificationIsUnread (item);
    const title = notificationTitle (item);
    const body = notificationBody (item);

    return (
        <div className="min-w-0 flex-1">
            <p
                className={cn (
                    "truncate text-sm",
                    isUnread ? "font-semibold" : "font-medium"
                )}
            >
                {title}
            </p>
            {body && (
                <p className="mt-0.5 line-clamp-2 text-xs text-muted-foreground">
                    {body}
                </p>
            )}
        </div>
    );
};

export default NotificationItemPreview;
