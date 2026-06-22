import { describe, expect, it, } from "vitest";

import { resolveRealtimeDriver, } from "@/libs/realtime-config";

describe ("realtime-config", () =>
{
    it ("defaults to echo driver", () =>
    {
        expect (resolveRealtimeDriver ()).toBe ("echo");
        expect (resolveRealtimeDriver ("echo")).toBe ("echo");
    });

    it ("resolves socketio driver", () =>
    {
        expect (resolveRealtimeDriver ("socketio")).toBe ("socketio");
    });
});
