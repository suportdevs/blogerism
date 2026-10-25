'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { ArrowUpRight, Github, Star } from 'lucide-react';
import { cn } from '@/lib/utils';

/* Interactive pieces of the "Loop" portfolio blocks (see LoopBlocks.js). */

const reducedMotion = () => typeof window !== 'undefined' && window.matchMedia?.('(prefers-reduced-motion: reduce)').matches;
const ringMask = { WebkitMask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))', mask: 'radial-gradient(farthest-side, transparent calc(100% - 2px), #000 calc(100% - 1.5px))' };
const conic = { background: 'conic-gradient(from 0deg, transparent 0deg, rgb(var(--c-primary)) 110deg, rgb(var(--c-accent)) 200deg, transparent 260deg)' };

// Words placed around a glowing ring; the active step moves clockwise forever, with an orbiting dot and a progress arc.
export function LoopRing({ steps = [], center, caption, photo }) {
  const n = steps.length || 1;
  const [step, setStep] = useState(0);
  useEffect(() => {
    if (steps.length < 2 || reducedMotion()) return undefined;
    const t = setInterval(() => setStep((s) => s + 1), 1900);
    return () => clearInterval(t);
  }, [steps.length]);
  const active = step % n;
  const C = 2 * Math.PI * 46;
  return (
    <div className="relative mx-auto aspect-square w-full max-w-[440px]">
      <div aria-hidden className="absolute inset-[10%] rounded-full bg-primary/30 blur-[70px]" />
      <div aria-hidden className="absolute inset-[4%] animate-[spin_14s_linear_infinite] rounded-full blur-md" style={{ ...conic, ...ringMask }} />
      <div aria-hidden className="absolute inset-[4%] animate-[spin_14s_linear_infinite] rounded-full" style={{ ...conic, ...ringMask }} />
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden>
        <defs>
          <linearGradient id="loop-arc" x1="0" y1="0" x2="1" y2="1">
            <stop offset="0%" style={{ stopColor: 'rgb(var(--c-primary))' }} />
            <stop offset="100%" style={{ stopColor: 'rgb(var(--c-accent))' }} />
          </linearGradient>
        </defs>
        <circle cx="50" cy="50" r="46" fill="none" className="stroke-fg/10" strokeWidth="0.35" strokeDasharray="0.5 1.5" />
        <circle cx="50" cy="50" r="46" fill="none" stroke="url(#loop-arc)" className="transition-[stroke-dashoffset] duration-700 ease-out" strokeWidth="1" strokeLinecap="round"
          strokeDasharray={C} strokeDashoffset={C - (C * (active + 1)) / n} />
        <circle cx="50" cy="50" r="38" fill="none" className="stroke-fg/[.07]" strokeWidth="0.3" />
      </svg>
      <div aria-hidden className="absolute inset-0 transition-transform duration-700 ease-out" style={{ transform: `rotate(${(step * 360) / n}deg)` }}>
        <span className="absolute left-1/2 top-[4%] h-3.5 w-3.5 -translate-x-1/2 -translate-y-1/2 rounded-full bg-accent shadow-[0_0_0_6px_rgb(var(--c-accent)/0.18),0_0_30px_6px_rgb(var(--c-accent)/0.6)]" />
      </div>
      <div className="absolute inset-[19%] rounded-full bg-gradient-to-br from-primary/70 via-fg/10 to-accent/70 p-px shadow-[0_30px_80px_-30px_rgb(var(--c-primary)/0.8)]">
        <div className="relative grid h-full w-full place-items-center overflow-hidden rounded-full bg-surface/90 text-center backdrop-blur-xl">
          <div aria-hidden className="absolute -left-1/4 -top-1/4 h-3/4 w-3/4 rounded-full bg-primary/25 blur-2xl" />
          <div aria-hidden className="absolute -bottom-1/4 -right-1/4 h-2/3 w-2/3 rounded-full bg-accent/15 blur-2xl" />
          {photo ? <img src={photo} alt={center || ''} className="relative h-full w-full object-cover" /> : (
            <div className="relative">
              <div className="bg-gradient-to-br from-fg via-fg to-primary bg-clip-text font-heading text-[clamp(2.8rem,7vw,4.4rem)] font-bold leading-none tracking-tighter text-transparent">{center}</div>
              {caption && <div className="mt-3 rounded-full border border-fg/10 bg-bg/60 px-3 py-1 font-mono text-[11px] text-fg/60">{caption}</div>}
            </div>
          )}
        </div>
      </div>
      <ol>
        {steps.map((s, i) => {
          const a = (i / n) * 2 * Math.PI - Math.PI / 2;
          return (
            <li key={i} className="absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${(50 + 46 * Math.cos(a)).toFixed(3)}%`, top: `${(50 + 46 * Math.sin(a)).toFixed(3)}%` }}>
              <span className={cn('flex items-center gap-1.5 whitespace-nowrap rounded-full border px-3.5 py-1.5 font-mono text-xs font-semibold backdrop-blur-md transition duration-500 sm:text-[13px]',
                i === active ? 'scale-110 border-accent bg-accent text-[#0b0b0e] shadow-[0_0_34px_-4px_rgb(var(--c-accent)/0.75)]' : 'border-fg/15 bg-bg/70 text-fg/65')}>
                <span className="opacity-50">{String(i + 1).padStart(2, '0')}</span>{s}
              </span>
            </li>
          );
        })}
      </ol>
    </div>
  );
}

// Fixed "line number" index on the left edge: highlights the section in view, with a scroll progress line.
export function LoopRail({ items = [] }) {
  const [active, setActive] = useState('');
  const [progress, setProgress] = useState(0);
  useEffect(() => {
    const els = items.map((it) => document.getElementById(it.anchor)).filter(Boolean);
    const io = new IntersectionObserver((entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)), { rootMargin: '-45% 0px -50% 0px' });
    els.forEach((el) => io.observe(el));
    const onScroll = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      setProgress(max > 0 ? Math.min(1, window.scrollY / max) : 0);
    };
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => { io.disconnect(); window.removeEventListener('scroll', onScroll); };
  }, [items]);
  if (!items.length) return null;
  return (
    <nav aria-label="Sections" className="fixed left-6 top-1/2 z-30 hidden -translate-y-1/2 rounded-full border border-fg/10 bg-bg/60 px-3 py-4 backdrop-blur-xl 2xl:flex">
      <div className="relative mr-3 w-[2px] overflow-hidden rounded-full bg-fg/10"><span className="absolute inset-x-0 top-0 bg-gradient-to-b from-primary to-accent transition-[height] duration-150" style={{ height: `${progress * 100}%` }} /></div>
      <ul className="space-y-3">
        {items.map((it, i) => (
          <li key={it.anchor}>
            <a href={`#${it.anchor}`} className={cn('group flex items-center gap-2 font-mono text-[11px] transition', active === it.anchor ? 'text-fg' : 'text-fg/35 hover:text-fg/70')}>
              <span className={cn('tabular-nums', active === it.anchor && 'text-accent')}>{String(i).padStart(2, '0')}</span>
              <span className={cn('overflow-hidden whitespace-nowrap transition-all duration-300', active === it.anchor ? 'max-w-[120px] opacity-100' : 'max-w-0 opacity-0 group-hover:max-w-[120px] group-hover:opacity-100')}>{it.label}</span>
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

function Tabs({ options, active, onChange, label, counts }) {
  return (
    <div className="mb-10 flex justify-start">
      <div className="inline-flex max-w-full flex-wrap gap-1 rounded-2xl border border-fg/10 bg-surface/70 p-1.5 font-mono text-[13px] backdrop-blur" role="tablist" aria-label={label}>
        {options.map((o) => (
          <button key={o} type="button" role="tab" aria-selected={active === o} onClick={() => onChange(o)}
            className={cn('rounded-xl px-4 py-2 transition duration-300', active === o ? 'bg-gradient-to-r from-primary to-[#a855f7] text-white shadow-[0_8px_24px_-8px_rgb(var(--c-primary)/0.9)]' : 'text-fg/60 hover:bg-fg/5 hover:text-fg')}>
            {o}{counts?.[o] != null && <span className="ml-1.5 opacity-60">{counts[o]}</span>}
          </button>
        ))}
      </div>
    </div>
  );
}

// Card with a soft light that follows the pointer.
function Spotlight({ className, children }) {
  const ref = useRef();
  const move = (e) => {
    const r = ref.current.getBoundingClientRect();
    ref.current.style.setProperty('--x', `${e.clientX - r.left}px`);
    ref.current.style.setProperty('--y', `${e.clientY - r.top}px`);
  };
  return (
    <article ref={ref} onMouseMove={move} className={cn('group relative overflow-hidden', className)}>
      <div aria-hidden className="pointer-events-none absolute inset-0 z-10 opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--x, 50%) var(--y, 50%), rgb(var(--c-primary) / 0.16), transparent 45%)' }} />
      {children}
    </article>
  );
}

/* ------------------------------ Projects ------------------------------ */

function Links({ p, labels }) {
  return (
    <div className="relative z-20 mt-auto flex items-center gap-2 pt-6">
      {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1.5 rounded-full bg-fg px-4 py-2 text-sm font-semibold text-bg transition hover:bg-accent hover:text-[#0b0b0e]">{labels.view}<ArrowUpRight className="h-4 w-4" /></a>}
      {p.code && <a href={p.code} target="_blank" rel="noreferrer" aria-label={labels.code} title={labels.code} className="grid h-9 w-9 place-items-center rounded-full border border-fg/15 text-fg/70 transition hover:border-fg hover:text-fg"><Github className="h-4 w-4" /></a>}
    </div>
  );
}

const Stack = ({ items = [] }) => items.length > 0 && (
  <div className="flex flex-wrap gap-1.5">{items.map((t) => <span key={t} className="rounded-full border border-fg/10 bg-fg/[.04] px-2.5 py-0.5 font-mono text-[11px] text-fg/65">{t}</span>)}</div>
);

function Shot({ p, className, n }) {
  return (
    <div className={cn('relative overflow-hidden bg-fg/5', className)}>
      {p.image
        ? <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-[900ms] ease-out group-hover:scale-[1.06]" />
        : <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/30 to-accent/20 font-heading text-6xl font-bold text-fg/20">{p.title?.[0]}</div>}
      <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-surface via-surface/10 to-transparent" />
      {n != null && <span className="absolute left-4 top-4 rounded-full border border-white/20 bg-black/40 px-2.5 py-1 font-mono text-[11px] text-white backdrop-blur">#{String(n).padStart(2, '0')}</span>}
      {p.live && <span aria-hidden className="absolute right-4 top-4 grid h-10 w-10 translate-y-2 place-items-center rounded-full bg-accent text-[#0b0b0e] opacity-0 transition duration-300 group-hover:translate-y-0 group-hover:opacity-100"><ArrowUpRight className="h-5 w-5" /></span>}
    </div>
  );
}

function FeaturedCard({ p, labels }) {
  return (
    <div className="mb-6 rounded-[calc(var(--radius)*1.6)] bg-gradient-to-br from-primary via-fg/10 to-accent p-px shadow-[0_40px_100px_-40px_rgb(var(--c-primary)/0.7)]">
      <Spotlight className="grid rounded-[calc(var(--radius)*1.6-1px)] bg-surface lg:grid-cols-[1.4fr_1fr]">
        <Shot p={p} className="aspect-[16/10] lg:aspect-auto lg:min-h-[420px]" />
        <div className="relative flex flex-col p-7 sm:p-10">
          <div aria-hidden className="pointer-events-none absolute -right-20 -top-20 h-64 w-64 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative flex flex-wrap items-center gap-2 font-mono text-xs text-fg/55">
            <span className="inline-flex items-center gap-1 rounded-full bg-accent px-2.5 py-1 font-semibold text-[#0b0b0e] shadow-[0_0_24px_-4px_rgb(var(--c-accent)/0.7)]"><Star className="h-3 w-3 fill-current" />{labels.featured}</span>
            {p.category}{p.year && <> · {p.year}</>}
          </div>
          <h3 className="relative mt-6 font-heading text-3xl font-bold tracking-tight text-fg sm:text-[2.6rem] sm:leading-[1.05]">{p.title}</h3>
          {p.summary && <p className="relative mt-4 text-lg leading-relaxed text-fg/60">{p.summary}</p>}
          <div className="relative mt-6"><Stack items={p.stack} /></div>
          <Links p={p} labels={labels} />
        </div>
      </Spotlight>
    </div>
  );
}

function ProjectCard({ p, n, labels }) {
  return (
    <Spotlight className="flex flex-col rounded-[calc(var(--radius)*1.3)] border border-fg/10 bg-surface transition duration-500 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-[0_30px_70px_-30px_rgb(var(--c-primary)/0.6)]">
      <Shot p={p} n={n} className="aspect-[16/10]" />
      <div className="relative flex flex-1 flex-col p-6">
        <div className="font-mono text-[11px] uppercase tracking-wider text-primary">{p.category}{p.year && <span className="text-fg/40"> · {p.year}</span>}</div>
        <h3 className="mt-2 font-heading text-xl font-bold tracking-tight text-fg sm:text-2xl">{p.title}</h3>
        {p.summary && <p className="mt-2 text-[15px] leading-relaxed text-fg/60">{p.summary}</p>}
        <div className="mt-4"><Stack items={p.stack} /></div>
        <Links p={p} labels={labels} />
      </div>
    </Spotlight>
  );
}

export function LoopProjectGrid({ items = [], labels }) {
  const all = labels.all || 'All';
  const categories = useMemo(() => [all, ...new Set(items.map((p) => p.category).filter(Boolean))], [items, all]);
  const counts = useMemo(() => Object.fromEntries(categories.map((c) => [c, c === all ? items.length : items.filter((p) => p.category === c).length])), [categories, items, all]);
  const [active, setActive] = useState(all);
  const shown = items.filter((p) => active === all || p.category === active);
  const featured = active === all ? shown.find((p) => p.featured) : null;
  const rest = shown.filter((p) => p !== featured);
  return (
    <>
      {categories.length > 2 && <Tabs options={categories} active={active} onChange={setActive} label="Filter projects" counts={counts} />}
      {featured && <FeaturedCard p={featured} labels={labels} />}
      <div key={active} className="grid animate-fade-up gap-6 md:grid-cols-2 lg:grid-cols-3">
        {rest.map((p) => <ProjectCard key={p.title} p={p} n={items.indexOf(p) + 1} labels={labels} />)}
      </div>
    </>
  );
}

/* ------------------------------ Skills ------------------------------ */

const SEGMENTS = 20;
// Segment colour runs from the primary colour to the accent along the bar.
const segColor = (i) => `color-mix(in srgb, rgb(var(--c-accent)) ${Math.round((i / (SEGMENTS - 1)) * 100)}%, rgb(var(--c-primary)))`;

function Meter({ skill, on, delay }) {
  const level = Math.max(0, Math.min(100, Number(skill.level) || 0));
  const filled = Math.round((level / 100) * SEGMENTS);
  return (
    <li className="group">
      <div className="flex items-baseline justify-between gap-3">
        <span className="font-medium text-fg">{skill.label}</span>
        <span className="font-mono text-xs tabular-nums text-fg/45 transition group-hover:text-accent">{level}%</span>
      </div>
      <div className="mt-2.5 flex gap-[3px]" role="meter" aria-valuenow={level} aria-valuemin={0} aria-valuemax={100} aria-label={skill.label}>
        {Array.from({ length: SEGMENTS }, (_, i) => {
          const lit = on && i < filled;
          return (
            <span key={i} className={cn('h-3 flex-1 rounded-[3px] transition-all duration-300', !lit && 'bg-fg/[.08]')}
              style={{ transitionDelay: on ? `${delay + i * 25}ms` : '0ms', ...(lit ? { backgroundColor: segColor(i), boxShadow: i === filled - 1 ? `0 0 14px 1px ${segColor(i)}` : undefined } : {}) }} />
          );
        })}
      </div>
    </li>
  );
}

export function LoopSkillMeters({ groups = [], limit = 8, labels }) {
  const all = labels.all || 'All';
  const tabs = [all, ...groups.map((g) => g.title).filter(Boolean)];
  const [active, setActive] = useState(all);
  const [expanded, setExpanded] = useState(false);
  const [on, setOn] = useState(false);
  const ref = useRef();
  useEffect(() => {
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setOn(true); io.disconnect(); } }, { threshold: 0.2 });
    if (ref.current) io.observe(ref.current);
    return () => io.disconnect();
  }, []);
  const skills = (active === all ? groups.flatMap((g) => g.items || []) : groups.find((g) => g.title === active)?.items || []).filter((s) => s.label);
  const max = Number(limit) || skills.length;
  const shown = expanded ? skills : skills.slice(0, max);
  const change = (t) => { setActive(t); setExpanded(false); };
  return (
    <div ref={ref}>
      <Tabs options={tabs} active={active} onChange={change} label="Skill categories" />
      <div className="relative overflow-hidden rounded-[calc(var(--radius)*1.4)] border border-fg/10 bg-surface/80 p-6 backdrop-blur sm:p-8">
        <div aria-hidden className="pointer-events-none absolute -left-24 -top-24 h-64 w-64 rounded-full bg-primary/15 blur-3xl" />
        <ul key={active} className="relative grid animate-fade-up gap-x-10 gap-y-7 sm:grid-cols-2">
          {shown.map((s, i) => <Meter key={s.label} skill={s} on={on} delay={(i % max) * 60} />)}
        </ul>
        {skills.length > max && (
          <div className="relative mt-8 flex flex-wrap items-center justify-between gap-3 border-t border-dashed border-fg/15 pt-5 font-mono text-xs text-fg/50">
            <span>{labels.showing} <span className="text-fg">{shown.length}</span> / {skills.length}</span>
            <button type="button" onClick={() => setExpanded((x) => !x)} className="rounded-full border border-fg/15 px-4 py-2 text-fg/75 transition hover:border-accent hover:bg-accent hover:text-[#0b0b0e]">{expanded ? labels.less : labels.more}</button>
          </div>
        )}
      </div>
    </div>
  );
}
