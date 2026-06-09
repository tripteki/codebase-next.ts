import Echo from "laravel-echo";
import { createEcho, } from "@/libs/echo";

type Detail =
{
    apiUrl?: string;
    reverbAppKey?: string;
    reverbHost?: string;
    reverbPort?: number;
    reverbScheme?: string;
};

export const socketServer = async (
    detail?: Detail,
    token?: string
): Promise<{
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: Echo<any> | null;
    error: any;
}> =>
{
    let isLoading: boolean = true;
    let isLoaded: boolean = false;
    let isError: boolean = false;
    let isSuccess: boolean = false;
    let data: Echo<any> | null = null;
    let error: any = null;

    try
    {
        data = createEcho (token ?? "", detail);
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
