import { existsSync, readFileSync, statSync, } from "node:fs";
import { resolve, } from "node:path";

import { e2eEnv, } from "./env";

export const mailSubjects = {
    verifyEmail: "Verify your email address",
    resetPassword: "Reset your password",
} as const;

function mailLogPath (): string
{
    if (! e2eEnv.mailLogPath)
    {
        return "";
    }

    return resolve (e2eEnv.mailLogPath);
}

export function mailLogByteLength (): number
{
    const path = mailLogPath ();

    if (! path || ! existsSync (path))
    {
        return 0;
    }

    return statSync (path).size;
}

export function readMailLogSince (byteOffset: number): string
{
    const path = mailLogPath ();

    if (! path || ! existsSync (path))
    {
        return "";
    }

    return readFileSync (path).subarray (byteOffset).toString ("utf8");
}

function escapeRegExp (value: string): string
{
    return value.replace (/[.*+?^${}()|[\]\\]/g, "\\$&");
}

export function countMailsTo (
    content: string,
    to: string,
    subject: string,
): number
{
    const pattern = new RegExp (
        `To: ${escapeRegExp (to)}[\\s\\S]*?Subject: ${escapeRegExp (subject)}`,
        "g",
    );

    return content.match (pattern)?.length ?? 0;
}

function decodeHtmlEntities (value: string): string
{
    return value.replace (/&amp;/g, "&");
}

export function extractAuthUrlsFromLog (
    content: string,
    kind: "verify-email" | "reset-password",
    email?: string,
): string[]
{
    const pattern = kind === "verify-email"
        ? /https?:\/\/[^\s"'<>]+\/auth\/verify-email\/[^\s"'<>?]+\?signed=[^\s"'<>]+/g
        : /https?:\/\/[^\s"'<>]+\/auth\/reset-password\/[^\s"'<>?]+\?signed=[^\s"'<>]+/g;

    const unique = [
        ... new Set ((content.match (pattern) ?? []).map (decodeHtmlEntities)),
    ];

    if (! email)
    {
        return unique;
    }

    const encoded = encodeURIComponent (email);

    return unique.filter (
        (url) => url.includes (encoded) || url.includes (email),
    );
}

export async function waitForMailInLog (
    byteOffset: number,
    options: { to: string; subject: string; },
    timeoutMs = 15_000,
): Promise<string>
{
    const deadline = Date.now () + timeoutMs;

    while (Date.now () < deadline)
    {
        const content = readMailLogSince (byteOffset);

        if (countMailsTo (content, options.to, options.subject) >= 1)
        {
            return content;
        }

        await new Promise ((resolvePromise) => setTimeout (resolvePromise, 200));
    }

    throw new Error (
        `Mail to ${options.to} with subject "${options.subject}" not found in E2E mail log`,
    );
}

export function frontendPathFromLogUrl (logUrl: string): string
{
    const { pathname, search, } = new URL (logUrl);

    return `${pathname}${search}`;
}
