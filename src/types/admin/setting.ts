export type AdminSetting = {
    id: string;
    key: string;
    value: string | null;
    value_kind: "text" | "file";
    value_url: string | null;
    created_at: string;
    updated_at: string;
};

export type AdminSettingDraft = {
    id: string;
    key: string;
    value: string;
    value_kind: "text" | "file";
    value_url: string | null;
    file: File | null;
    remove: boolean;
};

export type AdminSettingRowPayload = {
    id?: string;
    key: string;
    value: string;
    value_kind: "text" | "file";
};
