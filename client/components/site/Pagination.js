import Link from 'next/link';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

export default function Pagination({ meta, basePath, query = {} }) {
  if (!meta || meta.pages <= 1) return null;
  const href = (page) => {
    const params = new URLSearchParams({ ...query, page: String(page) });
    return `${basePath}?${params.toString()}`;
  };
  const pages = Array.from({ length: meta.pages }, (_, i) => i + 1).filter((p) => p === 1 || p === meta.pages || Math.abs(p - meta.page) <= 1);

  return (
    <nav className="mt-14 flex items-center justify-center gap-2">
      <Link aria-disabled={meta.page <= 1} href={href(Math.max(1, meta.page - 1))} className={cn('grid h-11 w-11 place-items-center rounded-full border border-fg/10 text-fg/70 hover:border-primary hover:text-primary', meta.page <= 1 && 'pointer-events-none opacity-40')}>
        <ChevronLeft className="h-4 w-4" />
      </Link>
      {pages.map((p, i) => (
        <span key={p} className="flex items-center gap-2">
          {i > 0 && p - pages[i - 1] > 1 && <span className="text-fg/40">…</span>}
          <Link href={href(p)} className={cn('grid h-11 min-w-11 place-items-center rounded-full px-3 text-sm font-semibold transition', p === meta.page ? 'bg-primary text-white shadow-glow' : 'border border-fg/10 text-fg/70 hover:border-primary hover:text-primary')}>{p}</Link>
        </span>
      ))}
      <Link aria-disabled={meta.page >= meta.pages} href={href(Math.min(meta.pages, meta.page + 1))} className={cn('grid h-11 w-11 place-items-center rounded-full border border-fg/10 text-fg/70 hover:border-primary hover:text-primary', meta.page >= meta.pages && 'pointer-events-none opacity-40')}>
        <ChevronRight className="h-4 w-4" />
      </Link>
    </nav>
  );
}
