import { type FormEvent, type ReactElement, useEffect, useRef, useState, } from "react";
import Link from "next/link";
import { useRouter, } from "next/router";
import { useTranslation, } from "next-i18next/pages";

import { useAdminAccess, } from "@/hooks/use-admin-access";
import { searchAdmin, } from "@/libs/admin-api";
import { ADMIN_SEARCH_CATEGORIES, type AdminSearchCategory, } from "@/libs/admin-search-categories";
import { fbMuted, } from "@/libs/flowbite-classes";
import { cn, } from "@/libs/utils";
import type { AdminSearchResult, } from "@/types/admin/search";

const AdminSearchBox = ({
    variant = "desktop",
}: {
    variant?: "desktop" | "sidebar";
}): ReactElement | null =>
{
    const isSidebar = variant === "sidebar";
    const router = useRouter ();
    const { t, } = useTranslation ("common");
    const { can, loaded, } = useAdminAccess ();
    const rootRef = useRef<HTMLDivElement | null> (null);
    const [query, setQuery] = useState ("");
    const [category, setCategory] = useState<AdminSearchCategory> ("all");
    const [categoryOpen, setCategoryOpen] = useState (false);
    const [open, setOpen] = useState (false);
    const [searching, setSearching] = useState (false);
    const [result, setResult] = useState<AdminSearchResult | null> (null);
    const categories = ADMIN_SEARCH_CATEGORIES.filter ((item) => ! item.permission || can (item.permission));
    const hasSearchAccess = ! loaded || categories.some ((item) => item.key !== "all");
    const groups = (result?.results ?? []).filter ((group) => group.items.length > 0);
    const categoryLabel = category === "all" ? t ("search_category_all") : t (category);

    useEffect (() =>
    {
        function onDocumentClick (event: MouseEvent): void
        {
            const target = event.target;

            if (! (target instanceof Node) || ! rootRef.current?.contains (target))
            {
                setCategoryOpen (false);
                setOpen (false);
            }
        }

        document.addEventListener ("click", onDocumentClick);

        return () => document.removeEventListener ("click", onDocumentClick);
    }, []);

    useEffect (() =>
    {
        const q = query.trim ();

        if (q.length < 2)
        {
            setResult (null);
            setSearching (false);

            return;
        }

        setOpen (true);
        setSearching (true);
        const timer = window.setTimeout (() =>
        {
            void searchAdmin (q, category).then ((response) =>
            {
                setSearching (false);

                if (! response.isSuccess)
                {
                    setResult (null);

                    return;
                }

                setResult (response.data as AdminSearchResult);
            });
        }, 300);

        return () => window.clearTimeout (timer);
    }, [query, category]);

    function submit (event: FormEvent): void
    {
        event.preventDefault ();
        const q = query.trim ();

        if (q.length < 2)
        {
            return;
        }

        setCategoryOpen (false);
        setOpen (false);
        void router.push ({ pathname: "/admin/search", query: { q, category, }, });
    }

    if (! hasSearchAccess)
    {
        return null;
    }

    return (
        <div ref={rootRef} className={isSidebar ? "relative w-full min-w-0 lg:hidden" : "relative hidden min-w-0 flex-1 sm:block sm:max-w-md lg:max-w-xl"}>
            <form className="focus-within-brand flex items-stretch -space-x-px rounded-lg shadow-sm focus-within:ring-2" role="search" onSubmit={submit}>
                {isSidebar ? null : (
                <div className="relative flex shrink-0 items-stretch">
                    <button
                        type="button"
                        data-test="search-category-toggle"
                        className="inline-flex h-full shrink-0 cursor-pointer items-center rounded-s-lg border border-gray-300 bg-gray-50 px-4 py-2.5 text-sm font-medium leading-5 text-gray-600 hover:bg-gray-100 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-gray-300 dark:hover:bg-gray-700"
                        aria-expanded={categoryOpen}
                        aria-label={t ("search")}
                        onClick={(event) =>
                        {
                            event.stopPropagation ();
                            setCategoryOpen ((value) => ! value);
                            setOpen (false);
                        }}
                    >
                        <span className="max-w-[7rem] truncate">{categoryLabel}</span>
                        <svg className="ms-1.5 h-4 w-4 shrink-0" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="m19 9-7 7-7-7" />
                        </svg>
                    </button>
                    {categoryOpen ? (
                        <div data-test="search-category-menu" className="absolute start-0 top-[calc(100%+8px)] z-[60] w-44 overflow-hidden rounded-lg border border-gray-200 bg-white py-1 text-sm shadow-lg dark:border-gray-600 dark:bg-gray-800">
                            {categories.map ((item) => (
                                <button
                                    key={item.key}
                                    type="button"
                                    data-test="search-category-option"
                                    className={cn (
                                        "block w-full cursor-pointer px-4 py-2 text-start text-gray-700 hover:bg-gray-100 dark:text-gray-300 dark:hover:bg-gray-700",
                                        category === item.key && "bg-gray-50 font-medium dark:bg-gray-700"
                                    )}
                                    onClick={(event) =>
                                    {
                                        event.stopPropagation ();
                                        setCategory (item.key);
                                        setCategoryOpen (false);

                                        if (query.trim ().length >= 2)
                                        {
                                            setOpen (true);
                                        }
                                    }}
                                >
                                    {item.key === "all" ? t ("search_category_all") : t (item.key)}
                                </button>
                            ))}
                        </div>
                    ) : null}
                </div>
                )}
                <div className="relative flex min-w-0 flex-1 items-stretch">
                    <label className="sr-only" htmlFor={isSidebar ? "admin-sidebar-search" : "admin-global-search"}>{t ("search")}</label>
                    <input
                        id={isSidebar ? "admin-sidebar-search" : "admin-global-search"}
                        data-test="admin-search-input"
                        type="search"
                        value={query}
                        autoComplete="off"
                        className={isSidebar
                            ? "block h-full w-full min-w-0 rounded-lg border border-white/20 bg-white/10 px-3 py-2.5 text-sm text-white placeholder:text-white/60 focus:outline-none"
                            : "block h-full w-full min-w-0 rounded-none border border-gray-300 border-s-0 bg-gray-50 px-3 py-2.5 text-sm leading-5 text-gray-900 placeholder:text-gray-500 focus:border-gray-300 focus:outline-none focus:ring-0 dark:border-gray-600 dark:bg-gray-800 dark:text-white dark:placeholder:text-gray-400 dark:focus:border-gray-600"}
                        placeholder={t ("search_placeholder")}
                        onChange={(event) => setQuery (event.target.value)}
                        onFocus={() =>
                        {
                            setCategoryOpen (false);
                            setOpen (true);
                        }}
                    />
                    {query.length > 0 ? (
                        <button
                            type="button"
                            className="absolute inset-y-0 end-0 flex cursor-pointer items-center pe-3 text-gray-400 hover:text-gray-600 dark:hover:text-gray-300"
                            aria-label={t ("search_clear")}
                            onClick={(event) =>
                            {
                                event.stopPropagation ();
                                setQuery ("");
                                setResult (null);
                            }}
                        >
                            <svg className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" aria-hidden="true">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18 18 6M6 6l12 12" />
                            </svg>
                        </button>
                    ) : null}
                </div>
                {isSidebar ? null : (
                    <button type="submit" className="btn-brand-primary inline-flex shrink-0 cursor-pointer items-center rounded-e-lg px-4 py-2.5 text-sm font-medium leading-5 focus:outline-none focus:ring-0">
                        <img src="/manifest/asset/icon-search.svg" alt="" className="me-1.5 h-4 w-4 shrink-0 object-contain brightness-0 invert" width={16} height={16} />
                        {t ("search")}
                    </button>
                )}
            </form>
            {open ? (
                <div data-test="admin-search-results" className="absolute start-0 end-0 top-[calc(100%+8px)] z-50 max-h-80 overflow-y-auto rounded-lg border border-gray-200 bg-white text-sm shadow-lg dark:border-gray-600 dark:bg-gray-800">
                    {searching ? (
                        <p className={cn (fbMuted, "px-4 py-4 text-center")}>{t ("loading")}</p>
                    ) : query.trim ().length < 2 ? (
                        <p className={cn (fbMuted, "px-4 py-4 text-center")}>{t ("search_min_chars")}</p>
                    ) : groups.length === 0 ? (
                        <p className={cn (fbMuted, "px-4 py-4 text-center")}>{t ("search_not_found")}</p>
                    ) : (
                        <div className="divide-y divide-gray-100 dark:divide-gray-600">
                            {groups.map ((group) => (
                                <section key={group.category}>
                                    <div className="px-4 py-2 text-xs font-semibold uppercase tracking-wide text-gray-500 dark:text-gray-400">
                                        {t (group.category)}
                                    </div>
                                    {group.items.map ((item) => (
                                        <Link
                                            key={`${group.category}-${item.id}`}
                                            className="block truncate px-4 py-3 text-gray-900 hover:bg-gray-100 dark:text-white dark:hover:bg-gray-700"
                                            href={item.url}
                                            onClick={() =>
                                            {
                                                setCategoryOpen (false);
                                                setOpen (false);
                                            }}
                                        >
                                            {item.title}
                                        </Link>
                                    ))}
                                </section>
                            ))}
                        </div>
                    )}
                </div>
            ) : null}
        </div>
    );
};

export default AdminSearchBox;
