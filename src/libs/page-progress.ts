import Router from "next/router";
import NProgress from "nprogress";

const MINIMUM_MS = 280;

let bound = false;
let startedAt = 0;
let hideTimer: ReturnType<typeof setTimeout> | undefined;

function start (): void
{
    if (hideTimer)
    {
        clearTimeout (hideTimer);
    }

    startedAt = Date.now ();
    NProgress.start ();
}

function done (): void
{
    const wait = Math.max (0, MINIMUM_MS - (Date.now () - startedAt));

    if (hideTimer)
    {
        clearTimeout (hideTimer);
    }

    hideTimer = setTimeout (() =>
    {
        NProgress.done ();
    }, wait);
}

export function bindPageProgress (): void
{
    if (bound || typeof window === "undefined")
    {
        return;
    }

    bound = true;

    NProgress.configure ({
        showSpinner: false,
        trickleSpeed: 120,
        minimum: 0.08,
        easing: "ease",
        speed: 280,
    });

    Router.events.on ("routeChangeStart", start);
    Router.events.on ("routeChangeComplete", done);
    Router.events.on ("routeChangeError", done);
}
