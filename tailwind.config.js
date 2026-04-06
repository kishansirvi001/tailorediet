/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}", // Tailwind scans all these files
  ],
  theme: {
    extend: {
      colors: {
        accent: "var(--accent)",
        "accent-bg": "var(--accent-bg)",
        "accent-border": "var(--accent-border)",
      },
      fontFamily: {
        sans: "var(--sans)",
        heading: "var(--heading)",
        mono: "var(--mono)",
      },
      boxShadow: {
        default: "var(--shadow)",
      },
    },
  },
  plugins: [],
};