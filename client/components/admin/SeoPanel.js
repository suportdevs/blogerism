'use client';

import { Globe } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Field } from './ui';

function Counter({ value = '', max }) {
  const len = value.length;
  return <span className={cn('text-xs font-semibold', len > max ? 'text-rose-500' : len > max * 0.85 ? 'text-amber-500' : 'text-ink-400')}>{len}/{max}</span>;
}

// SEO fields with a live Google search result preview.
export default function SeoPanel({ title, description, onTitle, onDescription, fallbackTitle, fallbackDescription, url }) {
  const t = title || fallbackTitle || 'Page title';
  const d = description || fallbackDescription || 'Add a meta description to control how this page appears in search results.';
  return (
    <div className="space-y-4">
      <div className="rounded-xl border border-ink-200 bg-white p-4 dark:border-white/10 dark:bg-ink-950/40">
        <div className="mb-1 flex items-center gap-2 text-xs text-ink-500">
          <span className="grid h-6 w-6 place-items-center rounded-full bg-ink-100 dark:bg-white/10"><Globe className="h-3.5 w-3.5" /></span>
          <span className="truncate">{url}</span>
        </div>
        <div className="line-clamp-1 text-lg font-medium text-[#1a0dab] dark:text-[#8ab4f8]">{t}</div>
        <div className="line-clamp-2 text-sm text-ink-600 dark:text-ink-300">{d}</div>
      </div>
      <Field label={<span className="flex justify-between">SEO title <Counter value={title} max={60} /></span>}>
        <input className="a-input" value={title || ''} onChange={(e) => onTitle(e.target.value)} placeholder={fallbackTitle} />
      </Field>
      <Field label={<span className="flex justify-between">Meta description <Counter value={description} max={160} /></span>}>
        <textarea className="a-textarea" rows={3} value={description || ''} onChange={(e) => onDescription(e.target.value)} placeholder={fallbackDescription} />
      </Field>
    </div>
  );
}
