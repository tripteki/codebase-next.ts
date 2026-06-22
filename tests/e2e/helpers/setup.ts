import type { TestInfo, } from "@playwright/test";

import { ensureE2eUser, isApiAvailable, } from "./api";

export async function skipUnlessApiAvailable (testInfo: TestInfo): Promise<void>
{
    if (! await isApiAvailable ())
    {
        testInfo.skip (true, "API must be running");
    }
}

export async function prepareE2eAuth (testInfo: TestInfo): Promise<void>
{
    await skipUnlessApiAvailable (testInfo);

    try
    {
        await ensureE2eUser ();
    }
    catch (error)
    {
        testInfo.skip (true, error instanceof Error ? error.message : "Failed to prepare e2e user");
    }
}
