"use strict";

import axios from "axios";
import configuration from "../next.config";

export default () =>
{
    const instance = axios.create (
    {
        baseURL: configuration.publicRuntimeConfig.baseURL,
    });

    instance.interceptors.request.use (
        request => request,
        error => Promise.reject (error)
    );

    instance.interceptors.response.use (
        response => response,
        error => Promise.reject (error)
    );

    return instance;
};
