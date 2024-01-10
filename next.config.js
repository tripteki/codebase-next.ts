/** @type {import("next").NextConfig} */

"use strict";

const nextConfig = {

    reactStrictMode: true,

    // https://stackoverflow.com/questions/64261029/next-js-env-vs-serverruntimeconfig
    // https://nextjs.org/docs/pages/api-reference/next-config-js/runtime-configuration

    serverRuntimeConfig: {

        secret: process.env.SECRET,
    },

    publicRuntimeConfig: {

        appName: process.env.NEXT_PUBLIC_APP_NAME || "codebase",
        env: process.env.NEXT_PUBLIC_APP_ENV || "production",
    },
};

module.exports = nextConfig;
