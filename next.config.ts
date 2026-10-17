const { name: projectName, version: projectVersion, } = require ("./package.json");

const isStaticBuild: boolean = process.env.BUILD_STATIC === "true";
const isStandaloneBuild: boolean = process.env.BUILD_STANDALONE === "true";

module.exports = {

    env: {

        NEXT_PUBLIC_BUILD_STATIC: isStaticBuild ? "true" : "false",
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
        ... (isStandaloneBuild ? { output: "standalone", } : {}),
    }),

    ... (isStaticBuild ? {} : {
        async redirects ()
        {
            return [
                {
                    source: "/admin/auth/:path*",
                    destination: "/auth/:path*",
                    permanent: false,
                },
            ];
        },
        async rewrites ()
        {
            return [
                {
                    source: "/storage/:path*",
                    destination: "/api/storage/:path*",
                },
                {
                    source: "/manifest.webmanifest",
                    destination: "/api/manifest",
                },
                {
                    source: "/api/pwa/manifest",
                    destination: "/api/manifest",
                },
            ];
        },
    }),

    devIndicators: false,
    reactStrictMode: true,
};
