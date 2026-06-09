import type { MetadataRoute, } from "next";
import { publicRuntimeConfig, } from "@/libs/runtime-config";

import { getAppDisplayName, } from "@/libs/page-title";


const manifest = (): MetadataRoute.Manifest => ({
    id: "/",
    short_name: publicRuntimeConfig.appName,
    name: getAppDisplayName (),
    description: `The ${publicRuntimeConfig.appName} WebApp!`,
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",
    icons: [
        {
            src: "/manifest/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
        },
        {
            src: "/manifest/icon-384x384.png",
            sizes: "384x384",
            type: "image/png",
        },
        {
            src: "/manifest/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
        },
    ],
});

export const url: string = publicRuntimeConfig.appUrl;

export default manifest;
