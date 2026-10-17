import Link from 'next/link';
import { ArrowDownRight, ArrowRight, ArrowUpRight, CheckCircle2, HandHeart, Phone, Star } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { AppointmentForm, DonationWidget, ListingGrid, RotatingWord, ScheduleTabs, SearchBar } from './BusinessClient';
import { CountUp } from './ShowcaseClient';

/* Blocks for client-ready business websites: heroes, services, listings, case studies, schedules, booking & fundraising. */

function Heading({ eyebrow, title, subtitle, left, action, className }) {
  if (!eyebrow && !title && !subtitle) return null;
  const text = (
    <div className={cn('max-w-2xl', !left && !action && 'mx-auto text-center')}>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      {title && <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">{title}</h2>}
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-fg/60">{subtitle}</p>}
    </div>
  );
  if (!action?.label) return <div className={cn('mb-12', className)}>{text}</div>;
  return (
    <div className={cn('mb-12 flex flex-col items-start justify-between gap-6 text-left md:flex-row md:items-end', className)}>
      {text}
      <Link href={action.url || '#'} className="btn-site-ghost shrink-0">{action.label}<ArrowRight className="h-4 w-4" /></Link>
    </div>
  );
}

function Buttons({ d, light }) {
  if (!d.primaryLabel && !d.secondaryLabel) return null;
  return (
    <div className="mt-9 flex flex-wrap gap-3">
      {d.primaryLabel && <Link href={d.primaryUrl || '#'} className={light ? 'btn-site bg-white text-gray-900 hover:-translate-y-0.5' : 'btn-site-primary'}>{d.primaryLabel}<ArrowRight className="h-4 w-4" /></Link>}
      {d.secondaryLabel && <Link href={d.secondaryUrl || '#'} className={light ? 'btn-site border border-white/40 text-white hover:bg-white/10' : 'btn-site-ghost'}>{d.secondaryLabel}</Link>}
    </div>
  );
}

const iconOf = (name, fallback = 'Star') => ICONS[name] || ICONS[fallback];

/* ------------------------------ Split hero ------------------------------ */
function Highlight({ text }) {
  if (!text) return null;
  return (
    <span className="relative inline-block text-primary">
      {text}
      <svg aria-hidden viewBox="0 0 200 14" preserveAspectRatio="none" className="absolute -bottom-1.5 left-0 h-3 w-full text-accent sm:-bottom-2">
        <path d="M3 10C45 3 120 1 197 6" stroke="currentColor" strokeWidth="5" fill="none" strokeLinecap="round" className="[stroke-dasharray:600] [animation:draw-line_1.6s_.4s_ease-out_both]" />
      </svg>
    </span>
  );
}

function FloatCard({ b, className, delay = 0 }) {
  if (!b) return null;
  const Icon = iconOf(b.icon);
  return (
    <div className={cn('absolute z-10 flex animate-float items-center gap-3 rounded-theme bg-bg/95 p-3.5 pr-5 shadow-2xl shadow-black/15 ring-1 ring-fg/5 backdrop-blur', className)} style={{ animationDelay: `${delay}s` }}>
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-[calc(var(--radius)*0.8)] bg-primary text-white shadow-glow"><Icon className="h-5 w-5" /></span>
      <div><div className="font-heading text-xl font-extrabold leading-none text-fg"><CountUp value={b.value} /></div><div className="mt-1 text-xs font-medium text-fg/55">{b.label}</div></div>
    </div>
  );
}

function SplitVisual({ d }) {
  const [b1, b2] = d.badges || [];
  if (d.variant === 'arch') {
    return (
      <div className="relative mx-auto w-full max-w-[520px] pb-6">
        <div className="absolute inset-x-[4%] bottom-0 top-[10%] rounded-t-full bg-gradient-to-b from-primary/25 to-accent/10" />
        <div className="absolute inset-x-[10%] bottom-6 top-[3%] translate-x-4 rounded-t-full border-2 border-primary/30" />
        {d.image && <img src={d.image} alt="" className="relative mx-auto aspect-[4/5] w-[80%] rounded-t-full object-cover shadow-2xl" />}
        <FloatCard b={b1} className="left-0 top-[22%]" />
        <FloatCard b={b2} className="bottom-[12%] right-0" delay={1.5} />
      </div>
    );
  }
  if (d.variant === 'framed') {
    return (
      <div className="relative mx-auto w-full max-w-[560px] pb-8 pr-6">
        <div className="absolute inset-0 left-8 top-8 rounded-theme-lg border-2 border-primary/50" />
        {d.image && <img src={d.image} alt="" className="relative aspect-[5/6] w-full rounded-theme-lg object-cover shadow-2xl" />}
        <FloatCard b={b1} className="-left-2 bottom-[18%] sm:-left-8" />
        <FloatCard b={b2} className="-right-0 top-[10%]" delay={1.5} />
      </div>
    );
  }
  return (
    <div className="relative mx-auto w-full max-w-[560px] pb-[12%]">
      <div aria-hidden className="absolute -left-2 -top-6 h-28 w-28 opacity-60 [background-image:radial-gradient(rgb(var(--c-primary))_1.5px,transparent_1.5px)] [background-size:14px_14px]" />
      <div aria-hidden className="absolute -right-10 top-1/4 h-64 w-64 rounded-full bg-accent/25 blur-3xl" />
      {d.image && <img src={d.image} alt="" className="relative ml-auto aspect-[4/5] w-[78%] rounded-theme-lg object-cover shadow-2xl" />}
      {d.image2 && <img src={d.image2} alt="" className="absolute bottom-0 left-0 aspect-square w-[46%] rounded-theme-lg border-[6px] border-bg object-cover shadow-2xl" />}
      <FloatCard b={b1} className="left-0 top-[14%] sm:-left-4" />
      <FloatCard b={b2} className="bottom-[22%] right-0 sm:-right-4" delay={1.5} />
    </div>
  );
}

function SplitHero({ d }) {
  const bullets = (d.bullets || []).filter(Boolean);
  const avatars = (d.avatars || []).filter(Boolean);
  return (
    <div className="grid items-center gap-16 text-left lg:grid-cols-[1.05fr_1fr] lg:gap-10">
      <div className="animate-fade-up">
        {d.eyebrow && <span className="eyebrow mb-6"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{d.eyebrow}</span>}
        <h1 className="font-heading text-4xl font-extrabold leading-[1.08] tracking-tight text-fg sm:text-5xl lg:text-[3.6rem]">{d.title} <Highlight text={d.highlight} /></h1>
        {d.subtitle && <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/65">{d.subtitle}</p>}
        {bullets.length > 0 && (
          <ul className="mt-7 grid max-w-xl gap-3 sm:grid-cols-2">
            {bullets.map((b, i) => <li key={i} className="flex items-center gap-2.5 font-medium text-fg/80"><CheckCircle2 className="h-5 w-5 shrink-0 text-primary" />{b}</li>)}
          </ul>
        )}
        <Buttons d={d} />
        {d.proof && (
          <div className="mt-10 flex items-center gap-4">
            {avatars.length > 0 && <div className="flex -space-x-3">{avatars.slice(0, 4).map((a, i) => <img key={i} src={a} alt="" className="h-11 w-11 rounded-full object-cover ring-[3px] ring-bg" />)}</div>}
            <div>
              <div className="flex gap-0.5">{[0, 1, 2, 3, 4].map((i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
              <p className="mt-0.5 text-sm font-medium text-fg/65">{d.proof}</p>
            </div>
          </div>
        )}
      </div>
      <SplitVisual d={d} />
    </div>
  );
}

/* ------------------------------ Search hero ------------------------------ */
function SearchHero({ d }) {
  const o = Math.min(90, Math.max(0, Number(d.overlay ?? 45))) / 100;
  const center = d.align !== 'left';
  const stats = (d.stats || []).filter((s) => s.value);
  return (
    <div className={cn('relative -mx-5 flex items-center overflow-hidden bg-[#111] sm:-mx-8', d.height === 'full' ? 'min-h-[100svh]' : 'min-h-[82vh]')}>
      {d.image && <img src={d.image} alt="" className="absolute inset-0 h-full w-full animate-[kenburns_24s_ease-out_both] object-cover" />}
      <div className="absolute inset-0" style={{ background: `linear-gradient(180deg, rgb(0 0 0/${o * 0.75}) 0%, rgb(0 0 0/${o * 0.35}) 45%, rgb(0 0 0/${o}) 100%)` }} />
      <div className={cn('relative mx-auto w-full max-w-container px-5 pb-16 pt-36 sm:px-8', center && 'text-center')}>
        {d.eyebrow && <span className="inline-flex animate-fade-up items-center gap-2 rounded-full border border-white/30 bg-white/10 px-4 py-1.5 text-xs font-bold uppercase tracking-[0.2em] text-white backdrop-blur">{d.eyebrow}</span>}
        <h1 className={cn('mt-6 max-w-4xl animate-fade-up font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-white [animation-delay:.1s] sm:text-6xl lg:text-7xl', center && 'mx-auto')}>{d.title}</h1>
        {d.subtitle && <p className={cn('mt-6 max-w-2xl animate-fade-up text-lg text-white/80 [animation-delay:.2s]', center && 'mx-auto')}>{d.subtitle}</p>}
        <SearchBar d={d} className={cn('mt-10 max-w-5xl animate-fade-up [animation-delay:.3s]', center && 'mx-auto')} />
        {stats.length > 0 && (
          <div className={cn('mt-12 flex flex-wrap gap-x-12 gap-y-6 text-white', center && 'justify-center')}>
            {stats.map((s, i) => (
              <div key={i} className={cn(!center && 'border-l-2 border-primary pl-4')}>
                <div className="font-heading text-3xl font-extrabold"><CountUp value={s.value} /></div>
                <div className="text-sm text-white/70">{s.label}</div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Kinetic hero ------------------------------ */
function KineticHero({ d, block }) {
  const pid = `kh-${block?.id || 'x'}`;
  const words = (d.marquee || []).filter(Boolean);
  return (
    <div className="relative text-left">
      <div aria-hidden className="pointer-events-none absolute -right-40 -top-40 h-[520px] w-[520px] rounded-full bg-primary/20 blur-[120px]" />
      {d.eyebrow && <div className="flex items-center gap-3 text-sm font-bold uppercase tracking-[0.25em] text-fg/60"><span className="h-2.5 w-2.5 animate-pulse rounded-full bg-primary" />{d.eyebrow}</div>}
      <h1 className="relative mt-6 font-heading text-[clamp(2.6rem,7vw,7.5rem)] font-extrabold uppercase leading-[0.9] tracking-[-0.045em] text-fg">
        {(d.lines || []).map((l, i) => <span key={i} className="block animate-fade-up" style={{ animationDelay: `${i * 0.08}s` }}>{l}</span>)}
        {(d.rotate || []).filter(Boolean).length > 0 && <span className="block text-primary sm:whitespace-nowrap"><RotatingWord words={d.rotate} /></span>}
      </h1>
      <div className="relative mt-12 grid items-end gap-10 md:grid-cols-[1fr_auto]">
        <div>
          {d.subtitle && <p className="max-w-xl text-lg leading-relaxed text-fg/65 sm:text-xl">{d.subtitle}</p>}
          <Buttons d={d} />
        </div>
        <Link href={d.primaryUrl || '#'} aria-label={d.primaryLabel || 'Explore'} className="group relative hidden h-44 w-44 shrink-0 md:block">
          <svg viewBox="0 0 200 200" className="absolute inset-0 h-full w-full animate-[spin_18s_linear_infinite]">
            <defs><path id={pid} d="M100,100 m-80,0 a80,80 0 1,1 160,0 a80,80 0 1,1 -160,0" /></defs>
            <text className="fill-fg text-[14.5px] font-bold uppercase tracking-[0.32em]"><textPath href={`#${pid}`}>{d.badge || 'Explore • Explore • Explore • '}</textPath></text>
          </svg>
          <span className="absolute inset-[27%] grid place-items-center overflow-hidden rounded-full bg-primary text-white transition duration-500 group-hover:scale-110">
            {d.image ? <img src={d.image} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-110 group-hover:opacity-30" /> : null}
            <ArrowDownRight className={cn('h-8 w-8 transition duration-500 group-hover:-rotate-45', d.image && 'absolute opacity-0 group-hover:opacity-100')} />
          </span>
        </Link>
      </div>
      {words.length > 0 && (
        <div className="relative -mx-5 mt-20 -rotate-2 overflow-hidden bg-primary py-5 text-white sm:-mx-8">
          <div className="flex w-max animate-[marquee_28s_linear_infinite]">
            {[0, 1].map((k) => (
              <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
                {[...words, ...words].map((w, i) => <span key={i} className="flex items-center gap-8 px-4 font-heading text-2xl font-extrabold uppercase tracking-tight sm:text-4xl">{w}<span className="text-white/60">✦</span></span>)}
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ Trust bar ------------------------------ */
const GRID = { 1: '', 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };

function TrustBar({ d }) {
  const items = d.items || [];
  if (d.variant === 'pills') {
    return (
      <div className="flex flex-wrap justify-center gap-3">
        {items.map((it, i) => {
          const Icon = iconOf(it.icon);
          return <span key={i} className="inline-flex items-center gap-2.5 rounded-full border border-fg/10 bg-bg px-5 py-3 text-sm font-semibold text-fg shadow-sm"><Icon className="h-4 w-4 text-primary" />{it.title}</span>;
        })}
      </div>
    );
  }
  const overlap = d.variant !== 'strip';
  return (
    <div className={cn('grid text-left', GRID[Math.min(items.length, 4)], overlap ? 'relative z-10 -mt-24 overflow-hidden rounded-theme-lg bg-bg shadow-2xl shadow-black/10 ring-1 ring-fg/5 sm:-mt-28' : 'gap-y-6')}>
      {items.map((it, i) => {
        const Icon = iconOf(it.icon);
        return (
          <div key={i} className={cn('group flex items-start gap-4 p-6 sm:p-7', i > 0 && 'border-t border-fg/10 sm:border-l sm:border-t-0', !overlap && 'py-2 sm:py-2')}>
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-theme bg-primary/10 text-primary transition duration-300 group-hover:-translate-y-1 group-hover:bg-primary group-hover:text-white"><Icon className="h-6 w-6" /></span>
            <div><h3 className="font-heading text-base font-bold text-fg">{it.title}</h3>{it.text && <p className="mt-1 text-sm leading-relaxed text-fg/60">{it.text}</p>}</div>
          </div>
        );
      })}
    </div>
  );
}

/* ------------------------------ Service cards ------------------------------ */
const COLS = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' };

function ServiceCards({ d }) {
  const items = d.items || [];
  const heading = <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} action={{ label: d.buttonLabel, url: d.buttonUrl }} />;

  if (d.variant === 'rows') {
    return (
      <>
        {heading}
        <div className="border-t border-fg/10 text-left">
          {items.map((it, i) => (
            <Link key={i} href={it.url || '#'} className="group grid grid-cols-[auto_1fr_auto] items-center gap-x-5 gap-y-2 border-b border-fg/10 py-7 transition-all duration-500 hover:bg-fg/[.02] md:grid-cols-[72px_1fr_1.1fr_auto] md:gap-8 md:py-9 md:hover:px-5">
              <span className="font-mono text-sm font-semibold text-primary">{String(i + 1).padStart(2, '0')}</span>
              <h3 className="font-heading text-2xl font-bold tracking-tight text-fg transition group-hover:text-primary sm:text-3xl">{it.title}</h3>
              <p className="col-span-2 col-start-2 row-start-2 text-fg/60 md:col-span-1 md:col-start-auto md:row-start-auto">{it.text}</p>
              <span className="col-start-3 row-start-1 flex items-center justify-end gap-5 md:col-start-auto md:row-start-auto">
                {it.image && <img src={it.image} alt="" className="hidden h-16 w-0 rounded-theme object-cover opacity-0 transition-all duration-500 group-hover:w-28 group-hover:opacity-100 lg:block" />}
                <span className="grid h-14 w-14 place-items-center rounded-full border border-fg/15 text-fg transition duration-500 group-hover:-rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-white"><ArrowRight className="h-5 w-5" /></span>
              </span>
            </Link>
          ))}
        </div>
      </>
    );
  }

  if (d.variant === 'icon') {
    return (
      <>
        {heading}
        <div className={cn('grid gap-5 text-left', COLS[d.columns] || COLS[3])}>
          {items.map((it, i) => {
            const Icon = iconOf(it.icon);
            return (
              <Link key={i} href={it.url || '#'} className="group relative flex flex-col overflow-hidden rounded-theme-lg border border-fg/10 bg-bg p-8 transition duration-500 hover:-translate-y-1 hover:border-primary hover:shadow-glow">
                <span className="absolute inset-0 origin-bottom scale-y-0 bg-gradient-to-br from-primary to-primary/85 transition-transform duration-500 group-hover:scale-y-100" />
                <span className="absolute right-6 top-4 font-heading text-6xl font-extrabold text-fg/[.06] transition group-hover:text-white/15">{String(i + 1).padStart(2, '0')}</span>
                <span className="relative grid h-14 w-14 place-items-center rounded-theme bg-primary/10 text-primary transition duration-500 group-hover:bg-white/15 group-hover:text-white"><Icon className="h-7 w-7" /></span>
                <h3 className="relative mt-6 font-heading text-xl font-bold text-fg transition group-hover:text-white">{it.title}</h3>
                <p className="relative mt-3 flex-1 leading-relaxed text-fg/60 transition group-hover:text-white/85">{it.text}</p>
                {it.linkLabel && <span className="relative mt-6 inline-flex items-center gap-2 text-sm font-bold text-primary transition group-hover:text-white">{it.linkLabel}<ArrowUpRight className="h-4 w-4 transition group-hover:translate-x-0.5 group-hover:-translate-y-0.5" /></span>}
              </Link>
            );
          })}
        </div>
      </>
    );
  }

  return (
    <>
      {heading}
      <div className={cn('grid gap-6 text-left', COLS[d.columns] || COLS[3])}>
        {items.map((it, i) => {
          const Icon = iconOf(it.icon);
          return (
            <Link key={i} href={it.url || '#'} className="group flex flex-col overflow-hidden rounded-theme-lg border border-fg/10 bg-bg transition duration-500 hover:-translate-y-1.5 hover:shadow-2xl hover:shadow-black/10">
              <div className="relative aspect-[4/3] overflow-hidden">
                {it.image && <img src={it.image} alt={it.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-110" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 to-transparent opacity-0 transition duration-500 group-hover:opacity-100" />
              </div>
              <div className="relative flex flex-1 flex-col p-6 pt-10">
                <span className="absolute -top-7 left-6 grid h-14 w-14 place-items-center rounded-theme bg-primary text-white shadow-glow ring-4 ring-bg transition duration-500 group-hover:-translate-y-1 group-hover:rotate-6"><Icon className="h-6 w-6" /></span>
                <h3 className="font-heading text-xl font-bold text-fg transition group-hover:text-primary">{it.title}</h3>
                <p className="mt-2 flex-1 leading-relaxed text-fg/60">{it.text}</p>
                {it.linkLabel && <span className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary">{it.linkLabel}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>}
              </div>
            </Link>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------ Listings ------------------------------ */
const Listings = ({ d }) => (
  <>
    <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} action={{ label: d.buttonLabel, url: d.buttonUrl }} />
    <ListingGrid d={d} />
  </>
);

/* ------------------------------ Case studies ------------------------------ */
function CaseBody({ c, large }) {
  return (
    <>
      {c.client && <div className="text-xs font-bold uppercase tracking-[0.25em] text-primary">{c.client}</div>}
      <h3 className={cn('mt-3 font-heading font-extrabold leading-tight tracking-tight text-fg', large ? 'text-3xl sm:text-4xl' : 'text-2xl')}>{c.title}</h3>
      {c.text && <p className="mt-4 leading-relaxed text-fg/60">{c.text}</p>}
      {(c.metrics || []).length > 0 && (
        <div className="mt-8 grid grid-cols-2 gap-6 border-t border-fg/10 pt-6">
          {c.metrics.map((m, i) => <div key={i}><div className="font-heading text-3xl font-extrabold text-fg sm:text-4xl"><CountUp value={m.value} /></div><div className="mt-1 text-sm text-fg/55">{m.label}</div></div>)}
        </div>
      )}
      <div className="mt-8 flex flex-wrap items-center gap-2">
        {(c.tags || []).filter(Boolean).map((t) => <span key={t} className="rounded-full border border-fg/15 px-3 py-1 text-xs font-semibold text-fg/70">{t}</span>)}
        {c.url && <Link href={c.url} className="ml-auto inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">View case study<ArrowUpRight className="h-4 w-4" /></Link>}
      </div>
    </>
  );
}

function CaseStudies({ d }) {
  const items = d.items || [];
  if (d.variant === 'grid') {
    return (
      <>
        <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
        <div className="grid gap-8 text-left md:grid-cols-2">
          {items.map((c, i) => (
            <article key={i} className="group overflow-hidden rounded-theme-lg border border-fg/10 bg-bg transition duration-500 hover:shadow-2xl hover:shadow-black/10">
              <div className="aspect-[16/10] overflow-hidden">{c.image && <img src={c.image} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}</div>
              <div className="p-7 sm:p-9"><CaseBody c={c} /></div>
            </article>
          ))}
        </div>
      </>
    );
  }
  return (
    <>
      <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
      <div className="text-left">
        {items.map((c, i) => (
          <div key={i} className="sticky pb-8" style={{ top: `${96 + i * 28}px` }}>
            <article className="grid overflow-hidden rounded-[calc(var(--radius)*2)] border border-fg/10 bg-surface shadow-[0_-24px_60px_-30px_rgb(0_0_0/0.35)] lg:min-h-[480px] lg:grid-cols-[1fr_1.1fr]">
              <div className="flex flex-col justify-center p-8 sm:p-12"><CaseBody c={c} large /></div>
              <div className="relative min-h-[260px] overflow-hidden">{c.image && <img src={c.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}</div>
            </article>
          </div>
        ))}
      </div>
    </>
  );
}

/* ------------------------------ Schedule ------------------------------ */
const Schedule = ({ d }) => (
  <>
    <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
    <div className="mx-auto max-w-5xl"><ScheduleTabs d={d} /></div>
  </>
);

/* ------------------------------ Donation ------------------------------ */
function Donation({ d }) {
  return (
    <div className="grid items-center gap-12 text-left lg:grid-cols-2 lg:gap-16">
      <div className="relative order-2 lg:order-1">
        {d.image && <img src={d.image} alt="" className="aspect-[4/5] w-full rounded-theme-lg object-cover shadow-2xl" />}
        <div className="absolute -bottom-6 left-6 right-6 rounded-theme-lg bg-bg/95 p-5 shadow-2xl backdrop-blur sm:left-auto sm:w-72">
          <div className="flex items-center gap-3">
            <span className="grid h-11 w-11 place-items-center rounded-full bg-primary/10 text-primary"><HandHeart className="h-5 w-5" /></span>
            <div><div className="font-heading text-xl font-extrabold text-fg"><CountUp value={`${Number(d.supporters || 0).toLocaleString('en-US')}+`} /></div><div className="text-xs text-fg/55">people gave this year</div></div>
          </div>
        </div>
      </div>
      <div className="order-1 lg:order-2">
        {d.eyebrow && <span className="eyebrow mb-4">{d.eyebrow}</span>}
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-5xl md:leading-[1.08]">{d.title}</h2>
        {d.text && <p className="mb-8 mt-4 text-lg leading-relaxed text-fg/60">{d.text}</p>}
        <DonationWidget d={d} />
      </div>
    </div>
  );
}

/* ------------------------------ Appointment ------------------------------ */
function Appointment({ d }) {
  const bullets = (d.bullets || []).filter(Boolean);
  return (
    <div className="grid items-start gap-12 text-left lg:grid-cols-[1fr_1.2fr]">
      <div className="lg:sticky lg:top-28">
        {d.eyebrow && <span className="eyebrow mb-4">{d.eyebrow}</span>}
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-5xl md:leading-[1.08]">{d.title}</h2>
        {d.text && <p className="mt-4 text-lg leading-relaxed text-fg/60">{d.text}</p>}
        {bullets.length > 0 && <ul className="mt-7 space-y-3">{bullets.map((b, i) => <li key={i} className="flex items-start gap-3 text-fg/80"><CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{b}</li>)}</ul>}
        {d.image && <img src={d.image} alt="" className="mt-8 aspect-[16/10] w-full rounded-theme-lg object-cover shadow-xl" />}
        {d.phone && (
          <a href={`tel:${d.phone.replace(/[^\d+]/g, '')}`} className="group mt-8 flex items-center gap-4 rounded-theme-lg bg-primary p-5 text-white shadow-glow">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-white/15 transition group-hover:scale-110"><Phone className="h-5 w-5" /></span>
            <span><span className="block text-xs font-semibold uppercase tracking-wider text-white/75">Prefer to call?</span><span className="font-heading text-xl font-extrabold">{d.phone}</span></span>
          </a>
        )}
      </div>
      <AppointmentForm d={d} />
    </div>
  );
}

/* ------------------------------ CTA banner ------------------------------ */
function PhoneLine({ phone }) {
  if (!phone) return null;
  return (
    <a href={`tel:${phone.replace(/[^\d+]/g, '')}`} className="mt-8 inline-flex items-center gap-3 text-white">
      <span className="grid h-12 w-12 place-items-center rounded-full bg-white/15 backdrop-blur"><Phone className="h-5 w-5" /></span>
      <span><span className="block text-xs font-semibold uppercase tracking-wider text-white/70">Call us</span><span className="font-heading text-xl font-extrabold">{phone}</span></span>
    </a>
  );
}

function CtaBanner({ d }) {
  if (d.variant === 'split') {
    return (
      <div className="grid overflow-hidden rounded-[calc(var(--radius)*2)] text-left shadow-2xl shadow-black/10 lg:grid-cols-2">
        <div className="relative bg-primary p-8 text-white sm:p-14">
          <div className="bg-grid absolute inset-0 opacity-25 [--c-fg:255_255_255] [mask-image:radial-gradient(ellipse_at_top_left,black,transparent_70%)]" />
          <div className="relative">
            {d.eyebrow && <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/75">{d.eyebrow}</div>}
            <h2 className="mt-4 font-heading text-3xl font-extrabold leading-tight tracking-tight sm:text-5xl">{d.title}</h2>
            {d.text && <p className="mt-4 max-w-lg text-lg text-white/80">{d.text}</p>}
            <Buttons d={d} light />
            <PhoneLine phone={d.phone} />
          </div>
        </div>
        <div className="relative min-h-[280px]">{d.image && <img src={d.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}</div>
      </div>
    );
  }
  return (
    <div className="relative overflow-hidden rounded-[calc(var(--radius)*2)] px-6 py-16 text-left text-white sm:px-14 sm:py-24">
      {d.image && <img src={d.image} alt="" loading="lazy" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-r from-primary via-primary/85 to-primary/10" />
      <div className="relative max-w-2xl">
        {d.eyebrow && <div className="text-xs font-bold uppercase tracking-[0.25em] text-white/80">{d.eyebrow}</div>}
        <h2 className="mt-4 font-heading text-3xl font-extrabold leading-[1.08] tracking-tight sm:text-5xl">{d.title}</h2>
        {d.text && <p className="mt-4 max-w-xl text-lg text-white/85">{d.text}</p>}
        <Buttons d={d} light />
        <PhoneLine phone={d.phone} />
      </div>
    </div>
  );
}

export const BUSINESS_RENDERERS = {
  splitHero: SplitHero,
  searchHero: SearchHero,
  kineticHero: KineticHero,
  trustBar: TrustBar,
  serviceCards: ServiceCards,
  listingCards: Listings,
  caseStudies: CaseStudies,
  schedule: Schedule,
  donation: Donation,
  appointment: Appointment,
  ctaBanner: CtaBanner,
};

// These blocks reach outside their section (sticky cards, overlap with the block above).
export const businessSectionClass = (block) => {
  if (block.type === 'caseStudies' && block.data?.variant !== 'grid') return '!overflow-visible';
  if (block.type === 'trustBar' && block.data?.variant === 'overlap') return '!overflow-visible z-10';
  return undefined;
};
