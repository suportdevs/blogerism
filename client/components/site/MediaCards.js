import Link from 'next/link';
import { Headphones, Images, Play, Zap } from 'lucide-react';
import { cn, compact, formatDuration, postUrl, seriesUrl, timeAgo, toTrack } from '@/lib/utils';
import { NowPlaying, PlayButton } from './AudioPlayer';

/* Thumbnail with format badge + duration, shared by every card. */
export function Thumb({ post, className, aspect = 'aspect-[16/10]', rounded = 'rounded-theme', large }) {
  const media = post.format === 'VIDEO' || post.format === 'AUDIO';
  return (
    <div className={cn('relative overflow-hidden bg-fg/5', aspect, rounded, className)}>
      {post.coverImage && <img src={post.coverImage} alt="" loading="lazy" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
      {media && (
        <span className={cn('absolute grid place-items-center rounded-full bg-black/55 text-white backdrop-blur transition group-hover:scale-110 group-hover:bg-primary', large ? 'left-1/2 top-1/2 h-16 w-16 -translate-x-1/2 -translate-y-1/2' : 'bottom-2 left-2 h-8 w-8')}>
          {post.format === 'AUDIO' ? <Headphones className={large ? 'h-6 w-6' : 'h-3.5 w-3.5'} /> : <Play className={cn('ml-0.5 fill-current', large ? 'h-6 w-6' : 'h-3.5 w-3.5')} />}
        </span>
      )}
      {post.format === 'GALLERY' && <span className="absolute bottom-2 left-2 grid h-8 w-8 place-items-center rounded-full bg-black/55 text-white"><Images className="h-3.5 w-3.5" /></span>}
      {post.duration ? <span className="absolute bottom-2 right-2 rounded-md bg-black/80 px-1.5 py-0.5 font-mono text-[11px] font-semibold text-white">{formatDuration(post.duration)}</span> : null}
    </div>
  );
}

export function Kicker({ post, className }) {
  const cat = post.categories?.[0];
  return (
    <div className={cn('mb-1.5 flex items-center gap-2 text-xs font-bold uppercase tracking-wide', className)}>
      {post.isBreaking && <span className="inline-flex items-center gap-1 rounded-sm bg-red-600 px-1.5 py-0.5 text-[10px] text-white"><Zap className="h-3 w-3 fill-current" />Breaking</span>}
      {post.subtitle && <span className="text-primary">{post.subtitle}</span>}
      {cat && <span style={{ color: cat.color }}>{cat.name}</span>}
    </div>
  );
}

/* ---------- News ---------- */
export function NewsCard({ post, variant = 'standard', className }) {
  const href = postUrl(post);
  if (variant === 'lead') {
    return (
      <Link href={href} className={cn('group block', className)}>
        <Thumb post={post} aspect="aspect-[16/9]" large />
        <div className="pt-4">
          <Kicker post={post} />
          <h2 className="font-heading text-2xl font-extrabold leading-tight tracking-tight text-fg group-hover:text-primary sm:text-3xl lg:text-4xl">{post.title}</h2>
          {post.excerpt && <p className="mt-3 text-base leading-relaxed text-fg/65 sm:text-lg">{post.excerpt}</p>}
          <time className="mt-3 block text-xs text-fg/45">{timeAgo(post.publishedAt)}</time>
        </div>
      </Link>
    );
  }
  if (variant === 'horizontal') {
    return (
      <Link href={href} className={cn('group flex gap-4', className)}>
        <Thumb post={post} aspect="aspect-[4/3]" className="w-28 shrink-0 sm:w-36" rounded="rounded-[calc(var(--radius)*0.6)]" />
        <div className="min-w-0">
          <Kicker post={post} />
          <h3 className="line-clamp-3 font-heading text-[15px] font-bold leading-snug text-fg group-hover:text-primary">{post.title}</h3>
          <time className="mt-1.5 block text-xs text-fg/45">{timeAgo(post.publishedAt)}</time>
        </div>
      </Link>
    );
  }
  if (variant === 'text') {
    return (
      <Link href={href} className={cn('group block', className)}>
        <Kicker post={post} />
        <h3 className="font-heading text-base font-bold leading-snug text-fg group-hover:text-primary">{post.title}</h3>
        <time className="mt-1 block text-xs text-fg/45">{timeAgo(post.publishedAt)}</time>
      </Link>
    );
  }
  if (variant === 'overlay') {
    return (
      <Link href={href} className={cn('group relative block overflow-hidden rounded-theme', className)}>
        <Thumb post={post} aspect="aspect-[4/5]" rounded="rounded-none" />
        <div className="absolute inset-0 bg-gradient-to-t from-black/90 via-black/30 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 p-5 text-white">
          <Kicker post={post} className="[&>span]:!text-white/90" />
          <h3 className="font-heading text-lg font-bold leading-snug">{post.title}</h3>
          <time className="mt-1 block text-xs text-white/60">{timeAgo(post.publishedAt)}</time>
        </div>
      </Link>
    );
  }
  return (
    <Link href={href} className={cn('group block', className)}>
      <Thumb post={post} />
      <div className="pt-3">
        <Kicker post={post} />
        <h3 className="line-clamp-3 font-heading text-lg font-bold leading-snug text-fg group-hover:text-primary">{post.title}</h3>
        <time className="mt-1.5 block text-xs text-fg/45">{timeAgo(post.publishedAt)}</time>
      </div>
    </Link>
  );
}

/* ---------- Video (YouTube-style) ---------- */
export function VideoCard({ post, compact: small, className }) {
  if (small) {
    return (
      <Link href={postUrl(post)} className={cn('group flex gap-3', className)}>
        <Thumb post={post} aspect="aspect-video" className="w-40 shrink-0" rounded="rounded-[calc(var(--radius)*0.6)]" />
        <div className="min-w-0">
          <h4 className="line-clamp-2 text-sm font-bold leading-snug text-fg group-hover:text-primary">{post.title}</h4>
          <div className="mt-1 text-xs text-fg/55">{post.series?.title || post.author?.name}</div>
          <div className="text-xs text-fg/45">{compact(post.views)} views · {timeAgo(post.publishedAt)}</div>
        </div>
      </Link>
    );
  }
  return (
    <Link href={postUrl(post)} className={cn('group block', className)}>
      <Thumb post={post} aspect="aspect-video" />
      <div className="mt-3 flex gap-3">
        {post.author?.avatar ? <img src={post.author.avatar} alt="" className="h-9 w-9 shrink-0 rounded-full object-cover" /> : <span className="h-9 w-9 shrink-0 rounded-full bg-primary/20" />}
        <div className="min-w-0">
          <h3 className="line-clamp-2 font-bold leading-snug text-fg group-hover:text-primary">{post.title}</h3>
          <div className="mt-1 text-sm text-fg/55">{post.series?.title || post.author?.name}</div>
          <div className="text-sm text-fg/45">{compact(post.views)} views · {timeAgo(post.publishedAt)}</div>
        </div>
      </div>
    </Link>
  );
}

/* ---------- Streaming cards (posts or series) ---------- */
const isSeries = (item) => item.type && !item.format;
const itemHref = (item) => (isSeries(item) ? seriesUrl(item) : postUrl(item));
const itemImage = (item, style) => (isSeries(item) ? (style === 'landscape' ? item.backdrop || item.poster : item.poster || item.backdrop) : item.coverImage || item.series?.poster);

export function MediaTile({ item, cardStyle = 'landscape', className }) {
  const aspect = { landscape: 'aspect-video', poster: 'aspect-[2/3]', square: 'aspect-square' }[cardStyle];
  const meta = isSeries(item)
    ? [item.year, item.episodeCount != null && `${item.episodeCount} ${item.type === 'PODCAST' ? 'episodes' : item.type === 'PLAYLIST' ? 'videos' : 'episodes'}`, item.maturity].filter(Boolean).join(' · ')
    : [item.season && item.episode ? `S${item.season}:E${item.episode}` : null, formatDuration(item.duration)].filter(Boolean).join(' · ');
  return (
    <Link href={itemHref(item)} className={cn('group/tile relative block shrink-0', className)}>
      <div className={cn('relative overflow-hidden rounded-[calc(var(--radius)*0.6)] bg-fg/10 shadow-lg ring-1 ring-fg/5 transition duration-300 group-hover/tile:scale-[1.04] group-hover/tile:ring-2 group-hover/tile:ring-primary', aspect)}>
        {itemImage(item, cardStyle) && <img src={itemImage(item, cardStyle)} alt="" loading="lazy" className="h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/10 to-transparent opacity-80 transition group-hover/tile:opacity-100" />
        <span className="absolute left-1/2 top-1/2 grid h-12 w-12 -translate-x-1/2 -translate-y-1/2 scale-75 place-items-center rounded-full bg-white/90 text-black opacity-0 transition group-hover/tile:scale-100 group-hover/tile:opacity-100">
          {item.format === 'AUDIO' || item.type === 'PODCAST' ? <Headphones className="h-5 w-5" /> : <Play className="ml-0.5 h-5 w-5 fill-current" />}
        </span>
        <div className="absolute inset-x-0 bottom-0 p-3 text-white">
          <div className={cn('line-clamp-2 font-heading font-bold leading-tight', cardStyle === 'poster' ? 'text-base' : 'text-sm')}>{item.title}</div>
          {meta && <div className="mt-0.5 text-[11px] text-white/70">{meta}</div>}
        </div>
      </div>
    </Link>
  );
}

/* ---------- Episode row (show pages, watch sidebar) ---------- */
export function EpisodeRow({ post, active }) {
  return (
    <Link href={postUrl(post)} className={cn('group flex items-center gap-4 rounded-theme p-3 transition sm:gap-5', active ? 'bg-primary/10' : 'hover:bg-fg/5')}>
      <span className="hidden w-6 text-center font-heading text-2xl font-bold text-fg/40 sm:block">{post.episode ?? '•'}</span>
      <Thumb post={post} aspect="aspect-video" className="w-36 shrink-0 sm:w-44" rounded="rounded-[calc(var(--radius)*0.6)]" />
      <div className="min-w-0 flex-1">
        <div className="flex items-start justify-between gap-3">
          <h4 className={cn('line-clamp-2 font-bold leading-snug group-hover:text-primary', active ? 'text-primary' : 'text-fg')}>{post.title.includes(': ') ? post.title.split(': ').slice(1).join(': ') : post.title}</h4>
          <span className="shrink-0 text-xs text-fg/50">{formatDuration(post.duration)}</span>
        </div>
        {post.excerpt && <p className="mt-1 line-clamp-2 hidden text-sm text-fg/55 sm:block">{post.excerpt}</p>}
      </div>
    </Link>
  );
}

/* ---------- Audio ---------- */
export function AudioRow({ post, tracks, index, number }) {
  return (
    <div className="group flex items-center gap-4 rounded-theme border border-fg/10 bg-bg p-3 transition hover:border-primary/40 hover:shadow-glow">
      {number != null && <span className="hidden w-6 text-center font-mono text-sm text-fg/40 sm:block">{number}</span>}
      <div className="relative shrink-0">
        {(post.coverImage || post.series?.poster) && <img src={post.coverImage || post.series?.poster} alt="" className="h-14 w-14 rounded-[calc(var(--radius)*0.6)] object-cover" />}
      </div>
      <Link href={postUrl(post)} className="min-w-0 flex-1">
        <div className="flex items-center gap-2">
          <h4 className="truncate font-bold text-fg group-hover:text-primary">{post.title}</h4>
          <NowPlaying id={post.id} />
        </div>
        <div className="truncate text-sm text-fg/55">{[post.series?.title, post.episode && `Episode ${post.episode}`, timeAgo(post.publishedAt)].filter(Boolean).join(' · ')}</div>
      </Link>
      <span className="hidden font-mono text-xs text-fg/50 sm:block">{formatDuration(post.duration)}</span>
      <PlayButton tracks={tracks} index={index} size="sm" />
    </div>
  );
}

export const postsToTracks = (posts) => posts.filter((p) => p.audioUrl).map(toTrack);
