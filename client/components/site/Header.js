'use client';

import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import { ArrowRight, ChevronDown, Menu, Moon, Search, Sun, X } from 'lucide-react';
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

export function ThemeToggle({ className }) {
  const toggle = () => {
    const dark = !document.documentElement.classList.contains('dark');
    document.documentElement.classList.toggle('dark', dark);
    try { localStorage.setItem('site-theme', dark ? 'dark' : 'light'); } catch {}
  };
  return (
    <button onClick={toggle} aria-label="Toggle theme" className={cn('grid h-10 w-10 place-items-center rounded-full text-fg/70 transition hover:bg-fg/5 hover:text-fg', className)}>
      <Sun className="hidden h-[18px] w-[18px] dark:block" />
      <Moon className="h-[18px] w-[18px] dark:hidden" />
    </button>
  );
}

const isActive = (pathname, url) => (url === '/' ? pathname === '/' : pathname.startsWith(url));

export default function Header({ general, appearance, menu }) {
  const pathname = usePathname();
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
    if (q.trim()) router.push(`/search?q=${encodeURIComponent(q.trim())}`);
  };

  return (
    <header
      className={cn(
        'z-40 w-full transition-all duration-300',
        appearance.headerSticky && 'sticky top-0',
        style === 'solid' && 'border-b border-fg/10 bg-bg',
        style === 'glass' && (scrolled ? 'border-b border-fg/10 bg-bg/70 backdrop-blur-xl' : 'border-b border-transparent bg-transparent'),
        style === 'centered' && 'border-b border-fg/10 bg-bg/80 backdrop-blur-xl',
      )}
    >
      <div className={cn('site-container flex h-[72px] items-center gap-6', style === 'centered' && 'lg:grid lg:grid-cols-[1fr_auto_1fr]')}>
        {style === 'centered' ? (
          <>
            <Nav items={items} pathname={pathname} className="hidden lg:flex" />
            <Logo general={general} />
          </>
        ) : (
          <>
            <Logo general={general} />
            <Nav items={items} pathname={pathname} className="mx-auto hidden lg:flex" />
          </>
        )}

        <div className="ml-auto flex items-center gap-1 lg:justify-self-end">
          <button onClick={() => setSearchOpen((s) => !s)} aria-label="Search" className="grid h-10 w-10 place-items-center rounded-full text-fg/70 transition hover:bg-fg/5 hover:text-fg">
            <Search className="h-[18px] w-[18px]" />
          </button>
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

      {/* Mobile drawer */}
      <div className={cn('fixed inset-0 z-50 lg:hidden', open ? 'pointer-events-auto' : 'pointer-events-none')}>
        <div onClick={() => setOpen(false)} className={cn('absolute inset-0 bg-black/40 backdrop-blur-sm transition-opacity', open ? 'opacity-100' : 'opacity-0')} />
        <aside className={cn('absolute right-0 top-0 flex h-full w-[86%] max-w-sm flex-col bg-bg p-6 shadow-2xl transition-transform duration-300', open ? 'translate-x-0' : 'translate-x-full')}>
          <div className="mb-8 flex items-center justify-between">
            <Logo general={general} />
            <button onClick={() => setOpen(false)} className="grid h-10 w-10 place-items-center rounded-full bg-fg/5 text-fg"><X className="h-5 w-5" /></button>
          </div>
          <nav className="flex flex-col gap-1 overflow-y-auto">
            {items.map((item) => (
              <div key={item.id}>
                <Link href={item.url} target={item.target} className={cn('block rounded-theme px-4 py-3 font-semibold', isActive(pathname, item.url) ? 'bg-primary/10 text-primary' : 'text-fg hover:bg-fg/5')}>{item.label}</Link>
                {item.children?.map((c) => (
                  <Link key={c.id} href={c.url} target={c.target} className="block rounded-theme px-4 py-2 pl-8 text-sm text-fg/65 hover:text-primary">{c.label}</Link>
                ))}
              </div>
            ))}
          </nav>
          {cta.enabled && cta.label && <Link href={cta.url || '#'} className="btn-site-primary mt-auto">{cta.label}</Link>}
        </aside>
      </div>
    </header>
  );
}

function Nav({ items, pathname, className }) {
  return (
    <nav className={cn('items-center gap-1', className)}>
      {items.map((item) => (
        <div key={item.id} className="group relative">
          <Link
            href={item.url}
            target={item.target}
            className={cn(
              'flex items-center gap-1 rounded-full px-4 py-2 text-sm font-semibold transition',
              isActive(pathname, item.url) ? 'bg-primary/10 text-primary' : 'text-fg/70 hover:bg-fg/5 hover:text-fg',
            )}
          >
            {item.label}
            {item.children?.length > 0 && <ChevronDown className="h-3.5 w-3.5 transition group-hover:rotate-180" />}
          </Link>
          {item.children?.length > 0 && (
            <div className="invisible absolute left-1/2 top-full z-50 w-56 -translate-x-1/2 translate-y-2 pt-3 opacity-0 transition-all duration-200 group-hover:visible group-hover:translate-y-0 group-hover:opacity-100">
              <div className="rounded-theme border border-fg/10 bg-bg p-2 shadow-2xl">
                {item.children.map((c) => (
                  <Link key={c.id} href={c.url} target={c.target} className="block rounded-[calc(var(--radius)*0.6)] px-3 py-2.5 text-sm font-medium text-fg/75 transition hover:bg-primary/10 hover:text-primary">{c.label}</Link>
                ))}
              </div>
            </div>
          )}
        </div>
      ))}
    </nav>
  );
}
