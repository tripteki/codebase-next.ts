import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, } from "axios";
import { resolveApiBaseUrl, } from "@/libs/api-base";
import { publicRuntimeConfig, } from "@/libs/runtime-config";
import { getSession, } from "next-auth/react";
import { Session, } from "next-auth";

type Detail =
{
    baseUrl?: string;
    url: string;
    headers?: Record<string, any>;
    method?: "GET" | "DELETE" | "POST" | "PUT" | "PATCH";
    data?: Record<string, any> | FormData;
    params?: Record<string, any>;
};

export type CallResult = {
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: any;
    error: any;
};

export const call = async (
    detail: Detail
): Promise<CallResult> =>
{
    const baseURL: string = detail?.baseUrl ?? resolveApiBaseUrl (publicRuntimeConfig);

    let isLoading: boolean = true;
    let isLoaded: boolean = false;
    let isError: boolean = false;
    let isSuccess: boolean = false;
    let data: any = null;
    let error: any = null;

    try
    {
        const session: Session | null = await getSession ();
        const token: string = session?.jwt ?? "";

        const instance: AxiosInstance = axios.create ({
            baseURL,
            headers: {
                ... (token ? { Authorization: `Bearer ${token}`, } : {}),
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
