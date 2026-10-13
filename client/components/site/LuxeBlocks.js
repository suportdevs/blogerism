import Link from 'next/link';
import { ArrowRight } from 'lucide-react';
import { feedFor } from '@/lib/blockData';
import { cn, formatDate, formatDuration, postUrl, seriesUrl } from '@/lib/utils';
import { LuxeListRows, LuxeQuotes } from './LuxeClient';

export function Ornament({ className }) {
  return (
    <div className={cn('flex items-center justify-center gap-4 text-primary', className)} aria-hidden>
      <span className="h-px w-14 bg-primary/50" /><span className="text-sm">✦</span><span className="h-px w-14 bg-primary/50" />
    </div>
  );
}

function Overline({ children, center = true, light }) {
  if (!children) return null;
  return (
    <div className={cn('mb-5 flex items-center gap-4 text-[11px] font-medium uppercase tracking-[0.38em]', center && 'justify-center', light ? 'text-white/80' : 'text-primary')}>
      <span className="h-px w-8 bg-current opacity-60" />{children}{center && <span className="h-px w-8 bg-current opacity-60" />}
    </div>
  );
}

function TextLink({ href, children, light }) {
  return (
    <Link href={href || '#'} className={cn('group inline-flex items-center gap-3 text-[11px] font-medium uppercase tracking-[0.3em]', light ? 'text-white' : 'text-fg')}>
      <span className="relative pb-1">{children}<span className="absolute inset-x-0 bottom-0 h-px origin-left bg-current transition-transform duration-500 group-hover:scale-x-0" /></span>
      <ArrowRight className="h-3.5 w-3.5 transition-transform duration-500 group-hover:translate-x-1" />
    </Link>
  );
}

/* ------------------------------ Hero ------------------------------ */
function LuxeHero({ d }) {
  const dark = Math.min(80, Math.max(0, Number(d.overlay ?? 40))) / 100;
  return (
    <div className={cn('relative -mx-5 overflow-hidden bg-black text-white sm:-mx-8', d.height === 'tall' ? 'h-[80vh] min-h-[560px]' : 'h-[100svh] min-h-[640px]')}>
      {d.video ? (
        <video src={d.video} poster={d.image || undefined} autoPlay muted loop playsInline className="absolute inset-0 h-full w-full object-cover" />
      ) : d.image ? (
        <img src={d.image} alt="" className="absolute inset-0 h-full w-full object-cover" style={{ animation: 'kenburns 20s ease-out forwards' }} />
      ) : null}
      <div className="absolute inset-0" style={{ background: `rgba(0,0,0,${dark})` }} />
      <div className="absolute inset-0 bg-gradient-to-b from-black/50 via-transparent to-black/70" />
      <div className="pointer-events-none absolute inset-5 border border-white/15 sm:inset-10" />
      <div className={cn('relative flex h-full flex-col justify-center px-8 sm:px-20', d.align === 'left' ? 'items-start text-left' : 'items-center text-center')}>
        {d.overline && <div className="animate-fade-up"><Overline center={d.align !== 'left'} light>{d.overline}</Overline></div>}
        <h1 className="max-w-5xl animate-fade-up font-heading text-5xl leading-[0.98] sm:text-7xl lg:text-[6.5rem]" style={{ animationDelay: '150ms' }}>
          {d.title}
          {d.italic && <span className="block italic text-primary">{d.italic}</span>}
        </h1>
        {d.subtitle && <p className="mt-8 max-w-xl animate-fade-up text-base leading-relaxed text-white/75 sm:text-lg" style={{ animationDelay: '300ms' }}>{d.subtitle}</p>}
        {d.buttonLabel && (
          <Link href={d.buttonUrl || '#'} className="mt-12 animate-fade-up border border-white/50 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.32em] transition duration-500 hover:bg-white hover:text-black" style={{ animationDelay: '450ms' }}>
            {d.buttonLabel}
          </Link>
        )}
      </div>
      <div className="absolute bottom-10 left-1/2 flex -translate-x-1/2 flex-col items-center gap-3 text-[10px] uppercase tracking-[0.4em] text-white/70">
        Scroll
        <span className="relative h-12 w-px overflow-hidden bg-white/25"><span className="absolute left-0 top-0 h-2 w-px bg-white" style={{ animation: 'scroll-dot 2s ease-in-out infinite' }} /></span>
      </div>
    </div>
  );
}

/* ------------------------------ Statement ------------------------------ */
function LuxeStatement({ d }) {
  return (
    <div className="mx-auto max-w-4xl text-center">
      <Ornament className="mb-10" />
      <Overline>{d.overline}</Overline>
      <p className="font-heading text-3xl leading-[1.35] text-fg sm:text-[2.6rem] sm:leading-[1.3]">{d.text}</p>
      {d.signature && <p className="mt-10 font-heading text-xl italic text-primary">— {d.signature}</p>}
    </div>
  );
}

/* ------------------------------ Split ------------------------------ */
function LuxeSplit({ d }) {
  const right = d.imagePosition === 'right';
  return (
    <div className="grid items-center gap-16 text-left lg:grid-cols-2 lg:gap-24">
      <div className={cn('relative', right && 'lg:order-2')}>
        <div className={cn('absolute inset-0 border border-primary/50', right ? '-translate-x-5 translate-y-5' : 'translate-x-5 translate-y-5')} />
        <div className="group relative overflow-hidden">
          {d.image ? <img src={d.image} alt="" className="aspect-[4/5] w-full object-cover transition duration-[1500ms] group-hover:scale-105" /> : <div className="aspect-[4/5] bg-surface" />}
        </div>
      </div>
      <div className={cn(right && 'lg:order-1')}>
        {d.number && <div className="font-heading text-7xl leading-none text-primary/35 sm:text-8xl">{d.number}</div>}
        <div className="mt-6"><Overline center={false}>{d.overline}</Overline></div>
        <h2 className="font-heading text-4xl leading-tight text-fg sm:text-5xl">{d.title}</h2>
        <div className="my-8 h-px w-16 bg-primary" />
        {d.text && <div className="space-y-4 text-lg leading-relaxed text-fg/65">{d.text.split(/\n\s*\n/).map((p, i) => <p key={i}>{p}</p>)}</div>}
        {d.buttonLabel && <div className="mt-10"><TextLink href={d.buttonUrl}>{d.buttonLabel}</TextLink></div>}
      </div>
    </div>
  );
}

/* ------------------------------ Heading ------------------------------ */
function LuxeHeading({ d, center = true }) {
  if (!d.overline && !d.title) return null;
  return (
    <div className={cn('mb-14 flex flex-wrap items-end gap-6', center ? 'flex-col items-center text-center' : 'justify-between text-left')}>
      <div>
        <Overline center={center}>{d.overline}</Overline>
        {d.title && <h2 className="font-heading text-4xl leading-tight text-fg sm:text-5xl">{d.title}</h2>}
      </div>
      {d.linkLabel && d.linkUrl && <TextLink href={d.linkUrl}>{d.linkLabel}</TextLink>}
    </div>
  );
}

const rowFor = (item) => (item.type && !item.format
  ? { title: item.title, href: seriesUrl(item), image: item.poster || item.backdrop, meta: [item.year, item.episodeCount != null && `${item.episodeCount} episodes`].filter(Boolean).join(' · ') }
  : { title: item.title, href: postUrl(item), image: item.coverImage || item.series?.poster, meta: [item.categories?.[0]?.name || item.series?.title, item.duration ? formatDuration(item.duration) : formatDate(item.publishedAt, { month: 'short', day: 'numeric' })].filter(Boolean).join(' · ') });

/* ------------------------------ List (dynamic) ------------------------------ */
function LuxeList({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  return (
    <>
      <LuxeHeading d={d} center={false} />
      {items.length ? <LuxeListRows rows={items.map(rowFor)} /> : <p className="py-10 text-center text-fg/50">No content matches this block’s filters yet.</p>}
    </>
  );
}

/* ------------------------------ Featured (dynamic) ------------------------------ */
function LuxeFeatured({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  const [lead, ...rest] = items;
  return (
    <>
      <LuxeHeading d={d} center={false} />
      {!lead ? <p className="py-10 text-center text-fg/50">No content matches this block’s filters yet.</p> : (
        <div className="grid gap-12 text-left lg:grid-cols-[1.45fr_1fr] lg:gap-16">
          <Link href={postUrl(lead)} className="group block">
            <div className="overflow-hidden">{lead.coverImage && <img src={lead.coverImage} alt="" className="aspect-[4/3] w-full object-cover transition duration-[1500ms] group-hover:scale-105" />}</div>
            <div className="mt-6 text-[11px] uppercase tracking-[0.3em] text-primary">{lead.categories?.[0]?.name}{lead.publishedAt && <span className="text-fg/45"> · {formatDate(lead.publishedAt)}</span>}</div>
            <h3 className="mt-3 font-heading text-3xl leading-tight text-fg transition group-hover:text-primary sm:text-[2.6rem]">{lead.title}</h3>
            {lead.excerpt && <p className="mt-4 max-w-2xl text-lg leading-relaxed text-fg/60">{lead.excerpt}</p>}
          </Link>
          <div className="divide-y divide-fg/15 border-y border-fg/15">
            {rest.map((p, i) => (
              <Link key={p.id} href={postUrl(p)} className="group flex gap-5 py-6">
                <span className="font-heading text-3xl italic leading-none text-primary">{String(i + 2).padStart(2, '0')}</span>
                <div className="min-w-0 flex-1">
                  <div className="text-[10px] uppercase tracking-[0.3em] text-fg/45">{p.categories?.[0]?.name || p.series?.title}</div>
                  <h4 className="mt-1.5 font-heading text-xl leading-snug text-fg transition group-hover:text-primary">{p.title}</h4>
                </div>
                {p.coverImage && <img src={p.coverImage} alt="" className="h-20 w-20 shrink-0 object-cover grayscale transition duration-500 group-hover:grayscale-0" />}
              </Link>
            ))}
          </div>
        </div>
      )}
    </>
  );
}

/* ------------------------------ Quotes & CTA ------------------------------ */
function LuxeQuote({ d, ctx }) {
  return (<><LuxeHeading d={d} /><LuxeQuotes items={ctx.testimonials || []} /></>);
}

function LuxeCta({ d }) {
  return (
    <div className="relative -mx-5 flex min-h-[70vh] items-center justify-center overflow-hidden bg-black bg-cover bg-fixed bg-center px-8 py-24 text-center text-white sm:-mx-8" style={d.image ? { backgroundImage: `linear-gradient(rgba(0,0,0,.55),rgba(0,0,0,.55)),url(${d.image})` } : undefined}>
      <div className="pointer-events-none absolute inset-5 border border-white/15 sm:inset-10" />
      <div className="relative max-w-3xl">
        <Overline light>{d.overline}</Overline>
        <h2 className="font-heading text-4xl leading-tight sm:text-6xl">{d.title}</h2>
        {d.text && <p className="mx-auto mt-6 max-w-xl text-lg text-white/75">{d.text}</p>}
        {d.buttonLabel && <Link href={d.buttonUrl || '#'} className="mt-12 inline-block border border-white/50 px-10 py-4 text-[11px] font-medium uppercase tracking-[0.32em] transition duration-500 hover:bg-white hover:text-black">{d.buttonLabel}</Link>}
      </div>
    </div>
  );
}

export const LUXE_RENDERERS = {
  luxeHero: LuxeHero, luxeStatement: LuxeStatement, luxeSplit: LuxeSplit, luxeList: LuxeList,
  luxeFeatured: LuxeFeatured, luxeQuote: LuxeQuote, luxeCta: LuxeCta,
};
