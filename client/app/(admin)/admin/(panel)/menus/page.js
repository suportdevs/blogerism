'use client';

import { useEffect, useMemo, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowDown, ArrowLeft, ArrowRight, ArrowUp, ChevronDown, Copy, ExternalLink, FileText, FolderTree, GripVertical, Heading, LayoutPanelTop,
  Link2, Loader2, Menu as MenuIcon, Plus, Save, Trash2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useApi, useSaveShortcut, useUnsavedWarning } from '@/lib/hooks';
import { ICONS, ICON_NAMES } from '@/lib/icons';
import { cn, uid } from '@/lib/utils';
import { ImageField } from '@/components/admin/Media';
import { Card, EmptyState, Field, Modal, PageHeader, PageLoader, Toggle, useConfirm } from '@/components/admin/ui';

/*
 * Drag & drop menu editor. The tree is edited as a flat list of { key, depth, ...fields } rows:
 * dragging up/down picks the position, dragging left/right picks the level (max 3 levels).
 * An item always moves together with its sub-items.
 */
const MAX_DEPTH = 2; // 0-based: top level, level 2, level 3
const INDENT = 32;
const FIELDS = ['label', 'url', 'target', 'description', 'icon', 'badge', 'image', 'mega'];
const blank = (label, url) => ({ key: uid(), label, url, target: '_self', description: '', icon: '', badge: '', image: '', mega: false });

const flatten = (items, depth = 0) => items.flatMap((i) => [
  { ...Object.fromEntries(FIELDS.map((f) => [f, i[f] ?? (f === 'mega' ? false : f === 'target' ? '_self' : '')])), key: uid(), depth },
  ...flatten(i.children || [], depth + 1),
]);

// Flat rows -> nested tree for the API.
function toTree(rows) {
  const root = [];
  const stack = [{ depth: -1, children: root }];
  for (const r of rows) {
    while (stack[stack.length - 1].depth >= r.depth) stack.pop();
    const node = { ...Object.fromEntries(FIELDS.map((f) => [f, r[f]])), mega: r.depth === 0 && !!r.mega, children: [] };
    stack[stack.length - 1].children.push(node);
    stack.push({ depth: r.depth, children: node.children });
  }
  return root;
}

// Index range [start, end) of a row plus all of its descendants.
const blockOf = (rows, i) => { let e = i + 1; while (e < rows.length && rows[e].depth > rows[i].depth) e += 1; return [i, e]; };

// Insert `block` (rows with relative depths) at index `at` of `rows` at `depth`.
function place(rows, block, at, depth) {
  const shift = depth - block[0].depth;
  return [...rows.slice(0, at), ...block.map((r) => ({ ...r, depth: r.depth + shift })), ...rows.slice(at)];
}

// Allowed depths for a block of height `h` inserted between prev and next.
function depthRange(prev, next, h) {
  const max = Math.min(prev ? prev.depth + 1 : 0, MAX_DEPTH - h);
  const min = next ? next.depth : 0;
  return [min, max];
}

const LEVEL = ['Top level', 'Level 2', 'Level 3'];

function Row({ row, index, rows, dragging, onDragStart, onDragEnd, onChange, onRemove, onDuplicate, onMove, expanded, setExpanded }) {
  const Icon = ICONS[row.icon];
  const childCount = blockOf(rows, index)[1] - index - 1;
  const parent = rows.slice(0, index).reverse().find((r) => r.depth < row.depth);
  const inMega = row.depth > 0 && rows.slice(0, index).reverse().find((r) => r.depth === 0)?.mega;
  return (
    <div style={{ marginLeft: row.depth * INDENT }} className={cn('transition-opacity', dragging && 'opacity-40')}>
      <div className={cn('overflow-hidden rounded-xl border bg-white shadow-sm transition dark:bg-white/[.02]', expanded ? 'border-brand-300 dark:border-brand-500/40' : 'border-ink-200 hover:border-ink-300 dark:border-white/10')}>
        <div className="flex items-center gap-2 px-2 py-2">
          <span
            draggable
            onDragStart={(e) => onDragStart(e, index)}
            onDragEnd={onDragEnd}
            title="Drag to move — left/right to change the level"
            className="grid h-8 w-6 shrink-0 cursor-grab place-items-center rounded-md text-ink-300 hover:bg-ink-100 hover:text-ink-600 active:cursor-grabbing dark:hover:bg-white/10"
          >
            <GripVertical className="h-4 w-4" />
          </span>
          <span className={cn('grid h-8 w-8 shrink-0 place-items-center rounded-lg', row.depth === 0 ? (row.mega ? 'bg-gradient-to-br from-brand-500 to-fuchsia-500 text-white' : 'bg-brand-50 text-brand-600 dark:bg-brand-500/10') : 'bg-ink-100 text-ink-500 dark:bg-white/5')}>
            {Icon ? <Icon className="h-4 w-4" /> : row.mega ? <LayoutPanelTop className="h-4 w-4" /> : row.url === '#' ? <Heading className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}
          </span>
          <button type="button" onClick={() => setExpanded(expanded ? null : row.key)} className="min-w-0 flex-1 text-left">
            <div className="flex items-center gap-2 truncate text-sm font-bold text-ink-900 dark:text-white">
              {row.label || <span className="italic text-ink-400">Untitled</span>}
              {row.badge && <span className="rounded-full bg-brand-500 px-1.5 text-[10px] font-bold uppercase text-white">{row.badge}</span>}
              {row.mega && <span className="rounded-md bg-fuchsia-100 px-1.5 py-0.5 text-[10px] font-bold uppercase text-fuchsia-700 dark:bg-fuchsia-500/15 dark:text-fuchsia-300">Mega menu</span>}
              {inMega && row.depth === 1 && <span className="rounded-md bg-ink-100 px-1.5 py-0.5 text-[10px] font-semibold uppercase text-ink-500 dark:bg-white/10">Column</span>}
            </div>
            <div className="flex items-center gap-1 truncate text-xs text-ink-400">
              <span className="font-semibold text-ink-500">{LEVEL[row.depth]}</span>·<span className="truncate">{row.url}</span>{row.target === '_blank' && <ExternalLink className="h-3 w-3" />}
              {childCount > 0 && <span>· {childCount} sub-item{childCount > 1 ? 's' : ''}</span>}
            </div>
          </button>
          <button type="button" title="Edit" onClick={() => setExpanded(expanded ? null : row.key)} className="rounded-md p-1.5 text-ink-400 hover:bg-ink-100 dark:hover:bg-white/10"><ChevronDown className={cn('h-4 w-4 transition', expanded && 'rotate-180')} /></button>
        </div>
        {expanded && (
          <div className="space-y-3 border-t border-ink-100 bg-ink-50/50 p-3 dark:border-white/5 dark:bg-white/[.02]">
            <div className="grid gap-3 sm:grid-cols-2">
              <Field label="Label"><input className="a-input" value={row.label} onChange={(e) => onChange({ label: e.target.value })} /></Field>
              <Field label="URL" hint="Use # for a heading that isn't a link"><input className="a-input" value={row.url} onChange={(e) => onChange({ url: e.target.value })} /></Field>
              <Field label="Description" hint="Shown under the label in dropdowns and mega menus" className="sm:col-span-2"><input className="a-input" value={row.description} onChange={(e) => onChange({ description: e.target.value })} placeholder="Optional" /></Field>
              <Field label="Icon">
                <select className="a-input" value={row.icon} onChange={(e) => onChange({ icon: e.target.value })}>
                  <option value="">None</option>
                  {ICON_NAMES.map((n) => <option key={n} value={n}>{n}</option>)}
                </select>
              </Field>
              <Field label="Badge" hint="e.g. New, Hot, Live"><input className="a-input" value={row.badge} maxLength={24} onChange={(e) => onChange({ badge: e.target.value })} /></Field>
            </div>
            {row.depth === 0 && (
              <div className="rounded-xl border border-fuchsia-200 bg-fuchsia-50/50 p-3 dark:border-fuchsia-500/20 dark:bg-fuchsia-500/5">
                <Toggle label="Mega menu" description="Open a full-width panel: level 2 items become columns, level 3 items the links in them" checked={row.mega} onChange={(v) => onChange({ mega: v })} />
                {row.mega && (
                  <Field label="Promo image (optional)" hint="Shown as a feature card with this item's description" className="mt-3">
                    <ImageField value={row.image} onChange={(v) => onChange({ image: v || '' })} aspect="aspect-[16/9]" />
                  </Field>
                )}
              </div>
            )}
            <div className="flex flex-wrap items-center gap-2">
              <label className="mr-auto flex items-center gap-2 text-sm"><input type="checkbox" className="accent-brand-500" checked={row.target === '_blank'} onChange={(e) => onChange({ target: e.target.checked ? '_blank' : '_self' })} />Open in new tab</label>
              <span className="text-xs text-ink-400">{parent ? `Inside “${parent.label}”` : 'Top level'}</span>
              {/* Keyboard-friendly alternatives to dragging. */}
              {[['up', ArrowUp, 'Move up'], ['down', ArrowDown, 'Move down'], ['out', ArrowLeft, 'Move out a level'], ['in', ArrowRight, 'Move into the item above']].map(([op, I, t]) => (
                <button key={op} type="button" title={t} onClick={() => onMove(op)} className="rounded-md border border-ink-200 p-1.5 text-ink-500 hover:bg-white hover:text-ink-800 dark:border-white/10 dark:hover:bg-white/10"><I className="h-3.5 w-3.5" /></button>
              ))}
              <button type="button" onClick={onDuplicate} className="a-btn-ghost h-8 px-2.5 text-xs"><Copy className="h-3.5 w-3.5" />Duplicate</button>
              <button type="button" onClick={onRemove} className="a-btn-ghost h-8 px-2.5 text-xs text-rose-600"><Trash2 className="h-3.5 w-3.5" />Remove</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function Palette({ title, icon: Icon, items, onAdd, color }) {
  return (
    <Card title={title} bodyClassName="p-2">
      {items.map((p) => (
        <div
          key={p.url + p.label}
          draggable
          onDragStart={(e) => { e.dataTransfer.effectAllowed = 'copy'; e.dataTransfer.setData('nova/menu-new', JSON.stringify(p)); }}
          className="group flex cursor-grab items-center gap-2.5 rounded-lg px-2 py-2 text-sm font-medium transition hover:bg-ink-50 active:cursor-grabbing dark:hover:bg-white/5"
        >
          <GripVertical className="h-3.5 w-3.5 text-ink-300 opacity-0 transition group-hover:opacity-100" />
          <Icon className="h-4 w-4 text-ink-400" style={p.color ? { color: p.color } : undefined} />
          <span className="min-w-0 flex-1"><span className="block truncate">{p.label}</span><span className="block truncate text-[11px] font-normal text-ink-400">{p.url}</span></span>
          <button type="button" onClick={() => onAdd(p.label, p.url)} title="Add to menu" className="grid h-7 w-7 place-items-center rounded-md text-brand-500 hover:bg-brand-50 dark:hover:bg-brand-500/10"><Plus className="h-4 w-4" /></button>
        </div>
      ))}
    </Card>
  );
}

export default function MenusPage() {
  const confirm = useConfirm();
  const { data, reload } = useApi('/admin/menus');
  const { data: pages } = useApi('/admin/pages', { limit: 100, status: 'PUBLISHED' });
  const { data: cats } = useApi('/admin/taxonomy/categories');
  const [activeId, setActiveId] = useState(null);
  const [rows, setRows] = useState([]);
  const [name, setName] = useState('');
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const [custom, setCustom] = useState({ label: '', url: '' });
  const [newMenu, setNewMenu] = useState(null);
  const [expanded, setExpanded] = useState(null);
  const [drag, setDrag] = useState(null); // { from, to } index range being dragged (null for new items)
  const [drop, setDrop] = useState(null); // { at, depth, valid } in the list without the dragged rows
  const listRef = useRef();

  const menus = data?.items || [];
  const active = menus.find((m) => m.id === activeId);
  useEffect(() => { if (menus.length && !active) setActiveId(menus[0].id); }, [menus, active]);
  useEffect(() => { if (active) { setRows(flatten(active.items)); setName(active.name); setDirty(false); setExpanded(null); } }, [active]);
  useUnsavedWarning(dirty);

  const change = (next) => { setRows(next); setDirty(true); };
  const addItem = (label, url) => { const r = { ...blank(label, url), depth: 0 }; change([...rows, r]); setExpanded(r.key); };

  // Rows without the ones being dragged (drop positions are computed against this list).
  const rest = useMemo(() => (drag ? [...rows.slice(0, drag.from), ...rows.slice(drag.to)] : rows), [rows, drag]);
  const height = drag ? Math.max(...rows.slice(drag.from, drag.to).map((r) => r.depth)) - rows[drag.from].depth : 0;

  const onDragStart = (e, index) => {
    const [from, to] = blockOf(rows, index);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', rows[index].label);
    setExpanded(null);
    setTimeout(() => setDrag({ from, to }), 0); // after the browser snapshots the drag image
  };
  const reset = () => { setDrag(null); setDrop(null); };

  // Pointer position -> insertion index (vertical) and level (horizontal).
  const onDragOver = (e) => {
    const isNew = e.dataTransfer.types.includes('nova/menu-new');
    if (!drag && !isNew) return;
    e.preventDefault();
    if (expanded) setExpanded(null); // open editors would shift rows and swallow the drop
    e.dataTransfer.dropEffect = isNew ? 'copy' : 'move';
    const els = [...listRef.current.querySelectorAll('[data-row]')].filter((el) => !el.dataset.dragging);
    let at = els.length;
    for (let i = 0; i < els.length; i += 1) {
      const r = els[i].getBoundingClientRect();
      if (e.clientY < r.top + r.height / 2) { at = i; break; }
    }
    const h = isNew ? 0 : height;
    const [min, max] = depthRange(rest[at - 1], rest[at], h);
    const left = listRef.current.getBoundingClientRect().left;
    const wanted = Math.round((e.clientX - left - 24) / INDENT);
    const depth = Math.max(min, Math.min(max, wanted));
    const next = { at, depth, valid: min <= max };
    if (!drop || drop.at !== next.at || drop.depth !== next.depth || drop.valid !== next.valid) setDrop(next);
  };

  const onDrop = (e) => {
    e.preventDefault();
    const raw = e.dataTransfer.getData('nova/menu-new');
    if (drop?.valid) {
      if (raw) {
        const p = JSON.parse(raw);
        change(place(rows, [{ ...blank(p.label, p.url), depth: 0 }], drop.at, drop.depth));
      } else if (drag) {
        change(place(rest, rows.slice(drag.from, drag.to), drop.at, drop.depth));
      }
    } else if (drop) toast.error('That would make the menu more than 3 levels deep');
    reset();
  };

  // Button moves (same rules as dragging).
  const move = (index, op) => {
    const [from, to] = blockOf(rows, index);
    const block = rows.slice(from, to);
    const others = [...rows.slice(0, from), ...rows.slice(to)];
    const h = Math.max(...block.map((r) => r.depth)) - block[0].depth;
    const d = block[0].depth;
    let at = from;
    let depth = d;
    if (op === 'up') {
      let i = from - 1;
      while (i >= 0 && rows[i].depth > d) i -= 1; // previous sibling (or parent)
      if (i < 0) return;
      at = i;
    } else if (op === 'down') {
      if (to >= rows.length) return;
      const [, nextEnd] = blockOf(rows, to);
      at = nextEnd - (to - from);
    } else if (op === 'in') {
      depth = d + 1;
    } else if (op === 'out') {
      depth = d - 1;
      at = from;
      // Moving out: place after the parent's remaining children.
      let i = from;
      while (i < others.length && others[i].depth > depth) i += 1;
      at = i;
    }
    const [min, max] = depthRange(others[at - 1], others[at], h);
    if (depth < min || depth > max) { toast.error(op === 'in' ? 'Can’t nest here (max 3 levels)' : 'Can’t move there'); return; }
    change(place(others, block, at, depth));
  };

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/menus/${active.id}`, { name, items: toTree(rows) });
      toast.success('Menu saved');
      setDirty(false);
      reload();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };
  useSaveShortcut(() => active && dirty && save());

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
  const switchMenu = async (id) => {
    if (dirty && !(await confirm({ title: 'Discard unsaved changes?', message: 'Your changes to this menu have not been saved.' }))) return;
    setActiveId(id);
  };

  if (!data) return <PageLoader />;

  const indicator = (i) => drop && drop.at === i && (
    <div className="pointer-events-none relative h-0">
      <div className={cn('absolute -top-1 right-0 h-1 rounded-full', drop.valid ? 'bg-brand-500' : 'bg-rose-500')} style={{ left: drop.depth * INDENT }}>
        <span className={cn('absolute -left-1 -top-1 h-3 w-3 rounded-full border-2 bg-white', drop.valid ? 'border-brand-500' : 'border-rose-500')} />
        <span className={cn('absolute -top-6 left-3 rounded-md px-1.5 py-0.5 text-[10px] font-bold text-white', drop.valid ? 'bg-brand-500' : 'bg-rose-500')}>{drop.valid ? LEVEL[drop.depth] : 'Too deep'}</span>
      </div>
    </div>
  );
  // Map rows to positions in `rest` for the indicator.
  let restIndex = 0;

  return (
    <>
      <PageHeader title="Menus" description="Drag items to reorder them, and drag left or right to change the level (up to 3 levels). Turn a top item into a mega menu from its settings." actions={<button onClick={() => setNewMenu({ name: '', location: '' })} className="a-btn-secondary"><Plus className="h-4 w-4" />New menu</button>} />

      <div className="mb-6 flex flex-wrap gap-2">
        {menus.map((m) => (
          <button key={m.id} onClick={() => switchMenu(m.id)} className={cn('flex items-center gap-2 rounded-xl border px-4 py-2.5 text-sm font-semibold transition', m.id === activeId ? 'border-brand-500 bg-brand-50 text-brand-700 dark:bg-brand-500/10 dark:text-brand-200' : 'border-ink-200 bg-white hover:border-ink-300 dark:border-white/10 dark:bg-white/[.02]')}>
            <MenuIcon className="h-4 w-4" />{m.name}<code className="rounded bg-ink-100 px-1.5 text-[11px] font-medium text-ink-500 dark:bg-white/10">{m.location}</code>
          </button>
        ))}
      </div>

      {!active ? <div className="a-card"><EmptyState icon={MenuIcon} title="No menus" description="Create a menu with location “header” or “footer”." /></div> : (
        <div className="grid items-start gap-6 lg:grid-cols-[320px_1fr]">
          <div className="space-y-4 lg:sticky lg:top-24">
            <Card title="Custom link">
              <div className="space-y-3">
                <input className="a-input" placeholder="Label" value={custom.label} onChange={(e) => setCustom({ ...custom, label: e.target.value })} />
                <input className="a-input" placeholder="/path, https://… or # for a heading" value={custom.url} onChange={(e) => setCustom({ ...custom, url: e.target.value })} />
                <button className="a-btn-secondary w-full" disabled={!custom.label || !custom.url} onClick={() => { addItem(custom.label, custom.url); setCustom({ label: '', url: '' }); }}><Plus className="h-4 w-4" />Add to menu</button>
              </div>
            </Card>
            <Palette title="Pages" icon={FileText} onAdd={addItem} items={[{ label: 'Home', url: '/' }, { label: 'Blog', url: '/blog' }, { label: 'Contact', url: '/contact' }, { label: 'FAQ', url: '/faq' }, ...(pages?.items || []).filter((p) => p.slug !== 'home').map((p) => ({ label: p.title, url: `/${p.slug}` }))]} />
            {cats?.items?.length > 0 && <Palette title="Categories" icon={FolderTree} onAdd={addItem} items={cats.items.map((c) => ({ label: c.name, url: `/category/${c.slug}`, color: c.color }))} />}
          </div>

          <div className="a-card">
            <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
              <input className="a-input max-w-xs font-semibold" value={name} onChange={(e) => { setName(e.target.value); setDirty(true); }} />
              <span className="text-xs text-ink-400">Location: <code className="font-semibold">{active.location}</code></span>
              {dirty && <span className="text-xs font-semibold text-amber-500">Unsaved changes</span>}
              <div className="ml-auto flex gap-2">
                <button onClick={deleteMenu} title="Delete menu" className="a-btn-ghost text-rose-600"><Trash2 className="h-4 w-4" /></button>
                <button onClick={save} disabled={saving || !dirty} className="a-btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save menu</button>
              </div>
            </div>
            <div
              ref={listRef}
              onDragOver={onDragOver}
              onDrop={onDrop}
              onDragLeave={(e) => { if (!listRef.current.contains(e.relatedTarget)) setDrop(null); }}
              className="min-h-[200px] space-y-2 p-4 pt-6"
            >
              {rows.length === 0 && !drop && <EmptyState icon={Link2} title="This menu is empty" description="Drag pages, categories or links here — or click + to add them." />}
              {rows.map((r, i) => {
                const dragged = drag && i >= drag.from && i < drag.to;
                const pos = dragged ? null : restIndex++;
                return (
                  <div key={r.key} data-row data-dragging={dragged ? '1' : undefined}>
                    {pos !== null && indicator(pos)}
                    <Row
                      row={r}
                      index={i}
                      rows={rows}
                      dragging={dragged}
                      onDragStart={onDragStart}
                      onDragEnd={reset}
                      expanded={expanded === r.key}
                      setExpanded={setExpanded}
                      onChange={(patch) => change(rows.map((x) => (x.key === r.key ? { ...x, ...patch } : x)))}
                      onRemove={() => { const [a, b] = blockOf(rows, i); change([...rows.slice(0, a), ...rows.slice(b)]); }}
                      onDuplicate={() => { const [a, b] = blockOf(rows, i); change([...rows.slice(0, b), ...rows.slice(a, b).map((x) => ({ ...x, key: uid() })), ...rows.slice(b)]); }}
                      onMove={(op) => move(i, op)}
                    />
                  </div>
                );
              })}
              {indicator(rest.length)}
              <div className="flex flex-wrap gap-x-6 gap-y-1 pt-4 text-xs text-ink-400">
                <span>⇅ Drag the handle to reorder</span><span>⇆ Drag left/right to change the level</span><span>3 levels max · sub-items move with their parent</span>
              </div>
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
