export interface NotificationDto {
    id: string;
    user_id: string;
    type: string;
    data: Record<string, unknown>;
    read_at: string | null;
    created_at: string | null;
    updated_at: string | null;
    deleted_at?: string | null;
    user?: {
        id: string;
        name: string;
        email: string;
    } | null;
}

export interface NotificationUnreadDto {
    unread: number;
}

export type { PaginatedMeta, PaginatedResponse, } from "./api";
