// Update these demo values with the restaurant's verified business details before launch.
export const restaurant = {
  name: 'Desi Spices',
  tagline: 'Good food has a way of bringing everyone a little closer.',
  phone: '+91XXXXXXXXXX',
  whatsapp: '91XXXXXXXXXX',
  email: 'hello@desispices.example',
  instagram: 'https://instagram.com/',
  facebook: 'https://facebook.com/',
  address: 'Add restaurant address, city, state, India',
  openingHours: [
    { day: 'Sunday', open: '11:00', close: '23:00' },
    { day: 'Monday', open: '11:00', close: '23:00' },
    { day: 'Tuesday', open: '11:00', close: '23:00' },
    { day: 'Wednesday', open: '11:00', close: '23:00' },
    { day: 'Thursday', open: '11:00', close: '23:00' },
    { day: 'Friday', open: '11:00', close: '23:00' },
    { day: 'Saturday', open: '11:00', close: '23:00' }
  ],
  mapEmbedUrl: 'https://www.google.com/maps?q=India&output=embed'
};

export const formatPrice = amount => new Intl.NumberFormat('en-IN', {
  style: 'currency', currency: 'INR', maximumFractionDigits: 0
}).format(amount);

export const whatsappLink = message =>
  `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
