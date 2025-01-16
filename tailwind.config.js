/** @type {import ("tailwindcss").Config} */

"use strict";

export default {

    content: [

        "./node_modules/flowbite/**/*.{js,ts}",

        "./app/**/*.{js,ts,jsx,tsx,mdx}",
        "./pages/**/*.{js,ts,jsx,tsx,mdx}",
        "./components/**/*.{js,ts,jsx,tsx,mdx}",

        "./src/**/*.{js,ts,jsx,tsx,mdx}",
    ],

    plugins: [

        require ("flowbite/plugin") ({}),
        require ("tailwindcss-animate"),
    ],

    darkMode: "class",

    theme: {

        fontFamily: {

            "body": [

                "Inter", 
                "ui-sans-serif", 
                "system-ui", 
                "-apple-system", 
                "system-ui", 
                "Segoe UI", 
                "Roboto", 
                "Helvetica Neue", 
                "Arial", 
                "Noto Sans", 
                "sans-serif", 
                "Apple Color Emoji", 
                "Segoe UI Emoji", 
                "Segoe UI Symbol", 
                "Noto Color Emoji",
            ],

            "sans": [

                "Inter", 
                "ui-sans-serif", 
                "system-ui", 
                "-apple-system", 
                "system-ui", 
                "Segoe UI", 
                "Roboto", 
                "Helvetica Neue", 
                "Arial", 
                "Noto Sans", 
                "sans-serif", 
                "Apple Color Emoji", 
                "Segoe UI Emoji", 
                "Segoe UI Symbol", 
                "Noto Color Emoji",
            ],
        },

        extend: {

            colors: {

                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",

                primary: {

                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },

                secondary: {

                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },

                destructive: {

                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },

                muted: {

                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },

                accent: {

                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },

                popover: {

                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },

                card: {

                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },

            borderRadius: {

                lg: `var(--radius)`,
                md: `calc(var(--radius) - 2px)`,
                sm: "calc(var(--radius) - 4px)",
            },
        },
    },
};
