/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js}",
],
  theme: {
    extend: {
      colors: {
        primary: '#00ADB5',
        secondary: '#393E46',
        accent: '#222831',
        background: '#EEEEEE',
        text: '#FFFFFF',
      },
    },
  },
  plugins: [],
}

