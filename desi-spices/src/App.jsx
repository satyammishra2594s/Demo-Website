import { useEffect, useMemo, useRef, useState, lazy, Suspense } from 'react';
import { Routes, Route, Link, NavLink, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';
import Lenis from 'lenis';
import confetti from 'canvas-confetti';
import {
  ArrowUpRight, ArrowRight, ArrowDown, ArrowLeft, Heart, Flame, Search, SlidersHorizontal,
  Phone, MessageCircle, CalendarDays, Utensils, Instagram, Facebook, Mail, MapPin, Clock,
  Quote, ChevronLeft, ChevronRight, Minus, Plus, CheckCircle2, Send, X, Menu as MenuIcon
} from 'lucide-react';
import { restaurant, formatPrice, whatsappLink } from './config';
import { images } from './data/images';
import { categories, menuItems, signatureDishes } from './data/menu';
import { createReservation, subscribeNewsletter, getFavourites, saveFavourites } from './services/api';

const HeroScene = lazy(() => import('./components/HeroScene.jsx'));

function Img({ src, alt, className = '', ...props }) {
  const [failed, setFailed] = useState(false);
  return failed
    ? <div className={`image-fallback ${className}`} role="img" aria-label={alt} />
    : <img src={src} alt={alt} className={className} loading="lazy" onError={() => setFailed(true)} {...props} />;
}

function useOpenStatus() {
  const calculate = () => {
    const now = new Date();
    const today = restaurant.openingHours[now.getDay()];
    const current = now.getHours() * 60 + now.getMinutes();
    const [oh, om] = today.open.split(':').map(Number);
    const [ch, cm] = today.close.split(':').map(Number);
    return { open: current >= oh * 60 + om && current < ch * 60 + cm };
  };
  const [status, setStatus] = useState(calculate);
  useEffect(() => {
    const timer = setInterval(() => setStatus(calculate()), 30000);
    return () => clearInterval(timer);
  }, []);
  return status;
}
function OpenBadge() {
  const { open } = useOpenStatus();
  return <span className={`open-badge ${open ? 'is-open' : 'is-closed'}`}><i />{open ? 'Open now' : 'Closed'}</span>;
}
function Heading({ eyebrow, title, desc }) {
  return <div className="section-heading"><span className="eyebrow">{eyebrow}</span><h2>{title}</h2>{desc && <p>{desc}</p>}</div>;
}
function Stat({ value, suffix = '', label }) {
  const [count, setCount] = useState(0);
  useEffect(() => { let frame = 0; const duration = 900; const start = performance.now(); let raf; const tick = now => { const progress = Math.min(1, (now - start) / duration); setCount(Math.round(value * (1 - Math.pow(1 - progress, 3)))); if (progress < 1) raf = requestAnimationFrame(tick); }; raf = requestAnimationFrame(tick); return () => cancelAnimationFrame(raf); }, [value]);
  return <div><strong>{count}<span>{suffix}</span></strong><small>{label}</small></div>;
}

function Navbar({ onQuickBook }) {
  const [open, setOpen] = useState(false);
  const links = [['Home', '/'], ['Menu', '/menu'], ['Gallery', '/#gallery'], ['Reservations', '/reservations'], ['Contact', '/contact']];
  return <header className="nav-wrap"><nav className="navbar shell" aria-label="Main navigation">
    <Link to="/" className="brand" onClick={() => setOpen(false)}><span className="brand-mark"><Utensils size={18} /></span><span>{restaurant.name}<small>INDIAN KITCHEN</small></span></Link>
    <div className="nav-links">{links.map(([name, path]) => <NavLink key={name} to={path} end={path === '/'}>{name}</NavLink>)}</div>
    <button className="button button-gold nav-cta" onClick={onQuickBook}>Book a Table <ArrowUpRight size={16} /></button>
    <button className="menu-toggle" aria-label="Toggle navigation" aria-expanded={open} onClick={() => setOpen(!open)}>{open ? <X /> : <MenuIcon />}</button>
    <AnimatePresence>{open && <motion.div className="mobile-menu" initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }}>
      {links.map(([name, path]) => <Link key={name} to={path} onClick={() => setOpen(false)}>{name}</Link>)}
      <button className="button button-gold" onClick={() => { setOpen(false); onQuickBook(); }}>Book a Table</button>
    </motion.div>}</AnimatePresence>
  </nav></header>;
}

function Footer() {
  const [email, setEmail] = useState('');
  const [message, setMessage] = useState('');
  async function submit(event) {
    event.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setMessage('Enter a valid email address.'); return; }
    await subscribeNewsletter(email);
    setMessage('You’re on the list. Thank you!');
    setEmail('');
  }
  return <footer className="footer"><div className="shell footer-main">
    <div><Link to="/" className="brand"><span className="brand-mark"><Utensils size={18} /></span><span>{restaurant.name}<small>INDIAN KITCHEN</small></span></Link><p className="footer-copy">{restaurant.tagline} Made with soul, spice and a little bit of magic.</p><div className="socials"><a href={restaurant.instagram} aria-label="Instagram"><Instagram /></a><a href={restaurant.facebook} aria-label="Facebook"><Facebook /></a></div></div>
    <div><h4>Explore</h4><Link to="/menu">Our menu</Link><Link to="/#story">Our story</Link><Link to="/#gallery">Gallery</Link><Link to="/reservations">Reservations</Link></div>
    <div><h4>Find us</h4><p>{restaurant.address}</p><a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a><a href={`mailto:${restaurant.email}`}>{restaurant.email}</a></div>
    <div><h4>A little spice in your inbox</h4><p>New dishes, seasonal specials and good things from our kitchen.</p><form className="newsletter" onSubmit={submit}><input aria-label="Email for newsletter" type="email" placeholder="Your email address" value={email} onChange={e => setEmail(e.target.value)} /><button aria-label="Subscribe"><ArrowUpRight /></button></form><small aria-live="polite">{message}</small></div>
  </div><div className="shell footer-bottom"><span>© {new Date().getFullYear()} {restaurant.name}. All rights reserved.</span><span>Crafted with <b>♥</b> and a pinch of masala.</span></div></footer>;
}

function FloatingActions() {
  return <><div className="floating-actions">
    <a className="float-button whatsapp" href={whatsappLink('Hello, I would like to know more about Desi Spices.')} aria-label="Chat on WhatsApp"><MessageCircle /></a>
    <a className="float-button" href={`tel:${restaurant.phone}`} aria-label="Call restaurant"><Phone /></a>
    <Link className="float-button float-book" to="/reservations" aria-label="Book a table"><CalendarDays /></Link>
  </div><div className="mobile-bookbar"><a href={`tel:${restaurant.phone}`}><Phone size={17} /> Call</a><Link to="/reservations"><CalendarDays size={17} /> Book a table</Link></div></>;
}

function DishCard({ dish, favourite, onFavourite, onClick, index = 0 }) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  function move(event) {
    if (!window.matchMedia('(pointer:fine)').matches) return;
    const rect = event.currentTarget.getBoundingClientRect();
    setTilt({ x: ((event.clientY - rect.top) / rect.height - .5) * -7, y: ((event.clientX - rect.left) / rect.width - .5) * 7 });
  }
  return <motion.article layout initial={{ opacity: 0, y: 18 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, scale: .96 }} transition={{ duration: .25, delay: Math.min(index * .02, .14) }} className="dish-card" style={{ transform: `perspective(900px) rotateX(${tilt.x}deg) rotateY(${tilt.y}deg)` }} onMouseMove={move} onMouseLeave={() => setTilt({ x: 0, y: 0 })}>
    <button className="dish-image-button" onClick={onClick} aria-label={`View ${dish.name} details`}><Img src={dish.image} alt={dish.name} /><span className={`food-dot ${dish.isVeg ? 'veg' : 'nonveg'}`} />{dish.tags[0] && <span className="dish-tag">{dish.tags[0]}</span>}</button>
    <div className="dish-card-content"><div className="dish-meta"><span>{dish.category}</span><span className="spice-level" aria-label={`Spice level ${dish.spice} of 3`}>{[1, 2, 3].map(n => <Flame key={n} size={12} className={n <= dish.spice ? 'hot' : ''} />)}</span></div>
      <button className="dish-title" onClick={onClick}>{dish.name}</button><p>{dish.description}</p>
      <div className="dish-card-bottom"><strong>{formatPrice(dish.price)}</strong><button className={`heart-button ${favourite ? 'active' : ''}`} onClick={onFavourite} aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}><Heart size={18} fill={favourite ? 'currentColor' : 'none'} /></button><button className="dish-open" onClick={onClick} aria-label={`More about ${dish.name}`}><ArrowUpRight size={17} /></button></div>
    </div>
  </motion.article>;
}

function DishModal({ dish, onClose, favourite, onFavourite }) {
  useEffect(() => {
    if (!dish) return undefined;
    const closeOnEscape = e => { if (e.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [dish, onClose]);
  return <AnimatePresence>{dish && <motion.div className="modal-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => e.target === e.currentTarget && onClose()}>
    <motion.div className="dish-modal glass-card" role="dialog" aria-modal="true" aria-label={dish.name} initial={{ opacity: 0, y: 25, scale: .97 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}>
      <button className="modal-close" onClick={onClose} aria-label="Close dish details"><X /></button><Img src={dish.image} alt={dish.name} />
      <div className="dish-modal-copy"><span className="eyebrow">{dish.category}</span><h2>{dish.name}</h2><p>{dish.description}</p>
        <div className="modal-dish-foot"><strong>{formatPrice(dish.price)}</strong><span>{dish.isVeg ? 'Vegetarian' : 'Non-vegetarian'} · Spice {dish.spice}/3</span><button className="button button-gold" onClick={onFavourite}><Heart size={16} fill={favourite ? 'currentColor' : 'none'} />{favourite ? 'Saved' : 'Save favourite'}</button></div>
        <small>Sample menu details. Confirm recipes, allergens and prices with the restaurant before launch.</small>
      </div>
    </motion.div>
  </motion.div>}</AnimatePresence>;
}

const reviews = [
  ['A flavour journey worth repeating. The paneer tikka and dal makhani were exceptional.', 'Aarav S.', 'Food enthusiast'],
  ['Warm hospitality, beautiful ambience and food that tastes like home.', 'Meera K.', 'Weekend guest'],
  ['The biryani was fragrant, perfectly cooked and full of character.', 'Rohan P.', 'Regular guest'],
  ['A lovely place for a family dinner. Everyone found a favourite.', 'Ananya R.', 'Family guest'],
  ['Loved the tandoor selection. The smoky flavours are unforgettable.', 'Kabir M.', 'Food explorer'],
  ['The staff made our anniversary feel truly special.', 'Priya D.', 'Celebration guest'],
  ['Fantastic chaat and a mango lassi that deserves its own fan club.', 'Ishita B.', 'Local guide'],
  ['Thoughtful menu, generous portions and a genuinely welcoming team.', 'Dev N.', 'Neighbourhood guest']
];

function Home() {
  const [dish, setDish] = useState(null), [favourites, setFavourites] = useState(getFavourites), [review, setReview] = useState(0), [photo, setPhoto] = useState(null), [remaining, setRemaining] = useState(0);
  const signatureRef = useRef(null);
  function toggleFavourite(id) { const next = favourites.includes(id) ? favourites.filter(x => x !== id) : [...favourites, id]; setFavourites(next); saveFavourites(next); }
  useEffect(() => {
    const tick = () => { const now = new Date(), end = new Date(); end.setHours(23, 59, 59, 999); setRemaining(Math.max(0, end - now)); };
    tick(); const timer = setInterval(tick, 1000); return () => clearInterval(timer);
  }, []);
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    const context = gsap.context(() => {
      const track = signatureRef.current?.querySelector('.signature-track');
      if (track && window.innerWidth > 760) gsap.to(track, { x: () => -(track.scrollWidth - signatureRef.current.clientWidth), ease: 'none', scrollTrigger: { trigger: signatureRef.current, start: 'top 18%', end: () => '+=' + (track.scrollWidth - signatureRef.current.clientWidth), pin: true, scrub: 1, invalidateOnRefresh: true } });
      gsap.utils.toArray('.reveal').forEach(el => gsap.fromTo(el, { y: 25, opacity: 0 }, { y: 0, opacity: 1, duration: .8, scrollTrigger: { trigger: el, start: 'top 88%' } }));
    });
    return () => context.revert();
  }, []);
  const timer = [Math.floor(remaining / 3600000), Math.floor(remaining % 3600000 / 60000), Math.floor(remaining % 60000 / 1000)].map(x => String(x).padStart(2, '0'));
  return <main>
    <section className="hero-section"><div className="hero-grain" /><div className="hero-glow" /><div className="hero-shell shell">
      <div className="hero-copy"><motion.span className="eyebrow" initial={{ opacity: 0, y: 15 }} animate={{ opacity: 1, y: 0 }}>AN INDIAN CULINARY EXPERIENCE</motion.span>
        <motion.h1 initial={{ opacity: 0, y: 25 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .2, duration: .8 }}>Taste the <em>Soul</em><br />of India.</motion.h1>
        <motion.p initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .3 }}>A little fire. A lot of heart. Discover timeless Indian recipes, bold spices and the joy of gathering around a table.</motion.p>
        <motion.div className="hero-actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: .4 }}><Link to="/reservations" className="button button-gold">Book a Table <ArrowUpRight size={17} /></Link><Link to="/menu" className="button button-ghost">Explore Menu <ArrowRight size={17} /></Link></motion.div>
        <div className="hero-proof"><span className="proof-stars">★★★★★</span><span>Authentic flavours · Heartfelt hospitality</span></div>
      </div>
      <div className="hero-art"><div className="hero-art-label"><span>01 / 12</span><span>THE ART OF INDIAN FLAVOUR</span></div>{(window.matchMedia('(max-width: 760px), (prefers-reduced-motion: reduce)').matches || (navigator.deviceMemory && navigator.deviceMemory <= 4) || navigator.connection?.saveData) ? <div className="hero-fallback"><div className="fallback-plate" /></div> : <Suspense fallback={<div className="hero-fallback"><div className="fallback-plate" /></div>}><HeroScene /></Suspense>}<div className="hero-orbit">CRAFTED WITH SPICE <b>✦</b> SERVED WITH SOUL</div></div>
    </div><a href="#story" className="scroll-cue"><span>SCROLL TO DISCOVER</span><ArrowDown size={15} /></a></section>
    <div className="marquee"><div className="marquee-track">{Array.from({ length: 2 }, (_, i) => <span key={i}>AUTHENTIC <b>✦</b> FRESH <b>✦</b> TANDOOR <b>✦</b> BIRYANI <b>✦</b> CHAAT <b>✦</b> THALI <b>✦</b>&nbsp;</span>)}</div></div>
    <section className="story-section section-pad" id="story"><div className="shell story-grid"><div className="story-image reveal"><Img src={images.story} alt="Warm, intimate restaurant dining room" /><div className="story-stamp"><span>EST.</span><strong>INDIA</strong><span>WITH LOVE</span></div></div><div className="story-copy reveal"><span className="eyebrow">OUR STORY · OUR ROOTS</span><h2>Recipes that carry <em>memories.</em></h2><p>At {restaurant.name}, every plate begins with a story. Inspired by India's vibrant kitchens, regional traditions and the magic of slow cooking, we bring familiar favourites and fresh discoveries to one welcoming table.</p><p>Spices are toasted with care, ingredients are chosen thoughtfully and every guest is welcomed like family.</p><Link className="under-link" to="/menu">Discover our menu <ArrowUpRight size={17} /></Link><div className="stats-row"><Stat value={12} suffix="+" label="Years of flavour"/><Stat value={96} suffix="+" label="Dishes to discover"/><Stat value={10} suffix="k+" label="Happy guests"/></div></div></div></section>
    <section className="signature-section section-pad" ref={signatureRef}><div className="shell signature-head"><Heading eyebrow="FROM OUR KITCHEN" title="Signature dishes." desc="A few house favourites, made to be remembered." /><Link to="/menu" className="under-link">View full menu <ArrowUpRight size={17} /></Link></div><div className="signature-viewport"><div className="signature-track">{signatureDishes.map((item, i) => <div className="signature-item" key={item.id}><DishCard dish={item} favourite={favourites.includes(item.id)} onFavourite={() => toggleFavourite(item.id)} onClick={() => setDish(item)} index={i} /></div>)}</div></div></section>
    <section className="offer-section"><div className="shell offer-card"><div className="offer-copy"><span className="eyebrow">A LITTLE SOMETHING EXTRA</span><h2>Make tonight <em>delicious.</em></h2><p>Ask our team about today's chef-curated special and seasonal favourites. Something lovely is always simmering.</p><Link to="/reservations" className="button button-gold">Plan your visit <ArrowUpRight size={17} /></Link></div><div className="offer-count"><span>TONIGHT'S KITCHEN CLOSES IN</span><div>{timer.map((value, i) => <span className="timer-part" key={i}><strong>{value}</strong>{i < 2 && <i>:</i>}</span>)}</div><small>Hours&nbsp;&nbsp; Minutes&nbsp;&nbsp; Seconds</small><span className="offer-note"><Flame size={15} /> Ask for today's special</span></div></div></section>
    <section className="gallery-section section-pad" id="gallery"><div className="shell"><Heading eyebrow="A FEAST FOR THE EYES" title="A taste of the atmosphere." desc="The details, the dishes, the moments around the table." /><div className="gallery-grid">{images.gallery.map((src, i) => <button key={src} className={`gallery-tile gallery-tile-${i + 1}`} onClick={() => setPhoto(i)} aria-label={`Open gallery image ${i + 1}`}><Img src={src} alt={`Desi Spices gallery ${i + 1}`} /><span>0{i + 1}</span></button>)}</div></div></section>
    <section className="reviews-section section-pad"><div className="shell reviews-layout"><div className="reviews-intro"><span className="eyebrow">KIND WORDS</span><h2>Good food.<br /><em>Good company.</em></h2><div className="rating-big">★★★★★ <small>Guestbook stories</small></div></div><div className="review-card glass-card"><Quote className="quote-mark" /><div className="review-stars">★★★★★</div><AnimatePresence mode="wait"><motion.div key={review} initial={{ opacity: 0, x: 15 }} animate={{ opacity: 1, x: 0 }} exit={{ opacity: 0, x: -15 }}><p className="review-text">“{reviews[review][0]}”</p><strong>{reviews[review][1]}</strong><small>{reviews[review][2]}</small></motion.div></AnimatePresence><div className="review-controls"><span>0{review + 1} <i>/ 08</i></span><div><button onClick={() => setReview((review + 7) % 8)} aria-label="Previous review"><ChevronLeft /></button><button onClick={() => setReview((review + 1) % 8)} aria-label="Next review"><ChevronRight /></button></div></div></div></div></section>
    <section className="visit-section section-pad"><div className="shell visit-card"><div><span className="eyebrow">YOUR TABLE IS WAITING</span><h2>Come hungry.<br /><em>Leave happy.</em></h2><p>Make room for one more good meal. We’ll take care of the rest.</p><Link to="/reservations" className="button button-gold">Reserve your table <ArrowUpRight size={17} /></Link></div><div className="visit-image"><Img src={images.signature[2]} alt="Freshly prepared Indian curry" /></div></div></section>
    <DishModal dish={dish} onClose={() => setDish(null)} favourite={dish ? favourites.includes(dish.id) : false} onFavourite={() => dish && toggleFavourite(dish.id)} />
    <AnimatePresence>{photo !== null && <motion.div className="lightbox" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onClick={() => setPhoto(null)}><button aria-label="Close gallery">×</button><img src={images.gallery[photo]} alt="Restaurant gallery enlarged" /><button className="light-prev" onClick={e => { e.stopPropagation(); setPhoto((photo + 7) % 8); }}>‹</button><button className="light-next" onClick={e => { e.stopPropagation(); setPhoto((photo + 1) % 8); }}>›</button></motion.div>}</AnimatePresence>
  </main>;
}

function MenuPage() {
  const [category, setCategory] = useState('All'), [query, setQuery] = useState(''), [diet, setDiet] = useState('all'), [spice, setSpice] = useState('all'), [sort, setSort] = useState('featured'), [onlyFav, setOnlyFav] = useState(false), [favourites, setFavourites] = useState(getFavourites), [selected, setSelected] = useState(null);
  function toggleFavourite(id) { const next = favourites.includes(id) ? favourites.filter(x => x !== id) : [...favourites, id]; setFavourites(next); saveFavourites(next); }
  const filtered = useMemo(() => {
    const list = menuItems.filter(item => (category === 'All' || item.category === category) && (!query || `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())) && (diet === 'all' || (diet === 'veg' ? item.isVeg : !item.isVeg)) && (spice === 'all' || item.spice === Number(spice)) && (!onlyFav || favourites.includes(item.id)));
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, query, diet, spice, sort, onlyFav, favourites]);
  return <main className="menu-page"><section className="page-hero"><div className="shell"><span className="eyebrow">THE GOOD STUFF</span><h1>Made with spice.<br /><em>Served with soul.</em></h1><p>Explore a menu inspired by India's many kitchens, from street-side favourites to slow-cooked classics.</p><div className="menu-page-count">12 CATEGORIES <b>✦</b> 96 DISHES <b>✦</b> MADE FRESH</div></div></section>
    <section className="menu-catalog shell"><div className="menu-sticky"><div className="category-tabs" aria-label="Menu categories"><button className={category === 'All' ? 'active' : ''} onClick={() => setCategory('All')}>All dishes <span>{menuItems.length}</span></button>{categories.map(name => <button key={name} className={category === name ? 'active' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div></div>
      <div className="menu-toolbar"><div className="menu-search"><Search size={18} /><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Search dishes, ingredients..." aria-label="Search menu" /></div><div className="filter-control"><button className={onlyFav ? 'filter-active' : ''} onClick={() => setOnlyFav(!onlyFav)}><Heart size={16} /> Favourites {favourites.length > 0 && <span>{favourites.length}</span>}</button><label><span>Diet</span><select value={diet} onChange={e => setDiet(e.target.value)}><option value="all">All</option><option value="veg">Veg</option><option value="nonveg">Non-veg</option></select></label><label><Flame size={15} /><select value={spice} onChange={e => setSpice(e.target.value)} aria-label="Filter spice"><option value="all">Any spice</option><option value="1">Mild</option><option value="2">Medium</option><option value="3">Hot</option></select></label><label><SlidersHorizontal size={15} /><select value={sort} onChange={e => setSort(e.target.value)} aria-label="Sort menu"><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="az">Name: A to Z</option></select></label></div></div>
      <div className="menu-results"><span>{filtered.length} dishes to discover</span><span>Prices in INR · Sample menu</span></div><div className="dish-grid"><AnimatePresence mode="popLayout">{filtered.map((item, i) => <DishCard key={item.id} dish={item} favourite={favourites.includes(item.id)} onFavourite={() => toggleFavourite(item.id)} onClick={() => setSelected(item)} index={i % 8} />)}</AnimatePresence></div>
      {filtered.length === 0 && <div className="empty-state"><SlidersHorizontal size={30} /><h3>No dishes found</h3><p>Try another search or clear a filter to see more from our kitchen.</p><button className="button button-outline" onClick={() => { setCategory('All'); setQuery(''); setDiet('all'); setSpice('all'); setSort('featured'); setOnlyFav(false); }}>Clear filters</button></div>}
    </section><DishModal dish={selected} onClose={() => setSelected(null)} favourite={selected ? favourites.includes(selected.id) : false} onFavourite={() => selected && toggleFavourite(selected.id)} />
  </main>;
}

const timeSlots = ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'];
const blankBooking = { name: '', phone: '', email: '', date: '', time: '07:30 PM', guests: 2, occasion: 'Casual dining', requests: '' };
function ReservationForm() {
  const [form, setForm] = useState(blankBooking), [errors, setErrors] = useState({}), [saved, setSaved] = useState(null);
  const minDate = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  function update(key, value) { setForm(old => ({ ...old, [key]: value })); setErrors(old => ({ ...old, [key]: '' })); }
  function validate() {
    const issues = {};
    if (form.name.trim().length < 2) issues.name = 'Please enter your name.';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) issues.phone = 'Enter a valid 10-digit Indian mobile number.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) issues.email = 'Please enter a valid email address.';
    if (!form.date || form.date < minDate) issues.date = 'Choose today or a future date.';
    if (!form.time) issues.time = 'Please select a time.';
    setErrors(issues); return Object.keys(issues).length === 0;
  }
  async function submit(event) {
    event.preventDefault(); if (!validate()) return;
    const reservation = await createReservation(form); setSaved(reservation);
    confetti({ particleCount: 120, spread: 75, origin: { y: .65 }, colors: ['#F2A31B', '#FFF4E0', '#D7261E'] });
  }
  const confirmMessage = saved ? [
    `Hello ${restaurant.name}! I'd like to confirm this table request:`, `Name: ${saved.name}`, `Phone: ${saved.phone}`,
    `Email: ${saved.email}`, `Date: ${saved.date}`, `Time: ${saved.time}`, `Guests: ${saved.guests}`,
    `Occasion: ${saved.occasion}`, `Requests: ${saved.requests || 'None'}`
  ].join('\n') : '';
  if (saved) return <div className="booking-success glass-card"><span className="success-icon"><CheckCircle2 size={42} /></span><span className="eyebrow">REQUEST RECEIVED</span><h2>Your table is almost ready.</h2><p>Thanks, {saved.name}. Your reservation request has been saved on this device. Please confirm it with the restaurant on WhatsApp.</p><div className="success-summary"><span><CalendarDays /> {saved.date}</span><span><Clock /> {saved.time}</span><span><Utensils /> {saved.guests} guests</span></div><a className="button button-gold" href={whatsappLink(confirmMessage)} target="_blank" rel="noreferrer"><MessageCircle /> Confirm on WhatsApp</a><button className="text-button" onClick={() => { setSaved(null); setForm(blankBooking); }}>Make another reservation</button><small>Demo mode: this prototype does not send a booking to a live restaurant system.</small></div>;
  return <form className="reservation-form glass-card" onSubmit={submit} noValidate>
    <div className="form-grid"><label>Full name<input value={form.name} onChange={e => update('name', e.target.value)} placeholder="Your name" autoComplete="name" />{errors.name && <small className="field-error">{errors.name}</small>}</label>
      <label>Phone number<input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="10-digit mobile number" inputMode="tel" autoComplete="tel" />{errors.phone && <small className="field-error">{errors.phone}</small>}</label>
      <label className="full-field">Email address<input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email" />{errors.email && <small className="field-error">{errors.email}</small>}</label>
      <label>Date<input type="date" min={minDate} value={form.date} onChange={e => update('date', e.target.value)} />{errors.date && <small className="field-error">{errors.date}</small>}</label>
      <label>Occasion<select value={form.occasion} onChange={e => update('occasion', e.target.value)}>{['Casual dining', 'Birthday', 'Anniversary', 'Family gathering', 'Business meal', 'Other'].map(x => <option key={x}>{x}</option>)}</select></label>
    </div>
    <div className="form-section"><div className="form-label-row"><span>Choose a time</span><span>Lunch · 12–3 PM / Dinner · 6:30–9 PM</span></div><div className="slot-grid">{timeSlots.map(slot => <button type="button" key={slot} className={form.time === slot ? 'slot active' : 'slot'} onClick={() => update('time', slot)}>{slot}</button>)}</div>{errors.time && <small className="field-error">{errors.time}</small>}</div>
    <div className="form-section guest-row"><div><span className="form-strong">Number of guests</span><small>From 1 to 12 people</small></div><div className="stepper"><button type="button" aria-label="Remove one guest" onClick={() => update('guests', Math.max(1, form.guests - 1))}><Minus /></button><strong>{form.guests}</strong><button type="button" aria-label="Add one guest" onClick={() => update('guests', Math.min(12, form.guests + 1))}><Plus /></button></div></div>
    <label>Special requests <span className="optional">(optional)</span><textarea rows="3" value={form.requests} onChange={e => update('requests', e.target.value)} placeholder="Dietary preferences, accessibility needs or a special note..." /></label>
    <button className="button button-gold submit-booking" type="submit">Request a table <CalendarDays size={17} /></button><p className="form-note">Your request is saved locally in this demo. The restaurant will confirm availability through WhatsApp.</p>
  </form>;
}
function QuickBookingModal({ onClose }) {
  useEffect(() => {
    const closeOnEscape = event => { if (event.key === 'Escape') onClose(); };
    window.addEventListener('keydown', closeOnEscape);
    return () => window.removeEventListener('keydown', closeOnEscape);
  }, [onClose]);
  return <motion.div className="modal-backdrop quick-book-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={event => event.target === event.currentTarget && onClose()}>
    <motion.div className="quick-book-dialog" role="dialog" aria-modal="true" aria-label="Book a table" initial={{ opacity: 0, y: 24, scale: .98 }} animate={{ opacity: 1, y: 0, scale: 1 }} exit={{ opacity: 0, y: 20 }}>
      <button className="modal-close" onClick={onClose} aria-label="Close booking form"><X /></button>
      <span className="eyebrow">BOOK A SEAT</span><h2>Let's save you a table.</h2><p>Share your details and send us a table request.</p><ReservationForm />
    </motion.div>
  </motion.div>;
}

function Reservations() {
  return <main><section className="page-hero reservation-hero"><div className="shell"><Link className="back-link" to="/"><ArrowLeft size={15} /> Back home</Link><span className="eyebrow">A PLACE AT OUR TABLE</span><h1>Good things happen<br /><em>around the table.</em></h1><p>Gather your favourite people. Tell us when, and we’ll help make it a lovely meal.</p></div></section>
    <section className="shell reservation-layout"><div className="reservation-aside"><span className="eyebrow">MAKE IT A MOMENT</span><h2>We saved you<br /><em>a seat.</em></h2><p>Share a few details and send us your table request. Our team will confirm availability with you on WhatsApp.</p><div className="aside-info"><span><Clock /> Every day · 11 AM – 11 PM</span><span><MapPin /> {restaurant.address}</span><OpenBadge /></div><div className="reservation-aside-note">“The fondest memories are made when gathered around the table.”</div></div><div><Heading eyebrow="BOOK A SEAT" title="Request a reservation" desc="A few details, then you're one step closer to something delicious." /><ReservationForm /></div></section>
  </main>;
}
function Contact() {
  const [form, setForm] = useState({ name: '', email: '', message: '' }), [sent, setSent] = useState(false);
  function submit(event) {
    event.preventDefault(); if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 5) return;
    const message = `Hello ${restaurant.name},\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`;
    window.open(whatsappLink(message), '_blank', 'noopener,noreferrer'); setSent(true);
  }
  return <main><section className="page-hero"><div className="shell"><span className="eyebrow">WE'D LOVE TO HEAR FROM YOU</span><h1>Say hello.<br /><em>Stay a little.</em></h1><p>Planning a visit, a celebration or just curious about the menu? We're all ears.</p></div></section>
    <section className="shell contact-content"><Heading eyebrow="FIND YOUR WAY TO US" title="Let's get talking." desc="Reach out in the way that feels easiest. Our team would love to help." />
      <div className="contact-cards"><a className="contact-card" href={`tel:${restaurant.phone}`}><span><Phone /></span><small>GIVE US A CALL</small><strong>{restaurant.phone}</strong><i>Tap to call <ArrowUpRight /></i></a>
        <a className="contact-card" href={whatsappLink('Hello Desi Spices!')} target="_blank" rel="noreferrer"><span><MessageCircle /></span><small>WHATSAPP</small><strong>Chat with our team</strong><i>Start a conversation <ArrowUpRight /></i></a>
        <a className="contact-card" href={`mailto:${restaurant.email}`}><span><Mail /></span><small>DROP US A LINE</small><strong>{restaurant.email}</strong><i>Send an email <ArrowUpRight /></i></a>
        <a className="contact-card" href={restaurant.instagram} target="_blank" rel="noreferrer"><span><Instagram /></span><small>FOLLOW ALONG</small><strong>Instagram</strong><i>See what's cooking <ArrowUpRight /></i></a><a className="contact-card" href={restaurant.facebook} target="_blank" rel="noreferrer"><span><Facebook /></span><small>JOIN THE COMMUNITY</small><strong>Facebook</strong><i>Follow our updates <ArrowUpRight /></i></a>
      </div>
      <div className="contact-lower"><div className="map-wrap"><iframe title="Map showing restaurant location" src={restaurant.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade" allowFullScreen /><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`} target="_blank" rel="noreferrer" className="map-link"><MapPin size={16} /> Open in Google Maps <ArrowUpRight size={15} /></a></div>
        <div className="contact-side"><div className="hours-card glass-card"><div className="hours-head"><div><span className="eyebrow">COME ON IN</span><h3>Opening hours</h3></div><OpenBadge /></div>{restaurant.openingHours.map(hours => <div className="hours-row" key={hours.day}><span>{hours.day}</span><strong>{hours.open} – {hours.close}</strong></div>)}<p><Clock size={14} /> Hours may vary on special days.</p></div>
          <form className="contact-form glass-card" onSubmit={submit}><span className="eyebrow">SEND A NOTE</span><h3>What's on your mind?</h3><label>Your name<input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" /></label><label>Email address<input type="email" required value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" /></label><label>Your message<textarea required minLength="5" rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Tell us how we can help..." /></label><div className="contact-form-actions"><button className="button button-gold">Send via WhatsApp <Send size={16} /></button><button type="button" className="button button-ghost" onClick={() => { const body = `Name: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`; window.location.href = `mailto:${restaurant.email}?subject=${encodeURIComponent('Website enquiry')}&body=${encodeURIComponent(body)}`; }}>Send by email <Mail size={16} /></button></div>{sent && <small className="success-note">Your message is ready in WhatsApp. Press send there to deliver it.</small>}</form>
        </div>
      </div>
    </section>
  </main>;
}

function Loader() {
  const [visible, setVisible] = useState(true);
  useEffect(() => { const timer = setTimeout(() => setVisible(false), 700); return () => clearTimeout(timer); }, []);
  return <AnimatePresence>{visible && <motion.div className="loading-screen" initial={{ opacity: 1 }} exit={{ opacity: 0 }}><div className="mandala"><span>✺</span></div><strong>DESI SPICES</strong><small>PREPARING SOMETHING SPECIAL</small></motion.div>}</AnimatePresence>;
}
function Cursor() {
  useEffect(() => {
    if (!window.matchMedia('(pointer:fine)').matches) return undefined;
    const element = document.querySelector('.custom-cursor');
    const move = event => { element.style.transform = `translate3d(${event.clientX}px, ${event.clientY}px, 0)`; };
    window.addEventListener('pointermove', move); return () => window.removeEventListener('pointermove', move);
  }, []);
  return <div className="custom-cursor" aria-hidden="true" />;
}
function AnimatedRoutes() {
  const location = useLocation();
  return <AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .22 }}><Routes location={location}><Route path="/" element={<Home />} /><Route path="/menu" element={<MenuPage />} /><Route path="/reservations" element={<Reservations />} /><Route path="/contact" element={<Contact />} /><Route path="*" element={<Home />} /></Routes></motion.div></AnimatePresence>;
}
export default function App() {
  const [quickBookOpen, setQuickBookOpen] = useState(false);
  useEffect(() => {
    const schema = { '@context': 'https://schema.org', '@type': 'Restaurant', name: restaurant.name, description: restaurant.tagline, telephone: restaurant.phone, email: restaurant.email, address: restaurant.address, servesCuisine: ['Indian', 'North Indian', 'South Indian'], acceptsReservations: true, priceRange: '₹₹', openingHours: restaurant.openingHours.map(day => day.day.slice(0, 2) + ' ' + day.open + '-' + day.close) };
    let script = document.getElementById('restaurant-schema');
    if (!script) { script = document.createElement('script'); script.id = 'restaurant-schema'; script.type = 'application/ld+json'; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
  }, []);
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return undefined;
    const lenis = new Lenis({ duration: 1.1, smoothWheel: true });
    lenis.on('scroll', ScrollTrigger.update);
    let raf;
    const frame = time => { lenis.raf(time); raf = requestAnimationFrame(frame); };
    raf = requestAnimationFrame(frame);
    return () => { cancelAnimationFrame(raf); lenis.destroy(); };
  }, []);
  return <><Loader /><Cursor /><Navbar onQuickBook={() => setQuickBookOpen(true)} /><AnimatedRoutes /><Footer /><FloatingActions /><AnimatePresence>{quickBookOpen && <QuickBookingModal onClose={() => setQuickBookOpen(false)} />}</AnimatePresence></>;
}
