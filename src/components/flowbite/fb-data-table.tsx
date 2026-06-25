"use client";

import { DataTable, } from "simple-datatables";
import {
    useEffect,
    useId,
    useRef,
    type ReactElement,
    type ReactNode,
} from "react";

import { fbDataTable, fbDataTableWrap, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";

export type FbDataTableProps = {
    tableId?: string;
    options?: Record<string, unknown>;
    className?: string;
    children: ReactNode;
};

const FbDataTable = ({
    tableId,
    options,
    className,
    children,
}: FbDataTableProps): ReactElement => {
    const generatedId = useId ().replace (/:/g, "");
    const resolvedId = tableId ?? `fb-datatable-${generatedId}`;
    const tableRef = useRef<HTMLTableElement> (null);
    const instanceRef = useRef<DataTable | null> (null);

    useEffect((): (() => void) => {
        if (! tableRef.current) {
            return (): void => {};
        }

        instanceRef.current?.destroy ();
        instanceRef.current = new DataTable (tableRef.current, options ?? {});

        return (): void => {
            instanceRef.current?.destroy ();
            instanceRef.current = null;
        };
    }, [ options, resolvedId, ]);

    return (
        <div className={cn (fbDataTableWrap, className)}>
            <table
                id={resolvedId}
                ref={tableRef}
                className={fbDataTable}
            >
                {children}
            </table>
        </div>
    );
};

export default FbDataTable;
