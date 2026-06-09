const { name: projectName, version: projectVersion, } = require ("./package.json");

const isStaticBuild: boolean = process.env.BUILD_STATIC === "true";

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
