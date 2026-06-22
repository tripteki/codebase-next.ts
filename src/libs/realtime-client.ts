import type Echo from "laravel-echo";
import { io, type Socket, } from "socket.io-client";

import { createEcho, } from "@/libs/echo";
import {
    buildRealtimeConnectionConfig,
    type RealtimeConnectionConfig,
    type RealtimeDriver,
} from "@/libs/realtime-config";

export type RealtimeEventHandler = (
    payload: Record<string, unknown>
) => void;

export type RealtimeClient = {
    driver: RealtimeDriver;
    subscribeUserEvent: (
        userId: string,
        eventName: string,
        handler: RealtimeEventHandler
    ) => void;
    unsubscribe: () => void;
    disconnect: () => void;
};

const userRoomEventName = (eventName: string): string =>
    eventName.startsWith (".") ? eventName : `.${eventName}`;

const createEchoRealtimeClient = (
    accessToken: string,
    config: RealtimeConnectionConfig
): RealtimeClient =>
{
    const echo = createEcho (accessToken, {
        apiUrl: config.apiUrl,
        reverbAppKey: config.reverbAppKey,
        reverbHost: config.reverbHost,
        reverbPort: config.reverbPort,
        reverbScheme: config.reverbScheme,
    });

    let channelName: string | null = null;

    return {
        driver: "echo",
        subscribeUserEvent (userId, eventName, handler)
        {
            channelName = `user.${userId}`;
            echo.private (channelName).listen (
                userRoomEventName (eventName),
                handler
            );
        },
        unsubscribe ()
        {
            if (channelName)
            {
                echo.leave (channelName);
                channelName = null;
            }
        },
        disconnect ()
        {
            if (channelName)
            {
                echo.leave (channelName);
                channelName = null;
            }

            echo.disconnect ();
        },
    };
};

const createSocketIoRealtimeClient = (
    accessToken: string,
    config: RealtimeConnectionConfig
): RealtimeClient =>
{
    const socket: Socket = io (config.apiUrl, {
        path: config.socketPath,
        transports: [ "websocket", "polling", ],
        auth: { token: accessToken, },
        extraHeaders: {
            Authorization: `Bearer ${accessToken}`,
        },
    });

    const handlers = new Map<string, RealtimeEventHandler> ();

    return {
        driver: "socketio",
        subscribeUserEvent (userId, eventName, handler)
        {
            const wrapped: RealtimeEventHandler = (payload) =>
            {
                const payloadUserId = payload.userId ?? payload.user_id;

                if (
                    payloadUserId !== undefined
                    && String (payloadUserId) !== String (userId)
                )
                {
                    return;
                }

                handler (payload);
            };

            handlers.set (eventName, wrapped);
            socket.on (eventName, wrapped);
        },
        unsubscribe ()
        {
            for (const [ eventName, handler, ] of handlers.entries ())
            {
                socket.off (eventName, handler);
            }

            handlers.clear ();
        },
        disconnect ()
        {
            for (const [ eventName, handler, ] of handlers.entries ())
            {
                socket.off (eventName, handler);
            }

            handlers.clear ();
            socket.disconnect ();
        },
    };
};

export const createRealtimeClient = (
    accessToken: string,
    overrides: Partial<RealtimeConnectionConfig> = {}
): RealtimeClient =>
{
    const config = buildRealtimeConnectionConfig (overrides);

    if (! accessToken)
    {
        throw new Error ("Realtime access token is required.");
    }

    if (config.driver === "socketio")
    {
        return createSocketIoRealtimeClient (accessToken, config);
    }

    return createEchoRealtimeClient (accessToken, config);
};

export type { Echo, Socket, };
