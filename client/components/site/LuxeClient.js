'use client';

import Link from 'next/link';
import { useEffect, useRef, useState } from 'react';
import { ArrowUpRight, ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

/* Editorial numbered list; on desktop a preview image follows the cursor over each row. */
export function LuxeListRows({ rows }) {
  const [hover, setHover] = useState(-1);
  const [pos, setPos] = useState({ x: 0, y: 0 });
  return (
    <div className="relative" onMouseMove={(e) => setPos({ x: e.clientX, y: e.clientY })} onMouseLeave={() => setHover(-1)}>
      <div className="border-b border-fg/15">
        {rows.map((r, i) => (
          <Link
            key={r.href + i}
            href={r.href}
            onMouseEnter={() => setHover(i)}
            className="group grid grid-cols-[2.5rem_1fr_auto] items-baseline gap-4 border-t border-fg/15 py-7 text-left transition-colors sm:grid-cols-[4rem_1fr_auto] sm:gap-8 sm:py-9"
          >
            <span className="font-mono text-xs text-fg/40">{String(i + 1).padStart(2, '0')}</span>
            <span className="font-heading text-2xl leading-tight text-fg transition-all duration-500 group-hover:translate-x-3 group-hover:italic group-hover:text-primary sm:text-4xl lg:text-5xl">{r.title}</span>
            <span className="flex items-center gap-3 text-[11px] uppercase tracking-[0.25em] text-fg/50">
              <span className="hidden md:inline">{r.meta}</span>
              <ArrowUpRight className="h-5 w-5 transition duration-500 group-hover:rotate-45 group-hover:text-primary" />
            </span>
          </Link>
        ))}
      </div>
      {/* Cursor-following preview (desktop only) */}
      <div
        className={cn('pointer-events-none fixed z-40 hidden w-64 -translate-x-1/2 -translate-y-1/2 overflow-hidden transition-[opacity,transform] duration-300 lg:block', hover >= 0 && rows[hover]?.image ? 'scale-100 opacity-100' : 'scale-90 opacity-0')}
        style={{ left: pos.x + 150, top: pos.y }}
      >
        {rows.map((r, i) => r.image && (
          <img key={i} src={r.image} alt="" className={cn('aspect-[4/5] w-full object-cover transition-opacity duration-300', i === hover ? 'opacity-100' : 'absolute inset-0 opacity-0')} />
        ))}
      </div>
    </div>
  );
}

/* One quote at a time, crossfading, with arrows and autoplay. */
export function LuxeQuotes({ items = [], interval = 7000 }) {
  const [i, setI] = useState(0);
  const timer = useRef();
  useEffect(() => {
    if (items.length < 2) return undefined;
    timer.current = setTimeout(() => setI((n) => (n + 1) % items.length), interval);
    return () => clearTimeout(timer.current);
  }, [i, items.length, interval]);
  if (!items.length) return <p className="text-center text-fg/50">Add testimonials in the admin to show them here.</p>;
  const t = items[i];
  return (
    <div className="mx-auto max-w-4xl text-center">
      <div className="font-heading text-7xl leading-none text-primary">“</div>
      <blockquote key={i} className="animate-fade-up font-heading text-2xl italic leading-relaxed text-fg sm:text-4xl">{t.content}</blockquote>
      <div key={`n${i}`} className="mt-10 animate-fade-in">
        <div className="text-xs uppercase tracking-[0.3em] text-fg">{t.name}</div>
        {(t.position || t.company) && <div className="mt-1 text-xs uppercase tracking-[0.2em] text-fg/45">{[t.position, t.company].filter(Boolean).join(' · ')}</div>}
      </div>
      {items.length > 1 && (
        <div className="mt-10 flex items-center justify-center gap-6">
          <button onClick={() => setI((i - 1 + items.length) % items.length)} aria-label="Previous" className="grid h-11 w-11 place-items-center border border-fg/20 text-fg/70 transition hover:border-primary hover:text-primary"><ChevronLeft className="h-4 w-4" /></button>
          <span className="font-mono text-xs tracking-widest text-fg/50">{String(i + 1).padStart(2, '0')} — {String(items.length).padStart(2, '0')}</span>
          <button onClick={() => setI((i + 1) % items.length)} aria-label="Next" className="grid h-11 w-11 place-items-center border border-fg/20 text-fg/70 transition hover:border-primary hover:text-primary"><ChevronRight className="h-4 w-4" /></button>
        </div>
      )}
    </div>
  );
}
