import Link from 'next/link';
import { Calendar, Clock, Eye, ListVideo } from 'lucide-react';
import { compact, formatDate, formatDuration, postUrl, seriesUrl } from '@/lib/utils';
import { PlayButton } from './AudioPlayer';
import { AudioRow, EpisodeRow, Kicker, NewsCard, VideoCard, postsToTracks } from './MediaCards';
import { CopyLinkButton, LikeButton, VideoPlayer } from './MediaClient';

const Prose = ({ html }) => (
  <div className="prose max-w-none prose-headings:font-heading prose-headings:text-fg prose-p:text-fg/80 prose-a:text-primary prose-strong:text-fg prose-li:text-fg/80" dangerouslySetInnerHTML={{ __html: html || '' }} />
);

/* Newspaper-style article: left-aligned headline, standfirst, byline bar, sidebar with more stories. */
export function NewsArticleView({ post, related, more }) {
  const cat = post.categories?.[0];
  return (
    <article className="site-container py-8">
      <div className="grid gap-12 lg:grid-cols-[minmax(0,1fr)_320px]">
        <div className="min-w-0">
          {cat && <Link href={`/category/${cat.slug}`} className="text-sm font-bold uppercase tracking-wider hover:underline" style={{ color: cat.color }}>{cat.name}</Link>}
          <Kicker post={{ ...post, categories: [] }} className="mt-3" />
          <h1 className="font-heading text-3xl font-black leading-[1.15] tracking-tight text-fg sm:text-4xl lg:text-5xl">{post.title}</h1>
          {post.excerpt && <p className="mt-4 text-lg leading-relaxed text-fg/70 sm:text-xl">{post.excerpt}</p>}
          <div className="mt-6 flex flex-wrap items-center justify-between gap-4 border-y border-fg/10 py-4">
            <div className="flex items-center gap-3">
              {post.author?.avatar && <img src={post.author.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />}
              <div className="text-sm">
                <div className="font-bold text-fg">By {post.author?.name || 'Staff reporter'}</div>
                <div className="text-fg/55">{formatDate(post.publishedAt, { dateStyle: 'long', timeStyle: 'short' })} · {post.readingTime} min read</div>
              </div>
            </div>
            <CopyLinkButton />
          </div>
          {post.coverImage && post.format !== 'GALLERY' && (
            <figure className="mt-6">
              <img src={post.coverImage} alt={post.title} className="aspect-video w-full rounded-theme object-cover" />
              <figcaption className="mt-2 text-xs text-fg/50">Photo: {post.author?.name || 'Staff'}</figcaption>
            </figure>
          )}
          {post.format === 'GALLERY' && post.gallery?.length > 0 && (
            <div className="mt-6 space-y-6">
              {post.gallery.map((g, i) => (
                <figure key={i}>
                  <img src={g.src} alt={g.caption || ''} className="w-full rounded-theme object-cover" />
                  {g.caption && <figcaption className="mt-2 text-sm text-fg/60"><b className="text-fg">{i + 1}/{post.gallery.length}</b> {g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          <div className="prose prose-lg mt-8 max-w-none prose-headings:font-heading prose-headings:text-fg prose-p:text-fg/85 prose-a:text-primary prose-strong:text-fg prose-li:text-fg/85 prose-blockquote:border-primary" dangerouslySetInnerHTML={{ __html: post.content || '' }} />
          {post.tags?.length > 0 && (
            <div className="mt-8 flex flex-wrap gap-2 border-t border-fg/10 pt-6">{post.tags.map((t) => <Link key={t.id} href={`/tag/${t.slug}`} className="rounded-sm bg-fg/5 px-3 py-1 text-sm font-semibold text-fg/75 hover:bg-primary hover:text-white">{t.name}</Link>)}</div>
          )}
        </div>
        <aside className="space-y-8">
          <div className="sticky top-16 space-y-8">
            {related.length > 0 && (
              <div>
                <h3 className="mb-4 border-b-2 border-fg pb-2 font-heading text-lg font-black">More in {cat?.name || 'news'}</h3>
                <div className="divide-y divide-fg/10">{related.map((p) => <NewsCard key={p.id} post={p} variant="horizontal" className="py-3 first:pt-0 [&>div:first-child]:!w-24" />)}</div>
              </div>
            )}
            {more?.length > 0 && (
              <div>
                <h3 className="mb-4 border-b-2 border-fg pb-2 font-heading text-lg font-black">Most read</h3>
                <ol className="space-y-4">
                  {more.map((p, i) => (
                    <li key={p.id}><Link href={postUrl(p)} className="group flex gap-3"><span className="font-heading text-3xl font-black leading-none text-primary/40">{i + 1}</span><span className="font-semibold leading-snug text-fg group-hover:text-primary">{p.title}</span></Link></li>
                  ))}
                </ol>
              </div>
            )}
          </div>
        </aside>
      </div>
    </article>
  );
}

/* YouTube-style watch page. Episodes of a series appear in the sidebar; otherwise "up next". */
export function WatchView({ post, episodes, upNext }) {
  const inSeries = post.series && episodes.length > 1;
  const epLabel = post.season && post.episode ? `S${post.season} · E${post.episode}` : null;
  return (
    <div className="mx-auto max-w-[1500px] px-4 py-6 sm:px-6 lg:py-8">
      <div className="grid gap-8 lg:grid-cols-[minmax(0,1fr)_400px]">
        <div className="min-w-0">
          <VideoPlayer url={post.videoUrl} poster={post.coverImage} title={post.title} autoPlay={false} />
          {post.series && (
            <Link href={seriesUrl(post.series)} className="mt-5 inline-flex items-center gap-2 text-sm font-bold text-primary hover:underline">
              <ListVideo className="h-4 w-4" />{post.series.title}{epLabel && <span className="text-fg/50">· {epLabel}</span>}
            </Link>
          )}
          <h1 className="mt-2 font-heading text-2xl font-extrabold leading-tight tracking-tight text-fg sm:text-3xl">{post.title}</h1>
          <div className="mt-4 flex flex-wrap items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              {post.author?.avatar && <img src={post.author.avatar} alt="" className="h-11 w-11 rounded-full object-cover" />}
              <div>
                <div className="font-bold text-fg">{post.author?.name}</div>
                <div className="text-xs text-fg/50">{post.author?.bio?.slice(0, 60)}</div>
              </div>
            </div>
            <div className="flex flex-wrap gap-2"><LikeButton slug={post.slug} initial={post.likes} /><CopyLinkButton /></div>
          </div>
          <div className="mt-5 rounded-theme bg-surface p-5">
            <div className="mb-3 flex flex-wrap gap-x-4 gap-y-1 text-sm font-semibold text-fg">
              <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{compact(post.views + 1)} views</span>
              <span className="flex items-center gap-1.5"><Calendar className="h-4 w-4" />{formatDate(post.publishedAt)}</span>
              {post.duration ? <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{formatDuration(post.duration)}</span> : null}
            </div>
            {post.excerpt && <p className="mb-3 text-fg/75">{post.excerpt}</p>}
            <Prose html={post.content} />
            {post.tags?.length > 0 && (
              <div className="mt-4 flex flex-wrap gap-2">{post.tags.map((t) => <Link key={t.id} href={`/tag/${t.slug}`} className="text-sm font-semibold text-primary">#{t.name}</Link>)}</div>
            )}
          </div>
        </div>

        <aside className="min-w-0">
          {inSeries ? (
            <div className="overflow-hidden rounded-theme border border-fg/10">
              <div className="border-b border-fg/10 bg-surface px-4 py-3">
                <Link href={seriesUrl(post.series)} className="font-heading font-bold text-fg hover:text-primary">{post.series.title}</Link>
                <div className="text-xs text-fg/50">{episodes.findIndex((e) => e.id === post.id) + 1} / {episodes.length}</div>
              </div>
              <div className="max-h-[70vh] overflow-y-auto p-1 [&_.w-36]:!w-28 [&_p]:!hidden">
                {episodes.map((ep) => <EpisodeRow key={ep.id} post={ep} active={ep.id === post.id} />)}
              </div>
            </div>
          ) : null}
          <div className={inSeries ? 'mt-6 space-y-3' : 'space-y-3'}>
            <h3 className="text-sm font-bold uppercase tracking-wider text-fg/50">Up next</h3>
            {upNext.map((p) => <VideoCard key={p.id} post={p} compact />)}
          </div>
        </aside>
      </div>
    </div>
  );
}

/* Podcast episode page with the persistent player. */
export function ListenView({ post, episodes, upNext }) {
  const list = episodes.length ? episodes : [post, ...upNext];
  const tracks = postsToTracks(list);
  const index = Math.max(0, tracks.findIndex((t) => t.id === post.id));
  const cover = post.coverImage || post.series?.poster;
  return (
    <>
      <section className="relative overflow-hidden">
        {cover && <img src={cover} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-3xl" />}
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgb(var(--c-bg))]" />
        <div className="site-container relative grid items-center gap-10 py-16 md:grid-cols-[280px_1fr]">
          {cover && <img src={cover} alt="" className="aspect-square w-full max-w-[280px] rounded-theme-lg object-cover shadow-2xl" />}
          <div>
            {post.series && <Link href={seriesUrl(post.series)} className="eyebrow mb-4">{post.series.title}{post.episode && ` · Episode ${post.episode}`}</Link>}
            <h1 className="font-heading text-3xl font-extrabold leading-tight tracking-tight text-fg sm:text-5xl">{post.title}</h1>
            {post.excerpt && <p className="mt-4 max-w-2xl text-lg text-fg/65">{post.excerpt}</p>}
            <div className="mt-6 flex flex-wrap items-center gap-4">
              {tracks.length ? <PlayButton tracks={tracks} index={index} label="Play episode" className="!px-7 !py-3.5" /> : <span className="text-sm text-fg/50">No audio file attached.</span>}
              <span className="text-sm text-fg/55">{formatDate(post.publishedAt)} · {formatDuration(post.duration) || '—'}</span>
              <LikeButton slug={post.slug} initial={post.likes} />
              <CopyLinkButton />
            </div>
            {post.audioUrl && <a href={post.audioUrl} download className="mt-4 inline-block text-xs font-semibold text-fg/50 hover:text-primary">Download MP3</a>}
          </div>
        </div>
      </section>
      <div className="site-container grid gap-12 pb-20 lg:grid-cols-[1fr_380px]">
        <div><Prose html={post.content} /></div>
        <aside className="space-y-2.5">
          <h3 className="mb-3 text-sm font-bold uppercase tracking-wider text-fg/50">{episodes.length ? 'All episodes' : 'More to listen'}</h3>
          {list.filter((p) => p.audioUrl).map((p) => <AudioRow key={p.id} post={p} tracks={tracks} index={Math.max(0, tracks.findIndex((t) => t.id === p.id))} />)}
        </aside>
      </div>
    </>
  );
}

