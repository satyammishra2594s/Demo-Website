// Replace this localStorage adapter with fetch() calls to a Node/Express or FastAPI backend later.
const read = (key, fallback = []) => { try { return JSON.parse(localStorage.getItem(key) || JSON.stringify(fallback)); } catch { return fallback; } };
const write = (key, value) => localStorage.setItem(key, JSON.stringify(value));
export async function createReservation(payload) {
  const item = { ...payload, id: globalThis.crypto?.randomUUID?.() || String(Date.now()), createdAt: new Date().toISOString(), status: 'pending' };
  write('desi-reservations', [item, ...read('desi-reservations')]); return item;
}
export async function subscribeNewsletter(email) { const list = read('desi-newsletter'); if (!list.includes(email)) write('desi-newsletter', [...list, email]); return { success: true }; }
export const getFavourites = () => read('desi-favourites', []);
export const saveFavourites = ids => write('desi-favourites', ids);
