import Link from 'next/link';
import { ArrowRight, Check, ChevronDown, Mail, MapPin, Phone, Quote, Star, Clock } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { cn } from '@/lib/utils';
import PostCard from './PostCard';
import { ContactForm, NewsletterForm } from './forms';
import { MEDIA_RENDERERS } from './MediaBlocks';
import { PORTFOLIO_RENDERERS } from './PortfolioBlocks';
import { SHOWCASE_RENDERERS } from './ShowcaseBlocks';
import { LUXE_RENDERERS } from './LuxeBlocks';
import { INTERACTIVE_RENDERERS } from './InteractiveBlocks';
import { BUSINESS_RENDERERS, businessSectionClass } from './BusinessBlocks';
import { CountUp } from './ShowcaseClient';

/* ---------------------------------------------------------------------------
 * Section wrapper: applies the per-block style options from the page builder.
 * ------------------------------------------------------------------------ */
const PADDING = { none: 'py-0', sm: 'py-8 sm:py-10', md: 'py-14 sm:py-16', lg: 'py-20 sm:py-24', xl: 'py-28 sm:py-36' };
const WIDTH = { narrow: 'max-w-3xl', normal: 'max-w-container', wide: 'max-w-[1440px]', full: 'max-w-none' };

function Section({ style = {}, children, className }) {
  const bg = style.background || 'none';
  const onColor = bg === 'primary' || bg === 'dark' || bg === 'image';
  return (
    <section
      id={style.anchor || undefined}
      className={cn(
        'relative overflow-hidden',
        PADDING[style.paddingY || 'lg'],
        bg === 'surface' && 'bg-surface',
        bg === 'primary' && 'bg-primary text-white',
        bg === 'dark' && 'bg-[#0b0b14] text-white',
        bg === 'image' && 'bg-cover bg-center text-white',
        style.align === 'center' && 'text-center',
        onColor && '[--c-fg:255_255_255]',
        bg === 'dark' && '[--c-bg:11_11_20] [--c-surface:24_24_36]',
        bg === 'image' && '[--c-bg:22_22_36]',
        style.animate !== false && 'reveal',
        style.className,
        className,
      )}
      style={bg === 'image' && style.backgroundImage ? { backgroundImage: `linear-gradient(rgb(0 0 0/.55),rgb(0 0 0/.55)),url(${style.backgroundImage})` } : undefined}
    >
      {bg === 'gradient' && (
        <div aria-hidden className="pointer-events-none absolute inset-0 -z-0">
          <div className="absolute -top-40 left-1/2 h-[520px] w-[900px] -translate-x-1/2 rounded-full bg-primary/20 blur-[120px]" />
          <div className="absolute -bottom-40 right-0 h-[380px] w-[480px] rounded-full bg-accent/20 blur-[120px]" />
          <div className="bg-grid absolute inset-0 [mask-image:radial-gradient(ellipse_at_center,black_30%,transparent_75%)]" />
        </div>
      )}
      <div className={cn('relative mx-auto w-full px-5 sm:px-8', WIDTH[style.width || 'normal'])}>{children}</div>
    </section>
  );
}

function SectionHeading({ eyebrow, title, subtitle, center = true }) {
  if (!eyebrow && !title && !subtitle) return null;
  return (
    <div className={cn('mb-12 max-w-2xl', center && 'mx-auto text-center')}>
      {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
      {title && <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl md:text-[2.75rem] md:leading-[1.1]">{title}</h2>}
      {subtitle && <p className="mt-4 text-lg leading-relaxed text-fg/60">{subtitle}</p>}
    </div>
  );
}

function Buttons({ d, center }) {
  if (!d.primaryLabel && !d.secondaryLabel) return null;
  return (
    <div className={cn('mt-8 flex flex-wrap gap-3', center && 'justify-center')}>
      {d.primaryLabel && <Link href={d.primaryUrl || '#'} className="btn-site-primary">{d.primaryLabel}<ArrowRight className="h-4 w-4" /></Link>}
      {d.secondaryLabel && <Link href={d.secondaryUrl || '#'} className="btn-site-ghost">{d.secondaryLabel}</Link>}
    </div>
  );
}

/* --------------------------------- Blocks --------------------------------- */

function Hero({ d }) {
  if (d.variant === 'split') {
    return (
      <div className="grid items-center gap-12 lg:grid-cols-[1.1fr_1fr]">
        <div>
          {d.eyebrow && <span className="eyebrow mb-5"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{d.eyebrow}</span>}
          <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-5xl lg:text-6xl">{d.title}</h1>
          {d.subtitle && <p className="mt-6 max-w-xl text-lg leading-relaxed text-fg/60">{d.subtitle}</p>}
          <Buttons d={d} />
        </div>
        {d.image && (
          <div className="relative">
            <div className="absolute -inset-4 rounded-[calc(var(--radius)*2)] bg-gradient-to-tr from-primary/30 to-accent/30 blur-2xl" />
            <img src={d.image} alt="" className="relative aspect-[4/3] w-full rounded-theme-lg border border-fg/10 object-cover shadow-2xl animate-float" />
          </div>
        )}
      </div>
    );
  }
  return (
    <div className={cn('mx-auto max-w-4xl text-center', d.variant === 'background' && 'py-10')}>
      {d.eyebrow && <span className="eyebrow mb-6"><span className="h-1.5 w-1.5 animate-pulse rounded-full bg-primary" />{d.eyebrow}</span>}
      <h1 className="font-heading text-4xl font-extrabold leading-[1.05] tracking-tight text-fg sm:text-6xl lg:text-7xl">{d.title}</h1>
      {d.subtitle && <p className="mx-auto mt-6 max-w-2xl text-lg leading-relaxed text-fg/60 sm:text-xl">{d.subtitle}</p>}
      <Buttons d={d} center />
      {d.image && d.variant !== 'background' && (
        <div className="relative mx-auto mt-16 max-w-5xl">
          <div className="absolute -inset-x-10 -top-10 bottom-0 rounded-full bg-primary/25 blur-3xl" />
          <img src={d.image} alt="" className="relative w-full rounded-theme-lg border border-fg/10 shadow-2xl" />
        </div>
      )}
    </div>
  );
}

function PageHeader({ d }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <h1 className="font-heading text-4xl font-extrabold tracking-tight text-fg sm:text-5xl">{d.title}</h1>
      {d.subtitle && <p className="mt-4 text-lg text-fg/60">{d.subtitle}</p>}
    </div>
  );
}

function Features({ d }) {
  const cols = { 2: 'md:grid-cols-2', 3: 'md:grid-cols-2 lg:grid-cols-3', 4: 'md:grid-cols-2 lg:grid-cols-4' }[d.columns] || 'md:grid-cols-3';
  return (
    <>
      <SectionHeading {...d} />
      <div className={cn('grid gap-5', cols)}>
        {(d.items || []).map((item, i) => {
          const Icon = ICONS[item.icon] || ICONS.Star;
          return (
            <div key={i} className="group relative overflow-hidden rounded-theme-lg border border-fg/10 bg-bg p-7 text-left transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
              <div className="absolute -right-10 -top-10 h-32 w-32 rounded-full bg-primary/10 opacity-0 blur-2xl transition group-hover:opacity-100" />
              <div className="mb-5 grid h-12 w-12 place-items-center rounded-theme bg-gradient-to-br from-primary to-accent text-white shadow-glow">
                <Icon className="h-5 w-5" />
              </div>
              <h3 className="font-heading text-lg font-bold text-fg">{item.title}</h3>
              <p className="mt-2 leading-relaxed text-fg/60">{item.text}</p>
            </div>
          );
        })}
      </div>
    </>
  );
}

function ImageText({ d }) {
  return (
    <div className="grid items-center gap-12 lg:grid-cols-2 lg:gap-16">
      <div className={cn(d.imagePosition === 'left' ? 'lg:order-1' : 'lg:order-2')}>
        {d.image ? <img src={d.image} alt="" className="aspect-[4/3] w-full rounded-theme-lg object-cover shadow-xl" /> : <div className="aspect-[4/3] rounded-theme-lg bg-gradient-to-br from-primary/20 to-accent/20" />}
      </div>
      <div className={cn('text-left', d.imagePosition === 'left' ? 'lg:order-2' : 'lg:order-1')}>
        {d.eyebrow && <span className="eyebrow mb-4">{d.eyebrow}</span>}
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{d.title}</h2>
        {d.text && <p className="mt-5 text-lg leading-relaxed text-fg/60">{d.text}</p>}
        {d.bullets?.length > 0 && (
          <ul className="mt-6 space-y-3">
            {d.bullets.map((b, i) => (
              <li key={i} className="flex items-center gap-3 text-fg/80">
                <span className="grid h-6 w-6 place-items-center rounded-full bg-primary/10 text-primary"><Check className="h-3.5 w-3.5" /></span>{b}
              </li>
            ))}
          </ul>
        )}
        {d.buttonLabel && <Link href={d.buttonUrl || '#'} className="btn-site-primary mt-8">{d.buttonLabel}<ArrowRight className="h-4 w-4" /></Link>}
      </div>
    </div>
  );
}

function RichText({ d }) {
  return <div className="prose prose-lg max-w-none text-left prose-headings:font-heading prose-headings:text-fg prose-p:text-fg/75 prose-a:text-primary prose-strong:text-fg prose-li:text-fg/75 prose-blockquote:border-primary prose-blockquote:text-fg/80" dangerouslySetInnerHTML={{ __html: d.html || '' }} />;
}

function Stats({ d }) {
  return (
    <div className="grid grid-cols-2 gap-8 text-center md:grid-cols-4">
      {(d.items || []).map((s, i) => (
        <div key={i}>
          <div className="font-heading text-4xl font-extrabold tracking-tight text-fg sm:text-5xl"><CountUp value={s.value} /></div>
          <div className="mt-2 text-sm font-medium uppercase tracking-wider text-fg/60">{s.label}</div>
        </div>
      ))}
    </div>
  );
}

function Logos({ d }) {
  const items = d.items || [];
  return (
    <div className="text-center">
      {d.title && <p className="mb-8 text-sm font-semibold uppercase tracking-widest text-fg/40">{d.title}</p>}
      <div className="relative overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_15%,black_85%,transparent)]">
        <div className="flex w-max animate-marquee gap-16">
          {[...items, ...items].map((name, i) => (
            <span key={i} className="font-heading text-2xl font-bold tracking-tight text-fg/30">{name}</span>
          ))}
        </div>
      </div>
    </div>
  );
}

function Gallery({ d }) {
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-4' }[d.columns] || 'sm:grid-cols-3';
  return (
    <>
      <SectionHeading title={d.title} />
      <div className={cn('grid gap-4', cols)}>
        {(d.images || []).filter((i) => i.src).map((img, i) => (
          <figure key={i} className="group overflow-hidden rounded-theme-lg">
            <img src={img.src} alt={img.caption || ''} className="aspect-square w-full object-cover transition duration-500 group-hover:scale-105" />
            {img.caption && <figcaption className="mt-2 text-sm text-fg/60">{img.caption}</figcaption>}
          </figure>
        ))}
      </div>
    </>
  );
}

function embedUrl(url = '') {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}`;
  const vimeo = url.match(/vimeo\.com\/(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}`;
  return url;
}

function Video({ d }) {
  return (
    <>
      <SectionHeading title={d.title} />
      <div className="mx-auto aspect-video max-w-4xl overflow-hidden rounded-theme-lg border border-fg/10 shadow-2xl">
        {d.url && <iframe src={embedUrl(d.url)} className="h-full w-full" allow="accelerometer; autoplay; encrypted-media; picture-in-picture" allowFullScreen title={d.title || 'Video'} />}
      </div>
    </>
  );
}

function LatestPosts({ d, ctx, settings }) {
  const posts = (ctx.posts || []).slice(0, Number(d.count) || 3);
  const a = settings?.appearance || {};
  return (
    <>
      <div className="mb-12 flex flex-wrap items-end justify-between gap-4">
        <SectionHeading eyebrow={d.eyebrow} title={d.title} center={false} />
        {d.buttonLabel && <Link href={d.buttonUrl || '/blog'} className="btn-site-ghost mb-12">{d.buttonLabel}<ArrowRight className="h-4 w-4" /></Link>}
      </div>
      <div className="-mt-12 grid gap-6 text-left md:grid-cols-2 lg:grid-cols-3">
        {posts.map((p) => <PostCard key={p.id} post={p} showAuthor={a.showAuthor} showReadingTime={a.showReadingTime} />)}
      </div>
      {!posts.length && <p className="text-center text-fg/50">No posts published yet.</p>}
    </>
  );
}

function Testimonials({ d, ctx }) {
  const items = ctx.testimonials || [];
  return (
    <>
      <SectionHeading {...d} />
      <div className="columns-1 gap-5 space-y-5 md:columns-2 lg:columns-3">
        {items.map((t) => (
          <figure key={t.id} className="break-inside-avoid rounded-theme-lg border border-fg/10 bg-bg p-7 text-left shadow-sm">
            <Quote className="mb-4 h-8 w-8 text-primary/30" />
            <div className="mb-3 flex gap-0.5">{Array.from({ length: t.rating }).map((_, i) => <Star key={i} className="h-4 w-4 fill-amber-400 text-amber-400" />)}</div>
            <blockquote className="leading-relaxed text-fg/80">“{t.content}”</blockquote>
            <figcaption className="mt-6 flex items-center gap-3">
              {t.avatar ? <img src={t.avatar} alt="" className="h-11 w-11 rounded-full object-cover" /> : <div className="h-11 w-11 rounded-full bg-primary/20" />}
              <div>
                <div className="font-semibold text-fg">{t.name}</div>
                <div className="text-sm text-fg/50">{[t.position, t.company].filter(Boolean).join(', ')}</div>
              </div>
            </figcaption>
          </figure>
        ))}
      </div>
    </>
  );
}

export function FaqList({ items }) {
  return (
    <div className="mx-auto max-w-3xl space-y-3 text-left">
      {items.map((f, i) => (
        <details key={f.id ?? i} className="group rounded-theme border border-fg/10 bg-bg p-5 transition open:border-primary/30 open:shadow-glow" open={i === 0}>
          <summary className="flex cursor-pointer list-none items-center justify-between gap-4 font-heading font-semibold text-fg">
            {f.question}
            <span className="grid h-8 w-8 shrink-0 place-items-center rounded-full bg-fg/5 transition group-open:rotate-180 group-open:bg-primary group-open:text-white"><ChevronDown className="h-4 w-4" /></span>
          </summary>
          <p className="mt-3 leading-relaxed text-fg/65">{f.answer}</p>
        </details>
      ))}
    </div>
  );
}

function Faq({ d, ctx }) {
  return (<><SectionHeading {...d} /><FaqList items={ctx.faqs || []} /></>);
}

function Pricing({ d }) {
  return (
    <>
      <SectionHeading {...d} />
      <div className="mx-auto grid max-w-5xl items-stretch gap-6 md:grid-cols-[repeat(auto-fit,minmax(260px,1fr))]">
        {(d.plans || []).map((p, i) => (
          <div key={i} className={cn('relative flex flex-col rounded-theme-lg border bg-bg p-8 text-left', p.highlighted ? 'border-primary shadow-glow md:scale-[1.03]' : 'border-fg/10')}>
            {p.highlighted && <span className="absolute -top-3 left-8 rounded-full bg-gradient-to-r from-primary to-accent px-3 py-1 text-xs font-bold text-white">Most popular</span>}
            <h3 className="font-heading text-lg font-bold text-fg">{p.name}</h3>
            {p.description && <p className="mt-1 text-sm text-fg/55">{p.description}</p>}
            <div className="my-6 flex items-baseline gap-1"><span className="font-heading text-5xl font-extrabold tracking-tight text-fg">{p.price}</span><span className="text-fg/50">{p.period}</span></div>
            <ul className="mb-8 space-y-3">
              {(p.features || []).map((f, j) => <li key={j} className="flex items-center gap-3 text-sm text-fg/75"><Check className="h-4 w-4 text-primary" />{f}</li>)}
            </ul>
            {p.buttonLabel && <Link href={p.buttonUrl || '#'} className={cn('mt-auto w-full', p.highlighted ? 'btn-site-primary' : 'btn-site-ghost')}>{p.buttonLabel}</Link>}
          </div>
        ))}
      </div>
    </>
  );
}

function Cta({ d }) {
  return (
    <div className="relative overflow-hidden rounded-[calc(var(--radius)*2)] bg-gradient-to-br from-primary to-accent px-6 py-16 text-center text-white shadow-glow sm:px-16">
      <div className="bg-grid absolute inset-0 opacity-30 [--c-fg:255_255_255] [mask-image:radial-gradient(ellipse_at_center,black,transparent_70%)]" />
      <div className="relative">
        <h2 className="font-heading text-3xl font-extrabold tracking-tight sm:text-5xl">{d.title}</h2>
        {d.text && <p className="mx-auto mt-4 max-w-xl text-lg text-white/80">{d.text}</p>}
        <div className="mt-8 flex flex-wrap justify-center gap-3">
          {d.primaryLabel && <Link href={d.primaryUrl || '#'} className="btn-site bg-white text-gray-900 hover:-translate-y-0.5">{d.primaryLabel}<ArrowRight className="h-4 w-4" /></Link>}
          {d.secondaryLabel && <Link href={d.secondaryUrl || '#'} className="btn-site border border-white/30 text-white hover:bg-white/10">{d.secondaryLabel}</Link>}
        </div>
      </div>
    </div>
  );
}

function Newsletter({ d }) {
  return (
    <div className="mx-auto flex max-w-4xl flex-col items-center gap-8 text-center md:flex-row md:text-left">
      <div className="flex-1">
        <h2 className="font-heading text-2xl font-extrabold tracking-tight text-fg sm:text-3xl">{d.title}</h2>
        {d.text && <p className="mt-2 text-fg/60">{d.text}</p>}
      </div>
      <NewsletterForm className="md:max-w-sm" />
    </div>
  );
}

function ContactBlock({ d, settings }) {
  const c = settings?.contact || {};
  return (
    <div className={cn('grid gap-10 text-left', d.showInfo && 'lg:grid-cols-[1fr_1.4fr]')}>
      <div>
        <h2 className="font-heading text-3xl font-extrabold tracking-tight text-fg sm:text-4xl">{d.title}</h2>
        {d.text && <p className="mt-3 text-lg text-fg/60">{d.text}</p>}
        {d.showInfo && (
          <div className="mt-8 space-y-4">
            {[[Mail, 'Email', c.email, `mailto:${c.email}`], [Phone, 'Phone', c.phone, `tel:${c.phone}`], [MapPin, 'Office', c.address], [Clock, 'Hours', c.workingHours]]
              .filter(([, , v]) => v)
              .map(([Icon, label, value, href]) => (
                <div key={label} className="flex items-start gap-4 rounded-theme border border-fg/10 bg-bg p-4">
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-theme bg-primary/10 text-primary"><Icon className="h-5 w-5" /></span>
                  <div><div className="text-xs font-semibold uppercase tracking-wider text-fg/45">{label}</div>{href ? <a href={href} className="font-medium text-fg hover:text-primary">{value}</a> : <div className="font-medium text-fg">{value}</div>}</div>
                </div>
              ))}
          </div>
        )}
      </div>
      <ContactForm />
    </div>
  );
}

function Spacer({ d }) {
  return <div style={{ height: Number(d.size) || 0 }} className="flex items-center">{d.divider && <hr className="w-full border-fg/10" />}</div>;
}

function Html({ d }) {
  return <div dangerouslySetInnerHTML={{ __html: d.code || '' }} />;
}

const RENDERERS = {
  hero: Hero, pageHeader: PageHeader, features: Features, imageText: ImageText, richText: RichText, stats: Stats, logos: Logos,
  gallery: Gallery, video: Video, latestPosts: LatestPosts, testimonials: Testimonials, faq: Faq, pricing: Pricing, cta: Cta,
  newsletter: Newsletter, contactForm: ContactBlock, spacer: Spacer, html: Html,
  ...MEDIA_RENDERERS,
  ...PORTFOLIO_RENDERERS,
  ...SHOWCASE_RENDERERS,
  ...LUXE_RENDERERS,
  ...INTERACTIVE_RENDERERS,
  ...BUSINESS_RENDERERS,
};

export default function Blocks({ blocks = [], ctx = {}, settings }) {
  return blocks.filter((b) => !b.style?.hidden).map((block) => {
    const Comp = RENDERERS[block.type];
    if (!Comp) return null;
    return (
      <Section key={block.id} style={block.style} className={block.type === 'spacer' ? '!py-0' : businessSectionClass(block)}>
        <span data-block-id={block.id} className="hidden" />
        <Comp d={block.data || {}} block={block} ctx={ctx} settings={settings} />
      </Section>
    );
  });
}
