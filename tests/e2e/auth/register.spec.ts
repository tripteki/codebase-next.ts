import { test, expect, } from "@playwright/test";

import { AuthPages, } from "../helpers/auth-pages";
import { e2eEnv, uniqueEmail, uniqueName, } from "../helpers/env";
import { skipUnlessApiAvailable, } from "../helpers/setup";

test.describe ("Auth register UI", () =>
{
    test.beforeEach (async ({}, testInfo) =>
    {
        await skipUnlessApiAvailable (testInfo);
    });

    test ("registers a new user and redirects to login with verification notice", async ({ page, }) =>
    {
        const auth = new AuthPages (page);
        const email = uniqueEmail ();
        const password = e2eEnv.testPassword;

        await auth.gotoRegister ();
        await auth.fillRegister ({
            name: uniqueName (),
            email,
            password,
            passwordConfirmation: password,
        });

        const response = await auth.submitRegister ();

        expect (response.ok ()).toBeTruthy ();
        await expect (page).toHaveURL (/\/admin\/auth\/login/, { timeout: 15_000, });
        await expect (page.getByText ("Verification email sent")).toBeVisible ();
    });

    test ("shows field validation when passwords do not match", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.gotoRegister ();
        await auth.fillRegister ({
            name: uniqueName (),
            email: uniqueEmail (),
            password: e2eEnv.testPassword,
            passwordConfirmation: "DifferentPass123!",
        });

        const response = await auth.submitRegister ();

        expect (response.status ()).toBeGreaterThanOrEqual (400);
        await expect (page).toHaveURL (/\/admin\/auth\/register/);
        await auth.expectFieldError ("password_confirmation");
    });
});
