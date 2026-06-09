
import { publicRuntimeConfig, } from "@/libs/runtime-config";
export const getAppDisplayName = (): string =>
{
    const appName = publicRuntimeConfig?.appName || "codebase";

    return appName.charAt (0).toUpperCase () + appName.slice (1);
};

export const formatPageTitle = (
    title: string
): string => `${title} | ${getAppDisplayName ()}`;
