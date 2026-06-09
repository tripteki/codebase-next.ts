import { name as projectName, version as projectVersion, } from "../../package.json";

export type PublicRuntimeConfig = {

    appName: string;
    appVersion: string;
    appUrl: string;
    baseURL: string;
    authURL: string;
    apiUrl: string;
    reverbAppKey: string;
    reverbHost: string;
    reverbPort: string;
    reverbScheme: string;
    env: string;
};

export const publicRuntimeConfig: PublicRuntimeConfig = {

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
};

export const serverRuntimeConfig = {

    secret: process.env.SECRET,
};
