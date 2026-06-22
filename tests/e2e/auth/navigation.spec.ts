import { test, expect, } from "@playwright/test";

import { AuthPages, } from "../helpers/auth-pages";

test.describe ("Auth navigation", () =>
{
    test ("guest can move between login, register, and forgot password", async ({ page, }) =>
    {
        const auth = new AuthPages (page);

        await auth.gotoLogin ();
        await page.getByRole ("link", { name: "Sign up", }).click ();
        await expect (page).toHaveURL (/\/admin\/auth\/register/);

        await page.getByRole ("main").getByRole ("link", { name: "Log In", }).click ();
        await expect (page).toHaveURL (/\/admin\/auth\/login/);

        await page.getByRole ("link", { name: "Forgot password?", }).click ();
        await expect (page).toHaveURL (/\/admin\/auth\/forgot-password/);

        await page.getByRole ("main").getByRole ("link", { name: "log in", }).click ();
        await expect (page).toHaveURL (/\/admin\/auth\/login/);
    });
});
