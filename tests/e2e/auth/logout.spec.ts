import { test, expect, } from "@playwright/test";

import { AuthPages, } from "../helpers/auth-pages";
import { e2eEnv, } from "../helpers/env";
import { prepareE2eAuth, } from "../helpers/setup";

test.describe ("Auth logout UI", () =>
{
    test.beforeEach (async ({}, testInfo) =>
    {
        await prepareE2eAuth (testInfo);
    });

    test ("logs out from the dashboard and returns to login", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.loginExpectSuccess (e2eEnv.userLogin, e2eEnv.userPassword);
        await auth.logout ();

        await expect (page.getByRole ("heading", { name: "Login", })).toBeVisible ({ timeout: 15_000, });
    });
});
