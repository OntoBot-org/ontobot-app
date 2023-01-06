/** @type {import('tailwindcss').Config} */
module.exports = {
  content: [
    "./src/**/*.{js,jsx,ts,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        primary: '#9A1F18',
        secondary: '#18939A',
        lightgray: '#EDEDED',
        fontcolor: '#545454',
        bgcolor: '#FFFFFF',
      },
      
      fontSize: {
        bodytxt: '1.33rem',
        titletxt: '1.67rem',
      },

      fontFamily: {
        sans: [
          "Inter var, sans-serif",
          { fontFeatureSettings: '"cv11", "ss01"' },
        ],
      },
    },
  },
  plugins: [],
}
