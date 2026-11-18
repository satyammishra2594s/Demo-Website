export default {
  content: ['./index.html', './src/**/*.{js,jsx}'],
  theme: { extend: {
    colors: { ink: '#120D0A', maroon: '#5C1A1B', saffron: '#F2A31B', cream: '#FFF4E0', chilli: '#D7261E' },
    fontFamily: { display: ['Playfair Display', 'Georgia', 'serif'], sans: ['Poppins', 'sans-serif'] },
    boxShadow: { glow: '0 0 40px rgba(242,163,27,.18)' }
  } },
  plugins: []
};
