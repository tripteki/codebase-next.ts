import { NextApiRequest, NextApiResponse, } from "next";
import { publicRuntimeConfig, } from "@/libs/runtime-config";

import { getServerTranslation, getLocaleFromRequest, } from "@/libs/i18n/server";
import { normalizeAuthEmailParam, } from "@/libs/auth-email";
import { callServer, } from "@/libs/call-server";
import { parseApiErrors, } from "@/libs/parse-api-errors";


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

    const { email: rawEmail, signed, } = req.body;
    const email = normalizeAuthEmailParam (String (rawEmail || ""));
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
        url: `/verify-email/${encodeURIComponent (email)}`,
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
            const errors = parseApiErrors (
                axiosError.response.data,
                status === 403 ? t ("not_signed") : t ("verification_failed")
            );

            res.status (status).json ({
                success: false,
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
