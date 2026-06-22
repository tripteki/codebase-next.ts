import { test, expect, } from "@playwright/test";

import { AuthPages, } from "../helpers/auth-pages";
import { e2eEnv, } from "../helpers/env";
import { skipUnlessApiAvailable, } from "../helpers/setup";

test.describe ("Auth reset password UI", () =>
{
    test.beforeEach (async ({}, testInfo) =>
    {
        await skipUnlessApiAvailable (testInfo);
    });

    test ("shows validation feedback for an invalid reset token", async ({ page, }) =>
    {
        const auth = new AuthPages (page);
        const password = e2eEnv.testPassword;

        await auth.gotoResetPasswordWithToken (e2eEnv.userEmail);
        await auth.fillResetPassword (password, password);

        const response = await auth.submitResetPassword ();

        expect (response.status ()).toBeGreaterThanOrEqual (400);
        await expect (page).toHaveURL (/reset-password/);
        await auth.expectValidationError ();
    });

    test ("shows field validation when passwords do not match", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.gotoResetPasswordWithToken (e2eEnv.userEmail);
        await auth.fillResetPassword (e2eEnv.testPassword, "DifferentPass123!");

        const response = await auth.submitResetPassword ();

        expect (response.status ()).toBeGreaterThanOrEqual (400);
        await expect (page).toHaveURL (/reset-password/);
        await auth.expectFieldError ("password");
    });
});
