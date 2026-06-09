import Echo from "laravel-echo";
import { getSession, } from "next-auth/react";
import { Session, } from "next-auth";
import { createEcho, } from "@/libs/echo";

type Detail =
{
    apiUrl?: string;
    reverbAppKey?: string;
    reverbHost?: string;
    reverbPort?: number;
    reverbScheme?: string;
};

export const socket = async (
    detail?: Detail
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
        const session: Session | null = await getSession ();
        const token: string = (session as any)?.accessToken ?? (session as any)?.jwt ?? "";

        data = createEcho (token, detail);
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
