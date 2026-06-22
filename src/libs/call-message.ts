import type { CallResult, } from "@/libs/call";
import { parseApiErrors, type ApiErrorPayload, } from "@/libs/parse-api-errors";

function errorPayload (
    error: unknown
): ApiErrorPayload | string | null | undefined {
    const axiosError = error as {
        response?: { data?: ApiErrorPayload | string };
    };

    return axiosError?.response?.data;
}

export function resolveCallErrorMessage (
    error: unknown,
    fallback: string
): string {
    const parsed = parseApiErrors (errorPayload (error), fallback);

    return parsed.general || Object.values (parsed)[0] || fallback;
}

export function resolveCallErrors (
    error: unknown,
    fallback: string
): Record<string, string> {
    return parseApiErrors (errorPayload (error), fallback);
}

export type AdminActionResult<T = unknown> = {
    success: boolean;
    data?: T;
    message?: string;
    errors?: Record<string, string>;
};

export function extractApiData<T> (payload: unknown): T | undefined {
    if (payload && typeof payload === "object" && "data" in payload) {
        return (payload as { data?: T }).data;
    }

    return payload as T | undefined;
}

export function resultFromCall<T = unknown> (
    result: CallResult,
    fallbackError: string
): AdminActionResult<T> {
    if (result.isSuccess) {
        return {
            success: true,
            data: result.data as T,
        };
    }

    return {
        success: false,
        errors: resolveCallErrors (result.error, fallbackError),
        message: resolveCallErrorMessage (result.error, fallbackError),
    };
}
