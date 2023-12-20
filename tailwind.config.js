const theme = require("./theme.json");
const tailpress = require("@jeffreyvr/tailwindcss-tailpress");

const customWidths = {
    "csek-max": "75rem",
    "csek-1/2": "37.5rem",
    "csek-1/3": "25rem",
    "csek-2/3": "50rem",
    serif: "12rem",
};

const customTimings = {
    750: "750ms",
    1200: "1200ms",
    2000: "2000ms",
    3000: "3000ms",
};

// this is shadow-md: `box-shadow: var(--tw-ring-offset-shadow, 0 0 #0000), var(--tw-ring-shadow, 0 0 #0000), ;`
const upShadows = {
    "up-md": "0 -10px 15px -3px var(--tw-shadow), 0 -4px 6px -4px var(--tw-shadow)",
};

const rotations = {
    30: "30deg",
    "-30": "-30deg",
};

/** @type {import('tailwindcss').Config} */
module.exports = {
    // important: true,
    content: ["./src/**/*.{tsx,js,ts,css,html}", "./safelist.txt"],
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
            transitionDuration: {
                ...customTimings,
            },
            transitionDelay: {
                ...customTimings,
            },
            spacing: {
                ...customWidths,
            },
            perspective: {
                2: "2rem",
            },
            aspectRatio: {
                blurb: "265 / 321",
                "4/3": "4 / 3",
            },
            boxShadow: {
                ...upShadows,
            },
            rotate: {
                ...rotations,
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
