import { test, expect, } from "@playwright/test";

import {
    registerUser,
    requestPasswordResetLink,
} from "../helpers/api";
import { e2eEnv, uniqueEmail, uniqueName, } from "../helpers/env";
import {
    countMailsTo,
    extractAuthUrlsFromLog,
    frontendPathFromLogUrl,
    mailLogByteLength,
    mailSubjects,
    waitForMailInLog,
} from "../helpers/mail-log";
import { skipUnlessApiAvailable, } from "../helpers/setup";

test.describe ("Signed auth URLs from API mail log", () =>
{
    test.beforeEach (async ({}, testInfo) =>
    {
        await skipUnlessApiAvailable (testInfo);

        if (! e2eEnv.mailLogPath)
        {
            testInfo.skip (true, "Set E2E_MAIL_LOG_PATH for mail-log e2e tests");
        }
    });

    test ("visits verify-email URL extracted from mail log (single mail)", async ({ page, }) =>
    {
        const email = uniqueEmail ();
        const password = e2eEnv.testPassword;
        const name = uniqueName ();
        const logOffset = mailLogByteLength ();

        const registerResponse = await registerUser ({ name, email, password, });

        expect (registerResponse.status).toBe (201);

        const logContent = await waitForMailInLog (logOffset, {
            to: email,
            subject: mailSubjects.verifyEmail,
        });

        expect (countMailsTo (logContent, email, mailSubjects.verifyEmail)).toBe (1);

        const [ verifyUrl, ] = extractAuthUrlsFromLog (logContent, "verify-email", email);

        expect (verifyUrl).toBeTruthy ();

        await page.goto (frontendPathFromLogUrl (verifyUrl! ), { waitUntil: "networkidle", });

        await expect (page.getByText ("Your email has been verified successfully")).toBeVisible ({
            timeout: 15_000,
        });
        await expect (page.getByRole ("button", { name: "Log In", })).toBeVisible ();
    });

    test ("visits reset-password URL from mail log after forgot-password (single mail)", async ({ page, }) =>
    {
        const email = uniqueEmail ();
        const password = e2eEnv.testPassword;
        const newPassword = "NewPass123!";
        const name = uniqueName ();

        const registerResponse = await registerUser ({ name, email, password, });

        expect (registerResponse.status).toBe (201);

        const logOffset = mailLogByteLength ();

        const forgotResponse = await requestPasswordResetLink (email);

        expect (forgotResponse.ok, `forgot-password returned ${forgotResponse.status}`).toBeTruthy ();

        const logContent = await waitForMailInLog (logOffset, {
            to: email,
            subject: mailSubjects.resetPassword,
        });

        expect (countMailsTo (logContent, email, mailSubjects.resetPassword)).toBe (1);

        const [ resetUrl, ] = extractAuthUrlsFromLog (logContent, "reset-password", email);

        expect (resetUrl).toBeTruthy ();

        await page.goto (frontendPathFromLogUrl (resetUrl! ), { waitUntil: "networkidle", });
        await expect (page.getByRole ("heading", { name: "Reset Password", })).toBeVisible ();

        await page.locator ("#password").fill (newPassword);
        await page.locator ("#password_confirmation").fill (newPassword);

        const apiPath = "/api/auth/reset-password";

        const [ response, ] = await Promise.all ([
            page.waitForResponse (
                (candidate) =>
                    candidate.url ().includes (apiPath)
                    && candidate.request ().method () === "POST",
                { timeout: 30_000, }
            ),
            page.getByRole ("button", { name: "Reset Password", }).click (),
        ]);

        expect (response.ok ()).toBeTruthy ();
        await expect (page).toHaveURL (/\/admin\/auth\/login/, { timeout: 15_000, });
        await expect (page.getByText ("Password reset successfully")).toBeVisible ();
    });
});
