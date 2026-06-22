import { test, expect, } from "@playwright/test";

import { AuthPages, } from "../helpers/auth-pages";
import { e2eEnv, } from "../helpers/env";
import { skipUnlessApiAvailable, } from "../helpers/setup";

test.describe ("Auth forgot password UI", () =>
{
    test.beforeEach (async ({}, testInfo) =>
    {
        await skipUnlessApiAvailable (testInfo);
    });

    test ("sends a reset link and returns to login with success message", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.gotoForgotPassword ();
        await auth.fillForgotPassword (e2eEnv.userEmail);

        const response = await auth.submitForgotPassword ();

        expect (response.ok ()).toBeTruthy ();
        await expect (page).toHaveURL (/\/admin\/auth\/login/, { timeout: 15_000, });
        await expect (page.getByText ("Password reset link sent")).toBeVisible ();
    });
});
