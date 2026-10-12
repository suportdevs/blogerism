'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { CornerDownRight, FolderTree, Loader2, Pencil, Trash2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn, slugify } from '@/lib/utils';
import { Card, ColorInput, EmptyState, Field, PageHeader, PageLoader, useConfirm } from '@/components/admin/ui';

const EMPTY = { name: '', slug: '', description: '', color: '#6d5dfc', parentId: '', order: 0 };
const SWATCHES = ['#6d5dfc', '#ec4899', '#f43f5e', '#f59e0b', '#10b981', '#14b8a6', '#0ea5e9', '#6366f1', '#8b5cf6', '#64748b'];

export default function CategoriesPage() {
  const confirm = useConfirm();
  const { data, reload } = useApi('/admin/taxonomy/categories');
  const [form, setForm] = useState(EMPTY);
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  if (!data) return <PageLoader />;
  const items = data.items;
  const roots = items.filter((c) => !c.parentId);
  const childrenOf = (id) => items.filter((c) => c.parentId === id);

  const save = async (e) => {
    e.preventDefault();
    setSaving(true);
    const body = { ...form, parentId: form.parentId ? Number(form.parentId) : null, order: Number(form.order) || 0 };
    delete body.id; delete body._count; delete body.createdAt; delete body.updatedAt;
    try {
      if (form.id) await api.put(`/admin/taxonomy/categories/${form.id}`, body);
      else await api.post('/admin/taxonomy/categories', body);
      toast.success(form.id ? 'Category updated' : 'Category created');
      setForm(EMPTY);
      reload();
    } catch (err) { toast.error(err.message); } finally { setSaving(false); }
  };

  const remove = async (c) => {
    if (!(await confirm({ title: `Delete “${c.name}”?`, message: 'Posts will be kept but un-assigned from this category.' }))) return;
    await api.del(`/admin/taxonomy/categories/${c.id}`);
    toast.success('Category deleted');
    if (form.id === c.id) setForm(EMPTY);
    reload();
  };

  const Row = ({ c, depth = 0 }) => (
    <>
      <div className={cn('group flex items-center gap-3 border-b border-ink-100 px-5 py-3.5 transition last:border-0 hover:bg-ink-50/70 dark:border-white/5 dark:hover:bg-white/[.02]', form.id === c.id && 'bg-brand-50/60 dark:bg-brand-500/10')}>
        {depth > 0 && <CornerDownRight className="h-4 w-4 text-ink-300" style={{ marginLeft: (depth - 1) * 20 }} />}
        <span className="grid h-9 w-9 shrink-0 place-items-center rounded-xl" style={{ background: `${c.color}1f`, color: c.color }}><FolderTree className="h-4 w-4" /></span>
        <div className="min-w-0 flex-1">
          <div className="font-semibold text-ink-900 dark:text-white">{c.name}</div>
          <div className="truncate text-xs text-ink-400">/category/{c.slug}{c.description && ` · ${c.description}`}</div>
        </div>
        <span className="rounded-full bg-ink-100 px-2.5 py-0.5 text-xs font-bold dark:bg-white/5">{c._count.posts} posts</span>
        <div className="flex opacity-0 transition group-hover:opacity-100">
          <button onClick={() => setForm({ ...EMPTY, ...c, parentId: c.parentId || '', description: c.description || '' })} className="a-btn-ghost a-btn-icon h-8 w-8"><Pencil className="h-4 w-4" /></button>
          <button onClick={() => remove(c)} className="a-btn-ghost a-btn-icon h-8 w-8 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>
        </div>
      </div>
      {childrenOf(c.id).map((ch) => <Row key={ch.id} c={ch} depth={depth + 1} />)}
    </>
  );

  return (
    <>
      <PageHeader title="Categories" description="Organize posts into a hierarchy of topics." />
      <div className="grid items-start gap-6 lg:grid-cols-[360px_1fr]">
        <Card title={form.id ? 'Edit category' : 'Add category'} actions={form.id && <button onClick={() => setForm(EMPTY)} className="a-btn-ghost a-btn-icon h-8 w-8"><X className="h-4 w-4" /></button>} className="lg:sticky lg:top-24">
          <form onSubmit={save} className="space-y-4">
            <Field label="Name" required><input required className="a-input" value={form.name} onChange={(e) => { set('name')(e.target.value); if (!form.id) set('slug')(slugify(e.target.value)); }} /></Field>
            <Field label="Slug"><input className="a-input" value={form.slug} onChange={(e) => set('slug')(slugify(e.target.value))} /></Field>
            <Field label="Parent">
              <select className="a-input" value={form.parentId} onChange={(e) => set('parentId')(e.target.value)}>
                <option value="">— None (top level) —</option>
                {items.filter((c) => c.id !== form.id).map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
              </select>
            </Field>
            <Field label="Description"><textarea className="a-textarea" rows={3} value={form.description} onChange={(e) => set('description')(e.target.value)} /></Field>
            <Field label="Color">
              <div className="mb-2 flex flex-wrap gap-1.5">
                {SWATCHES.map((s) => <button type="button" key={s} onClick={() => set('color')(s)} className={cn('h-7 w-7 rounded-lg ring-offset-2 transition dark:ring-offset-ink-900', form.color === s && 'ring-2 ring-ink-900 dark:ring-white')} style={{ background: s }} />)}
              </div>
              <ColorInput value={form.color} onChange={set('color')} />
            </Field>
            <Field label="Sort order"><input type="number" className="a-input" value={form.order} onChange={(e) => set('order')(e.target.value)} /></Field>
            <button className="a-btn-primary w-full" disabled={saving}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}{form.id ? 'Update category' : 'Create category'}</button>
          </form>
        </Card>
        <div className="a-card overflow-hidden">
          {roots.length ? roots.map((c) => <Row key={c.id} c={c} />) : <EmptyState icon={FolderTree} title="No categories" description="Create your first category using the form." />}
        </div>
      </div>
    </>
  );
}
