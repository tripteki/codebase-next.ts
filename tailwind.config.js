/** @type {import ("tailwindcss").Config} */

"use strict";

export default {

    content: [

      "./node_modules/preline/preline.js",

      "./app/**/*.{js,ts,jsx,tsx,mdx}",
      "./pages/**/*.{js,ts,jsx,tsx,mdx}",
      "./components/**/*.{js,ts,jsx,tsx,mdx}",

      "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    plugins: [

      require ("preline/plugin"),
    ],

    theme: {

        extend: {},
    },
};
