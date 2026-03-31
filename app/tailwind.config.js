/** @type {import('tailwindcss').Config} */
module.exports = {
  // NOTE: Update this to include the paths to all of your component files.
  content: ["./app/**/*.{js,jsx,ts,tsx}", "./src/**/*.{js,jsx,ts,tsx}"],
  presets: [require("nativewind/preset")],
  theme: {
    extend: {
      colors: {
        vanguard: {
          background: "#000000",
          card: "#1E293B",
          primary: "#F97316",
          "text-primary": "#F8FAFC",
          "text-secondary": "#94A3B8",
          border: "#334155",
          success: "#10B981",
          danger: "#EF4444",
          warning: "#F59E0B",
        },
      },
    },
  },
  plugins: [],
};
