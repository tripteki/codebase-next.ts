import { NextApiRequest, NextApiResponse, } from "next";
import { publicRuntimeConfig, } from "@/libs/runtime-config";

import { getServerTranslation, getLocaleFromRequest, } from "@/libs/i18n/server";
import { callServer, } from "@/libs/call-server";
import { validatePasswordConfirmation, } from "@/libs/auth-response";
import { focusPasswordMatchError, parseApiErrors, } from "@/libs/parse-api-errors";


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

    const { name, email, password, password_confirmation, } = req.body;
    const locale = getLocaleFromRequest (req);
    const t = getServerTranslation (locale, "auth");

    const passwordMismatch = validatePasswordConfirmation (
        password,
        password_confirmation,
        t ("password_mismatch")
    );

    if (passwordMismatch)
    {
        res.status (422).json ({
            success: false,
            errors: focusPasswordMatchError (passwordMismatch, "password_confirmation"),
        });
        return;
    }

    const response = await callServer ({
        baseUrl: publicRuntimeConfig.authURL,
        url: "/register",
        method: "POST",
        data: {
            name,
            email,
            password,
            password_confirmation,
        },
    });

    if (response.isError)
    {
        const axiosError = response.error as any;

        if (axiosError?.response)
        {
            const status = axiosError.response.status || 500;
            const errors = parseApiErrors (axiosError.response.data, t ("registration_failed"));

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
                    general: t ("registration_failed"),
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
            res.status (201).json ({
                success: true,
                data: response.data,
            });
        }
        else
        {
            res.status (500).json ({
                success: false,
                errors: {
                    general: t ("registration_failed"),
                },
            });
        }
    }
};

export default handler;
