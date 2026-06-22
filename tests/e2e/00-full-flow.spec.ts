import { test, expect, } from "@playwright/test";

import { AuthPages, } from "./helpers/auth-pages";
import { e2eEnv, } from "./helpers/env";
import { prepareE2eAuth, } from "./helpers/setup";

test.describe ("Full guest-to-logout flow", () =>
{
    test.setTimeout (120_000);

    test.beforeEach (async ({}, testInfo) =>
    {
        await prepareE2eAuth (testInfo);
    });

    test ("home → login → dashboard → notifications → profile → logout", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.gotoHome ();
        await expect (page.getByRole ("heading", { level: 2, })).toBeVisible ();

        await auth.clickGetStartedExpectLogin ();

        await auth.login (e2eEnv.userLogin, e2eEnv.userPassword, { skipGoto: true, });
        await auth.expectDashboard ();

        await page.goto ("/notifications", { waitUntil: "domcontentloaded", });
        await expect (page.getByRole ("heading", { name: "Notifications", })).toBeVisible ({ timeout: 15_000, });
        await expect (page.getByRole ("link", { name: "Profile", })).toBeVisible ({ timeout: 15_000, });

        await page.getByRole ("link", { name: "Profile", }).click ();
        await page.waitForURL (/\/admin\/settings/);
        await expect (page.getByRole ("heading", { name: "Profile settings", })).toBeVisible ();

        await auth.logout ();
        await expect (page.getByRole ("heading", { name: "Login", })).toBeVisible ({ timeout: 15_000, });
    });
});
