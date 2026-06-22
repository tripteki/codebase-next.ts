import { test, } from "@playwright/test";

import { AuthPages, } from "../helpers/auth-pages";
import { e2eEnv, } from "../helpers/env";
import { prepareE2eAuth, skipUnlessApiAvailable, } from "../helpers/setup";

test.describe ("Auth route guards UI", () =>
{
    test.beforeEach (async ({}, testInfo) =>
    {
        await skipUnlessApiAvailable (testInfo);
    });

    test ("redirects guests from dashboard to login", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.expectGuestRedirect ("/admin/dashboard");
    });

    test ("redirects guests from settings to login", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.expectGuestRedirect ("/admin/settings");
    });

    test ("redirects guests from notifications to login", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.expectGuestRedirect ("/notifications");
    });

    test ("redirects authenticated users away from login", async ({ page, }, testInfo) =>
    {
        await prepareE2eAuth (testInfo);
        const auth = new AuthPages (page);

        await auth.loginExpectSuccess (e2eEnv.userLogin, e2eEnv.userPassword);
        await auth.expectAuthenticatedRedirectFromLogin ();
    });

    test ("redirects authenticated users away from register", async ({ page, }, testInfo) =>
    {
        await prepareE2eAuth (testInfo);
        const auth = new AuthPages (page);

        await auth.loginExpectSuccess (e2eEnv.userLogin, e2eEnv.userPassword);
        await auth.expectAuthenticatedRedirectFrom ("/admin/auth/register");
    });
});
