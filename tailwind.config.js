/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        whatsapp: {
          light: '#25D366',
          DEFAULT: '#075E54',
          dark: '#128C7E',
          teal: '#00a884',
          darkbg: '#111b21',
          card: '#202c33',
          hover: '#2a3942',
        }
      }
    },
  },
  plugins: [],
}
