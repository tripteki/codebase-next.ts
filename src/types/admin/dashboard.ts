export type DashboardPeriod = {
    key: string;
    date_from?: string | null;
    date_to?: string | null;
};

export type DashboardUsers = {
    total: number;
    active: number;
    deactivated: number;
    unverified: number;
    new_in_period: number;
    by_role: Record<string, number>;
};

export type DashboardActivityBrief = {
    id: string;
    description: string;
    event?: string | null;
    subject_type?: string | null;
    created_at?: string | null;
};

export type DashboardNotificationBrief = {
    id: string;
    type: string;
    title?: string | null;
    body?: string | null;
    url?: string | null;
    created_at?: string | null;
    read_at?: string | null;
};

export type AdminDashboard = {
    role: string;
    period: DashboardPeriod;
    users?: DashboardUsers | null;
    recent_activities?: DashboardActivityBrief[] | null;
    activities_scope: "all" | "own";
    recent_notifications: DashboardNotificationBrief[];
    unread_notifications: number;
    links: {
        users: string;
        activities: string;
        notifications: string;
    };
};
