import Link from 'next/link';
import { cn, formatDate, postUrl } from '@/lib/utils';
import PostCard from './PostCard';
import Pagination from './Pagination';
import { AudioRow, NewsCard, VideoCard, postsToTracks } from './MediaCards';

// Shared archive view used by /blog, /category/[slug], /tag/[slug] and /search.
// `mode` comes from the active theme: cards (blog), news, video or audio.
export default function PostListing({ featured, title, subtitle, eyebrow, data, categories, activeCategory, basePath, query, appearance, mode = 'cards', emptyText = 'Nothing found.' }) {
  const items = data.items;
  let body;
  if (!items.length) {
    body = <p className="py-20 text-center text-lg text-fg/50">{emptyText}</p>;
  } else if (mode === 'news') {
    const [lead, ...rest] = data.meta?.page > 1 ? [null, ...items] : items;
    body = (
      <div className="grid gap-10 lg:grid-cols-[2fr_1fr]">
        <div className="divide-y divide-fg/10">
          {lead && <NewsCard post={lead} variant="lead" className="pb-8" />}
          {rest.map((p) => <NewsCard key={p.id} post={p} variant="horizontal" className="py-5 [&>div:first-child]:sm:!w-56 [&_h3]:sm:text-lg" />)}
        </div>
        {categories && (
          <aside>
            <div className="sticky top-20 rounded-theme bg-surface p-5">
              <h3 className="mb-3 font-heading text-lg font-extrabold">Sections</h3>
              <div className="flex flex-col">
                {categories.filter((c) => c._count?.posts).map((c) => (
                  <Link key={c.id} href={`/category/${c.slug}`} className={cn('flex items-center justify-between border-b border-fg/10 py-2.5 text-sm font-semibold last:border-0', activeCategory === c.slug ? 'text-primary' : 'text-fg/80 hover:text-primary')}>
                    <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full" style={{ background: c.color }} />{c.name}</span><span className="text-fg/40">{c._count.posts}</span>
                  </Link>
                ))}
              </div>
            </div>
          </aside>
        )}
      </div>
    );
  } else if (mode === 'luxe') {
    body = (
      <div className="grid gap-x-10 gap-y-16 md:grid-cols-2 lg:grid-cols-3">
        {items.map((p, i) => (
          <Link key={p.id} href={postUrl(p)} className={cn('group block text-left', i === 0 && data.meta?.page <= 1 && 'md:col-span-2')}>
            <div className="overflow-hidden">
              {p.coverImage && <img src={p.coverImage} alt="" className={cn('w-full object-cover transition duration-[1500ms] group-hover:scale-105', i === 0 && data.meta?.page <= 1 ? 'aspect-[16/9]' : 'aspect-[4/5]')} />}
            </div>
            <div className="mt-6 text-[10.5px] font-medium uppercase tracking-[0.3em] text-primary">{p.categories?.[0]?.name}<span className="text-fg/40"> · {formatDate(p.publishedAt)}</span></div>
            <h3 className={cn('mt-3 font-heading leading-tight text-fg transition group-hover:text-primary', i === 0 && data.meta?.page <= 1 ? 'text-3xl sm:text-4xl' : 'text-2xl')}>{p.title}</h3>
            {p.excerpt && <p className="mt-3 line-clamp-2 text-fg/60">{p.excerpt}</p>}
            <span className="mt-5 inline-block border-b border-fg/40 pb-1 text-[10.5px] font-medium uppercase tracking-[0.3em] text-fg transition group-hover:border-primary group-hover:text-primary">Read the story</span>
          </Link>
        ))}
      </div>
    );
  } else if (mode === 'video') {
    body = <div className="grid gap-x-4 gap-y-8 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">{items.map((p) => <VideoCard key={p.id} post={p} />)}</div>;
  } else if (mode === 'audio') {
    const tracks = postsToTracks(items);
    body = <div className="mx-auto max-w-3xl space-y-2.5">{items.map((p) => <AudioRow key={p.id} post={p} tracks={tracks} index={Math.max(0, tracks.findIndex((t) => t.id === p.id))} />)}</div>;
  } else {
    const list = appearance.blogLayout === 'list';
    body = (
      <div className={cn('grid gap-6', list ? 'mx-auto max-w-4xl' : 'md:grid-cols-2 lg:grid-cols-3')}>
        {items.map((p) => <PostCard key={p.id} post={p} variant={list ? 'list' : 'grid'} showAuthor={appearance.showAuthor} showReadingTime={appearance.showReadingTime} />)}
      </div>
    );
  }

  const compactHeader = mode === 'news' || mode === 'video';
  return (
    <>
      {mode === 'luxe' ? (
        <section className="site-container pb-4 pt-16 text-center sm:pt-24">
          {eyebrow && <div className="mb-5 flex items-center justify-center gap-4 text-[11px] font-medium uppercase tracking-[0.38em] text-primary"><span className="h-px w-8 bg-current opacity-60" />{eyebrow}<span className="h-px w-8 bg-current opacity-60" /></div>}
          <h1 className="font-heading text-5xl leading-tight text-fg sm:text-7xl">{title}</h1>
          {subtitle && <p className="mx-auto mt-5 max-w-xl font-heading text-xl italic text-fg/60">{subtitle}</p>}
          {categories && (
            <nav className="mt-10 flex flex-wrap justify-center gap-x-8 gap-y-3 border-y border-fg/10 py-4">
              <Link href="/blog" className={cn('text-[10.5px] font-medium uppercase tracking-[0.3em]', !activeCategory ? 'text-primary' : 'text-fg/60 hover:text-fg')}>All</Link>
              {categories.filter((c) => c._count?.posts).map((c) => (
                <Link key={c.id} href={`/category/${c.slug}`} className={cn('text-[10.5px] font-medium uppercase tracking-[0.3em]', activeCategory === c.slug ? 'text-primary' : 'text-fg/60 hover:text-fg')}>{c.name}</Link>
              ))}
            </nav>
          )}
        </section>
      ) : compactHeader ? (
        <section className="site-container pt-10">
          {eyebrow && <div className="mb-1 text-xs font-bold uppercase tracking-widest text-primary">{eyebrow}</div>}
          <h1 className="border-b-2 border-fg pb-3 font-heading text-3xl font-black tracking-tight sm:text-4xl">{title}</h1>
          {subtitle && <p className="mt-3 text-fg/60">{subtitle}</p>}
        </section>
      ) : (
        <section className="relative overflow-hidden border-b border-fg/10">
          <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
          <div className="site-container relative py-16 text-center sm:py-20">
            {eyebrow && <span className="eyebrow mb-4">{eyebrow}</span>}
            <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">{title}</h1>
            {subtitle && <p className="mx-auto mt-4 max-w-2xl text-lg text-fg/60">{subtitle}</p>}
            {categories && mode === 'cards' && (
              <div className="mt-8 flex flex-wrap justify-center gap-2">
                <Link href="/blog" className={cn('rounded-full px-4 py-2 text-sm font-semibold transition', !activeCategory ? 'bg-fg text-bg' : 'border border-fg/10 text-fg/70 hover:border-fg/30')}>All</Link>
                {categories.map((c) => (
                  <Link key={c.id} href={`/category/${c.slug}`} className={cn('rounded-full px-4 py-2 text-sm font-semibold transition', activeCategory === c.slug ? 'bg-fg text-bg' : 'border border-fg/10 text-fg/70 hover:border-fg/30')}>
                    {c.name} <span className="opacity-50">{c._count?.posts}</span>
                  </Link>
                ))}
              </div>
            )}
          </div>
        </section>
      )}
      {featured}
      <section className="site-container py-10">
        {body}
        <Pagination meta={data.meta} basePath={basePath} query={query} />
      </section>
    </>
  );
}
