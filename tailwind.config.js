/** @type {import ("tailwindcss").Config} */

"use strict";

const withMT = require ("@material-tailwind/react/utils/withMT");

module.exports = withMT ({

    content: [

      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",

      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    plugins: [],

    theme: {

        extend: {},
    },
});
