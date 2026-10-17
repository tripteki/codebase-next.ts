import { describe, expect, it, } from "vitest";

import { resolveRealtimeDriver, } from "@/libs/realtime-config";

describe ("realtime-config", () =>
{
    it ("defaults to socketio driver", () =>
    {
        expect (resolveRealtimeDriver ()).toBe ("socketio");
        expect (resolveRealtimeDriver ("socketio")).toBe ("socketio");
    });

    it ("resolves echo driver", () =>
    {
        expect (resolveRealtimeDriver ("echo")).toBe ("echo");
    });
});
