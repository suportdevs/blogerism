import { Mail, MapPin, Phone } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import { HeroSlideshow, MasonryGallery, MenuTabs, OpeningHours, PricingToggle, ReservationForm, Spotlight, SpotlightHero } from './ShowcaseClient';

function Heading({ eyebrow, title, subtitle, className }) {
  if (!eyebrow && !title && !subtitle) return null;
  return (
    <div className={cn('mx-auto mb-14 max-w-2xl text-center', className)}>
      {eyebrow && <div className="mb-4 text-xs font-semibold uppercase tracking-[0.3em] text-primary">{eyebrow}</div>}
      {title && <h2 className="font-heading text-4xl font-semibold leading-tight tracking-tight text-fg sm:text-5xl">{title}</h2>}
      {subtitle && <p className="mt-4 text-lg text-fg/60">{subtitle}</p>}
    </div>
  );
}

/* ------------------------------ Bento grid ------------------------------ */
const SIZE = { sm: '', wide: 'md:col-span-2', tall: 'md:row-span-2', lg: 'md:col-span-2 md:row-span-2' };

function Visual({ type }) {
  if (type === 'chart') {
    return (
      <div className="mt-auto flex h-24 items-end gap-1.5">
        {[40, 65, 50, 80, 60, 95, 75].map((h, i) => <div key={i} className="flex-1 origin-bottom rounded-t-md bg-gradient-to-t from-primary/40 to-accent transition-transform duration-500 group-hover:scale-y-110" style={{ height: `${h}%` }} />)}
      </div>
    );
  }
  if (type === 'code') {
    return (
      <pre className="mt-auto overflow-hidden rounded-xl border border-fg/10 bg-black/40 p-4 font-mono text-[11px] leading-relaxed text-slate-300">
        <span className="text-fuchsia-400">const</span> res = <span className="text-sky-300">await</span> pulse.<span className="text-amber-300">track</span>({'{'}{'\n'}
        {'  '}event: <span className="text-emerald-400">&apos;signup&apos;</span>,{'\n'}
        {'  '}plan: <span className="text-emerald-400">&apos;pro&apos;</span>,{'\n'}
        {'}'});
      </pre>
    );
  }
  if (type === 'avatars') {
    return (
      <div className="mt-auto flex -space-x-3">
        {[5, 12, 32, 47, 33, 15].map((n) => <img key={n} src={`https://i.pravatar.cc/80?img=${n}`} alt="" className="h-11 w-11 rounded-full border-2 border-bg object-cover transition group-hover:translate-y-[-4px]" />)}
        <span className="grid h-11 w-11 place-items-center rounded-full border-2 border-bg bg-primary text-xs font-bold text-white">+2k</span>
      </div>
    );
  }
  if (type === 'globe') {
    return (
      <div className="relative mx-auto mt-auto aspect-square w-40">
        <div className="absolute inset-0 rounded-full border border-fg/15 bg-[radial-gradient(circle_at_30%_30%,rgb(var(--c-accent)/.35),transparent_60%)]" />
        {[0, 30, 60, 90, 120, 150].map((r) => <div key={r} className="absolute inset-0 rounded-full border border-fg/10" style={{ transform: `rotateY(${r}deg) scaleX(${Math.cos((r * Math.PI) / 180) || 0.02})` }} />)}
        {[[20, 35], [62, 28], [45, 60], [75, 66], [30, 72]].map(([x, y], i) => <span key={i} className="absolute h-2 w-2 animate-ping rounded-full bg-accent" style={{ left: `${x}%`, top: `${y}%`, animationDelay: `${i * 0.4}s` }} />)}
      </div>
    );
  }
  if (type === 'metrics') {
    return (
      <div className="mt-auto space-y-2">
        {[['Uptime', 99.99], ['Speed score', 98], ['Satisfaction', 96]].map(([l, v]) => (
          <div key={l}>
            <div className="mb-1 flex justify-between text-xs text-fg/60"><span>{l}</span><span className="font-bold text-fg">{v}%</span></div>
            <div className="h-1.5 overflow-hidden rounded-full bg-fg/10"><div className="h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${v}%` }} /></div>
          </div>
        ))}
      </div>
    );
  }
  return null;
}

function BentoGrid({ d }) {
  return (
    <>
      <Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} />
      <Spotlight className="grid auto-rows-[minmax(220px,auto)] gap-4 text-left md:grid-cols-4">
        {(d.items || []).map((item, i) => {
          const Icon = ICONS[item.icon];
          return (
            <div key={i} data-spot className={cn('group relative flex flex-col overflow-hidden rounded-theme-lg border border-fg/10 bg-surface/60 p-6 transition duration-300 hover:border-primary/40', SIZE[item.size] || '')}>
              <div className="pointer-events-none absolute inset-0 opacity-0 transition duration-300 group-hover:opacity-100" style={{ background: 'radial-gradient(420px circle at var(--mx) var(--my), rgb(var(--c-primary)/.16), transparent 45%)' }} />
              {item.image && <img src={item.image} alt="" className="absolute inset-0 h-full w-full object-cover opacity-40 transition duration-700 group-hover:scale-105 group-hover:opacity-50" />}
              <div className="relative flex h-full flex-col gap-3">
                {Icon && <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-primary to-accent text-white shadow-glow"><Icon className="h-5 w-5" /></span>}
                <h3 className="font-heading text-xl font-bold text-fg">{item.title}</h3>
                {item.text && <p className="text-sm leading-relaxed text-fg/60">{item.text}</p>}
                <Visual type={item.visual} />
              </div>
            </div>
          );
        })}
      </Spotlight>
    </>
  );
}

/* ------------------------------ Text marquee ------------------------------ */
function TextMarquee({ d }) {
  const words = d.items || [];
  const row = (reverse) => (
    <div className="flex w-max items-center gap-10 whitespace-nowrap" style={{ animation: `${reverse ? 'marquee-reverse' : 'marquee'} ${Number(d.speed) || 40}s linear infinite` }}>
      {[...words, ...words, ...words, ...words].map((w, i) => (
        <span key={i} className="flex items-center gap-10">
          <span className={cn('font-heading text-6xl font-semibold tracking-tight sm:text-8xl', i % 2 ? 'text-transparent [-webkit-text-stroke:1.5px_rgb(var(--c-fg)/0.5)]' : 'text-fg')}>{w}</span>
          <span className="text-4xl text-primary">✦</span>
        </span>
      ))}
    </div>
  );
  return (
    <div className="-mx-5 space-y-4 overflow-hidden py-4 sm:-mx-8 [mask-image:linear-gradient(90deg,transparent,black_8%,black_92%,transparent)]">
      {row(false)}
      {d.twoRows && row(true)}
    </div>
  );
}

/* ------------------------------ Restaurant ------------------------------ */
function MenuList({ d }) {
  return (<><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} /><MenuTabs d={d} /></>);
}

function Hours({ d, settings }) {
  const c = settings?.contact || {};
  const address = d.address || c.address;
  const phone = d.phone || c.phone;
  const email = d.email || c.email;
  return (
    <div className="grid gap-10 text-left lg:grid-cols-[1fr_1.2fr]">
      <div>
        {d.eyebrow && <div className="mb-3 text-xs font-semibold uppercase tracking-[0.3em] text-primary">{d.eyebrow}</div>}
        <h2 className="mb-6 font-heading text-4xl font-semibold tracking-tight text-fg">{d.title}</h2>
        <OpeningHours rows={d.rows || []} />
        <div className="mt-8 space-y-3 text-fg/75">
          {address && <p className="flex items-start gap-3"><MapPin className="mt-0.5 h-5 w-5 shrink-0 text-primary" />{address}</p>}
          {phone && <a href={`tel:${phone}`} className="flex items-center gap-3 hover:text-primary"><Phone className="h-5 w-5 text-primary" />{phone}</a>}
          {email && <a href={`mailto:${email}`} className="flex items-center gap-3 hover:text-primary"><Mail className="h-5 w-5 text-primary" />{email}</a>}
        </div>
      </div>
      <div className="min-h-[360px] overflow-hidden rounded-theme-lg border border-fg/10 bg-surface">
        {d.mapEmbedUrl ? <iframe src={d.mapEmbedUrl} title="Map" loading="lazy" className="h-full min-h-[360px] w-full grayscale-[30%]" /> : d.image ? <img src={d.image} alt="" className="h-full w-full object-cover" /> : null}
      </div>
    </div>
  );
}

function Reservation({ d }) {
  return (
    <div className="grid items-center gap-12 text-left lg:grid-cols-2">
      <div className="relative">
        {d.image && <img src={d.image} alt="" className="aspect-[4/5] w-full rounded-theme-lg object-cover shadow-2xl" />}
        <div className={cn(d.image && 'absolute -bottom-6 -right-4 max-w-xs rounded-theme-lg bg-primary p-6 text-white shadow-glow sm:-right-8')}>
          {d.eyebrow && <div className={cn('mb-2 text-xs font-semibold uppercase tracking-[0.3em]', d.image ? 'text-white/80' : 'text-primary')}>{d.eyebrow}</div>}
          <h2 className={cn('font-heading font-semibold leading-tight', d.image ? 'text-2xl' : 'text-4xl text-fg')}>{d.title}</h2>
          {d.text && <p className={cn('mt-2 text-sm', d.image ? 'text-white/85' : 'text-fg/60')}>{d.text}</p>}
        </div>
      </div>
      <ReservationForm d={d} />
    </div>
  );
}

export const SHOWCASE_RENDERERS = {
  heroSlideshow: ({ d }) => <HeroSlideshow d={d} />,
  spotlightHero: ({ d }) => <SpotlightHero d={d} />,
  masonryGallery: ({ d }) => (<><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} /><MasonryGallery d={d} /></>),
  pricingToggle: ({ d }) => (<><Heading eyebrow={d.eyebrow} title={d.title} subtitle={d.subtitle} /><PricingToggle d={d} /></>),
  bentoGrid: BentoGrid,
  textMarquee: TextMarquee,
  menuList: MenuList,
  hours: Hours,
  reservation: Reservation,
};
