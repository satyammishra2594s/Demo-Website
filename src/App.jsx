import { useEffect, useMemo, useRef, useState } from 'react';
import { Link, NavLink, Route, Routes, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';
import {
  ArrowRight, ArrowUpRight, CalendarDays, ChevronLeft, ChevronRight, Clock,
  Heart, Instagram, Mail, MapPin, Menu as MenuIcon, MessageCircle, Minus,
  Phone, Plus, Search, Send, Star, Utensils, X
} from 'lucide-react';
import confetti from 'canvas-confetti';
import { restaurant, formatPrice, whatsappLink } from './config';
import { images } from './data/images';
import { categories, menuItems, signatureDishes } from './data/menu';
import { createReservation, getFavourites, saveFavourites, subscribeNewsletter } from './services/api';

const cx = (...parts) => parts.filter(Boolean).join(' ');

function Photo({ src, fallback, alt, className = '', ...props }) {
  const [current, setCurrent] = useState(src);
  const [failed, setFailed] = useState(false);
  useEffect(() => { setCurrent(src); setFailed(false); }, [src]);
  return failed
    ? <div className={cx('photo-placeholder', className)} role="img" aria-label={alt}><span>DESI SPICES · PHOTOGRAPH SLOT</span></div>
    : <img src={current} alt={alt} className={className} loading="lazy" onError={() => { if (fallback && current !== fallback) setCurrent(fallback); else setFailed(true); }} {...props} />;
}

function useOpenStatus() {
  const get = () => {
    const now = new Date();
    const hours = restaurant.openingHours[now.getDay()];
    const mins = now.getHours() * 60 + now.getMinutes();
    const [oh, om] = hours.open.split(':').map(Number);
    const [ch, cm] = hours.close.split(':').map(Number);
    return { open: mins >= oh * 60 + om && mins < ch * 60 + cm, today: hours };
  };
  const [status, setStatus] = useState(get);
  useEffect(() => { const t = setInterval(() => setStatus(get()), 30000); return () => clearInterval(t); }, []);
  return status;
}

function Reveal({ children, className = '', delay = 0 }) {
  const ref = useRef(null);
  const [visible, setVisible] = useState(false);
  useEffect(() => {
    const node = ref.current;
    if (!node || !('IntersectionObserver' in window) || window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setVisible(true); return; }
    const observer = new IntersectionObserver(([entry]) => {
      if (entry.isIntersecting) { setVisible(true); observer.disconnect(); }
    }, { threshold: 0.12, rootMargin: '0px 0px -35px 0px' });
    observer.observe(node);
    return () => observer.disconnect();
  }, []);
  return <div ref={ref} className={cx('reveal', visible && 'is-visible', className)} style={{ '--reveal-delay': `${delay}ms` }}>{children}</div>;
}

function SectionLabel({ children, number }) {
  return <div className="section-label"><span>{number || '✳'}</span><span>{children}</span></div>;
}

function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => {
    const tick = () => setScrolled(window.scrollY > 32);
    tick(); window.addEventListener('scroll', tick, { passive: true });
    return () => window.removeEventListener('scroll', tick);
  }, []);
  useEffect(() => { setOpen(false); }, [location.pathname]);
  const links = [['Menu', '/menu'], ['Ambience', '/#ambience'], ['About', '/#about'], ['Reviews', '/#reviews'], ['Contact', '/contact']];
  return <header className={cx('site-header', scrolled && 'is-scrolled')}>
    <nav className="nav-inner wrap" aria-label="Main navigation">
      <Link to="/" className="wordmark" aria-label={`${restaurant.name} home`}>
        <span className="wordmark-symbol"><Utensils size={19} strokeWidth={1.35}/></span>
        <span><b>{restaurant.name}</b><small>INDIAN KITCHEN · EST. WITH LOVE</small></span>
      </Link>
      <div className="desktop-nav">{links.map(([label, path]) => <NavLink key={label} to={path} end={path === '/menu'}>{label}</NavLink>)}</div>
      <Link className="nav-book" to="/reservations">Book a Table <ArrowUpRight size={15}/></Link>
      <button className="mobile-menu-btn" onClick={() => setOpen(v => !v)} aria-label={open ? 'Close navigation' : 'Open navigation'} aria-expanded={open}>{open ? <X/> : <MenuIcon/>}</button>
    </nav>
    <AnimatePresence>{open && <motion.div className="mobile-nav" initial={{ opacity: 0, y: -8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}>
      {links.map(([label, path]) => <Link key={label} to={path}>{label}</Link>)}<Link className="mobile-nav-book" to="/reservations">Reserve a Table <ArrowUpRight size={15}/></Link>
    </motion.div>}</AnimatePresence>
  </header>;
}

function Footer() {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState('');
  async function submit(e) {
    e.preventDefault();
    if (!/^\S+@\S+\.\S+$/.test(email)) { setStatus('Please enter a valid email.'); return; }
    await subscribeNewsletter(email); setEmail(''); setStatus('Thank you. You are on the list.');
  }
  return <footer className="site-footer">
    <div className="wrap footer-main">
      <div className="footer-intro"><Link to="/" className="wordmark footer-wordmark"><span className="wordmark-symbol"><Utensils size={19}/></span><span><b>{restaurant.name}</b><small>INDIAN KITCHEN · EST. WITH LOVE</small></span></Link><p>Good food has a way of bringing everyone a little closer. There is always room at our table.</p><div className="footer-social"><a href={restaurant.instagram} aria-label="Instagram"><Instagram size={17}/></a><a href={restaurant.facebook} aria-label="Facebook"><span className="facebook-letter">f</span></a></div></div>
      <div className="footer-links"><h4>Explore</h4><Link to="/menu">The menu</Link><Link to="/#about">Our story</Link><Link to="/#ambience">The space</Link><Link to="/reservations">Reservations</Link></div>
      <div className="footer-links"><h4>Find us</h4><p>{restaurant.address}</p><a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a><a href={`mailto:${restaurant.email}`}>{restaurant.email}</a></div>
      <div className="footer-news"><h4>A note from our kitchen</h4><p>Seasonal plates, special evenings and little things worth sharing.</p><form className="newsletter-form" onSubmit={submit}><input type="email" value={email} onChange={e => setEmail(e.target.value)} placeholder="Your email address" aria-label="Your email address"/><button aria-label="Subscribe"><ArrowUpRight size={17}/></button></form><small aria-live="polite">{status}</small></div>
    </div>
    <div className="wrap footer-bottom"><span>© {new Date().getFullYear()} {restaurant.name}. All rights reserved.</span><span>Prepared slowly. Served warmly.</span></div>
  </footer>;
}

function FloatingContact() {
  return <><div className="floating-contact"><a href={whatsappLink('Hello, I would like to know more about Desi Spices.')} aria-label="WhatsApp"><MessageCircle size={19}/></a><a href={`tel:${restaurant.phone}`} aria-label="Call restaurant"><Phone size={18}/></a></div><div className="mobile-reserve-bar"><a href={`tel:${restaurant.phone}`}><Phone size={16}/> Call</a><Link to="/reservations"><CalendarDays size={16}/> Reserve a Table</Link></div></>;
}

function Hero() {
  const videoRef = useRef(null);
  const [videoReady, setVideoReady] = useState(false);
  return <section className="hero" id="home">
    <Photo src={images.hero.local} fallback={images.hero.fallback} alt="Warm café-style restaurant interior with wooden dining tables, chairs and pendant lights" className="hero-poster"/>
    <video ref={videoRef} className={cx('hero-video', videoReady && 'video-ready')} autoPlay muted loop playsInline poster={images.hero.local} onCanPlay={() => setVideoReady(true)} onError={() => setVideoReady(false)} aria-hidden="true"><source src="/images/hero.mp4" type="video/mp4"/></video>
    <div className="hero-shade"/><div className="hero-grain"/>
    <div className="wrap hero-content"><Reveal><span className="hero-kicker">A TABLE FULL OF INDIA</span><h1>Come for the<br/><em>flavour.</em> Stay for<br/>the feeling.</h1><p>From the first fragrant tadka to the last bite of something sweet, every meal is a reason to gather.</p><div className="hero-actions"><Link to="/reservations" className="button button-light">Reserve a Table <ArrowUpRight size={16}/></Link><Link to="/menu" className="button button-text-light">View Menu <ArrowRight size={16}/></Link></div></Reveal></div>
    <div className="hero-bottom wrap"><span>FRESHLY PREPARED · ALWAYS WELCOMING</span><a href="#about">SCROLL TO FEEL THE PLACE <span>↓</span></a><span>11:00 AM — 11:00 PM</span></div>
  </section>;
}

function StorySection() {
  return <section className="story-section section-space" id="about"><div className="wrap story-layout">
    <div className="story-visual"><Reveal className="story-photo-main"><Photo src={images.story.main.local} fallback={images.story.main.fallback} alt="A table set for a relaxed Indian meal"/></Reveal><Reveal className="story-photo-detail" delay={130}><Photo src={images.story.detail.local} fallback={images.story.detail.fallback} alt="Traditional spices and ingredients prepared for cooking"/></Reveal><div className="story-note">A little patience.<br/>A generous pinch of spice.</div></div>
    <Reveal className="story-copy"><SectionLabel number="01">A LITTLE ABOUT US</SectionLabel><p className="script-line">The good things take time.</p><h2>Food that feels<br/>like <em>coming home.</em></h2><p>We believe a meal is more than what arrives at the table. It is the aroma drifting from the kitchen, the familiar comfort of a well-loved recipe, and the warmth of being looked after.</p><p>Our cooking takes its cues from India's many kitchens: spices toasted just so, fresh ingredients, slow-simmered gravies and dishes made to be passed around.</p><Link to="/menu" className="inline-link">A look at the menu <ArrowUpRight size={16}/></Link><div className="story-signoff"><span className="signoff-rule"/><span>With warmth, from our kitchen</span></div></Reveal>
  </div></section>;
}

function AmbienceSection() {
  const scroller = useRef(null);
  const [active, setActive] = useState(0);
  const photos = images.ambience;
  function move(dir) { if (!scroller.current) return; scroller.current.scrollBy({ left: dir * scroller.current.clientWidth * .72, behavior: 'smooth' }); }
  useEffect(() => {
    const el = scroller.current; if (!el) return;
    const onScroll = () => { const item = el.querySelector('.ambience-shot'); if (item) setActive(Math.round(el.scrollLeft / (item.offsetWidth + 18))); };
    el.addEventListener('scroll', onScroll, { passive: true }); return () => el.removeEventListener('scroll', onScroll);
  }, []);
  return <section className="ambience-section section-space" id="ambience"><div className="wrap ambience-heading"><Reveal><SectionLabel number="02">A PLACE TO SETTLE IN</SectionLabel><h2>Stay a while.<br/><em>Make a memory.</em></h2><p>Long lunches, unhurried dinners, familiar faces and the comforting hum of a room that feels just right.</p></Reveal><div className="rail-controls"><button onClick={() => move(-1)} aria-label="Previous ambience photos"><ChevronLeft/></button><button onClick={() => move(1)} aria-label="Next ambience photos"><ChevronRight/></button></div></div>
    <div className="ambience-rail" ref={scroller}>{photos.map((photo, i) => <figure className={`ambience-shot ambience-shot-${i + 1}`} key={photo.local}><Photo src={photo.local} fallback={photo.fallback} alt={photo.alt}/><figcaption><span>0{i + 1}</span>{photo.caption}</figcaption></figure>)}</div>
    <div className="wrap rail-footer"><span>THE SPACE, BETWEEN THE MOMENTS</span><div className="rail-progress"><span style={{ width: `${100 / photos.length}%`, transform: `translateX(${active * 100}%)` }}/></div><span>0{Math.min(active + 1, photos.length)} / 0{photos.length}</span></div>
  </section>;
}

function DishCard({ dish, index, favourite, onFavourite, onOpen }) {
  return <Reveal className="dish-reveal" delay={index * 65}><article className="dish-card">
    <button className="dish-photo" onClick={onOpen} aria-label={`View ${dish.name}`}><Photo src={dish.image} fallback={dish.imageFallback || images.dishFallback} alt={dish.name}/>{dish.tags?.[0] && <span className="dish-ribbon">{dish.tags[0]}</span>}</button>
    <div className="dish-info"><div className="dish-meta"><span className={cx('veg-indicator', dish.isVeg ? 'is-veg' : 'is-nonveg')}/><span>{dish.category}</span><button className={cx('favourite-button', favourite && 'is-favourite')} onClick={onFavourite} aria-label={favourite ? 'Remove from favourites' : 'Add to favourites'}><Heart size={17} fill={favourite ? 'currentColor' : 'none'}/></button></div><button className="dish-name" onClick={onOpen}>{dish.name}</button><p>{dish.description}</p><div className="dish-price-row"><strong>{formatPrice(dish.price)}</strong><button onClick={onOpen} aria-label={`More about ${dish.name}`}>Discover <ArrowUpRight size={14}/></button></div></div>
  </article></Reveal>;
}

function DishDialog({ dish, onClose, favourite, onFavourite }) {
  useEffect(() => { if (!dish) return; const onKey = e => e.key === 'Escape' && onClose(); window.addEventListener('keydown', onKey); return () => window.removeEventListener('keydown', onKey); }, [dish, onClose]);
  return <AnimatePresence>{dish && <motion.div className="dialog-backdrop" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} onMouseDown={e => e.target === e.currentTarget && onClose()}><motion.div className="dish-dialog" role="dialog" aria-modal="true" aria-label={dish.name} initial={{ y: 25, opacity: 0 }} animate={{ y: 0, opacity: 1 }} exit={{ y: 15, opacity: 0 }}><button className="dialog-close" onClick={onClose} aria-label="Close"><X/></button><Photo src={dish.image} fallback={dish.imageFallback || images.dishFallback} alt={dish.name}/><div className="dialog-copy"><span className="eyebrow">{dish.category}</span><h2>{dish.name}</h2><p>{dish.description}</p><div className="dialog-price">{formatPrice(dish.price)}</div><p className="dialog-demo-note">Menu, ingredients and prices shown here are sample content for the website demo.</p><button className="button button-dark" onClick={onFavourite}><Heart size={16} fill={favourite ? 'currentColor' : 'none'}/>{favourite ? 'Saved to favourites' : 'Save this dish'}</button></div></motion.div></motion.div>}</AnimatePresence>;
}

function SignatureSection() {
  const [dish, setDish] = useState(null);
  const [favourites, setFavourites] = useState(getFavourites);
  const toggle = id => { const next = favourites.includes(id) ? favourites.filter(x => x !== id) : [...favourites, id]; setFavourites(next); saveFavourites(next); };
  return <section className="signature-section section-space"><div className="wrap"><div className="signature-heading"><Reveal><SectionLabel number="03">FROM OUR KITCHEN</SectionLabel><h2>A few house<br/><em>favourites.</em></h2><p>Some dishes find their way into your regular order. These are a few of ours.</p></Reveal><Link to="/menu" className="inline-link">See everything on the menu <ArrowUpRight size={16}/></Link></div><div className="signature-grid">{signatureDishes.slice(0, 3).map((item, i) => <DishCard key={item.id} dish={item} index={i} favourite={favourites.includes(item.id)} onFavourite={() => toggle(item.id)} onOpen={() => setDish(item)}/>)}</div></div><DishDialog dish={dish} onClose={() => setDish(null)} favourite={dish ? favourites.includes(dish.id) : false} onFavourite={() => dish && toggle(dish.id)}/></section>;
}

function KitchenSection() {
  return <section className="kitchen-section"><div className="kitchen-image"><Photo src={images.kitchen.local} fallback={images.kitchen.fallback} alt="A cook preparing food in a busy restaurant kitchen"/></div><div className="kitchen-panel"><SectionLabel number="04">FROM THE HEARTH</SectionLabel><h2>Good things<br/>start with a<br/><em>little sizzle.</em></h2><p>Whole spices wake up in hot oil. Onions turn sweet and golden. The tandoor gives bread its char and a curry gets the time it needs. It is the small details that make the difference, and we take our time with them.</p><Link to="/menu" className="inline-link">Explore the kitchen's favourites <ArrowRight size={16}/></Link><span className="kitchen-caption">FRESHLY PREPARED, THROUGHOUT THE DAY</span></div></section>;
}

const testimonials = [
  ['The kind of place where you order one more thing because the table is having such a good time.', 'A recent guest'],
  ['Beautifully balanced spices, warm service and a meal that made us slow down and enjoy it.', 'A dinner guest'],
  ['We came for lunch and stayed for chai. It felt easy, familiar and genuinely welcoming.', 'A weekend visitor']
];
function ReviewsSection() {
  const [index, setIndex] = useState(0);
  return <section className="reviews-section section-space" id="reviews"><div className="wrap reviews-wrap"><Reveal className="reviews-intro"><SectionLabel number="05">KIND WORDS, SHARED</SectionLabel><h2>Best enjoyed<br/><em>together.</em></h2><p>Good food is only part of the story. The people around the table make the rest.</p><div className="review-stars" aria-label="Five stars">★★★★★</div></Reveal><div className="review-quote"><span className="quote-mark">“</span><AnimatePresence mode="wait"><motion.div key={index} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: .25 }}><blockquote>{testimonials[index][0]}</blockquote><cite>{testimonials[index][1]}</cite></motion.div></AnimatePresence><div className="review-controls"><span>0{index + 1} <i>/ 0{testimonials.length}</i></span><button onClick={() => setIndex((index + testimonials.length - 1) % testimonials.length)} aria-label="Previous review"><ChevronLeft/></button><button onClick={() => setIndex((index + 1) % testimonials.length)} aria-label="Next review"><ChevronRight/></button></div></div></div></section>;
}

function VisitSection() {
  const status = useOpenStatus();
  return <section className="visit-section"><div className="wrap visit-layout"><div className="visit-copy"><SectionLabel number="06">COME BY WHENEVER</SectionLabel><h2>We’ll keep<br/>a place <em>for you.</em></h2><p>Whether it is a quick lunch, a family dinner or a reason to celebrate, we would love to welcome you in.</p><Link to="/reservations" className="button button-dark">Reserve a Table <ArrowUpRight size={16}/></Link></div><div className="visit-details"><div className="visit-detail-row"><MapPin/><div><small>FIND US</small><p>{restaurant.address}</p></div></div><div className="visit-detail-row"><Clock/><div><small>OPENING HOURS</small><p>Every day · 11:00 AM – 11:00 PM</p><span className={cx('live-status', status.open ? 'open' : 'closed')}>{status.open ? 'Open now' : 'Currently closed'}</span></div></div><div className="visit-links"><a href={`tel:${restaurant.phone}`}><Phone size={16}/> Call the restaurant</a><a href={whatsappLink('Hello Desi Spices, I would like to plan a visit.')}><MessageCircle size={16}/> WhatsApp us</a></div></div></div></section>;
}

function HomePage() {
  return <main><Hero/><StorySection/><AmbienceSection/><SignatureSection/><KitchenSection/><ReviewsSection/><VisitSection/></main>;
}

function MenuPage() {
  const [category, setCategory] = useState('All');
  const [query, setQuery] = useState('');
  const [diet, setDiet] = useState('all');
  const [sort, setSort] = useState('featured');
  const [favouritesOnly, setFavouritesOnly] = useState(false);
  const [favourites, setFavourites] = useState(getFavourites);
  const [selected, setSelected] = useState(null);
  const filtered = useMemo(() => {
    const list = menuItems.filter(item => (category === 'All' || item.category === category) && (!query || `${item.name} ${item.description} ${item.tags.join(' ')}`.toLowerCase().includes(query.toLowerCase())) && (diet === 'all' || (diet === 'veg' ? item.isVeg : !item.isVeg)) && (!favouritesOnly || favourites.includes(item.id)));
    if (sort === 'low') list.sort((a, b) => a.price - b.price);
    if (sort === 'high') list.sort((a, b) => b.price - a.price);
    if (sort === 'az') list.sort((a, b) => a.name.localeCompare(b.name));
    return list;
  }, [category, query, diet, sort, favouritesOnly, favourites]);
  const toggle = id => { const next = favourites.includes(id) ? favourites.filter(x => x !== id) : [...favourites, id]; setFavourites(next); saveFavourites(next); };
  return <main className="inner-page menu-page"><section className="page-masthead"><div className="wrap"><SectionLabel number="01">A LITTLE SOMETHING FOR EVERYONE</SectionLabel><h1>Made with care.<br/><em>Served with heart.</em></h1><p>A menu of familiar favourites, regional inspiration and a few things you might not have tried yet.</p><div className="masthead-foot"><span>12 CATEGORIES · 96 DISHES</span><span>ALL PRICES IN INR · SAMPLE MENU</span></div></div></section>
    <section className="wrap menu-content"><div className="menu-filter-sticky"><div className="menu-category-row">{['All', ...categories].map(name => <button key={name} className={category === name ? 'selected' : ''} onClick={() => setCategory(name)}>{name}</button>)}</div></div>
      <div className="menu-tools"><label className="search-field"><Search size={17}/><input value={query} onChange={e => setQuery(e.target.value)} placeholder="Find a dish or ingredient" aria-label="Search menu"/></label><div className="menu-selects"><button className={favouritesOnly ? 'selected' : ''} onClick={() => setFavouritesOnly(v => !v)}><Heart size={15} fill={favouritesOnly ? 'currentColor' : 'none'}/> Favourites</button><label><span>Diet</span><select value={diet} onChange={e => setDiet(e.target.value)}><option value="all">All</option><option value="veg">Vegetarian</option><option value="nonveg">Non-vegetarian</option></select></label><label><span>Sort</span><select value={sort} onChange={e => setSort(e.target.value)}><option value="featured">Featured</option><option value="low">Price: low to high</option><option value="high">Price: high to low</option><option value="az">Name: A to Z</option></select></label></div></div>
      <div className="menu-count"><span>{filtered.length} dishes</span><span>Recipes and pricing are illustrative demo content.</span></div>
      <div className="menu-list-grid"><AnimatePresence mode="popLayout">{filtered.map((item, i) => <DishCard key={item.id} dish={item} index={i % 6} favourite={favourites.includes(item.id)} onFavourite={() => toggle(item.id)} onOpen={() => setSelected(item)}/>)}</AnimatePresence></div>
      {filtered.length === 0 && <div className="no-results"><h3>Nothing on the menu by that name.</h3><p>Try a different search or clear the filters.</p><button className="inline-link" onClick={() => { setCategory('All'); setQuery(''); setDiet('all'); setFavouritesOnly(false); }}>Clear filters <ArrowRight size={15}/></button></div>}
    </section><DishDialog dish={selected} onClose={() => setSelected(null)} favourite={selected ? favourites.includes(selected.id) : false} onFavourite={() => selected && toggle(selected.id)}/></main>;
}

const slots = ['12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM', '02:00 PM', '02:30 PM', '06:30 PM', '07:00 PM', '07:30 PM', '08:00 PM', '08:30 PM', '09:00 PM'];
const blank = { name: '', phone: '', email: '', date: '', time: '07:30 PM', guests: 2, occasion: 'Just because', requests: '' };
function ReservationForm() {
  const [form, setForm] = useState(blank);
  const [errors, setErrors] = useState({});
  const [saved, setSaved] = useState(null);
  const today = new Date(Date.now() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 10);
  const update = (key, value) => { setForm(old => ({ ...old, [key]: value })); setErrors(old => ({ ...old, [key]: '' })); };
  function validate() {
    const e = {};
    if (form.name.trim().length < 2) e.name = 'Please add your name.';
    if (!/^[6-9]\d{9}$/.test(form.phone.replace(/\D/g, ''))) e.phone = 'Enter a valid 10-digit mobile number.';
    if (!/^\S+@\S+\.\S+$/.test(form.email)) e.email = 'Please enter a valid email address.';
    if (!form.date || form.date < today) e.date = 'Choose today or a future date.';
    setErrors(e); return Object.keys(e).length === 0;
  }
  async function submit(e) {
    e.preventDefault(); if (!validate()) return;
    const record = await createReservation(form); setSaved(record);
    confetti({ particleCount: 85, spread: 55, origin: { y: .7 }, colors: ['#c18b35', '#f3e8d5', '#8b3025'] });
  }
  const message = saved ? [`Hello ${restaurant.name}, I'd like to confirm this reservation request.`, `Name: ${saved.name}`, `Phone: ${saved.phone}`, `Email: ${saved.email}`, `Date: ${saved.date}`, `Time: ${saved.time}`, `Guests: ${saved.guests}`, `Occasion: ${saved.occasion}`, `Requests: ${saved.requests || 'None'}`].join('\n') : '';
  if (saved) return <div className="booking-confirm"><div className="confirmation-mark">✓</div><span className="eyebrow">THANK YOU, {saved.name.split(' ')[0].toUpperCase()}</span><h2>Your table request<br/><em>is with us.</em></h2><p>We have saved your request in this demo. Send the details to our team on WhatsApp so they can confirm availability.</p><div className="confirmation-details"><span>{saved.date}</span><span>{saved.time}</span><span>{saved.guests} guests</span></div><a className="button button-dark" href={whatsappLink(message)} target="_blank" rel="noreferrer"><MessageCircle size={16}/> Confirm on WhatsApp</a><button className="inline-link reset-booking" onClick={() => { setSaved(null); setForm(blank); }}>Make another request</button><small>Demo mode · No live booking is sent automatically.</small></div>;
  return <form className="booking-form" onSubmit={submit} noValidate>
    <div className="booking-fields"><label>Your name<input value={form.name} onChange={e => update('name', e.target.value)} placeholder="How should we address you?" autoComplete="name"/>{errors.name && <small className="form-error">{errors.name}</small>}</label><label>Mobile number<input value={form.phone} onChange={e => update('phone', e.target.value)} placeholder="10-digit mobile number" inputMode="tel" autoComplete="tel"/>{errors.phone && <small className="form-error">{errors.phone}</small>}</label><label>Email address<input type="email" value={form.email} onChange={e => update('email', e.target.value)} placeholder="you@example.com" autoComplete="email"/>{errors.email && <small className="form-error">{errors.email}</small>}</label><label>Date<input type="date" min={today} value={form.date} onChange={e => update('date', e.target.value)}/>{errors.date && <small className="form-error">{errors.date}</small>}</label></div>
    <div className="booking-block"><div className="booking-label-row"><span>Choose a time</span><small>LUNCH · 12–3 PM &nbsp; / &nbsp; DINNER · 6:30–9 PM</small></div><div className="time-slots">{slots.map(slot => <button type="button" key={slot} className={form.time === slot ? 'active' : ''} onClick={() => update('time', slot)}>{slot}</button>)}</div></div>
    <div className="booking-inline"><div><b>Number of guests</b><small>Tell us how many places to set.</small></div><div className="guest-stepper"><button type="button" aria-label="Remove guest" onClick={() => update('guests', Math.max(1, form.guests - 1))}><Minus size={14}/></button><strong>{form.guests}</strong><button type="button" aria-label="Add guest" onClick={() => update('guests', Math.min(12, form.guests + 1))}><Plus size={14}/></button></div></div>
    <div className="booking-fields"><label>What brings you in?<select value={form.occasion} onChange={e => update('occasion', e.target.value)}>{['Just because', 'Birthday', 'Anniversary', 'Family get-together', 'Business meal', 'Other'].map(x => <option key={x}>{x}</option>)}</select></label><label className="full-field">Anything we should know? <span className="optional">Optional</span><textarea rows="3" value={form.requests} onChange={e => update('requests', e.target.value)} placeholder="A note about dietary needs, seating or a special occasion..."/></label></div>
    <button className="button button-dark booking-submit" type="submit">Send a table request <ArrowUpRight size={16}/></button><p className="booking-disclaimer">A request is not a confirmed reservation. Our team will confirm with you directly.</p>
  </form>;
}
function ReservationsPage() {
  return <main className="inner-page reservations-page"><section className="page-masthead"><div className="wrap"><SectionLabel number="01">A PLACE AT OUR TABLE</SectionLabel><h1>Let's make room<br/><em>for a good meal.</em></h1><p>Tell us when you would like to visit. We'll get back to you to confirm the details.</p></div></section><section className="wrap reservation-layout"><aside className="reservation-aside"><span className="eyebrow">A FEW LITTLE DETAILS</span><h2>We’ll take<br/>care of the <em>rest.</em></h2><p>For larger gatherings or special arrangements, give us a call and we'll be happy to talk it through.</p><a href={`tel:${restaurant.phone}`} className="inline-link"><Phone size={15}/> {restaurant.phone}</a><div className="reservation-aside-photo"><Photo src={images.reservation.local} fallback={images.reservation.fallback} alt="An inviting dining table ready for guests"/></div></aside><div className="reservation-form-column"><div className="reservation-form-heading"><SectionLabel>BOOK A TABLE</SectionLabel><h2>When shall we<br/>expect you?</h2></div><ReservationForm/></div></section></main>;
}

function ContactPage() {
  const status = useOpenStatus();
  const [form, setForm] = useState({ name: '', email: '', message: '' });
  const [sent, setSent] = useState(false);
  function submit(e) { e.preventDefault(); if (!form.name.trim() || !/^\S+@\S+\.\S+$/.test(form.email) || form.message.trim().length < 5) return; const text = `Hello ${restaurant.name},\nName: ${form.name}\nEmail: ${form.email}\nMessage: ${form.message}`; window.open(whatsappLink(text), '_blank', 'noopener,noreferrer'); setSent(true); }
  return <main className="inner-page contact-page"><section className="page-masthead"><div className="wrap"><SectionLabel number="GET IN TOUCH">COME SAY HELLO</SectionLabel><h1>There’s always<br/><em>time for one more.</em></h1><p>Questions about the menu, a table for a special day, or just finding your way here? We’re happy to help.</p></div></section><section className="wrap contact-content"><div className="contact-left"><SectionLabel>FIND THE WAY</SectionLabel><h2>Come on <em>in.</em></h2><div className="contact-detail"><MapPin/><div><small>OUR ADDRESS</small><p>{restaurant.address}</p></div></div><div className="contact-detail"><Phone/><div><small>GIVE US A CALL</small><a href={`tel:${restaurant.phone}`}>{restaurant.phone}</a></div></div><div className="contact-detail"><Mail/><div><small>WRITE TO US</small><a href={`mailto:${restaurant.email}`}>{restaurant.email}</a></div></div><div className="contact-detail"><Clock/><div><small>OPENING HOURS</small><p>Every day · 11:00 AM – 11:00 PM</p><span className={cx('live-status', status.open ? 'open' : 'closed')}>{status.open ? 'Open now' : 'Currently closed'}</span></div></div><a className="button button-dark contact-whatsapp" href={whatsappLink('Hello Desi Spices!')}><MessageCircle size={16}/> Chat on WhatsApp</a></div><div className="contact-right"><div className="map-panel"><iframe title="Map to the restaurant" src={restaurant.mapEmbedUrl} loading="lazy" referrerPolicy="no-referrer-when-downgrade"/><a href={`https://www.google.com/maps/search/?api=1&query=${encodeURIComponent(restaurant.address)}`} target="_blank" rel="noreferrer">Open directions <ArrowUpRight size={15}/></a></div><form className="contact-form" onSubmit={submit}><SectionLabel>DROP US A NOTE</SectionLabel><h2>What’s on<br/><em>your mind?</em></h2><div className="booking-fields"><label>Name<input value={form.name} onChange={e => setForm({ ...form, name: e.target.value })} placeholder="Your name" required/></label><label>Email<input type="email" value={form.email} onChange={e => setForm({ ...form, email: e.target.value })} placeholder="you@example.com" required/></label><label className="full-field">Message<textarea rows="4" value={form.message} onChange={e => setForm({ ...form, message: e.target.value })} placeholder="Write us a little note..." required minLength={5}/></label></div><button className="button button-dark" type="submit">Send via WhatsApp <Send size={15}/></button>{sent && <small className="form-success">Your message is ready in WhatsApp. Press send there to deliver it.</small>}</form></div></section></main>;
}

function ScrollToTop() { const { pathname } = useLocation(); useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }); }, [pathname]); return null; }
function AnimatedRoutes() { const location = useLocation(); return <AnimatePresence mode="wait"><motion.div key={location.pathname} initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -6 }} transition={{ duration: .24 }}><Routes location={location}><Route path="/" element={<HomePage/>}/><Route path="/menu" element={<MenuPage/>}/><Route path="/reservations" element={<ReservationsPage/>}/><Route path="/contact" element={<ContactPage/>}/><Route path="*" element={<HomePage/>}/></Routes></motion.div></AnimatePresence>; }
export default function App() {
  useEffect(() => {
    const schema = {
      '@context': 'https://schema.org', '@type': 'Restaurant',
      name: restaurant.name, description: restaurant.tagline,
      telephone: restaurant.phone, email: restaurant.email, address: restaurant.address,
      servesCuisine: ['Indian', 'North Indian', 'South Indian'],
      acceptsReservations: true, priceRange: '₹₹',
      openingHours: restaurant.openingHours.map(day => `${day.day.slice(0, 2)} ${day.open}-${day.close}`)
    };
    let script = document.getElementById('restaurant-schema');
    if (!script) { script = document.createElement('script'); script.id = 'restaurant-schema'; script.type = 'application/ld+json'; document.head.appendChild(script); }
    script.textContent = JSON.stringify(schema);
  }, []);
  return <><ScrollToTop/><Navbar/><AnimatedRoutes/><Footer/><FloatingContact/></>;
}
