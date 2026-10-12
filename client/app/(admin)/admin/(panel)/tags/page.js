'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Check, Hash, Pencil, Plus, Tags, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { EmptyState, PageHeader, PageLoader, SearchInput, useConfirm } from '@/components/admin/ui';

export default function TagsPage() {
  const confirm = useConfirm();
  const [q, setQ] = useState('');
  const { data, reload } = useApi('/admin/taxonomy/tags', { q });
  const [name, setName] = useState('');
  const [edit, setEdit] = useState(null);

  if (!data) return <PageLoader />;

  const create = async (e) => {
    e.preventDefault();
    if (!name.trim()) return;
    try {
      await api.post('/admin/taxonomy/tags', { name });
      setName('');
      toast.success('Tag created');
      reload();
    } catch (err) { toast.error(err.message); }
  };
  const update = async () => {
    try {
      await api.put(`/admin/taxonomy/tags/${edit.id}`, { name: edit.name });
      setEdit(null);
      reload();
    } catch (err) { toast.error(err.message); }
  };
  const remove = async (t) => {
    if (!(await confirm({ title: `Delete tag “${t.name}”?` }))) return;
    await api.del(`/admin/taxonomy/tags/${t.id}`);
    reload();
  };
  const max = Math.max(1, ...data.items.map((t) => t._count.posts));

  return (
    <>
      <PageHeader title="Tags" description="Lightweight keywords for cross-linking posts." />
      <div className="a-card p-5">
        <div className="mb-5 flex flex-wrap gap-3">
          <form onSubmit={create} className="flex flex-1 gap-2">
            <div className="relative flex-1"><Hash className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" /><input className="a-input pl-9" placeholder="New tag name" value={name} onChange={(e) => setName(e.target.value)} /></div>
            <button className="a-btn-primary"><Plus className="h-4 w-4" />Add</button>
          </form>
          <SearchInput value={q} onChange={setQ} placeholder="Filter tags…" className="w-full sm:w-64" />
        </div>
        {data.items.length === 0 ? <EmptyState icon={Tags} title="No tags" /> : (
          <div className="flex flex-wrap gap-2">
            {data.items.map((t) => (
              <div key={t.id} className="group flex items-center gap-2 rounded-xl border border-ink-200 bg-white py-1.5 pl-3 pr-1.5 transition hover:border-brand-300 dark:border-white/10 dark:bg-white/[.02]" style={{ fontSize: `${13 + (t._count.posts / max) * 4}px` }}>
                {edit?.id === t.id ? (
                  <>
                    <input autoFocus className="w-32 bg-transparent font-semibold outline-none" value={edit.name} onChange={(e) => setEdit({ ...edit, name: e.target.value })} onKeyDown={(e) => e.key === 'Enter' && update()} />
                    <button onClick={update} className="rounded-lg p-1 text-emerald-600 hover:bg-emerald-50"><Check className="h-4 w-4" /></button>
                    <button onClick={() => setEdit(null)} className="rounded-lg p-1 hover:bg-ink-100"><X className="h-4 w-4" /></button>
                  </>
                ) : (
                  <>
                    <span className="font-semibold text-ink-800 dark:text-ink-100">#{t.name}</span>
                    <span className="rounded-md bg-ink-100 px-1.5 text-xs font-bold text-ink-500 dark:bg-white/10">{t._count.posts}</span>
                    <button onClick={() => setEdit({ id: t.id, name: t.name })} className="hidden rounded-lg p-1 text-ink-400 hover:bg-ink-100 group-hover:block dark:hover:bg-white/10"><Pencil className="h-3.5 w-3.5" /></button>
                    <button onClick={() => remove(t)} className="hidden rounded-lg p-1 text-ink-400 hover:bg-rose-50 hover:text-rose-600 group-hover:block"><Trash2 className="h-3.5 w-3.5" /></button>
                  </>
                )}
              </div>
            ))}
          </div>
        )}
      </div>
    </>
  );
}
