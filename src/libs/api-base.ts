type ApiRuntimeConfig = {
    apiUrl?: string;
    baseURL?: string;
};

export function resolveApiBaseUrl (config: ApiRuntimeConfig): string {
    const apiUrl = config.apiUrl?.trim ();

    if (apiUrl) {
        return apiUrl.replace (/\/$/, "");
    }

    return String (config.baseURL ?? "")
        .replace (/\/api\/?$/, "")
        .replace (/\/$/, "");
}

export function resolveApiDocsUrl (config: ApiRuntimeConfig): string {
    return `${resolveApiBaseUrl (config)}/api/docs`;
}
