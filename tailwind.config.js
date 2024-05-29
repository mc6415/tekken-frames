/** @type {import('tailwindcss').Config} */
export default {
  content: ['./src/**/*.{html,js,svelte,ts}'],
  theme: {
    extend: {
      colors: {
        'lilac': {  DEFAULT: '#C8A2C8',  50: '#EEE2EE',  100: '#E6D5E6',  200: '#D7BCD7',  300: '#C8A2C8',  400: '#B37FB3',  500: '#9D5D9D',  600: '#7A487A',  700: '#563356',  800: '#331E33',  900: '#100910',  950: '#000000'},
      },
    },
  },
  plugins: [],
}

