import { Socket, io, } from "socket.io-client";
import { getSession, } from "next-auth/react";
import { Session, } from "next-auth";
import getConfig from "next/config";

type Detail =
{
    baseUrl?: string;
    url?: string;
};

export const socket = async (
    detail?: Detail
): Promise<Socket | null> => {

    const

    { publicRuntimeConfig, } = getConfig (),
    baseURL: string = detail?.baseUrl ?? publicRuntimeConfig.baseURL;

    try {

        const

        session: Session | null = await getSession (),
        token: string = session?.jwt ?? "";

        const instance: Socket = io (baseURL, {

            path: detail?.url ?? "/socket.io",
            transports: [ "websocket", "polling", ],
            extraHeaders:
            {
                ... (token ? { Authorization: `Bearer ${token}`, } : {}),
            },
        });

        return instance;

    } catch (thrower: any) {

        return null;
    }
};
