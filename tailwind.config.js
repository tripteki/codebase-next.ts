/** @type {import ("tailwindcss").Config} */

export default {
    content: [
        "./src/**/*.{js,ts,jsx,tsx}",
        "./pages/**/*.{js,ts,jsx,tsx}",
    ],

    plugins: [
        //
    ],

    darkMode: "class",

    theme: {
        fontFamily: {
            body: [
                "Inter",
                "ui-sans-serif",
                "system-ui",
                "-apple-system",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "Noto Sans",
                "sans-serif",
            ],

            sans: [
                "Inter",
                "ui-sans-serif",
                "system-ui",
                "-apple-system",
                "Segoe UI",
                "Roboto",
                "Helvetica Neue",
                "Arial",
                "Noto Sans",
                "sans-serif",
            ],
        },
    },
};
