import { ReactElement, } from "react";
import Link from "next/link";

import NotificationIcon from "@/components/admin/notification-icon";
import { useLocale, } from "@/hooks/i18n";
import { formatStamp, } from "@/libs/format-display";
import { formatRelativeTime, } from "@/libs/format-relative-time";
import {
    notificationBody,
    notificationIconName,
    notificationIsUnread,
    notificationTargetIsFile,
    notificationTargetUrl,
    notificationTheme,
    notificationTitle,
} from "@/libs/notification-presenter";
import { cn, } from "@/libs/utils";
import type { NotificationDto, } from "@/types/admin/notification";
import { useTranslation, } from "next-i18next/pages";

const NotificationItemPreview = ({
    item,
    compact = true,
}: {
    item: NotificationDto;
    compact?: boolean;
}): ReactElement => {
    const { t, } = useTranslation ("common");
    const { currentLocale, } = useLocale ();
    const targetUrl = notificationTargetUrl (item);
    const targetIsFile = notificationTargetIsFile (item);
    const stamp = formatStamp (item.created_at);
    const isUnread = notificationIsUnread (item);
    const title = notificationTitle (item);
    const body = notificationBody (item);
    const relativeTime = formatRelativeTime (item.created_at, currentLocale);

    return (
        <div className="flex min-w-0 flex-1 items-start gap-3">
            <NotificationIcon
                name={notificationIconName (item)}
                isRead={! isUnread}
                theme={notificationTheme (item)}
                size={compact ? "sm" : "lg"}
            />
            <div className="min-w-0 flex-1 overflow-hidden">
                <p
                    className={cn (
                        "truncate text-sm text-gray-900 dark:text-white",
                        compact ? "font-medium" : "font-semibold",
                        isUnread && "font-semibold"
                    )}
                >
                    {title}
                </p>
                {body ? (
                    <p className={cn ("mt-0.5 text-gray-500 dark:text-gray-400", compact ? "line-clamp-2 text-xs" : "break-words text-sm")}>
                        {body}
                    </p>
                ) : null}
                {! compact && targetUrl ? (
                    <Link
                        href={targetUrl}
                        target="_blank"
                        rel="noopener"
                        className="mt-2 inline-flex items-center gap-1 text-sm font-medium text-[var(--brand-primary)] hover:underline"
                        onClick={(event) => event.stopPropagation ()}
                    >
                        {targetIsFile ? (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 16v2a2 2 0 002 2h12a2 2 0 002-2v-2M7 10l5 5 5-5M12 15V3" />
                            </svg>
                        ) : (
                            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                            </svg>
                        )}
                        {targetIsFile ? t ("download") : t ("visit")}
                    </Link>
                ) : null}
                {relativeTime || (! compact && stamp !== "-") ? (
                    <p className={cn ("mt-1 text-xs text-gray-500 dark:text-gray-400", ! compact && "text-gray-400 dark:text-gray-500")}>
                        {compact ? relativeTime : `${stamp}${relativeTime ? ` (${relativeTime})` : ""}`}
                    </p>
                ) : null}
            </div>
        </div>
    );
};

export default NotificationItemPreview;
