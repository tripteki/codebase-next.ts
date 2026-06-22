import type { AdminActionResult, } from "@/libs/call-message";

export function actionErrors (
    result: AdminActionResult,
    fallback: string
): Record<string, string> {
    return result.errors ?? { general: result.message ?? fallback };
}
