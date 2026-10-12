import Link from 'next/link';
import { ArrowRight, ChevronRight, Info, Play, Zap } from 'lucide-react';
import { feedFor } from '@/lib/blockData';
import { cn, compact, postUrl, seriesUrl, timeAgo } from '@/lib/utils';
import { PlayButton } from './AudioPlayer';
import { AudioRow, MediaTile, NewsCard, VideoCard, postsToTracks } from './MediaCards';
import { ChipVideoGrid, Rail, VideoPlayer } from './MediaClient';

/* ------------------------------ helpers ------------------------------ */
function SectionTitle({ title, href, linkLabel, className }) {
  if (!title) return null;
  return (
    <div className={cn('mb-5 flex items-end justify-between gap-4 border-b-2 border-fg/10 text-left', className)}>
      <h2 className="-mb-0.5 border-b-2 border-primary pb-2 font-heading text-xl font-extrabold tracking-tight text-fg sm:text-2xl">
        {href ? <Link href={href} className="inline-flex items-center gap-1 hover:text-primary">{title}<ChevronRight className="h-5 w-5" /></Link> : title}
      </h2>
      {href && linkLabel && <Link href={href} className="mb-2 text-sm font-semibold text-primary hover:underline">{linkLabel}</Link>}
    </div>
  );
}

function Empty({ what = 'content' }) {
  return <div className="rounded-theme border-2 border-dashed border-fg/15 p-8 text-center text-sm text-fg/50">No {what} matches this block’s filters yet.</div>;
}

const catHref = (slug) => (slug ? `/category/${slug}` : '/blog');

/* ------------------------------ News ------------------------------ */
function BreakingNews({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  if (!items.length) return <Empty what="breaking news" />;
  return (
    <div className="flex items-stretch overflow-hidden border-y border-fg/10 bg-bg">
      <span className="z-10 flex shrink-0 items-center gap-1.5 bg-red-600 px-4 py-2.5 text-xs font-extrabold uppercase tracking-wider text-white">
        <Zap className="h-3.5 w-3.5 animate-pulse fill-current" />{d.label || 'Breaking'}
      </span>
      <div className="relative flex-1 overflow-hidden [mask-image:linear-gradient(90deg,transparent,black_3%,black_97%,transparent)]">
        <div className="flex w-max animate-marquee items-center hover:[animation-play-state:paused]" style={{ animationDuration: `${Number(d.speed) || 40}s` }}>
          {[...items, ...items].map((p, i) => (
            <Link key={`${p.id}-${i}`} href={postUrl(p)} className="flex items-center gap-3 whitespace-nowrap px-5 py-2.5 text-sm font-semibold text-fg hover:text-primary">
              <span className="h-1.5 w-1.5 rounded-full bg-red-600" />{p.title}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );
}

function NewsHero({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  if (!items.length) return <Empty what="news" />;
  const [lead, ...rest] = items;

  if (d.layout === 'lead-center') {
    const left = rest.slice(0, 2);
    const right = rest.slice(2);
    return (
      <div className="grid gap-8 text-left lg:grid-cols-[1fr_2fr_1fr]">
        <div className="order-2 space-y-6 lg:order-1">{left.map((p) => <NewsCard key={p.id} post={p} />)}</div>
        <div className="order-1 lg:order-2 lg:border-x lg:border-fg/10 lg:px-8"><NewsCard post={lead} variant="lead" /></div>
        <div className="order-3 divide-y divide-fg/10">{right.map((p) => <NewsCard key={p.id} post={p} variant="text" className="py-4 first:pt-0" />)}</div>
      </div>
    );
  }
  if (d.layout === 'mosaic') {
    return (
      <div className="grid gap-4 text-left md:grid-cols-4 md:grid-rows-2">
        <NewsCard post={lead} variant="overlay" className="md:col-span-2 md:row-span-2 [&>div:first-child]:!aspect-auto [&>div:first-child]:h-full" />
        {rest.slice(0, 4).map((p) => <NewsCard key={p.id} post={p} variant="overlay" className="[&>div:first-child]:!aspect-[4/3]" />)}
      </div>
    );
  }
  return (
    <div className="grid gap-8 text-left lg:grid-cols-[1.7fr_1fr]">
      <NewsCard post={lead} variant="lead" />
      <div className="divide-y divide-fg/10">{rest.map((p) => <NewsCard key={p.id} post={p} variant="horizontal" className="py-4 first:pt-0" />)}</div>
    </div>
  );
}

function NewsSection({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  const title = <SectionTitle title={d.title} href={catHref(d.category)} linkLabel={d.linkLabel} />;
  if (!items.length) return <>{title}<Empty /></>;
  const [lead, ...rest] = items;
  let body;
  if (d.layout === 'grid') body = <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <NewsCard key={p.id} post={p} />)}</div>;
  else if (d.layout === 'overlay') body = <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <NewsCard key={p.id} post={p} variant="overlay" />)}</div>;
  else if (d.layout === 'headlines') body = <div className="grid gap-x-8 gap-y-5 sm:grid-cols-2 lg:grid-cols-4">{items.map((p) => <NewsCard key={p.id} post={p} variant="text" className="border-l-2 border-primary/40 pl-4" />)}</div>;
  else {
    body = (
      <div className="grid gap-8 md:grid-cols-2">
        <NewsCard post={lead} variant="lead" className="[&_h2]:!text-2xl" />
        <div className="divide-y divide-fg/10">{rest.map((p) => <NewsCard key={p.id} post={p} variant="horizontal" className="py-4 first:pt-0" />)}</div>
      </div>
    );
  }
  return <div className="text-left">{title}{body}</div>;
}

function NewsColumns({ d, block, ctx }) {
  const cols = d.columns || [];
  return (
    <div className={cn('grid gap-8 text-left', cols.length >= 4 ? 'md:grid-cols-2 lg:grid-cols-4' : cols.length === 3 ? 'md:grid-cols-3' : 'md:grid-cols-2')}>
      {cols.map((c, i) => {
        const items = feedFor(ctx.feeds, block, i);
        const [first, ...rest] = items;
        return (
          <div key={i}>
            <SectionTitle title={c.title} href={catHref(c.category)} />
            {first ? <NewsCard post={first} /> : <Empty />}
            <div className="mt-4 divide-y divide-fg/10 border-t border-fg/10">{rest.map((p) => <NewsCard key={p.id} post={p} variant="text" className="py-3" />)}</div>
          </div>
        );
      })}
    </div>
  );
}

function LatestWithSidebar({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  const popular = feedFor(ctx.feeds, block, 'popular');
  return (
    <div className="grid gap-10 text-left lg:grid-cols-[2fr_1fr]">
      <div>
        <SectionTitle title={d.title} href={catHref(d.category)} linkLabel="More" />
        {items.length ? (
          <div className="divide-y divide-fg/10">
            {items.map((p) => <NewsCard key={p.id} post={p} variant="horizontal" className="py-5 first:pt-0 [&>div:first-child]:sm:!w-56 [&_h3]:sm:text-lg" />)}
          </div>
        ) : <Empty />}
      </div>
      <aside>
        <div className="sticky top-24 rounded-theme bg-surface p-5">
          <h3 className="mb-4 font-heading text-lg font-extrabold text-fg">{d.sidebarTitle}</h3>
          <ol className="space-y-4">
            {popular.map((p, i) => (
              <li key={p.id}>
                <Link href={postUrl(p)} className="group flex gap-4">
                  <span className="font-heading text-4xl font-black leading-none text-primary/30 group-hover:text-primary">{i + 1}</span>
                  <span>
                    <span className="line-clamp-3 font-semibold leading-snug text-fg group-hover:text-primary">{p.title}</span>
                    <span className="mt-1 block text-xs text-fg/45">{compact(p.views)} reads</span>
                  </span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </aside>
    </div>
  );
}

/* ------------------------------ Video ------------------------------ */
function VideoFeature({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  if (!items.length) return <Empty what="videos" />;
  const [main, ...rest] = items;
  return (
    <div className="text-left">
      {d.title && <SectionTitle title={d.title} />}
      <div className="grid gap-6 lg:grid-cols-[2fr_1fr]">
        <div>
          <VideoPlayer url={main.videoUrl} poster={main.coverImage} title={main.title} />
          <Link href={postUrl(main)} className="group mt-4 block">
            <h2 className="font-heading text-xl font-extrabold leading-tight text-fg group-hover:text-primary sm:text-2xl">{main.title}</h2>
            <p className="mt-1 text-sm text-fg/55">{main.series?.title || main.author?.name} · {compact(main.views)} views · {timeAgo(main.publishedAt)}</p>
          </Link>
        </div>
        <div className="space-y-3">
          <div className="text-sm font-bold uppercase tracking-wider text-fg/50">Up next</div>
          {rest.map((p) => <VideoCard key={p.id} post={p} compact />)}
        </div>
      </div>
    </div>
  );
}

function VideoGrid({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  const seen = new Map();
  items.forEach((p) => p.categories?.forEach((c) => seen.set(c.slug, c)));
  return (
    <div className="text-left">
      {d.title && <h2 className="mb-5 font-heading text-2xl font-extrabold tracking-tight text-fg">{d.title}</h2>}
      {items.length ? <ChipVideoGrid items={items} chips={d.showChips ? [...seen.values()] : []} columns={Number(d.columns) || 4} /> : <Empty what="videos" />}
    </div>
  );
}

const TILE_WIDTH = { landscape: 'w-[260px] sm:w-[300px]', poster: 'w-[150px] sm:w-[190px]', square: 'w-[170px] sm:w-[200px]' };

function MediaRail({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  const style = d.cardStyle || 'landscape';
  return (
    <div className="text-left">
      <div className="flex items-end justify-between gap-4">
        {d.title && <h2 className="font-heading text-xl font-extrabold tracking-tight text-fg sm:text-2xl">{d.title}</h2>}
        {d.linkLabel && d.linkUrl && <Link href={d.linkUrl} className="flex items-center gap-1 text-sm font-semibold text-fg/70 hover:text-primary">{d.linkLabel}<ChevronRight className="h-4 w-4" /></Link>}
      </div>
      {items.length ? (
        <Rail>{items.map((item) => <MediaTile key={`${item.type || item.format}-${item.id}`} item={item} cardStyle={style} className={cn('snap-start', TILE_WIDTH[style])} />)}</Rail>
      ) : <div className="mt-3"><Empty /></div>}
    </div>
  );
}

function Billboard({ d, block, ctx }) {
  const all = feedFor(ctx.feeds, block);
  const s = (d.series && all.find((x) => x.slug === d.series)) || all.find((x) => x.featured) || all[0];
  if (!s) return <div className="site-container py-10"><Empty what="series" /></div>;
  const playHref = s.firstEpisode ? postUrl({ slug: s.firstEpisode.slug, format: s.firstEpisode.format }) : seriesUrl(s);
  return (
    <div className="relative -mx-5 h-[78vh] min-h-[520px] max-h-[860px] overflow-hidden text-left sm:-mx-8">
      {s.backdrop && <img src={s.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />}
      <div className="absolute inset-0 bg-gradient-to-r from-black via-black/60 to-transparent" />
      <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-[rgb(var(--c-bg))] to-transparent" />
      <div className="site-container relative flex h-[78vh] min-h-[520px] max-h-[860px] items-center py-24">
        <div className="max-w-xl text-white">
          <div className="mb-3 flex items-center gap-2 text-xs font-extrabold uppercase tracking-[0.3em] text-primary">
            <span className="h-2 w-2 rounded-full bg-primary" />
            {s.type === 'PODCAST' ? 'Podcast' : s.type === 'PLAYLIST' ? 'Playlist' : 'Series'}
          </div>
          <h1 className="font-heading text-5xl font-black leading-[0.95] tracking-tight drop-shadow-2xl sm:text-7xl">{s.title}</h1>
          <div className="mt-5 flex flex-wrap items-center gap-3 text-sm font-semibold text-white/80">
            {s.year && <span>{s.year}</span>}
            {s.maturity && <span className="rounded border border-white/40 px-1.5 py-0.5 text-xs">{s.maturity}</span>}
            {s.seasons > 0 && <span>{s.seasons} Season{s.seasons > 1 ? 's' : ''}</span>}
            {s.genres?.length > 0 && <span className="text-white/60">{s.genres.join(' • ')}</span>}
          </div>
          <p className="mt-4 text-lg leading-relaxed text-white/80">{s.description || s.tagline}</p>
          <div className="mt-8 flex flex-wrap gap-3">
            <Link href={playHref} className="btn-site bg-white px-7 text-black hover:bg-white/85"><Play className="h-5 w-5 fill-current" />Play</Link>
            <Link href={seriesUrl(s)} className="btn-site bg-white/20 px-6 text-white backdrop-blur hover:bg-white/30"><Info className="h-5 w-5" />More info</Link>
          </div>
        </div>
      </div>
    </div>
  );
}

function Top10({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block).slice(0, 10);
  return (
    <div className="text-left">
      {d.title && <h2 className="font-heading text-xl font-extrabold tracking-tight text-fg sm:text-2xl">{d.title}</h2>}
      {items.length ? (
        <Rail className="gap-1">
          {items.map((item, i) => (
            <div key={item.id} className="flex shrink-0 snap-start items-end">
              <span className="-mr-6 select-none font-heading text-[9rem] font-black leading-[0.8] text-transparent [-webkit-text-stroke:3px_rgb(var(--c-fg)/0.55)] sm:text-[11rem]">{i + 1}</span>
              <MediaTile item={item} cardStyle="poster" className="relative w-[130px] sm:w-[150px]" />
            </div>
          ))}
        </Rail>
      ) : <div className="mt-3"><Empty /></div>}
    </div>
  );
}

function SeriesGrid({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  const style = d.cardStyle || 'poster';
  const cols = { poster: 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-6', square: 'grid-cols-2 sm:grid-cols-3 lg:grid-cols-4', landscape: 'sm:grid-cols-2 lg:grid-cols-3' }[style];
  return (
    <div className="text-left">
      {d.title && <h2 className="mb-5 font-heading text-2xl font-extrabold tracking-tight text-fg">{d.title}</h2>}
      {items.length ? (
        <div className={cn('grid gap-4', cols)}>
          {items.map((s) => (
            <div key={s.id}>
              <MediaTile item={s} cardStyle={style} />
              {s.tagline && <p className="mt-2 line-clamp-2 text-sm text-fg/55">{s.tagline}</p>}
            </div>
          ))}
        </div>
      ) : <Empty what="series" />}
    </div>
  );
}

/* ------------------------------ Audio ------------------------------ */
function AudioPlaylist({ d, block, ctx }) {
  const items = feedFor(ctx.feeds, block);
  const tracks = postsToTracks(items);
  return (
    <div className="text-left">
      <div className="mb-5 flex items-center justify-between gap-4">
        {d.title && <h2 className="font-heading text-2xl font-extrabold tracking-tight text-fg">{d.title}</h2>}
        {tracks.length > 0 && <PlayButton tracks={tracks} label="Play all" className="!py-2.5" />}
      </div>
      {items.length ? (
        <div className="space-y-2.5">{items.map((p, i) => <AudioRow key={p.id} post={p} tracks={tracks} index={Math.max(0, tracks.findIndex((t) => t.id === p.id))} number={i + 1} />)}</div>
      ) : <Empty what="audio" />}
      {d.series && <Link href={`/series/${d.series}`} className="mt-5 inline-flex items-center gap-1 text-sm font-semibold text-primary">View all episodes<ArrowRight className="h-4 w-4" /></Link>}
    </div>
  );
}

export const MEDIA_RENDERERS = {
  breakingNews: BreakingNews, newsHero: NewsHero, newsSection: NewsSection, newsColumns: NewsColumns, latestWithSidebar: LatestWithSidebar,
  videoFeature: VideoFeature, videoGrid: VideoGrid, mediaRail: MediaRail, billboard: Billboard, top10: Top10, seriesGrid: SeriesGrid,
  audioPlaylist: AudioPlaylist,
};
