export type AdminSearchItem = {
    id: string;
    title: string;
    subtitle?: string | null;
    url: string;
};

export type AdminSearchGroup = {
    category: string;
    items: AdminSearchItem[];
};

export type AdminSearchResult = {
    results: AdminSearchGroup[];
};
