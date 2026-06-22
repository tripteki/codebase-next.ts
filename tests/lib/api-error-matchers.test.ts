import { describe, expect, it, } from "vitest";

import { shouldRedirectVerifyEmailError, } from "@/libs/api-error-matchers";

describe ("api-error-matchers", () =>
{
    it ("redirects when user does not exist", () =>
    {
        expect (shouldRedirectVerifyEmailError ("The selected User does not exist")).toBe (true);
        expect (shouldRedirectVerifyEmailError ("User does not exist")).toBe (true);
    });

    it ("redirects on verification failure message", () =>
    {
        expect (shouldRedirectVerifyEmailError ("Email verification failed")).toBe (true);
    });

    it ("does not redirect unrelated errors", () =>
    {
        expect (shouldRedirectVerifyEmailError ("Invalid signature")).toBe (false);
        expect (shouldRedirectVerifyEmailError ("Not Authorized")).toBe (false);
    });
});
