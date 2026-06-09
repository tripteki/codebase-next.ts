import getConfig from "next/config";

export const getAppDisplayName = (): string =>
{
    const { publicRuntimeConfig, } = getConfig ();
    const appName = publicRuntimeConfig?.appName || "codebase";

    return appName.charAt (0).toUpperCase () + appName.slice (1);
};

export const formatPageTitle = (
    title: string
): string => `${title} | ${getAppDisplayName ()}`;
