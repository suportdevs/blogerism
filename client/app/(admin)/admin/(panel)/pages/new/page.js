'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, ArrowRight, Check, Loader2 } from 'lucide-react';
import { api } from '@/lib/api';
import { BLOCKS, PAGE_TEMPLATES } from '@/lib/blocks';
import { newBlock } from '@/components/admin/PageBuilder';
import { cn } from '@/lib/utils';

export default function NewPage() {
  const router = useRouter();
  const [title, setTitle] = useState('');
  const [template, setTemplate] = useState('landing');
  const [loading, setLoading] = useState(false);

  const create = async (e) => {
    e.preventDefault();
    if (!title.trim()) { toast.error('Give your page a title'); return; }
    setLoading(true);
    try {
      const t = PAGE_TEMPLATES[template];
      const blocks = t.blocks.map((type) => newBlock(type, t.style));
      if (blocks[0]?.type === 'pageHeader') blocks[0].data.title = title;
      const page = await api.post('/admin/pages', { title, blocks, template: template === 'landing' ? 'landing' : 'default' });
      router.replace(`/admin/pages/${page.id}`);
    } catch (err) {
      toast.error(err.message);
      setLoading(false);
    }
  };

  return (
    <div className="mx-auto max-w-5xl p-4 sm:p-8">
      <Link href="/admin/pages" className="mb-6 inline-flex items-center gap-2 text-sm font-semibold text-ink-500 hover:text-brand-600"><ArrowLeft className="h-4 w-4" />All pages</Link>
      <h1 className="text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white">Create a new page</h1>
      <p className="mt-1 text-ink-500">Pick a starting point — you can add, remove and rearrange blocks afterwards.</p>

      <form onSubmit={create} className="mt-8 space-y-8">
        <input autoFocus value={title} onChange={(e) => setTitle(e.target.value)} placeholder="Page title, e.g. “Our services”" className="a-input h-14 text-lg font-semibold" />

        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {Object.entries(PAGE_TEMPLATES).map(([key, t]) => (
            <button
              type="button"
              key={key}
              onClick={() => setTemplate(key)}
              className={cn('group relative rounded-2xl border-2 bg-white p-4 text-left transition hover:-translate-y-0.5 dark:bg-ink-900', template === key ? 'border-brand-500 shadow-brand-glow' : 'border-ink-200 hover:border-brand-300 dark:border-white/10')}
            >
              {template === key && <span className="absolute right-3 top-3 grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-white"><Check className="h-3.5 w-3.5" /></span>}
              <div className="mb-4 space-y-1.5 rounded-xl bg-ink-50 p-3 dark:bg-white/5">
                {t.blocks.length ? t.blocks.slice(0, 6).map((b, i) => (
                  <div key={i} className={cn('rounded-md bg-gradient-to-r', i === 0 ? 'h-8 from-brand-200 to-fuchsia-200 dark:from-brand-500/30 dark:to-fuchsia-500/30' : 'h-3 from-ink-200 to-ink-100 dark:from-white/10 dark:to-white/5')} />
                )) : <div className="grid h-16 place-items-center rounded-md border-2 border-dashed border-ink-200 text-xs text-ink-400 dark:border-white/10">Empty canvas</div>}
              </div>
              <div className="font-bold text-ink-900 dark:text-white">{t.label}</div>
              <div className="mt-1 line-clamp-2 text-xs text-ink-400">{t.blocks.length ? t.blocks.map((b) => BLOCKS[b].label).join(' · ') : 'Start from scratch'}</div>
            </button>
          ))}
        </div>

        <button disabled={loading} className="a-btn-primary h-12 px-6 text-base">
          {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Create & open builder <ArrowRight className="h-4 w-4" /></>}
        </button>
      </form>
    </div>
  );
}
