import { NextApiRequest, NextApiResponse, } from "next";
import { getServerSession, } from "next-auth/next";

import { publicRuntimeConfig, } from "@/libs/runtime-config";
import { callServer, } from "@/libs/call-server";
import { getServerTranslation, getLocaleFromRequest, } from "@/libs/i18n/server";
import { authOptions, } from "./[...nextauth]";


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
    const session = await getServerSession (req, res, authOptions);
    const accessToken = (session as any)?.accessToken as string | undefined;

    if (! accessToken)
    {
        res.status (401).json ({
            success: false,
            errors: { general: t ("authentication_failed"), },
        });
        return;
    }

    const response = await callServer ({
        baseUrl: publicRuntimeConfig.authURL,
        url: "/email/verification-notification",
        method: "POST",
    }, accessToken);

    if (response.isError)
    {
        const axiosError = response.error as any;
        const status = axiosError?.response?.status || 500;

        res.status (status).json ({
            success: false,
            errors: { general: t ("something_went_wrong"), },
        });
        return;
    }

    res.status (200).json ({
        success: true,
        message: typeof response.data === "string"
            ? response.data
            : t ("verification-sent"),
    });
};

export default handler;
