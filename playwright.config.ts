import { defineConfig, devices, } from "@playwright/test";

import { loadEnvFile, } from "./tests/e2e/helpers/load-env";

loadEnvFile ();

const baseURL = process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000";

export default defineConfig ({
    testDir: "./tests/e2e",
    timeout: 60_000,
    fullyParallel: false,
    workers: 1,
    forbidOnly: !! process.env.CI,
    retries: process.env.CI ? 2 : 0,
    reporter: "list",
    use: {
        baseURL,
        testIdAttribute: "data-test",
        trace: "on-first-retry",
    },
    webServer: {
        command: "npm run build && npm run start",
        url: baseURL,
        reuseExistingServer: false,
        timeout: 180_000,
    },
    projects: [
        {
            name: "chromium",
            use: { ... devices["Desktop Chrome"], },
        },
    ],
});
