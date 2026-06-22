import { describe, expect, it, } from "vitest";

import { resolveApiBaseUrl, resolveApiDocsUrl, } from "@/libs/api-base";

describe ("api-base", () =>
{
    it ("prefers apiUrl and strips trailing slash", () =>
    {
        expect (resolveApiBaseUrl ({
            apiUrl: "http://api.example.com/",
            baseURL: "http://ignored.example.com/api",
        })).toBe ("http://api.example.com");
    });

    it ("derives host from baseURL without /api suffix", () =>
    {
        expect (resolveApiBaseUrl ({
            baseURL: "http://api.backend.localhost/api",
        })).toBe ("http://api.backend.localhost");

        expect (resolveApiBaseUrl ({
            baseURL: "http://api.backend.localhost/api/",
        })).toBe ("http://api.backend.localhost");
    });
});

describe ("resolveApiDocsUrl", () =>
{
    it ("derives docs url from apiUrl", () =>
    {
        expect (resolveApiDocsUrl ({
            apiUrl: "http://localhost:8000/",
        })).toBe ("http://localhost:8000/api/docs");
    });

    it ("derives docs url from baseURL", () =>
    {
        expect (resolveApiDocsUrl ({
            baseURL: "http://localhost:8000/api",
        })).toBe ("http://localhost:8000/api/docs");
    });
});
