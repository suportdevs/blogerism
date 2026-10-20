import Link from 'next/link';
import { ArrowLeft, ArrowRight, ArrowUpRight, ChevronDown, Download, FileText, Github, Globe, Linkedin, Mail, MapPin, Phone } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { CopyEmail, GithubRepos, LocalTime, PrintButton, ProjectFilterGrid } from './DevClient';

/*
 * Blocks for a software engineer's portfolio: a bento hero, filterable project showcase, tech stack, work history,
 * live GitHub repositories, a printable résumé and case-study headers. Minimal, theme-driven (colours, radius, fonts).
 */

const card = 'rounded-[calc(var(--radius)*1.2)] border border-fg/10 bg-surface';
const hex = (c) => String(c || '').replace('#', '').slice(0, 6);
const logoSrc = (it) => it.image || (it.logo ? `https://cdn.simpleicons.org/${encodeURIComponent(it.logo)}${hex(it.color) ? `/${hex(it.color)}` : ''}` : '');
const initials = (name = '') => name.replace(/^md\.?\s+/i, '').split(/\s+/).map((w) => w[0]).join('').slice(0, 2).toUpperCase();

export function DevHeading({ eyebrow, title, subtitle, action }) {
  if (!eyebrow && !title) return null;
  return (
    <div className="mb-10 flex flex-wrap items-end justify-between gap-6">
      <div className="max-w-2xl">
        {eyebrow && <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{eyebrow}</div>}
        {title && <h2 className="mt-3 font-heading text-3xl font-semibold tracking-tight text-fg sm:text-[2.6rem] sm:leading-[1.1]">{title}</h2>}
        {subtitle && <p className="mt-3 text-lg leading-relaxed text-fg/55">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Social({ s, className }) {
  const Icon = ICONS[s.icon] || Globe;
  return (
    <a href={s.url} target={s.url?.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" aria-label={s.label || s.icon} title={s.label || s.icon}
      className={cn('grid h-10 w-10 place-items-center rounded-full border border-fg/10 bg-bg text-fg/70 transition hover:-translate-y-0.5 hover:border-fg/30 hover:text-fg', className)}>
      <Icon className="h-[18px] w-[18px]" />
    </a>
  );
}

/* ------------------------------ Bento hero ------------------------------ */

function DevBento({ d }) {
  const socials = (d.socials || []).filter((s) => s.url);
  const stack = (d.stack || []).filter((s) => s.label);
  const stats = (d.stats || []).filter((s) => s.value);
  return (
    <div className="relative">
      <div aria-hidden className="bg-grid pointer-events-none absolute -inset-x-20 -top-24 bottom-0 opacity-60 [mask-image:radial-gradient(ellipse_at_top,black_20%,transparent_70%)]" />
      <div className="relative grid gap-3 sm:gap-4 lg:grid-cols-12 lg:grid-rows-[auto_auto_auto]">
        {/* Intro */}
        <div className={cn(card, 'relative overflow-hidden p-7 sm:p-10 lg:col-span-8 lg:row-span-2')}>
          <div aria-hidden className="pointer-events-none absolute -right-24 -top-24 h-72 w-72 rounded-full bg-primary/15 blur-3xl" />
          {d.availability && (
            <span className="relative inline-flex items-center gap-2 rounded-full border border-emerald-500/25 bg-emerald-500/10 px-3 py-1 text-xs font-semibold text-emerald-600 dark:text-emerald-400">
              <span className="relative flex h-2 w-2"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-60" /><span className="relative inline-flex h-2 w-2 rounded-full bg-emerald-500" /></span>{d.availability}
            </span>
          )}
          <h1 className="relative mt-7 animate-fade-up font-heading text-[clamp(2.6rem,6vw,4.75rem)] font-semibold leading-[1.02] tracking-[-0.035em] text-fg">
            {d.greeting && <span className="block text-fg/40">{d.greeting}</span>}
            {d.name}
          </h1>
          {d.role && <p className="relative mt-4 bg-gradient-to-r from-primary to-accent bg-clip-text font-heading text-xl font-medium text-transparent sm:text-2xl">{d.role}</p>}
          {d.intro && <p className="relative mt-5 max-w-xl text-[17px] leading-relaxed text-fg/60">{d.intro}</p>}
          <div className="relative mt-8 flex flex-wrap gap-3">
            {d.primaryLabel && <Link href={d.primaryUrl || '#projects'} className="btn-site-primary">{d.primaryLabel}<ArrowRight className="h-4 w-4" /></Link>}
            {d.resumeLabel && d.resumeUrl && <Link href={d.resumeUrl} className="btn-site-ghost"><FileText className="h-4 w-4" />{d.resumeLabel}</Link>}
          </div>
        </div>

        {/* Photo or monogram */}
        <div className={cn(card, 'group relative min-h-[300px] overflow-hidden lg:col-span-4 lg:row-span-2')}>
          {d.photo ? (
            <img src={d.photo} alt={d.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-[1.03]" />
          ) : (
            <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-primary via-primary/70 to-accent">
              <div aria-hidden className="absolute inset-0 opacity-30 [background-image:radial-gradient(rgb(255_255_255/.5)_1px,transparent_1px)] [background-size:18px_18px]" />
              <span className="relative font-heading text-[7rem] font-semibold tracking-tighter text-white/95">{initials(d.name)}</span>
            </div>
          )}
          {d.location && (
            <div className="absolute bottom-3 left-3 right-3 flex items-center gap-2 rounded-full bg-black/45 px-3.5 py-2 text-xs font-medium text-white backdrop-blur-md">
              <MapPin className="h-3.5 w-3.5" />{d.location}
            </div>
          )}
        </div>

        {/* Local time */}
        <div className={cn(card, 'p-6 lg:col-span-3')}>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/45">Local time</div>
          <LocalTime timezone={d.timezone} />
        </div>

        {/* Currently */}
        <div className={cn(card, 'p-6 lg:col-span-4')}>
          <div className="mb-3 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/45">{d.currentlyLabel || 'Currently'}</div>
          <p className="text-[15px] leading-relaxed text-fg">{d.currently}</p>
        </div>

        {/* Stats */}
        {stats.length > 0 && (
          <div className={cn(card, 'grid grid-cols-3 divide-x divide-fg/10 lg:col-span-5')}>
            {stats.slice(0, 3).map((s) => (
              <div key={s.label} className="min-w-0 p-4 sm:p-6">
                <div className="font-heading text-2xl font-semibold tracking-tight text-fg sm:text-3xl">{s.value}</div>
                <div className="mt-1 text-xs leading-snug text-fg/50">{s.label}</div>
              </div>
            ))}
          </div>
        )}

        {/* Stack marquee */}
        {stack.length > 0 && (
          <div className={cn(card, 'relative flex flex-col justify-center overflow-hidden py-5 lg:col-span-8')}>
            <div className="mb-3 px-6 font-mono text-[11px] uppercase tracking-[0.16em] text-fg/45">{d.stackLabel || 'Daily stack'}</div>
            <div className="relative [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
              <div className="flex w-max animate-[marquee_40s_linear_infinite] gap-3 hover:[animation-play-state:paused]">
                {[0, 1].map((k) => (
                  <div key={k} aria-hidden={k === 1} className="flex shrink-0 gap-3 pr-3">
                    {stack.map((s) => (
                      <span key={s.label} className="flex items-center gap-2 rounded-full border border-fg/10 bg-bg px-3.5 py-2 text-sm font-medium text-fg/80">
                        {logoSrc(s) && <img src={logoSrc(s)} alt="" className="h-4 w-4 object-contain dark:brightness-110" loading="lazy" />}{s.label}
                      </span>
                    ))}
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* Contact */}
        <div className={cn(card, 'flex flex-col justify-between gap-4 p-6 lg:col-span-4')}>
          <div className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg/45">Say hello</div>
          <CopyEmail email={d.email} />
          {socials.length > 0 && <div className="flex flex-wrap gap-2">{socials.map((s, i) => <Social key={i} s={s} />)}</div>}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Projects ------------------------------ */

function ProjectShowcase({ d }) {
  return (
    <div>
      <DevHeading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} action={d.buttonLabel && d.buttonUrl ? <a href={d.buttonUrl} target={d.buttonUrl.startsWith('http') ? '_blank' : undefined} rel="noreferrer" className="btn-site-ghost">{d.buttonLabel}<ArrowUpRight className="h-4 w-4" /></a> : null} />
      <ProjectFilterGrid items={d.items || []} filters={d.filters !== false} />
    </div>
  );
}

/* ------------------------------ Tech stack ------------------------------ */

function StackGrid({ d }) {
  return (
    <div>
      <DevHeading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
        {(d.groups || []).map((g, i) => {
          const Icon = ICONS[g.icon];
          return (
            <div key={i} className={cn(card, 'p-6', g.wide && 'lg:col-span-2')}>
              <div className="flex items-center gap-3">
                {Icon && <span className="grid h-9 w-9 place-items-center rounded-xl bg-primary/10 text-primary"><Icon className="h-[18px] w-[18px]" /></span>}
                <h3 className="font-heading text-lg font-semibold text-fg">{g.title}</h3>
              </div>
              {g.text && <p className="mt-2 text-sm text-fg/55">{g.text}</p>}
              <ul className="mt-5 flex flex-wrap gap-2">
                {(g.items || []).map((it) => (
                  <li key={it.label} className="flex items-center gap-2 rounded-lg border border-fg/10 bg-bg px-3 py-1.5 text-sm text-fg/80 transition hover:border-fg/25">
                    {logoSrc(it) && <img src={logoSrc(it)} alt="" className="h-4 w-4 object-contain" loading="lazy" />}{it.label}
                  </li>
                ))}
              </ul>
            </div>
          );
        })}
      </div>
    </div>
  );
}

/* ------------------------------ Work history ------------------------------ */

function WorkHistory({ d }) {
  return (
    <div>
      <DevHeading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} action={d.buttonLabel && d.buttonUrl ? <Link href={d.buttonUrl} className="btn-site-ghost"><Download className="h-4 w-4" />{d.buttonLabel}</Link> : null} />
      <div className={cn(card, 'divide-y divide-fg/10 overflow-hidden')}>
        {(d.items || []).map((it, i) => (
          <details key={i} open={i === 0} className="group">
            <summary className="flex cursor-pointer list-none items-center gap-4 p-5 transition hover:bg-fg/[.02] sm:gap-6 sm:p-6 [&::-webkit-details-marker]:hidden">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-xl border border-fg/10 bg-bg font-heading text-sm font-semibold text-fg">{it.logo ? <img src={it.logo} alt="" className="h-7 w-7 object-contain" /> : initials(it.company)}</span>
              <span className="min-w-0 flex-1">
                <span className="block font-heading text-lg font-semibold text-fg">{it.role}</span>
                <span className="block text-sm text-fg/55">{it.company}{it.location && ` · ${it.location}`}</span>
              </span>
              <span className="hidden shrink-0 font-mono text-xs text-fg/50 sm:block">{it.period}</span>
              <ChevronDown className="h-5 w-5 shrink-0 text-fg/40 transition group-open:rotate-180" />
            </summary>
            <div className="px-5 pb-6 sm:pl-[5.75rem] sm:pr-8">
              <div className="mb-3 font-mono text-xs text-fg/50 sm:hidden">{it.period}</div>
              {it.summary && <p className="text-fg/70">{it.summary}</p>}
              {it.bullets?.length > 0 && (
                <ul className="mt-3 space-y-2">
                  {it.bullets.map((b, j) => {
                    const m = b.match(/^([^:]{3,40}):\s*(.*)$/);
                    return <li key={j} className="relative pl-5 text-[15px] leading-relaxed text-fg/70 before:absolute before:left-0 before:top-[0.6em] before:h-1.5 before:w-1.5 before:rounded-full before:bg-primary">{m ? <><b className="font-semibold text-fg">{m[1]}:</b> {m[2]}</> : b}</li>;
                  })}
                </ul>
              )}
              {it.tags?.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{it.tags.map((t) => <span key={t} className="rounded-md bg-fg/[.05] px-2 py-0.5 font-mono text-[11px] text-fg/60">{t}</span>)}</div>}
            </div>
          </details>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ GitHub ------------------------------ */

function GithubBlock({ d }) {
  return (
    <div>
      <DevHeading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
      <GithubRepos d={d} />
    </div>
  );
}

/* ------------------------------ Résumé ------------------------------ */

function ResumeSheet({ d }) {
  const contact = [[Mail, d.email, d.email && `mailto:${d.email}`], [Phone, d.phone, d.phone && `tel:${d.phone}`], [MapPin, d.location], [Globe, d.website, d.website]].filter(([, v]) => v);
  const h = 'mb-3 border-b border-fg/10 pb-1.5 font-mono text-[11px] font-semibold uppercase tracking-[0.18em] text-primary print:text-black';
  return (
    <div>
      {/* Only the sheet is printed; links print as plain text. */}
      <style>{'@page{size:A4;margin:14mm}@media print{header,footer,nav,.fixed,.print\\:hidden{display:none!important}html,body,main,section{background:#fff!important;padding:0!important;margin:0!important;overflow:visible!important;min-height:0!important}section>div{max-width:none!important;padding:0!important}.reveal{opacity:1!important;transform:none!important}#resume-sheet{max-width:none!important;border:0!important;box-shadow:none!important;padding:0!important;background:#fff!important;color:#111!important}#resume-sheet a{color:#111!important;text-decoration:none}#resume-sheet .break-inside-avoid{break-inside:avoid}}'}</style>
      <div className="mx-auto mb-6 flex max-w-[860px] flex-wrap items-center justify-between gap-3 print:hidden">
        <p className="text-sm text-fg/55">{d.note || 'Always up to date — generated from this website.'}</p>
        <PrintButton label={d.printLabel || 'Download PDF'} />
      </div>
      <article id="resume-sheet" className="mx-auto max-w-[860px] rounded-[calc(var(--radius)*1.2)] border border-fg/10 bg-surface p-8 text-[14.5px] leading-relaxed text-fg shadow-xl shadow-black/[.04] sm:p-12">
        <div className="flex flex-wrap items-start justify-between gap-6">
          <div>
            <h1 className="font-heading text-4xl font-semibold tracking-tight">{d.name}</h1>
            <p className="mt-1 text-lg text-fg/60">{d.role}</p>
          </div>
          <ul className="space-y-1 text-sm text-fg/70">
            {contact.map(([Icon, v, href]) => <li key={v} className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-fg/40" />{href ? <a href={href} className="hover:text-primary">{v.replace(/^https?:\/\//, '')}</a> : v}</li>)}
            {(d.links || []).map((l) => {
              const Icon = /github/i.test(l.url) ? Github : /linkedin/i.test(l.url) ? Linkedin : Globe;
              return <li key={l.url} className="flex items-center gap-2"><Icon className="h-3.5 w-3.5 text-fg/40" /><a href={l.url} className="hover:text-primary">{l.label || l.url.replace(/^https?:\/\//, '')}</a></li>;
            })}
          </ul>
        </div>
        {d.summary && <div className="mt-8"><h2 className={h}>Profile</h2><p className="text-fg/80">{d.summary}</p></div>}
        {d.experience?.length > 0 && (
          <div className="mt-8">
            <h2 className={h}>Experience</h2>
            <div className="space-y-5">
              {d.experience.map((e, i) => (
                <div key={i} className="break-inside-avoid">
                  <div className="flex flex-wrap items-baseline justify-between gap-2"><h3 className="font-semibold">{e.role} — {e.company}</h3><span className="font-mono text-xs text-fg/55">{e.period}</span></div>
                  {e.location && <div className="text-sm text-fg/50">{e.location}</div>}
                  {e.bullets?.length > 0 && <ul className="mt-2 list-disc space-y-1 pl-5 text-fg/80 marker:text-fg/40">{e.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>}
                </div>
              ))}
            </div>
          </div>
        )}
        {d.projects?.length > 0 && (
          <div className="mt-8">
            <h2 className={h}>Selected projects</h2>
            <ul className="space-y-2">{d.projects.map((p, i) => <li key={i} className="break-inside-avoid"><b className="font-semibold">{p.title}</b>{p.url && <span className="font-mono text-xs text-fg/50"> · {p.url.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>}{p.summary && <span className="text-fg/75"> — {p.summary}</span>}</li>)}</ul>
          </div>
        )}
        <div className="mt-8 grid gap-8 sm:grid-cols-2 print:grid-cols-2">
          {d.skills?.length > 0 && (
            <div>
              <h2 className={h}>Skills</h2>
              <dl className="space-y-2">{d.skills.map((s) => <div key={s.title}><dt className="text-sm font-semibold">{s.title}</dt><dd className="text-sm text-fg/70">{(s.items || []).join(', ')}</dd></div>)}</dl>
            </div>
          )}
          {d.education?.length > 0 && (
            <div>
              <h2 className={h}>Education</h2>
              <ul className="space-y-3">{d.education.map((e, i) => <li key={i}><div className="text-sm font-semibold">{e.title}</div><div className="text-sm text-fg/60">{e.org}{e.period && ` · ${e.period}`}</div></li>)}</ul>
            </div>
          )}
        </div>
      </article>
    </div>
  );
}

/* ------------------------------ Case study header ------------------------------ */

function CaseStudyHero({ d }) {
  const meta = [['Client', d.client], ['Role', d.role], ['Year', d.year], ['Duration', d.duration]].filter(([, v]) => v);
  return (
    <div>
      {d.backUrl && <Link href={d.backUrl} className="mb-10 inline-flex items-center gap-2 text-sm font-medium text-fg/55 hover:text-fg"><ArrowLeft className="h-4 w-4" />{d.backLabel || 'All projects'}</Link>}
      <div className="font-mono text-xs uppercase tracking-[0.18em] text-primary">{d.eyebrow || 'Case study'}</div>
      <h1 className="mt-4 max-w-4xl animate-fade-up font-heading text-[clamp(2.4rem,5.5vw,4.5rem)] font-semibold leading-[1.04] tracking-[-0.035em] text-fg">{d.title}</h1>
      {d.summary && <p className="mt-6 max-w-2xl text-xl leading-relaxed text-fg/60">{d.summary}</p>}
      <div className="mt-8 flex flex-wrap gap-3">
        {d.live && <a href={d.live} target="_blank" rel="noreferrer" className="btn-site-primary">Visit live site<ArrowUpRight className="h-4 w-4" /></a>}
        {d.code && <a href={d.code} target="_blank" rel="noreferrer" className="btn-site-ghost"><Github className="h-4 w-4" />Source code</a>}
      </div>
      {meta.length > 0 && (
        <dl className="mt-12 grid grid-cols-2 gap-px overflow-hidden rounded-[calc(var(--radius)*1.2)] border border-fg/10 bg-fg/10 md:grid-cols-4">
          {meta.map(([k, v]) => <div key={k} className="bg-surface p-5"><dt className="font-mono text-[11px] uppercase tracking-[0.16em] text-fg/45">{k}</dt><dd className="mt-1.5 font-medium text-fg">{v}</dd></div>)}
        </dl>
      )}
      {d.stack?.length > 0 && <div className="mt-5 flex flex-wrap gap-1.5">{d.stack.map((t) => <span key={t} className="rounded-md border border-fg/10 bg-surface px-2.5 py-1 font-mono text-xs text-fg/70">{t}</span>)}</div>}
      {d.cover && (
        <div className="mt-12 overflow-hidden rounded-[calc(var(--radius)*1.4)] border border-fg/10 bg-surface p-2 shadow-2xl shadow-black/[.06]">
          <img src={d.cover} alt={d.title} className="aspect-[16/8] w-full rounded-[var(--radius)] object-cover" />
        </div>
      )}
      {d.metrics?.length > 0 && (
        <div className="mt-6 grid gap-3 sm:grid-cols-3">
          {d.metrics.map((m) => <div key={m.label} className={cn(card, 'p-6')}><div className="font-heading text-4xl font-semibold tracking-tight text-fg">{m.value}</div><div className="mt-1 text-sm text-fg/55">{m.label}</div></div>)}
        </div>
      )}
    </div>
  );
}

export const DEV_RENDERERS = {
  devBento: DevBento, projectShowcase: ProjectShowcase, stackGrid: StackGrid, workHistory: WorkHistory,
  githubRepos: GithubBlock, resumeSheet: ResumeSheet, caseStudyHero: CaseStudyHero,
};
