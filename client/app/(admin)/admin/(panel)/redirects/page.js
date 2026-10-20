'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { ArrowRight, CornerDownRight, ExternalLink, FileWarning, MoreHorizontal, Pencil, Plus, Route, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi, useSelection } from '@/lib/hooks';
import { cn, compact, formatDate, timeAgo } from '@/lib/utils';
import { Badge, Checkbox, Dropdown, DropdownItem, EmptyState, Field, Modal, PageHeader, Pagination, SearchInput, Tabs, Toggle, useConfirm } from '@/components/admin/ui';

const CODES = [
  [301, '301 — Moved permanently', 'The page has a new address for good. Search engines move rankings to it.'],
  [302, '302 — Found (temporary)', 'Temporarily elsewhere; the old address stays indexed.'],
  [307, '307 — Temporary redirect', 'Like 302, but keeps the request method.'],
  [308, '308 — Permanent redirect', 'Like 301, but keeps the request method.'],
];
const EMPTY = { from: '', to: '', code: 301, isActive: true, note: '' };

function RedirectForm({ initial, onClose, onSaved }) {
  const [form, setForm] = useState({ ...EMPTY, ...initial, note: initial?.note || '' });
  const [saving, setSaving] = useState(false);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));
  const submit = async (e) => {
    e.preventDefault();
    setSaving(true);
    try {
      const body = { from: form.from, to: form.to, code: Number(form.code), isActive: form.isActive, note: form.note || null };
      if (form.id) await api.put(`/admin/redirects/${form.id}`, body);
      else await api.post('/admin/redirects', body);
      toast.success(form.id ? 'Redirect updated' : 'Redirect added');
      onSaved();
    } catch (err) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };
  return (
    <Modal
      open
      onClose={onClose}
      title={form.id ? 'Edit redirect' : 'Add redirect'}
      description="Send visitors (and search engines) from an old address to a new one."
      footer={<><button type="button" className="a-btn-secondary" onClick={onClose}>Cancel</button><button form="redirect-form" className="a-btn-primary" disabled={saving}>{form.id ? 'Save changes' : 'Add redirect'}</button></>}
    >
      <form id="redirect-form" onSubmit={submit} className="space-y-4">
        <Field label="Old path" required hint="e.g. /old-post or /2019/* to match everything under /2019/. Full URLs are trimmed to the path.">
          <input className="a-input font-mono text-sm" value={form.from} onChange={(e) => set('from')(e.target.value)} placeholder="/old-page" required autoFocus />
        </Field>
        <Field label="Redirect to" required hint="A path on this site (/new-page) or a full URL. With a /* rule, a * here is replaced with the rest of the path.">
          <input className="a-input font-mono text-sm" value={form.to} onChange={(e) => set('to')(e.target.value)} placeholder="/new-page" required />
        </Field>
        <Field label="Type">
          <select className="a-input" value={form.code} onChange={(e) => set('code')(Number(e.target.value))}>
            {CODES.map(([code, label]) => <option key={code} value={code}>{label}</option>)}
          </select>
          <p className="mt-1.5 text-xs text-ink-400">{CODES.find(([c]) => c === Number(form.code))?.[2]}</p>
        </Field>
        <Field label="Note"><input className="a-input" value={form.note} onChange={(e) => set('note')(e.target.value)} placeholder="Why this redirect exists (optional)" /></Field>
        <Toggle checked={form.isActive} onChange={set('isActive')} label="Active" description="Inactive redirects are kept but not applied." />
      </form>
    </Modal>
  );
}

function RedirectsTab({ onEdit, reloadKey }) {
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '' });
  const { data, loading, reload } = useApi('/admin/redirects', { ...params, _: reloadKey });
  const items = data?.items || [];
  const sel = useSelection(items);

  const toggle = async (r) => {
    await api.put(`/admin/redirects/${r.id}`, { isActive: !r.isActive });
    reload();
  };
  const remove = async (ids) => {
    if (!(await confirm({ title: `Delete ${ids.length} redirect(s)?`, message: 'Visitors to the old addresses will see a 404 page again.' }))) return;
    await api.post('/admin/redirects/bulk-delete', { ids });
    toast.success('Redirect(s) deleted');
    sel.clear();
    reload();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
        <div className="text-sm text-ink-500">{data ? <><b className="text-ink-900 dark:text-white">{data.meta.total}</b> redirect{data.meta.total === 1 ? '' : 's'} · <b className="text-ink-900 dark:text-white">{compact(data.totalHits)}</b> visitor{data.totalHits === 1 ? '' : 's'} redirected</> : ' '}</div>
        {sel.selected.length > 0 && <button className="a-btn-danger h-8" onClick={() => remove(sel.selected)}><Trash2 className="h-4 w-4" />Delete {sel.selected.length}</button>}
        <SearchInput value={params.q} onChange={(q) => setParams({ page: 1, q })} placeholder="Search paths…" className="ml-auto w-64" />
      </div>
      <div className="a-scroll overflow-x-auto">
        <table className="a-table min-w-[760px]">
          <thead><tr><th className="w-10"><Checkbox checked={sel.allSelected} indeterminate={sel.someSelected} onChange={sel.toggleAll} /></th><th>Redirect</th><th>Type</th><th>Hits</th><th>Active</th><th className="w-12" /></tr></thead>
          <tbody className={loading ? 'opacity-60' : ''}>
            {items.map((r) => (
              <tr key={r.id} className={cn(!r.isActive && 'opacity-60')}>
                <td><Checkbox checked={sel.isSelected(r.id)} onChange={() => sel.toggle(r.id)} /></td>
                <td>
                  <button onClick={() => onEdit(r)} className="group text-left">
                    <div className="font-mono text-sm font-semibold text-ink-900 group-hover:text-brand-600 dark:text-white">{r.from}</div>
                    <div className="mt-0.5 flex items-center gap-1 font-mono text-xs text-ink-400"><CornerDownRight className="h-3 w-3" />{r.to}</div>
                    {r.note && <div className="mt-1 text-xs text-ink-400">{r.note}</div>}
                  </button>
                </td>
                <td><Badge color={r.code === 301 || r.code === 308 ? 'brand' : 'blue'}>{r.code}</Badge></td>
                <td className="text-sm"><b>{compact(r.hits)}</b>{r.lastHitAt && <div className="text-xs text-ink-400">last {timeAgo(r.lastHitAt)}</div>}</td>
                <td><Toggle checked={r.isActive} onChange={() => toggle(r)} /></td>
                <td>
                  <Dropdown trigger={<button className="a-btn-ghost a-btn-icon h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button>}>
                    <DropdownItem icon={Pencil} onClick={() => onEdit(r)}>Edit</DropdownItem>
                    {!r.from.endsWith('/*') && <DropdownItem icon={ExternalLink} href={r.from}>Test on site</DropdownItem>}
                    <DropdownItem icon={Trash2} danger onClick={() => remove([r.id])}>Delete</DropdownItem>
                  </Dropdown>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !items.length && <EmptyState icon={Route} title={params.q ? 'No matching redirects' : 'No redirects yet'} description="Changing a published post's or page's address adds one automatically. Add your own when moving content or migrating from another site." action={<button onClick={() => onEdit(EMPTY)} className="a-btn-primary"><Plus className="h-4 w-4" />Add redirect</button>} />}
      </div>
      <Pagination meta={data?.meta} onChange={(page) => setParams((p) => ({ ...p, page }))} />
    </>
  );
}

function NotFoundTab({ onFix, reloadKey }) {
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '' });
  const { data, loading, reload } = useApi('/admin/redirects/not-found', { ...params, _: reloadKey });
  const items = data?.items || [];

  const dismiss = async (row) => { await api.del(`/admin/redirects/not-found/${row.id}`); reload(); };
  const clear = async () => {
    if (!(await confirm({ title: 'Clear the 404 log?', message: 'All recorded missing addresses are removed. New ones are recorded as visitors hit them.', confirmLabel: 'Clear log' }))) return;
    await api.del('/admin/redirects/not-found/all');
    reload();
  };

  return (
    <>
      <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
        <p className="text-sm text-ink-500">Addresses visitors tried that don’t exist, most-visited first. Redirect the important ones to the right page.</p>
        <div className="ml-auto flex gap-2">
          <SearchInput value={params.q} onChange={(q) => setParams({ page: 1, q })} placeholder="Search paths…" className="w-56" />
          {items.length > 0 && <button onClick={clear} className="a-btn-secondary"><Trash2 className="h-4 w-4" />Clear log</button>}
        </div>
      </div>
      <div className="a-scroll overflow-x-auto">
        <table className="a-table min-w-[720px]">
          <thead><tr><th>Missing address</th><th>Hits</th><th>Last seen</th><th>Came from</th><th className="w-44" /></tr></thead>
          <tbody className={loading ? 'opacity-60' : ''}>
            {items.map((r) => (
              <tr key={r.id}>
                <td className="font-mono text-sm font-semibold text-ink-900 dark:text-white">{r.path}</td>
                <td><Badge color={r.hits >= 10 ? 'red' : r.hits >= 3 ? 'amber' : 'gray'}>{compact(r.hits)}</Badge></td>
                <td className="text-xs"><span title={formatDate(r.lastSeenAt, { dateStyle: 'medium', timeStyle: 'short' })}>{timeAgo(r.lastSeenAt)}</span></td>
                <td className="max-w-[220px] truncate text-xs text-ink-400" title={r.referrer || ''}>{r.referrer || '—'}</td>
                <td>
                  <div className="flex justify-end gap-1">
                    <button onClick={() => onFix(r)} className="a-btn-secondary h-8 text-xs"><ArrowRight className="h-3.5 w-3.5" />Redirect</button>
                    <button onClick={() => dismiss(r)} className="a-btn-ghost a-btn-icon h-8 w-8" title="Dismiss"><Trash2 className="h-4 w-4" /></button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {!loading && !items.length && <EmptyState icon={FileWarning} title="No broken links recorded" description="When a visitor lands on an address that doesn’t exist, it shows up here." />}
      </div>
      <Pagination meta={data?.meta} onChange={(page) => setParams((p) => ({ ...p, page }))} />
    </>
  );
}

export default function RedirectsPage() {
  const [tab, setTab] = useState('redirects');
  const [editing, setEditing] = useState(null);
  const [reloadKey, setReloadKey] = useState(0);
  const saved = () => { setEditing(null); setReloadKey((k) => k + 1); };

  return (
    <>
      <PageHeader
        title="Redirects"
        description="Keep old links working and fix broken ones — good for visitors and for search rankings."
        actions={<button onClick={() => setEditing(EMPTY)} className="a-btn-primary"><Plus className="h-4 w-4" />Add redirect</button>}
      />
      <div className="a-card overflow-hidden">
        <div className="border-b border-ink-100 px-4 pt-4 dark:border-white/5">
          <Tabs className="mb-4" value={tab} onChange={setTab} tabs={[{ value: 'redirects', label: 'Redirects' }, { value: 'not-found', label: '404 monitor' }]} />
        </div>
        {tab === 'redirects'
          ? <RedirectsTab onEdit={setEditing} reloadKey={reloadKey} />
          : <NotFoundTab onFix={(row) => setEditing({ ...EMPTY, from: row.path })} reloadKey={reloadKey} />}
      </div>
      {editing && <RedirectForm initial={editing} onClose={() => setEditing(null)} onSaved={saved} />}
    </>
  );
}
