import { type ReactElement, useEffect, useState, } from "react";
import Link from "next/link";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import AdminFrame from "@/components/admin/admin-frame";
import AlertError from "@/components/alert-error";
import { useRequireAuth, } from "@/hooks/auth-guard";
import { searchAdmin, } from "@/libs/admin-api";
import { resolveCallErrorMessage, } from "@/libs/call-message";
import { fbMuted, } from "@/libs/flowbite-classes";
import type { AdminSearchResult, } from "@/types/admin/search";

const AdminSearchPage = (): ReactElement | null =>
{
    const canRender = useRequireAuth ();
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const [result, setResult] = useState<AdminSearchResult | null> (null);
    const [error, setError] = useState ("");
    const q = String (router.query.q || "");
    const category = String (router.query.category || "all");

    useEffect (() =>
    {
        if (q.trim ().length < 2)
        {
            return;
        }

        void searchAdmin (q, category).then ((response) =>
        {
            if (! response.isSuccess)
            {
                setError (resolveCallErrorMessage (response.error, t ("something_went_wrong")));

                return;
            }

            setResult (response.data as AdminSearchResult);
        });
    }, [q, category, t]);

    if (! canRender)
    {
        return null;
    }

    return (
        <AdminFrame title={t ("search")}>
            <AlertError message={error} />
            {! result ? <p className={fbMuted}>{t ("no_results")}</p> : null}
            {(result?.results || []).map ((group) => (
                <section key={group.category} className="space-y-2">
                    <h2 className="text-lg font-semibold">{t (group.category)}</h2>
                    {group.items.length === 0 ? <p className={fbMuted}>{t ("no_results")}</p> : (
                        <ul className="space-y-1 text-sm">
                            {group.items.map ((item) => (
                                <li key={item.id}>
                                    <Link className="underline" href={item.url}>{item.title}</Link>
                                    {item.subtitle ? <span className={fbMuted}> — {item.subtitle}</span> : null}
                                </li>
                            ))}
                        </ul>
                    )}
                </section>
            ))}
        </AdminFrame>
    );
};

export { AdminSearchPage, };
export default AdminSearchPage;
