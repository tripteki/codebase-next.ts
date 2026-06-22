import { describe, expect, it, } from "vitest";

import { buildResetPasswordRequest, } from "@/libs/auth-reset-password-request";

describe ("buildResetPasswordRequest", () =>
{
    it ("maps token query to signed reset-password route", () =>
    {
        expect (buildResetPasswordRequest ({
            email: "user@mail.com",
            token: "signed-token",
            password: "Password123!",
            password_confirmation: "Password123!",
        })).toEqual ({
            url: "/reset-password/user%40mail.com",
            params: { signed: "signed-token", },
            data: {
                password: "Password123!",
                password_confirmation: "Password123!",
            },
        });
    });
});
