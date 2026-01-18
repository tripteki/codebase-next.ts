import { ReactElement, type PropsWithChildren, } from "react";
import Link from "next/link";

import HeaderLayout from "@/layouts/header.layout";
import FooterLayout from "@/layouts/footer.layout";
import AppLogoIcon from "@/components/app-logo-icon";
import { type AuthLayoutProps, } from "@/types/admin/auth";

const AuthLayout = ({
    children,
    title,
    description,
}: PropsWithChildren<AuthLayoutProps>): ReactElement =>
{
    return (
        <div className="min-h-screen flex flex-col bg-background">
            <HeaderLayout />

            <main className="flex-1 flex items-center justify-center p-6 md:p-10">
                <div className="w-full max-w-sm">
                    <div className="flex flex-col gap-8">
                        <div className="flex flex-col items-center gap-4">
                            <Link
                                href="/"
                                className="flex flex-col items-center gap-2 font-medium"
                            >
                                <div className="mb-1 flex h-9 w-9 items-center justify-center rounded-md">
                                    <AppLogoIcon className="size-9 fill-current text-[var(--foreground)] dark:text-white" />
                                </div>
                                <span className="sr-only">{title}</span>
                            </Link>

                            <div className="space-y-2 text-center">
                                <h1 className="text-xl font-medium">{title}</h1>
                                <p className="text-center text-sm text-muted-foreground">
                                    {description}
                                </p>
                            </div>
                        </div>
                        {children}
                    </div>
                </div>
            </main>

            <FooterLayout />
        </div>
    );
};

export default AuthLayout;
