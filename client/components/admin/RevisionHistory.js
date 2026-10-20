'use client';

import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { History, Loader2, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';
import { BLOCKS } from '@/lib/blocks';
import { cn, formatDate, stripHtml, timeAgo } from '@/lib/utils';
import { Badge, EmptyState, Modal, Spinner, useConfirm } from './ui';

/*
 * Revision history for a post or page: every save is kept (up to 30). Pick a version to see what differs from the
 * saved item, then restore it — the restore itself becomes a new revision, so it can be undone the same way.
 */

const LABELS = {
  title: 'Title', subtitle: 'Subtitle', excerpt: 'Excerpt', content: 'Content', coverImage: 'Cover image', format: 'Format', videoUrl: 'Video',
  audioUrl: 'Audio', duration: 'Duration', gallery: 'Gallery', seriesId: 'Series', season: 'Season', episode: 'Episode', seoTitle: 'SEO title',
  seoDescription: 'SEO description', categoryIds: 'Categories', tags: 'Tags', template: 'Template', blocks: 'Blocks', ogImage: 'Social image',
};

// The comparable shape of the saved item, matching what revisions store.
function currentData(entity, item) {
  if (!item) return {};
  if (entity === 'pages') return { title: item.title, template: item.template, blocks: item.blocks, seoTitle: item.seoTitle, seoDescription: item.seoDescription, ogImage: item.ogImage };
  return { ...item, categoryIds: (item.categories || []).map((c) => c.id), tags: (item.tags || []).map((t) => t.name) };
}
const same = (a, b) => JSON.stringify(a ?? null) === JSON.stringify(b ?? null) || ((a ?? '') === '' && (b ?? '') === '');

function Preview({ entity, revision }) {
  const d = revision.data;
  if (entity === 'pages') {
    return (
      <div className="space-y-3">
        <div className="text-lg font-bold text-ink-900 dark:text-white">{d.title}</div>
        <div className="text-xs font-semibold uppercase tracking-wider text-ink-400">{d.blocks?.length || 0} blocks · {d.template} template</div>
        <ol className="space-y-1.5">
          {(d.blocks || []).map((b, i) => (
            <li key={b.id || i} className={cn('flex items-center gap-2 rounded-lg border border-ink-100 px-3 py-2 text-sm dark:border-white/5', b.style?.hidden && 'opacity-50')}>
              <span className="w-5 text-xs text-ink-400">{i + 1}</span>
              <span className="font-semibold">{BLOCKS[b.type]?.label || b.type}</span>
              <span className="truncate text-xs text-ink-400">{stripHtml(String(b.data?.title || b.data?.heading || b.data?.eyebrow || ''))}</span>
            </li>
          ))}
        </ol>
      </div>
    );
  }
  return (
    <div className="space-y-3">
      {d.coverImage && <img src={d.coverImage} alt="" className="aspect-[16/7] w-full rounded-xl object-cover" />}
      <div className="text-xl font-extrabold text-ink-900 dark:text-white">{d.title}</div>
      {d.excerpt && <p className="text-sm text-ink-500">{d.excerpt}</p>}
      {/* Content is the editor's own saved HTML (already sanitised on input), shown read-only. */}
      <div className="prose prose-sm max-w-none dark:prose-invert" dangerouslySetInnerHTML={{ __html: d.content || '<p><em>No content</em></p>' }} />
    </div>
  );
}

export default function RevisionHistory({ entity, id, saved, dirty, onRestored, className }) {
  const confirm = useConfirm();
  const [open, setOpen] = useState(false);
  const [list, setList] = useState(null);
  const [active, setActive] = useState(null);
  const [revision, setRevision] = useState(null);
  const [restoring, setRestoring] = useState(false);

  useEffect(() => {
    if (!open) return;
    setList(null);
    api.get(`/admin/${entity}/${id}/revisions`).then((items) => { setList(items); setActive(items[1]?.id || items[0]?.id || null); }).catch((e) => toast.error(e.message));
  }, [open, entity, id]);

  useEffect(() => {
    if (!active) { setRevision(null); return; }
    setRevision(null);
    api.get(`/admin/${entity}/${id}/revisions/${active}`).then(setRevision).catch((e) => toast.error(e.message));
  }, [active, entity, id]);

  const current = currentData(entity, saved);
  const changes = revision ? Object.keys(revision.data).filter((k) => LABELS[k] && !same(revision.data[k], current[k])) : [];
  const isCurrent = revision && changes.length === 0;

  const restore = async () => {
    if (dirty && !(await confirm({ title: 'Discard your unsaved changes?', message: 'Restoring replaces what is in the editor with this version.', confirmLabel: 'Restore version' }))) return;
    setRestoring(true);
    try {
      const record = await api.post(`/admin/${entity}/${id}/revisions/${active}/restore`);
      onRestored(record);
      toast.success(`Restored the version from ${formatDate(revision.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}`);
      setOpen(false);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setRestoring(false);
    }
  };

  return (
    <>
      <button type="button" onClick={() => setOpen(true)} className={cn('a-btn-secondary', className)} title="Revision history"><History className="h-4 w-4" /><span className="hidden md:inline">History</span></button>
      <Modal
        open={open}
        onClose={() => setOpen(false)}
        size="xl"
        title="Revision history"
        description="A copy is kept every time you save (the latest 30). Restoring a version does not change the URL or the status."
        footer={(
          <>
            <button className="a-btn-secondary" onClick={() => setOpen(false)}>Close</button>
            <button className="a-btn-primary" disabled={!revision || isCurrent || restoring} onClick={restore}>
              {restoring ? <Loader2 className="h-4 w-4 animate-spin" /> : <RotateCcw className="h-4 w-4" />}Restore this version
            </button>
          </>
        )}
      >
        {!list ? <div className="grid h-40 place-items-center"><Spinner /></div> : !list.length ? (
          <EmptyState icon={History} title="No revisions yet" description="Save your changes and every version will be listed here." />
        ) : (
          <div className="grid gap-5 md:grid-cols-[240px_1fr]">
            <ul className="a-scroll max-h-[60vh] space-y-1 overflow-y-auto pr-1">
              {list.map((r, i) => (
                <li key={r.id}>
                  <button onClick={() => setActive(r.id)} className={cn('w-full rounded-xl px-3 py-2.5 text-left transition', r.id === active ? 'bg-brand-50 ring-1 ring-brand-200 dark:bg-brand-500/10 dark:ring-brand-500/30' : 'hover:bg-ink-50 dark:hover:bg-white/5')}>
                    <div className="flex items-center gap-2 text-sm font-semibold text-ink-900 dark:text-white">
                      {formatDate(r.createdAt, { month: 'short', day: 'numeric', hour: 'numeric', minute: '2-digit' })}
                      {i === 0 && <Badge color="green">Latest</Badge>}
                    </div>
                    <div className="mt-0.5 truncate text-xs text-ink-400">{timeAgo(r.createdAt)}{r.userName ? ` · ${r.userName}` : ''}</div>
                  </button>
                </li>
              ))}
            </ul>
            <div className="min-w-0">
              {!revision ? <div className="grid h-40 place-items-center"><Spinner /></div> : (
                <>
                  <div className="mb-4 flex flex-wrap items-center gap-1.5 rounded-xl bg-ink-50 px-3 py-2.5 text-xs dark:bg-white/5">
                    {isCurrent ? <span className="font-semibold text-emerald-600">This is the saved version.</span> : (
                      <>
                        <span className="font-semibold text-ink-600 dark:text-ink-300">Differs from the saved version in:</span>
                        {changes.map((k) => <Badge key={k} color="amber">{LABELS[k]}</Badge>)}
                      </>
                    )}
                  </div>
                  <div className="a-scroll max-h-[52vh] overflow-y-auto rounded-xl border border-ink-100 p-5 dark:border-white/5"><Preview entity={entity} revision={revision} /></div>
                </>
              )}
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
