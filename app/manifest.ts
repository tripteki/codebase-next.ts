"use strict";

import type { MetadataRoute, } from 'next';
import getConfig from "next/config";

const { publicRuntimeConfig, } = getConfig ();

const manifest = (): MetadataRoute.Manifest => ({

    name: publicRuntimeConfig.appName,
    short_name: publicRuntimeConfig.appName,

    id: "/",
    start_url: "/",
    display: "standalone",
    orientation: "portrait",
    theme_color: "#FFFFFF",
    background_color: "#FFFFFF",

    icons: [

        {
            src: "/manifest/android-chrome-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
        },
        {
            src: "/manifest/android-chrome-384x384.png",
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
