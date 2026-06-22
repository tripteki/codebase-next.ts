import { describe, expect, it, } from "vitest";

import {
    appendAdminListFilter,
    buildAdminListParams,
} from "@/libs/admin-list-params";

describe ("admin-list-params", () =>
{
    it ("builds offset pagination query params", () =>
    {
        expect (buildAdminListParams ({
            limit: 10,
            current_page: 2,
            order: "-updated_at",
        })).toEqual ({
            limitPage: 10,
            currentPage: 2,
            orders: "updated_at:desc",
        });
    });

    it ("appends filters in unified format", () =>
    {
        const params = buildAdminListParams ({ limitPage: 10, currentPage: 1, });

        appendAdminListFilter (params, "status", "unread", [ "read", "unread", ]);

        expect (params).toEqual ({
            limitPage: 10,
            currentPage: 1,
            filters: "status:unread",
        });
    });
});
