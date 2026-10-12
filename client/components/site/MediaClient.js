'use client';

import { useRef, useState } from 'react';
import { ChevronLeft, ChevronRight, Heart, Link2, Play } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { cn, compact, embedUrl } from '@/lib/utils';
import { EpisodeRow, VideoCard } from './MediaCards';

/* Horizontal scroller with arrow buttons (streaming-style rows). */
export function Rail({ children, className }) {
  const ref = useRef();
  const scroll = (dir) => ref.current?.scrollBy({ left: dir * ref.current.clientWidth * 0.85, behavior: 'smooth' });
  return (
    <div className="group/rail relative">
      <button onClick={() => scroll(-1)} aria-label="Scroll left" className="absolute -left-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-bg/90 text-fg opacity-0 shadow-xl ring-1 ring-fg/10 transition group-hover/rail:opacity-100 md:grid"><ChevronLeft className="h-5 w-5" /></button>
      <div ref={ref} className={cn('-mx-1 flex snap-x gap-3 overflow-x-auto scroll-smooth px-1 py-3 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden', className)}>{children}</div>
      <button onClick={() => scroll(1)} aria-label="Scroll right" className="absolute -right-3 top-1/2 z-10 hidden h-12 w-12 -translate-y-1/2 place-items-center rounded-full bg-bg/90 text-fg opacity-0 shadow-xl ring-1 ring-fg/10 transition group-hover/rail:opacity-100 md:grid"><ChevronRight className="h-5 w-5" /></button>
    </div>
  );
}

/* Video grid with category chips that filter the loaded list client-side (YouTube home style). */
export function ChipVideoGrid({ items, chips, columns = 4 }) {
  const [active, setActive] = useState('');
  const shown = active ? items.filter((p) => p.categories?.some((c) => c.slug === active)) : items;
  const cols = { 2: 'sm:grid-cols-2', 3: 'sm:grid-cols-2 lg:grid-cols-3', 4: 'sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4' }[columns] || 'sm:grid-cols-2 lg:grid-cols-4';
  return (
    <>
      {chips?.length > 0 && (
        <div className="mb-6 flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none]">
          {[{ slug: '', name: 'All' }, ...chips].map((c) => (
            <button key={c.slug} onClick={() => setActive(c.slug)} className={cn('shrink-0 rounded-[calc(var(--radius)*0.5)] px-3.5 py-1.5 text-sm font-semibold transition', active === c.slug ? 'bg-fg text-bg' : 'bg-fg/5 text-fg/80 hover:bg-fg/10')}>{c.name}</button>
          ))}
        </div>
      )}
      <div className={cn('grid gap-x-4 gap-y-8 text-left', cols)}>{shown.map((p) => <VideoCard key={p.id} post={p} />)}</div>
      {!shown.length && <p className="py-10 text-center text-fg/50">No videos here yet.</p>}
    </>
  );
}

/*
 * Video player: YouTube/Vimeo links render a lightweight poster that swaps to the real
 * iframe on click (fast page loads); direct files use the native <video> element.
 */
export function VideoPlayer({ url, poster, title, autoPlay = false, className }) {
  const [started, setStarted] = useState(autoPlay);
  const embed = embedUrl(url || '', { autoplay: true });
  return (
    <div className={cn('relative aspect-video w-full overflow-hidden rounded-theme-lg bg-black shadow-2xl', className)}>
      {!url ? (
        <div className="grid h-full place-items-center text-sm text-white/50">No video source</div>
      ) : !embed ? (
        <video src={url} poster={poster || undefined} controls autoPlay={autoPlay} playsInline className="h-full w-full" />
      ) : started ? (
        <iframe src={embed} title={title || 'Video'} className="h-full w-full" allow="accelerometer; autoplay; encrypted-media; gyroscope; picture-in-picture; fullscreen" allowFullScreen />
      ) : (
        <button onClick={() => setStarted(true)} className="group relative h-full w-full" aria-label={`Play ${title || 'video'}`}>
          {poster && <img src={poster} alt="" className="h-full w-full object-cover opacity-90 transition group-hover:opacity-100" />}
          <span className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
          <span className="absolute left-1/2 top-1/2 grid h-20 w-20 -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-primary text-white shadow-glow transition group-hover:scale-110">
            <Play className="ml-1 h-8 w-8 fill-current" />
          </span>
        </button>
      )}
    </div>
  );
}

export function LikeButton({ slug, initial }) {
  const [likes, setLikes] = useState(initial || 0);
  const [liked, setLiked] = useState(false);
  const like = async () => {
    if (liked) return;
    setLiked(true);
    setLikes((n) => n + 1);
    try {
      const r = await fetch(`${API_URL}/api/public/posts/${slug}/like`, { method: 'POST' });
      if (r.ok) setLikes((await r.json()).likes);
    } catch {}
  };
  return (
    <button onClick={like} className={cn('inline-flex items-center gap-2 rounded-full px-4 py-2 text-sm font-semibold transition', liked ? 'bg-primary text-white' : 'bg-fg/5 text-fg hover:bg-fg/10')}>
      <Heart className={cn('h-4 w-4', liked && 'fill-current')} />{compact(likes)}
    </button>
  );
}

export function CopyLinkButton() {
  const [copied, setCopied] = useState(false);
  return (
    <button
      onClick={() => { navigator.clipboard.writeText(window.location.href); setCopied(true); setTimeout(() => setCopied(false), 1500); }}
      className="inline-flex items-center gap-2 rounded-full bg-fg/5 px-4 py-2 text-sm font-semibold text-fg transition hover:bg-fg/10"
    >
      <Link2 className="h-4 w-4" />{copied ? 'Copied!' : 'Share'}
    </button>
  );
}

/* Season selector + episode list for show pages. seasons = [[seasonNumber, episodes[]], ...] */
export function SeasonEpisodes({ seasons, currentId }) {
  const [active, setActive] = useState(seasons[0]?.[0]);
  const current = seasons.find(([n]) => n === active) || seasons[0];
  return (
    <>
      {seasons.length > 1 && (
        <div className="mb-5 flex flex-wrap gap-2">
          {seasons.map(([n, eps]) => (
            <button key={n} onClick={() => setActive(n)} className={cn('rounded-full px-4 py-2 text-sm font-semibold transition', n === active ? 'bg-fg text-bg' : 'bg-fg/10 text-fg/80 hover:bg-fg/15')}>
              Season {n} <span className="opacity-60">({eps.length})</span>
            </button>
          ))}
        </div>
      )}
      <div className="divide-y divide-fg/10">{current?.[1].map((ep) => <EpisodeRow key={ep.id} post={ep} active={ep.id === currentId} />)}</div>
    </>
  );
}
