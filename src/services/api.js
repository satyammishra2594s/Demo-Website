// Keep data persistence in one place. Replace these methods with fetch() calls
// to a Node/Express or FastAPI endpoint when the restaurant backend is ready.
const read = (key, fallback = []) => {
  try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); }
  catch { return fallback; }
};
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));

export async function createReservation(payload) {
  // Future API integration can replace this local demo implementation.
  const reservation = {
    ...payload,
    id: globalThis.crypto?.randomUUID?.() || String(Date.now()),
    createdAt: new Date().toISOString(),
    status: 'pending'
  };
  write('desi-reservations', [reservation, ...read('desi-reservations')]);
  return reservation;
}

export async function subscribeNewsletter(email) {
  const emails = read('desi-newsletter');
  if (!emails.includes(email)) write('desi-newsletter', [...emails, email]);
  return { success: true };
}

export const getFavourites = () => read('desi-favourites', []);
export const saveFavourites = ids => write('desi-favourites', ids);
