import { publicRuntimeConfig, } from "@/libs/runtime-config";
import { resolveApiBaseUrl, } from "@/libs/api-base";

export type RealtimeDriver = "echo" | "socketio";

export type RealtimeConnectionConfig = {
    driver: RealtimeDriver;
    apiUrl: string;
    reverbAppKey: string;
    reverbHost: string;
    reverbPort: number;
    reverbScheme: string;
    socketPath: string;
};

export const resolveRealtimeDriver = (
    value?: string
): RealtimeDriver =>
    value === "socketio" ? "socketio" : "echo";

export const buildRealtimeConnectionConfig = (
    overrides: Partial<RealtimeConnectionConfig> = {}
): RealtimeConnectionConfig =>
{
    const apiUrl = overrides.apiUrl
        ?? resolveApiBaseUrl ({
            apiUrl: publicRuntimeConfig.apiUrl,
            baseURL: publicRuntimeConfig.baseURL,
        });

    return {
        driver: overrides.driver
            ?? resolveRealtimeDriver (publicRuntimeConfig.realtimeDriver),
        apiUrl,
        reverbAppKey: overrides.reverbAppKey ?? publicRuntimeConfig.reverbAppKey,
        reverbHost: overrides.reverbHost ?? publicRuntimeConfig.reverbHost,
        reverbPort: overrides.reverbPort ?? Number (publicRuntimeConfig.reverbPort ?? 8080),
        reverbScheme: overrides.reverbScheme ?? publicRuntimeConfig.reverbScheme,
        socketPath: overrides.socketPath ?? "/socket.io",
    };
};
