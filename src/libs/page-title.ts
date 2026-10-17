
import { formatAppName, } from "@/libs/app-name";
import { publicRuntimeConfig, } from "@/libs/runtime-config";
export const getAppDisplayName = (): string =>
{
    const appName = publicRuntimeConfig?.appName || "codebase";

    return formatAppName (appName);
};

export const formatPageTitle = (
    title: string
): string => `${title} | ${getAppDisplayName ()}`;
