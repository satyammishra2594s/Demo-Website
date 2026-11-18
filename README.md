# Desi Spices — Editorial Restaurant Website

A warm, photo-led restaurant website built with React 18, Vite, React Router, Tailwind CSS, Framer Motion and Lucide icons. The design uses an earthy editorial direction: paper tones, deep brown, cream, turmeric and chilli, generous typography and natural photography. It deliberately avoids glassmorphism, neon glows and floating 3D objects.

## Run locally

```bash
npm install
npm run dev
```

Build for production:

```bash
npm run build
npm run preview
```

## Replace the client information

1. Update phone, WhatsApp, email, socials, address, map embed and opening hours in `src/config.js`.
2. Replace photo slots in `public/images/` using the exact filenames in `public/images/README.md`. `hero.mp4` is optional; without it the hero still displays `hero.jpg`.
3. Update dishes, descriptions, dietary labels and prices in `src/data/menu.js`. Each dish already points to a matching `public/images/dish-<dish-name>.jpg` slot (lowercase, spaces converted to hyphens); when absent it falls back to a relevant category photo.
4. Update page metadata and the Restaurant JSON-LD block in `index.html`.
5. Replace the sample guest comments in `src/App.jsx` with approved real testimonials before publishing.

All reservation and newsletter actions are local demo behaviour in `src/services/api.js`. Reservations are saved to this browser and can be copied into WhatsApp for confirmation. Connect the methods in that file to a real API before accepting live bookings.

## Image behaviour

Each local photo slot is tried first. When it does not exist, a real photographic Unsplash image is used as a temporary visual fallback. These fallback photos are not photos of the actual business. Replace them with client-approved photographs before production.

## Deploy

Vercel: Framework Preset `Vite`, Root Directory `.`, Build Command `npm run build`, Output Directory `dist`, Install Command `npm install`.

Netlify: Base Directory `.`, Build Command `npm run build`, Publish Directory `dist`.
