import Link from 'next/link';
import { ArrowRight, ArrowUp, ArrowUpRight, CheckCircle2, Download, Globe, Quote } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { CountUp } from './ShowcaseClient';
import { ContactForm } from './forms';
import { LoopProjectGrid, LoopRail, LoopRing, LoopSkillMeters } from './LoopClient';

/*
 * "Loop" blocks for a developer portfolio built around a Build → Learn → Improve → Repeat cycle: an aurora hero with
 * a glowing loop ring, floating code cards and a marquee band, a fixed section rail, numbered code-comment headings,
 * a profile.json card, filterable spotlight project cards, gradient skill meters, contact and a gradient sign-off.
 * Colours come from the theme; the accent is a highlighter behind dark text, so it stays readable in both modes.
 */

const glass = 'rounded-[calc(var(--radius)*1.4)] border border-fg/10 bg-surface/70 backdrop-blur-xl';
const sticker = 'relative inline-block -rotate-[2deg] rounded-[0.18em] bg-accent px-[0.16em] text-[#0b0b0e] shadow-[0_0_50px_-8px_rgb(var(--c-accent)/0.75)]';
const gradText = 'bg-gradient-to-r from-primary via-[#a855f7] to-accent bg-clip-text text-transparent';
// Film grain, for depth on large gradient areas.
const GRAIN = { backgroundImage: "url(\"data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='.85' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" };

// "I build *software* people use" → the starred words become a highlighter sticker.
export function Marked({ text = '' }) {
  return String(text).split(/(\*[^*]+\*)/).map((part, i) => (/^\*[^*]+\*$/.test(part) ? <span key={i} className={sticker}>{part.slice(1, -1)}</span> : part));
}

const ext = (url = '') => /^(https?:)?\/\//.test(url);
const isFile = (url = '') => /\.\w{2,5}([?#].*)?$/.test(url);

function Social({ s, className }) {
  const Icon = ICONS[s.icon] || Globe;
  return (
    <a href={s.url} target={ext(s.url) ? '_blank' : undefined} rel="noreferrer" aria-label={s.label || s.icon} title={s.label || s.icon}
      className={cn('grid h-11 w-11 place-items-center rounded-full border border-fg/15 bg-fg/[.03] text-fg/70 backdrop-blur transition hover:-translate-y-1 hover:border-accent hover:bg-accent hover:text-[#0b0b0e] hover:shadow-[0_10px_30px_-8px_rgb(var(--c-accent)/0.8)]', className)}>
      <Icon className="h-[18px] w-[18px]" />
    </a>
  );
}

// Drifting colour blobs behind the hero; kept off the bottom edge so the section's clipping never shows.
function Aurora() {
  return (
    <div aria-hidden className="pointer-events-none absolute -top-40 bottom-0 left-1/2 w-screen -translate-x-1/2 overflow-hidden">
      <div className="absolute left-[5%] top-0 h-[560px] w-[560px] animate-float rounded-full bg-primary/35 blur-[120px]" />
      <div className="absolute right-[5%] top-[18%] h-[460px] w-[460px] animate-float rounded-full bg-[#a855f7]/25 blur-[120px] [animation-delay:-2s]" />
      <div className="absolute left-[38%] top-[45%] h-[360px] w-[360px] animate-float rounded-full bg-accent/15 blur-[120px] [animation-delay:-4s]" />
      <div className="absolute inset-0 opacity-[.07] mix-blend-overlay" style={GRAIN} />
    </div>
  );
}

// Numbered section heading: a giant fading index beside a code-comment pill and the title.
export function LoopHeading({ index, file, title, subtitle, action }) {
  if (!index && !file && !title) return null;
  return (
    <div className="relative mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-16">
      {index && <span aria-hidden className="pointer-events-none absolute -top-10 right-0 select-none bg-gradient-to-b from-fg/[.14] to-transparent bg-clip-text font-heading text-[clamp(7rem,18vw,15rem)] font-bold leading-[0.8] tracking-tighter text-transparent">{index}</span>}
      <div className="relative max-w-3xl">
        {(index || file) && (
          <div className="relative inline-flex items-center gap-2 rounded-full border border-primary/30 bg-primary/10 px-3.5 py-1.5 font-mono text-xs text-primary backdrop-blur">
            <span className="h-1.5 w-1.5 rounded-full bg-accent shadow-[0_0_10px_rgb(var(--c-accent))]" />{'// '}{[index, file].filter(Boolean).join('. ')}
          </div>
        )}
        {title && <h2 className="relative mt-5 font-heading text-4xl font-bold leading-[1.05] tracking-[-0.03em] text-fg sm:text-6xl"><Marked text={title} /></h2>}
        {subtitle && <p className="relative mt-5 max-w-2xl text-lg leading-relaxed text-fg/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

/* ------------------------------ Hero ------------------------------ */

function Terminal({ lines }) {
  return (
    <div className={cn(glass, 'w-[250px] overflow-hidden bg-bg/75 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)]')}>
      <div className="flex items-center gap-1.5 border-b border-fg/10 px-3 py-2">
        {['bg-rose-400', 'bg-amber-400', 'bg-emerald-400'].map((c) => <span key={c} className={cn('h-2.5 w-2.5 rounded-full', c)} />)}
        <span className="ml-2 font-mono text-[10px] text-fg/40">zsh</span>
      </div>
      <div className="space-y-1 p-3.5 font-mono text-[11.5px] leading-relaxed">
        {lines.map((l, i) => (
          <div key={i} className={cn('truncate', i === lines.length - 1 ? 'text-accent' : 'text-fg/70')}>
            {i < lines.length - 1 ? <span className="text-primary">$ </span> : <span>✓ </span>}{l}
          </div>
        ))}
        <span className="inline-block h-3.5 w-1.5 animate-pulse bg-fg/70 align-middle" />
      </div>
    </div>
  );
}

function Marquee({ words }) {
  const row = [...words, ...words, ...words];
  return (
    <div className="relative left-1/2 mt-16 w-screen -translate-x-1/2 -rotate-[1.5deg] overflow-hidden border-y border-[#0b0b0e]/10 bg-accent py-4 text-[#0b0b0e] shadow-[0_20px_60px_-20px_rgb(var(--c-accent)/0.6)]">
      <div className="flex w-max animate-marquee">
        {[0, 1].map((k) => (
          <div key={k} aria-hidden={k === 1} className="flex shrink-0 items-center">
            {row.map((w, i) => <span key={i} className="flex items-center gap-8 pr-8 font-heading text-2xl font-bold uppercase tracking-tight sm:text-3xl">{w}<span className="text-xl">✦</span></span>)}
          </div>
        ))}
      </div>
    </div>
  );
}

function LoopHero({ d }) {
  const socials = (d.socials || []).filter((s) => s.url);
  const steps = (d.loop || []).filter(Boolean);
  const rail = (d.rail || []).filter((r) => r.anchor && r.label);
  const terminal = (d.terminal || []).filter(Boolean);
  const marquee = (d.marquee || []).filter(Boolean);
  return (
    <div className="relative">
      <LoopRail items={rail} />
      <Aurora />
      <div aria-hidden className="bg-grid pointer-events-none absolute -inset-x-24 -top-32 bottom-0 opacity-40 [mask-image:radial-gradient(ellipse_at_40%_30%,black_10%,transparent_60%)]" />
      <div className="relative grid min-h-[80vh] items-center gap-16 pt-8 lg:grid-cols-[1.2fr_1fr] lg:gap-8">
        <div>
          <div className="flex flex-wrap items-center gap-2 font-mono text-xs">
            {d.file && <span className="rounded-full border border-primary/30 bg-primary/10 px-3 py-1.5 text-primary backdrop-blur">{'// '}{d.file}</span>}
            {d.status && (
              <span className="inline-flex items-center gap-2 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-3 py-1.5 text-emerald-600 backdrop-blur dark:text-emerald-300">
                <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-70" /><span className="relative h-2 w-2 rounded-full bg-emerald-500" /></span>{d.status}
              </span>
            )}
            {d.location && <span className="rounded-full border border-fg/10 bg-fg/[.04] px-3 py-1.5 text-fg/60 backdrop-blur">📍 {d.location}</span>}
          </div>
          {d.greeting && <p className={cn('mt-9 animate-fade-up font-mono text-lg font-medium sm:text-xl', gradText)}>{d.greeting}</p>}
          <h1 className="mt-4 animate-fade-up font-heading text-[clamp(2.9rem,7vw,6.2rem)] font-bold leading-[0.98] tracking-[-0.045em] text-fg [animation-delay:.06s]"><Marked text={d.headline} /></h1>
          {d.intro && <p className="mt-8 max-w-xl animate-fade-up text-lg leading-relaxed text-fg/60 [animation-delay:.12s]">{d.intro}</p>}
          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-3 [animation-delay:.18s]">
            {d.primaryLabel && (
              <Link href={d.primaryUrl || '#'} className="group relative inline-flex items-center gap-2 overflow-hidden rounded-full bg-gradient-to-r from-primary to-[#a855f7] px-7 py-4 text-sm font-semibold text-white shadow-[0_18px_40px_-12px_rgb(var(--c-primary)/0.9)] transition hover:-translate-y-0.5 hover:shadow-[0_24px_50px_-12px_rgb(var(--c-primary)/1)]">
                <span aria-hidden className="absolute inset-0 -translate-x-full bg-gradient-to-r from-transparent via-white/30 to-transparent transition duration-700 group-hover:translate-x-full" />
                <span className="relative">{d.primaryLabel}</span><ArrowRight className="relative h-4 w-4 transition group-hover:translate-x-1" />
              </Link>
            )}
            {d.secondaryLabel && <a href={d.secondaryUrl || '#'} {...(ext(d.secondaryUrl) || isFile(d.secondaryUrl) ? { target: '_blank', rel: 'noreferrer' } : {})} className="inline-flex items-center gap-2 rounded-full border border-fg/15 bg-fg/[.04] px-7 py-4 text-sm font-semibold text-fg backdrop-blur transition hover:-translate-y-0.5 hover:border-fg/40"><Download className="h-4 w-4" />{d.secondaryLabel}</a>}
          </div>
          {socials.length > 0 && <div className="mt-8 flex animate-fade-up gap-2.5 [animation-delay:.24s]">{socials.map((s, i) => <Social key={i} s={s} />)}</div>}
        </div>
        {steps.length > 0 && (
          <div className="relative px-12 lg:px-6">
            <LoopRing steps={steps} center={d.center} caption={d.caption} photo={d.photo} />
            {terminal.length > 0 && <div className="absolute -left-2 top-[2%] hidden animate-float sm:block lg:-left-10"><Terminal lines={terminal} /></div>}
            {d.badge && (
              <div className={cn(glass, 'absolute -right-1 bottom-[4%] hidden animate-float items-center gap-3 px-4 py-3 shadow-[0_30px_60px_-20px_rgb(0_0_0/0.5)] [animation-delay:-3s] sm:flex lg:-right-6')}>
                <span className="grid h-9 w-9 place-items-center rounded-full bg-emerald-500/15 text-emerald-500"><CheckCircle2 className="h-5 w-5" /></span>
                <span className="max-w-[160px] text-sm font-semibold leading-tight text-fg">{d.badge}</span>
              </div>
            )}
          </div>
        )}
      </div>
      {marquee.length > 0 && <Marquee words={marquee} />}
      {d.scrollLabel && (
        <div className="relative mt-14 flex justify-center">
          <a href={rail[1] ? `#${rail[1].anchor}` : '#'} className="group flex flex-col items-center gap-3 font-mono text-xs text-fg/45 transition hover:text-fg">
            <span className="grid h-11 w-7 justify-center rounded-full border border-fg/20 pt-2"><span className="h-2 w-1 animate-bounce rounded-full bg-accent" /></span>
            {d.scrollLabel}
          </a>
        </div>
      )}
    </div>
  );
}

/* ------------------------------ About ------------------------------ */

// The code card is always dark, so its syntax colours are fixed.
const Str = ({ children }) => <span className="text-[#b5f05a]">&quot;{children}&quot;</span>;
const Key = ({ children }) => <span className="text-[#a99dff]">&quot;{children}&quot;</span>;

// A read-only "profile.json" card. Lines wrap on small screens; numbering follows the logical lines.
function ProfileCard({ d }) {
  const edu = (d.education || []).filter((e) => e.title);
  const interests = (d.interests || []).filter(Boolean);
  // [indent level, content]
  const lines = [[0, '{']];
  if (edu.length) {
    lines.push([1, <><Key>education</Key>: [</>]);
    edu.forEach((e, i) => {
      lines.push([2, <>{'{ '}<Key>degree</Key>: <Str>{e.title}</Str>{(e.org || e.period) && ','}</>]);
      if (e.org) lines.push([3, <><Key>at</Key>: <Str>{e.org}</Str>{e.period && ','}</>]);
      if (e.period) lines.push([3, <><Key>when</Key>: <Str>{e.period}</Str></>]);
      lines.push([2, <>{'}'}{i < edu.length - 1 && ','}</>]);
    });
    lines.push([1, <>]{(interests.length || d.currently) && ','}</>]);
  }
  if (interests.length) lines.push([1, <><Key>interests</Key>: [{interests.map((x, i) => <span key={i}><Str>{x}</Str>{i < interests.length - 1 && ', '}</span>)}]{d.currently && ','}</>]);
  if (d.currently) lines.push([1, <><Key>currently</Key>: <Str>{d.currently}</Str></>]);
  lines.push([0, '}']);
  return (
    <div className="relative h-full">
      <div aria-hidden className="absolute -inset-4 rounded-[2rem] bg-gradient-to-br from-primary/40 via-transparent to-accent/30 blur-2xl" />
      <div className="relative h-full rounded-[calc(var(--radius)*1.4)] bg-gradient-to-br from-primary/80 via-fg/10 to-accent/70 p-px">
        <div className="h-full overflow-hidden rounded-[calc(var(--radius)*1.4-1px)] bg-[#0d0d12] text-[#e9e8f2]">
          <div className="flex items-center gap-1.5 border-b border-white/10 px-4 py-3">
            {['bg-rose-400', 'bg-amber-400', 'bg-emerald-400'].map((c) => <span key={c} className={cn('h-2.5 w-2.5 rounded-full', c)} />)}
            <span className="ml-3 rounded-md bg-white/[.06] px-2.5 py-1 font-mono text-[11px] text-white/60">{d.cardFile || 'profile.json'}</span>
          </div>
          <ol className="py-5 font-mono text-[13px] leading-7">
            {lines.map(([indent, l], i) => (
              <li key={i} className="grid grid-cols-[3rem_1fr] pr-5 transition hover:bg-white/[.04]">
                <span className="select-none pr-4 text-right text-white/25">{i + 1}</span>
                <span className="min-w-0 break-words" style={{ paddingLeft: `${indent * 1.25}rem` }}>{l}</span>
              </li>
            ))}
          </ol>
        </div>
      </div>
    </div>
  );
}

function LoopAbout({ d }) {
  const paragraphs = String(d.text || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const stats = (d.stats || []).filter((s) => s.value || s.label);
  return (
    <div>
      <LoopHeading index={d.index} file={d.file} title={d.title} subtitle={d.subtitle} />
      <div className="grid gap-6 lg:grid-cols-[1.15fr_1fr]">
        <div className={cn(glass, 'relative overflow-hidden p-7 sm:p-10')}>
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/20 blur-3xl" />
          <div className="relative space-y-5 text-lg leading-relaxed text-fg/70">{paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
          {d.quote && (
            <figure className="relative mt-10 rounded-[var(--radius)] border border-fg/10 bg-bg/60 p-6">
              <Quote aria-hidden className="absolute -top-4 left-6 h-8 w-8 rounded-full bg-accent p-1.5 text-[#0b0b0e]" />
              <blockquote className="font-heading text-2xl font-semibold leading-snug tracking-tight text-fg sm:text-[1.65rem]"><Marked text={d.quote} /></blockquote>
              {d.quoteBy && <figcaption className="mt-3 font-mono text-xs text-fg/45">{'— @'}{d.quoteBy}</figcaption>}
            </figure>
          )}
        </div>
        <ProfileCard d={d} />
      </div>
      {stats.length > 0 && (
        <dl className="mt-6 grid grid-cols-2 gap-4 lg:grid-cols-4">
          {stats.map((s, i) => (
            <div key={i} className={cn(glass, 'group relative overflow-hidden p-6 transition duration-500 hover:-translate-y-1 hover:border-primary/40 sm:p-7')}>
              <div aria-hidden className="pointer-events-none absolute -bottom-16 -right-16 h-40 w-40 rounded-full bg-primary/0 blur-2xl transition duration-500 group-hover:bg-primary/30" />
              <dd className={cn('relative font-heading text-5xl font-bold tracking-tighter sm:text-6xl', gradText)}><CountUp value={s.value} /></dd>
              <dt className="relative mt-3 font-mono text-[11px] uppercase tracking-wider text-fg/50">{s.label}</dt>
            </div>
          ))}
        </dl>
      )}
    </div>
  );
}

/* ------------------------------ Projects & skills ------------------------------ */

function LoopProjects({ d }) {
  return (
    <div>
      <LoopHeading index={d.index} file={d.file} title={d.title} subtitle={d.subtitle}
        action={d.buttonLabel && d.buttonUrl ? <a href={d.buttonUrl} target={ext(d.buttonUrl) ? '_blank' : undefined} rel="noreferrer" className="inline-flex items-center gap-2 rounded-full border border-fg/15 bg-fg/[.04] px-5 py-3 text-sm font-semibold text-fg backdrop-blur transition hover:border-accent hover:bg-accent hover:text-[#0b0b0e]">{d.buttonLabel}<ArrowUpRight className="h-4 w-4" /></a> : null} />
      <LoopProjectGrid items={(d.items || []).filter((p) => p.title)} labels={{ all: d.allLabel, view: d.viewLabel || 'View project', code: d.codeLabel || 'Source code', featured: d.featuredLabel || 'Featured' }} />
    </div>
  );
}

function LoopSkills({ d }) {
  const stats = (d.stats || []).filter((s) => s.value);
  return (
    <div>
      <LoopHeading index={d.index} file={d.file} title={d.title} subtitle={d.subtitle} />
      <div className="grid gap-8 lg:grid-cols-[1fr_340px] lg:gap-10">
        <LoopSkillMeters groups={d.groups || []} limit={d.limit} labels={{ all: d.allLabel, showing: d.showingLabel || 'Showing', more: d.moreLabel || 'Show all', less: d.lessLabel || 'Show less' }} />
        {(d.quote || stats.length > 0) && (
          <aside className="space-y-4 lg:sticky lg:top-28 lg:mt-[4.6rem] lg:self-start">
            {d.quote && (
              <div className="relative -rotate-1 overflow-hidden rounded-[calc(var(--radius)*1.4)] bg-accent p-8 text-[#0b0b0e] shadow-[0_30px_70px_-25px_rgb(var(--c-accent)/0.7)] transition duration-500 hover:rotate-0">
                <Quote aria-hidden className="absolute -right-3 -top-3 h-28 w-28 rotate-12 opacity-10" />
                <div className="font-mono text-xs opacity-60">{'// note to self'}</div>
                <p className="relative mt-4 font-heading text-2xl font-bold leading-snug tracking-tight">{d.quote}</p>
              </div>
            )}
            {stats.length > 0 && (
              <dl className="grid grid-cols-2 gap-4">
                {stats.map((s, i) => (
                  <div key={i} className={cn(glass, 'p-5')}>
                    <dd className={cn('font-heading text-4xl font-bold tracking-tighter', gradText)}><CountUp value={s.value} /></dd>
                    <dt className="mt-1 text-sm text-fg/55">{s.label}</dt>
                  </div>
                ))}
              </dl>
            )}
          </aside>
        )}
      </div>
    </div>
  );
}

/* ------------------------------ Contact & sign-off ------------------------------ */

function LoopContact({ d }) {
  const cards = (d.cards || []).filter((c) => c.value);
  const subjects = (d.subjects || []).filter(Boolean);
  return (
    <div>
      <LoopHeading index={d.index} file={d.file} title={d.title} subtitle={d.subtitle} />
      <div className="relative grid gap-6 lg:grid-cols-[1fr_1.35fr]">
        <div aria-hidden className="pointer-events-none absolute -left-20 top-1/3 h-80 w-80 rounded-full bg-primary/20 blur-[100px]" />
        <ul className="relative grid content-start gap-3">
          {cards.map((c, i) => {
            const Icon = ICONS[c.icon] || Globe;
            const Tag = c.url ? 'a' : 'div';
            return (
              <li key={i}>
                <Tag {...(c.url ? { href: c.url, target: ext(c.url) ? '_blank' : undefined, rel: 'noreferrer' } : {})} className={cn(glass, 'group flex items-center gap-4 p-4 transition duration-300 hover:-translate-y-0.5 hover:border-primary/40 sm:p-5')}>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-2xl bg-gradient-to-br from-primary to-[#a855f7] text-white shadow-[0_10px_24px_-8px_rgb(var(--c-primary)/0.9)] transition group-hover:from-accent group-hover:to-accent group-hover:text-[#0b0b0e]"><Icon className="h-5 w-5" /></span>
                  <span className="min-w-0 flex-1">
                    <span className="block font-mono text-[11px] uppercase tracking-wider text-fg/45">{c.label}</span>
                    <span className="block truncate font-semibold text-fg">{c.value}</span>
                  </span>
                  {c.url && <ArrowUpRight className="h-5 w-5 shrink-0 text-fg/30 transition group-hover:-translate-y-0.5 group-hover:translate-x-0.5 group-hover:text-accent" />}
                </Tag>
              </li>
            );
          })}
          {d.note && <li className="px-1 pt-2 font-mono text-xs leading-relaxed text-fg/50">{d.note}</li>}
        </ul>
        <div className="relative rounded-[calc(var(--radius)*1.4)] bg-gradient-to-br from-primary/60 via-fg/10 to-accent/50 p-px shadow-[0_40px_90px_-40px_rgb(var(--c-primary)/0.8)] [&_form]:border-0 [&_form]:shadow-none">
          <div className="overflow-hidden rounded-[calc(var(--radius)*1.4-1px)] bg-bg">
            <ContactForm subjects={subjects} />
          </div>
        </div>
      </div>
    </div>
  );
}

function LoopOutro({ d }) {
  const triad = (d.triad || []).filter(Boolean);
  const links = (d.links || []).filter((l) => l.label && l.url);
  const socials = (d.socials || []).filter((s) => s.url);
  return (
    <div className="relative overflow-hidden rounded-[calc(var(--radius)*2.2)] bg-gradient-to-br from-primary via-[#8b5cf6] to-[#d946ef] p-8 text-white [--c-fg:255_255_255] sm:p-14 lg:p-20">
      <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-96 w-96 animate-float rounded-full bg-accent/40 blur-[100px]" />
      <div aria-hidden className="pointer-events-none absolute -bottom-32 -left-20 h-96 w-96 animate-float rounded-full bg-[#22d3ee]/30 blur-[100px] [animation-delay:-3s]" />
      <div aria-hidden className="pointer-events-none absolute inset-0 opacity-[.12] mix-blend-overlay" style={GRAIN} />
      <div aria-hidden className="bg-grid pointer-events-none absolute inset-0 opacity-20 [mask-image:radial-gradient(ellipse_at_center,black_20%,transparent_70%)]" />
      {d.eyebrow && <div className="relative inline-flex rounded-full border border-white/25 bg-white/10 px-3.5 py-1.5 font-mono text-xs backdrop-blur">{d.eyebrow}</div>}
      {d.title && <h2 className="relative mt-7 max-w-4xl font-heading text-[clamp(2.8rem,8vw,7rem)] font-bold leading-[0.95] tracking-[-0.05em]"><Marked text={d.title} /></h2>}
      {d.text && <p className="relative mt-7 max-w-xl text-lg text-white/80">{d.text}</p>}
      {triad.length > 0 && (
        <div className="relative mt-12 flex flex-wrap items-center gap-x-5 gap-y-2 font-heading text-3xl font-bold uppercase tracking-tight sm:text-5xl">
          {triad.map((t, i) => (
            <span key={i} className="flex items-center gap-5">
              {i > 0 && <span className="grid h-10 w-10 place-items-center rounded-full bg-accent font-mono text-xl text-[#0b0b0e] sm:h-12 sm:w-12">×</span>}
              <span className={i % 2 ? 'text-transparent [-webkit-text-stroke:1.5px_#fff]' : ''}>{t}</span>
            </span>
          ))}
        </div>
      )}
      <div className="relative mt-14 flex flex-wrap items-center justify-between gap-6 border-t border-white/20 pt-7">
        {links.length > 0 && <nav className="flex flex-wrap gap-x-7 gap-y-2 font-mono text-sm text-white/75">{links.map((l, i) => (isFile(l.url) || ext(l.url)
          ? <a key={i} href={l.url} target="_blank" rel="noreferrer" className="transition hover:text-white">{l.label}</a>
          : <Link key={i} href={l.url} className="transition hover:text-white">{l.label}</Link>))}</nav>}
        <div className="flex items-center gap-2.5">
          {socials.map((s, i) => <Social key={i} s={s} className="border-white/25 bg-white/10 text-white" />)}
          {d.topLabel && <a href={d.topUrl || '#'} className="ml-2 inline-flex items-center gap-1.5 rounded-full bg-white px-5 py-3 text-sm font-semibold text-[#0b0b0e] shadow-[0_14px_30px_-10px_rgb(0_0_0/0.4)] transition hover:-translate-y-0.5 hover:bg-accent"><ArrowUp className="h-4 w-4" />{d.topLabel}</a>}
        </div>
      </div>
    </div>
  );
}

export const LOOP_RENDERERS = { loopHero: LoopHero, loopAbout: LoopAbout, loopProjects: LoopProjects, loopSkills: LoopSkills, loopContact: LoopContact, loopOutro: LoopOutro };
