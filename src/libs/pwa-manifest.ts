import { defaultBrandColors, } from "@/libs/branding";

export type PwaManifestIcon = {
    src: string;
    sizes: string;
    type: string;
    purpose?: "any" | "maskable";
};

export type PwaManifestDefinition = {
    id: string;
    short_name: string;
    name: string;
    description: string;
    start_url: string;
    scope: string;
    display: "standalone";
    orientation: "portrait";
    theme_color: string;
    background_color: string;
    icons: PwaManifestIcon[];
};

type PwaManifestInput = {
    name: string;
    shortName: string;
    description: string;
    id?: string;
    startUrl?: string;
    scope?: string;
    themeColor?: string;
    backgroundColor?: string;
    icons?: PwaManifestIcon[];
};

export function resolvePwaIcons (): PwaManifestIcon[] {
    return [
        {
            src: "/manifest/icon-192x192.png",
            sizes: "192x192",
            type: "image/png",
            purpose: "any",
        },
        {
            src: "/manifest/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "any",
        },
        {
            src: "/manifest/icon-512x512.png",
            sizes: "512x512",
            type: "image/png",
            purpose: "maskable",
        },
    ];
}

export function createPwaManifest ({
    name,
    shortName,
    description,
    id = "/",
    startUrl = "/",
    scope = "/",
    themeColor = defaultBrandColors.primary,
    backgroundColor = "#FFFFFF",
    icons,
}: PwaManifestInput): PwaManifestDefinition {
    const short_name =
        shortName.length > 12 ? shortName.slice (0, 12).trim () : shortName;

    return {
        id,
        short_name,
        name,
        description,
        start_url: startUrl,
        scope,
        display: "standalone",
        orientation: "portrait",
        theme_color: themeColor,
        background_color: backgroundColor,
        icons: icons ?? resolvePwaIcons (),
    };
}

export function resolvePwaManifestHref (): string {
    return "/api/pwa/manifest";
}
