'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, Bookmark, Clock, Compass, Flame, Home, ListVideo, Mail, Menu, Phone, PlaySquare, Search, Upload, X } from 'lucide-react';
import { cn, formatDate } from '@/lib/utils';
import Header, { Logo, ThemeToggle } from './Header';
import { SavedLink } from './Engagement';
import { Caret, DesktopNav, MobileNavTree } from './NavMenu';
import { engagementOf, saveLabels } from '@/lib/engagement';
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
        <MobileNavTree items={items} onNavigate={onClose} className="-mx-2" />
      </aside>
    </div>
  );
}

/* ----------------------------- News masthead ----------------------------- */
function Masthead({ general, appearance, social, items, saved }) {
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
          {saved && <SavedLink label={saved} />}
          <ThemeToggle />
          {cta.enabled && cta.label && <Link href={cta.url || '#'} className="ml-2 hidden rounded-[var(--radius)] bg-primary px-4 py-2 text-sm font-bold text-white hover:brightness-110 sm:inline-block">{cta.label}</Link>}
        </div>
      </div>
      {searching && <div className="site-container pb-4"><SearchForm autoFocus rounded="rounded-[var(--radius)]" className="mx-auto max-w-xl" /></div>}
      <nav className="sticky top-0 z-40 border-y-2 border-fg bg-bg/95 backdrop-blur">
        <div className="site-container flex h-12 items-center gap-1 overflow-x-auto [scrollbar-width:none] lg:overflow-visible">
          <Link href="/" className={cn('mr-3 shrink-0 font-heading text-lg font-black text-fg transition-all', scrolled ? 'w-auto opacity-100' : 'w-0 overflow-hidden opacity-0')}>{general.siteName}</Link>
          {/* Phones and tablets: a plain scrolling strip. Desktop: dropdowns and mega menus. */}
          <div className="flex items-center gap-1 lg:hidden">
            {items.map((item) => (
              <Link key={item.id} href={item.url} className={cn('relative shrink-0 px-3 py-3 text-sm font-bold uppercase tracking-wide transition', isActive(pathname, item.url) ? 'text-primary after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-primary' : 'text-fg/80 hover:text-primary')}>
                {item.label}
              </Link>
            ))}
          </div>
          <DesktopNav
            items={items}
            className="hidden items-center gap-1 lg:flex"
            renderTop={(item, { active, open, hasChildren }) => (
              <span className={cn('relative flex shrink-0 cursor-pointer items-center gap-1 px-3 py-3 text-sm font-bold uppercase tracking-wide transition', active || open ? 'text-primary' : 'text-fg/80 hover:text-primary', active && 'after:absolute after:inset-x-3 after:bottom-0 after:h-[3px] after:bg-primary')}>
                {item.label}{hasChildren && <Caret open={open} />}
              </span>
            )}
          />
        </div>
      </nav>
      <MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} extra={<SearchForm className="mb-3" />} />
    </>
  );
}

/* ----------------------------- Video platform ----------------------------- */
const VIDEO_ICONS = [[/^home$/i, Home], [/trend|popular/i, Flame], [/playlist/i, ListVideo], [/explore|browse/i, Compass]];
const videoIcon = (label) => (VIDEO_ICONS.find(([re]) => re.test(label)) || [null, PlaySquare])[1];

function VideoSidebar({ items, footerItems, className, saved }) {
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
      {saved && (
        <Link href="/saved" className={cn('flex items-center gap-5 rounded-[calc(var(--radius)*0.8)] px-3 py-2.5 text-sm transition', pathname === '/saved' ? 'bg-fg/10 font-bold text-fg' : 'text-fg/80 hover:bg-fg/5')}>
          <Bookmark className="h-5 w-5 shrink-0" />{saved}
        </Link>
      )}
      {rest.length > 0 && <div className="mx-3 my-3 border-t border-fg/10" />}
      {rest.length > 0 && <div className="px-3 pb-1 text-sm font-bold text-fg">Explore</div>}
      {rest.map((i) => (
        <div key={i.id}>
          <Item item={i} />
          {i.children?.length > 0 && <MobileNavTree items={i.children} className="ml-9 border-l border-fg/10 text-sm [&_a]:py-1.5" />}
        </div>
      ))}
      {footerItems?.length > 0 && (
        <div className="mx-3 mt-4 flex flex-wrap gap-x-3 gap-y-1 border-t border-fg/10 pt-4 text-xs text-fg/50">
          {footerItems.map((i) => <Link key={i.id} href={i.url} className="hover:text-fg">{i.label}</Link>)}
        </div>
      )}
    </aside>
  );
}

function VideoHeader({ general, appearance, items, footerItems, saved }) {
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
          {saved && <SavedLink label={saved} className="xl:hidden" />}
          <ThemeToggle />
        </div>
      </header>
      <VideoSidebar items={items} footerItems={footerItems} saved={saved} className="fixed bottom-0 left-0 top-16 z-30 hidden w-60 xl:block" />
      <MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} extra={<SearchForm className="mb-3" />} />
    </>
  );
}

/* ----------------------------- Streaming ----------------------------- */
function StreamingHeader({ general, items, saved }) {
  const pathname = usePathname();
  const scrolled = useScrolled();
  const [searching, setSearching] = useState(false);
  const [open, setOpen] = useState(false);
  return (
    <header className={cn('sticky top-0 z-40 transition-colors duration-500', scrolled ? 'bg-[#0b0b0b]' : 'bg-gradient-to-b from-black/80 to-transparent')}>
      <div className="mx-auto flex h-16 max-w-[1600px] items-center gap-8 px-5 sm:px-8">
        <Link href="/" className="font-heading text-2xl font-black uppercase tracking-tight text-primary sm:text-3xl">{general.logo ? <img src={general.logo} alt={general.siteName} className="h-8" /> : general.siteName}</Link>
        <DesktopNav
          items={items}
          className="hidden items-center gap-5 md:flex"
          renderTop={(item, { active, open, hasChildren }) => (
            <span className={cn('flex cursor-pointer items-center gap-1 py-5 text-sm transition', active ? 'font-bold text-white' : open ? 'text-white' : 'text-white/70 hover:text-white')}>{item.label}{hasChildren && <Caret open={open} />}</span>
          )}
        />
        <button onClick={() => setOpen(true)} className="text-sm font-semibold text-white md:hidden">Browse ▾</button>
        <div className="ml-auto flex items-center gap-3">
          {searching ? <SearchForm autoFocus className="w-56 border-white/30 bg-black/60 [&_input]:text-white" rounded="rounded" /> : (
            <button onClick={() => setSearching(true)} aria-label="Search" className="text-white/90 hover:text-white"><Search className="h-5 w-5" /></button>
          )}
          {saved && <SavedLink label={saved} className="text-white/90 hover:bg-white/10 hover:text-white" />}
          <span className="grid h-8 w-8 place-items-center rounded bg-gradient-to-br from-primary to-accent text-xs font-black text-white">{general.siteName?.[0]}</span>
        </div>
      </div>
      <MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} />
    </header>
  );
}

/* ------------------- Overlay (restaurant) & minimal (studio) ------------------- */
// Transparent with white text over the homepage hero; solid once scrolled or on inner pages.
function useOverlay() {
  const pathname = usePathname();
  const scrolled = useScrolled(40);
  return pathname === '/' && !scrolled;
}

function OverlayHeader({ general, appearance, items }) {
  const overlay = useOverlay();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cta = appearance.headerCta || {};
  const half = Math.ceil(items.length / 2);
  const nav = (list, className) => (
    <DesktopNav
      items={list}
      className={className}
      renderTop={(item, { active, open: on, hasChildren }) => (
        <span className={cn('relative flex cursor-pointer items-center gap-1 px-3 py-2 text-[13px] font-semibold uppercase tracking-[0.18em] transition after:absolute after:inset-x-3 after:bottom-0.5 after:h-px after:origin-left after:scale-x-0 after:bg-current after:transition-transform hover:after:scale-x-100', (active || on) && 'after:scale-x-100')}>{item.label}{hasChildren && <Caret open={on} />}</span>
      )}
    />
  );
  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-500', overlay ? 'bg-gradient-to-b from-black/50 to-transparent text-white' : 'bg-bg/95 text-fg shadow-[0_1px_0_rgb(var(--c-fg)/0.08)] backdrop-blur-xl')}>
        <div className={cn('mx-auto grid max-w-container grid-cols-[1fr_auto_1fr] items-center px-5 transition-all duration-500 sm:px-8', overlay ? 'h-24' : 'h-[72px]')}>
          {nav(items.slice(0, half), 'hidden items-center lg:flex')}
          <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center lg:hidden"><Menu className="h-5 w-5" /></button>
          <Link href="/" className="text-center">
            {general.logo ? <img src={general.logo} alt={general.siteName} className="mx-auto h-10" /> : <span className="block font-heading text-2xl font-semibold italic tracking-tight sm:text-3xl">{general.siteName}</span>}
            {general.tagline && <span className={cn('hidden text-[10px] font-semibold uppercase tracking-[0.35em] opacity-70 transition-all sm:block', !overlay && 'h-0 overflow-hidden opacity-0')}>{general.tagline}</span>}
          </Link>
          <div className="flex items-center justify-end">
            {nav(items.slice(half), 'hidden items-center lg:flex')}
            {cta.enabled && cta.label && <Link href={cta.url || '#'} className={cn('ml-4 rounded-full px-5 py-2.5 text-xs font-bold uppercase tracking-[0.15em] transition', overlay ? 'border border-white/60 hover:bg-white hover:text-black' : 'bg-primary text-white hover:brightness-110')}>{cta.label}</Link>}
          </div>
        </div>
      </header>
      {/* Outside <header>: its backdrop blur would trap this fixed drawer inside the bar. */}
      <MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} />
    </>
  );
}

function MinimalHeader({ general, items, social }) {
  const overlay = useOverlay();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-500', overlay && !open ? 'text-white' : 'bg-bg/90 text-fg backdrop-blur-xl', open && '!bg-transparent')}>
        <div className="flex h-20 items-center justify-between px-6 sm:px-10">
          <Link href="/" className="text-sm font-semibold uppercase tracking-[0.4em]">{general.siteName}</Link>
          <DesktopNav
            items={items}
            className="hidden items-center gap-9 md:flex"
            renderTop={(item, { active, open: on, hasChildren }) => (
              <span className={cn('flex cursor-pointer items-center gap-1 py-3 text-xs font-medium uppercase tracking-[0.25em] transition hover:opacity-100', active || on ? 'opacity-100' : 'opacity-60')}>{item.label}{hasChildren && <Caret open={on} />}</span>
            )}
          />
          <button onClick={() => setOpen(!open)} aria-label="Menu" className="relative z-[70] flex h-10 w-10 flex-col items-center justify-center gap-1.5 md:hidden">
            <span className={cn('h-px w-6 bg-current transition', open && 'translate-y-[3.5px] rotate-45')} />
            <span className={cn('h-px w-6 bg-current transition', open && '-translate-y-[3.5px] -rotate-45')} />
          </button>
        </div>
      </header>
      {/* Full-screen menu (mobile) */}
      <div className={cn('fixed inset-0 z-[60] flex flex-col justify-center bg-bg px-8 transition-all duration-500 md:hidden', open ? 'visible opacity-100' : 'invisible opacity-0')}>
        <div className={cn('-mx-4 max-h-[70vh] overflow-y-auto transition-all duration-500', open ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0')}>
          <MobileNavTree items={items} size="lg" onNavigate={() => setOpen(false)} />
        </div>
        <div className="mt-12"><SocialLinks social={social} /></div>
      </div>
    </>
  );
}

/* ----------------------------- Luxe ----------------------------- */
function LuxeHeader({ general, appearance, items, social, contact, heroOverlay }) {
  const pathname = usePathname();
  const scrolled = useScrolled(40);
  const overlay = heroOverlay && pathname === '/' && !scrolled;
  const [open, setOpen] = useState(false);
  const cta = appearance.headerCta || {};
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  const small = 'text-[11px] font-medium uppercase tracking-[0.3em]';

  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-50 transition-all duration-700', overlay ? 'text-white' : 'border-b border-fg/10 bg-bg/95 text-fg backdrop-blur-xl')}>
        <div className="mx-auto grid h-20 max-w-[1440px] grid-cols-[1fr_auto_1fr] items-center px-5 sm:px-10">
          <button onClick={() => setOpen(true)} className={cn('flex items-center gap-3 justify-self-start', small)} aria-label="Open menu">
            <span className="flex w-7 flex-col gap-1.5"><span className="h-px w-7 bg-current" /><span className="h-px w-4 bg-current" /></span>
            <span className="hidden sm:inline">Menu</span>
          </button>
          <Link href="/" className="text-center">
            {general.logo ? <img src={general.logo} alt={general.siteName} className="mx-auto h-9" /> : (
              <span className="block font-heading text-xl uppercase tracking-[0.32em] sm:text-2xl">{general.siteName}</span>
            )}
          </Link>
          <div className="justify-self-end">
            {cta.enabled && cta.label && (
              <Link href={cta.url || '#'} className={cn('group relative hidden pb-1 sm:inline-block', small)}>
                {cta.label}<span className="absolute inset-x-0 bottom-0 h-px origin-right bg-current transition-transform duration-500 group-hover:scale-x-0" />
              </Link>
            )}
          </div>
        </div>
        <nav className={cn('hidden justify-center gap-10 border-t transition-all duration-700 lg:flex', scrolled ? 'h-0 overflow-hidden border-transparent opacity-0' : 'h-11 items-center opacity-100', overlay ? 'border-white/15' : 'border-fg/10')}>
          <DesktopNav
            items={items}
            className="flex items-center gap-10"
            renderTop={(item, { active, open: on, hasChildren }) => (
              <span className={cn('relative flex cursor-pointer items-center gap-1.5 py-3 text-[10.5px] font-medium uppercase tracking-[0.3em] transition', active || on ? 'opacity-100' : 'opacity-70 hover:opacity-100')}>
                {item.label}{hasChildren && <Caret open={on} className="h-3 w-3" />}
                {active && <span className="absolute bottom-1.5 left-1/2 h-1 w-1 -translate-x-1/2 rounded-full bg-primary" />}
              </span>
            )}
          />
        </nav>
      </header>

      {/* Full-screen menu */}
      <div className={cn('fixed inset-0 z-[70] grid bg-[#0c0b09] text-[#efe9df] transition-all duration-700 lg:grid-cols-[1.3fr_1fr]', open ? 'visible opacity-100' : 'invisible opacity-0')}>
        <button onClick={() => setOpen(false)} className={cn('absolute right-6 top-7 z-10 flex items-center gap-3 sm:right-10', small)}>Close <X className="h-4 w-4" /></button>
        <div className="flex flex-col justify-center px-8 py-24 sm:px-20">
          <div className={cn('mb-10 text-[#c9a66b]', small)}>{general.siteName}</div>
          <nav className="max-h-[70vh] space-y-2 overflow-y-auto">
            {items.map((item, i) => (
              <Link
                key={item.id}
                href={item.url}
                className={cn('group flex items-baseline gap-6 transition-all duration-700', open ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0')}
                style={{ transitionDelay: open ? `${150 + i * 70}ms` : '0ms' }}
              >
                <span className="font-mono text-xs text-[#efe9df]/40">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-heading text-4xl leading-tight transition duration-500 group-hover:translate-x-3 group-hover:italic group-hover:text-[#c9a66b] sm:text-6xl">{item.label}</span>
              </Link>
            )).flatMap((link, i) => {
              const item = items[i];
              if (!item.children?.length) return [link];
              // Sub-pages in small caps under the big label, level 3 nested beneath them.
              return [link, (
                <div key={`${item.id}-sub`} className={cn('ml-12 flex flex-wrap gap-x-6 gap-y-2 pb-3 transition-all duration-700', open ? 'opacity-100' : 'opacity-0')} style={{ transitionDelay: open ? `${200 + i * 70}ms` : '0ms' }}>
                  {item.children.map((c) => (
                    <div key={c.id}>
                      <Link href={c.url} className={cn('text-[#efe9df]/60 transition hover:text-[#c9a66b]', small)}>{c.label}</Link>
                      {c.children?.length > 0 && (
                        <div className="mt-1 flex flex-col gap-1 border-l border-white/15 pl-3">
                          {c.children.map((g) => <Link key={g.id} href={g.url} className="text-sm text-[#efe9df]/45 transition hover:text-[#c9a66b]">{g.label}</Link>)}
                        </div>
                      )}
                    </div>
                  ))}
                </div>
              )];
            })}
          </nav>
        </div>
        <aside className="hidden flex-col justify-between border-l border-white/10 p-16 lg:flex">
          <div className="font-heading text-[11rem] leading-none text-transparent [-webkit-text-stroke:1px_rgba(201,166,107,.45)]">{general.siteName?.[0]}</div>
          <div className="space-y-6">
            {general.tagline && <p className="font-heading text-2xl italic text-[#efe9df]/80">{general.tagline}</p>}
            <div className={cn('space-y-2 text-[#efe9df]/60', small)}>
              {contact?.email && <a href={`mailto:${contact.email}`} className="block hover:text-[#c9a66b]">{contact.email}</a>}
              {contact?.phone && <span className="block">{contact.phone}</span>}
              {contact?.address && <span className="block normal-case tracking-normal">{contact.address}</span>}
            </div>
            <div className="[&_a]:border-white/20 [&_a]:text-white/70"><SocialLinks social={social} /></div>
          </div>
        </aside>
      </div>
    </>
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

/* ----------------------------- Corporate ----------------------------- */
// Utility bar (phone, email, hours, socials) above a solid header with an underlined nav.
function CorporateHeader({ general, appearance, items, contact = {}, social, saved }) {
  const scrolled = useScrolled(40);
  const [open, setOpen] = useState(false);
  const cta = appearance.headerCta || {};
  const tel = contact.phone ? `tel:${contact.phone.replace(/[^\d+]/g, '')}` : null;
  return (
    <>
      <div className="hidden bg-primary text-white md:block">
        <div className="site-container flex h-10 items-center justify-between gap-6 text-[13px]">
          <div className="flex items-center gap-6 text-white/85">
            {tel && <a href={tel} className="flex items-center gap-2 transition hover:text-white"><Phone className="h-3.5 w-3.5" />{contact.phone}</a>}
            {contact.email && <a href={`mailto:${contact.email}`} className="flex items-center gap-2 transition hover:text-white"><Mail className="h-3.5 w-3.5" />{contact.email}</a>}
            {contact.workingHours && <span className="hidden items-center gap-2 lg:flex"><Clock className="h-3.5 w-3.5" />{contact.workingHours}</span>}
          </div>
          <div className="flex items-center gap-2 [&_a]:h-7 [&_a]:w-7 [&_a]:border-white/25 [&_a]:text-white/85 [&_svg]:h-3.5 [&_svg]:w-3.5"><SocialLinks social={social} /></div>
        </div>
      </div>
      <header className={cn('sticky top-0 z-40 border-b bg-bg/95 backdrop-blur-xl transition-shadow duration-300', scrolled ? 'border-fg/10 shadow-[0_12px_32px_-18px_rgb(0_0_0/0.25)]' : 'border-fg/[.06]')}>
        <div className="site-container flex h-20 items-center gap-6">
          <Logo general={general} />
          <DesktopNav
            items={items}
            className="mx-auto hidden items-center lg:flex"
            renderTop={(item, { active, open: on, hasChildren }) => (
              <span className={cn('relative flex cursor-pointer items-center gap-1 px-3.5 py-7 text-[15px] font-semibold transition', active || on ? 'text-primary' : 'text-fg/75 hover:text-primary')}>
                {item.label}{hasChildren && <Caret open={on} />}
                <span className={cn('absolute inset-x-3.5 bottom-0 h-[3px] origin-left rounded-t-full bg-primary transition-transform duration-300', active ? 'scale-x-100' : 'scale-x-0')} />
              </span>
            )}
          />
          <div className="ml-auto flex items-center gap-1 lg:ml-0">
            {saved && <SavedLink label={saved} />}
            <ThemeToggle />
            {cta.enabled && cta.label && <Link href={cta.url || '#'} className="btn-site-primary ml-2 hidden !py-2.5 sm:inline-flex">{cta.label}<ArrowRight className="h-4 w-4" /></Link>}
            <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full text-fg hover:bg-fg/5 lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
      </header>
      <MobileMenu
        open={open}
        onClose={() => setOpen(false)}
        items={items}
        general={general}
        extra={tel && <a href={tel} className="mb-3 flex items-center gap-3 rounded-theme bg-primary/10 px-4 py-3 text-sm font-bold text-primary"><Phone className="h-4 w-4" />{contact.phone}</a>}
      />
    </>
  );
}

/* ----------------------------- Floating ----------------------------- */
// Detached pill bar: see-through over the homepage hero, frosted once scrolled or on inner pages.
function FloatingHeader({ general, appearance, items, saved }) {
  const overlay = useOverlay();
  const [open, setOpen] = useState(false);
  const cta = appearance.headerCta || {};
  return (
    <header className="pointer-events-none fixed inset-x-0 top-0 z-50 px-3 pt-3 sm:px-5 sm:pt-4">
      <div className={cn('pointer-events-auto mx-auto flex h-16 max-w-[1240px] items-center gap-4 rounded-full border pl-4 pr-2 transition-all duration-500 sm:pl-6', overlay ? 'border-white/20 bg-white/10 text-white backdrop-blur-md' : 'border-fg/10 bg-bg/85 text-fg shadow-xl shadow-black/[.06] backdrop-blur-xl')}>
        <Link href="/" className="flex shrink-0 items-center gap-2.5">
          {general.logo ? <img src={general.logo} alt={general.siteName} className="h-8 w-auto" /> : (
            <>
              <span className="grid h-9 w-9 place-items-center rounded-full bg-primary font-heading text-base font-black text-white">{general.siteName?.[0]}</span>
              <span className="font-heading text-lg font-extrabold tracking-tight">{general.siteName}</span>
            </>
          )}
        </Link>
        <DesktopNav
          items={items}
          className="mx-auto hidden items-center gap-0.5 lg:flex"
          megaClassName="pt-4"
          renderTop={(item, { active, open: on, hasChildren }) => (
            <span className={cn('flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition', active || on ? (overlay ? 'bg-white/20' : 'bg-primary/10 text-primary') : 'opacity-80 hover:opacity-100')}>{item.label}{hasChildren && <Caret open={on} />}</span>
          )}
        />
        <div className="ml-auto flex items-center gap-1 lg:ml-0">
          {saved && <SavedLink label={saved} className={overlay ? '!text-white hover:!bg-white/10' : ''} />}
          <ThemeToggle className={overlay ? '!text-white hover:!bg-white/10' : ''} />
          {cta.enabled && cta.label && <Link href={cta.url || '#'} className="ml-1 hidden items-center gap-2 rounded-full bg-primary px-5 py-3 text-sm font-bold text-white shadow-glow transition hover:brightness-110 sm:inline-flex">{cta.label}<ArrowRight className="h-4 w-4" /></Link>}
          <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-11 w-11 place-items-center rounded-full lg:hidden"><Menu className="h-5 w-5" /></button>
        </div>
      </div>
      <div className="pointer-events-auto"><MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} /></div>
    </header>
  );
}

/* ----------------------------- Bold ----------------------------- */
// Athletic header: italic wordmark, slanted CTA and a full-screen numbered menu.
function BoldHeader({ general, appearance, items, social, contact = {} }) {
  const overlay = useOverlay();
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cta = appearance.headerCta || {};
  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => { document.body.style.overflow = open ? 'hidden' : ''; return () => { document.body.style.overflow = ''; }; }, [open]);
  return (
    <>
      <header className={cn('fixed inset-x-0 top-0 z-[65] transition-all duration-500', open ? 'text-white' : overlay ? 'bg-gradient-to-b from-black/60 to-transparent text-white' : 'bg-bg/95 text-fg shadow-[0_1px_0_rgb(var(--c-fg)/0.08)] backdrop-blur-xl')}>
        <div className="mx-auto flex h-20 max-w-[1440px] items-center gap-8 px-5 sm:px-8">
          <Link href="/" className="shrink-0 font-heading text-2xl font-black uppercase italic tracking-tight sm:text-[1.7rem]">
            {general.logo ? <img src={general.logo} alt={general.siteName} className="h-9 w-auto" /> : <>{general.siteName}<span className="text-primary">.</span></>}
          </Link>
          <DesktopNav
            items={items}
            className="hidden items-center gap-1 lg:flex"
            renderTop={(item, { active, open: on, hasChildren }) => (
              <span className={cn('relative flex cursor-pointer items-center gap-1 px-3 py-2 text-[13px] font-extrabold uppercase tracking-[0.14em] transition', active || on ? 'opacity-100' : 'opacity-75 hover:opacity-100')}>
                {item.label}{hasChildren && <Caret open={on} />}
                <span className={cn('absolute inset-x-3 -bottom-0.5 h-[3px] origin-left -skew-x-12 bg-primary transition-transform duration-300', active ? 'scale-x-100' : 'scale-x-0')} />
              </span>
            )}
          />
          <div className="ml-auto flex items-center gap-4">
            {cta.enabled && cta.label && (
              <Link href={cta.url || '#'} className="hidden -skew-x-12 bg-primary px-6 py-3 text-white transition hover:brightness-110 sm:inline-block">
                <span className="inline-flex skew-x-12 items-center gap-2 text-sm font-black uppercase tracking-wider">{cta.label}<ArrowRight className="h-4 w-4" /></span>
              </Link>
            )}
            <button onClick={() => setOpen(!open)} aria-label="Menu" className="flex h-11 w-11 flex-col items-end justify-center gap-[7px] lg:hidden">
              <span className={cn('h-[3px] w-7 bg-current transition duration-300', open && 'translate-y-[5px] -rotate-45')} />
              <span className={cn('h-[3px] w-5 bg-primary transition duration-300', open && 'w-7 -translate-y-[5px] rotate-45 bg-current')} />
            </button>
          </div>
        </div>
      </header>
      <div className={cn('fixed inset-0 z-[60] flex flex-col justify-between overflow-y-auto bg-[#0a0a0a] px-6 pb-10 pt-28 text-white transition-all duration-500 lg:hidden', open ? 'visible opacity-100' : 'invisible opacity-0')}>
        <nav className="space-y-1">
          {items.map((item, i) => (
            <div key={item.id} className={cn('transition-all duration-500', open ? 'translate-x-0 opacity-100' : '-translate-x-6 opacity-0')} style={{ transitionDelay: open ? `${100 + i * 60}ms` : '0ms' }}>
              <Link href={item.url} className="group flex items-baseline gap-4">
                <span className="font-mono text-xs text-primary">{String(i + 1).padStart(2, '0')}</span>
                <span className="font-heading text-5xl font-black uppercase italic leading-tight tracking-tight transition group-hover:translate-x-2 group-hover:text-primary">{item.label}</span>
              </Link>
              {item.children?.length > 0 && (
                <div className="mb-2 ml-9 flex flex-wrap gap-x-5 gap-y-1">{item.children.map((c) => <Link key={c.id} href={c.url} className="text-sm font-semibold uppercase tracking-wider text-white/55 hover:text-primary">{c.label}</Link>)}</div>
              )}
            </div>
          ))}
        </nav>
        <div className="mt-10 space-y-4 border-t border-white/10 pt-6 text-sm text-white/60">
          {contact.phone && <div className="flex items-center gap-2"><Phone className="h-4 w-4 text-primary" />{contact.phone}</div>}
          <div className="[&_a]:border-white/20 [&_a]:text-white/70"><SocialLinks social={social} /></div>
        </div>
      </div>
    </>
  );
}

/* ----------------------------- Sidebar ----------------------------- */
// Fixed left column with large numbered links (desktop); compact top bar on smaller screens.
function SidebarHeader({ general, appearance, items, social, contact = {} }) {
  const pathname = usePathname();
  const [open, setOpen] = useState(false);
  const cta = appearance.headerCta || {};
  return (
    <>
      <aside className="fixed inset-y-0 left-0 z-40 hidden w-72 flex-col border-r border-fg/10 bg-bg px-7 py-8 lg:flex">
        <Link href="/" className="font-heading text-[1.7rem] font-extrabold leading-none tracking-tight text-fg">
          {general.logo ? <img src={general.logo} alt={general.siteName} className="h-9 w-auto" /> : <>{general.siteName}<span className="text-primary">*</span></>}
        </Link>
        {general.tagline && <p className="mt-3 text-sm leading-relaxed text-fg/50">{general.tagline}</p>}
        <nav className="-mx-2 mt-12 flex-1 space-y-0.5 overflow-y-auto [scrollbar-width:none]">
          {items.map((item, i) => {
            const active = isActive(pathname, item.url);
            return (
              <div key={item.id}>
                <Link href={item.url} className={cn('group flex items-baseline gap-3 rounded-theme px-2 py-2 transition', active ? 'text-fg' : 'text-fg/45 hover:text-fg')}>
                  <span className={cn('font-mono text-[11px] transition', active ? 'text-primary' : 'text-fg/30 group-hover:text-primary')}>{String(i + 1).padStart(2, '0')}</span>
                  <span className="font-heading text-2xl font-bold tracking-tight transition duration-300 group-hover:translate-x-1">{item.label}</span>
                  {active && <span className="ml-auto h-2 w-2 self-center rounded-full bg-primary" />}
                </Link>
                {item.children?.length > 0 && (
                  <div className="mb-2 ml-[42px] flex flex-col gap-1 border-l border-fg/10 pl-3">
                    {item.children.map((c) => <Link key={c.id} href={c.url} className={cn('text-sm transition', isActive(pathname, c.url) && c.url !== '/' ? 'font-semibold text-primary' : 'text-fg/50 hover:text-fg')}>{c.label}</Link>)}
                  </div>
                )}
              </div>
            );
          })}
        </nav>
        <div className="space-y-5 pt-6">
          {cta.enabled && cta.label && <Link href={cta.url || '#'} className="btn-site-primary w-full">{cta.label}<ArrowRight className="h-4 w-4" /></Link>}
          {contact.email && <a href={`mailto:${contact.email}`} className="block text-sm font-semibold text-fg/70 underline-offset-4 hover:text-primary hover:underline">{contact.email}</a>}
          <div className="flex items-center justify-between gap-2"><div className="[&_a]:h-8 [&_a]:w-8 [&_svg]:h-3.5 [&_svg]:w-3.5"><SocialLinks social={social} /></div><ThemeToggle /></div>
          <p className="text-xs text-fg/40">© {new Date().getFullYear()} {general.siteName}</p>
        </div>
      </aside>
      <header className="sticky top-0 z-40 flex h-16 items-center justify-between border-b border-fg/10 bg-bg/90 px-5 backdrop-blur-xl lg:hidden">
        <Link href="/" className="font-heading text-xl font-extrabold tracking-tight text-fg">{general.siteName}<span className="text-primary">*</span></Link>
        <div className="flex items-center gap-1">
          <ThemeToggle />
          <button onClick={() => setOpen(true)} aria-label="Menu" className="grid h-10 w-10 place-items-center rounded-full text-fg hover:bg-fg/5"><Menu className="h-5 w-5" /></button>
        </div>
      </header>
      <MobileMenu open={open} onClose={() => setOpen(false)} items={items} general={general} />
    </>
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

  const pathname = usePathname();
  const t = override?.theme || theme;
  // Design language switch used by the CSS layer (e.g. body[data-style='luxe']).
  useEffect(() => { document.body.dataset.style = t?.layout?.style || 'modern'; }, [t]);
  const m = override?.menus || menus;
  const s = override ? { ...settings, general: { ...settings.general, ...override.general }, appearance: { ...settings.appearance, ...override.appearance } } : settings;
  const { general, appearance: a, social } = s;
  const items = m.header?.items || [];
  const header = t?.layout?.header || 'default';
  const saved = engagementOf(s).saves ? saveLabels(t).page : null;

  return (
    <>
      {header === 'masthead' && <Masthead general={general} appearance={a} social={social} items={items} saved={saved} />}
      {header === 'video' && <VideoHeader general={general} appearance={a} items={items} footerItems={m.footer?.items} saved={saved} />}
      {header === 'streaming' && <StreamingHeader general={general} items={items} saved={saved} />}
      {header === 'portfolio' && <PortfolioHeader general={general} appearance={a} items={items} />}
      {header === 'overlay' && <OverlayHeader general={general} appearance={a} items={items} />}
      {header === 'luxe' && <LuxeHeader general={general} appearance={a} items={items} social={social} contact={s.contact} heroOverlay={t?.layout?.overlay !== false} />}
      {header === 'minimal' && <MinimalHeader general={general} items={items} social={social} />}
      {header === 'corporate' && <CorporateHeader general={general} appearance={a} items={items} contact={s.contact} social={social} saved={saved} />}
      {header === 'floating' && <FloatingHeader general={general} appearance={a} items={items} saved={saved} />}
      {header === 'bold' && <BoldHeader general={general} appearance={a} items={items} social={social} contact={s.contact} />}
      {header === 'sidebar' && <SidebarHeader general={general} appearance={a} items={items} social={social} contact={s.contact} />}
      {header === 'default' && (
        <>
          <AnnouncementBar announcement={a.announcement} />
          <Header general={general} appearance={a} menu={m.header} saved={saved} />
        </>
      )}
      <div className={cn('flex flex-1 flex-col', header === 'video' && 'xl:pl-60', header === 'sidebar' && 'lg:pl-72')}>
        <main className={cn('flex-1', header === 'portfolio' && 'pt-24', (header === 'overlay' || header === 'minimal' || header === 'bold') && pathname !== '/' && 'pt-20', header === 'floating' && pathname !== '/' && 'pt-24', header === 'luxe' && (pathname !== '/' || t?.layout?.overlay === false) && 'pt-20 lg:pt-[124px]')}>{children}</main>
        {header !== 'video' && <Footer settings={s} menus={m} />}
        {header === 'video' && <div className="px-6 py-8 text-center text-xs text-fg/40 xl:hidden">© {new Date().getFullYear()} {general.siteName}</div>}
      </div>
      {a.backToTop && header !== 'streaming' && <BackToTop />}
    </>
  );
}
