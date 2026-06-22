export function urlBase64ToUint8Array (base64String: string): Uint8Array {
    const padding = "=".repeat ((4 - (base64String.length % 4)) % 4);
    const base64 = (base64String + padding)
        .replace (/\-/g, "+")
        .replace (/_/g, "/");
    const rawData = window.atob (base64);
    const outputArray = new Uint8Array (rawData.length);

    for (let index = 0; index < rawData.length; index++) {
        outputArray[index] = rawData.charCodeAt (index);
    }

    return outputArray;
}

export function isWebPushSupported (vapidPublicKey?: string): boolean {
    return (
        typeof window !== "undefined" &&
        "Notification" in window &&
        "PushManager" in window &&
        "serviceWorker" in navigator &&
        Boolean (vapidPublicKey?.trim ())
    );
}

const SERVICE_WORKER_READY_TIMEOUT_MS = 15_000;
const DEV_SERVICE_WORKER_FALLBACK_DELAY_MS = 2_000;

type ResolveServiceWorkerOptions = {
    timeoutMs?: number;
    getPwaRegistration?: () => ServiceWorkerRegistration | undefined;
    onRegistered?: (
        callback: (payload: {
            url: string;
            registration?: ServiceWorkerRegistration;
        }) => void
    ) => void;
    offRegistered?: (
        callback: (payload: {
            url: string;
            registration?: ServiceWorkerRegistration;
        }) => void
    ) => void;
    registrationFailed?: () => boolean;
};

async function registerDevServiceWorker (): Promise<ServiceWorkerRegistration | null> {
    return null;
}

export async function resolveServiceWorkerRegistration ({
    timeoutMs = SERVICE_WORKER_READY_TIMEOUT_MS,
    getPwaRegistration,
    onRegistered,
    offRegistered,
    registrationFailed,
}: ResolveServiceWorkerOptions = {}): Promise<ServiceWorkerRegistration> {
    if (typeof window === "undefined" || ! ("serviceWorker" in navigator)) {
        throw new Error ("Service Worker not supported.");
    }

    const existing = await navigator.serviceWorker.getRegistration ();

    if (existing) {
        return existing;
    }

    const fromPwa = getPwaRegistration?.();

    if (fromPwa) {
        return fromPwa;
    }

    return new Promise ((resolve, reject) => {
        let settled = false;

        const finish = (registration: ServiceWorkerRegistration): void => {
            if (settled) {
                return;
            }

            settled = true;
            cleanup ();
            resolve (registration);
        };

        const fail = (error: Error): void => {
            if (settled) {
                return;
            }

            settled = true;
            cleanup ();
            reject (error);
        };

        const onHookRegistered = ({
            registration,
        }: {
            url: string;
            registration?: ServiceWorkerRegistration;
        }): void => {
            if (registration) {
                finish (registration);
            }
        };

        const cleanup = (): void => {
            clearTimeout (timerId);

            if (devFallbackId !== undefined) {
                clearTimeout (devFallbackId);
            }

            clearInterval (pollId);
            offRegistered?.(onHookRegistered);
        };

        onRegistered?.(onHookRegistered);

        void navigator.serviceWorker.ready
            .then (finish)
            .catch ((error: unknown) => {
                fail (
                    error instanceof Error
                        ? error
                        : new Error ("Service worker failed to activate.")
                );
            });

        const pollId = setInterval (() => {
            void (async () => {
                const pwaRegistration = getPwaRegistration?.();
                const activeRegistration =
                    pwaRegistration ??
                    (await navigator.serviceWorker.getRegistration ());

                if (activeRegistration) {
                    finish (activeRegistration);
                }
            })();
        }, 300);

        const devFallbackId = process.env.NODE_ENV === "development"
            ? setTimeout (() => {
                  void (async () => {
                      if (settled) {
                          return;
                      }

                      const devRegistration = await registerDevServiceWorker ();

                      if (devRegistration) {
                          try {
                              finish (await navigator.serviceWorker.ready);
                          } catch (error) {
                              fail (
                                  error instanceof Error
                                      ? error
                                      : new Error (
                                            "Service worker failed to activate."
                                        )
                              );
                          }
                      }
                  })();
              }, DEV_SERVICE_WORKER_FALLBACK_DELAY_MS)
            : undefined;

        const timerId = setTimeout (() => {
            void (async () => {
                if (registrationFailed?.()) {
                    fail (
                        new Error (
                            "Service worker registration failed. Check the browser console for details."
                        )
                    );
                    return;
                }

                const devRegistration = await registerDevServiceWorker ();

                if (devRegistration) {
                    try {
                        finish (await navigator.serviceWorker.ready);
                    } catch (error) {
                        fail (
                            error instanceof Error
                                ? error
                                : new Error (
                                      "Service worker failed to activate."
                                  )
                        );
                    }

                    return;
                }

                fail (
                    new Error (
                        "Service worker is not ready yet. Reload the page and try again."
                    )
                );
            })();
        }, timeoutMs);
    });
}

export async function waitForServiceWorkerRegistration (
    timeoutMs: number = SERVICE_WORKER_READY_TIMEOUT_MS
): Promise<ServiceWorkerRegistration> {
    return resolveServiceWorkerRegistration ({ timeoutMs });
}
