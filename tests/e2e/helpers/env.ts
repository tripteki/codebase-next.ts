import { loadEnvFile, } from "./load-env";

loadEnvFile ();

export const e2eEnv = {
    baseUrl: process.env.NEXT_PUBLIC_APP_URL || "http://localhost:3000",
    apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://api.backend.localhost",
    mailLogPath: process.env.E2E_MAIL_LOG_PATH || "",
    userLogin: "superuser@mail.com",
    userEmail: "superuser@mail.com",
    userPassword: "12345678",
    testPassword: "Password123!",
};

export function uniqueEmail (): string
{
    const stamp = `${Date.now ()}.${Math.random ().toString (36).slice (2, 8)}`;

    return `e2e.${stamp}@example.com`;
}

export function uniqueName (): string
{
    return `e2e${Math.random ().toString (36).slice (2, 10)}`;
}
