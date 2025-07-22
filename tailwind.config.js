import forms from '@tailwindcss/forms';

/** @type {import('tailwindcss').Config} */
export default {
  content: [
    "./index.html",
    "./src/**/*.{vue,js,ts,jsx,tsx}",
  ],
  theme: {
    extend: {
      colors: {
        gray: {
          300: '#D1D5DB', // Custom color definition
        },
      },
    },
  },
  plugins: [
    forms,
  ],
};
