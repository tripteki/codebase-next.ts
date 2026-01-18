import { Socket, io, } from "socket.io-client";
import getConfig from "next/config";

type Detail =
{
    baseUrl?: string;
    path?: string;
};

export const socketServer = async (
    detail?: Detail,
    token?: string
): Promise<{
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: Socket | null;
    error: any;
}> =>
{
    const { publicRuntimeConfig, } = getConfig ();
    const baseURL: string = detail?.baseUrl ?? publicRuntimeConfig.baseURL;

    let isLoading: boolean = true;
    let isLoaded: boolean = false;
    let isError: boolean = false;
    let isSuccess: boolean = false;
    let data: Socket | null = null;
    let error: any = null;

    try
    {
        const instance: Socket = io (baseURL, {
            path: detail?.path ?? "/socket.io",
            transports: [ "websocket", "polling", ],
            extraHeaders: {
                ... (token
                    ? { Authorization: `Bearer ${token}`, }
                    : {}),
            },
        });

        data = instance;
        isSuccess = true;
    }
    catch (thrower: any)
    {
        error = thrower;
        isError = true;
    }
    finally
    {
        isLoading = false;
        isLoaded = true;
    }

    return {
        isLoading,
        isLoaded,
        isError,
        isSuccess,
        data,
        error,
    };
};
