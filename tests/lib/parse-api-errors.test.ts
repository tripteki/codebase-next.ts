import { describe, expect, it, } from "vitest";

import {
    parseApiErrors,
    parseDetailArray,
    resolveFieldFromLoc,
    normalizeErrorsRecord,
} from "@/libs/parse-api-errors";

describe ("parse-api-errors", () =>
{
    it ("returns fallback when payload is empty", () =>
    {
        expect (parseApiErrors (null, "Fallback")).toEqual ({ general: "Fallback", });
    });

    it ("parses string payload", () =>
    {
        expect (parseApiErrors ("Invalid credentials")).toEqual ({
            general: "Invalid credentials",
        });
    });

    it ("normalizes validation errors record", () =>
    {
        expect (parseApiErrors ({
            errors: {
                email: "Email is required",
                password: [ "Too short", "Too weak", ],
            },
        })).toEqual ({
            email: "Email is required",
            password: "Too short",
        });
    });

    it ("parses validation detail array", () =>
    {
        expect (parseApiErrors ({
            detail: [
                { loc: [ "body", "email", ], msg: "Invalid email", },
                { loc: [ "body", "password", ], msg: "Required", },
            ],
        })).toEqual ({
            email: "Invalid email",
            password: "Required",
        });
    });

    it ("uses message field when present", () =>
    {
        expect (parseApiErrors ({ message: "Not Authorized", })).toEqual ({
            general: "Not Authorized",
        });
    });

    it ("parses flat field errors record", () =>
    {
        expect (parseApiErrors ({
            name: "Name is required",
            email: "Email has already been taken",
        })).toEqual ({
            name: "Name is required",
            email: "Email has already been taken",
        });
    });

    it ("parses wrapped action result payload", () =>
    {
        expect (parseApiErrors ({
            success: false,
            errors: {
                email: "Invalid email",
            },
        })).toEqual ({
            email: "Invalid email",
        });
    });

    it ("unwraps server error envelope with nested errors", () =>
    {
        expect (parseApiErrors ({
            error: true,
            statusCode: 422,
            statusMessage: "Server Error",
            message: "",
            data: {
                success: false,
                errors: {
                    email: "The email has already been taken.",
                    password: "The password field is required.",
                },
            },
        })).toEqual ({
            email: "The email has already been taken.",
            password: "The password field is required.",
        });
    });

    it ("ignores empty top-level message when nested errors exist", () =>
    {
        expect (parseApiErrors ({
            message: "",
            data: {
                errors: {
                    name: "Name is required",
                },
            },
        })).toEqual ({
            name: "Name is required",
        });
    });

    it ("maps body-level password mismatch to password_confirmation", () =>
    {
        expect (parseApiErrors ({
            detail: [
                {
                    type: "value_error",
                    loc: [ "body", ],
                    msg: "Password and password confirmation must match",
                },
            ],
        })).toEqual ({
            password_confirmation: "Password and password confirmation must match",
        });
    });

    it ("parses password confirmation validation detail", () =>
    {
        expect (parseApiErrors ({
            detail: [
                {
                    type: "value_error.confirmed",
                    loc: [ "body", "password", ],
                    msg: "The password confirmation does not match.",
                },
            ],
        })).toEqual ({
            password: "The password confirmation does not match.",
        });
    });
});

describe ("resolveFieldFromLoc", () =>
{
    it ("strips location prefix from loc", () =>
    {
        expect (resolveFieldFromLoc ([ "body", "user", "email", ])).toBe ("user.email");
    });

    it ("returns general for empty loc", () =>
    {
        expect (resolveFieldFromLoc ([])).toBe ("general");
    });
});

describe ("normalizeErrorsRecord", () =>
{
    it ("keeps first array message per field", () =>
    {
        expect (normalizeErrorsRecord ({
            name: [ "Required", "Too short", ],
        })).toEqual ({ name: "Required", });
    });
});

describe ("parseDetailArray", () =>
{
    it ("merges duplicate field messages", () =>
    {
        expect (parseDetailArray ([
            { loc: [ "body", "email", ], msg: "Invalid", },
            { loc: [ "body", "email", ], msg: "Taken", },
        ])).toEqual ({ email: "Invalid Taken", });
    });
});
