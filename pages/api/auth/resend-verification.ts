import { NextApiRequest, NextApiResponse, } from "next";

import { callServer, } from "@/libs/call-server";
import { getLocaleFromRequest, getServerTranslation, } from "@/libs/i18n/server";
import { parseApiErrors, } from "@/libs/parse-api-errors";
import { publicRuntimeConfig, } from "@/libs/runtime-config";

const handler = async (
    req: NextApiRequest,
    res: NextApiResponse
): Promise<void> =>
{
    if (req.method !== "POST")
    {
        const locale = getLocaleFromRequest (req);
        const t = getServerTranslation (locale, "common");

        res.status (405).json ({ error: t ("method_not_allowed"), });

        return;
    }

    const locale = getLocaleFromRequest (req);
    const t = getServerTranslation (locale, "auth");
    const email = typeof req.body?.email === "string" ? req.body.email.trim () : "";

    if (! email)
    {
        res.status (422).json ({
            success: false,
            errors: { email: t ("authentication_failed"), },
        });

        return;
    }

    const response = await callServer ({
        baseUrl: publicRuntimeConfig.authURL,
        url: "/resend-verification",
        method: "POST",
        data: { email, },
    });

    if (response.isError)
    {
        const axiosError = response.error as { response?: { status?: number; data?: unknown; }; };
        const status = axiosError?.response?.status || 500;

        res.status (status).json ({
            success: false,
            errors: parseApiErrors (axiosError?.response?.data, t ("something_went_wrong")),
        });

        return;
    }

    res.status (200).json ({
        success: true,
        message: typeof response.data === "string" ? response.data : t ("verification-sent"),
    });
};

export default handler;
