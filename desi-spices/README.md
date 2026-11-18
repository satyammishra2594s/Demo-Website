# Desi Spices — Restaurant Demo

Premium, responsive restaurant website built with React 18, Vite, Tailwind CSS, Three.js / React Three Fiber, Framer Motion, GSAP ScrollTrigger and Lenis.

## Run locally

```bash
npm install
npm run dev
```

## Before presenting to a real restaurant

1. Replace the demo business details in `src/config.js` (phone, WhatsApp, email, address, social links, opening hours and map embed).
2. Replace image URLs in `src/data/images.js` with the restaurant's approved photography.
3. Review every dish, description, dietary flag and price in `src/data/menu.js`. Replace the illustrative story counters and sample reviews in `src/App.jsx` with verified restaurant information.
4. Replace the demo contact and restaurant metadata in `index.html`.
5. Connect `src/services/api.js` to a real reservation/newsletter API. Current bookings and favourites are browser-local only.

Deploy on Vercel or Netlify using `npm run build` and the `dist` output directory.
