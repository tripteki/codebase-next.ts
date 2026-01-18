export const dynamic = "force-static";
import type { MetadataRoute, } from "next";
import getConfig from "next/config";

const { publicRuntimeConfig, } = getConfig ();

const Metadata = (): MetadataRoute.Manifest => ({
    short_name: publicRuntimeConfig.appName,
    name: publicRuntimeConfig.appName.charAt (0).toUpperCase () + publicRuntimeConfig.appName.slice (1),
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

export default Metadata;
