import { call, type CallResult, } from "@/libs/call";

type AdminCallDetail = {
    path: string;
    method?: "GET" | "DELETE" | "POST" | "PUT" | "PATCH";
    data?: Record<string, any> | FormData;
    params?: Record<string, any>;
};

export function adminApiPath (path: string): string
{
    const normalized = path.startsWith ("/") ? path : `/${path}`;

    return `/api/v1/admin${normalized}`;
}

export async function adminCall (detail: AdminCallDetail): Promise<CallResult>
{
    return call ({
        url: adminApiPath (detail.path),
        method: detail.method,
        data: detail.data,
        params: detail.params,
    });
}
