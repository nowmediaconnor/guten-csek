const theme = require("./theme.json");
const tailpress = require("@jeffreyvr/tailwindcss-tailpress");

/** @type {import('tailwindcss').Config} */
module.exports = {
    // important: true,
    content: ["./src/**/*.{tsx,js,ts,css,html}"],
    theme: {
        container: {
            padding: {
                DEFAULT: "1rem",
                sm: "2rem",
                lg: "0rem",
            },
        },
        extend: {
            colors: tailpress.colorMapper(tailpress.theme("settings.color.palette", theme)),
            fontSize: tailpress.fontSizeMapper(tailpress.theme("settings.typography.fontSizes", theme)),
            fontFamily: {
                syne: ["Syne", "sans-serif"],
                montserrat: ["Montserrat", "sans-serif"],
            },
            keyframes: {
                spin: {
                    from: { transform: "rotate(0deg)" },
                    to: { transform: "rotate(-360deg)" },
                },
            },
            animation: {
                "spin-slow": "spin 3s linear infinite",
            },
        },
        screens: {
            xs: "480px",
            sm: "600px",
            md: "782px",
            lg: tailpress.theme("settings.layout.contentSize", theme),
            xl: tailpress.theme("settings.layout.wideSize", theme),
            "2xl": "1440px",
        },
    },
    // plugins: [tailpress.tailwind],
};
