// @ts-check

/** @type {import ("next-i18next").UserConfig} */

"use strict";

const i18nConfig = {

    localePath: typeof window === "undefined" ? require ("path").resolve ("./lang") : "./lang",

    i18n: {

        defaultLocale: process.env.NEXT_PUBLIC_APP_LANG || "en",
        locales: [ "en", "id", ]
    },
};

module.exports = i18nConfig;
