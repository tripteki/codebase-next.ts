import { describe, expect, it, } from "vitest";

import type { CallResult, } from "@/libs/call";
import {
    extractApiData,
    resolveCallErrorMessage,
    resolveCallErrors,
    resultFromCall,
} from "@/libs/call-message";

describe ("call-message", () =>
{
    it ("extracts nested data payload", () =>
    {
        expect (extractApiData ({ data: { id: 1, }, })).toEqual ({ id: 1, });
        expect (extractApiData ({ id: 1, })).toEqual ({ id: 1, });
    });

    it ("resolves axios error messages", () =>
    {
        const error = {
            response: {
                data: {
                    errors: { email: "Invalid", },
                },
            },
        };

        expect (resolveCallErrors (error, "Fallback")).toEqual ({ email: "Invalid", });
        expect (resolveCallErrorMessage (error, "Fallback")).toBe ("Invalid");
    });

    it ("maps call results to admin action results", () =>
    {
        const success: CallResult = {
            isLoading: false,
            isLoaded: true,
            isSuccess: true,
            isError: false,
            data: { ok: true, },
            error: null,
        };

        expect (resultFromCall (success, "Failed")).toEqual ({
            success: true,
            data: { ok: true, },
        });

        const failure: CallResult = {
            isLoading: false,
            isLoaded: true,
            isSuccess: false,
            isError: true,
            data: null,
            error: {
                response: {
                    data: { message: "Not Authorized", },
                },
            },
        };

        expect (resultFromCall (failure, "Failed")).toEqual ({
            success: false,
            errors: { general: "Not Authorized", },
            message: "Not Authorized",
        });
    });
});
