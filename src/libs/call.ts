import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, } from "axios";
import { getSession, } from "next-auth/react";
import { Session, } from "next-auth";
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

export const call = async (
    detail: Detail
): Promise<
{
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: any;
    error: any;

}> => {

    const

    { publicRuntimeConfig, } = getConfig (),
    baseURL: string = detail?.baseUrl ?? publicRuntimeConfig.baseURL;

    let

    isLoading: boolean = true,
    isLoaded: boolean = false,
    isError: boolean = false,
    isSuccess: boolean = false,
    data: any = null,
    error: any = null;

    try {

        const session: Session | null = await getSession ();
        const token: string = session?.jwt ?? "";

        const instance: AxiosInstance = axios.create (
        {
            baseURL,
            headers:
            {
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

        const response: AxiosResponse = await instance (detail as AxiosRequestConfig);

        data = response.data;
        isSuccess = true;

    } catch (thrower: any) {

        error = thrower;
        isError = true;

    } finally {

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
