'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { Compass, Flame, Home, ListVideo, Menu, PlaySquare, Search, Upload, X } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Header, { Logo, ThemeToggle } from './Header';
import Footer, { SocialLinks } from './Footer';
import { AnnouncementBar, BackToTop } from './Extras';

const isActive = (pathname, url) => (url === '/' ? pathname === '/' : pathname.startsWith(url));

function useScrolled(offset = 12) {
  const [scrolled, setScrolled] = useState(false);
  useEffect(() => {
    const on = () => setScrolled(window.scrollY > offset);
    on();
    window.addEventListener('scroll', on, { passive: true });
    return () => window.removeEventListener('scroll', on);
  }, [offset]);
  return scrolled;
}

function SearchForm({ className, autoFocus, rounded = 'rounded-full' }) {
  const router = useRouter();
  const [q, setQ] = useState('');
  return (
    <form onSubmit={(e) => { e.preventDefault(); if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`); }} className={cn('flex items-center overflow-hidden border border-fg/15 bg-bg focus-within:border-primary', rounded, className)}>
      <input autoFocus={autoFocus} value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search" className="min-w-0 flex-1 bg-transparent px-4 py-2 text-sm text-fg outline-none placeholder:text-fg/40" />
      <button aria-label="Search" className="grid h-10 w-14 place-items-center border-l border-fg/15 bg-fg/5 text-fg/70 hover:bg-fg/10"><Search className="h-4 w-4" /></button>
    </form>
  );
}

function MobileMenu({ open, onClose, items, general, extra }) {
  const pathname = usePathname();
  useEffect(() => { onClose(); }, [pathname]); // eslint-disable-line react-hooks/exhaustive-deps
  return (
    <div className={cn('fixed inset-0 z-[60]', open ? 'pointer-events-auto' : 'pointer-events-none')}>
      <div onClick={onClose} className={cn('absolute inset-0 bg-black/50 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'opacity-0')} />
      <aside className={cn('absolute left-0 top-0 flex h-full w-[86%] max-w-sm flex-col gap-1 overflow-y-auto bg-bg p-5 shadow-2xl transition-transform duration-300', open ? 'translate-x-0' : '-translate-x-full')}>
        <div className="mb-4 flex items-center justify-between"><Logo general={general} /><button onClick={onClose} className="grid h-10 w-10 place-items-center rounded-full bg-fg/5 text-fg"><X className="h-5 w-5" /></button></div>
        {extra}
        {items.map((item) => (
          <div key={item.id}>
            <Link href={item.url} className={cn('block rounded-theme px-4 py-3 font-semibold', isActive(pathname, item.url) ? 'bg-primary/10 text-primary' : 'text-fg hover:bg-fg/5')}>{item.label}</Link>
            {item.children?.map((c) => <Link key={c.id} href={c.url} className="block px-4 py-2 pl-8 text-sm text-fg/65 hover:text-primary">{c.label}</Link>)}
          </div>
        ))}
      </aside>
    </div>
  );
}

/* ----------------------------- News masthead ----------------------------- */
function Masthead({ general, appearance, social, items }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const [searching, setSearching] = useState(false);
  const scrolled = useScrolled(160);
  const cta = appearance.headerCta || {};
  return (
    <>
      <div className="border-b border-fg/10 text-xs text-fg/60">
        <div className="site-container flex h-10 items-center justify-between gap-4">
          <span className="font-semibold">{formatDate(new Date(), { weekday: 'long', day: 'numeric', month: 'long', year: 'numeric' })}</span>
          <div className="hidden items-center gap-3 sm:flex [&_a]:h-7 [&_a]:w-7"><SocialLinks social={social} /></div>
        </div>
      </div>
      <div className="site-container grid grid-cols-[1fr_auto_1fr] items-center gap-4 py-5 sm:py-7">
        <div className="flex items-center gap-1">
          <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full text-fg hover:bg-fg/5"><Menu className="h-5 w-5" /></button>
          <button onClick={() => setSearching((s) => !s)} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-fg hover:bg-fg/5"><Search className="h-5 w-5" /></button>
        </div>
        <Link href="/" className="text-center">
          {general.logo ? <img src={general.logo} alt={general.siteName} className="mx-auto h-12 w-auto sm:h-16" /> : (
            <span className="block font-heading text-3xl font-black tracking-tight text-fg sm:text-5xl lg:text-6xl">{general.siteName}</span>
          )}
          {general.tagline && <span className="mt-1 hidden text-xs font-semibold uppercase tracking-[0.25em] text-fg/50 sm:block">{general.tagline}</span>}
        </Link>
        <div className="flex items-center justify-end gap-1">
          <ThemeToggle />
          {cta.enabled && cta.label && <Link href={cta.url || '#'} className="ml-2 hidden rounded-[var(--radius)] bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110 sm:inline-block">{cta.label}</Link>}
        </div>
      </div>
      {searching && <div className="site-container pb-4"><SearchForm autoFocus rounded="rounded-[var(--radius)]" className="mx-auto max-w-xl" /></div>}
      <nav className="sticky top-0 z-40 border-y-2 border-fg bg-bg/95 backdrop-blur">
        <div className="site-container flex h-12 items-center gap-1 overflow-x-auto [scrollbar-width:none]">
          <Link href="/" className={cn('mr-3 shrink-0 font-heading text-lg font-black text-fg transition-all', scrolled ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0')}>{general.siteName}</Link>
          {items.map((item) => (
            <Link key={item.id} href={item.url} className={cn('relative shrink-0 px-3 py-3 text-sm font-bold uppercase tracking-wide transition', isActive(pathname, item.url) ? 'text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-primary' : 'text-fg/80 hover:text-primary')}>
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      <MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} extra={<SearchForm className="mb-3" />} />
    </>
  );
}

/* ----------------------------- Video platform ----------------------------- */
const VIDEO_ICONS = [[/^home$/i, Home], [/trend|popular/i, Flame], [/playlist/i, ListVideo], [/explore|browse/i, Compass]];
const videoIcon = (label) => (VIDEO_ICONS.find(([re]) => re.test(label)) || [null, PlaySquare])[1];

function VideoSidebar({ items, footerItems, className }) {
  const pathname = usePathname();
  const main = items.filter((i) => VIDEO_ICONS.some(([re]) => re.test(i.label)));
  const rest = items.filter((i) => !main.includes(i));
  const Item = ({ item }) => {
    const Icon = videoIcon(item.label);
    return (
      <Link href={item.url} className={cn('flex items-center gap-5 rounded-[calc(var(--radius)*0.8)] px-3 py-2.5 text-sm transition', isActive(pathname, item.url) ? 'bg-fg/10 font-bold text-fg' : 'text-fg/80 hover:bg-fg/5')}>
        <Icon className="h-5 w-5 shrink-0" />{item.label}
      </Link>
    );
  };
  return (
    <aside className={cn('space-y-1 overflow-y-auto p-3 [scrollbar-width:thin]', className)}>
      {main.map((i) => <Item key={i.id} item={i} />)}
      {rest.length > 0 && <div className="mx-3 my-3 border-t border-fg/10" />}
      {rest.length > 0 && <div className="px-3 pb-1 text-sm font-bold text-fg">Explore</div>}
      {rest.map((i) => <Item key={i.id} item={i} />)}
      {footerItems?.length > 0 && (
        <div className="mx-3 mt-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-fg/10 pt-4 text-xs text-fg/50">
          {footerItems.map((i) => <Link key={i.id} href={i.url} className="hover:text-fg">{i.label}</Link>)}
        </div>
      )}
    </aside>
  );
}

function VideoHeader({ general, appearance, items, footerItems }) {
  const [open, setOpen] = useState(false);
  const cta = appearance.headerCta || {};
  return (
    <>
      <header className="sticky top-0 z-40 flex h-16 items-center gap-4 bg-bg/95 px-4 backdrop-blur">
        <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 shrink-0 place-items-center rounded-full text-fg hover:bg-fg/10 xl:hidden"><Menu className="h-5 w-5" /></button>
        <Logo general={general} className="xl:w-[208px] [&>span:first-child]:h-8 [&>span:first-child]:w-8 [&>span:first-child]:rounded-lg" />
        <SearchForm className="mx-auto hidden w-full max-w-2xl md:flex" />
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          {cta.enabled && cta.label && <Link href={cta.url || '#'} className="hidden items-center gap-2 rounded-full bg-fg/5 px-4 py-2 text-sm font-semibold text-fg hover:bg-fg/10 sm:flex"><Upload className="h-4 w-4" />{cta.label}</Link>}
          <ThemeToggle />
        </div>
      </header>
      <VideoSidebar items={items} footerItems={footerItems} className="fixed bottom-0 left-0 top-16 z-30 hidden w-60 xl:block" />
      <MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} extra={<SearchForm className="mb-3" />} />
    </>
  );
}

/* ----------------------------- Streaming ----------------------------- */
function StreamingHeader({ general, items }) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <header className={cn('sticky top-0 z-40 transition-colors duration-500', scrolled ? 'bg-[#0b0b0b]' : 'bg-gradient-to-b from-black/80 to-transparent')}>
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="font-heading text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl">{general.logo ? <img src={general.logo} alt={general.siteName} className="h-8" /> : general.siteName}</Link>
        <nav className="hidden items-center gap-5 md:flex">
          {items.map((item) => <Link key={item.id} href={item.url} className={cn('text-sm transition', isActive(pathname, item.url) ? 'font-bold text-white' : 'text-white/70 hover:text-white')}>{item.label}</Link>)}
        </nav>
        <button onClick={() => setOpen(true)} className="text-sm font-semibold text-white md:hidden">Browse ▾</button>
        <div className="ml-auto flex items-center gap-3">
          {searching ? <SearchForm autoFocus className="w-56 border-white/30 bg-black/60 [&_input]:text-white" rounded="rounded" /> : (
            <button onClick={() => setSearching(true)} aria-label="Search" className="text-white/90 hover:text-white"><Search className="h-5 w-5" /></button>
          )}
          <span className="grid h-8 w-8 place-items-center rounded bg-gradient-to-br from-primary to-accent text-xs font-black text-white">{general.siteName?.[0]}</span>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} />
    </header>
  );
}

/* ----------------------------- Portfolio ----------------------------- */
function PortfolioHeader({ general, appearance, items }) {
  const scrolled = useScrolled(24);
  const [open, setOpen] = useState(false);
  const cta = appearance.headerCta || {};
  const mark = (general.siteName || 'P').replace(/^(md\.?|mr\.?)\s+/i, '').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-4 pt-4">
      <div className={cn('pointer-events-auto mx-auto flex max-w-5xl items-center gap-3 rounded-full border px-3 py-2 transition-all duration-500', scrolled ? 'border-fg/10 bg-bg/70 shadow-2xl shadow-black/10 backdrop-blur-xl' : 'border-transparent bg-transparent')}>
        <Link href="/" className="flex items-center gap-2.5 pl-1">
          <span className="grid h-9 w-9 place-items-center rounded-full bg-gradient-to-br from-primary to-accent font-heading text-sm font-bold text-white shadow-glow">{mark}</span>
          <span className="hidden font-heading font-bold text-fg sm:block">{general.siteName}</span>
        </Link>
        <nav className="mx-auto hidden items-center gap-1 md:flex">
          {items.map((item) => (
            <Link key={item.id} href={item.url} className="rounded-full px-3.5 py-2 text-sm font-medium text-fg/70 transition hover:bg-fg/5 hover:text-fg">{item.label}</Link>
          ))}
        </nav>
        <div className="ml-auto flex items-center gap-1 md:ml-0">
          <ThemeToggle />
          {cta.enabled && cta.label && <Link href={cta.url || '#'} className="hidden rounded-full bg-gradient-to-r from-primary to-accent px-5 py-2.5 text-sm font-bold text-white shadow-glow transition hover:brightness-110 sm:inline-block">{cta.label}</Link>}
          <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full text-fg hover:bg-fg/5 md:hidden"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="pointer-events-auto"><MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} /></div>
    </header>
  );
}

/*
 * Site chrome: picks the header / sidebar / footer for the active theme. In the admin
 * "Theme preview" iframe, the parent can post a different theme to preview it live.
 */
export default function SiteChrome({ settings, menus, theme, children }) {
  const [override, setOverride] = useState(null);
  useEffect(() => {
    if (window.parent === window) return undefined;
    const onMessage = (e) => { if (e.origin === window.location.origin && e.data?.type === 'nova:theme') setOverride(e.data); };
    window.addEventListener('message', onMessage);
    return () => window.removeEventListener('message', onMessage);
  }, []);

  const t = override?.theme || theme;
  const m = override?.menus || menus;
  const s = override ? { ...settings, general: { ...settings.general, ...override.general }, appearance: { ...settings.appearance, ...override.appearance } } : settings;
  const { general, appearance: a, social } = s;
  const items = m.header?.items || [];
  const header = t?.layout?.header || 'default';

  return (
    <>
      {header === 'masthead' && <Masthead general={general} appearance={a} social={social} items={items} />}
      {header === 'video' && <VideoHeader general={general} appearance={a} items={items} footerItems={m.footer?.items} />}
      {header === 'streaming' && <StreamingHeader general={general} items={items} />}
      {header === 'portfolio' && <PortfolioHeader general={general} appearance={a} items={items} />}
      {header === 'default' && (
        <>
          <AnnouncementBar announcement={a.announcement} />
          <Header general={general} appearance={a} menu={m.header} />
        </>
      )}
      <div className={cn('flex flex-1 flex-col', header === 'video' && 'xl:pl-60')}>
        <main className={cn('flex-1', header === 'portfolio' && 'pt-24')}>{children}</main>
        {header !== 'video' && <Footer settings={s} menus={m} />}
        {header === 'video' && <div className="px-6 py-8 text-center text-xs text-fg/40 xl:hidden">© {new Date().getFullYear()} {general.siteName}</div>}
      </div>
      {a.backToTop && header !== 'streaming' && <BackToTop />}
    </>
  );
}
