import Echo from "laravel-echo";
import Pusher from "pusher-js";
import getConfig from "next/config";

type Detail =
{
    apiUrl?: string;
    reverbAppKey?: string;
    reverbHost?: string;
    reverbPort?: number;
    reverbScheme?: string;
};

const resolveApiRootUrl = (baseURL: string): string =>
{
    return baseURL.replace (/\/api\/?$/, "");
};

export const createEcho = (accessToken: string, detail?: Detail): Echo<any> =>
{
    const { publicRuntimeConfig, } = getConfig ();

    if (typeof window !== "undefined")
    {
        (window as typeof window & { Pusher: typeof Pusher; }).Pusher = Pusher;
    }

    const apiUrl: string = detail?.apiUrl
        ?? publicRuntimeConfig.apiUrl
        ?? resolveApiRootUrl (publicRuntimeConfig.baseURL);

    const reverbAppKey: string = detail?.reverbAppKey ?? publicRuntimeConfig.reverbAppKey ?? "";
    const reverbHost: string = detail?.reverbHost ?? publicRuntimeConfig.reverbHost ?? "127.0.0.1";
    const reverbPort: number = detail?.reverbPort ?? Number (publicRuntimeConfig.reverbPort ?? 8080);
    const reverbScheme: string = detail?.reverbScheme ?? publicRuntimeConfig.reverbScheme ?? "http";

    return new Echo ({
        broadcaster: "reverb",
        key: reverbAppKey,
        wsHost: reverbHost,
        wsPort: reverbPort,
        wssPort: reverbPort,
        forceTLS: reverbScheme === "https",
        enabledTransports: [ "ws", "wss", ],

        authEndpoint: `${apiUrl}/broadcasting/auth`,
        auth: {
            headers: {
                Authorization: `Bearer ${accessToken}`,
            },
        },
    });
};
