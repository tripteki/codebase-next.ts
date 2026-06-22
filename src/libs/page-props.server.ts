import {
    GetServerSideProps,
    GetServerSidePropsContext,
    GetServerSidePropsResult,
} from "next";
import { getLocaleFromRequest, } from "./i18n/locale";
import { loadPageTranslations, } from "./i18n/load-translations.server";
import { hasValidSession, } from "./auth-session";
import { apiRequestHasSessionCookie, } from "./next-auth-cookies";
import { AUTH_HOME_PATH, AUTH_LOGIN_PATH, } from "./page-auth";
import { type ServerSideOptions, } from "./page-props.shared";

const serializePropsValue = <T,>(value: T): T =>
    JSON.parse (JSON.stringify (value, (_key, entry) =>
        entry === undefined ? null : entry
    )) as T;

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
        let authenticatedSession: Awaited<ReturnType<typeof loadSession>> | null = null;

        const authMode = options.pageAuth?.mode;

        if (authMode === "auth")
        {
            authenticatedSession = await loadSession (context);

            if (! hasValidSession (authenticatedSession))
            {
                return {
                    redirect: {
                        destination: options.pageAuth?.redirectUnauthenticatedTo
                            ?? options.redirectTo
                            ?? AUTH_LOGIN_PATH,
                        permanent: false,
                    },
                };
            }
        }

        if (authMode === "guest")
        {
            const signedOut = context.query.signedOut === "1";

            if (! signedOut && apiRequestHasSessionCookie (context.req))
            {
                const session = await loadSession (context);

                if (hasValidSession (session))
                {
                    return {
                        redirect: {
                            destination: options.pageAuth?.redirectAuthenticatedTo
                                ?? options.redirectTo
                                ?? AUTH_HOME_PATH,
                            permanent: false,
                        },
                    };
                }
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
            ... (await loadPageTranslations (locale, options.namespaces)),
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

        if (authenticatedSession)
        {
            props.session = serializePropsValue (authenticatedSession);
        }

        return { props, };
    };
