import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, } from "axios";
import getConfig from "next/config";

type Detail =
{
    baseUrl?: string;
    url: string;
    headers?: Record<string, any>;
    method?: "GET" | "DELETE" | "POST" | "PUT" | "PATCH";
    data?: Record<string, any>;
    params?: Record<string, any>;
};

export const callServer = async (
    detail: Detail,
    token?: string
): Promise<{
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: any;
    error: any;
}> =>
{
    const { publicRuntimeConfig, } = getConfig ();
    const baseURL: string = detail?.baseUrl ?? publicRuntimeConfig.baseURL;

    let isLoading: boolean = true;
    let isLoaded: boolean = false;
    let isError: boolean = false;
    let isSuccess: boolean = false;
    let data: any = null;
    let error: any = null;

    try
    {
        const instance: AxiosInstance = axios.create ({
            baseURL,
            headers: {
                "Content-Type": "application/json",
                ... (token ? { Authorization: `Bearer ${token}`, } : {}),
                ... (detail.headers || {}),
            },
        });

        instance.interceptors.request.use (
            async (
                request: InternalAxiosRequestConfig
            ) => request,
            async (
                thrower: any
            ) => Promise.reject (thrower)
        );

        instance.interceptors.response.use (
            async (
                response: AxiosResponse
            ) => response,
            async (
                thrower: any
            ) => Promise.reject (thrower)
        );

        const config: AxiosRequestConfig = {
            method: detail.method || "GET",
            url: detail.url,
            ... (detail.data ? { data: detail.data, } : {}),
            ... (detail.params ? { params: detail.params, } : {}),
        };

        const response: AxiosResponse = await instance.request (config);

        data = response.data;
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
