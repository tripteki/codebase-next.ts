const { NextConfig, } = require ("next");
const { name: projectName, version: projectVersion, } = require ("./package.json");

const isStaticBuild: boolean = process.env.BUILD_STATIC === "true";

module.exports = {

    // https://stackoverflow.com/questions/64261029/next-js-env-vs-serverruntimeconfig
    // https://nextjs.org/docs/pages/api-reference/next-config-js/runtime-configuration

    env: {

        NEXT_PUBLIC_BUILD_STATIC: isStaticBuild ? "true" : "false",
    },

    serverRuntimeConfig: {

        secret: process.env.SECRET,
    },

    publicRuntimeConfig: {

        appName: process.env.NEXT_PUBLIC_APP_NAME || projectName || "codebase",
        appVersion: process.env.NEXT_PUBLIC_APP_VERSION || projectVersion || "1.0.0",
        appUrl: process.env.NEXT_PUBLIC_APP_URL || "http://frontend.localhost",
        baseURL: process.env.NEXT_PUBLIC_BASE_URL || "http://api.backend.localhost",
        authURL: process.env.NEXT_PUBLIC_AUTH_URL || "http://api.backend.localhost/auth",
        apiUrl: process.env.NEXT_PUBLIC_API_URL || "http://api.backend.localhost",
        reverbAppKey: process.env.NEXT_PUBLIC_REVERB_APP_KEY || "",
        reverbHost: process.env.NEXT_PUBLIC_REVERB_HOST || "127.0.0.1",
        reverbPort: process.env.NEXT_PUBLIC_REVERB_PORT || "8080",
        reverbScheme: process.env.NEXT_PUBLIC_REVERB_SCHEME || "http",
        env: process.env.NEXT_PUBLIC_APP_ENV || "production",
    },

    ... (isStaticBuild ? {
        output: "export",
        trailingSlash: true,
        pageExtensions: [ "static.tsx", ],
        images: {
            unoptimized: true,
        },
    } : {
        distDir: "public/.next",
        pageExtensions: [ "page.tsx", "page.ts", "ts", ],
    }),

    ... (isStaticBuild ? {} : {
        async rewrites ()
        {
            return [
                {
                    source: "/manifest.webmanifest",
                    destination: "/api/manifest",
                },
            ];
        },
    }),

    devIndicators: false,
    reactStrictMode: true,
};
