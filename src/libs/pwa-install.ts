export type BeforeInstallPromptEvent = Event & {
    prompt: () => Promise<void>;
    userChoice: Promise<{ outcome: "accepted" | "dismissed" }>;
};

let deferredPrompt: BeforeInstallPromptEvent | null = null;
let listenerAttached = false;
const promptWaiters = new Set<
    (prompt: BeforeInstallPromptEvent | null) => void
>();

function notifyPromptWaiters (prompt: BeforeInstallPromptEvent | null): void {
    for (const resolve of promptWaiters) {
        resolve (prompt);
    }

    promptWaiters.clear ();
}

export function attachPwaInstallListener (): void {
    if (typeof window === "undefined" || listenerAttached) {
        return;
    }

    listenerAttached = true;

    window.addEventListener (
        "beforeinstallprompt",
        (event) => {
            event.preventDefault ();
            const installEvent = event as BeforeInstallPromptEvent;
            deferredPrompt = installEvent;
            notifyPromptWaiters (installEvent);
        },
        { capture: true }
    );

    window.addEventListener ("appinstalled", () => {
        deferredPrompt = null;
    });
}

export function getPwaInstallPrompt (): BeforeInstallPromptEvent | null {
    return deferredPrompt;
}

export function clearPwaInstallPrompt (): void {
    deferredPrompt = null;
}

export function waitForPwaInstallPrompt (
    timeoutMs: number = 3_000
): Promise<BeforeInstallPromptEvent | null> {
    if (deferredPrompt) {
        return Promise.resolve (deferredPrompt);
    }

    return new Promise ((resolve) => {
        const timerId = setTimeout (() => {
            promptWaiters.delete (finish);
            resolve (deferredPrompt);
        }, timeoutMs);

        const finish = (prompt: BeforeInstallPromptEvent | null): void => {
            clearTimeout (timerId);
            promptWaiters.delete (finish);
            resolve (prompt ?? deferredPrompt);
        };

        promptWaiters.add (finish);
    });
}

export async function requestPwaInstall (): Promise<
    "accepted" | "dismissed" | "unavailable"
> {
    const prompt = deferredPrompt ?? (await waitForPwaInstallPrompt (0));

    if (! prompt) {
        return "unavailable";
    }

    await prompt.prompt ();
    const choice = await prompt.userChoice;
    deferredPrompt = null;

    return choice.outcome;
}

export function isStandaloneDisplay (): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    return (
        window.matchMedia ("(display-mode: standalone)").matches ||
        (window.navigator as Navigator & { standalone?: boolean })
            .standalone === true
    );
}

export function isIosDevice (): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    return /iPhone|iPad|iPod/i.test (navigator.userAgent);
}

export function isAndroidDevice (): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    return /Android/i.test (navigator.userAgent);
}

export function isChromiumInstallBrowser (): boolean {
    if (typeof window === "undefined") {
        return false;
    }

    const userAgent = navigator.userAgent;

    return (
        /Chrome|Chromium|Edg|OPR|SamsungBrowser/i.test (userAgent) &&
        ! /Firefox|FxiOS|EdgiOS|OPiOS|CriOS.*Firefox/i.test (userAgent)
    );
}

export function supportsPwaInstallUi (): boolean {
    return isChromiumInstallBrowser () || isIosDevice () || isAndroidDevice ();
}

export async function isServiceWorkerReady (): Promise<boolean> {
    if (typeof window === "undefined" || ! ("serviceWorker" in navigator)) {
        return false;
    }

    try {
        const registration = await navigator.serviceWorker.getRegistration ();

        if (registration?.active) {
            return true;
        }

        if (! registration) {
            return false;
        }

        await Promise.race ([
            navigator.serviceWorker.ready,
            new Promise<null>((resolve) => {
                setTimeout (() => resolve (null), 400);
            }),
        ]);

        return Boolean (
            (await navigator.serviceWorker.getRegistration ())?.active
        );
    } catch {
        return false;
    }
}

if (typeof window !== "undefined") {
    attachPwaInstallListener ();
}
