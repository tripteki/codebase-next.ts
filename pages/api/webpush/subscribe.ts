import type { NextApiRequest, NextApiResponse, } from "next";
import { getToken, } from "next-auth/jwt";

import { callServer, } from "@/libs/call-server";
import { publicRuntimeConfig, serverRuntimeConfig, } from "@/libs/runtime-config";

export default async function handler (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> {
    if (req.method !== "POST") {
        res.status (405).json ({ errors: { general: "Method not allowed", }, });

        return;
    }

    const token = await getToken ({
        req,
        secret: serverRuntimeConfig.secret,
    });

    const accessToken = (token as any)?.jwt ?? (token as any)?.accessToken;

    if (! accessToken) {
        res.status (401).json ({ errors: { general: "Unauthenticated", }, });

        return;
    }

    const response = await callServer (
        {
            baseUrl: publicRuntimeConfig.baseURL,
            url: "/v1/webpush/subscribe",
            method: "POST",
            data: req.body,
        },
        accessToken as string
    );

    if (response.isError) {
        const status = (response.error as any)?.response?.status ?? 500;
        res.status (status).json ({ errors: { general: "Something went wrong", }, });

        return;
    }

    res.status (200).json (response.data ?? { success: true, });
}
