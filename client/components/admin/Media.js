'use client';

import { useCallback, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Check, Copy, File, FileText, Folder, FolderPlus, Grid3x3, ImagePlus, List, Loader2, Music, Pencil, Trash2, UploadCloud, Video, X, Link2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn, formatBytes, formatDate } from '@/lib/utils';
import { EmptyState, Modal, Pagination, SearchInput, Tabs, useConfirm, Field } from './ui';

const TYPE_TABS = [
  { value: '', label: 'All' },
  { value: 'image', label: 'Images' },
  { value: 'video', label: 'Videos' },
  { value: 'application', label: 'Documents' },
];

function FileThumb({ item, className }) {
  if (item.mime.startsWith('image/')) return <img src={item.url} alt={item.alt || ''} loading="lazy" className={cn('h-full w-full object-cover', className)} />;
  const Icon = item.mime.startsWith('video/') ? Video : item.mime.startsWith('audio/') ? Music : item.mime === 'application/pdf' ? FileText : File;
  return <div className={cn('grid h-full w-full place-items-center bg-ink-100 text-ink-400 dark:bg-white/5', className)}><Icon className="h-8 w-8" /></div>;
}

/**
 * Full media manager. In picker mode (onPick provided) clicking a file selects it.
 */
export function MediaLibrary({ onPick, multiple = false, accept, compact }) {
  const [params, setParams] = useState({ page: 1, q: '', type: accept || '', folderId: '' });
  const { data, loading, reload } = useApi('/admin/media', params);
  const [uploading, setUploading] = useState(false);
  const [dragging, setDragging] = useState(false);
  const [selected, setSelected] = useState([]);
  const [detail, setDetail] = useState(null);
  const [view, setView] = useState('grid');
  const [urlOpen, setUrlOpen] = useState(false);
  const inputRef = useRef();
  const confirm = useConfirm();
  const set = (p) => setParams((s) => ({ ...s, page: 1, ...p }));

  const upload = useCallback(async (files) => {
    if (!files?.length) return;
    const fd = new FormData();
    Array.from(files).forEach((f) => fd.append('files', f));
    if (params.folderId && params.folderId !== 'root') fd.append('folderId', params.folderId);
    setUploading(true);
    try {
      const { items } = await api.upload('/admin/media/upload', fd);
      toast.success(`Uploaded ${items.length} file${items.length > 1 ? 's' : ''}`);
      reload();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setUploading(false);
    }
  }, [params.folderId, reload]);

  const onDrop = (e) => { e.preventDefault(); setDragging(false); upload(e.dataTransfer.files); };

  const click = (item) => {
    if (onPick) {
      if (multiple) setSelected((s) => (s.find((x) => x.id === item.id) ? s.filter((x) => x.id !== item.id) : [...s, item]));
      else onPick(item);
    } else setDetail(item);
  };

  const removeMany = async (ids) => {
    if (!(await confirm({ title: `Delete ${ids.length} file(s)?`, message: 'Files will be permanently removed from the server.' }))) return;
    await api.post('/admin/media/bulk-delete', { ids });
    toast.success('Deleted');
    setSelected([]);
    setDetail(null);
    reload();
  };

  const newFolder = async () => {
    const name = window.prompt('Folder name');
    if (!name) return;
    await api.post('/admin/media/folders', { name });
    reload();
  };

  const deleteFolder = async (f) => {
    if (!(await confirm({ title: `Delete folder “${f.name}”?`, message: 'Files inside will move to the root.' }))) return;
    await api.del(`/admin/media/folders/${f.id}`);
    if (String(params.folderId) === String(f.id)) set({ folderId: '' });
    else reload();
  };

  const folders = data?.folders || [];
  const items = data?.items || [];

  return (
    <div className={cn('grid gap-5', !compact && 'lg:grid-cols-[220px_1fr]')} onDragOver={(e) => { e.preventDefault(); setDragging(true); }} onDragLeave={() => setDragging(false)} onDrop={onDrop}>
      {!compact && (
        <aside className="space-y-1">
          <div className="mb-2 flex items-center justify-between px-2">
            <span className="text-xs font-bold uppercase tracking-wider text-ink-400">Folders</span>
            <button onClick={newFolder} className="a-btn-ghost a-btn-icon h-7 w-7"><FolderPlus className="h-4 w-4" /></button>
          </div>
          {[{ id: '', name: 'All files' }, { id: 'root', name: 'Unsorted' }, ...folders].map((f) => (
            <div key={f.id || 'all'} className="group flex items-center">
              <button
                onClick={() => set({ folderId: String(f.id) })}
                className={cn('flex flex-1 items-center gap-2.5 rounded-xl px-3 py-2 text-sm font-semibold transition', String(params.folderId) === String(f.id) ? 'bg-brand-50 text-brand-700 dark:bg-brand-500/15 dark:text-brand-200' : 'text-ink-600 hover:bg-ink-100 dark:text-ink-300 dark:hover:bg-white/5')}
              >
                <Folder className="h-4 w-4" />
                <span className="flex-1 truncate text-left">{f.name}</span>
                {f._count && <span className="text-xs text-ink-400">{f._count.files}</span>}
              </button>
              {f._count && <button onClick={() => deleteFolder(f)} className="ml-1 hidden rounded-lg p-1.5 text-ink-400 hover:text-rose-500 group-hover:block"><Trash2 className="h-3.5 w-3.5" /></button>}
            </div>
          ))}
        </aside>
      )}

      <div className="min-w-0">
        <div className="mb-4 flex flex-wrap items-center gap-3">
          <SearchInput value={params.q} onChange={(q) => set({ q })} placeholder="Search files…" className="w-full sm:w-64" />
          {!accept && <Tabs tabs={TYPE_TABS} value={params.type} onChange={(type) => set({ type })} />}
          <div className="ml-auto flex items-center gap-2">
            {!compact && (
              <div className="flex rounded-xl border border-ink-200 p-0.5 dark:border-white/10">
                <button onClick={() => setView('grid')} className={cn('rounded-lg p-1.5', view === 'grid' && 'bg-ink-100 dark:bg-white/10')}><Grid3x3 className="h-4 w-4" /></button>
                <button onClick={() => setView('list')} className={cn('rounded-lg p-1.5', view === 'list' && 'bg-ink-100 dark:bg-white/10')}><List className="h-4 w-4" /></button>
              </div>
            )}
            {onPick && <button onClick={() => setUrlOpen(true)} className="a-btn-secondary"><Link2 className="h-4 w-4" />From URL</button>}
            {selected.length > 0 && !onPick && <button onClick={() => removeMany(selected.map((s) => s.id))} className="a-btn-danger"><Trash2 className="h-4 w-4" />Delete ({selected.length})</button>}
            <button onClick={() => inputRef.current.click()} className="a-btn-primary" disabled={uploading}>
              {uploading ? <Loader2 className="h-4 w-4 animate-spin" /> : <UploadCloud className="h-4 w-4" />}Upload
            </button>
            <input ref={inputRef} type="file" multiple hidden onChange={(e) => { upload(e.target.files); e.target.value = ''; }} />
          </div>
        </div>

        <div className={cn('relative rounded-2xl transition', dragging && 'ring-4 ring-brand-500/30')}>
          {dragging && (
            <div className="pointer-events-none absolute inset-0 z-10 grid place-items-center rounded-2xl border-2 border-dashed border-brand-400 bg-brand-50/80 backdrop-blur-sm dark:bg-brand-500/10">
              <div className="text-center font-bold text-brand-600"><UploadCloud className="mx-auto mb-2 h-10 w-10" />Drop files to upload</div>
            </div>
          )}

          {loading && !data ? (
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4 lg:grid-cols-6">{Array.from({ length: 12 }).map((_, i) => <div key={i} className="aspect-square animate-pulse rounded-xl bg-ink-100 dark:bg-white/5" />)}</div>
          ) : items.length === 0 ? (
            <div className="rounded-2xl border-2 border-dashed border-ink-200 dark:border-white/10">
              <EmptyState icon={ImagePlus} title="No files yet" description="Drag & drop files here, or click Upload. Images, videos, PDFs and audio up to 20MB." />
            </div>
          ) : view === 'list' && !compact ? (
            <div className="a-card overflow-hidden">
              <table className="a-table">
                <thead><tr><th className="w-10" /><th>File</th><th>Type</th><th>Size</th><th>Uploaded</th><th /></tr></thead>
                <tbody>
                  {items.map((m) => (
                    <tr key={m.id} className="cursor-pointer" onClick={() => click(m)}>
                      <td onClick={(e) => e.stopPropagation()}><input type="checkbox" className="accent-brand-500" checked={!!selected.find((s) => s.id === m.id)} onChange={() => setSelected((s) => (s.find((x) => x.id === m.id) ? s.filter((x) => x.id !== m.id) : [...s, m]))} /></td>
                      <td><div className="flex items-center gap-3"><div className="h-10 w-10 overflow-hidden rounded-lg"><FileThumb item={m} /></div><span className="font-semibold">{m.originalName}</span></div></td>
                      <td className="text-ink-400">{m.mime}</td>
                      <td>{formatBytes(m.size)}</td>
                      <td>{formatDate(m.createdAt)}</td>
                      <td />
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <div className={cn('grid gap-3', compact ? 'grid-cols-3 sm:grid-cols-4 md:grid-cols-5' : 'grid-cols-2 sm:grid-cols-3 md:grid-cols-4 xl:grid-cols-6')}>
              {items.map((m) => {
                const isSel = !!selected.find((s) => s.id === m.id);
                return (
                  <button
                    key={m.id}
                    onClick={() => click(m)}
                    className={cn('group relative aspect-square overflow-hidden rounded-xl border-2 bg-ink-100 text-left transition dark:bg-white/5', isSel ? 'border-brand-500 ring-4 ring-brand-500/20' : 'border-transparent hover:border-brand-300')}
                  >
                    <FileThumb item={m} className="transition duration-300 group-hover:scale-105" />
                    <div className="absolute inset-x-0 bottom-0 translate-y-full bg-gradient-to-t from-black/70 to-transparent p-2 pt-6 text-[11px] font-semibold text-white transition group-hover:translate-y-0">
                      <div className="truncate">{m.originalName}</div>
                    </div>
                    {!onPick && (
                      <span
                        onClick={(e) => { e.stopPropagation(); setSelected((s) => (isSel ? s.filter((x) => x.id !== m.id) : [...s, m])); }}
                        className={cn('absolute left-2 top-2 grid h-6 w-6 place-items-center rounded-md border-2 border-white bg-black/20 text-white backdrop-blur transition', isSel ? 'bg-brand-500 opacity-100' : 'opacity-0 group-hover:opacity-100')}
                      >
                        {isSel && <Check className="h-3.5 w-3.5" />}
                      </span>
                    )}
                    {onPick && isSel && <span className="absolute right-2 top-2 grid h-6 w-6 place-items-center rounded-full bg-brand-500 text-white"><Check className="h-3.5 w-3.5" /></span>}
                  </button>
                );
              })}
            </div>
          )}
        </div>
        <div className="mt-3"><Pagination meta={data?.meta} onChange={(page) => setParams((s) => ({ ...s, page }))} /></div>

        {onPick && multiple && selected.length > 0 && (
          <div className="sticky bottom-0 mt-4 flex items-center justify-between rounded-xl bg-ink-900 px-4 py-3 text-white">
            <span className="text-sm font-semibold">{selected.length} selected</span>
            <button className="a-btn-primary" onClick={() => onPick(selected)}>Insert selected</button>
          </div>
        )}
      </div>

      <MediaDetail item={detail} folders={folders} onClose={() => setDetail(null)} onChanged={() => { reload(); }} onDelete={(m) => removeMany([m.id])} />
      <UrlModal open={urlOpen} onClose={() => setUrlOpen(false)} onPick={(url) => { setUrlOpen(false); onPick?.(multiple ? [{ url }] : { url }); }} />
    </div>
  );
}

function UrlModal({ open, onClose, onPick }) {
  const [url, setUrl] = useState('');
  return (
    <Modal open={open} onClose={onClose} title="Insert from URL" size="sm" footer={<><button className="a-btn-secondary" onClick={onClose}>Cancel</button><button className="a-btn-primary" disabled={!url} onClick={() => onPick(url)}>Insert</button></>}>
      <Field label="Image URL"><input autoFocus className="a-input" value={url} onChange={(e) => setUrl(e.target.value)} placeholder="https://…" /></Field>
      {url && <img src={url} alt="" className="mt-4 max-h-48 rounded-xl" />}
    </Modal>
  );
}

function MediaDetail({ item, folders, onClose, onChanged, onDelete }) {
  const [form, setForm] = useState({});
  const [saving, setSaving] = useState(false);
  const [lastId, setLastId] = useState(null);
  if (item && item.id !== lastId) { setLastId(item.id); setForm({ alt: item.alt || '', originalName: item.originalName, folderId: item.folderId ?? '' }); }
  if (!item) return null;
  const absolute = typeof window !== 'undefined' ? `${window.location.origin}${item.url}` : item.url;

  const save = async () => {
    setSaving(true);
    try {
      await api.put(`/admin/media/${item.id}`, { alt: form.alt, originalName: form.originalName, folderId: form.folderId ? Number(form.folderId) : null });
      toast.success('Saved');
      onChanged();
      onClose();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  return (
    <Modal open onClose={onClose} title="File details" size="lg" footer={(
      <>
        <button className="a-btn-ghost mr-auto text-rose-600" onClick={() => onDelete(item)}><Trash2 className="h-4 w-4" />Delete</button>
        <button className="a-btn-secondary" onClick={onClose}>Close</button>
        <button className="a-btn-primary" onClick={save} disabled={saving}><Pencil className="h-4 w-4" />Save</button>
      </>
    )}>
      <div className="grid gap-6 md:grid-cols-2">
        <div className="aspect-square overflow-hidden rounded-xl bg-[conic-gradient(#eee_25%,#fff_0_50%,#eee_0_75%,#fff_0)] bg-[length:20px_20px]">
          {item.mime.startsWith('video/') ? <video src={item.url} controls className="h-full w-full" /> : <FileThumb item={item} className="object-contain" />}
        </div>
        <div className="space-y-4">
          <Field label="File name"><input className="a-input" value={form.originalName || ''} onChange={(e) => setForm({ ...form, originalName: e.target.value })} /></Field>
          <Field label="Alt text" hint="Describes the image for screen readers and SEO."><input className="a-input" value={form.alt || ''} onChange={(e) => setForm({ ...form, alt: e.target.value })} /></Field>
          <Field label="Folder">
            <select className="a-input" value={form.folderId} onChange={(e) => setForm({ ...form, folderId: e.target.value })}>
              <option value="">Unsorted</option>
              {folders.map((f) => <option key={f.id} value={f.id}>{f.name}</option>)}
            </select>
          </Field>
          <Field label="URL">
            <div className="flex gap-2">
              <input readOnly className="a-input font-mono text-xs" value={absolute} />
              <button className="a-btn-secondary a-btn-icon h-10 w-10" onClick={() => { navigator.clipboard.writeText(absolute); toast.success('Copied URL'); }}><Copy className="h-4 w-4" /></button>
            </div>
          </Field>
          <dl className="grid grid-cols-2 gap-3 rounded-xl bg-ink-50 p-4 text-sm dark:bg-white/5">
            <div><dt className="text-xs text-ink-400">Type</dt><dd className="font-semibold">{item.mime}</dd></div>
            <div><dt className="text-xs text-ink-400">Size</dt><dd className="font-semibold">{formatBytes(item.size)}</dd></div>
            <div className="col-span-2"><dt className="text-xs text-ink-400">Uploaded</dt><dd className="font-semibold">{formatDate(item.createdAt, { dateStyle: 'long', timeStyle: 'short' })}</dd></div>
          </dl>
        </div>
      </div>
    </Modal>
  );
}

export function MediaPicker({ open, onClose, onPick, multiple, accept = 'image' }) {
  return (
    <Modal open={open} onClose={onClose} title="Media library" description="Pick a file or upload a new one" size="full">
      <MediaLibrary compact onPick={(v) => { onPick(v); onClose(); }} multiple={multiple} accept={accept} />
    </Modal>
  );
}

// URL input with a "browse library" button — for video/audio sources that may also be YouTube/Vimeo links.
export function MediaUrlField({ value, onChange, accept = 'video', placeholder }) {
  const [open, setOpen] = useState(false);
  return (
    <div className="flex gap-2">
      <input className="a-input" value={value || ''} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} />
      <button type="button" onClick={() => setOpen(true)} className="a-btn-secondary shrink-0"><UploadCloud className="h-4 w-4" />Library</button>
      <MediaPicker open={open} onClose={() => setOpen(false)} accept={accept} onPick={(m) => onChange(m.url)} />
    </div>
  );
}

export function ImageField({ value, onChange, aspect = 'aspect-video', className }) {
  const [open, setOpen] = useState(false);
  return (
    <div className={className}>
      {value ? (
        <div className={cn('group relative overflow-hidden rounded-xl border border-ink-200 bg-ink-50 dark:border-white/10 dark:bg-white/5', aspect)}>
          <img src={value} alt="" className="h-full w-full object-cover" />
          <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-950/50 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
            <button type="button" onClick={() => setOpen(true)} className="a-btn bg-white text-ink-900 hover:bg-ink-50"><Pencil className="h-4 w-4" />Change</button>
            <button type="button" onClick={() => onChange('')} className="a-btn-icon a-btn bg-white/20 text-white hover:bg-rose-500"><X className="h-4 w-4" /></button>
          </div>
        </div>
      ) : (
        <button type="button" onClick={() => setOpen(true)} className={cn('flex w-full flex-col items-center justify-center gap-2 rounded-xl border-2 border-dashed border-ink-200 text-sm font-semibold text-ink-400 transition hover:border-brand-400 hover:bg-brand-50/50 hover:text-brand-600 dark:border-white/10 dark:hover:bg-brand-500/5', aspect)}>
          <ImagePlus className="h-6 w-6" />Choose image
        </button>
      )}
      <MediaPicker open={open} onClose={() => setOpen(false)} onPick={(m) => onChange(m.url)} />
    </div>
  );
}
