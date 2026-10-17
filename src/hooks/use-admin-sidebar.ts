import { useCallback, useSyncExternalStore, } from "react";

type SidebarState = {
    open: boolean;
};

let snapshot: SidebarState = {
    open: false,
};

const listeners = new Set<() => void> ();

function emit (): void
{
    listeners.forEach ((listener) => listener ());
}

function setOpen (open: boolean): void
{
    snapshot = { open, };
    emit ();
}

export function useAdminSidebar ()
{
    const state = useSyncExternalStore (
        useCallback ((listener) =>
        {
            listeners.add (listener);

            return () => listeners.delete (listener);
        }, []),
        () => snapshot,
        () => snapshot
    );

    function toggleOpen (): void
    {
        setOpen (! snapshot.open);
    }

    function close (): void
    {
        setOpen (false);
    }

    return {
        open: state.open,
        toggleOpen,
        close,
    };
}
