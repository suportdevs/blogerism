'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { LanguageSwitcher, useLocaleHref, usePagePath, useT } from './I18n';
import { useEffect, useState } from 'react';
import { ArrowRight, Menu, Moon, Search, Sun, X } from 'lucide-react';
import { SavedLink } from './Engagement';
import { Caret, DesktopNav, MobileNavTree } from './NavMenu';
import { cn } from '@/lib/utils';

export function Logo({ general, className }) {
  return (
    <Link href="/" className={cn('flex shrink-0 items-center gap-2.5', className)}>
      {general.logo ? (
        <>
          <img src={general.logo} alt={general.siteName} className={cn('h-8 w-auto', general.logoDark && 'dark:hidden')} />
          {general.logoDark && <img src={general.logoDark} alt={general.siteName} className="hidden h-8 w-auto dark:block" />}
        </>
      ) : (
        <>
          <span className="relative grid h-9 w-9 place-items-center overflow-hidden rounded-[calc(var(--radius)*0.7)] bg-gradient-to-br from-primary to-accent font-heading text-lg font-black text-white shadow-glow">
            {general.siteName?.[0] || 'N'}
          </span>
          <span className="font-heading text-lg font-extrabold tracking-tight text-fg">{general.siteName}</span>
        </>
      )}
    </Link>
  );
}

// The theme toggle sits in every header style's toolbar, so the language switcher rides along with it.
export function ThemeToggle({ className }) {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('site-theme', dark ? 'dark' : 'light'); } catch {}
  };
  return (
    <>
      <LanguageSwitcher className={className} />
      <button onClick={toggle} aria-label="Toggle theme" className={cn('grid h-10 w-10 place-items-center rounded-full text-fg/70 transition hover:bg-fg/5 hover:text-fg', className)}>
        <Sun className="hidden h-[18px] w-[18px] dark:block" />
        <Moon className="h-[18px] w-[18px] dark:hidden" />
      </button>
    </>
  );
}


export default function Header({ general, appearance, menu, saved }) {
  const href = useLocaleHref();
  const pathname = usePagePath();
  const router = useRouter();
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [q, setQ] = useState('');
  const items = menu?.items || [];
  const style = appearance.headerStyle;
  const cta = appearance.headerCta || {};

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  useEffect(() => { setOpen(false); setSearchOpen(false); }, [pathname]);

  const onSearch = (e) => {
    e.preventDefault();
    if (q.trim()) router.push(href(`/search?q=${encodeURIComponent(q.trim())}`));
  };

  return (
    <>
      <header
        className={cn(
          'z-40 w-full transition-all duration-300',
          appearance.headerSticky ? 'sticky top-0' : 'relative',
          style === 'solid' && 'border-b border-fg/10 bg-bg',
          style === 'glass' && (scrolled ? 'border-b border-fg/10 bg-bg/70 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'),
          style === 'centered' && 'border-b border-fg/10 bg-bg/80 backdrop-blur-xl',
        )}
      >
        <div className={cn('site-container flex h-[72px] items-center gap-6', style === 'centered' && 'lg:grid lg:grid-cols-[1fr_auto_1fr]')}>
          {style === 'centered' ? (
            <>
              <Nav items={items} className="hidden lg:flex" />
              <Logo general={general} />
            </>
          ) : (
            <>
              <Logo general={general} />
              <Nav items={items} className="mx-auto hidden lg:flex" />
            </>
          )}
  
          <div className="ml-auto flex items-center gap-1 lg:justify-self-end">
            <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-fg/70 transition hover:bg-fg/5 hover:text-fg">
              <Search className="h-[18px] w-[18px]" />
            </button>
            {saved && <SavedLink label={saved} />}
            <ThemeToggle />
            {cta.enabled && cta.label && (
              <Link href={cta.url || '#'} className="btn-site-primary ml-2 hidden !py-2.5 sm:inline-flex">{cta.label}<ArrowRight className="h-4 w-4" /></Link>
            )}
            <button onClick={() => setOpen(true)} aria-label="Open menu" className="grid h-10 w-10 place-items-center rounded-full text-fg lg:hidden"><Menu className="h-5 w-5" /></button>
          </div>
        </div>
  
        {searchOpen && (
          <div className="border-t border-fg/10 bg-bg/95 backdrop-blur-xl animate-fade-in">
            <form onSubmit={onSearch} className="site-container flex items-center gap-3 py-4">
              <Search className="h-5 w-5 text-fg/40" />
              <input autoFocus value={q} onChange={(e) => setQ(e.target.value)} placeholder="Search articles…" className="flex-1 bg-transparent text-lg text-fg outline-none placeholder:text-fg/40" />
              <kbd className="hidden rounded-md border border-fg/10 px-2 py-0.5 text-xs text-fg/50 sm:block">Enter</kbd>
            </form>
          </div>
        )}
      </header>

      {/* Mobile drawer — outside <header>: its backdrop blur would otherwise trap this fixed panel inside the bar. */}
      <div className={cn('fixed inset-0 z-50 lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div onClick={() => setOpen(false)} className={cn('absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'opacity-0')} />
        <aside className={cn('absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-bg p-6 shadow-2xl transition-transform duration-300', open ? 'translate-x-0' : 'translate-x-full')}>
          <div className="mb-8 flex items-center justify-between">
            <Logo general={general} />
            <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-fg/5 text-fg"><X className="h-5 w-5" /></button>
          </div>
          <nav className="-mx-2 overflow-y-auto"><MobileNavTree items={items} onNavigate={() => setOpen(false)} /></nav>
          {cta.enabled && cta.label && <Link href={cta.url || '#'} className="btn-site-primary mt-auto">{cta.label}</Link>}
        </aside>
      </div>
    </>
  );
}

function Nav({ items, className }) {
  return (
    <DesktopNav
      items={items}
      className={cn('items-center gap-1', className)}
      megaClassName="pt-3"
      renderTop={(item, { active, open, hasChildren }) => (
        <span className={cn('flex cursor-pointer items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition', active || open ? 'bg-primary/10 text-primary' : 'text-fg/70 hover:bg-fg/5 hover:text-fg')}>
          {item.label}{hasChildren && <Caret open={open} />}
        </span>
      )}
    />
  );
}
