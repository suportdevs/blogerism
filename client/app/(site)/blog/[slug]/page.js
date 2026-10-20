import Link from 'next/link';
import { ArrowLeft, ArrowRight, Clock, Eye, Facebook, Linkedin, Twitter } from 'lucide-react';
import { fetchPublic, getBootstrap } from '@/lib/server';
import { compact, formatDate, slugify, stripHtml } from '@/lib/utils';
import PostCard, { CategoryPill } from '@/components/site/PostCard';
import { ReadingProgress } from '@/components/site/Extras';
import { NewsletterForm } from '@/components/site/forms';
import { ListenView, LuxeArticleView, NewsArticleView, WatchView } from '@/components/site/PostViews';
import { Kicker } from '@/components/site/MediaCards';
import { Comments, PostActions, TextSizer } from '@/components/site/Engagement';
import { engagementOf, saveLabels } from '@/lib/engagement';
import { JsonLd, postJsonLd } from '@/components/site/StructuredData';

const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

// Adds ids to h2/h3 tags and returns a table of contents.
function withToc(html = '') {
  const toc = [];
  const seen = {};
  const out = html.replace(/<(h[23])([^>]*)>([\s\S]*?)<\/\1>/gi, (_m, tag, attrs, inner) => {
    const text = stripHtml(inner);
    let id = slugify(text) || 'section';
    seen[id] = (seen[id] || 0) + 1;
    if (seen[id] > 1) id = `${id}-${seen[id]}`;
    toc.push({ id, text, level: tag.toLowerCase() === 'h2' ? 2 : 3 });
    return `<${tag}${attrs.replace(/\sid="[^"]*"/, '')} id="${id}">${inner}</${tag}>`;
  });
  return { html: out, toc };
}

export async function generateMetadata({ params }) {
  const data = await fetchPublic(`/posts/${params.slug}?view=false`, { allow404: true });
  if (!data) return { title: 'Not found' };
  const { post } = data;
  return {
    title: post.seoTitle || post.title,
    description: post.seoDescription || post.excerpt,
    openGraph: { type: 'article', title: post.seoTitle || post.title, description: post.seoDescription || post.excerpt, images: post.coverImage ? [post.coverImage] : undefined, publishedTime: post.publishedAt },
  };
}

export default async function PostPage({ params }) {
  const [{ post, related, prev, next, episodes, upNext }, { settings, theme }] = await Promise.all([
    fetchPublic(`/posts/${params.slug}`, { revalidate: 0 }),
    getBootstrap(),
  ]);
  const engagement = engagementOf(settings);
  const labels = saveLabels(theme);
  const ui = { engagement, labels };
  const ld = <JsonLd data={postJsonLd(post, { news: theme?.layout?.article === 'news' })} />;
  if (post.format === 'VIDEO') return <>{ld}<WatchView post={post} episodes={episodes} upNext={upNext} {...ui} /></>;
  if (post.format === 'AUDIO') return <>{ld}<ListenView post={post} episodes={episodes} upNext={upNext} {...ui} /></>;
  if (theme?.layout?.article === 'luxe') return <>{ld}<LuxeArticleView post={post} related={related} {...ui} /></>;
  if (theme?.layout?.article === 'news') {
    const popular = await fetchPublic(`/posts?sort=popular&limit=5&format=STANDARD&exclude=${post.id}`);
    return <>{ld}<NewsArticleView post={post} related={related.slice(0, 4)} more={popular.items} {...ui} /></>;
  }
  const { html, toc } = withToc(post.content);
  const url = `${SITE_URL}/blog/${post.slug}`;
  const a = settings.appearance;
  const share = [
    [Twitter, `https://twitter.com/intent/tweet?url=${encodeURIComponent(url)}&text=${encodeURIComponent(post.title)}`],
    [Facebook, `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`],
    [Linkedin, `https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`],
  ];
  return (
    <article>
      <ReadingProgress />
      {ld}

      <header className="relative overflow-hidden">
        <div className="pointer-events-none absolute -top-40 left-1/2 h-96 w-[800px] -translate-x-1/2 rounded-full bg-primary/15 blur-[110px]" />
        <div className="site-container relative max-w-4xl pb-10 pt-14 text-center sm:pt-20">
          <Link href="/blog" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-fg/60 hover:text-primary"><ArrowLeft className="h-4 w-4" />Back to blog</Link>
          <div className="mb-5 flex flex-wrap justify-center gap-2">{post.categories.map((c) => <Link key={c.id} href={`/category/${c.slug}`}><CategoryPill category={c} /></Link>)}</div>
          {(post.isBreaking || post.subtitle) && <Kicker post={{ ...post, categories: [] }} className="mb-3 justify-center" />}
          <h1 className="font-heading text-4xl font-extrabold leading-[1.1] tracking-tight sm:text-5xl lg:text-6xl">{post.title}</h1>
          {post.excerpt && <p className="mx-auto mt-6 max-w-2xl text-lg text-fg/60 sm:text-xl">{post.excerpt}</p>}
          <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-sm text-fg/60">
            {a.showAuthor && post.author && (
              <span className="flex items-center gap-2.5 font-semibold text-fg">
                {post.author.avatar && <img src={post.author.avatar} alt="" className="h-9 w-9 rounded-full object-cover ring-2 ring-primary/30" />}
                {post.author.name}
              </span>
            )}
            <span>{formatDate(post.publishedAt)}</span>
            {a.showReadingTime && <span className="flex items-center gap-1.5"><Clock className="h-4 w-4" />{post.readingTime} min read</span>}
            <span className="flex items-center gap-1.5"><Eye className="h-4 w-4" />{compact(post.views + 1)} views</span>
          </div>
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3"><PostActions post={post} {...ui} /><TextSizer /></div>
        </div>
        {post.coverImage && (
          <div className="site-container max-w-6xl">
            <img src={post.coverImage} alt={post.title} className="aspect-[21/9] w-full rounded-theme-lg object-cover shadow-2xl" />
          </div>
        )}
      </header>

      <div className="site-container grid max-w-6xl gap-12 py-14 lg:grid-cols-[1fr_260px]">
        <div className="min-w-0">
          {post.format === 'GALLERY' && post.gallery?.length > 0 && (
            <div className="mb-10 grid gap-3 sm:grid-cols-2">
              {post.gallery.map((g, i) => (
                <figure key={i} className={i === 0 ? 'sm:col-span-2' : ''}>
                  <a href={g.src} target="_blank" rel="noreferrer"><img src={g.src} alt={g.caption || ''} className="w-full rounded-theme object-cover transition hover:opacity-90" /></a>
                  {g.caption && <figcaption className="mt-1.5 text-sm text-fg/55">{g.caption}</figcaption>}
                </figure>
              ))}
            </div>
          )}
          <div
            style={{ fontSize: 'calc(1.125rem * var(--reader-scale, 1))' }}
            className="prose prose-lg max-w-none prose-headings:scroll-mt-28 prose-headings:font-heading prose-headings:tracking-tight prose-headings:text-fg prose-p:text-fg/80 prose-a:text-primary prose-blockquote:rounded-r-theme prose-blockquote:border-l-primary prose-blockquote:bg-primary/5 prose-blockquote:py-1 prose-blockquote:text-fg/80 prose-strong:text-fg prose-code:text-primary prose-li:text-fg/80 prose-img:rounded-theme"
            dangerouslySetInnerHTML={{ __html: html }}
          />

          {post.tags.length > 0 && (
            <div className="mt-12 flex flex-wrap gap-2 border-t border-fg/10 pt-8">
              {post.tags.map((t) => <Link key={t.id} href={`/tag/${t.slug}`} className="rounded-full border border-fg/10 px-3.5 py-1.5 text-sm font-medium text-fg/70 transition hover:border-primary hover:text-primary">#{t.name}</Link>)}
            </div>
          )}

          {a.showAuthor && post.author && (
            <div className="mt-10 flex gap-5 rounded-theme-lg border border-fg/10 bg-surface p-6">
              {post.author.avatar && <img src={post.author.avatar} alt="" className="h-16 w-16 shrink-0 rounded-full object-cover" />}
              <div>
                <div className="text-xs font-semibold uppercase tracking-wider text-fg/45">Written by</div>
                <div className="font-heading text-lg font-bold">{post.author.name}</div>
                {post.author.bio && <p className="mt-1 text-fg/60">{post.author.bio}</p>}
              </div>
            </div>
          )}

          <PostActions post={post} {...ui} className="mt-10 justify-center rounded-theme-lg border border-fg/10 bg-surface p-4" />

          <nav className="mt-10 grid gap-4 sm:grid-cols-2">
            {prev ? (
              <Link href={`/blog/${prev.slug}`} className="group rounded-theme border border-fg/10 p-5 transition hover:border-primary">
                <span className="flex items-center gap-1 text-xs font-semibold uppercase tracking-wider text-fg/45"><ArrowLeft className="h-3 w-3" />Previous</span>
                <span className="mt-1 block font-semibold group-hover:text-primary">{prev.title}</span>
              </Link>
            ) : <span />}
            {next && (
              <Link href={`/blog/${next.slug}`} className="group rounded-theme border border-fg/10 p-5 text-right transition hover:border-primary">
                <span className="flex items-center justify-end gap-1 text-xs font-semibold uppercase tracking-wider text-fg/45">Next<ArrowRight className="h-3 w-3" /></span>
                <span className="mt-1 block font-semibold group-hover:text-primary">{next.title}</span>
              </Link>
            )}
          </nav>

          {engagement.comments && <Comments slug={post.slug} />}
        </div>

        <aside className="hidden lg:block">
          <div className="sticky top-28 space-y-8">
            {toc.length > 0 && (
              <div>
                <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fg/45">On this page</h4>
                <ul className="space-y-1 border-l border-fg/10">
                  {toc.map((t) => (
                    <li key={t.id}><a href={`#${t.id}`} className={`-ml-px block border-l border-transparent py-1 text-sm text-fg/60 transition hover:border-primary hover:text-primary ${t.level === 3 ? 'pl-6' : 'pl-4'}`}>{t.text}</a></li>
                  ))}
                </ul>
              </div>
            )}
            <div>
              <h4 className="mb-3 text-xs font-bold uppercase tracking-wider text-fg/45">Share</h4>
              <div className="flex gap-2">
                {share.map(([Icon, href], i) => (
                  <a key={i} href={href} target="_blank" rel="noreferrer" className="grid h-10 w-10 place-items-center rounded-full border border-fg/10 text-fg/60 transition hover:border-primary hover:bg-primary hover:text-white"><Icon className="h-4 w-4" /></a>
                ))}
              </div>
            </div>
            {settings.advanced.enableNewsletter && (
              <div className="rounded-theme-lg border border-fg/10 bg-surface p-5">
                <h4 className="font-heading font-bold">Enjoyed this?</h4>
                <p className="mb-4 mt-1 text-sm text-fg/60">Get new articles in your inbox.</p>
                <NewsletterForm compact />
              </div>
            )}
          </div>
        </aside>
      </div>

      {related.length > 0 && (
        <section className="border-t border-fg/10 bg-surface py-16">
          <div className="site-container">
            <h2 className="mb-8 font-heading text-3xl font-extrabold tracking-tight">Keep reading</h2>
            <div className="grid gap-6 md:grid-cols-3">{related.map((p) => <PostCard key={p.id} post={p} showAuthor={a.showAuthor} showReadingTime={a.showReadingTime} />)}</div>
          </div>
        </section>
      )}
    </article>
  );
}
