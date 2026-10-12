import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Github, Linkedin, Mail, MapPin, Sparkles } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { RoleRotator } from './PortfolioClient';

const initials = (name = '') => name.replace(/^(md\.?|mr\.?|mrs\.?|dr\.?)\s+/i, '').split(/\s+/).map((p) => p[0]).join('').slice(0, 2).toUpperCase();
const hue = (s = '') => [...s].reduce((h, c) => (h * 31 + c.charCodeAt(0)) % 360, 7);
const domain = (url = '') => url.replace(/^https?:\/\//, '').replace(/\/.*$/, '');

function Heading({ eyebrow, title, subtitle, center }) {
  return (
    <div className={cn('mb-12 max-w-2xl text-left', center && 'mx-auto text-center')}>
      {eyebrow && (
        <div className={cn('mb-3 flex items-center gap-3 font-mono text-sm font-semibold text-primary', center && 'justify-center')}>
          <span className="h-px w-8 bg-gradient-to-r from-transparent to-primary" />{eyebrow}<span className="h-px w-8 bg-gradient-to-l from-transparent to-primary" />
        </div>
      )}
      {title && <h2 className="font-heading text-3xl font-bold tracking-tight text-fg sm:text-5xl">{title}</h2>}
      {subtitle && <p className="mt-4 text-lg text-fg/60">{subtitle}</p>}
    </div>
  );
}

/* --------------------------------- Hero --------------------------------- */
function CodeCard({ d }) {
  const S = ({ children }) => <span className="text-emerald-400">{children}</span>;
  const K = ({ children }) => <span className="text-sky-300">{children}</span>;
  return (
    <div className="relative min-w-0 overflow-hidden rounded-2xl border border-white/10 bg-[#0d1117]/90 font-mono text-[13px] leading-relaxed text-slate-300 shadow-2xl backdrop-blur sm:text-sm">
      <div className="flex items-center gap-2 border-b border-white/10 px-4 py-3">
        <span className="h-3 w-3 rounded-full bg-[#ff5f57]" /><span className="h-3 w-3 rounded-full bg-[#febc2e]" /><span className="h-3 w-3 rounded-full bg-[#28c840]" />
        <span className="ml-3 text-xs text-slate-500">developer.ts</span>
      </div>
      <pre className="overflow-x-auto p-5 sm:p-6">
        <span className="text-fuchsia-400">const</span> <span className="text-amber-300">developer</span> = {'{'}{'\n'}
        {'  '}<K>name</K>: <S>&apos;{d.name}&apos;</S>,{'\n'}
        {'  '}<K>role</K>: <S>&apos;{d.roles?.[0]}&apos;</S>,{'\n'}
        {d.location && <>{'  '}<K>location</K>: <S>&apos;{d.location}&apos;</S>,{'\n'}</>}
        {'  '}<K>stack</K>: [{(d.stack || []).map((s, i) => <span key={s}><S>&apos;{s}&apos;</S>{i < d.stack.length - 1 ? ', ' : ''}</span>)}],{'\n'}
        {'  '}<K>available</K>: <span className="text-orange-300">true</span>,{'\n'}
        {'  '}<span className="text-amber-300">build</span>: () =&gt; <S>&apos;something great&apos;</S>,{'\n'}
        {'}'};
      </pre>
    </div>
  );
}

function ProfileHero({ d }) {
  const socials = [[d.github, Github, 'GitHub'], [d.linkedin, Linkedin, 'LinkedIn'], [d.email && `mailto:${d.email}`, Mail, 'Email']].filter(([u]) => u);
  return (
    <div className="relative grid items-center gap-14 py-6 text-left lg:grid-cols-[minmax(0,1.15fr)_minmax(0,1fr)]">
      {/* ambient glows */}
      <div aria-hidden className="pointer-events-none absolute -left-40 -top-40 h-[480px] w-[480px] rounded-full bg-primary/25 blur-[140px]" />
      <div aria-hidden className="pointer-events-none absolute -right-20 bottom-0 h-[380px] w-[380px] rounded-full bg-accent/20 blur-[130px]" />

      <div className="relative min-w-0">
        {d.availability && (
          <span className="mb-7 inline-flex items-center gap-2.5 rounded-full border border-emerald-500/30 bg-emerald-500/10 px-4 py-1.5 text-sm font-semibold text-emerald-500">
            <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-400 opacity-75" /><span className="relative inline-flex h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>
            {d.availability}
          </span>
        )}
        <p className="font-mono text-lg text-fg/60">{d.greeting}</p>
        <h1 className="mt-2 font-heading text-5xl font-bold leading-[1.02] tracking-tight text-fg sm:text-6xl lg:text-7xl">{d.name}</h1>
        <div className="mt-4 min-h-[1.4em] font-heading text-2xl font-semibold sm:text-3xl"><RoleRotator roles={d.roles} /></div>
        {d.intro && <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/65">{d.intro}</p>}
        <div className="mt-9 flex flex-wrap items-center gap-3">
          {d.primaryLabel && <Link href={d.primaryUrl || '#'} className="btn-site-primary !px-6 !py-3.5">{d.primaryLabel}<ArrowRight className="h-4 w-4" /></Link>}
          {d.secondaryLabel && <Link href={d.secondaryUrl || '#'} className="btn-site-ghost !px-6 !py-3.5">{d.secondaryLabel}</Link>}
        </div>
        <div className="mt-9 flex flex-wrap items-center gap-5">
          <div className="flex gap-2">
            {socials.map(([url, Icon, label]) => (
              <a key={label} href={url} target="_blank" rel="noreferrer" aria-label={label} className="grid h-11 w-11 place-items-center rounded-full border border-fg/10 text-fg/70 transition hover:-translate-y-1 hover:border-primary hover:bg-primary hover:text-white"><Icon className="h-[18px] w-[18px]" /></a>
            ))}
          </div>
          {d.location && <span className="flex items-center gap-1.5 text-sm text-fg/55"><MapPin className="h-4 w-4" />{d.location}</span>}
        </div>
      </div>

      <div className="relative mx-auto w-full min-w-0 max-w-lg">
        <div aria-hidden className="absolute -inset-6 rounded-[2.5rem] bg-gradient-to-tr from-primary/30 via-transparent to-accent/30 blur-2xl" />
        {d.image ? (
          <div className="relative mx-auto aspect-square w-4/5 rounded-full bg-gradient-to-tr from-primary to-accent p-1.5 shadow-glow">
            <img src={d.image} alt={d.name} className="h-full w-full rounded-full object-cover" />
          </div>
        ) : (
          <div className="relative">
            <div className="absolute -right-3 -top-8 z-10 grid h-20 w-20 rotate-6 place-items-center rounded-2xl bg-gradient-to-br from-primary to-accent font-heading text-2xl font-bold text-white shadow-glow animate-float">{initials(d.name)}</div>
            <CodeCard d={d} />
          </div>
        )}
        {(d.badges || []).slice(0, 3).map((b, i) => (
          <span
            key={b}
            className={cn('absolute z-10 hidden items-center gap-2 rounded-xl border border-fg/10 bg-bg/90 px-3.5 py-2 text-sm font-bold text-fg shadow-xl backdrop-blur sm:flex', ['-top-14 left-0', '-bottom-8 right-0', '-bottom-8 left-0'][i])}
            style={{ animation: `float ${5 + i}s ease-in-out ${i * 0.7}s infinite` }}
          >
            <Sparkles className="h-4 w-4 text-accent" />{b}
          </span>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- About --------------------------------- */
function AboutMe({ d }) {
  return (
    <div className="grid gap-12 text-left lg:grid-cols-[1.2fr_1fr]">
      <div>
        <Heading eyebrow={d.eyebrow} title={d.title} />
        <div className="-mt-6 space-y-4 text-lg leading-relaxed text-fg/70">{(d.text || '').split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>
        {d.buttonLabel && d.buttonUrl && <a href={d.buttonUrl} target="_blank" rel="noreferrer" className="btn-site-primary mt-8">{d.buttonLabel}<ArrowUpRight className="h-4 w-4" /></a>}
      </div>
      <div className="grid content-start gap-3 sm:grid-cols-2">
        {(d.facts || []).map((f, i) => (
          <div key={i} className="group rounded-theme border border-fg/10 bg-surface/60 p-5 transition hover:-translate-y-1 hover:border-primary/40">
            <div className="font-mono text-xs uppercase tracking-wider text-primary">{f.label}</div>
            <div className="mt-1.5 font-semibold text-fg">{f.value}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

/* --------------------------------- Skills --------------------------------- */
function Skills({ d }) {
  return (
    <>
      <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} center />
      <div className="grid gap-5 text-left md:grid-cols-2 lg:grid-cols-3">
        {(d.groups || []).map((g, i) => {
          const Icon = ICONS[g.icon] || ICONS.Code2;
          return (
            <div key={i} className="group relative overflow-hidden rounded-theme-lg border border-fg/10 bg-surface/50 p-6 transition duration-300 hover:-translate-y-1 hover:border-primary/40 hover:shadow-glow">
              <div className="absolute -right-12 -top-12 h-36 w-36 rounded-full bg-primary/10 blur-2xl transition group-hover:bg-primary/25" />
              <div className="relative mb-5 flex items-center gap-3">
                <span className="grid h-11 w-11 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white"><Icon className="h-5 w-5" /></span>
                <h3 className="font-heading text-lg font-bold text-fg">{g.title}</h3>
              </div>
              <div className="relative flex flex-wrap gap-2">
                {(g.items || []).map((s) => <span key={s} className="rounded-lg border border-fg/10 bg-bg/70 px-3 py-1.5 text-sm font-medium text-fg/80 transition hover:border-primary hover:text-primary">{s}</span>)}
              </div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* --------------------------------- Timeline --------------------------------- */
function Bullet({ text }) {
  const i = text.indexOf(':');
  if (i > 0 && i < 40) return <><b className="font-semibold text-fg">{text.slice(0, i)}:</b>{text.slice(i + 1)}</>;
  return text;
}

function Timeline({ d }) {
  return (
    <>
      <Heading eyebrow={d.eyebrow} title={d.title} />
      <ol className="relative space-y-8 text-left before:absolute before:bottom-2 before:left-[11px] before:top-2 before:w-px before:bg-gradient-to-b before:from-primary before:via-accent/50 before:to-transparent sm:before:left-[15px]">
        {(d.items || []).map((it, i) => (
          <li key={i} className="relative pl-10 sm:pl-14">
            <span className="absolute left-0 top-6 grid h-6 w-6 place-items-center rounded-full border-2 border-primary bg-bg sm:h-8 sm:w-8">
              <span className="h-2 w-2 rounded-full bg-gradient-to-br from-primary to-accent sm:h-3 sm:w-3" />
            </span>
            <div className="rounded-theme-lg border border-fg/10 bg-surface/50 p-6 transition hover:border-primary/30 sm:p-8">
              <div className="flex flex-wrap items-start justify-between gap-3">
                <div>
                  <h3 className="font-heading text-xl font-bold text-fg">{it.title}</h3>
                  <div className="mt-1 font-semibold text-primary">{it.org}{it.location && <span className="font-normal text-fg/50"> · {it.location}</span>}</div>
                </div>
                {it.period && <span className="rounded-full border border-fg/10 bg-bg px-3 py-1 font-mono text-xs font-semibold text-fg/70">{it.period}</span>}
              </div>
              {it.description && <p className="mt-4 text-fg/65">{it.description}</p>}
              {it.bullets?.length > 0 && (
                <ul className="mt-5 space-y-3">
                  {it.bullets.map((b, j) => (
                    <li key={j} className="flex gap-3 text-fg/70"><span className="mt-2.5 h-1.5 w-1.5 shrink-0 rounded-full bg-accent" /><span><Bullet text={b} /></span></li>
                  ))}
                </ul>
              )}
              {it.tags?.length > 0 && <div className="mt-5 flex flex-wrap gap-2">{it.tags.map((t) => <span key={t} className="rounded-md bg-primary/10 px-2.5 py-1 font-mono text-xs font-semibold text-primary">{t}</span>)}</div>}
            </div>
          </li>
        ))}
      </ol>
    </>
  );
}

/* --------------------------------- Projects --------------------------------- */
function ProjectArt({ p }) {
  const h = hue(p.title);
  if (p.image) return <img src={p.image} alt={p.title} className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />;
  return (
    <div className="relative h-full w-full overflow-hidden" style={{ background: `linear-gradient(135deg, hsl(${h} 70% 18%), hsl(${(h + 60) % 360} 70% 12%))` }}>
      <div className="absolute inset-0 opacity-30 [background-image:linear-gradient(rgb(255_255_255/.08)_1px,transparent_1px),linear-gradient(90deg,rgb(255_255_255/.08)_1px,transparent_1px)] [background-size:28px_28px]" />
      <div className="absolute -right-10 -top-10 h-44 w-44 rounded-full blur-3xl" style={{ background: `hsl(${h} 90% 60% / .45)` }} />
      <div className="absolute -bottom-12 left-6 h-40 w-40 rounded-full blur-3xl" style={{ background: `hsl(${(h + 80) % 360} 90% 60% / .35)` }} />
      <div className="absolute inset-0 grid place-items-center">
        <span className="font-heading text-6xl font-bold tracking-tighter text-white/90 transition duration-500 group-hover:scale-110">{initials(p.title)}</span>
      </div>
      {p.url && <span className="absolute bottom-3 left-3 rounded-md bg-black/40 px-2 py-1 font-mono text-[11px] text-white/80 backdrop-blur">{domain(p.url)}</span>}
    </div>
  );
}

function Projects({ d }) {
  return (
    <>
      <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
      <div className="grid gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
        {(d.items || []).map((p, i) => {
          const Wrapper = p.url ? 'a' : 'div';
          return (
            <Wrapper
              key={i}
              {...(p.url ? { href: p.url, target: '_blank', rel: 'noreferrer' } : {})}
              className={cn('group flex flex-col overflow-hidden rounded-theme-lg border border-fg/10 bg-surface/50 transition duration-300 hover:-translate-y-1.5 hover:border-primary/40 hover:shadow-glow', p.featured && 'lg:col-span-2')}
            >
              <div className={cn('relative overflow-hidden', p.featured ? 'aspect-[21/9]' : 'aspect-[16/9]')}><ProjectArt p={p} /></div>
              <div className="flex flex-1 flex-col p-6">
                <div className="mb-2 flex items-center justify-between gap-3">
                  {p.category && <span className="font-mono text-xs font-semibold uppercase tracking-wider text-accent">{p.category}</span>}
                  {p.url && <span className="grid h-8 w-8 place-items-center rounded-full border border-fg/10 text-fg/60 transition group-hover:rotate-45 group-hover:border-primary group-hover:bg-primary group-hover:text-white"><ArrowUpRight className="h-4 w-4" /></span>}
                </div>
                <h3 className="font-heading text-xl font-bold text-fg">{p.title}</h3>
                {p.description && <p className="mt-2 flex-1 leading-relaxed text-fg/60">{p.description}</p>}
                {p.tags?.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">{p.tags.map((t) => <span key={t} className="rounded-md bg-fg/5 px-2 py-1 font-mono text-[11px] font-semibold text-fg/70">{t}</span>)}</div>}
              </div>
            </Wrapper>
          );
        })}
      </div>
    </>
  );
}

export const PORTFOLIO_RENDERERS = { profileHero: ProfileHero, aboutMe: AboutMe, skills: Skills, timeline: Timeline, projects: Projects };
