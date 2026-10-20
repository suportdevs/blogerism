import Link from 'next/link';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';

/*
 * "Glow" blocks for dark, neon developer portfolios: a centered name hero with floating glass chips, giant stacked
 * solid/outline titles, an about card with timeline groups, and a tech set of glowing brand-logo tiles.
 * Colours come from the theme (primary = the glow colour), so they work in light mode too.
 */

const glowText = '[text-shadow:0_0_42px_rgb(var(--c-primary)/0.55)]';
const outline = 'text-transparent [-webkit-text-stroke:2px_rgb(var(--c-primary))] sm:[-webkit-text-stroke:3px_rgb(var(--c-primary))]';
const glass = 'rounded-[calc(var(--radius)*1.25)] border border-primary/15 bg-surface/70 shadow-[0_0_60px_-20px_rgb(var(--c-primary)/0.5)] backdrop-blur';

// Giant two-word title: the first word solid, the second an outline drawn over its lower half.
export function StackedTitle({ solid, outline: line2, align = 'left', size = 'lg', as: Tag = 'h2', className }) {
  if (!solid && !line2) return null;
  const big = size === 'xl' ? 'text-[clamp(3.5rem,11vw,9rem)]' : 'text-[clamp(3rem,8.5vw,7rem)]';
  return (
    <Tag className={cn('font-heading font-normal uppercase italic leading-[0.82] tracking-tight', big, align === 'center' && 'text-center', align === 'right' && 'text-right', className)}>
      {solid && <span className="relative block text-fg">{solid}</span>}
      {line2 && <span className={cn('relative block -mt-[0.24em]', align === 'left' && 'pl-[0.9em]', align === 'right' && 'pr-[0.6em]', outline)}>{line2}</span>}
    </Tag>
  );
}

const CHIP_POS = { tl: 'left-[8%] top-[9%]', tr: 'right-[8%] top-[9%]', bl: 'left-[10%] bottom-[30%]', br: 'right-[14%] bottom-[30%]', ml: 'left-[4%] top-[45%]', mr: 'right-[4%] top-[45%]' };

function Chip({ chip, i, floating }) {
  return (
    <Link
      href={chip.url || '#'}
      className={cn(
        'inline-flex items-center justify-center rounded-xl border border-white/10 bg-white/[.04] px-9 py-3 font-heading text-sm italic text-accent shadow-[0_10px_40px_-8px_rgb(var(--c-primary)/0.55)] backdrop-blur transition hover:-translate-y-0.5 hover:border-primary/40 hover:text-primary',
        floating && 'absolute hidden animate-float md:inline-flex',
        floating && (CHIP_POS[chip.position] || CHIP_POS.tl),
      )}
      style={floating ? { animationDelay: `${i * -2.2}s` } : undefined}
    >
      {chip.label}
    </Link>
  );
}

function GlowHero({ d }) {
  const chips = (d.chips || []).filter((c) => c.label);
  const socials = (d.socials || []).filter((s) => s.url);
  return (
    <div className="relative flex min-h-[86vh] flex-col items-center justify-center py-16 text-center">
      <div aria-hidden className="pointer-events-none absolute left-1/2 top-[42%] h-[460px] w-[460px] -translate-x-1/2 -translate-y-1/2 rounded-full bg-primary/25 blur-[110px]" />
      {chips.map((c, i) => <Chip key={i} chip={c} i={i} floating />)}
      <div className="relative">
        {d.greeting && <p className="animate-fade-up font-heading text-[clamp(1.6rem,3.4vw,2.6rem)] italic text-fg">{d.greeting}</p>}
        <h1 className={cn('mt-3 animate-fade-up font-heading text-[clamp(3.4rem,12vw,9.5rem)] font-normal uppercase italic leading-[0.95] tracking-tight text-primary [animation-delay:.08s]', glowText)}>{d.name}</h1>
        {d.role && <p className="mt-5 animate-fade-up font-heading text-[clamp(1.4rem,3vw,2.4rem)] italic text-fg [animation-delay:.16s]">{d.role}</p>}
        {d.intro && <p className="mx-auto mt-6 max-w-xl animate-fade-up text-base leading-relaxed text-fg/60 [animation-delay:.24s]">{d.intro}</p>}
      </div>
      {chips.length > 0 && <div className="relative mt-10 flex flex-wrap justify-center gap-3 md:hidden">{chips.map((c, i) => <Chip key={i} chip={c} i={i} />)}</div>}
      {socials.length > 0 && (
        <div className="relative mt-16 flex flex-wrap justify-center gap-3 md:mt-28">
          {socials.map((s, i) => {
            const Icon = ICONS[s.icon] || ICONS.Globe;
            return (
              <a key={i} href={s.url} target={s.url.startsWith('mailto:') ? undefined : '_blank'} rel="noreferrer" aria-label={s.label || s.icon} title={s.label || s.icon}
                className="grid h-16 w-16 place-items-center rounded-xl border border-primary/25 bg-gradient-to-b from-white/[.07] to-transparent text-primary shadow-[0_0_24px_-6px_rgb(var(--c-primary)/0.7)] transition hover:-translate-y-1 hover:shadow-[0_0_34px_-2px_rgb(var(--c-primary)/0.8)]">
                <Icon className="h-8 w-8" />
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}

function GlowTitle({ d }) {
  return (
    <div>
      <StackedTitle solid={d.solid} outline={d.outline} align={d.align} size={d.size} />
      {d.subtitle && <p className={cn('mt-8 max-w-xl text-lg text-fg/60', d.align === 'center' && 'mx-auto text-center', d.align === 'right' && 'ml-auto text-right')}>{d.subtitle}</p>}
    </div>
  );
}

function Timeline({ group }) {
  return (
    <div id={group.anchor || undefined} className="scroll-mt-28">
      <h3 className="font-heading text-[clamp(1.6rem,2.6vw,2.2rem)] font-normal uppercase italic text-fg">{group.title}</h3>
      <ol className="mt-3 space-y-8">
        {(group.items || []).map((it, i) => (
          <li key={i} className="relative pl-12">
            <span aria-hidden className="absolute bottom-0 left-[11px] top-2 w-[2px] bg-primary/80 shadow-[0_0_10px_rgb(var(--c-primary)/0.7)]" />
            <span aria-hidden className="absolute left-[3px] top-2 h-[18px] w-[18px] rounded-full border-2 border-primary bg-bg shadow-[0_0_14px_rgb(var(--c-primary)/0.8)]" />
            <div className="text-xl text-fg sm:text-2xl">{it.title}</div>
            {(it.org || it.period) && <div className="mt-1 text-sm font-semibold uppercase tracking-[0.12em] text-primary">{[it.org, it.period].filter(Boolean).join(' | ')}</div>}
            {it.text && <p className="mt-3 text-fg/70">{it.text}</p>}
            {it.bullets?.length > 0 && <ul className="mt-3 list-disc space-y-1.5 pl-5 text-fg/80 marker:text-primary">{it.bullets.map((b, j) => <li key={j}>{b}</li>)}</ul>}
          </li>
        ))}
      </ol>
    </div>
  );
}

function GlowAbout({ d }) {
  const paragraphs = String(d.text || '').split(/\n{2,}/).map((p) => p.trim()).filter(Boolean);
  return (
    <div className="grid gap-12 lg:grid-cols-[minmax(0,0.9fr)_minmax(0,1.1fr)] lg:gap-16">
      <div className="flex lg:sticky lg:top-32 lg:justify-center lg:self-start lg:pt-16"><StackedTitle solid={d.solid} outline={d.outline} align="left" /></div>
      <div className="space-y-14">
        {(d.lead || paragraphs.length > 0) && (
          <div className={cn(glass, 'space-y-4 p-7 text-center text-lg leading-relaxed text-fg/85 sm:p-10')}>
            {d.lead && <p className="text-fg">{d.lead}</p>}
            {paragraphs.map((p, i) => <p key={i}>{p}</p>)}
          </div>
        )}
        {(d.groups || []).map((g, i) => <Timeline key={i} group={g} />)}
      </div>
    </div>
  );
}

const hex = (c) => String(c || '').replace('#', '').slice(0, 6) || 'ffffff';

function TechTile({ item }) {
  const color = `#${hex(item.color)}`;
  const src = item.image || (item.logo ? `https://cdn.simpleicons.org/${encodeURIComponent(item.logo)}/${hex(item.color)}` : '');
  return (
    <li className="group relative">
      <div
        className="grid h-16 w-16 place-items-center rounded-xl border bg-[#07090c] bg-gradient-to-b from-white/[.08] to-transparent transition duration-300 group-hover:-translate-y-1 sm:h-[4.5rem] sm:w-[4.5rem]"
        style={{ borderColor: `${color}66`, boxShadow: `0 0 22px -6px ${color}aa, inset 0 0 18px -10px ${color}` }}
        title={item.label}
      >
        {src ? <img src={src} alt={item.label} loading="lazy" className="h-8 w-8 object-contain sm:h-9 sm:w-9" /> : <span className="font-heading text-lg" style={{ color }}>{(item.label || '?').slice(0, 2)}</span>}
      </div>
      <span className="pointer-events-none absolute left-1/2 top-full z-10 mt-2 -translate-x-1/2 whitespace-nowrap rounded-md bg-fg px-2 py-1 text-xs font-semibold text-bg opacity-0 transition group-hover:opacity-100">{item.label}</span>
    </li>
  );
}

function GlowTech({ d }) {
  const right = d.titleSide !== 'left';
  const title = <div className="flex lg:sticky lg:top-32 lg:justify-center lg:self-start lg:pt-10"><StackedTitle solid={d.solid} outline={d.outline} align="left" /></div>;
  return (
    <div className="grid items-center gap-14 lg:grid-cols-2">
      {!right && title}
      <div className={cn('space-y-10', right && 'order-2 lg:order-none')}>
        {(d.groups || []).map((g, i) => (
          <div key={i} className="text-center">
            <h3 className="text-base text-fg">{g.title}</h3>
            <ul className="mt-4 flex flex-wrap justify-center gap-3 sm:gap-4">{(g.items || []).map((it, j) => <TechTile key={j} item={it} />)}</ul>
          </div>
        ))}
      </div>
      {right && <div className="order-1 lg:order-none">{title}</div>}
    </div>
  );
}

export const GLOW_RENDERERS = { glowHero: GlowHero, glowTitle: GlowTitle, glowAbout: GlowAbout, glowTech: GlowTech };
