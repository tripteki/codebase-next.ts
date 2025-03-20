import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosRequestConfig, AxiosResponse, } from "axios";
import getConfig from "next/config";
import { getSession, } from "next-auth/react";
import { Session, } from "next-auth";

type Detail =
{
    baseUrl?: string;
    url: string;
    headers?: Record<string, unknown>;
    method?: "GET" | "DELETE" | "POST" | "PUT" | "PATCH";
    data?: Record<string, unknown>;
    params?: Record<string, unknown>;
};

export const call = async (detail: Detail): Promise<
{
    isLoading: boolean;
    isLoaded: boolean;
    isError: boolean;
    isSuccess: boolean;
    data: any;
    error: any;

}> => {

    const { publicRuntimeConfig, } = getConfig ();

    const baseURL: string = detail?.baseUrl || publicRuntimeConfig.baseURL;

    let isLoading: boolean = true;
    let isLoaded: boolean = false;
    let isError: boolean = false;
    let isSuccess: boolean = false;
    let data: any = null;
    let error: any = null;

    try {

        const session: Session | null = await getSession ();
        const token: string = session?.jwt || "";

        const instance: AxiosInstance = axios.create (
        {
            baseURL,
            headers:
            {
                ... (token ? { Authorization: `Bearer ${token}`, } : {}),
            },
        });

        instance.interceptors.request.use (

            async (request: InternalAxiosRequestConfig) => request,
            async (throwable: unknown) => Promise.reject (throwable)
        );

        instance.interceptors.response.use (

            async (response: AxiosResponse) => response,
            async (throwable: unknown) => Promise.reject (throwable)
        );

        const response: AxiosResponse = await instance (detail as AxiosRequestConfig);

        data = response.data;
        isSuccess = true;

    } catch (throwable: unknown) {

        error = throwable;
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
