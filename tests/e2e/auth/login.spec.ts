import { test, expect, } from "@playwright/test";

import { AuthPages, } from "../helpers/auth-pages";
import { e2eEnv, } from "../helpers/env";
import { prepareE2eAuth, } from "../helpers/setup";

test.describe ("Auth login UI", () =>
{
    test.beforeEach (async ({}, testInfo) =>
    {
        await prepareE2eAuth (testInfo);
    });

    test ("logs in with valid credentials and reaches the dashboard", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.gotoLogin ();
        await auth.loginExpectSuccess (e2eEnv.userLogin, e2eEnv.userPassword, { skipGoto: true, });
    });

    test ("shows validation feedback for invalid credentials", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        const response = await auth.login (e2eEnv.userLogin, "wrong-password-123", {
            retryOnRateLimit: false,
        });

        expect (response.status ()).toBeGreaterThanOrEqual (400);
        await expect (page).toHaveURL (/\/admin\/auth\/login/);
        await auth.expectAuthError ();
    });
});
