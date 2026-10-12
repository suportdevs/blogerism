'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Check, Loader2, Lock, Pencil, Plus, ShieldCheck, Trash2, Users } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { Badge, Field, Modal, PageHeader, PageLoader, useConfirm } from '@/components/admin/ui';

export default function RolesPage() {
  const confirm = useConfirm();
  const { data, reload } = useApi('/admin/roles');
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  if (!data) return <PageLoader />;

  const groups = data.permissions.reduce((acc, p) => { (acc[p.group] ||= []).push(p); return acc; }, {});
  const toggle = (key) => setForm((f) => ({ ...f, permissions: f.permissions.includes(key) ? f.permissions.filter((k) => k !== key) : [...f.permissions, key] }));
  const toggleGroup = (keys) => setForm((f) => {
    const all = keys.every((k) => f.permissions.includes(k));
    return { ...f, permissions: all ? f.permissions.filter((k) => !keys.includes(k)) : [...new Set([...f.permissions, ...keys])] };
  });

  const save = async () => {
    setSaving(true);
    try {
      const body = { name: form.name, description: form.description, permissions: form.permissions };
      if (form.id) await api.put(`/admin/roles/${form.id}`, body);
      else await api.post('/admin/roles', body);
      toast.success('Role saved');
      setForm(null);
      reload();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const remove = async (r) => {
    if (!(await confirm({ title: `Delete role “${r.name}”?` }))) return;
    try { await api.del(`/admin/roles/${r.id}`); reload(); } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader title="Roles & permissions" description="Define what each group of users is allowed to manage." actions={<button onClick={() => setForm({ name: '', description: '', permissions: [] })} className="a-btn-primary"><Plus className="h-4 w-4" />New role</button>} />
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {data.items.map((r) => {
          const all = r.permissions.includes('*');
          return (
            <div key={r.id} className="a-card flex flex-col p-5">
              <div className="flex items-start gap-3">
                <span className={cn('grid h-11 w-11 place-items-center rounded-xl text-white', all ? 'bg-gradient-to-br from-brand-400 to-fuchsia-500' : 'bg-gradient-to-br from-ink-400 to-ink-600')}><ShieldCheck className="h-5 w-5" /></span>
                <div className="flex-1">
                  <div className="flex items-center gap-2 font-bold text-ink-900 dark:text-white">{r.name}{r.isSystem && <Lock className="h-3.5 w-3.5 text-ink-400" />}</div>
                  <div className="text-sm text-ink-500">{r.description}</div>
                </div>
              </div>
              <div className="my-4 flex flex-wrap gap-1.5">
                {all ? <Badge color="brand">Full access</Badge> : r.permissions.map((p) => <Badge key={p}>{data.permissions.find((x) => x.key === p)?.label || p}</Badge>)}
              </div>
              <div className="mt-auto flex items-center border-t border-ink-100 pt-4 dark:border-white/5">
                <span className="flex items-center gap-1.5 text-sm text-ink-500"><Users className="h-4 w-4" />{r._count.users} user{r._count.users === 1 ? '' : 's'}</span>
                <div className="ml-auto flex gap-1">
                  <button onClick={() => setForm({ ...r, description: r.description || '' })} className="a-btn-ghost a-btn-icon h-8 w-8"><Pencil className="h-4 w-4" /></button>
                  {!r.isSystem && <button onClick={() => remove(r)} className="a-btn-ghost a-btn-icon h-8 w-8 hover:text-rose-600"><Trash2 className="h-4 w-4" /></button>}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      <Modal open={!!form} onClose={() => setForm(null)} size="lg" title={form?.id ? `Edit role` : 'New role'} footer={<><button className="a-btn-secondary" onClick={() => setForm(null)}>Cancel</button><button className="a-btn-primary" onClick={save} disabled={saving || !form?.name}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save role</button></>}>
        {form && (
          <div className="space-y-5">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Role name" required><input className="a-input" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} /></Field>
              <Field label="Description"><input className="a-input" value={form.description} onChange={(e) => setForm({ ...form, description: e.target.value })} /></Field>
            </div>
            {form.isSystem ? (
              <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-700 dark:bg-brand-500/10 dark:text-brand-200"><Lock className="mb-1 inline h-4 w-4" /> This is a system role with full access. Its permissions cannot be changed.</div>
            ) : Object.entries(groups).map(([group, perms]) => {
              const keys = perms.map((p) => p.key);
              const allOn = keys.every((k) => form.permissions.includes(k));
              return (
                <div key={group}>
                  <div className="mb-2 flex items-center justify-between">
                    <h4 className="text-xs font-bold uppercase tracking-wider text-ink-400">{group}</h4>
                    <button type="button" onClick={() => toggleGroup(keys)} className="text-xs font-semibold text-brand-600">{allOn ? 'Deselect all' : 'Select all'}</button>
                  </div>
                  <div className="grid gap-2 sm:grid-cols-2">
                    {perms.map((p) => {
                      const on = form.permissions.includes(p.key);
                      return (
                        <button type="button" key={p.key} onClick={() => toggle(p.key)} className={cn('flex items-center gap-3 rounded-xl border p-3 text-left text-sm font-semibold transition', on ? 'border-brand-400 bg-brand-50 text-brand-800 dark:border-brand-500/50 dark:bg-brand-500/10 dark:text-brand-100' : 'border-ink-200 hover:border-ink-300 dark:border-white/10')}>
                          <span className={cn('grid h-5 w-5 place-items-center rounded-md border', on ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300 dark:border-white/20')}>{on && <Check className="h-3.5 w-3.5" />}</span>
                          {p.label}
                        </button>
                      );
                    })}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </Modal>
    </>
  );
}
