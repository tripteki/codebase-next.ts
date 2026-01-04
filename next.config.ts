const { NextConfig, } = require ("next");
const { resolve, } = require ("path");
const { name: projectName, version: projectVersion, } = require ("./package.json");

module.exports = {

    // https://stackoverflow.com/questions/64261029/next-js-env-vs-serverruntimeconfig
    // https://nextjs.org/docs/pages/api-reference/next-config-js/runtime-configuration

    serverRuntimeConfig: {

        secret: process.env.SECRET,
    },

    publicRuntimeConfig: {

        appName: process.env.NEXT_PUBLIC_APP_NAME || projectName || "codebase",
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || projectVersion || "1.0.0",
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://frontend.localhost",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://api.backend.localhost",
        authURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://api.backend.localhost/auth",
        env: process.env.NEXT_PUBLIC_APP_ENV || "production",
    },

    ... (process.env.BUILD_STATIC ? {} : {
        localePath: resolve ("./src/langs"),
        i18n: {
            defaultLocale: "default",
            locales: [ "default", "en", "id", ],
            localeDetection: false,
        },
    }),

    ... (process.env.BUILD_STATIC ? {
        output: "export",
    } : {
        distDir: "public/.next",
    }),

    devIndicators: false,
    reactStrictMode: true,
};
