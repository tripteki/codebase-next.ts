import {
    createRealtimeClient,
    type RealtimeClient,
} from "@/libs/realtime-client";
import type { RealtimeConnectionConfig, } from "@/libs/realtime-config";

export const socketServer = async (
    detail?: Partial<RealtimeConnectionConfig>,
    token?: string
): Promise<{
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: RealtimeClient | null;
    error: any;
}> =>
{
    let isLoading: boolean = true;
    let isLoaded: boolean = false;
    let isError: boolean = false;
    let isSuccess: boolean = false;
    let data: RealtimeClient | null = null;
    let error: any = null;

    try
    {
        data = createRealtimeClient (token ?? "", detail);
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
