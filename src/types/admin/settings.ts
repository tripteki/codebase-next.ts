export type UserProfileDto = {
    full_name?: string | null;
    avatar?: string | null;
    avatar_url?: string | null;
    interests?: string[] | null;
};

export type UserMeDto = {
    id: string;
    name: string;
    email: string;
    email_verified_at?: string | null;
    profile?: UserProfileDto | null;
};

export type PersonalSettingsPayload = {
    name: string;
    email: string;
    full_name?: string;
    interests: string[];
    password?: string;
    password_confirmation?: string;
};
