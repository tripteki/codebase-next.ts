/** @type {import ("next").NextConfig} */

"use strict";

const { i18n, } = require ("./next-i18next.config");

const nextConfig = {

    reactStrictMode: true,

    // https://stackoverflow.com/questions/64261029/next-js-env-vs-serverruntimeconfig
    // https://nextjs.org/docs/pages/api-reference/next-config-js/runtime-configuration

    serverRuntimeConfig: {

        secret: process.env.SECRET,
    },

    publicRuntimeConfig: {

        appName: process.env.NEXT_PUBLIC_APP_NAME || "codebase",
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://frontend.localhost",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://api.backend.localhost",
        env: process.env.NEXT_PUBLIC_APP_ENV || "production",
        language: process.env.NEXT_PUBLIC_APP_LANG || "en",
    },

    i18n,
};

module.exports = nextConfig;
