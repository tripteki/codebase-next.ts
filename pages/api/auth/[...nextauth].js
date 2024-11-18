"use strict";

import getConfig from "next/config";
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { call, } from "@/lib/call";

const { serverRuntimeConfig, publicRuntimeConfig, } = getConfig ();

/**
 * @type {import("next-auth").NextAuthOptions}
 */
export default NextAuth (
{
    /**
     * @type {Object}
     * @property {boolean} jwt
     */
    session: { jwt: true, },

    /**
     * @type {string}
     */
    secret: serverRuntimeConfig.secret,

    /**
     * @type {Object}
     * @property {function(Object): Promise<Object>} jwt
     * @property {function(Object): Promise<Object>} session
     */
    callbacks:
    {
        /**
         * @param {Object} param0
         * @param {Object} param0.token
         * @param {Object} param0.user
         * @returns {Promise<Object>}
         */
        async jwt ({ token, user, })
        {
            if (user) {

                token.jwt = user?.token;
                token.user = user?.user;
            }

            return token;
        },

        /**
         * @param {Object} param0
         * @param {Object} param0.session
         * @param {Object} param0.token
         * @returns {Promise<Object>}
         */
        async session ({ session, token, })
        {
            if (token) {

                session.jwt = token?.jwt;
                session.user = token?.user;
            }

            return session;
        },
    },

    /**
     * @type {Array}
     * @property {import("next-auth").Provider} providers
     */
    providers:
    [
        CredentialsProvider (
        {
            /**
             * @type {string}
             */
            name: "Credentials",

            /**
             * @type {Object}
             * @property {Object} email
             * @property {Object} password
             */
            credentials:
            {
                email: { label: "Email", type: "email", },
                password: { label: "Password", type: "password", },
                remember: { label: "Remember", type: "checkbox", },
            },

            /**
             * @param {Object} credentials
             * @param {string} credentials.email
             * @param {string} credentials.password
             * @returns {Promise<Object|null>}
             */
            async authorize (credentials)
            {
                const formData = {

                    email: credentials.email,
                    password: credentials.password,
                    remember: credentials.remember,
                };

                let token = await call (
                {
                    baseUrl: publicRuntimeConfig.authURL,
                    url: "/login",
                    method: "POST",
                    data: formData,
                });

                if (token.isError) {

                    throw new Error (JSON.stringify (token.error?.response?.data?.data));

                    return null;
                }

                token = token.data?.data?.token;

                let user = await call (
                {
                    baseUrl: publicRuntimeConfig.authURL,
                    url: "/me",
                    headers: { Authorization: `Bearer ${token}`, },
                    method: "GET",
                });

                user = user.data?.data;

                return { token, user, };
            },
        }),
    ],
});