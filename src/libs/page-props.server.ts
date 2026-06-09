import {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
} from "next";
import { serverSideTranslations, } from "next-i18next/pages/serverSideTranslations";

import { getLocaleFromRequest, } from "./i18n/locale";
import { type ServerSideOptions, } from "./page-props.shared";

const loadSession = async (
    context: GetServerSidePropsContext
) =>
{
    const { getServerSession, } = await import ("next-auth/next");
    const { authOptions, } = await import ("../../pages/api/auth/[...nextauth]");

    return getServerSession (context.req, context.res, authOptions);
};

export const buildGetServerSideProps = (
    options: ServerSideOptions
): GetServerSideProps =>
    async (
        context: GetServerSidePropsContext
    ): Promise<GetServerSidePropsResult<Record<string, unknown>>> =>
    {
        if (options.requireAuth)
        {
            const session = await loadSession (context);

            if (! session)
            {
                return {
                    redirect: {
                        destination: options.redirectTo || "/admin/auth/login",
                        permanent: false,
                    },
                };
            }
        }

        if (options.requireGuest)
        {
            const session = await loadSession (context);

            if (session)
            {
                return {
                    redirect: {
                        destination: options.redirectTo || "/admin/dashboard",
                        permanent: false,
                    },
                };
            }
        }

        if (options.requireParams?.length)
        {
            for (const param of options.requireParams)
            {
                const value = context.params?.[param] || context.query?.[param];

                if (! value)
                {
                    return {
                        redirect: {
                            destination: options.redirectTo || "/admin/auth/login",
                            permanent: false,
                        },
                    };
                }
            }
        }

        if (options.requireQuery?.length)
        {
            for (const param of options.requireQuery)
            {
                if (! context.query?.[param])
                {
                    return {
                        redirect: {
                            destination: options.redirectTo || "/admin/auth/login",
                            permanent: false,
                        },
                    };
                }
            }
        }

        const locale = getLocaleFromRequest (context.req);

        const props: Record<string, unknown> = {
            title: options.title,
            ... (await serverSideTranslations (locale, options.namespaces)),
        };

        if (context.params?.email)
        {
            props.email = context.params.email;
        }

        const queryEmail = context.query.email as string | undefined;

        if (queryEmail)
        {
            props.email = queryEmail;
        }

        const token = context.query.token as string | undefined;

        if (token)
        {
            props.token = token;
        }

        const signed = context.query.signed as string | undefined;

        if (signed)
        {
            props.signed = signed;
        }

        const status = context.query.status as string | undefined;

        if (status)
        {
            props.status = status;
        }

        return { props, };
    };
