'use client';

import { useEffect, useMemo, useState } from 'react';
import Link from 'next/link';
import { ArrowUpRight, Check, Copy, GitFork, Github, Printer, Star } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

/* Interactive pieces of the developer portfolio blocks (see DevBlocks.js). */

// Live clock in the owner's time zone, e.g. "14:32 · GMT+6".
export function LocalTime({ timezone }) {
  const [now, setNow] = useState(null);
  useEffect(() => {
    setNow(new Date());
    const t = setInterval(() => setNow(new Date()), 15000);
    return () => clearInterval(t);
  }, []);
  let time = '--:--';
  let zone = '';
  let hour = 12;
  if (now) {
    try {
      const fmt = new Intl.DateTimeFormat('en-GB', { hour: '2-digit', minute: '2-digit', timeZone: timezone || undefined, timeZoneName: 'shortOffset' });
      const parts = fmt.formatToParts(now);
      time = `${parts.find((p) => p.type === 'hour')?.value}:${parts.find((p) => p.type === 'minute')?.value}`;
      zone = parts.find((p) => p.type === 'timeZoneName')?.value || '';
      hour = Number(parts.find((p) => p.type === 'hour')?.value);
    } catch {
      time = now.toTimeString().slice(0, 5);
    }
  }
  const awake = hour >= 8 && hour < 23;
  return (
    <div>
      <div className="font-heading text-4xl font-semibold tabular-nums tracking-tight text-fg sm:text-5xl">{time}</div>
      <div className="mt-1 flex items-center gap-2 font-mono text-xs text-fg/50">
        <span className={cn('h-1.5 w-1.5 rounded-full', awake ? 'bg-emerald-500' : 'bg-amber-400')} />{zone}{now && (awake ? ' · usually replies within hours' : ' · probably asleep')}
      </div>
    </div>
  );
}

export function CopyEmail({ email, className }) {
  const [copied, setCopied] = useState(false);
  if (!email) return null;
  const copy = async () => {
    try { await navigator.clipboard.writeText(email); setCopied(true); setTimeout(() => setCopied(false), 1800); } catch { window.location.href = `mailto:${email}`; }
  };
  return (
    <button type="button" onClick={copy} className={cn('group flex w-full items-center justify-between gap-3 rounded-[calc(var(--radius)*0.8)] border border-fg/10 bg-bg px-4 py-3 text-left transition hover:border-primary/40', className)}>
      <span className="min-w-0 truncate font-mono text-sm text-fg">{email}</span>
      <span className={cn('flex shrink-0 items-center gap-1 text-xs font-semibold', copied ? 'text-emerald-500' : 'text-fg/45 group-hover:text-primary')}>{copied ? <><Check className="h-3.5 w-3.5" />Copied</> : <><Copy className="h-3.5 w-3.5" />Copy</>}</span>
    </button>
  );
}

/* ------------------------------ Project showcase ------------------------------ */

function ProjectCard({ p, wide }) {
  const href = p.caseStudy || p.live || p.code || '';
  const external = href && !p.caseStudy;
  const Wrapper = href ? (external ? 'a' : Link) : 'div';
  const wrapperProps = href ? (external ? { href, target: '_blank', rel: 'noreferrer' } : { href }) : {};
  return (
    <article className={cn('group relative flex flex-col overflow-hidden rounded-[calc(var(--radius)*1.2)] border border-fg/10 bg-surface transition duration-500 hover:-translate-y-1 hover:border-fg/20 hover:shadow-2xl hover:shadow-black/[.07]', wide && 'md:col-span-2')}>
      <Wrapper {...wrapperProps} className="block p-2 pb-0">
        <div className="overflow-hidden rounded-[calc(var(--radius)*0.8)] border border-fg/10 bg-bg">
          <div className="flex items-center gap-1.5 border-b border-fg/10 px-3 py-2">
            {['bg-rose-400', 'bg-amber-400', 'bg-emerald-400'].map((c) => <span key={c} className={cn('h-2 w-2 rounded-full opacity-70', c)} />)}
            {p.live && <span className="ml-2 truncate font-mono text-[10px] text-fg/40">{p.live.replace(/^https?:\/\//, '').replace(/\/$/, '')}</span>}
          </div>
          <div className={cn('relative overflow-hidden', wide ? 'aspect-[16/8]' : 'aspect-[16/10]')}>
            {p.image ? <img src={p.image} alt={p.title} loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-[1.04]" /> : <div className="grid h-full w-full place-items-center bg-gradient-to-br from-primary/20 via-accent/10 to-transparent font-heading text-5xl font-bold text-fg/20">{p.title?.[0]}</div>}
          </div>
        </div>
      </Wrapper>
      <div className="flex flex-1 flex-col p-5 sm:p-6">
        <div className="flex items-center gap-2 font-mono text-[11px] uppercase tracking-wider text-fg/45">
          {p.category}{p.year && <><span className="h-1 w-1 rounded-full bg-fg/25" />{p.year}</>}
        </div>
        <h3 className="mt-2 font-heading text-xl font-semibold tracking-tight text-fg sm:text-2xl">
          {href ? <Wrapper {...wrapperProps} className="after:absolute after:inset-0 hover:text-primary">{p.title}</Wrapper> : p.title}
        </h3>
        {p.summary && <p className="mt-2 text-[15px] leading-relaxed text-fg/60">{p.summary}</p>}
        {p.stack?.length > 0 && <div className="mt-4 flex flex-wrap gap-1.5">{p.stack.map((t) => <span key={t} className="rounded-md border border-fg/10 bg-bg px-2 py-0.5 font-mono text-[11px] text-fg/65">{t}</span>)}</div>}
        <div className="relative z-10 mt-auto flex flex-wrap gap-4 pt-5 text-sm font-semibold">
          {p.caseStudy && <Link href={p.caseStudy} className="inline-flex items-center gap-1 text-fg hover:text-primary">Case study<ArrowUpRight className="h-4 w-4" /></Link>}
          {p.live && <a href={p.live} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-fg/60 hover:text-primary">Live site<ArrowUpRight className="h-4 w-4" /></a>}
          {p.code && <a href={p.code} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-fg/60 hover:text-primary"><Github className="h-4 w-4" />Code</a>}
        </div>
      </div>
    </article>
  );
}

export function ProjectFilterGrid({ items = [], filters = true }) {
  const categories = useMemo(() => ['All', ...new Set(items.map((p) => p.category).filter(Boolean))], [items]);
  const [active, setActive] = useState('All');
  const shown = items.filter((p) => active === 'All' || p.category === active);
  return (
    <>
      {filters && categories.length > 2 && (
        <div className="mb-8 flex flex-wrap gap-2" role="tablist" aria-label="Filter projects">
          {categories.map((c) => (
            <button key={c} role="tab" aria-selected={active === c} onClick={() => setActive(c)} className={cn('rounded-full border px-4 py-1.5 text-sm font-medium transition', active === c ? 'border-fg bg-fg text-bg' : 'border-fg/15 text-fg/65 hover:border-fg/40 hover:text-fg')}>
              {c}{c !== 'All' && <span className="ml-1.5 font-mono text-[11px] opacity-60">{items.filter((p) => p.category === c).length}</span>}
            </button>
          ))}
        </div>
      )}
      <div className="grid gap-5 md:grid-cols-2 lg:grid-cols-3">
        {shown.map((p, i) => <ProjectCard key={`${active}-${p.title}`} p={p} wide={active === 'All' && p.featured && i < 2} />)}
      </div>
    </>
  );
}

/* ------------------------------ GitHub repositories ------------------------------ */

const LANG_COLORS = { JavaScript: '#f1e05a', TypeScript: '#3178c6', PHP: '#4F5D95', Python: '#3572A5', Blade: '#f7523f', HTML: '#e34c26', CSS: '#563d7c', Vue: '#41b883', Go: '#00ADD8', Java: '#b07219', Shell: '#89e051', Dart: '#00B4AB', Rust: '#dea584', 'C#': '#178600', Kotlin: '#A97BFF', Swift: '#F05138', SCSS: '#c6538c' };
const ago = (d) => {
  const days = Math.floor((Date.now() - new Date(d).getTime()) / 864e5);
  if (days < 1) return 'today';
  if (days < 30) return `${days}d ago`;
  if (days < 365) return `${Math.floor(days / 30)}mo ago`;
  return `${Math.floor(days / 365)}y ago`;
};

export function GithubRepos({ d }) {
  const [state, setState] = useState({ status: 'loading', repos: [], profile: null });
  const user = String(d.username || '').trim();
  useEffect(() => {
    if (!user) { setState({ status: 'empty', repos: [], profile: null }); return; }
    let alive = true;
    fetch(`${API_URL}/api/public/github/${encodeURIComponent(user)}?sort=${d.sort || 'stars'}`)
      .then((r) => (r.ok ? r.json() : Promise.reject(new Error('GitHub unavailable'))))
      .then((data) => alive && setState({ status: 'ready', repos: data.repos, profile: data.profile }))
      .catch(() => alive && setState({ status: 'error', repos: [], profile: null }));
    return () => { alive = false; };
  }, [user, d.sort]);

  const hide = new Set((d.exclude || []).map((x) => String(x).toLowerCase()));
  const repos = state.repos.filter((r) => !hide.has(r.name.toLowerCase())).slice(0, Number(d.count) || 6);
  return (
    <div>
      {state.profile && (
        <div className="mb-6 flex flex-wrap items-center gap-x-6 gap-y-2 font-mono text-xs text-fg/55">
          <a href={state.profile.url} target="_blank" rel="noreferrer" className="flex items-center gap-2 font-semibold text-fg hover:text-primary">
            {state.profile.avatar && <img src={state.profile.avatar} alt="" className="h-6 w-6 rounded-full" />}@{state.profile.login}
          </a>
          <span>{state.profile.publicRepos} public repos</span>
          <span>{state.profile.followers} followers</span>
        </div>
      )}
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {state.status === 'loading' && Array.from({ length: Math.min(Number(d.count) || 6, 6) }, (_, i) => <div key={i} className="h-40 animate-pulse rounded-[calc(var(--radius)*1.2)] border border-fg/10 bg-surface" />)}
        {repos.map((r) => (
          <a key={r.name} href={r.url} target="_blank" rel="noreferrer" className="group flex flex-col rounded-[calc(var(--radius)*1.2)] border border-fg/10 bg-surface p-5 transition hover:-translate-y-0.5 hover:border-fg/25">
            <div className="flex items-center gap-2 font-mono text-sm font-semibold text-fg"><Github className="h-4 w-4 shrink-0 text-fg/50" /><span className="truncate group-hover:text-primary">{r.name}</span><ArrowUpRight className="ml-auto h-4 w-4 shrink-0 text-fg/30 transition group-hover:text-primary" /></div>
            <p className="mt-2 line-clamp-2 flex-1 text-sm leading-relaxed text-fg/60">{r.description || 'No description yet.'}</p>
            <div className="mt-4 flex flex-wrap items-center gap-4 font-mono text-[11px] text-fg/50">
              {r.language && <span className="flex items-center gap-1.5"><span className="h-2.5 w-2.5 rounded-full" style={{ background: LANG_COLORS[r.language] || '#8b8b8b' }} />{r.language}</span>}
              <span className="flex items-center gap-1"><Star className="h-3.5 w-3.5" />{r.stars}</span>
              <span className="flex items-center gap-1"><GitFork className="h-3.5 w-3.5" />{r.forks}</span>
              <span className="ml-auto">{ago(r.updatedAt)}</span>
            </div>
          </a>
        ))}
      </div>
      {(state.status === 'error' || (state.status === 'ready' && !repos.length)) && <p className="rounded-[calc(var(--radius)*1.2)] border border-dashed border-fg/15 p-6 text-center text-sm text-fg/50">Repositories can’t be loaded right now — see them on <a className="font-semibold text-primary" href={`https://github.com/${user}`} target="_blank" rel="noreferrer">GitHub</a>.</p>}
      {state.status === 'empty' && <p className="text-sm text-fg/50">Add a GitHub username in this block’s settings.</p>}
      {user && d.buttonLabel && <a href={`https://github.com/${user}?tab=repositories`} target="_blank" rel="noreferrer" className="btn-site-ghost mt-8"><Github className="h-4 w-4" />{d.buttonLabel}</a>}
    </div>
  );
}

export function PrintButton({ label = 'Download PDF' }) {
  return <button type="button" onClick={() => window.print()} className="btn-site-primary print:hidden"><Printer className="h-4 w-4" />{label}</button>;
}
