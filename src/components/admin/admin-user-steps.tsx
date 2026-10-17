import { type ReactElement, } from "react";

type AdminUserStep = {
    key: string;
    label: string;
};

type AdminUserStepsProps = {
    value: string;
    items: AdminUserStep[];
    onChange: (value: string) => void;
};

const AdminUserSteps = ({ value, items, onChange, }: AdminUserStepsProps): ReactElement =>
{
    return (
        <ol className="flex w-full items-center overflow-x-auto border-b border-gray-200 px-3 py-4 text-sm font-medium sm:px-6 dark:border-gray-700">
            {items.map ((item, index) => (
                <li
                    key={item.key}
                    className={`flex shrink-0 items-center ${index < items.length - 1 ? "after:mx-2 after:hidden after:h-px after:w-8 after:border-b after:border-gray-200 sm:after:inline-block sm:after:w-full sm:flex-1 dark:after:border-gray-700" : ""}`}>
                    <button type="button" className="flex items-center" onClick={() => onChange (item.key)}>
                        <span className="me-1 flex h-6 w-6 shrink-0 items-center justify-center rounded-full bg-green-100 sm:me-2 sm:h-8 sm:w-8 dark:bg-green-800">
                            <svg className="h-3 w-3 text-green-600 sm:h-4 sm:w-4 dark:text-green-300" fill="currentColor" viewBox="0 0 20 20" aria-hidden="true">
                                <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                            </svg>
                        </span>
                        <span className={`whitespace-nowrap text-xs sm:text-sm ${value === item.key ? "text-[var(--brand-primary)]" : "text-gray-500 dark:text-gray-400"}`}>
                            {item.label}
                        </span>
                    </button>
                </li>
            ))}
        </ol>
    );
};

export default AdminUserSteps;
