"use strict";

const seoConfig = {

    titleTemplate: "React | %s",
    canonical: process.env.NEXT_PUBLIC_APP_URL || "http://frontend.localhost",
    openGraph: {

        siteName: process.env.NEXT_PUBLIC_APP_NAME || "codebase",
        url: process.env.NEXT_PUBLIC_APP_URL || "http://frontend.localhost",
        locale: process.env.NEXT_PUBLIC_APP_LANG || "en",
    },
};

module.exports = seoConfig;
