import axios, { AxiosRequestConfig, AxiosResponse, } from 'axios';
import getConfig from 'next/config';
import { getSession, } from 'next-auth/react';

type Detail =
{
    baseUrl?: string;
    url: string;
    headers?: any;
    method?: 'GET' | 'DELETE' | 'POST' | 'PUT' | 'PATCH';
    data?: any;
    params?: any;
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

    const baseURL = detail?.baseUrl || publicRuntimeConfig.baseURL;

    let isLoading = true;
    let isLoaded = false;
    let isError = false;
    let isSuccess = false;
    let data: any = null;
    let error: any = null;

    try {

        const session = await getSession ();
        const token = session?.jwt || '';

        const instance = axios.create (
        {
            baseURL,
            headers:
            {
                ... (token ? { Authorization: `Bearer ${token}`, } : {}),
            },
        });

        instance.interceptors.request.use (

            async (request) => request,
            async (throwable) => Promise.reject (throwable)
        );

        instance.interceptors.response.use (

            async (response) => response,
            async (throwable) => Promise.reject (throwable)
        );

        const response: AxiosResponse = await instance (detail as AxiosRequestConfig);

        data = response.data;
        isSuccess = true;

    } catch (throwable) {

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