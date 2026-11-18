// Change all real restaurant details here before publishing to the client.
export const restaurant = {
  name: 'Desi Spices', tagline: 'A celebration of India, served with love.',
  phone: '+91XXXXXXXXXX', whatsapp: '91XXXXXXXXXX', email: 'hello@desispices.example',
  instagram: 'https://instagram.com/', facebook: 'https://facebook.com/',
  address: 'Add restaurant address, city, state, India',
  openingHours: [
    { day: 'Sunday', open: '11:00', close: '23:00' }, { day: 'Monday', open: '11:00', close: '23:00' },
    { day: 'Tuesday', open: '11:00', close: '23:00' }, { day: 'Wednesday', open: '11:00', close: '23:00' },
    { day: 'Thursday', open: '11:00', close: '23:00' }, { day: 'Friday', open: '11:00', close: '23:00' },
    { day: 'Saturday', open: '11:00', close: '23:00' }
  ],
  mapEmbedUrl: 'https://www.google.com/maps?q=India&output=embed'
};
export const formatPrice = n => new Intl.NumberFormat('en-IN', { style: 'currency', currency: 'INR', maximumFractionDigits: 0 }).format(n);
export const whatsappLink = message => `https://wa.me/${restaurant.whatsapp}?text=${encodeURIComponent(message)}`;
