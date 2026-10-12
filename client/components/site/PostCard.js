import Link from 'next/link';
import { ArrowUpRight, Clock, Eye } from 'lucide-react';
import { cn, compact, formatDate, postUrl } from '@/lib/utils';
import { Thumb } from './MediaCards';

export function CategoryPill({ category, className }) {
  return (
    <span
      className={cn('inline-flex items-center gap-1.5 rounded-full px-2.5 py-1 text-xs font-semibold', className)}
      style={{ backgroundColor: `${category.color}1a`, color: category.color }}
    >
      <span className="h-1.5 w-1.5 rounded-full" style={{ backgroundColor: category.color }} />
      {category.name}
    </span>
  );
}

export default function PostCard({ post, variant = 'grid', showAuthor = true, showReadingTime = true }) {
  const cat = post.categories?.[0];
  if (variant === 'list') {
    return (
      <Link href={postUrl(post)} className="group grid gap-5 rounded-theme-lg border border-fg/10 bg-bg p-3 transition hover:border-primary/30 hover:shadow-glow sm:grid-cols-[260px_1fr]">
        <Thumb post={post} className="bg-surface" />
        <div className="flex flex-col justify-center py-2 pr-3">
          {cat && <CategoryPill category={cat} className="mb-3 self-start" />}
          <h3 className="font-heading text-xl font-bold leading-snug text-fg group-hover:text-primary">{post.title}</h3>
          {post.excerpt && <p className="mt-2 line-clamp-2 text-sm text-fg/60">{post.excerpt}</p>}
          <Meta post={post} showAuthor={showAuthor} showReadingTime={showReadingTime} />
        </div>
      </Link>
    );
  }

  return (
    <Link href={postUrl(post)} className="group flex flex-col overflow-hidden rounded-theme-lg border border-fg/10 bg-bg transition duration-300 hover:-translate-y-1 hover:border-primary/30 hover:shadow-glow">
      <div className="relative aspect-[16/10] overflow-hidden bg-surface">
        <Thumb post={post} aspect="h-full" rounded="rounded-none" />
        {cat && <CategoryPill category={cat} className="absolute left-3 top-3 bg-bg/90 backdrop-blur" />}
        <span className="absolute right-3 top-3 grid h-9 w-9 translate-y-1 place-items-center rounded-full bg-bg/90 text-fg opacity-0 backdrop-blur transition group-hover:translate-y-0 group-hover:opacity-100">
          <ArrowUpRight className="h-4 w-4" />
        </span>
      </div>
      <div className="flex flex-1 flex-col p-5">
        <h3 className="font-heading text-lg font-bold leading-snug text-fg transition group-hover:text-primary">{post.title}</h3>
        {post.excerpt && <p className="mt-2 line-clamp-2 text-sm leading-relaxed text-fg/60">{post.excerpt}</p>}
        <div className="mt-auto"><Meta post={post} showAuthor={showAuthor} showReadingTime={showReadingTime} /></div>
      </div>
    </Link>
  );
}

function Meta({ post, showAuthor, showReadingTime }) {
  return (
    <div className="mt-4 flex items-center gap-3 text-xs text-fg/50">
      {showAuthor && post.author && (
        <span className="flex items-center gap-2 font-medium text-fg/70">
          {post.author.avatar && <img src={post.author.avatar} alt="" className="h-6 w-6 rounded-full object-cover" />}
          {post.author.name}
        </span>
      )}
      <span>{formatDate(post.publishedAt || post.createdAt)}</span>
      {showReadingTime && <span className="flex items-center gap-1"><Clock className="h-3 w-3" />{post.readingTime} min</span>}
      <span className="ml-auto flex items-center gap-1"><Eye className="h-3 w-3" />{compact(post.views)}</span>
    </div>
  );
}
