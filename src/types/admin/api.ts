export interface PaginatedResponse<T> {
    data: T[];
    meta?: PaginatedMeta;
}

export type OffsetPaginationResponse<T> = {
    totalPage: number;
    perPage: number;
    currentPage: number;
    nextPage: number | null;
    previousPage: number | null;
    firstPage: number;
    lastPage: number;
    data: T[];
};

export type PaginatedMeta = {
    current_page?: number;
    first_page_url?: string;
    from?: number;
    last_page?: number;
    last_page_url?: string;
    next_page_url?: string | null;
    path?: string;
    per_page?: number;
    prev_page_url?: string | null;
    to?: number;
    total?: number;
};
