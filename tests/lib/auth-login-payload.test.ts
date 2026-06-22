import { test, expect, } from "vitest";

import { buildAuthLoginPayload, } from "@/libs/auth-login-payload";

test ("buildAuthLoginPayload maps email identifiers", () =>
{
    expect (buildAuthLoginPayload ({
        identifier: "superuser@mail.com",
        password: "12345678",
        remember: true,
    })).toEqual ({
        identifierKey: "email",
        identifierValue: "superuser@mail.com",
        identifier: "superuser@mail.com",
        password: "12345678",
        remember: true,
    });
});

test ("buildAuthLoginPayload maps username identifiers", () =>
{
    expect (buildAuthLoginPayload ({
        identifier: "superuser",
        password: "12345678",
    })).toEqual ({
        identifierKey: "name",
        identifierValue: "superuser",
        identifier: "superuser",
        password: "12345678",
    });
});
