/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./src/**/*.{html,ts}",
    "./node_modules/flowbite/**/*.js"
  ],
  theme: {
    extend: {
      colors: {
        miAzul: '#1E40AF', // color personalizado
        miVerde: {
          100: '#DFF6DD',
          500: '#22C55E',
          700: '#15803D',
        },
      },
    },
  },
  plugins: [
    require('flowbite/plugin'),
  ],
}
