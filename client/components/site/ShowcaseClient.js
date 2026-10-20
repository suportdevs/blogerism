'use client';

import Link from 'next/link';
import { useCallback, useEffect, useRef, useState } from 'react';
import { ArrowRight, CalendarCheck, Check, ChevronLeft, ChevronRight, Clock, Expand, Loader2, Minus, Plus, X } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { cn } from '@/lib/utils';
import { Honeypot } from './forms';

/* ------------------------------------------------------------------------
 * Reveal-on-scroll for page-builder sections (adds .revealed to .reveal).
 * ---------------------------------------------------------------------- */
export function RevealObserver() {
  useEffect(() => {
    const seen = new WeakSet();
    const io = new IntersectionObserver((entries) => {
      entries.forEach((e) => { if (e.isIntersecting) { e.target.classList.add('revealed'); io.unobserve(e.target); } });
    }, { rootMargin: '0px 0px -8% 0px', threshold: 0.05 });
    const scan = () => document.querySelectorAll('.reveal:not(.revealed)').forEach((el) => { if (!seen.has(el)) { seen.add(el); io.observe(el); } });
    scan();
    // New sections appear on client-side navigation and in the builder preview.
    const mo = new MutationObserver(scan);
    mo.observe(document.body, { childList: true, subtree: true });
    return () => { io.disconnect(); mo.disconnect(); };
  }, []);
  return null;
}

/* ------------------------------------------------------------------------
 * Count-up numbers for stats ("12k+", "99.9%", "4.9/5"…).
 * ---------------------------------------------------------------------- */
export function CountUp({ value = '' }) {
  const ref = useRef();
  const match = String(value).match(/^([^\d]*)([\d.,]+)(.*)$/);
  const [shown, setShown] = useState(match ? `${match[1]}0${match[3]}` : value);
  useEffect(() => {
    if (!match) return undefined;
    const [, pre, num, post] = match;
    const target = parseFloat(num.replace(/,/g, ''));
    const decimals = (num.split('.')[1] || '').length;
    let raf;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      const start = performance.now();
      const tick = (t) => {
        const p = Math.min(1, (t - start) / 1600);
        const eased = 1 - (1 - p) ** 3;
        const n = (target * eased).toFixed(decimals);
        setShown(`${pre}${num.includes(',') ? Number(n).toLocaleString('en-US') : n}${post}`);
        if (p < 1) raf = requestAnimationFrame(tick);
      };
      raf = requestAnimationFrame(tick);
    });
    io.observe(ref.current);
    return () => { io.disconnect(); cancelAnimationFrame(raf); };
  }, [value]); // eslint-disable-line react-hooks/exhaustive-deps
  return <span ref={ref}>{shown}</span>;
}

/* ------------------------------------------------------------------------
 * Full-bleed slideshow with crossfade, Ken Burns zoom, progress and arrows.
 * ---------------------------------------------------------------------- */
export function HeroSlideshow({ d }) {
  const slides = (d.slides || []).filter((s) => s.image);
  const [index, setIndex] = useState(0);
  const [paused, setPaused] = useState(false);
  const interval = Math.max(3, Number(d.interval) || 6) * 1000;
  const go = useCallback((i) => setIndex((i + slides.length) % slides.length), [slides.length]);

  useEffect(() => {
    if (paused || slides.length < 2) return undefined;
    const t = setTimeout(() => go(index + 1), interval);
    return () => clearTimeout(t);
  }, [index, paused, interval, go, slides.length]);

  if (!slides.length) return <div className="grid h-[60vh] place-items-center text-fg/40">Add slides with images</div>;
  const s = slides[index];
  const height = d.height === 'tall' ? 'h-[78vh] min-h-[520px]' : 'h-[100svh] min-h-[600px]';

  return (
    <div className={cn('relative -mx-5 overflow-hidden bg-black text-white sm:-mx-8', height)} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {slides.map((sl, i) => (
        <div key={i} className={cn('absolute inset-0 transition-opacity duration-[1400ms]', i === index ? 'opacity-100' : 'opacity-0')} aria-hidden={i !== index}>
          <img
            src={sl.image}
            alt=""
            className="h-full w-full object-cover"
            style={i === index ? { animation: `kenburns ${interval + 1400}ms ease-out forwards` } : undefined}
          />
        </div>
      ))}
      <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-black/40" />
      <div className={cn('relative flex h-full flex-col justify-end px-6 pb-28 sm:px-12 lg:px-20', d.align === 'center' && 'items-center justify-center pb-0 text-center')}>
        <div key={index} className="max-w-3xl">
          {s.eyebrow && <div className="mb-4 animate-fade-up text-xs font-semibold uppercase tracking-[0.35em] text-white/80">{s.eyebrow}</div>}
          {s.title && <h1 className="animate-fade-up font-heading text-5xl font-semibold leading-[1.02] tracking-tight drop-shadow-xl sm:text-7xl lg:text-8xl" style={{ animationDelay: '120ms' }}>{s.title}</h1>}
          {s.subtitle && <p className={cn('mt-5 max-w-xl animate-fade-up text-lg text-white/80 sm:text-xl', d.align === 'center' && 'mx-auto')} style={{ animationDelay: '240ms' }}>{s.subtitle}</p>}
          {s.buttonLabel && (
            <Link href={s.buttonUrl || '#'} className="mt-8 inline-flex animate-fade-up items-center gap-3 rounded-full border border-white/40 bg-white/10 px-7 py-3.5 text-sm font-semibold backdrop-blur transition hover:bg-white hover:text-black" style={{ animationDelay: '360ms' }}>
              {s.buttonLabel}<ArrowRight className="h-4 w-4" />
            </Link>
          )}
        </div>
      </div>
      {slides.length > 1 && (
        <div className="absolute inset-x-0 bottom-8 flex items-center justify-between gap-6 px-6 sm:px-12 lg:px-20">
          <div className="flex flex-1 gap-2">
            {slides.map((_, i) => (
              <button key={i} onClick={() => go(i)} aria-label={`Slide ${i + 1}`} className="h-1 max-w-[80px] flex-1 overflow-hidden rounded-full bg-white/25">
                {i === index && <span key={`${index}-${paused}`} className="block h-full bg-white" style={{ animation: paused ? 'none' : `slide-progress ${interval}ms linear forwards`, width: paused ? '100%' : undefined }} />}
                {i < index && <span className="block h-full w-full bg-white/70" />}
              </button>
            ))}
          </div>
          <span className="font-mono text-sm text-white/70">{String(index + 1).padStart(2, '0')} / {String(slides.length).padStart(2, '0')}</span>
          <div className="flex gap-2">
            <button onClick={() => go(index - 1)} aria-label="Previous slide" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 backdrop-blur transition hover:bg-white hover:text-black"><ChevronLeft className="h-5 w-5" /></button>
            <button onClick={() => go(index + 1)} aria-label="Next slide" className="grid h-11 w-11 place-items-center rounded-full border border-white/30 backdrop-blur transition hover:bg-white hover:text-black"><ChevronRight className="h-5 w-5" /></button>
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Filterable masonry gallery with keyboard-friendly lightbox.
 * ---------------------------------------------------------------------- */
export function MasonryGallery({ d }) {
  const items = (d.items || []).filter((i) => i.src);
  const cats = [...new Set(items.map((i) => i.category).filter(Boolean))];
  const [filter, setFilter] = useState('');
  const [open, setOpen] = useState(-1);
  const shown = filter ? items.filter((i) => i.category === filter) : items;
  const cols = { 2: 'sm:columns-2', 3: 'sm:columns-2 lg:columns-3', 4: 'sm:columns-2 lg:columns-3 xl:columns-4' }[d.columns] || 'sm:columns-2 lg:columns-3';

  useEffect(() => {
    if (open < 0) return undefined;
    const onKey = (e) => {
      if (e.key === 'Escape') setOpen(-1);
      if (e.key === 'ArrowRight') setOpen((i) => (i + 1) % shown.length);
      if (e.key === 'ArrowLeft') setOpen((i) => (i - 1 + shown.length) % shown.length);
    };
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open, shown.length]);

  const current = shown[open];
  return (
    <div className="text-left">
      {d.filters && cats.length > 1 && (
        <div className="mb-10 flex flex-wrap justify-center gap-x-8 gap-y-3">
          {['', ...cats].map((c) => (
            <button key={c || 'all'} onClick={() => setFilter(c)} className={cn('relative pb-1.5 text-sm font-medium uppercase tracking-[0.2em] transition', filter === c ? 'text-fg' : 'text-fg/45 hover:text-fg')}>
              {c || 'All'}
              <span className={cn('absolute inset-x-0 -bottom-px h-px origin-left bg-primary transition-transform duration-300', filter === c ? 'scale-x-100' : 'scale-x-0')} />
            </button>
          ))}
        </div>
      )}
      <div key={filter} className={cn('columns-1 gap-4 [column-fill:_balance]', cols)}>
        {shown.map((item, i) => (
          <button key={`${item.src}-${i}`} onClick={() => setOpen(i)} className="group relative mb-4 block w-full animate-fade-up overflow-hidden rounded-theme break-inside-avoid" style={{ animationDelay: `${Math.min(i, 12) * 60}ms` }}>
            <img src={item.src} alt={item.title || ''} loading="lazy" className="w-full transition duration-700 group-hover:scale-105" />
            <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-black/75 via-black/0 p-5 text-left text-white opacity-0 transition duration-500 group-hover:opacity-100">
              {item.category && <span className="text-[11px] font-semibold uppercase tracking-[0.25em] text-white/70">{item.category}</span>}
              {item.title && <span className="mt-1 font-heading text-xl">{item.title}</span>}
            </div>
            <span className="absolute right-3 top-3 grid h-9 w-9 scale-75 place-items-center rounded-full bg-white/90 text-black opacity-0 transition group-hover:scale-100 group-hover:opacity-100"><Expand className="h-4 w-4" /></span>
          </button>
        ))}
      </div>

      {current && (
        <div className="fixed inset-0 z-[100] flex animate-fade-in items-center justify-center bg-black/95 p-4" onClick={() => setOpen(-1)}>
          <button aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><X className="h-5 w-5" /></button>
          <button aria-label="Previous" onClick={(e) => { e.stopPropagation(); setOpen((open - 1 + shown.length) % shown.length); }} className="absolute left-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronLeft className="h-6 w-6" /></button>
          <figure key={open} className="animate-scale-in text-center" onClick={(e) => e.stopPropagation()}>
            <img src={current.src} alt={current.title || ''} className="max-h-[82vh] max-w-[88vw] rounded-lg object-contain shadow-2xl" />
            <figcaption className="mt-4 text-white/80">
              {current.title && <span className="font-heading text-lg text-white">{current.title}</span>}
              {current.caption && <span className="ml-2 text-sm">{current.caption}</span>}
              <span className="ml-3 font-mono text-xs text-white/50">{open + 1} / {shown.length}</span>
            </figcaption>
          </figure>
          <button aria-label="Next" onClick={(e) => { e.stopPropagation(); setOpen((open + 1) % shown.length); }} className="absolute right-4 grid h-12 w-12 place-items-center rounded-full bg-white/10 text-white hover:bg-white/20"><ChevronRight className="h-6 w-6" /></button>
        </div>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Spotlight: cards inside glow where the mouse is (uses --mx / --my).
 * ---------------------------------------------------------------------- */
export function Spotlight({ children, className }) {
  const onMove = (e) => {
    e.currentTarget.querySelectorAll('[data-spot]').forEach((el) => {
      const r = el.getBoundingClientRect();
      el.style.setProperty('--mx', `${e.clientX - r.left}px`);
      el.style.setProperty('--my', `${e.clientY - r.top}px`);
    });
  };
  return <div onMouseMove={onMove} className={className}>{children}</div>;
}

/* ------------------------------------------------------------------------
 * SaaS hero: aurora background, mouse glow and a 3D-tilting product mock.
 * ---------------------------------------------------------------------- */
function DashboardMock() {
  const bars = [38, 62, 45, 80, 56, 92, 70, 84, 64, 98, 76, 88];
  return (
    <div className="grid h-full grid-cols-[150px_1fr] text-left text-[11px] text-white/70">
      <aside className="space-y-1 border-r border-white/10 p-3">
        <div className="mb-3 flex items-center gap-2"><span className="h-5 w-5 rounded-md bg-gradient-to-br from-primary to-accent" /><span className="font-bold text-white">Pulse</span></div>
        {['Overview', 'Analytics', 'Customers', 'Revenue', 'Reports', 'Settings'].map((x, i) => (
          <div key={x} className={cn('rounded-md px-2 py-1.5', i === 0 ? 'bg-white/10 font-semibold text-white' : '')}>{x}</div>
        ))}
      </aside>
      <div className="space-y-3 p-4">
        <div className="grid grid-cols-3 gap-3">
          {[['Revenue', '$84.2k', '+12.4%'], ['Active users', '24,891', '+8.1%'], ['Conversion', '4.62%', '+0.9%']].map(([l, v, c]) => (
            <div key={l} className="rounded-xl border border-white/10 bg-white/[.04] p-3">
              <div className="text-white/50">{l}</div>
              <div className="mt-1 text-lg font-bold text-white">{v}</div>
              <div className="text-emerald-400">{c}</div>
            </div>
          ))}
        </div>
        <div className="grid grid-cols-[1.6fr_1fr] gap-3">
          <div className="rounded-xl border border-white/10 bg-white/[.04] p-3">
            <div className="mb-2 flex justify-between"><span className="font-semibold text-white">Monthly revenue</span><span>2026</span></div>
            <div className="flex h-28 items-end gap-1.5">
              {bars.map((h, i) => (
                <div key={i} className="flex-1 origin-bottom rounded-t bg-gradient-to-t from-primary/60 to-accent" style={{ height: `${h}%`, animation: `bar-grow .9s cubic-bezier(.2,.7,.2,1) ${0.4 + i * 0.05}s both` }} />
              ))}
            </div>
          </div>
          <div className="rounded-xl border border-white/10 bg-white/[.04] p-3">
            <div className="mb-2 font-semibold text-white">Live sessions</div>
            <svg viewBox="0 0 200 100" className="h-28 w-full">
              <defs><linearGradient id="lg" x1="0" x2="1"><stop offset="0" stopColor="rgb(var(--c-primary))" /><stop offset="1" stopColor="rgb(var(--c-accent))" /></linearGradient></defs>
              <path d="M0 80 C 20 70, 30 40, 50 50 S 80 85, 100 55 S 140 20, 160 35 S 190 15, 200 10" fill="none" stroke="url(#lg)" strokeWidth="3" strokeLinecap="round" strokeDasharray="600" style={{ animation: 'draw-line 2.2s ease-out .6s both' }} />
            </svg>
          </div>
        </div>
      </div>
    </div>
  );
}

export function SpotlightHero({ d }) {
  const ref = useRef();
  const [pos, setPos] = useState({ x: 50, y: 30, rx: 0, ry: 0 });
  const onMove = (e) => {
    const r = ref.current.getBoundingClientRect();
    const x = ((e.clientX - r.left) / r.width) * 100;
    const y = ((e.clientY - r.top) / r.height) * 100;
    setPos({ x, y, rx: (50 - y) / 12, ry: (x - 50) / 14 });
  };
  return (
    <div ref={ref} onMouseMove={onMove} onMouseLeave={() => setPos((p) => ({ ...p, rx: 0, ry: 0 }))} className="relative -mx-5 overflow-hidden px-5 pb-10 pt-16 sm:-mx-8 sm:px-8 sm:pt-24">
      {/* aurora + grid + mouse glow */}
      <div aria-hidden className="pointer-events-none absolute inset-0">
        <div className="absolute -left-1/4 -top-1/3 h-[70%] w-[70%] rounded-full bg-primary/35 blur-[120px]" style={{ animation: 'aurora-1 16s ease-in-out infinite' }} />
        <div className="absolute -right-1/4 top-0 h-[60%] w-[60%] rounded-full bg-accent/25 blur-[120px]" style={{ animation: 'aurora-2 18s ease-in-out infinite' }} />
        <div className="absolute inset-0 opacity-40 [background-image:linear-gradient(rgb(var(--c-fg)/.06)_1px,transparent_1px),linear-gradient(90deg,rgb(var(--c-fg)/.06)_1px,transparent_1px)] [background-size:56px_56px] [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
        <div className="absolute inset-0 transition-[background] duration-300" style={{ background: `radial-gradient(600px circle at ${pos.x}% ${pos.y}%, rgb(var(--c-primary) / .14), transparent 45%)` }} />
      </div>

      <div className="relative mx-auto max-w-4xl text-center">
        {d.badge && (
          <Link href={d.badgeUrl || '#'} className="group mb-8 inline-flex items-center gap-2 rounded-full border border-fg/10 bg-bg/50 py-1 pl-1 pr-4 text-sm text-fg/80 backdrop-blur transition hover:border-primary/50">
            <span className="rounded-full bg-gradient-to-r from-primary to-accent px-2.5 py-0.5 text-xs font-bold text-white">New</span>
            {d.badge}<ArrowRight className="h-3.5 w-3.5 transition group-hover:translate-x-0.5" />
          </Link>
        )}
        <h1 className="font-heading text-5xl font-bold leading-[1.02] tracking-tight text-fg sm:text-7xl">
          {d.title}{' '}
          {d.highlight && <span className="bg-gradient-to-r from-primary via-accent to-primary bg-[length:200%_auto] bg-clip-text text-transparent [animation:shine_5s_linear_infinite]">{d.highlight}</span>}
        </h1>
        {d.subtitle && <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fg/60 sm:text-xl">{d.subtitle}</p>}
        <div className="mt-10 flex flex-wrap justify-center gap-3">
          {d.primaryLabel && <Link href={d.primaryUrl || '#'} className="btn-site-primary !rounded-full !px-7 !py-3.5">{d.primaryLabel}<ArrowRight className="h-4 w-4" /></Link>}
          {d.secondaryLabel && <Link href={d.secondaryUrl || '#'} className="btn-site-ghost !rounded-full !px-7 !py-3.5">{d.secondaryLabel}</Link>}
        </div>
        {d.note && (
          <div className="mt-8 flex items-center justify-center gap-3 text-sm text-fg/55">
            <div className="flex -space-x-2">{[11, 32, 47, 15, 5].map((n) => <img key={n} src={`https://i.pravatar.cc/80?img=${n}`} alt="" className="h-8 w-8 rounded-full border-2 border-bg object-cover" />)}</div>
            {d.note}
          </div>
        )}
      </div>

      <div className="relative mx-auto mt-16 max-w-5xl [perspective:1600px]">
        <div className="absolute -inset-x-10 -bottom-10 top-10 rounded-[3rem] bg-gradient-to-r from-primary/40 to-accent/40 blur-3xl" />
        <div
          className="relative overflow-hidden rounded-2xl border border-white/15 bg-[#0b0c14] shadow-2xl transition-transform duration-300 ease-out"
          style={{ transform: `rotateX(${8 + pos.rx}deg) rotateY(${pos.ry}deg)`, transformStyle: 'preserve-3d' }}
        >
          <div className="flex items-center gap-2 border-b border-white/10 bg-white/[.03] px-4 py-2.5">
            <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
            <span className="mx-auto rounded-md bg-white/5 px-10 py-1 font-mono text-[11px] text-white/40">app.{(d.domain || 'pulse.dev')}</span>
          </div>
          <div className="aspect-[16/9]">{d.image ? <img src={d.image} alt="" className="h-full w-full object-cover" /> : <DashboardMock />}</div>
        </div>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Pricing with monthly / yearly toggle.
 * ---------------------------------------------------------------------- */
export function PricingToggle({ d }) {
  const [yearly, setYearly] = useState(false);
  const cur = d.currency ?? '$';
  return (
    <div>
      <div className="mb-12 flex justify-center">
        <div className="relative inline-flex rounded-full border border-fg/10 bg-surface p-1">
          <span className={cn('absolute bottom-1 top-1 w-[calc(50%-4px)] rounded-full bg-gradient-to-r from-primary to-accent shadow-glow transition-transform duration-300', yearly ? 'translate-x-full' : 'translate-x-0')} />
          {['Monthly', 'Yearly'].map((l, i) => (
            <button key={l} onClick={() => setYearly(i === 1)} className={cn('relative z-10 w-32 rounded-full py-2.5 text-sm font-semibold transition', (i === 1) === yearly ? 'text-white' : 'text-fg/60')}>
              {l}{i === 1 && d.yearlyNote && <span className={cn('ml-1.5 rounded-full px-1.5 py-0.5 text-[10px] font-bold', yearly ? 'bg-white/20' : 'bg-emerald-500/15 text-emerald-500')}>{d.yearlyNote}</span>}
            </button>
          ))}
        </div>
      </div>
      <Spotlight className="mx-auto grid max-w-6xl gap-6 text-left md:grid-cols-[repeat(auto-fit,minmax(280px,1fr))]">
        {(d.plans || []).map((p, i) => {
          const price = yearly ? p.yearly : p.monthly;
          const numeric = price !== '' && !Number.isNaN(Number(price));
          const free = numeric && Number(price) === 0;
          return (
            <div key={i} className={cn('relative rounded-theme-lg p-px', p.highlighted ? 'bg-gradient-to-b from-primary via-accent/60 to-fg/10 shadow-glow' : 'bg-fg/10')}>
              <div data-spot className="group relative flex h-full flex-col overflow-hidden rounded-[calc(var(--radius)*1.5-1px)] bg-bg p-8">
                <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(400px circle at var(--mx) var(--my), rgb(var(--c-primary)/.12), transparent 45%)' }} />
                {p.highlighted && <span className="absolute right-6 top-6 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-bold text-white">Most popular</span>}
                <h3 className="font-heading text-lg font-bold text-fg">{p.name}</h3>
                {p.description && <p className="mt-1 text-sm text-fg/55">{p.description}</p>}
                <div className="my-7 flex items-baseline gap-1">
                  <span key={`${yearly}-${i}`} className="animate-fade-up font-heading text-5xl font-bold tracking-tight text-fg">{free ? 'Free' : numeric ? `${cur}${price}` : price || '—'}</span>
                  {numeric && !free && <span className="text-fg/50">/{yearly ? 'mo, billed yearly' : 'month'}</span>}
                </div>
                <Link href={p.buttonUrl || '#'} className={cn('mb-7 w-full', p.highlighted ? 'btn-site-primary' : 'btn-site-ghost')}>{p.buttonLabel || 'Get started'}</Link>
                <ul className="space-y-3">
                  {(p.features || []).map((f, j) => (
                    <li key={j} className="flex items-start gap-3 text-sm text-fg/75"><span className="mt-0.5 grid h-5 w-5 shrink-0 place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-3 w-3" /></span>{f}</li>
                  ))}
                </ul>
              </div>
            </div>
          );
        })}
      </Spotlight>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Restaurant: tabbed menu.
 * ---------------------------------------------------------------------- */
export function MenuTabs({ d }) {
  const sections = d.sections || [];
  const [active, setActive] = useState(0);
  const cur = d.currency ?? '$';
  const list = d.layout === 'list' ? sections : [sections[active]].filter(Boolean);
  return (
    <div className="text-left">
      {d.layout !== 'list' && sections.length > 1 && (
        <div className="mb-12 flex flex-wrap justify-center gap-2">
          {sections.map((s, i) => (
            <button key={s.name} onClick={() => setActive(i)} className={cn('rounded-full border px-5 py-2.5 font-heading text-base transition', i === active ? 'border-primary bg-primary text-white shadow-glow' : 'border-fg/15 text-fg/70 hover:border-primary hover:text-primary')}>
              {s.name}
            </button>
          ))}
        </div>
      )}
      {list.map((s) => (
        <div key={s.name} className="mb-14 last:mb-0">
          {d.layout === 'list' && <h3 className="mb-8 text-center font-heading text-3xl text-fg">{s.name}</h3>}
          {s.note && <p className="-mt-6 mb-8 text-center text-sm italic text-fg/55">{s.note}</p>}
          <div key={active} className="grid gap-x-14 gap-y-8 md:grid-cols-2">
            {(s.items || []).map((item, i) => (
              <div key={item.name} className="group flex animate-fade-up gap-4" style={{ animationDelay: `${i * 60}ms` }}>
                {item.image && <img src={item.image} alt="" className="h-20 w-20 shrink-0 rounded-full object-cover ring-2 ring-primary/20 transition duration-500 group-hover:rotate-6 group-hover:scale-105" />}
                <div className="min-w-0 flex-1">
                  <div className="flex items-baseline gap-3">
                    <h4 className="font-heading text-xl text-fg">{item.name}</h4>
                    <span className="mb-1.5 flex-1 border-b border-dotted border-fg/25" />
                    <span className="font-heading text-xl text-primary">{item.price !== '' && item.price != null ? `${cur}${item.price}` : ''}</span>
                  </div>
                  {item.description && <p className="mt-1 text-sm leading-relaxed text-fg/60">{item.description}</p>}
                  {item.tags?.length > 0 && (
                    <div className="mt-2 flex flex-wrap gap-1.5">
                      {item.tags.map((t) => <span key={t} className="rounded-full bg-accent/15 px-2 py-0.5 text-[11px] font-semibold uppercase tracking-wide text-accent">{t}</span>)}
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Restaurant: opening hours with live "open now" badge.
 * ---------------------------------------------------------------------- */
const DAYS = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
const toMin = (t = '') => { const [h, m] = t.split(':').map(Number); return h * 60 + (m || 0); };

export function OpeningHours({ rows = [] }) {
  const [now, setNow] = useState(null);
  useEffect(() => { setNow(new Date()); const t = setInterval(() => setNow(new Date()), 60000); return () => clearInterval(t); }, []);
  const today = now ? DAYS[now.getDay()] : null;
  const row = rows.find((r) => r.day === today);
  const mins = now ? now.getHours() * 60 + now.getMinutes() : 0;
  const open = row && !row.closed && mins >= toMin(row.open) && mins < toMin(row.close);
  return (
    <div>
      {now && (
        <div className={cn('mb-5 inline-flex items-center gap-2 rounded-full px-3 py-1 text-sm font-semibold', open ? 'bg-emerald-500/15 text-emerald-500' : 'bg-rose-500/15 text-rose-500')}>
          <span className={cn('h-2 w-2 rounded-full', open ? 'animate-pulse bg-emerald-500' : 'bg-rose-500')} />
          {open ? `Open now · until ${row.close}` : 'Closed now'}
        </div>
      )}
      <ul className="divide-y divide-fg/10">
        {rows.map((r) => (
          <li key={r.day} className={cn('flex justify-between py-2.5 text-sm', r.day === today ? 'font-bold text-primary' : 'text-fg/75')}>
            <span>{r.day}{r.day === today && ' · today'}</span>
            <span>{r.closed ? 'Closed' : `${r.open} – ${r.close}`}</span>
          </li>
        ))}
      </ul>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Restaurant: reservation form (sent as a contact message).
 * ---------------------------------------------------------------------- */
export function ReservationForm({ d }) {
  const times = [];
  for (let m = toMin(d.firstSlot || '12:00'); m <= toMin(d.lastSlot || '21:30'); m += 30) times.push(`${String(Math.floor(m / 60)).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`);
  const [form, setForm] = useState({ name: '', email: '', phone: '', date: '', time: times[Math.floor(times.length / 2)] || '19:00', guests: 2, notes: '' });
  const [state, setState] = useState({ status: 'idle' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  const max = Number(d.maxGuests) || 10;

  const submit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading' });
    try {
      const res = await fetch(`${API_URL}/api/public/contact`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          name: form.name, email: form.email, phone: form.phone,
          kind: 'reservation',
          subject: `Table reservation — ${form.date} at ${form.time}, ${form.guests} guest${form.guests > 1 ? 's' : ''}`,
          details: { Date: form.date, Time: form.time, Guests: form.guests },
          message: form.notes || `Table for ${form.guests} on ${form.date} at ${form.time}.`,
          website: e.currentTarget.elements.namedItem('website')?.value || '',
        }),
      });
      const data = await res.json().catch(() => ({}));
      if (!res.ok) throw new Error(data.message || 'Could not send your reservation');
      setState({ status: 'done' });
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  };

  if (state.status === 'done') {
    return (
      <div className="flex animate-scale-in flex-col items-center rounded-theme-lg border border-fg/10 bg-bg p-10 text-center shadow-xl">
        <div className="mb-5 grid h-16 w-16 place-items-center rounded-full bg-emerald-500/15 text-emerald-500"><CalendarCheck className="h-8 w-8" /></div>
        <h3 className="font-heading text-2xl text-fg">Request received!</h3>
        <p className="mt-2 max-w-sm text-fg/60">Table for {form.guests} on {form.date} at {form.time}. We’ll confirm by email shortly.</p>
        <button onClick={() => setState({ status: 'idle' })} className="btn-site-ghost mt-6">Make another booking</button>
      </div>
    );
  }

  const input = 'site-input bg-bg';
  return (
    <form onSubmit={submit} className="relative grid gap-4 rounded-theme-lg border border-fg/10 bg-bg p-6 text-left shadow-xl sm:grid-cols-2 sm:p-8">
      <Honeypot />
      <label className="sm:col-span-2">
        <span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-fg/50">Guests</span>
        <div className="flex items-center gap-4">
          <button type="button" onClick={() => setForm((f) => ({ ...f, guests: Math.max(1, f.guests - 1) }))} className="grid h-11 w-11 place-items-center rounded-full border border-fg/15 text-fg hover:border-primary hover:text-primary"><Minus className="h-4 w-4" /></button>
          <span className="w-16 text-center font-heading text-3xl text-fg">{form.guests}</span>
          <button type="button" onClick={() => setForm((f) => ({ ...f, guests: Math.min(max, f.guests + 1) }))} className="grid h-11 w-11 place-items-center rounded-full border border-fg/15 text-fg hover:border-primary hover:text-primary"><Plus className="h-4 w-4" /></button>
          <span className="text-sm text-fg/50">max {max} online</span>
        </div>
      </label>
      <label><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-fg/50">Date</span><input required type="date" min={new Date().toISOString().slice(0, 10)} className={input} value={form.date} onChange={set('date')} /></label>
      <label><span className="mb-1.5 block text-xs font-semibold uppercase tracking-wider text-fg/50">Time</span>
        <select className={input} value={form.time} onChange={set('time')}>{times.map((t) => <option key={t}>{t}</option>)}</select>
      </label>
      <input required className={input} placeholder="Your name *" value={form.name} onChange={set('name')} />
      <input required type="email" className={input} placeholder="Email *" value={form.email} onChange={set('email')} />
      <input className={cn(input, 'sm:col-span-2')} placeholder="Phone" value={form.phone} onChange={set('phone')} />
      <textarea className={cn(input, 'min-h-[90px] sm:col-span-2')} placeholder="Allergies, occasion, seating preference…" value={form.notes} onChange={set('notes')} />
      {state.status === 'error' && <p className="text-sm text-rose-500 sm:col-span-2">{state.message}</p>}
      <button className="btn-site-primary !py-4 sm:col-span-2" disabled={state.status === 'loading'}>
        {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Clock className="h-4 w-4" />Request a table</>}
      </button>
    </form>
  );
}
