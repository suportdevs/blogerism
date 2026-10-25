import Link from 'next/link';
import { ArrowRight, ArrowUpRight, BadgeCheck, Briefcase, Github, Globe, GraduationCap, MapPin } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn, formatDate, postUrl } from '@/lib/utils';
import { ContactForm } from './forms';
import { PhotoDeck } from './ScrapClient';

/*
 * "Scrapbook" blocks for a warm, personal portfolio: polaroid hero with tape, stickers and a spinning stamp, a ruled
 * notebook bio with skill sticky notes, project spreads with a shuffling photo deck, journal-style articles, work and
 * education as ticket stubs, and an airmail postcard for contact. Paper colours come from the theme; sticky notes,
 * tape and polaroids keep their own print colours, so they read the same in light and dark mode.
 */

const pop = `border-2 border-[#1c1a17] shadow-[4px_4px_0_#1c1a17]`;
const NOTE = { yellow: '#ffe27a', pink: '#ffbfd0', blue: '#b5dbff', green: '#c2f0c9', orange: '#ffcfa3', purple: '#d9c8ff' };
const TILT = ['-rotate-2', 'rotate-[1.5deg]', '-rotate-1', 'rotate-2', '-rotate-[1.5deg]', 'rotate-1'];
const hex = (c) => String(c || '').replace('#', '').slice(0, 6);
const logoSrc = (it) => it.image || (it.logo ? `https://cdn.simpleicons.org/${encodeURIComponent(it.logo)}${hex(it.color) ? `/${hex(it.color)}` : ''}` : '');
const ext = (url = '') => /^(https?:)?\/\//.test(url) || /\.\w{2,5}([?#].*)?$/.test(url);
const linkProps = (url) => (ext(url) ? { target: '_blank', rel: 'noreferrer' } : {});

// A strip of washi tape.
function Tape({ className }) {
  return <span aria-hidden className={cn('absolute z-10 h-7 w-28 bg-accent/80 shadow-sm [background-image:repeating-linear-gradient(45deg,transparent_0_6px,rgb(255_255_255/0.35)_6px_12px)]', className)} />;
}

// Hand-drawn ellipse around a word, drawn on when the page loads.
function Circled({ children }) {
  return (
    <span className="relative inline-block whitespace-nowrap px-1">
      <svg aria-hidden viewBox="0 0 300 60" preserveAspectRatio="none" className="absolute -inset-x-3 -inset-y-2 h-[calc(100%+1rem)] w-[calc(100%+1.5rem)] overflow-visible">
        <path d="M8 34C6 14 70 4 150 4s145 8 143 28-70 25-150 24S10 50 14 26" pathLength="1" fill="none" stroke="rgb(var(--c-primary))" strokeWidth="3.5" strokeLinecap="round" className="animate-draw [stroke-dasharray:1]" />
      </svg>
      <span className="relative">{children}</span>
    </span>
  );
}

// "I build *useful* things" → the starred words get a hand-drawn circle; "_word_" gets a highlighter.
export function Doodled({ text = '' }) {
  return String(text).split(/(\*[^*]+\*|_[^_]+_)/).map((part, i) => {
    if (/^\*[^*]+\*$/.test(part)) return <Circled key={i}>{part.slice(1, -1)}</Circled>;
    if (/^_[^_]+_$/.test(part)) return <span key={i} className="bg-[linear-gradient(transparent_55%,rgb(var(--c-accent)/0.85)_55%,rgb(var(--c-accent)/0.85)_92%,transparent_92%)] px-1">{part.slice(1, -1)}</span>;
    return part;
  });
}

function ScrapHeading({ label, title, subtitle, action, center }) {
  if (!label && !title) return null;
  return (
    <div className={cn('mb-14 flex flex-wrap items-end justify-between gap-6 sm:mb-16', center && 'flex-col items-center text-center')}>
      <div className="max-w-2xl">
        {label && <span className={cn('inline-block -rotate-2 rounded-md bg-surface px-3 py-1 text-sm font-bold text-fg', pop)}>{label}</span>}
        {title && <h2 className="mt-6 font-heading text-4xl font-extrabold leading-[1.1] tracking-tight text-fg sm:text-[3.4rem]"><Doodled text={title} /></h2>}
        {subtitle && <p className="mt-5 text-lg leading-relaxed text-fg/60">{subtitle}</p>}
      </div>
      {action}
    </div>
  );
}

function Btn({ href, children, solid, className }) {
  const cls = cn('inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-bold transition hover:-translate-x-[2px] hover:-translate-y-[2px] active:translate-x-[2px] active:translate-y-[2px] active:shadow-none',
    `border-2 border-[#1c1a17]`, solid ? `bg-primary text-white shadow-[4px_4px_0_#1c1a17] hover:shadow-[6px_6px_0_#1c1a17]` : `bg-surface text-fg shadow-[4px_4px_0_#1c1a17] hover:shadow-[6px_6px_0_#1c1a17]`, className);
  return ext(href) || href?.startsWith('#') || href?.startsWith('mailto:')
    ? <a href={href} {...linkProps(href)} className={cls}>{children}</a>
    : <Link href={href || '#'} className={cls}>{children}</Link>;
}

function Social({ s }) {
  const Icon = ICONS[s.icon] || Globe;
  return (
    <a href={s.url} {...linkProps(s.url)} aria-label={s.label || s.icon} title={s.label || s.icon}
      className={cn('grid h-11 w-11 place-items-center rounded-full bg-surface text-fg transition hover:-translate-y-1 hover:rotate-6 hover:bg-accent hover:text-[#1c1a17]', `border-2 border-[#1c1a17] shadow-[3px_3px_0_#1c1a17]`)}>
      <Icon className="h-[18px] w-[18px]" />
    </a>
  );
}

// Circular stamp with text running around the edge.
function Stamp({ id, text, center, className }) {
  const words = `${text} • ${text} • `;
  return (
    <div className={cn('grid h-32 w-32 place-items-center rounded-full bg-accent text-[#1c1a17]', `border-2 border-[#1c1a17] shadow-[4px_4px_0_#1c1a17]`, className)}>
      <svg viewBox="0 0 100 100" className="absolute h-full w-full animate-[spin_16s_linear_infinite]" aria-hidden>
        <defs><path id={id} d="M50 50m-37 0a37 37 0 1 1 74 0a37 37 0 1 1-74 0" /></defs>
        <text fontSize="9.5" fontWeight="800" letterSpacing="1.6" fill="currentColor"><textPath href={`#${id}`}>{words.toUpperCase()}</textPath></text>
      </svg>
      <span className="relative text-3xl">{center}</span>
    </div>
  );
}

/* ------------------------------ Hero ------------------------------ */

const STICKER_SPOTS = ['left-[-6%] top-[14%] -rotate-[8deg]', 'right-[-4%] top-[38%] rotate-[7deg]', 'left-[2%] bottom-[16%] rotate-[4deg]', 'right-[6%] bottom-[2%] -rotate-[5deg]', 'left-[38%] -top-[2%] rotate-[3deg]'];
const STICKER_COLORS = [NOTE.pink, NOTE.blue, NOTE.green, NOTE.orange, NOTE.purple];

function ScrapHero({ d }) {
  const stickers = (d.stickers || []).filter(Boolean).slice(0, 5);
  const back = (d.photos || []).map((p) => p?.src || p).filter((s) => typeof s === 'string' && s).slice(0, 2);
  const socials = (d.socials || []).filter((s) => s.url);
  return (
    <div className="relative">
      <div aria-hidden className="pointer-events-none absolute -inset-x-[20vw] -top-40 bottom-0 [background-image:radial-gradient(rgb(var(--c-fg)/0.13)_1.2px,transparent_1.2px)] [background-size:24px_24px] [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
      <div className="relative grid min-h-[82vh] items-center gap-16 py-6 lg:grid-cols-[1.1fr_1fr] lg:gap-10">
        <div>
          {d.status && (
            <span className={cn('inline-flex -rotate-2 items-center gap-2 rounded-full bg-surface px-4 py-1.5 text-sm font-bold text-fg', pop)}>
              <span className="relative flex h-2.5 w-2.5"><span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-emerald-500 opacity-70" /><span className="relative h-2.5 w-2.5 rounded-full bg-emerald-500" /></span>{d.status}
            </span>
          )}
          {d.greeting && <p className="mt-9 animate-fade-up text-2xl font-semibold text-fg/70 sm:text-3xl">{d.greeting}</p>}
          <h1 className="mt-2 animate-fade-up font-heading text-[clamp(3.2rem,8vw,6.6rem)] font-extrabold leading-[0.95] tracking-[-0.04em] text-fg [animation-delay:.06s]">
            <span className="relative inline-block">
              {d.name}
              <svg aria-hidden viewBox="0 0 300 20" preserveAspectRatio="none" className="absolute -bottom-3 left-0 h-4 w-full sm:-bottom-4 sm:h-5">
                <path d="M3 13C50 5 98 4 150 8s96 7 146-3" pathLength="1" fill="none" stroke="rgb(var(--c-primary))" strokeWidth="5" strokeLinecap="round" className="animate-draw [stroke-dasharray:1]" />
              </svg>
            </span>
          </h1>
          {d.role && <p className="mt-8 animate-fade-up font-heading text-2xl font-bold text-fg sm:text-4xl [animation-delay:.12s]"><Doodled text={d.role} /></p>}
          {d.intro && <p className="mt-6 max-w-xl animate-fade-up text-lg leading-relaxed text-fg/65 [animation-delay:.18s]">{d.intro}</p>}
          <div className="mt-10 flex animate-fade-up flex-wrap items-center gap-4 [animation-delay:.24s]">
            {d.primaryLabel && <Btn href={d.primaryUrl} solid>{d.primaryLabel}<ArrowRight className="h-4 w-4" /></Btn>}
            {d.secondaryLabel && <Btn href={d.secondaryUrl}>{d.secondaryLabel}</Btn>}
          </div>
          {socials.length > 0 && <div className="mt-9 flex flex-wrap gap-3">{socials.map((s, i) => <Social key={i} s={s} />)}</div>}
          {stickers.length > 0 && <div className="mt-8 flex flex-wrap gap-2 lg:hidden">{stickers.map((s, i) => <span key={i} className={cn('rounded-full px-3 py-1 text-sm font-bold text-[#1c1a17]', `border-2 border-[#1c1a17]`, TILT[i])} style={{ backgroundColor: STICKER_COLORS[i] }}>{s}</span>)}</div>}
        </div>

        <div className="relative mx-auto w-full max-w-[440px] px-6 sm:px-10">
          {back.map((src, i) => (
            <div key={i} aria-hidden className={cn('absolute inset-x-10 top-6 bg-white p-3 pb-12 shadow-[0_20px_40px_-20px_rgb(0_0_0/0.4)]', i === 0 ? 'rotate-[9deg] translate-x-[10%]' : '-rotate-[8deg] -translate-x-[8%] translate-y-[4%]')}>
              <img src={src} alt="" className="aspect-[4/5] w-full object-cover" />
            </div>
          ))}
          <figure className="relative -rotate-[3deg] bg-white p-3 pb-16 shadow-[0_30px_60px_-24px_rgb(0_0_0/0.55)] transition duration-500 hover:rotate-0">
            <Tape className="-top-3 left-1/2 -translate-x-1/2 -rotate-3" />
            {d.photo ? <img src={d.photo} alt={d.name || ''} className="aspect-[4/5] w-full object-cover" /> : <div className="grid aspect-[4/5] w-full place-items-center bg-[#efe7d8] text-7xl">🙂</div>}
            {d.caption && <figcaption className="absolute inset-x-3 bottom-4 text-center font-heading text-xl font-bold text-[#1c1a17]">{d.caption}</figcaption>}
          </figure>
          {d.stamp && <Stamp id="scrap-hero-stamp" text={d.stamp} center={d.stampEmoji || '👋'} className="absolute -right-2 -top-8 z-20 sm:-right-6" />}
          {stickers.map((s, i) => (
            <span key={i} className={cn('absolute z-20 hidden whitespace-nowrap rounded-full px-3.5 py-1.5 text-sm font-bold text-[#1c1a17] transition hover:scale-110 lg:inline-block', `border-2 border-[#1c1a17] shadow-[3px_3px_0_#1c1a17]`, STICKER_SPOTS[i])} style={{ backgroundColor: STICKER_COLORS[i] }}>{s}</span>
          ))}
          {d.note && (
            <div aria-hidden className="absolute -left-24 bottom-[34%] hidden -rotate-6 xl:block">
              <span className="font-heading text-lg font-bold text-primary">{d.note}</span>
              <svg viewBox="0 0 90 50" className="ml-10 mt-1 h-12 w-20 text-primary"><path d="M4 6c18 2 50 8 70 32m0 0-14-2m14 2 1-14" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round" /></svg>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ About ------------------------------ */

function ScrapAbout({ d }) {
  const paragraphs = String(d.text || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  const facts = (d.facts || []).filter((f) => f.value);
  const groups = (d.groups || []).filter((g) => g.title);
  return (
    <div>
      <ScrapHeading label={d.label} title={d.title} subtitle={d.subtitle} />
      <div className="grid gap-12 lg:grid-cols-[1fr_1.1fr] lg:gap-14">
        <div className="relative rotate-[-0.6deg] rounded-xl bg-surface px-7 py-9 pl-14 shadow-[0_24px_50px_-28px_rgb(0_0_0/0.45)] sm:pl-16 [background-image:repeating-linear-gradient(transparent_0_31px,rgb(var(--c-fg)/0.09)_31px_32px)] [background-position:0_22px]">
          <Tape className="-top-3 left-8 -rotate-6" />
          <span aria-hidden className="absolute bottom-0 left-9 top-0 w-px bg-rose-400/60 sm:left-11" />
          <div className="space-y-8 text-lg leading-8 text-fg/80">{paragraphs.map((p, i) => <p key={i}>{p}</p>)}</div>
          {facts.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2">
              {facts.map((f, i) => <span key={i} className="rounded-full border border-fg/15 bg-bg px-3 py-1 text-sm text-fg/75"><b className="text-fg">{f.label}</b> {f.value}</span>)}
            </div>
          )}
          {d.signature && <div className="mt-8 text-right font-heading text-2xl font-bold italic text-primary">— {d.signature}</div>}
        </div>
        <div className="grid content-start gap-6 sm:grid-cols-2">
          {groups.map((g, i) => (
            <div key={i} className={cn('relative p-6 pt-8 text-[#1c1a17] shadow-[0_18px_30px_-18px_rgb(0_0_0/0.5)] transition duration-300 hover:z-10 hover:rotate-0 hover:scale-[1.03]', TILT[i % TILT.length])} style={{ backgroundColor: NOTE[g.color] || NOTE.yellow }}>
              <span aria-hidden className="absolute left-1/2 top-2 h-4 w-4 -translate-x-1/2 rounded-full border-2 border-[#1c1a17] bg-primary shadow-[0_2px_0_#1c1a17]" />
              <h3 className="font-heading text-xl font-extrabold">{g.title}</h3>
              <ul className="mt-4 flex flex-wrap gap-2">
                {(g.items || []).filter((it) => it.label).map((it, j) => {
                  const src = logoSrc(it);
                  return <li key={j} className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-2.5 py-1 text-sm font-semibold">{src && <img src={src} alt="" loading="lazy" className="h-3.5 w-3.5 object-contain" />}{it.label}</li>;
                })}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

/* ------------------------------ Projects ------------------------------ */

function ScrapProjects({ d }) {
  const items = (d.items || []).filter((p) => p.title);
  return (
    <div>
      <ScrapHeading label={d.label} title={d.title} subtitle={d.subtitle} />
      <div className="space-y-24 sm:space-y-32">
        {items.map((p, i) => (
          <article key={i} className="grid items-center gap-14 lg:grid-cols-2 lg:gap-20">
            <div className={cn(i % 2 && 'lg:order-2')}><PhotoDeck images={(p.images || []).map((img) => img?.src || img).filter((s) => typeof s === 'string')}title={p.title} label={d.shuffleLabel || 'Next photo'} /></div>
            <div>
              <div className="flex flex-wrap items-center gap-3">
                <span className="font-heading text-6xl font-extrabold leading-none text-transparent [-webkit-text-stroke:2px_rgb(var(--c-fg)/0.35)]">{String(i + 1).padStart(2, '0')}</span>
                {p.category && <span className={cn('rotate-2 rounded-md px-2.5 py-1 text-xs font-bold uppercase tracking-wide text-[#1c1a17]', `border-2 border-[#1c1a17]`)} style={{ backgroundColor: STICKER_COLORS[i % STICKER_COLORS.length] }}>{p.category}</span>}
              </div>
              <h3 className="mt-5 font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-[2.6rem] sm:leading-[1.1]">{p.title}</h3>
              {p.summary && <p className="mt-4 text-lg leading-relaxed text-fg/65">{p.summary}</p>}
              {p.stack?.length > 0 && (
                <ul className="mt-6 grid grid-cols-2 gap-x-6 gap-y-2 sm:grid-cols-3">
                  {p.stack.map((t) => <li key={t} className="flex items-center gap-2 text-[15px] font-medium text-fg/80"><span className="h-2 w-2 rotate-45 bg-primary" />{t}</li>)}
                </ul>
              )}
              <div className="mt-8 flex flex-wrap items-center gap-3">
                {p.live && <Btn href={p.live} solid>{d.liveLabel || 'Live demo'}<ArrowUpRight className="h-4 w-4" /></Btn>}
                {p.code && <Btn href={p.code}><Github className="h-4 w-4" />{d.codeLabel || 'Source'}</Btn>}
              </div>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Articles ------------------------------ */

function ScrapNotes({ d, ctx }) {
  const posts = (ctx?.posts || []).slice(0, Number(d.count) || 3);
  return (
    <div>
      <ScrapHeading label={d.label} title={d.title} subtitle={d.subtitle}
        action={d.buttonLabel ? <Btn href={d.buttonUrl || '/blog'}>{d.buttonLabel}<ArrowRight className="h-4 w-4" /></Btn> : null} />
      <div className="grid gap-10 md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p, i) => {
          const cat = p.categories?.[0];
          return (
            <Link key={p.id} href={postUrl(p)} className={cn('group relative flex flex-col bg-surface p-3 pb-6 shadow-[0_24px_40px_-26px_rgb(0_0_0/0.5)] transition duration-300 hover:-translate-y-2 hover:rotate-0', TILT[i % TILT.length])}>
              <Tape className={cn('-top-3', i % 2 ? 'right-6 rotate-6' : 'left-6 -rotate-6')} />
              <div className="relative aspect-[16/10] overflow-hidden rounded-md bg-fg/5">
                {p.coverImage && <img src={p.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
                {p.publishedAt && <span className="absolute right-3 top-3 rotate-6 rounded-md border-2 border-dashed border-primary bg-white/95 px-2 py-1 text-[11px] font-extrabold uppercase tracking-wider text-primary">{formatDate(p.publishedAt)}</span>}
              </div>
              <div className="flex flex-1 flex-col px-3 pt-5">
                {cat && <span className="text-xs font-bold uppercase tracking-wider" style={{ color: cat.color }}>#{cat.name}</span>}
                <h3 className="mt-2 font-heading text-xl font-extrabold leading-snug text-fg">{p.title}</h3>
                {p.excerpt && <p className="mt-2 line-clamp-3 text-[15px] leading-relaxed text-fg/60">{p.excerpt}</p>}
                <span className="mt-auto inline-flex items-center gap-1.5 pt-5 text-sm font-bold text-primary">{d.readLabel || 'Read more'}<ArrowRight className="h-4 w-4 transition group-hover:translate-x-1" /></span>
              </div>
            </Link>
          );
        })}
      </div>
      {!posts.length && <p className="text-center text-fg/50">No posts published yet.</p>}
    </div>
  );
}

/* ------------------------------ History ------------------------------ */

function Ticket({ it, kind, linkLabel }) {
  const remote = /remote/i.test(it.location || '');
  return (
    <li className="relative pl-10">
      <span aria-hidden className={cn('absolute left-0 top-7 grid h-7 w-7 place-items-center rounded-full text-[#1c1a17]', `border-2 border-[#1c1a17]`, it.current ? 'bg-emerald-300' : 'bg-accent')}>
        {kind === 'work' ? <Briefcase className="h-3.5 w-3.5" /> : <GraduationCap className="h-3.5 w-3.5" />}
      </span>
      <div className="relative rounded-2xl border-2 border-fg/15 bg-surface p-6 transition duration-300 hover:-translate-y-1 hover:border-fg/40">
        <span aria-hidden className="absolute -left-[11px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-fg/15 bg-bg [clip-path:inset(0_0_0_50%)]" />
        <span aria-hidden className="absolute -right-[11px] top-1/2 h-5 w-5 -translate-y-1/2 rounded-full border-2 border-fg/15 bg-bg [clip-path:inset(0_50%_0_0)]" />
        <div className="flex flex-wrap items-center justify-between gap-2">
          <span className="rounded-full bg-primary/10 px-3 py-1 text-xs font-extrabold uppercase tracking-wider text-primary">{it.period}</span>
          {remote && <span className="rounded-full border border-fg/15 px-2.5 py-0.5 text-xs font-semibold text-fg/60">🌍 Remote</span>}
        </div>
        <h4 className="mt-4 font-heading text-xl font-extrabold leading-snug text-fg">{it.title}</h4>
        {(it.org || it.location) && <div className="mt-1 flex flex-wrap items-center gap-x-2 text-[15px] font-semibold text-fg/60">{it.org}{it.location && !remote && <span className="inline-flex items-center gap-1 font-normal"><MapPin className="h-3.5 w-3.5" />{it.location}</span>}</div>}
        {it.text && <p className="mt-3 text-fg/65">{it.text}</p>}
        {it.bullets?.length > 0 && <ul className="mt-4 space-y-2 border-t border-dashed border-fg/15 pt-4">{it.bullets.map((b, j) => <li key={j} className="flex gap-2.5 text-[15px] leading-relaxed text-fg/75"><span className="mt-2 h-1.5 w-1.5 shrink-0 rounded-full bg-primary" />{b}</li>)}</ul>}
        {it.url && <a href={it.url} {...linkProps(it.url)} className="mt-4 inline-flex items-center gap-1.5 text-sm font-bold text-primary hover:underline"><BadgeCheck className="h-4 w-4" />{linkLabel || 'View certificate'}</a>}
      </div>
    </li>
  );
}

function ScrapHistory({ d }) {
  const cols = [['work', d.workTitle, d.work], ['edu', d.educationTitle, d.education]].filter(([, , list]) => (list || []).some((x) => x.title));
  return (
    <div>
      <ScrapHeading label={d.label} title={d.title} subtitle={d.subtitle} />
      <div className={cn('grid gap-14', cols.length > 1 && 'lg:grid-cols-2 lg:gap-12')}>
        {cols.map(([kind, title, list]) => (
          <div key={kind} id={kind === 'work' ? d.workAnchor || undefined : d.educationAnchor || undefined} className="scroll-mt-28">
            {title && <h3 className={cn('mb-8 inline-flex rotate-[-1.5deg] items-center gap-2 rounded-lg px-4 py-2 font-heading text-xl font-extrabold text-[#1c1a17]', `border-2 border-[#1c1a17] shadow-[4px_4px_0_#1c1a17]`)} style={{ backgroundColor: kind === 'work' ? NOTE.blue : NOTE.pink }}>{kind === 'work' ? '💼' : '🎓'} {title}</h3>}
            <ol className="relative space-y-6 before:absolute before:bottom-4 before:left-[13px] before:top-8 before:border-l-2 before:border-dashed before:border-fg/20">
              {list.filter((x) => x.title).map((it, i) => <Ticket key={i} it={it} kind={kind} linkLabel={d.linkLabel} />)}
            </ol>
          </div>
        ))}
      </div>
    </div>
  );
}

/* ------------------------------ Contact ------------------------------ */

function ScrapContact({ d }) {
  const rows = (d.rows || []).filter((r) => r.value);
  const socials = (d.socials || []).filter((s) => s.url);
  const airmail = '[background-image:repeating-linear-gradient(-45deg,rgb(var(--c-primary))_0_14px,transparent_14px_28px,#2f6bff_28px_42px,transparent_42px_56px)]';
  return (
    <div>
      <ScrapHeading label={d.label} title={d.title} subtitle={d.subtitle} center />
      <div className="relative overflow-hidden rounded-[1.75rem] bg-surface shadow-[0_40px_80px_-40px_rgb(0_0_0/0.5)] ring-1 ring-fg/10">
        <div aria-hidden className={cn('h-3', airmail)} />
        <div className="grid gap-10 p-6 sm:p-10 lg:grid-cols-[1.25fr_1fr] lg:gap-0">
          <div className="lg:pr-10">
            {d.message && <p className="mb-6 font-heading text-2xl font-bold leading-snug text-fg"><Doodled text={d.message} /></p>}
            <ContactForm subjects={(d.subjects || []).filter(Boolean)} />
          </div>
          <div className="relative lg:border-l-2 lg:border-dashed lg:border-fg/15 lg:pl-10">
            <div className="flex items-start justify-between gap-4">
              {/* Postage stamp: dotted white edge reads as perforation. */}
              <div className="grid h-24 w-20 rotate-6 place-items-center border-[5px] border-dotted border-surface bg-white p-1 shadow-md outline outline-1 outline-fg/10">
                <div className="grid h-full w-full place-items-center bg-accent text-4xl">{d.stampEmoji || '✉️'}</div>
              </div>
              {d.postmark && <Stamp id="scrap-postmark" text={d.postmark} center="📍" className="relative h-28 w-28 -rotate-12 border-dashed !border-primary !bg-transparent !shadow-none [&_text]:fill-primary" />}
            </div>
            <ul className="mt-8">
              {rows.map((r, i) => {
                const Icon = ICONS[r.icon] || Globe;
                const Tag = r.url ? 'a' : 'div';
                return (
                  <li key={i} className="border-b-2 border-dashed border-fg/15">
                    <Tag {...(r.url ? { href: r.url, ...linkProps(r.url) } : {})} className="group flex items-center gap-4 py-4">
                      <span className={cn('grid h-11 w-11 shrink-0 place-items-center rounded-xl text-[#1c1a17] transition group-hover:-rotate-6', `border-2 border-[#1c1a17]`)} style={{ backgroundColor: STICKER_COLORS[i % STICKER_COLORS.length] }}><Icon className="h-5 w-5" /></span>
                      <span className="min-w-0">
                        <span className="block text-xs font-bold uppercase tracking-wider text-fg/45">{r.label}</span>
                        <span className="block truncate font-semibold text-fg group-hover:text-primary">{r.value}</span>
                      </span>
                    </Tag>
                  </li>
                );
              })}
            </ul>
            {socials.length > 0 && <div className="mt-8 flex flex-wrap gap-3">{socials.map((s, i) => <Social key={i} s={s} />)}</div>}
            {d.signoff && <p className="mt-8 font-heading text-lg font-bold text-fg/70">{d.signoff}</p>}
          </div>
        </div>
        <div aria-hidden className={cn('h-3', airmail)} />
      </div>
    </div>
  );
}

export const SCRAP_RENDERERS = { scrapHero: ScrapHero, scrapAbout: ScrapAbout, scrapProjects: ScrapProjects, scrapNotes: ScrapNotes, scrapHistory: ScrapHistory, scrapContact: ScrapContact };
