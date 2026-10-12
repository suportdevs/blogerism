'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, ExternalLink, FileText, FolderTree, Link2, Loader2, Menu as MenuIcon, Plus, Save, Trash2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn, uid } from '@/lib/utils';
import { Card, EmptyState, Field, Modal, PageHeader, PageLoader, useConfirm } from '@/components/admin/ui';

// Tree helpers — items are { key, label, url, target, children }.
const withKeys = (items) => items.map((i) => ({ ...i, key: uid(), children: withKeys(i.children || []) }));
const strip = (items) => items.map(({ label, url, target, children }) => ({ label, url, target, children: strip(children) }));

function update(items, key, fn) {
  return items.flatMap((it) => {
    if (it.key === key) return fn(it);
    return [{ ...it, children: update(it.children, key, fn) }];
  });
}

// Move / indent operations work on the sibling list containing the item.
function operate(items, key, op) {
  const idx = items.findIndex((i) => i.key === key);
  if (idx !== -1) {
    const list = [...items];
    const item = list[idx];
    if (op === 'up' && idx > 0) [list[idx - 1], list[idx]] = [list[idx], list[idx - 1]];
    if (op === 'down' && idx < list.length - 1) [list[idx + 1], list[idx]] = [list[idx], list[idx + 1]];
    if (op === 'indent' && idx > 0) {
      list.splice(idx, 1);
      list[idx - 1] = { ...list[idx - 1], children: [...list[idx - 1].children, item] };
    }
    return { items: list, done: true };
  }
  for (let i = 0; i < items.length; i++) {
    const child = items[i].children;
    const childIdx = child.findIndex((c) => c.key === key);
    if (op === 'outdent' && childIdx !== -1) {
      const moved = child[childIdx];
      const list = [...items];
      list[i] = { ...items[i], children: child.filter((c) => c.key !== key) };
      list.splice(i + 1, 0, moved);
      return { items: list, done: true };
    }
    const res = operate(child, key, op);
    if (res.done) {
      const list = [...items];
      list[i] = { ...items[i], children: res.items };
      return { items: list, done: true };
    }
  }
  return { items, done: false };
}

function ItemRow({ item, depth, onChange, onOp, onRemove }) {
  const [open, setOpen] = useState(false);
  return (
    <div>
      <div className="mb-2 overflow-hidden rounded-xl border border-ink-200 bg-white shadow-sm dark:border-white/10 dark:bg-white/[.02]" style={{ marginLeft: depth * 28 }}>
        <div className="flex items-center gap-2 px-3 py-2.5">
          <span className={cn('grid h-7 w-7 place-items-center rounded-lg', depth ? 'bg-ink-100 text-ink-500 dark:bg-white/5' : 'bg-brand-50 text-brand-600 dark:bg-brand-500/10')}><Link2 className="h-3.5 w-3.5" /></span>
          <button onClick={() => setOpen(!open)} className="min-w-0 flex-1 text-left">
            <div className="truncate text-sm font-bold text-ink-900 dark:text-white">{item.label}</div>
            <div className="flex items-center gap-1 truncate text-xs text-ink-400">{item.url}{item.target === '_blank' && <ExternalLink className="h-3 w-3" />}</div>
          </button>
          <div className="flex items-center">
            <button title="Move up" onClick={() => onOp(item.key, 'up')} className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/10"><ArrowUp className="h-3.5 w-3.5" /></button>
            <button title="Move down" onClick={() => onOp(item.key, 'down')} className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/10"><ArrowDown className="h-3.5 w-3.5" /></button>
            {depth > 0 && <button title="Outdent" onClick={() => onOp(item.key, 'outdent')} className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/10"><ArrowLeft className="h-3.5 w-3.5" /></button>}
            {depth < 2 && <button title="Indent (make sub-item)" onClick={() => onOp(item.key, 'indent')} className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 hover:text-ink-700 dark:hover:bg-white/10"><ArrowRight className="h-3.5 w-3.5" /></button>}
            <button onClick={() => setOpen(!open)} className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-white/10"><ChevronDown className={cn('h-4 w-4 transition', open && 'rotate-180')} /></button>
          </div>
        </div>
        {open && (
          <div className="grid gap-3 border-t border-ink-100 bg-ink-50/50 p-3 dark:border-white/5 dark:bg-white/[.02] sm:grid-cols-2">
            <Field label="Label"><input className="a-input" value={item.label} onChange={(e) => onChange(item.key, { label: e.target.value })} /></Field>
            <Field label="URL"><input className="a-input" value={item.url} onChange={(e) => onChange(item.key, { url: e.target.value })} /></Field>
            <label className="flex items-center gap-2 text-sm"><input type="checkbox" className="accent-brand-500" checked={item.target === '_blank'} onChange={(e) => onChange(item.key, { target: e.target.checked ? '_blank' : '_self' })} />Open in new tab</label>
            <button onClick={() => onRemove(item.key)} className="flex items-center justify-end gap-1 text-sm font-semibold text-rose-600"><Trash2 className="h-4 w-4" />Remove</button>
          </div>
        )}
      </div>
      {item.children.map((c) => <ItemRow key={c.key} item={c} depth={depth + 1} onChange={onChange} onOp={onOp} onRemove={onRemove} />)}
    </div>
  );
}

export default function MenusPage() {
  const confirm = useConfirm();
  const { data, reload } = useApi('/admin/menus');
  const { data: pages } = useApi('/admin/pages', { limit: 100, status: 'PUBLISHED' });
  const { data: cats } = useApi('/admin/taxonomy/categories');
  const [activeId, setActiveId] = useState(null);
  const [items, setItems] = useState([]);
  const [name, setName] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [custom, setCustom] = useState({ label: '', url: '' });
  const [newMenu, setNewMenu] = useState(null);

  const menus = data?.items || [];
  const active = menus.find((m) => m.id === activeId);

  useEffect(() => { if (menus.length && !active) setActiveId(menus[0].id); }, [menus, active]);
  useEffect(() => { if (active) { setItems(withKeys(active.items)); setName(active.name); setDirty(false); } }, [active]);

  if (!data) return <PageLoader />;

  const change = (fn) => { setItems(fn); setDirty(true); };
  const addItem = (label, url) => change((list) => [...list, { key: uid(), label, url, target: '_self', children: [] }]);

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/menus/${active.id}`, { name, items: strip(items) });
      toast.success('Menu saved');
      setDirty(false);
      reload();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const createMenu = async () => {
    try {
      const m = await api.post('/admin/menus', newMenu);
      setNewMenu(null);
      await reload();
      setActiveId(m.id);
    } catch (e) { toast.error(e.message); }
  };

  const deleteMenu = async () => {
    if (!(await confirm({ title: `Delete menu “${active.name}”?` }))) return;
    await api.del(`/admin/menus/${active.id}`);
    setActiveId(null);
    reload();
  };

  return (
    <>
      <PageHeader title="Menus" description="Build navigation for your header and footer. Menus are placed by their location key." actions={<button onClick={() => setNewMenu({ name: '', location: '' })} className="a-btn-secondary"><Plus className="h-4 w-4" />New menu</button>} />

      <div className="mb-6 flex flex-wrap gap-2">
        {menus.map((m) => (
          <button key={m.id} onClick={() => setActiveId(m.id)} className={cn('flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition', m.id === activeId ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200' : 'border-ink-200 bg-white hover:border-ink-300 dark:border-white/10 dark:bg-white/[.02]')}>
            <MenuIcon className="h-4 w-4" />{m.name}<code className="rounded bg-ink-100 px-1.5 text-[11px] font-medium text-ink-500 dark:bg-white/10">{m.location}</code>
          </button>
        ))}
      </div>

      {!active ? <div className="a-card"><EmptyState icon={MenuIcon} title="No menus" description="Create a menu with location “header” or “footer”." /></div> : (
        <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4">
            <Card title="Custom link">
              <div className="space-y-3">
                <input className="a-input" placeholder="Label" value={custom.label} onChange={(e) => setCustom({ ...custom, label: e.target.value })} />
                <input className="a-input" placeholder="/path or https://…" value={custom.url} onChange={(e) => setCustom({ ...custom, url: e.target.value })} />
                <button className="a-btn-secondary w-full" disabled={!custom.label || !custom.url} onClick={() => { addItem(custom.label, custom.url); setCustom({ label: '', url: '' }); }}><Plus className="h-4 w-4" />Add to menu</button>
              </div>
            </Card>
            <Card title="Pages" bodyClassName="p-2">
              {[{ title: 'Home', slug: '' }, { title: 'Blog', slug: 'blog' }, { title: 'Contact', slug: 'contact' }, { title: 'FAQ', slug: 'faq' }, ...(pages?.items || []).filter((p) => p.slug !== 'home')].map((p) => (
                <button key={p.slug} onClick={() => addItem(p.title, `/${p.slug}`)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition hover:bg-ink-50 dark:hover:bg-white/5">
                  <FileText className="h-4 w-4 text-ink-400" /><span className="flex-1">{p.title}</span><Plus className="h-4 w-4 text-brand-500" />
                </button>
              ))}
            </Card>
            <Card title="Categories" bodyClassName="p-2">
              {(cats?.items || []).map((c) => (
                <button key={c.id} onClick={() => addItem(c.name, `/category/${c.slug}`)} className="flex w-full items-center gap-2.5 rounded-lg px-3 py-2 text-left text-sm font-medium transition hover:bg-ink-50 dark:hover:bg-white/5">
                  <FolderTree className="h-4 w-4" style={{ color: c.color }} /><span className="flex-1">{c.name}</span><Plus className="h-4 w-4 text-brand-500" />
                </button>
              ))}
            </Card>
          </div>

          <div className="a-card">
            <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
              <input className="a-input max-w-xs font-semibold" value={name} onChange={(e) => { setName(e.target.value); setDirty(true); }} />
              <span className="text-xs text-ink-400">Location: <code className="font-semibold">{active.location}</code></span>
              <div className="ml-auto flex gap-2">
                <button onClick={deleteMenu} className="a-btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
                <button onClick={save} disabled={saving || !dirty} className="a-btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save menu</button>
              </div>
            </div>
            <div className="p-4">
              {items.length === 0 ? <EmptyState icon={Link2} title="This menu is empty" description="Add pages, categories or custom links from the left." /> : items.map((it) => (
                <ItemRow
                  key={it.key}
                  item={it}
                  depth={0}
                  onChange={(key, patch) => change((list) => update(list, key, (x) => [{ ...x, ...patch }]))}
                  onRemove={(key) => change((list) => update(list, key, () => []))}
                  onOp={(key, op) => change((list) => operate(list, key, op).items)}
                />
              ))}
              <p className="mt-4 text-xs text-ink-400">Tip: use → to nest an item under the one above it (creates a dropdown), ← to move it back out.</p>
            </div>
          </div>
        </div>
      )}

      <Modal open={!!newMenu} onClose={() => setNewMenu(null)} title="New menu" size="sm" footer={<><button className="a-btn-secondary" onClick={() => setNewMenu(null)}>Cancel</button><button className="a-btn-primary" onClick={createMenu}>Create</button></>}>
        {newMenu && (
          <div className="space-y-4">
            <Field label="Name"><input autoFocus className="a-input" value={newMenu.name} onChange={(e) => setNewMenu({ ...newMenu, name: e.target.value })} /></Field>
            <Field label="Location key" hint="Theme uses: header, footer, footer-2"><input className="a-input font-mono" value={newMenu.location} onChange={(e) => setNewMenu({ ...newMenu, location: e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, '-') })} /></Field>
          </div>
        )}
      </Modal>
    </>
  );
}
