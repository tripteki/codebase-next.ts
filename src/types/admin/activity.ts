export type AdminActivityCauser = {
    id: string;
    full_name?: string | null;
    email: string;
};

export type AdminActivity = {
    id: string;
    log_name?: string | null;
    description: string;
    subject_type?: string | null;
    subject_type_label?: string | null;
    subject_id?: string | null;
    event?: string | null;
    causer_id?: string | null;
    properties?: Record<string, unknown> | null;
    created_at: string | null;
    updated_at: string | null;
    causer?: AdminActivityCauser | null;
};

export const ACTIVITY_SUBJECT_TYPES = [
    "User",
    "Role",
    "Permission",
    "Setting",
] as const;
