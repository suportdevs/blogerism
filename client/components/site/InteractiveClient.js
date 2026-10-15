'use client';

import Link from 'next/link';
import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowLeft, ArrowRight, ArrowUpRight, Check, ChevronDown, ChevronsLeftRight, MapPin, Minus, Play, X } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { VideoPlayer } from './MediaClient';

/* ------------------------------------------------------------------------
 * Feature tabs: auto-advancing tabs with a progress bar, crossfading media.
 * ---------------------------------------------------------------------- */
export function FeatureTabs({ d }) {
  const tabs = d.tabs || [];
  const [active, setActive] = useState(0);
  const [paused, setPaused] = useState(false);
  const side = d.variant === 'side';
  const next = () => setActive((a) => (a + 1) % Math.max(tabs.length, 1));
  if (!tabs.length) return null;
  const t = tabs[Math.min(active, tabs.length - 1)];

  const tabList = (
    <div role="tablist" className={cn(side ? 'flex flex-col gap-2' : 'mx-auto mb-10 flex w-fit max-w-full gap-1 overflow-x-auto rounded-full border border-fg/10 bg-surface p-1.5')}>
      {tabs.map((tab, i) => {
        const Icon = ICONS[tab.icon] || ICONS.Star;
        const on = i === active;
        return (
          <button
            key={i}
            role="tab"
            aria-selected={on}
            onClick={() => setActive(i)}
            className={cn(
              'relative shrink-0 overflow-hidden text-left transition',
              side ? cn('rounded-theme border p-5', on ? 'border-primary/40 bg-surface shadow-lg' : 'border-transparent hover:bg-surface/70')
                : cn('flex items-center gap-2 rounded-full px-5 py-2.5 text-sm font-semibold', on ? 'bg-primary text-white shadow-glow' : 'text-fg/60 hover:text-fg'),
            )}
          >
            {side ? (
              <>
                <div className="flex items-center gap-3">
                  <span className={cn('grid h-10 w-10 place-items-center rounded-theme transition', on ? 'bg-primary text-white' : 'bg-primary/10 text-primary')}><Icon className="h-5 w-5" /></span>
                  <span className="font-heading text-lg font-bold text-fg">{tab.label}</span>
                </div>
                <div className={cn('grid transition-all duration-500', on ? 'mt-3 grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                  <p className="overflow-hidden text-sm leading-relaxed text-fg/60">{tab.text}</p>
                </div>
              </>
            ) : <><Icon className="h-4 w-4" />{tab.label}</>}
            {on && d.autoplay && (
              <span
                key={`${active}-${paused}`}
                onAnimationEnd={next}
                className={cn('absolute bottom-0 left-0 h-[3px] bg-accent', side ? '' : 'bg-white/70')}
                style={{ animation: 'slide-progress 6s linear forwards', animationPlayState: paused ? 'paused' : 'running' }}
              />
            )}
          </button>
        );
      })}
    </div>
  );

  const media = (
    <div className="relative aspect-[4/3] overflow-hidden rounded-theme-lg border border-fg/10 bg-surface shadow-2xl">
      {tabs.map((tab, i) => tab.image && (
        <img key={i} src={tab.image} alt="" className={cn('absolute inset-0 h-full w-full object-cover transition-all duration-700', i === active ? 'scale-100 opacity-100' : 'scale-105 opacity-0')} />
      ))}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-black/30 to-transparent" />
    </div>
  );

  return (
    <div onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      {side ? (
        <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.4fr]">{tabList}{media}</div>
      ) : (
        <>
          {tabList}
          <div className="grid items-center gap-10 lg:grid-cols-2">
            <div key={active} className="animate-fade-up">
              <h3 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{t.title}</h3>
              {t.text && <p className="mt-4 text-lg leading-relaxed text-fg/60">{t.text}</p>}
              {!!t.bullets?.length && (
                <ul className="mt-6 space-y-3">
                  {t.bullets.map((b, i) => <li key={i} className="flex items-center gap-3 text-fg/80"><span className="grid h-6 w-6 place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-3.5 w-3.5" /></span>{b}</li>)}
                </ul>
              )}
              {t.buttonLabel && <Link href={t.buttonUrl || '#'} className="btn-site-primary mt-8">{t.buttonLabel}<ArrowRight className="h-4 w-4" /></Link>}
            </div>
            {media}
          </div>
        </>
      )}
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Comparison table with "only differences" filter and column hover.
 * ---------------------------------------------------------------------- */
function Cell({ value }) {
  const v = String(value ?? '').trim();
  if (/^(yes|true|✓)$/i.test(v)) return <span className="mx-auto grid h-7 w-7 place-items-center rounded-full bg-primary/15 text-primary"><Check className="h-4 w-4" /></span>;
  if (/^(no|false|-|—|)$/i.test(v)) return <Minus className="mx-auto h-4 w-4 text-fg/25" />;
  return <span className="font-semibold text-fg">{v}</span>;
}

export function ComparisonTable({ d }) {
  const cols = d.columns || [];
  const hl = Number(d.highlight) - 1;
  const [diffOnly, setDiffOnly] = useState(false);
  const [hover, setHover] = useState(-1);
  const rows = (d.rows || []).filter((r) => !diffOnly || new Set(cols.map((_, i) => String(r.values?.[i] ?? '').toLowerCase())).size > 1);
  const colCls = (i) => cn('px-4 py-4 text-center transition-colors', i === hl && 'bg-primary/[.06]', hover === i && 'bg-primary/10');

  return (
    <div>
      <div className="mb-4 flex justify-end">
        <label className="flex cursor-pointer items-center gap-2 text-sm font-medium text-fg/60">
          <span className={cn('relative h-5 w-9 rounded-full transition', diffOnly ? 'bg-primary' : 'bg-fg/15')}>
            <span className={cn('absolute top-0.5 h-4 w-4 rounded-full bg-white shadow transition-all', diffOnly ? 'left-[18px]' : 'left-0.5')} />
          </span>
          <input type="checkbox" className="sr-only" checked={diffOnly} onChange={(e) => setDiffOnly(e.target.checked)} />
          Show differences only
        </label>
      </div>
      <div className="overflow-x-auto rounded-theme-lg border border-fg/10 bg-bg">
        <table className="w-full min-w-[640px] border-collapse text-sm" onMouseLeave={() => setHover(-1)}>
          <thead>
            <tr className="border-b border-fg/10">
              <th className="sticky left-0 z-10 bg-bg px-5 py-5 text-left text-xs font-semibold uppercase tracking-wider text-fg/45">Features</th>
              {cols.map((c, i) => (
                <th key={i} onMouseEnter={() => setHover(i)} className={cn(colCls(i), 'relative align-bottom')}>
                  {i === hl && d.highlightLabel && <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[10px] font-bold uppercase tracking-wider text-white">{d.highlightLabel}</span>}
                  <div className="font-heading text-lg font-bold text-fg">{c}</div>
                  {i === hl && <span className="absolute inset-x-0 top-0 h-1 bg-gradient-to-r from-primary to-accent" />}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {rows.map((r, ri) => (
              <FragmentRow key={ri} showGroup={d.groups && r.group && r.group !== rows[ri - 1]?.group} group={r.group} span={cols.length + 1}>
                <tr className="group border-b border-fg/5 transition hover:bg-fg/[.02]">
                  <td className="sticky left-0 z-10 bg-bg px-5 py-4 font-medium text-fg/80 group-hover:text-fg">{r.feature}</td>
                  {cols.map((_, i) => <td key={i} onMouseEnter={() => setHover(i)} className={colCls(i)}><Cell value={r.values?.[i]} /></td>)}
                </tr>
              </FragmentRow>
            ))}
            {!rows.length && <tr><td colSpan={cols.length + 1} className="px-5 py-10 text-center text-fg/45">No differences — every plan includes these.</td></tr>}
          </tbody>
          {!!d.buttons?.length && (
            <tfoot>
              <tr>
                <td className="sticky left-0 bg-bg" />
                {cols.map((_, i) => d.buttons[i] && (
                  <td key={i} className={cn(colCls(i), 'py-6')}>
                    <Link href={d.buttons[i].url || '#'} className={cn(i === hl ? 'btn-site-primary' : 'btn-site-ghost', 'w-full justify-center whitespace-nowrap px-4')}>{d.buttons[i].label}</Link>
                  </td>
                ))}
              </tr>
            </tfoot>
          )}
        </table>
      </div>
    </div>
  );
}

function FragmentRow({ showGroup, group, span, children }) {
  return (
    <>
      {showGroup && <tr><td colSpan={span} className="bg-surface px-5 pb-2 pt-6 text-xs font-bold uppercase tracking-[0.2em] text-primary">{group}</td></tr>}
      {children}
    </>
  );
}

/* ------------------------------------------------------------------------
 * Before / after slider (pointer drag, keyboard, click to jump).
 * ---------------------------------------------------------------------- */
export function BeforeAfter({ d }) {
  const [pos, setPos] = useState(Math.min(95, Math.max(5, Number(d.start) || 50)));
  const ref = useRef();
  const dragging = useRef(false);
  const update = (clientX) => {
    const r = ref.current.getBoundingClientRect();
    setPos(Math.min(100, Math.max(0, ((clientX - r.left) / r.width) * 100)));
  };
  useEffect(() => {
    const move = (e) => dragging.current && update(e.touches ? e.touches[0].clientX : e.clientX);
    const up = () => { dragging.current = false; };
    window.addEventListener('pointermove', move);
    window.addEventListener('pointerup', up);
    return () => { window.removeEventListener('pointermove', move); window.removeEventListener('pointerup', up); };
  }, []);

  return (
    <div
      ref={ref}
      className="group relative w-full touch-none select-none overflow-hidden rounded-theme-lg border border-fg/10 bg-surface shadow-2xl"
      style={{ aspectRatio: d.ratio || '16/9' }}
      onPointerDown={(e) => { dragging.current = true; update(e.clientX); }}
    >
      {d.after && <img src={d.after} alt={d.afterLabel || ''} draggable={false} className="absolute inset-0 h-full w-full object-cover" />}
      {d.before && <img src={d.before} alt={d.beforeLabel || ''} draggable={false} className="absolute inset-0 h-full w-full object-cover" style={{ clipPath: `inset(0 ${100 - pos}% 0 0)` }} />}
      {d.beforeLabel && <span className="absolute left-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition-opacity" style={{ opacity: pos > 12 ? 1 : 0 }}>{d.beforeLabel}</span>}
      {d.afterLabel && <span className="absolute right-4 top-4 rounded-full bg-black/55 px-3 py-1 text-xs font-bold uppercase tracking-wider text-white backdrop-blur transition-opacity" style={{ opacity: pos < 88 ? 1 : 0 }}>{d.afterLabel}</span>}
      <div className="absolute inset-y-0 w-0.5 -translate-x-1/2 bg-white shadow-[0_0_20px_rgb(0_0_0/.4)]" style={{ left: `${pos}%` }}>
        <button
          type="button"
          aria-label="Drag to compare"
          aria-valuenow={Math.round(pos)}
          role="slider"
          onKeyDown={(e) => { if (e.key === 'ArrowLeft') setPos((p) => Math.max(0, p - 4)); if (e.key === 'ArrowRight') setPos((p) => Math.min(100, p + 4)); }}
          className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 cursor-ew-resize place-items-center rounded-full border-2 border-white bg-white/20 text-white shadow-xl backdrop-blur-md transition group-hover:scale-110"
        >
          <ChevronsLeftRight className="h-5 w-5" />
        </button>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Accordion with a crossfading image; auto-advances until the user clicks.
 * ---------------------------------------------------------------------- */
export function AccordionImage({ d }) {
  const items = d.items || [];
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(!!d.autoplay);
  if (!items.length) return null;
  const left = d.imagePosition === 'left';
  return (
    <div className="grid items-center gap-10 lg:grid-cols-2 lg:gap-16">
      <div className={cn('relative aspect-[5/4] overflow-hidden rounded-theme-lg border border-fg/10 bg-surface shadow-2xl', left && 'lg:order-first', !left && 'lg:order-last')}>
        {items.map((it, i) => it.image && <img key={i} src={it.image} alt="" className={cn('absolute inset-0 h-full w-full object-cover transition-all duration-1000', i === active ? 'scale-100 opacity-100' : 'scale-110 opacity-0')} />)}
        <div className="absolute bottom-4 left-4 rounded-full bg-black/50 px-3 py-1 font-mono text-xs text-white backdrop-blur">{String(active + 1).padStart(2, '0')} / {String(items.length).padStart(2, '0')}</div>
      </div>
      <div className="divide-y divide-fg/10 border-y border-fg/10">
        {items.map((it, i) => {
          const on = i === active;
          return (
            <div key={i} className="relative">
              <button type="button" onClick={() => { setActive(i); setAuto(false); }} className="flex w-full items-center gap-4 py-6 text-left">
                <span className={cn('font-mono text-sm transition', on ? 'text-primary' : 'text-fg/35')}>{String(i + 1).padStart(2, '0')}</span>
                <span className={cn('flex-1 font-heading text-xl font-bold transition sm:text-2xl', on ? 'text-fg' : 'text-fg/55 hover:text-fg')}>{it.title}</span>
                <ChevronDown className={cn('h-5 w-5 text-fg/40 transition-transform duration-300', on && 'rotate-180 text-primary')} />
              </button>
              <div className={cn('grid transition-all duration-500', on ? 'grid-rows-[1fr] opacity-100' : 'grid-rows-[0fr] opacity-0')}>
                <p className="overflow-hidden pb-6 pl-9 leading-relaxed text-fg/60">{it.text}</p>
              </div>
              {on && auto && (
                <span key={active} onAnimationEnd={() => setActive((a) => (a + 1) % items.length)} className="absolute bottom-0 left-0 h-0.5 bg-primary" style={{ animation: 'slide-progress 5s linear forwards' }} />
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Video lightbox: a poster with a pulsing play button that opens a modal.
 * ---------------------------------------------------------------------- */
export function VideoLightbox({ poster, videoUrl, title, duration, className }) {
  const [open, setOpen] = useState(false);
  useEffect(() => {
    if (!open) return undefined;
    const onKey = (e) => e.key === 'Escape' && setOpen(false);
    document.addEventListener('keydown', onKey);
    document.body.style.overflow = 'hidden';
    return () => { document.removeEventListener('keydown', onKey); document.body.style.overflow = ''; };
  }, [open]);
  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn('group relative block w-full overflow-hidden rounded-theme-lg border border-fg/10 bg-black text-left shadow-2xl', className)}>
        {poster && <img src={poster} alt="" className="absolute inset-0 h-full w-full object-cover opacity-90 transition duration-700 group-hover:scale-105 group-hover:opacity-70" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/10 to-transparent" />
        <span className="absolute left-1/2 top-1/2 grid -translate-x-1/2 -translate-y-1/2 place-items-center">
          <span className="absolute h-24 w-24 animate-ping rounded-full bg-white/25" />
          <span className="absolute h-32 w-32 rounded-full border border-white/30 transition duration-500 group-hover:scale-125 group-hover:opacity-0" />
          <span className="relative grid h-20 w-20 place-items-center rounded-full bg-white text-gray-900 shadow-2xl transition group-hover:scale-110"><Play className="ml-1 h-8 w-8 fill-current" /></span>
        </span>
        {(title || duration) && (
          <span className="absolute inset-x-0 bottom-0 flex items-end justify-between gap-4 p-5 text-white sm:p-7">
            {title && <span className="font-heading text-lg font-bold sm:text-2xl">{title}</span>}
            {duration && <span className="rounded-full bg-white/15 px-3 py-1 font-mono text-xs backdrop-blur">{duration}</span>}
          </span>
        )}
      </button>
      {open && (
        <div className="fixed inset-0 z-[100] grid place-items-center bg-black/90 p-4 backdrop-blur-sm animate-fade-in" onClick={() => setOpen(false)}>
          <button type="button" aria-label="Close" className="absolute right-5 top-5 grid h-11 w-11 place-items-center rounded-full bg-white/10 text-white transition hover:bg-white/20"><X className="h-5 w-5" /></button>
          <div className="w-full max-w-5xl animate-fade-up" onClick={(e) => e.stopPropagation()}>
            <VideoPlayer url={videoUrl} poster={poster} title={title} autoPlay className="aspect-video w-full overflow-hidden rounded-theme-lg" />
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------------------------------------------------
 * Card carousel: scroll-snap track, arrows, drag to scroll, progress bar.
 * ---------------------------------------------------------------------- */
const CARD_W = { sm: 'w-[220px] sm:w-[240px]', md: 'w-[260px] sm:w-[300px]', lg: 'w-[300px] sm:w-[400px]' };

export function CardCarousel({ d }) {
  const track = useRef();
  const drag = useRef(null);
  const [progress, setProgress] = useState(0);
  const [edges, setEdges] = useState([true, false]);
  const onScroll = () => {
    const el = track.current;
    const max = el.scrollWidth - el.clientWidth;
    setProgress(max > 0 ? el.scrollLeft / max : 1);
    setEdges([el.scrollLeft < 4, el.scrollLeft > max - 4]);
  };
  useEffect(() => { onScroll(); }, [d.items?.length]);
  const by = (dir) => track.current.scrollBy({ left: dir * track.current.clientWidth * 0.8, behavior: 'smooth' });
  const style = d.cardStyle || 'overlay';

  return (
    <div>
      <div className="mb-8 flex flex-wrap items-end justify-between gap-6">
        <div className="max-w-2xl">
          {d.eyebrow && <span className="eyebrow mb-4">{d.eyebrow}</span>}
          {d.title && <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{d.title}</h2>}
          {d.subtitle && <p className="mt-3 text-lg text-fg/60">{d.subtitle}</p>}
        </div>
        <div className="flex gap-2">
          {[[-1, ArrowLeft, edges[0]], [1, ArrowRight, edges[1]]].map(([dir, Icon, off]) => (
            <button key={dir} type="button" disabled={off} onClick={() => by(dir)} aria-label={dir < 0 ? 'Previous' : 'Next'} className="grid h-12 w-12 place-items-center rounded-full border border-fg/15 text-fg transition hover:border-primary hover:bg-primary hover:text-white disabled:pointer-events-none disabled:opacity-30">
              <Icon className="h-5 w-5" />
            </button>
          ))}
        </div>
      </div>
      <div
        ref={track}
        onScroll={onScroll}
        onPointerDown={(e) => { if (e.pointerType === 'mouse') drag.current = { x: e.clientX, left: track.current.scrollLeft, moved: false }; }}
        onPointerMove={(e) => { if (!drag.current) return; const dx = e.clientX - drag.current.x; if (Math.abs(dx) > 4) drag.current.moved = true; track.current.scrollLeft = drag.current.left - dx; }}
        onPointerUp={() => { setTimeout(() => { drag.current = null; }, 0); }}
        onPointerLeave={() => { drag.current = null; }}
        onClickCapture={(e) => { if (drag.current?.moved) { e.preventDefault(); e.stopPropagation(); } }}
        className="-mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto scroll-smooth px-5 pb-2 [scrollbar-width:none] sm:-mx-8 sm:px-8 [&::-webkit-scrollbar]:hidden"
      >
        {(d.items || []).map((it, i) => {
          const inner = style === 'stacked' ? (
            <>
              <div className="aspect-[4/3] overflow-hidden rounded-theme-lg bg-surface">{it.image && <img src={it.image} alt="" draggable={false} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}</div>
              <div className="pt-4">
                {it.tag && <div className="text-xs font-bold uppercase tracking-wider text-primary">{it.tag}</div>}
                <h3 className="mt-1 flex items-start justify-between gap-2 font-heading text-lg font-bold text-fg">{it.title}<ArrowUpRight className="h-5 w-5 shrink-0 text-fg/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-primary" /></h3>
                {it.text && <p className="mt-1 line-clamp-2 text-sm text-fg/60">{it.text}</p>}
              </div>
            </>
          ) : (
            <div className="relative aspect-[4/5] overflow-hidden rounded-theme-lg bg-surface">
              {it.image && <img src={it.image} alt="" draggable={false} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />}
              {style === 'glass' ? (
                <div className="absolute inset-x-3 bottom-3 rounded-theme border border-white/20 bg-white/15 p-4 text-white backdrop-blur-xl transition duration-500 group-hover:bg-white/25">
                  {it.tag && <div className="text-[11px] font-bold uppercase tracking-wider text-white/75">{it.tag}</div>}
                  <h3 className="font-heading text-lg font-bold">{it.title}</h3>
                  {it.text && <p className="mt-1 line-clamp-2 text-sm text-white/80">{it.text}</p>}
                </div>
              ) : (
                <>
                  <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/20 to-transparent" />
                  <div className="absolute inset-x-0 bottom-0 p-5 text-white">
                    {it.tag && <span className="mb-2 inline-block rounded-full bg-primary px-2.5 py-0.5 text-[11px] font-bold uppercase tracking-wider">{it.tag}</span>}
                    <h3 className="font-heading text-xl font-bold leading-tight">{it.title}</h3>
                    {it.text && <p className="mt-2 line-clamp-2 max-h-0 text-sm text-white/75 opacity-0 transition-all duration-500 group-hover:max-h-20 group-hover:opacity-100">{it.text}</p>}
                  </div>
                </>
              )}
            </div>
          );
          return it.url ? (
            <Link key={i} href={it.url} draggable={false} className={cn('group shrink-0 snap-start', CARD_W[d.size || 'md'])}>{inner}</Link>
          ) : (
            <div key={i} className={cn('group shrink-0 snap-start', CARD_W[d.size || 'md'])}>{inner}</div>
          );
        })}
      </div>
      <div className="mt-6 h-0.5 overflow-hidden rounded-full bg-fg/10"><div className="h-full rounded-full bg-primary transition-[width] duration-200" style={{ width: `${Math.max(8, progress * 100)}%` }} /></div>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Careers: department filter chips + expandable openings.
 * ---------------------------------------------------------------------- */
export function JobBoard({ d }) {
  const items = d.items || [];
  const departments = useMemo(() => [...new Set(items.map((j) => j.department).filter(Boolean))], [items]);
  const [dept, setDept] = useState('');
  const [open, setOpen] = useState(-1);
  const shown = items.map((j, i) => [j, i]).filter(([j]) => !dept || j.department === dept);

  return (
    <div className="mx-auto max-w-4xl">
      {departments.length > 1 && (
        <div className="mb-8 flex flex-wrap justify-center gap-2">
          {[['', 'All', items.length], ...departments.map((x) => [x, x, items.filter((j) => j.department === x).length])].map(([value, label, n]) => (
            <button key={label} type="button" onClick={() => { setDept(value); setOpen(-1); }} className={cn('rounded-full border px-4 py-2 text-sm font-semibold transition', dept === value ? 'border-primary bg-primary text-white' : 'border-fg/15 text-fg/70 hover:border-primary hover:text-primary')}>
              {label}<span className={cn('ml-2 rounded-full px-1.5 text-xs', dept === value ? 'bg-white/20' : 'bg-fg/10')}>{n}</span>
            </button>
          ))}
        </div>
      )}
      <div className="space-y-3">
        {shown.map(([j, i]) => {
          const on = open === i;
          const apply = j.url || (d.applyEmail ? `mailto:${d.applyEmail}?subject=${encodeURIComponent(`Application: ${j.title}`)}` : '#');
          return (
            <div key={i} className={cn('overflow-hidden rounded-theme-lg border bg-bg transition', on ? 'border-primary/40 shadow-xl' : 'border-fg/10 hover:border-fg/25')}>
              <button type="button" onClick={() => setOpen(on ? -1 : i)} className="flex w-full flex-wrap items-center gap-x-6 gap-y-2 p-5 text-left sm:p-6">
                <div className="min-w-0 flex-1">
                  <h3 className="font-heading text-lg font-bold text-fg sm:text-xl">{j.title}</h3>
                  <div className="mt-1.5 flex flex-wrap gap-2 text-xs font-medium text-fg/55">
                    {j.department && <span className="rounded-full bg-primary/10 px-2.5 py-1 text-primary">{j.department}</span>}
                    {j.location && <span className="flex items-center gap-1 rounded-full bg-fg/5 px-2.5 py-1"><MapPin className="h-3 w-3" />{j.location}</span>}
                    {j.type && <span className="rounded-full bg-fg/5 px-2.5 py-1">{j.type}</span>}
                  </div>
                </div>
                <span className={cn('grid h-10 w-10 place-items-center rounded-full border border-fg/15 transition', on ? 'rotate-180 border-primary bg-primary text-white' : 'text-fg/60')}><ChevronDown className="h-4 w-4" /></span>
              </button>
              <div className={cn('grid transition-all duration-500', on ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]')}>
                <div className="overflow-hidden">
                  <div className="flex flex-col gap-5 border-t border-fg/10 p-5 sm:flex-row sm:items-end sm:justify-between sm:p-6">
                    <p className="max-w-2xl whitespace-pre-line leading-relaxed text-fg/65">{j.description}</p>
                    <a href={apply} className="btn-site-primary shrink-0">Apply now<ArrowUpRight className="h-4 w-4" /></a>
                  </div>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Countdown: ticks every second; digits roll when they change.
 * ---------------------------------------------------------------------- */
const UNITS = [['days', 86400], ['hours', 3600], ['minutes', 60], ['seconds', 1]];

export function Countdown({ date, variant = 'cards', expiredText }) {
  const target = useMemo(() => new Date(date).getTime(), [date]);
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(Date.now());
    const t = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(t);
  }, []);
  if (Number.isNaN(target)) return <p className="text-fg/50">Set a valid date (YYYY-MM-DDTHH:MM).</p>;
  let left = now == null ? null : Math.max(0, Math.floor((target - now) / 1000));
  if (left === 0) return <div className="font-heading text-4xl font-extrabold text-primary sm:text-5xl">{expiredText || 'It’s live!'}</div>;
  const parts = UNITS.map(([label, s]) => {
    if (left == null) return [label, '--'];
    const v = Math.floor(left / s);
    left -= v * s;
    return [label, String(v).padStart(2, '0')];
  });
  const minimal = variant === 'minimal';
  return (
    <div className={cn('flex flex-wrap justify-center', minimal ? 'gap-2 sm:gap-6' : 'gap-3 sm:gap-5')}>
      {parts.map(([label, v], i) => (
        <div key={label} className="flex items-center gap-2 sm:gap-6">
          <div className={cn('text-center', !minimal && 'min-w-[76px] rounded-theme-lg border border-white/15 bg-white/10 px-3 py-4 shadow-xl backdrop-blur-xl sm:min-w-[120px] sm:px-5 sm:py-6', !minimal && variant !== 'image' && 'border-fg/10 bg-surface')}>
            <div key={v} className={cn('font-heading font-extrabold tabular-nums leading-none animate-fade-up', minimal ? 'text-6xl text-fg sm:text-8xl' : 'text-4xl sm:text-6xl')}>{v}</div>
            <div className={cn('mt-2 text-[11px] font-semibold uppercase tracking-[0.25em]', minimal ? 'text-primary' : 'opacity-60')}>{label}</div>
          </div>
          {minimal && i < parts.length - 1 && <span className="pb-6 font-heading text-4xl text-fg/20 sm:text-7xl">:</span>}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------------
 * Vertical steps: the line fills as the section scrolls through the viewport.
 * ---------------------------------------------------------------------- */
export function ScrollSteps({ items = [] }) {
  const ref = useRef();
  const [fill, setFill] = useState(0);
  useEffect(() => {
    const onScroll = () => {
      const r = ref.current?.getBoundingClientRect();
      if (!r) return;
      const vh = window.innerHeight;
      setFill(Math.min(1, Math.max(0, (vh * 0.6 - r.top) / r.height)));
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <div ref={ref} className="relative mx-auto max-w-4xl">
      <div className="absolute bottom-0 left-6 top-0 w-0.5 bg-fg/10 md:left-1/2 md:-translate-x-1/2">
        <div className="w-full bg-gradient-to-b from-primary to-accent transition-[height] duration-150" style={{ height: `${fill * 100}%` }} />
      </div>
      <div className="space-y-12">
        {items.map((it, i) => {
          const Icon = ICONS[it.icon] || ICONS.Star;
          const reached = fill * items.length > i + 0.2;
          return (
            <div key={i} className={cn('relative grid gap-6 pl-20 md:grid-cols-2 md:pl-0', i % 2 && 'md:[&>div:first-of-type]:col-start-2')}>
              <span className={cn('absolute left-6 top-1 grid h-12 w-12 -translate-x-1/2 place-items-center rounded-full border-4 border-bg transition duration-500 md:left-1/2', reached ? 'scale-110 bg-primary text-white shadow-glow' : 'bg-surface text-fg/40')}><Icon className="h-5 w-5" /></span>
              <div className={cn('rounded-theme-lg border border-fg/10 bg-bg p-6 shadow-sm transition duration-500', i % 2 ? 'md:ml-12' : 'md:mr-12 md:text-right', reached ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-40')}>
                <div className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Step {String(i + 1).padStart(2, '0')}</div>
                <h3 className="mt-2 font-heading text-xl font-bold text-fg">{it.title}</h3>
                {it.text && <p className="mt-2 leading-relaxed text-fg/60">{it.text}</p>}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
