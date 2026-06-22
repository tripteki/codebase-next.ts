import { NextApiRequest, NextApiResponse, } from "next";
import { getToken, } from "next-auth/jwt";

import { publicRuntimeConfig, serverRuntimeConfig, } from "@/libs/runtime-config";
import { callServer, } from "@/libs/call-server";
import { getServerTranslation, getLocaleFromRequest, } from "@/libs/i18n/server";
import { clearNextAuthSessionCookies, } from "@/libs/next-auth-cookies";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> => {
    if (req.method !== "POST") {
        const locale = getLocaleFromRequest (req);
        const t = getServerTranslation (locale, "common");
        res.status (405).json ({ error: t ("method_not_allowed"), });

        return;
    }

    const token = await getToken ({
        req,
        secret: serverRuntimeConfig.secret,
    });
    const accessToken = (token as any)?.accessToken ?? (token as any)?.jwt;

    if (accessToken) {
        await callServer ({
            baseUrl: publicRuntimeConfig.authURL,
            url: "/logout",
            method: "POST",
        }, accessToken);
    }

    clearNextAuthSessionCookies (req, res);
    res.status (200).json ({ success: true, });
};

export default handler;
