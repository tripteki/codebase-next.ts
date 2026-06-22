import type { MetadataRoute, } from "next";

import { createPwaManifest, } from "@/libs/pwa-manifest";
import { publicRuntimeConfig, } from "@/libs/runtime-config";

import { getAppDisplayName, } from "@/libs/page-title";

const manifest = (): MetadataRoute.Manifest =>
    createPwaManifest ({
        name: getAppDisplayName (),
        shortName: publicRuntimeConfig.appName,
        description: `The ${publicRuntimeConfig.appName} WebApp!`,
    });

export const url: string = publicRuntimeConfig.appUrl;

export default manifest;
