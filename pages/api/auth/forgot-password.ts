import { NextApiRequest, NextApiResponse, } from "next";

import { getServerTranslation, getLocaleFromRequest, } from "@/libs/i18n/server";
import { callServer, } from "@/libs/call-server";
import getConfig from "next/config";

const { publicRuntimeConfig, } = getConfig ();

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

    const { email, } = req.body;
    const locale = getLocaleFromRequest (req);
    const t = getServerTranslation (locale, "auth");

    const response = await callServer ({
        baseUrl: publicRuntimeConfig.authURL,
        url: "/forgot-password",
        method: "POST",
        data: {
            email,
        },
    });

    if (response.isError)
    {
        const axiosError = response.error as any;

        if (axiosError?.response)
        {
            const status = axiosError.response.status || 500;
            let errors: Record<string, string> = {};

            if (axiosError.response.data?.errors)
            {
                errors = axiosError.response.data.errors;
            }
            else if (axiosError.response.data?.message)
            {
                errors.general = axiosError.response.data.message;
            }
            else if (typeof axiosError.response.data === "string")
            {
                errors.general = axiosError.response.data;
            }
            else
            {
                errors.general = t ("failed_to_send_reset_link");
            }

            res.status (status).json ({
                success: false,
                errors,
            });
        }
        else
        {
            res.status (500).json ({
                success: false,
                errors: {
                    general: t ("failed_to_send_reset_link"),
                },
            });
        }
        return;
    }

    if (response.isSuccess)
    {
        if (typeof response.data === "string")
        {
            res.status (422).json ({
                success: false,
                errors: {
                    general: response.data,
                },
            });
        }
        else if (response.data?.errors)
        {
            res.status (422).json ({
                success: false,
                errors: response.data.errors,
            });
        }
        else if (response.data && typeof response.data === "object")
        {
            res.status (200).json ({
                success: true,
                message: response.data?.message || t ("password_reset_link_sent"),
            });
        }
        else
        {
            res.status (500).json ({
                success: false,
                errors: {
                    general: t ("failed_to_send_reset_link"),
                },
            });
        }
    }
};

export default handler;
