// Client photography goes in public/images using these exact filenames.
// Until then, each slot uses a real photographic Unsplash fallback (not generated art).
const photo = (file, fallback) => ({ local: `/images/${file}`, fallback });

export const images = {
  hero: photo('hero.jpg', 'https://images.unsplash.com/photo-1771554753130-9e63a3f63e4d?auto=format&fit=crop&w=2400&q=88'),
  story: {
    main: photo('ambience-1.jpg', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=85&fit=crop'),
    detail: photo('ambience-2.jpg', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=900&q=85&fit=crop')
  },
  kitchen: photo('ambience-3.jpg', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1400&q=85&fit=crop'),
  reservation: photo('ambience-4.jpg', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1000&q=85&fit=crop'),
  ambience: [
    { ...photo('ambience-1.jpg', 'https://images.unsplash.com/photo-1559339352-11d035aa65de?w=1200&q=85&fit=crop'), alt: 'Restaurant interior and warm dining atmosphere', caption: 'A warm welcome' },
    { ...photo('ambience-2.jpg', 'https://images.unsplash.com/photo-1596040033229-a9821ebd058d?w=1200&q=85&fit=crop'), alt: 'Whole spices and fresh ingredients', caption: 'The little details' },
    { ...photo('ambience-3.jpg', 'https://images.unsplash.com/photo-1577219491135-ce391730fb2c?w=1200&q=85&fit=crop'), alt: 'A cook preparing dishes in the kitchen', caption: 'Straight from the kitchen' },
    { ...photo('ambience-4.jpg', 'https://images.unsplash.com/photo-1414235077428-338989a2e8c0?w=1200&q=85&fit=crop'), alt: 'A table laid for dinner', caption: 'Settle in' },
    { ...photo('ambience-5.jpg', 'https://images.unsplash.com/photo-1544148103-0773bf10d330?w=1200&q=85&fit=crop'), alt: 'Friends sharing a meal', caption: 'Made for sharing' },
    { ...photo('ambience-6.jpg', 'https://images.unsplash.com/photo-1547592180-85f173990554?w=1200&q=85&fit=crop'), alt: 'Freshly prepared Indian dishes on a table', caption: 'A little more please' }
  ],
  dishFallback: 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&q=82&fit=crop'
};

export const dishFallbacks = {
  'Starters (Veg)': 'https://images.unsplash.com/photo-1567188040759-fb8a883dc6d8?w=900&q=82&fit=crop',
  'Starters (Non-Veg)': 'https://images.unsplash.com/photo-1603894584373-5ac82b2ae398?w=900&q=82&fit=crop',
  'Tandoor': 'https://images.unsplash.com/photo-1599487488170-d11ec9c172f0?w=900&q=82&fit=crop',
  'North Indian Mains': 'https://images.unsplash.com/photo-1565557623262-b51c2513a641?w=900&q=82&fit=crop',
  'South Indian': 'https://images.unsplash.com/photo-1589302168068-964664d93dc0?w=900&q=82&fit=crop',
  'Indo-Chinese': 'https://images.unsplash.com/photo-1525755662778-989d0524087e?w=900&q=82&fit=crop',
  'Biryani and Rice': 'https://images.unsplash.com/photo-1563379091339-03246963d96c?w=900&q=82&fit=crop',
  'Breads': 'https://images.unsplash.com/photo-1610192244261-3f33de3f55e4?w=900&q=82&fit=crop',
  'Chaat and Street Food': 'https://images.unsplash.com/photo-1601050690597-df0568f70950?w=900&q=82&fit=crop',
  'Thali': 'https://images.unsplash.com/photo-1546833999-b9f581a1996d?w=900&q=82&fit=crop',
  'Desserts': 'https://images.unsplash.com/photo-1551024506-0cc9d9c25a0c?w=900&q=82&fit=crop',
  'Beverages and Lassi': 'https://images.unsplash.com/photo-1544145945-f90425340c7e?w=900&q=82&fit=crop'
};
