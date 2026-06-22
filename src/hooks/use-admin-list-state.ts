import { useState, type Dispatch, type SetStateAction, } from "react";

import type { CallResult, } from "@/libs/call";
import type {
    OffsetPaginationResponse,
    PaginatedMeta,
    PaginatedResponse,
} from "@/types/admin/api";

export function useAdminListState<T> () {
    const [items, setItems] = useState<T[]>([]);
    const [meta, setMeta] = useState<PaginatedMeta | undefined>(undefined);
    const [isLoading, setIsLoading] = useState (false);
    const [actionId, setActionId] = useState<string | null>(null);

    return {
        items,
        setItems,
        meta,
        setMeta,
        isLoading,
        setIsLoading,
        actionId,
        setActionId,
    };
}

export function parsePaginatedResult<T> (
    result: CallResult
): { items: T[]; meta: PaginatedMeta | undefined } | null
{
    if (! result.isSuccess || ! result.data)
    {
        return null;
    }

    const payload = result.data as PaginatedResponse<T> & OffsetPaginationResponse<T>;

    if (payload.meta)
    {
        return {
            items: Array.isArray (payload.data) ? payload.data : [],
            meta: payload.meta,
        };
    }

    if ("totalPage" in payload || "lastPage" in payload)
    {
        return {
            items: Array.isArray (payload.data) ? payload.data : [],
            meta: {
                current_page: payload.currentPage,
                last_page: payload.lastPage ?? payload.totalPage,
                per_page: payload.perPage,
            },
        };
    }

    return {
        items: [],
        meta: undefined,
    };
}

export function applyPaginatedResult<T> (
    result: CallResult,
    setItems: Dispatch<SetStateAction<T[]>>,
    setMeta: Dispatch<SetStateAction<PaginatedMeta | undefined>>
): void
{
    const parsed = parsePaginatedResult<T> (result);

    if (! parsed)
    {
        return;
    }

    setItems (parsed.items);
    setMeta (parsed.meta);
}
