const { resolve, } = require ("path");

/** @type {import('next-i18next').UserConfig} */
module.exports = {

    i18n: {

        defaultLocale: "en",
        locales: [ "en", "id", "ms", ],
        localeDetection: false,
    },

    localePath: resolve ("./src/langs"),
};
