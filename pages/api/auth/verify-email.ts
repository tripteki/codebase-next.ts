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

    const { email, signed, } = req.body;
    const locale = getLocaleFromRequest (req);
    const t = getServerTranslation (locale, "auth");

    if (! email)
    {
        res.status (400).json ({
            success: false,
            errors: {
                email: t ("email_required"),
            },
        });
        return;
    }

    if (! signed)
    {
        res.status (400).json ({
            success: false,
            errors: {
                signed: t ("signed_required"),
            },
        });
        return;
    }

    const response = await callServer ({
        baseUrl: publicRuntimeConfig.authURL,
        url: `/verify-email/${email}`,
        method: "POST",
        data: {},
        params: {
            signed,
        },
    });

    if (response.isError)
    {
        const axiosError = response.error as any;

        if (axiosError?.response)
        {
            const status = axiosError.response.status || 500;
            let message = t ("verification_failed");
            let errors: Record<string, string> = {};

            if (status === 403)
            {
                message = t ("not_signed");
            }
            else if (axiosError.response.data?.message)
            {
                message = axiosError.response.data.message;
            }
            else if (typeof axiosError.response.data === "string")
            {
                message = axiosError.response.data;
            }

            if (axiosError.response.data?.errors)
            {
                errors = axiosError.response.data.errors;
            }

            res.status (status).json ({
                success: false,
                message,
                errors,
            });
        }
        else
        {
            let errorMessage = t ("verification_failed");

            if (axiosError?.code === "ENOTFOUND" || axiosError?.code === "ECONNREFUSED")
            {
                errorMessage = t ("backend_unavailable");
            }
            else if (axiosError?.message)
            {
                if (axiosError.message.includes ("Cannot"))
                {
                    errorMessage = t ("verification_failed");
                }
                else
                {
                    errorMessage = axiosError.message;
                }
            }

            res.status (500).json ({
                success: false,
                message: errorMessage,
                errors: {},
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
                message: response.data,
                errors: {},
            });
        }
        else if (response.data?.errors)
        {
            res.status (422).json ({
                success: false,
                message: response.data.message || t ("verification_failed"),
                errors: response.data.errors,
            });
        }
        else if (response.data && typeof response.data === "object")
        {
            res.status (200).json ({
                success: true,
                message: response.data?.message || t ("email_verified"),
            });
        }
        else
        {
            res.status (500).json ({
                success: false,
                message: t ("verification_failed"),
                errors: {},
            });
        }
    }
};

export default handler;
