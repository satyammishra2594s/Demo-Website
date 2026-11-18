/** @type {import('tailwindcss').Config} */
export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: {
    extend: {
      colors: {
        paper: '#F4EFE6', ink: '#241B15', cream: '#FFF9EE',
        saffron: '#B98435', chilli: '#8F3025'
      },
      fontFamily: {
        display: ['Playfair Display', 'Georgia', 'serif'],
        sans: ['DM Sans', 'sans-serif']
      }
    }
  },
  plugins: []
};
