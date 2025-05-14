/** @type {import('tailwindcss').Config} */
module.exports = {
  content: ["./*.html", "./public/assets/css/**/*.css"],
  theme: {
    container: {
        center: true,
        padding: {
            DEFAULT: "2rem",
            sm: "0rem",
            "1920": "0rem"
        },
        screens: {
            md: "600px",
            lg: "750px",
            "1920": "1820px"            
        }
    },
    extend: {
        fontFamily: {
            eurostile: ['"Eurostile LT Std"', 'sans-serif'],
            eurostileEx2: ['"Eurostile LT Std Ex2"', 'sans-serif'],
            eurostileDemi: ['"Eurostile LT Std Demi"', 'sans-serif'],
            eurostileBoldCondensed: ['"Eurostile LT Std Bold Condensed"', 'sans-serif'],
        },
        colors: {
            primary: "#78003b",
            "primary-50": "rgba(239, 69, 77, 0.5)",
            secondary: "#19233e",
            grey: "rgba(50, 40, 20, 0.5)",
            gold: "#ae8900",
            silver: "#757f91",
            bronze: "#9a6543",
        },
    },
  },
  plugins: [],
}

