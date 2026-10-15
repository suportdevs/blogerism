import Link from 'next/link';
import { ArrowRight, ArrowUpRight, Linkedin, Mail, Play, Twitter } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { feedFor } from '@/lib/blockData';
import { cn, formatDuration, postUrl, stripHtml, toTrack } from '@/lib/utils';
import { PlayButton } from './AudioPlayer';
import { CountUp } from './ShowcaseClient';
import { AccordionImage, BeforeAfter, CardCarousel, ComparisonTable, Countdown, FeatureTabs, JobBoard, ScrollSteps, VideoLightbox } from './InteractiveClient';

function Heading({ eyebrow, title, subtitle, left, className }) {
  if (!eyebrow && !title && !subtitle) return null;
  return (
    <div className={cn('mb-12 max-w-2xl', !left && 'mx-auto text-center', className)}>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      {title && <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">{title}</h2>}
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-fg/60">{subtitle}</p>}
    </div>
  );
}

/* ---------------------------------- Team ---------------------------------- */
function Socials({ m, className }) {
  const links = [[m.linkedin, Linkedin, 'LinkedIn'], [m.twitter, Twitter, 'X'], [m.email && `mailto:${m.email}`, Mail, 'Email']].filter(([u]) => u);
  if (!links.length) return null;
  return (
    <div className={cn('flex gap-2', className)}>
      {links.map(([href, Icon, label]) => (
        <a key={label} href={href} aria-label={label} className="grid h-9 w-9 place-items-center rounded-full bg-white/15 text-white backdrop-blur transition hover:scale-110 hover:bg-white hover:text-gray-900"><Icon className="h-4 w-4" /></a>
      ))}
    </div>
  );
}

function Team({ d }) {
  const members = d.members || [];
  const cols = Number(d.columns) === 3 ? 'lg:grid-cols-3' : 'lg:grid-cols-4';
  return (
    <>
      <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
      <div className={cn('grid gap-6 sm:grid-cols-2', cols)}>
        {members.map((m, i) => {
          if (d.variant === 'round') {
            return (
              <div key={i} className="group text-center">
                <div className="relative mx-auto h-44 w-44">
                  <div className="absolute -inset-1.5 rounded-full bg-[conic-gradient(from_0deg,rgb(var(--c-primary)),rgb(var(--c-accent)),rgb(var(--c-primary)))] opacity-0 transition duration-500 group-hover:rotate-180 group-hover:opacity-100" />
                  <div className="absolute inset-0 rounded-full border-4 border-bg bg-surface" />
                  {m.image && <img src={m.image} alt={m.name} className="relative h-full w-full rounded-full border-4 border-bg object-cover" />}
                </div>
                <h3 className="mt-5 font-heading text-lg font-bold text-fg">{m.name}</h3>
                <div className="text-sm font-semibold text-primary">{m.role}</div>
                {m.bio && <p className="mx-auto mt-2 max-w-[16rem] text-sm text-fg/55">{m.bio}</p>}
                <Socials m={m} className="mt-4 justify-center [&_a]:bg-fg/5 [&_a]:text-fg/70" />
              </div>
            );
          }
          if (d.variant === 'portrait') {
            return (
              <div key={i} className={cn('group relative aspect-[3/4] overflow-hidden rounded-theme-lg bg-surface', i % 2 && 'lg:translate-y-10')}>
                {m.image && <img src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-cover grayscale transition duration-700 group-hover:scale-105 group-hover:grayscale-0" />}
                <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent" />
                <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                  <div className="text-xs font-semibold uppercase tracking-[0.2em] text-white/65">{m.role}</div>
                  <h3 className="mt-1 font-heading text-2xl font-bold">{m.name}</h3>
                  <div className="grid grid-rows-[0fr] transition-all duration-500 group-hover:grid-rows-[1fr]">
                    <div className="overflow-hidden"><Socials m={m} className="pt-4" /></div>
                  </div>
                </div>
              </div>
            );
          }
          return (
            <div key={i} className="group">
              <div className="relative aspect-[4/5] overflow-hidden rounded-theme-lg bg-surface">
                {m.image && <img src={m.image} alt={m.name} className="absolute inset-0 h-full w-full object-cover transition duration-700 group-hover:scale-110" />}
                <div className="absolute inset-0 flex flex-col justify-end bg-gradient-to-t from-primary/95 via-primary/60 to-transparent p-5 text-white opacity-0 transition duration-500 group-hover:opacity-100">
                  <p className="translate-y-4 text-sm leading-relaxed transition duration-500 group-hover:translate-y-0">{m.bio}</p>
                  <Socials m={m} className="mt-4 translate-y-4 transition delay-75 duration-500 group-hover:translate-y-0" />
                </div>
              </div>
              <h3 className="mt-4 font-heading text-lg font-bold text-fg">{m.name}</h3>
              <div className="text-sm text-fg/55">{m.role}</div>
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ---------------------------------- Steps --------------------------------- */
function Steps({ d }) {
  const items = d.items || [];
  if (d.variant === 'vertical') return <><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} /><ScrollSteps items={items} /></>;
  if (d.variant === 'cards') {
    return (
      <>
        <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
        <div className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
          {items.map((it, i) => {
            const Icon = ICONS[it.icon] || ICONS.Star;
            return (
              <div key={i} className="group relative overflow-hidden rounded-theme-lg border border-fg/10 bg-bg p-7 transition duration-500 hover:-translate-y-2 hover:border-primary/40 hover:shadow-2xl">
                <div className="absolute -right-6 -top-10 font-heading text-[9rem] font-black leading-none text-transparent opacity-40 transition duration-500 [-webkit-text-stroke:1.5px_rgb(var(--c-fg)/0.12)] group-hover:opacity-100 group-hover:[-webkit-text-stroke:1.5px_rgb(var(--c-primary)/0.5)]">{i + 1}</div>
                <span className="relative grid h-12 w-12 place-items-center rounded-theme bg-gradient-to-br from-primary to-accent text-white shadow-lg transition group-hover:rotate-6 group-hover:scale-110"><Icon className="h-6 w-6" /></span>
                <h3 className="relative mt-6 font-heading text-xl font-bold text-fg">{it.title}</h3>
                {it.text && <p className="relative mt-2 text-sm leading-relaxed text-fg/60">{it.text}</p>}
                <span className="absolute inset-x-0 bottom-0 h-1 origin-left scale-x-0 bg-gradient-to-r from-primary to-accent transition duration-500 group-hover:scale-x-100" />
              </div>
            );
          })}
        </div>
      </>
    );
  }
  return (
    <>
      <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
      <div className="relative grid gap-10 md:gap-6" style={{ gridTemplateColumns: `repeat(auto-fit, minmax(${items.length > 4 ? 170 : 210}px, 1fr))` }}>
        <div aria-hidden className="absolute left-[8%] right-[8%] top-7 hidden h-0.5 bg-gradient-to-r from-primary/0 via-primary/40 to-primary/0 md:block" />
        {items.map((it, i) => {
          const Icon = ICONS[it.icon] || ICONS.Star;
          return (
            <div key={i} className="group relative text-center">
              <div className="relative mx-auto grid h-14 w-14 place-items-center rounded-full border-2 border-primary/30 bg-bg text-primary transition duration-500 group-hover:scale-110 group-hover:border-primary group-hover:bg-primary group-hover:text-white group-hover:shadow-glow">
                <Icon className="h-6 w-6" />
                <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-accent text-[11px] font-bold text-white">{i + 1}</span>
              </div>
              <h3 className="mt-5 font-heading text-lg font-bold text-fg">{it.title}</h3>
              {it.text && <p className="mx-auto mt-2 max-w-xs text-sm leading-relaxed text-fg/60">{it.text}</p>}
            </div>
          );
        })}
      </div>
    </>
  );
}

/* ------------------------------ Tabs / tables ------------------------------ */
const FeatureTabsBlock = ({ d }) => <><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} /><FeatureTabs d={d} /></>;
const ComparisonBlock = ({ d }) => <><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} /><ComparisonTable d={d} /></>;
const AccordionBlock = ({ d }) => <><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} left className="mb-10" /><AccordionImage d={d} /></>;

function BeforeAfterBlock({ d }) {
  if (d.layout === 'split') {
    return (
      <div className="grid items-center gap-10 lg:grid-cols-[1fr_1.5fr]">
        <div>
          {d.eyebrow && <span className="eyebrow mb-4">{d.eyebrow}</span>}
          {d.title && <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{d.title}</h2>}
          {d.text && <p className="mt-4 text-lg leading-relaxed text-fg/60">{d.text}</p>}
        </div>
        <BeforeAfter d={d} />
      </div>
    );
  }
  return <><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.text} /><div className="mx-auto max-w-5xl"><BeforeAfter d={d} /></div></>;
}

/* -------------------------------- Logo wall -------------------------------- */
function Logo({ l }) {
  const inner = l.image
    ? <img src={l.image} alt={l.name} className="h-8 w-auto max-w-[140px] object-contain opacity-60 grayscale transition duration-300 group-hover:opacity-100 group-hover:grayscale-0 sm:h-10" />
    : <span className="whitespace-nowrap font-heading text-2xl font-extrabold tracking-tight text-fg/35 transition duration-300 group-hover:text-fg sm:text-3xl">{l.name}</span>;
  return l.url ? <a href={l.url} className="group">{inner}</a> : <span className="group">{inner}</span>;
}

function LogoWall({ d }) {
  const logos = d.logos || [];
  return (
    <>
      {d.title && <p className="mb-10 text-center text-xs font-semibold uppercase tracking-[0.3em] text-fg/45">{d.title}</p>}
      {d.variant === 'grid' ? (
        <div className="grid grid-cols-2 overflow-hidden rounded-theme-lg border border-fg/10 sm:grid-cols-3 lg:grid-cols-4">
          {logos.map((l, i) => (
            <div key={i} className="relative flex h-32 items-center justify-center border-b border-r border-fg/10 transition hover:bg-surface [&:hover_span]:text-fg">
              <Logo l={l} />
            </div>
          ))}
        </div>
      ) : (
        <div className="group/m relative -mx-5 overflow-hidden sm:-mx-8 [mask-image:linear-gradient(90deg,transparent,black_12%,black_88%,transparent)]">
          <div className="flex w-max animate-marquee items-center gap-16 pr-16 group-hover/m:[animation-play-state:paused]" style={{ animationDuration: `${Number(d.speed) || 30}s` }}>
            {[...logos, ...logos, ...logos, ...logos].map((l, i) => <Logo key={i} l={l} />)}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------ Video lightbox ------------------------------ */
function VideoLightboxBlock({ d }) {
  if (d.layout === 'split') {
    return (
      <div className="grid items-center gap-12 lg:grid-cols-[1fr_1.3fr]">
        <div>
          {d.eyebrow && <span className="eyebrow mb-4">{d.eyebrow}</span>}
          {d.title && <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-5xl">{d.title}</h2>}
          {d.text && <p className="mt-5 text-lg leading-relaxed text-fg/60">{d.text}</p>}
          {!!d.stats?.length && (
            <div className="mt-8 grid grid-cols-2 gap-6 border-t border-fg/10 pt-8 sm:grid-cols-3">
              {d.stats.map((s, i) => <div key={i}><div className="font-heading text-3xl font-extrabold text-fg"><CountUp value={s.value} /></div><div className="mt-1 text-sm text-fg/55">{s.label}</div></div>)}
            </div>
          )}
        </div>
        <div className="relative">
          <div className="absolute -inset-6 rounded-[2rem] bg-gradient-to-tr from-primary/30 to-accent/30 blur-3xl" />
          <VideoLightbox poster={d.poster} videoUrl={d.videoUrl} duration={d.duration} className="aspect-video" />
        </div>
      </div>
    );
  }
  return (
    <>
      <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.text} />
      <VideoLightbox poster={d.poster} videoUrl={d.videoUrl} duration={d.duration} className="aspect-[16/9] sm:aspect-[21/9]" />
      {!!d.stats?.length && (
        <div className="mx-auto mt-10 flex max-w-3xl flex-wrap justify-center gap-x-12 gap-y-6 text-center">
          {d.stats.map((s, i) => <div key={i}><div className="font-heading text-3xl font-extrabold text-fg"><CountUp value={s.value} /></div><div className="mt-1 text-sm text-fg/55">{s.label}</div></div>)}
        </div>
      )}
    </>
  );
}

/* --------------------------------- Countdown -------------------------------- */
function CountdownBlock({ d }) {
  const image = d.variant === 'image';
  const body = (
    <div className={cn('mx-auto max-w-4xl text-center', image && 'text-white')}>
      {d.eyebrow && <span className={cn('eyebrow mb-5', image && 'border-white/25 bg-white/10 text-white')}><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-current" />{d.eyebrow}</span>}
      {d.title && <h2 className={cn('font-heading text-4xl font-extrabold tracking-tight sm:text-6xl', !image && 'text-fg')}>{d.title}</h2>}
      {d.text && <p className={cn('mx-auto mt-4 max-w-2xl text-lg', image ? 'text-white/75' : 'text-fg/60')}>{d.text}</p>}
      <div className={cn('mt-10', !image && d.variant !== 'minimal' && 'text-fg')}><Countdown date={d.date} variant={d.variant} expiredText={d.expiredText} /></div>
      {d.buttonLabel && <Link href={d.buttonUrl || '#'} className={cn('mt-10', image ? 'btn-site bg-white text-gray-900 hover:-translate-y-0.5' : 'btn-site-primary')}>{d.buttonLabel}<ArrowRight className="h-4 w-4" /></Link>}
    </div>
  );
  if (!image) return body;
  return (
    <div className="relative overflow-hidden rounded-theme-lg bg-gray-900 px-5 py-20 sm:px-10 sm:py-28">
      {d.image && <img src={d.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-60 animate-[kenburns_20s_ease-out_both]" />}
      <div className="absolute inset-0 bg-gradient-to-b from-black/60 via-black/40 to-black/80" />
      <div className="relative">{body}</div>
    </div>
  );
}

/* ------------------------------ Episode spotlight ------------------------------ */
function EpisodeSpotlight({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  if (!items.length) return <p className="py-10 text-center text-fg/45">No {d.format === 'VIDEO' ? 'videos' : d.format === 'AUDIO' ? 'episodes' : 'posts'} published yet.</p>;
  const [main, ...rest] = items;
  const audio = main.format === 'AUDIO' && main.audioUrl;
  const tracks = items.filter((p) => p.audioUrl).map(toTrack);
  const cover = main.coverImage || main.series?.poster;
  return (
    <>
      {(d.eyebrow || d.title) && (
        <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
          <div>{d.eyebrow && <span className="eyebrow mb-3">{d.eyebrow}</span>}{d.title && <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{d.title}</h2>}</div>
          {d.linkLabel && d.linkUrl && <Link href={d.linkUrl} className="inline-flex items-center gap-1.5 font-semibold text-primary hover:gap-2.5">{d.linkLabel}<ArrowRight className="h-4 w-4" /></Link>}
        </div>
      )}
      <div className="grid gap-6 lg:grid-cols-[1.6fr_1fr]">
        <div className="group relative isolate overflow-hidden rounded-theme-lg bg-gray-950 text-white">
          {cover && <img src={cover} alt="" className="absolute inset-0 -z-10 h-full w-full scale-125 object-cover opacity-50 blur-2xl" />}
          <div className="absolute inset-0 -z-10 bg-gradient-to-br from-black/30 via-black/50 to-black/80" />
          <div className="flex flex-col gap-7 p-6 sm:flex-row sm:items-center sm:p-10">
            <Link href={postUrl(main)} className={cn('relative shrink-0 overflow-hidden rounded-theme shadow-2xl', audio ? 'aspect-square w-40 sm:w-56' : 'aspect-video w-full sm:w-72')}>
              {cover && <img src={cover} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
              {!audio && <span className="absolute inset-0 grid place-items-center bg-black/25"><span className="grid h-14 w-14 place-items-center rounded-full bg-white/90 text-gray-900 shadow-xl transition group-hover:scale-110"><Play className="ml-0.5 h-6 w-6 fill-current" /></span></span>}
            </Link>
            <div className="min-w-0">
              <div className="flex flex-wrap items-center gap-2 text-xs font-semibold uppercase tracking-wider text-white/60">
                {main.series?.title && <span className="rounded-full bg-white/15 px-2.5 py-1 text-white">{main.series.title}</span>}
                {[main.episode && `Episode ${main.episode}`, main.duration && formatDuration(main.duration)].filter(Boolean).join(' · ')}
              </div>
              <Link href={postUrl(main)}><h3 className="mt-3 font-heading text-2xl font-extrabold leading-tight hover:underline sm:text-3xl">{main.title}</h3></Link>
              {(main.excerpt || main.content) && <p className="mt-3 line-clamp-3 text-white/70">{main.excerpt || stripHtml(main.content || '').slice(0, 220)}</p>}
              <div className="mt-6 flex flex-wrap items-center gap-4">
                {audio ? <PlayButton tracks={tracks} index={0} label="Play episode" /> : <Link href={postUrl(main)} className="btn-site bg-white text-gray-900 hover:-translate-y-0.5"><Play className="h-4 w-4 fill-current" />{main.format === 'VIDEO' ? 'Watch now' : 'Read story'}</Link>}
                {audio && (
                  <div aria-hidden className="flex h-8 items-end gap-[3px]">
                    {Array.from({ length: 28 }, (_, i) => <span key={i} className="w-[3px] origin-bottom rounded-full bg-white/50" style={{ height: `${25 + ((i * 37) % 75)}%`, animation: `bar-grow ${0.8 + (i % 5) * 0.15}s ease-in-out ${i * 0.04}s infinite alternate` }} />)}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="rounded-theme-lg border border-fg/10 bg-bg p-4 sm:p-5">
          <div className="mb-2 px-2 text-xs font-bold uppercase tracking-[0.2em] text-fg/45">Up next</div>
          <div className="divide-y divide-fg/5">
            {rest.map((p) => {
              const ti = tracks.findIndex((t) => t.id === p.id);
              return (
                <div key={p.id} className="group flex items-center gap-3 rounded-theme p-2 transition hover:bg-surface">
                  <Link href={postUrl(p)} className="relative h-16 w-16 shrink-0 overflow-hidden rounded-theme bg-surface sm:w-24">
                    {(p.coverImage || p.series?.poster) && <img src={p.coverImage || p.series?.poster} alt="" className="h-full w-full object-cover transition group-hover:scale-110" />}
                  </Link>
                  <div className="min-w-0 flex-1">
                    <Link href={postUrl(p)} className="line-clamp-2 text-sm font-bold text-fg hover:text-primary">{p.title}</Link>
                    <div className="mt-1 text-xs text-fg/50">{[p.series?.title, p.duration && formatDuration(p.duration)].filter(Boolean).join(' · ')}</div>
                  </div>
                  {ti >= 0 ? <PlayButton tracks={tracks} index={ti} size="sm" /> : <ArrowUpRight className="h-4 w-4 shrink-0 text-fg/30 transition group-hover:text-primary" />}
                </div>
              );
            })}
            {!rest.length && <p className="p-2 text-sm text-fg/45">More coming soon.</p>}
          </div>
        </div>
      </div>
    </>
  );
}

export const INTERACTIVE_RENDERERS = {
  team: Team,
  steps: Steps,
  featureTabs: FeatureTabsBlock,
  comparison: ComparisonBlock,
  beforeAfter: BeforeAfterBlock,
  accordionImage: AccordionBlock,
  logoWall: LogoWall,
  videoLightbox: VideoLightboxBlock,
  cardCarousel: ({ d }) => <CardCarousel d={d} />,
  jobs: ({ d }) => <><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} /><JobBoard d={d} /></>,
  countdown: CountdownBlock,
  episodeSpotlight: EpisodeSpotlight,
};
