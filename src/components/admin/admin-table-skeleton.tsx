import { type ReactElement, } from "react";
import { useTranslation, } from "next-i18next/pages";

import FbSkeleton from "@/components/flowbite/fb-skeleton";
import {
    fbAdminTable,
    fbAdminTableHead,
    fbAdminTableRow,
    fbAdminTableWrap,
} from "@/libs/flowbite-classes";

const AdminTableSkeleton = ({
    rows = 6,
    cols = 5,
}: {
    rows?: number;
    cols?: number;
}): ReactElement =>
{
    const { t, } = useTranslation ("common");
    const columns = Array.from ({ length: cols, }, (_, index) => index + 1);
    const body = Array.from ({ length: rows, }, (_, index) => index + 1);

    return (
        <div className={fbAdminTableWrap} role="status" aria-busy="true" aria-live="polite">
            <span className="sr-only">{t ("loading")}</span>
            <table className={fbAdminTable}>
                <thead className={fbAdminTableHead}>
                    <tr>
                        {columns.map ((column) => (
                            <th key={`head-${column}`} className="px-6 py-3">
                                <FbSkeleton className="h-3 w-20" />
                            </th>
                        ))}
                    </tr>
                </thead>
                <tbody>
                    {body.map ((row) => (
                        <tr key={`row-${row}`} className={fbAdminTableRow}>
                            {columns.map ((column) => (
                                <td key={`cell-${row}-${column}`} className="px-6 py-4">
                                    <FbSkeleton className={column === 1 ? "h-4 w-36" : "h-4 w-24"} />
                                </td>
                            ))}
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
};

export default AdminTableSkeleton;
