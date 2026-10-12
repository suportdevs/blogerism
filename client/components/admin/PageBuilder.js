'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  ArrowLeft, BarChart3, Building2, Code2, Columns2, Copy, CreditCard, Eye, EyeOff, ExternalLink, GripVertical, HelpCircle, Images,
  LayoutGrid, Layers, Loader2, Mail, Megaphone, Monitor, MoveVertical, Newspaper, PanelTop, PlayCircle, Plus, Quote, Redo2, Save,
  Send, Settings2, Smartphone, Sparkles, Tablet, Trash2, Type, Undo2, X, Paintbrush, FileText,
  UserRound, IdCard, Wrench, Milestone, FolderKanban,
  Zap, LayoutList, Columns3, PanelRight, MonitorPlay, GalleryHorizontal, Clapperboard, Trophy, Library, ListMusic,
} from 'lucide-react';
import { api } from '@/lib/api';
import { BLOCKS, BLOCK_CATEGORIES, DEFAULT_STYLE, STYLE_FIELDS } from '@/lib/blocks';
import { useSaveShortcut, useUnsavedWarning } from '@/lib/hooks';
import { cn, slugify, uid } from '@/lib/utils';
import { SchemaFields } from './FieldRenderer';
import SeoPanel from './SeoPanel';
import { ImageField } from './Media';
import { Field, PageLoader, Tabs } from './ui';
import { useSiteTheme } from './SiteTheme';

const BLOCK_ICONS = { UserRound, IdCard, Wrench, Milestone, FolderKanban, Zap, LayoutList, Columns3, PanelRight, MonitorPlay, GalleryHorizontal, Clapperboard, Trophy, Library, ListMusic, Sparkles, PanelTop, LayoutGrid, Columns2, Type, BarChart3, Building2, Images, PlayCircle, Newspaper, Quote, HelpCircle, CreditCard, Megaphone, Mail, Send, MoveVertical, Code2 };
const DEVICES = { desktop: { icon: Monitor, width: '100%' }, tablet: { icon: Tablet, width: '820px' }, mobile: { icon: Smartphone, width: '390px' } };

export const newBlock = (type, style = {}) => ({ id: uid(), type, data: structuredClone(BLOCKS[type].defaults), style: { ...DEFAULT_STYLE, ...style } });

function BlockLibrary({ onAdd }) {
  const { theme, blockCategories } = useSiteTheme();
  const [showAll, setShowAll] = useState(false);
  const cats = showAll || !blockCategories ? BLOCK_CATEGORIES : BLOCK_CATEGORIES.filter((c) => blockCategories.includes(c));
  return (
    <div className="space-y-5 p-4">
      {blockCategories && (
        <div className="flex items-center justify-between rounded-xl bg-brand-50 px-3 py-2 text-xs dark:bg-brand-500/10">
          <span className="font-semibold text-brand-700 dark:text-brand-200">{showAll ? 'All blocks' : `Blocks for ${theme?.name}`}</span>
          <button type="button" onClick={() => setShowAll(!showAll)} className="font-bold text-brand-600 hover:underline">{showAll ? 'Theme only' : 'Show all'}</button>
        </div>
      )}
      {cats.map((cat) => (
        <div key={cat}>
          <div className="mb-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">{cat}</div>
          <div className="grid grid-cols-2 gap-2">
            {Object.entries(BLOCKS).filter(([, b]) => b.category === cat).map(([type, b]) => {
              const Icon = BLOCK_ICONS[b.icon] || Layers;
              return (
                <button
                  key={type}
                  draggable
                  onDragStart={(e) => e.dataTransfer.setData('nova/new-block', type)}
                  onClick={() => onAdd(type)}
                  className="group flex flex-col items-start gap-2 rounded-xl border border-ink-200 bg-white p-3 text-left transition hover:-translate-y-0.5 hover:border-brand-400 hover:shadow-md dark:border-white/10 dark:bg-white/[.02]"
                >
                  <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600 transition group-hover:bg-brand-500 group-hover:text-white dark:bg-brand-500/10"><Icon className="h-4 w-4" /></span>
                  <span className="text-[13px] font-bold leading-tight text-ink-800 dark:text-ink-100">{b.label}</span>
                  <span className="line-clamp-2 text-[11px] leading-snug text-ink-400">{b.description}</span>
                </button>
              );
            })}
          </div>
        </div>
      ))}
    </div>
  );
}

function Outline({ blocks, selected, onSelect, onMove, onDuplicate, onRemove, onToggle, onAddAt }) {
  const [dragIndex, setDragIndex] = useState(null);
  const [overIndex, setOverIndex] = useState(null);

  const onDrop = (e, index) => {
    e.preventDefault();
    const newType = e.dataTransfer.getData('nova/new-block');
    if (newType) onAddAt(newType, index);
    else if (dragIndex !== null) onMove(dragIndex, index > dragIndex ? index - 1 : index);
    setDragIndex(null);
    setOverIndex(null);
  };

  if (!blocks.length) {
    return (
      <div onDragOver={(e) => e.preventDefault()} onDrop={(e) => onDrop(e, 0)} className="m-4 rounded-xl border-2 border-dashed border-ink-200 p-8 text-center text-sm text-ink-400 dark:border-white/10">
        <Layers className="mx-auto mb-2 h-6 w-6" />No blocks yet.<br />Add one from the <b>Add</b> tab.
      </div>
    );
  }

  return (
    <div className="space-y-1 p-3" onDragLeave={() => setOverIndex(null)}>
      {blocks.map((b, i) => {
        const def = BLOCKS[b.type];
        const Icon = BLOCK_ICONS[def?.icon] || Layers;
        const title = b.data?.title || b.data?.eyebrow || def?.label;
        return (
          <div key={b.id}>
            <div onDragOver={(e) => { e.preventDefault(); setOverIndex(i); }} onDrop={(e) => onDrop(e, i)} className={cn('h-1 rounded-full transition-all', overIndex === i && 'my-1 h-1.5 bg-brand-500')} />
            <div
              draggable
              onDragStart={() => setDragIndex(i)}
              onDragEnd={() => { setDragIndex(null); setOverIndex(null); }}
              onDragOver={(e) => { e.preventDefault(); setOverIndex(e.nativeEvent.offsetY > e.currentTarget.offsetHeight / 2 ? i + 1 : i); }}
              onDrop={(e) => onDrop(e, overIndex ?? i)}
              onClick={() => onSelect(b.id)}
              className={cn(
                'group flex cursor-pointer items-center gap-2 rounded-xl border px-2 py-2 transition',
                selected === b.id ? 'border-brand-400 bg-brand-50 dark:border-brand-500/50 dark:bg-brand-500/10' : 'border-transparent hover:bg-ink-50 dark:hover:bg-white/5',
                dragIndex === i && 'opacity-40',
                b.style?.hidden && 'opacity-50',
              )}
            >
              <GripVertical className="h-4 w-4 shrink-0 cursor-grab text-ink-300" />
              <span className={cn('grid h-7 w-7 shrink-0 place-items-center rounded-lg', selected === b.id ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-500 dark:bg-white/10')}><Icon className="h-3.5 w-3.5" /></span>
              <div className="min-w-0 flex-1">
                <div className="truncate text-[13px] font-semibold text-ink-800 dark:text-ink-100">{title}</div>
                <div className="text-[11px] text-ink-400">{def?.label}</div>
              </div>
              <div className="flex opacity-0 transition group-hover:opacity-100">
                <button title={b.style?.hidden ? 'Show' : 'Hide'} onClick={(e) => { e.stopPropagation(); onToggle(b.id); }} className="rounded-md p-1 text-ink-400 hover:text-ink-700">{b.style?.hidden ? <EyeOff className="h-3.5 w-3.5" /> : <Eye className="h-3.5 w-3.5" />}</button>
                <button title="Duplicate" onClick={(e) => { e.stopPropagation(); onDuplicate(b.id); }} className="rounded-md p-1 text-ink-400 hover:text-ink-700"><Copy className="h-3.5 w-3.5" /></button>
                <button title="Delete" onClick={(e) => { e.stopPropagation(); onRemove(b.id); }} className="rounded-md p-1 text-ink-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
              </div>
            </div>
          </div>
        );
      })}
      <div onDragOver={(e) => { e.preventDefault(); setOverIndex(blocks.length); }} onDrop={(e) => onDrop(e, blocks.length)} className={cn('h-8 rounded-xl transition', overIndex === blocks.length && 'border-2 border-dashed border-brand-400')} />
    </div>
  );
}

export default function PageBuilder({ id }) {
  const router = useRouter();
  const [page, setPage] = useState(null);
  const [blocks, setBlocksRaw] = useState([]);
  const [history, setHistory] = useState({ past: [], future: [] });
  const [selected, setSelected] = useState(null);
  const [leftTab, setLeftTab] = useState('layers');
  const [rightTab, setRightTab] = useState('content');
  const [device, setDevice] = useState('desktop');
  const [showSettings, setShowSettings] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [saving, setSaving] = useState(false);
  const frame = useRef();
  useUnsavedWarning(dirty);

  useEffect(() => {
    api.get(`/admin/pages/${id}`).then((p) => { setPage(p); setBlocksRaw(p.blocks || []); }).catch(() => { toast.error('Page not found'); router.replace('/admin/pages'); });
  }, [id, router]);

  const postToPreview = useCallback((list) => {
    frame.current?.contentWindow?.postMessage({ type: 'nova:blocks', blocks: list }, window.location.origin);
  }, []);

  useEffect(() => { postToPreview(blocks); }, [blocks, postToPreview]);
  useEffect(() => {
    const onMsg = (e) => { if (e.origin === window.location.origin && e.data?.type === 'nova:preview-ready') postToPreview(blocks); };
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [blocks, postToPreview]);

  // History: structural edits always create a snapshot; rapid field typing is coalesced (one snapshot per pause).
  const blocksRef = useRef(blocks);
  blocksRef.current = blocks;
  const lastSnapshot = useRef(0);
  const setBlocks = (updater, { coalesce = false } = {}) => {
    const prev = blocksRef.current;
    const next = typeof updater === 'function' ? updater(prev) : updater;
    const now = Date.now();
    if (!coalesce || now - lastSnapshot.current > 800) {
      setHistory((h) => ({ past: [...h.past.slice(-49), prev], future: [] }));
    }
    lastSnapshot.current = now;
    blocksRef.current = next;
    setBlocksRaw(next);
    setDirty(true);
  };
  const undo = () => {
    if (!history.past.length) return;
    const prev = history.past[history.past.length - 1];
    setHistory({ past: history.past.slice(0, -1), future: [blocksRef.current, ...history.future] });
    setBlocksRaw(prev);
    setDirty(true);
  };
  const redo = () => {
    if (!history.future.length) return;
    const [next, ...rest] = history.future;
    setHistory({ past: [...history.past, blocksRef.current], future: rest });
    setBlocksRaw(next);
    setDirty(true);
  };

  const select = (bid) => {
    setSelected(bid);
    setShowSettings(false);
    frame.current?.contentWindow?.postMessage({ type: 'nova:scroll-to', id: bid }, window.location.origin);
  };
  const addAt = (type, index) => {
    const b = newBlock(type);
    setBlocks((list) => [...list.slice(0, index), b, ...list.slice(index)]);
    setLeftTab('layers');
    setTimeout(() => select(b.id), 50);
  };
  const add = (type) => {
    const index = selected ? blocks.findIndex((b) => b.id === selected) + 1 : blocks.length;
    addAt(type, index);
  };
  const move = (from, to) => setBlocks((list) => { const next = [...list]; const [m] = next.splice(from, 1); next.splice(to, 0, m); return next; });
  const duplicate = (bid) => setBlocks((list) => { const i = list.findIndex((b) => b.id === bid); const copy = { ...structuredClone(list[i]), id: uid() }; return [...list.slice(0, i + 1), copy, ...list.slice(i + 1)]; });
  const remove = (bid) => { setBlocks((list) => list.filter((b) => b.id !== bid)); if (selected === bid) setSelected(null); };
  const toggleHidden = (bid) => setBlocks((list) => list.map((b) => (b.id === bid ? { ...b, style: { ...b.style, hidden: !b.style?.hidden } } : b)));
  const updateBlock = (bid, part, key, value) => setBlocks((list) => list.map((b) => (b.id === bid ? { ...b, [part]: { ...b[part], [key]: value } } : b)), { coalesce: true });
  const setPageField = (k, v) => { setPage((p) => ({ ...p, [k]: v })); setDirty(true); };

  const save = async (status) => {
    setSaving(true);
    try {
      const body = { title: page.title, slug: page.slug, template: page.template, status: status || page.status, blocks, seoTitle: page.seoTitle, seoDescription: page.seoDescription, ogImage: page.ogImage || null };
      const saved = await api.put(`/admin/pages/${id}`, body);
      setPage(saved);
      setDirty(false);
      toast.success('Page saved');
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };
  useSaveShortcut(() => page && save());

  useEffect(() => {
    const onKey = (e) => {
      if (['INPUT', 'TEXTAREA', 'SELECT'].includes(document.activeElement?.tagName) || document.activeElement?.isContentEditable) return;
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === 'z') { e.preventDefault(); if (e.shiftKey) redo(); else undo(); }
      if ((e.key === 'Delete' || e.key === 'Backspace') && selected) remove(selected);
    };
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  if (!page) return <PageLoader />;
  const current = blocks.find((b) => b.id === selected);
  const def = current && BLOCKS[current.type];

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col">
      {/* Toolbar */}
      <div className="flex flex-wrap items-center gap-2 border-b border-ink-200/70 bg-white px-3 py-2 dark:border-white/5 dark:bg-ink-900">
        <Link href="/admin/pages" className="a-btn-ghost a-btn-icon"><ArrowLeft className="h-4 w-4" /></Link>
        <div className="min-w-0">
          <input value={page.title} onChange={(e) => setPageField('title', e.target.value)} className="w-56 truncate bg-transparent font-bold text-ink-900 outline-none dark:text-white" />
          <div className="flex items-center gap-1.5 text-[11px] text-ink-400">
            <span className={cn('h-1.5 w-1.5 rounded-full', page.status === 'PUBLISHED' ? 'bg-emerald-500' : 'bg-ink-300')} />
            {page.status.toLowerCase()} · /{page.slug}
            {dirty && <span className="font-semibold text-amber-500">· unsaved</span>}
          </div>
        </div>
        <div className="mx-auto flex items-center gap-1 rounded-xl bg-ink-100 p-1 dark:bg-white/5">
          {Object.entries(DEVICES).map(([key, d]) => (
            <button key={key} onClick={() => setDevice(key)} title={key} className={cn('grid h-7 w-8 place-items-center rounded-lg transition', device === key ? 'bg-white text-brand-600 shadow-sm dark:bg-ink-800' : 'text-ink-400 hover:text-ink-700')}><d.icon className="h-4 w-4" /></button>
          ))}
        </div>
        <button onClick={undo} disabled={!history.past.length} className="a-btn-ghost a-btn-icon" title="Undo (Ctrl+Z)"><Undo2 className="h-4 w-4" /></button>
        <button onClick={redo} disabled={!history.future.length} className="a-btn-ghost a-btn-icon" title="Redo (Ctrl+Shift+Z)"><Redo2 className="h-4 w-4" /></button>
        <button onClick={() => { setShowSettings(true); setSelected(null); }} className={cn('a-btn-ghost', showSettings && 'bg-ink-100 dark:bg-white/10')}><Settings2 className="h-4 w-4" /><span className="hidden md:inline">Page settings</span></button>
        {page.status === 'PUBLISHED' && <a href={page.slug === 'home' ? '/' : `/${page.slug}`} target="_blank" rel="noreferrer" className="a-btn-secondary a-btn-icon" title="View live"><ExternalLink className="h-4 w-4" /></a>}
        {page.status !== 'PUBLISHED' && <button onClick={() => save('DRAFT')} disabled={saving} className="a-btn-secondary">Save draft</button>}
        <button onClick={() => save(page.status === 'PUBLISHED' ? undefined : 'PUBLISHED')} disabled={saving} className="a-btn-primary">
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}{page.status === 'PUBLISHED' ? 'Update' : 'Publish'}
        </button>
      </div>

      <div className="flex min-h-0 flex-1">
        {/* Left panel */}
        <aside className="hidden w-[300px] shrink-0 flex-col border-r border-ink-200/70 bg-white dark:border-white/5 dark:bg-ink-900 md:flex">
          <div className="p-3 pb-0">
            <Tabs className="w-full [&>button]:flex-1 [&>button]:justify-center" value={leftTab} onChange={setLeftTab} tabs={[{ value: 'layers', label: 'Layers', icon: Layers, count: blocks.length }, { value: 'add', label: 'Add', icon: Plus }]} />
          </div>
          <div className="a-scroll flex-1 overflow-y-auto">
            {leftTab === 'add' ? <BlockLibrary onAdd={add} /> : (
              <Outline blocks={blocks} selected={selected} onSelect={select} onMove={move} onDuplicate={duplicate} onRemove={remove} onToggle={toggleHidden} onAddAt={addAt} />
            )}
          </div>
        </aside>

        {/* Canvas */}
        <div className="relative flex min-w-0 flex-1 justify-center overflow-hidden bg-ink-100 p-4 dark:bg-ink-950 [background-image:radial-gradient(rgb(0_0_0/.06)_1px,transparent_1px)] [background-size:18px_18px]">
          <div className="h-full overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl transition-all duration-300 dark:border-white/10" style={{ width: DEVICES[device].width, maxWidth: '100%' }}>
            <iframe ref={frame} src="/preview" title="Live preview" className="h-full w-full" onLoad={() => postToPreview(blocks)} />
          </div>
          {leftTab !== 'add' && (
            <button onClick={() => setLeftTab('add')} className="a-btn-primary absolute bottom-6 left-1/2 -translate-x-1/2 rounded-full px-5 shadow-2xl md:hidden"><Plus className="h-4 w-4" />Add block</button>
          )}
        </div>

        {/* Right panel */}
        <aside className={cn('w-[360px] shrink-0 flex-col border-l border-ink-200/70 bg-white dark:border-white/5 dark:bg-ink-900', current || showSettings ? 'flex' : 'hidden xl:flex')}>
          {showSettings ? (
            <>
              <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 dark:border-white/5">
                <h3 className="flex items-center gap-2 font-bold"><FileText className="h-4 w-4 text-brand-500" />Page settings</h3>
                <button onClick={() => setShowSettings(false)} className="a-btn-ghost a-btn-icon h-8 w-8"><X className="h-4 w-4" /></button>
              </div>
              <div className="a-scroll flex-1 space-y-4 overflow-y-auto p-4">
                <Field label="Title"><input className="a-input" value={page.title} onChange={(e) => setPageField('title', e.target.value)} /></Field>
                <Field label="URL slug" hint={`yoursite.com/${page.slug}`}><input className="a-input" value={page.slug} onChange={(e) => setPageField('slug', slugify(e.target.value))} /></Field>
                <Field label="Status">
                  <select className="a-input" value={page.status} onChange={(e) => setPageField('status', e.target.value)}>
                    <option value="DRAFT">Draft</option><option value="PUBLISHED">Published</option>
                  </select>
                </Field>
                <Field label="Template">
                  <select className="a-input" value={page.template} onChange={(e) => setPageField('template', e.target.value)}>
                    <option value="default">Default</option><option value="full-width">Full width</option><option value="landing">Landing</option>
                  </select>
                </Field>
                <div className="border-t border-ink-100 pt-4 dark:border-white/5"><h4 className="mb-3 text-sm font-bold">SEO</h4>
                  <SeoPanel title={page.seoTitle} description={page.seoDescription} onTitle={(v) => setPageField('seoTitle', v)} onDescription={(v) => setPageField('seoDescription', v)} fallbackTitle={page.title} url={`yoursite.com › ${page.slug}`} />
                </div>
                <Field label="Social share image"><ImageField value={page.ogImage} onChange={(v) => setPageField('ogImage', v)} /></Field>
              </div>
            </>
          ) : current ? (
            <>
              <div className="flex items-center justify-between border-b border-ink-100 px-4 py-3 dark:border-white/5">
                <div>
                  <h3 className="font-bold text-ink-900 dark:text-white">{def.label}</h3>
                  <p className="text-xs text-ink-400">{def.description}</p>
                </div>
                <button onClick={() => setSelected(null)} className="a-btn-ghost a-btn-icon h-8 w-8"><X className="h-4 w-4" /></button>
              </div>
              <div className="px-4 pt-3">
                <Tabs className="w-full [&>button]:flex-1 [&>button]:justify-center" value={rightTab} onChange={setRightTab} tabs={[{ value: 'content', label: 'Content', icon: Type }, { value: 'style', label: 'Style', icon: Paintbrush }]} />
              </div>
              <div className="a-scroll flex-1 overflow-y-auto p-4">
                <div className="grid grid-cols-2 gap-4">
                  {rightTab === 'content' ? (
                    <SchemaFields fields={def.fields} values={current.data} onChange={(k, v) => updateBlock(current.id, 'data', k, v)} />
                  ) : (
                    <SchemaFields fields={STYLE_FIELDS} values={current.style || {}} onChange={(k, v) => updateBlock(current.id, 'style', k, v)} />
                  )}
                </div>
              </div>
              <div className="flex gap-2 border-t border-ink-100 p-3 dark:border-white/5">
                <button onClick={() => duplicate(current.id)} className="a-btn-secondary flex-1"><Copy className="h-4 w-4" />Duplicate</button>
                <button onClick={() => remove(current.id)} className="a-btn-secondary flex-1 text-rose-600"><Trash2 className="h-4 w-4" />Delete</button>
              </div>
            </>
          ) : (
            <div className="flex flex-1 flex-col items-center justify-center p-8 text-center">
              <div className="mb-4 grid h-14 w-14 place-items-center rounded-2xl bg-brand-50 text-brand-500 dark:bg-brand-500/10"><Layers className="h-6 w-6" /></div>
              <h3 className="font-bold">Select a block</h3>
              <p className="mt-1 text-sm text-ink-400">Click a layer on the left to edit its content and style, or drag new blocks in from the Add tab.</p>
            </div>
          )}
        </aside>
      </div>
    </div>
  );
}
