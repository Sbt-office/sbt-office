/** @type {import('tailwindcss').Config} */
export default {
  content: ["./index.html", "./src/**/*.{js,ts,jsx,tsx}"],
  theme: {
    extend: {
      colors: {
        sbtLightBlue2: "#E9EFF4FF",
        sbtLightBlue: "#d5e3f0",
        sbtDarkBlue: "#1366a2",
        comBlue: "#7396E3",
        comGray: "#919191",
        comRed: "#D64646",
      },
    },
  },
  plugins: [],
};
