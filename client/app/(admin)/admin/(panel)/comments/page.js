'use client';

import { Suspense, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Check, CornerDownRight, ExternalLink, Heart, Loader2, MessagesSquare, Pencil, ShieldAlert, Trash2, Undo2, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn, postUrl, timeAgo } from '@/lib/utils';
import { Avatar, Badge, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge, Tabs, useConfirm } from '@/components/admin/ui';

function Row({ c, selected, onSelect, reload }) {
  const confirm = useConfirm();
  const [mode, setMode] = useState(null); // 'reply' | 'edit'
  const [text, setText] = useState('');
  const [busy, setBusy] = useState(false);

  const act = async (fn, msg) => {
    setBusy(true);
    try { await fn(); if (msg) toast.success(msg); setMode(null); reload(); } catch (e) { toast.error(e.message); } finally { setBusy(false); }
  };
  const setStatus = (status, msg) => act(() => api.put(`/admin/comments/${c.id}`, { status }), msg);
  const remove = async () => {
    if (!(await confirm({ title: 'Delete this comment?', message: c._count?.replies ? 'Its replies will be deleted too. This cannot be undone.' : undefined }))) return;
    act(() => api.del(`/admin/comments/${c.id}`), 'Comment deleted');
  };
  const submit = () => act(
    () => (mode === 'reply' ? api.post(`/admin/comments/${c.id}/reply`, { content: text }) : api.put(`/admin/comments/${c.id}`, { content: text })),
    mode === 'reply' ? 'Reply published' : 'Comment updated',
  );

  return (
    <div className={cn('flex gap-3 border-b border-ink-100 p-4 transition dark:border-white/5 sm:gap-4 sm:p-5', c.status === 'PENDING' && 'bg-amber-50/40 dark:bg-amber-500/[.04]', selected && 'bg-brand-50/60 dark:bg-brand-500/10')}>
      <input type="checkbox" checked={selected} onChange={onSelect} className="mt-2.5 h-4 w-4 shrink-0 rounded border-ink-300 accent-brand-500" aria-label="Select" />
      <Avatar name={c.name} src={c.user?.avatar} size={40} />
      <div className="min-w-0 flex-1">
        <div className="flex flex-wrap items-center gap-x-2 gap-y-1">
          <span className="font-bold text-ink-900 dark:text-white">{c.name}</span>
          {c.userId && <Badge color="brand">Team</Badge>}
          <StatusBadge status={c.status} />
          <span className="text-xs text-ink-400">{c.email} · {timeAgo(c.createdAt)}{c.ip ? ` · ${c.ip}` : ''}</span>
        </div>
        <a href={postUrl(c.post)} target="_blank" rel="noreferrer" className="mt-0.5 inline-flex items-center gap-1 text-xs font-semibold text-brand-600 hover:underline">
          on “{c.post.title}”<ExternalLink className="h-3 w-3" />
        </a>
        {c.parent && (
          <div className="mt-2 flex gap-2 rounded-lg bg-ink-50 px-3 py-2 text-xs text-ink-500 dark:bg-white/5">
            <CornerDownRight className="h-3.5 w-3.5 shrink-0" /><span className="line-clamp-2">Reply to <b>{c.parent.name}</b>: {c.parent.content}</span>
          </div>
        )}
        <p className="mt-2 whitespace-pre-line break-words text-sm leading-relaxed text-ink-700 dark:text-ink-200">{c.content}</p>
        <div className="mt-2 flex flex-wrap items-center gap-1 text-xs">
          <span className="mr-2 inline-flex items-center gap-1 text-ink-400"><Heart className="h-3.5 w-3.5" />{c.likes}</span>
          {c.status !== 'APPROVED' && <button disabled={busy} onClick={() => setStatus('APPROVED', 'Comment approved')} className="a-btn-ghost h-8 px-2.5 text-xs text-emerald-600"><Check className="h-3.5 w-3.5" />Approve</button>}
          {c.status === 'APPROVED' && <button disabled={busy} onClick={() => setStatus('PENDING', 'Moved back to pending')} className="a-btn-ghost h-8 px-2.5 text-xs"><Undo2 className="h-3.5 w-3.5" />Unapprove</button>}
          {c.status !== 'SPAM' && <button disabled={busy} onClick={() => setStatus('SPAM', 'Marked as spam')} className="a-btn-ghost h-8 px-2.5 text-xs text-amber-600"><ShieldAlert className="h-3.5 w-3.5" />Spam</button>}
          <button onClick={() => { setMode(mode === 'reply' ? null : 'reply'); setText(''); }} className="a-btn-ghost h-8 px-2.5 text-xs"><CornerDownRight className="h-3.5 w-3.5" />Reply</button>
          <button onClick={() => { setMode(mode === 'edit' ? null : 'edit'); setText(c.content); }} className="a-btn-ghost h-8 px-2.5 text-xs"><Pencil className="h-3.5 w-3.5" />Edit</button>
          <button disabled={busy} onClick={remove} className="a-btn-ghost h-8 px-2.5 text-xs text-rose-600"><Trash2 className="h-3.5 w-3.5" />Delete</button>
        </div>
        {mode && (
          <div className="mt-3 rounded-xl border border-ink-200 p-3 dark:border-white/10">
            <textarea autoFocus rows={3} className="a-textarea" value={text} onChange={(e) => setText(e.target.value)} placeholder={mode === 'reply' ? `Reply to ${c.name} — published immediately as the team` : ''} />
            <div className="mt-2 flex justify-end gap-2">
              <button onClick={() => setMode(null)} className="a-btn-secondary h-9"><X className="h-4 w-4" />Cancel</button>
              <button disabled={busy || !text.trim()} onClick={submit} className="a-btn-primary h-9">{busy && <Loader2 className="h-4 w-4 animate-spin" />}{mode === 'reply' ? 'Publish reply' : 'Save'}</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function CommentsInner() {
  const search = useSearchParams();
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '', status: search.get('status') ?? 'PENDING' });
  const { data, reload } = useApi('/admin/comments', params);
  const [picked, setPicked] = useState([]);
  const items = data?.items || [];
  const counts = data?.statusCounts || {};
  const allPicked = items.length > 0 && items.every((c) => picked.includes(c.id));

  const bulk = async (action) => {
    if (action === 'delete' && !(await confirm({ title: `Delete ${picked.length} comment(s)?` }))) return;
    try {
      const { count } = await api.post('/admin/comments/bulk', { ids: picked, action });
      toast.success(`${count} comment(s) ${action === 'delete' ? 'deleted' : `marked ${action.toLowerCase()}`}`);
      setPicked([]);
      reload();
    } catch (e) { toast.error(e.message); }
  };

  return (
    <>
      <PageHeader title="Comments" description="Moderate reader comments and reply as your team." />
      <div className="a-card overflow-hidden">
        <div className="flex flex-col gap-3 border-b border-ink-100 p-3 dark:border-white/5 md:flex-row md:items-center">
          <Tabs value={params.status} onChange={(status) => { setParams({ ...params, page: 1, status }); setPicked([]); }} tabs={[
            { value: 'PENDING', label: 'Pending', count: counts.PENDING || 0 },
            { value: 'APPROVED', label: 'Approved', count: counts.APPROVED || 0 },
            { value: 'SPAM', label: 'Spam', count: counts.SPAM || 0 },
            { value: '', label: 'All' },
          ]} />
          <SearchInput className="md:ml-auto md:w-72" value={params.q} onChange={(q) => setParams({ ...params, page: 1, q })} placeholder="Search comments…" />
        </div>
        {items.length > 0 && (
          <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 bg-ink-50/60 px-4 py-2 text-sm dark:border-white/5 dark:bg-white/[.02] sm:px-5">
            <label className="flex items-center gap-2 font-semibold text-ink-600 dark:text-ink-300">
              <input type="checkbox" checked={allPicked} onChange={() => setPicked(allPicked ? [] : items.map((c) => c.id))} className="h-4 w-4 rounded accent-brand-500" />
              {picked.length ? `${picked.length} selected` : 'Select all'}
            </label>
            {picked.length > 0 && (
              <div className="ml-auto flex flex-wrap gap-1.5">
                <button onClick={() => bulk('APPROVED')} className="a-btn-secondary h-8 px-3 text-xs"><Check className="h-3.5 w-3.5" />Approve</button>
                <button onClick={() => bulk('SPAM')} className="a-btn-secondary h-8 px-3 text-xs"><ShieldAlert className="h-3.5 w-3.5" />Spam</button>
                <button onClick={() => bulk('delete')} className="a-btn-secondary h-8 px-3 text-xs text-rose-600"><Trash2 className="h-3.5 w-3.5" />Delete</button>
              </div>
            )}
          </div>
        )}
        {data && !items.length && (
          <EmptyState icon={MessagesSquare} title={params.status === 'PENDING' ? 'All caught up' : 'No comments'} description={params.status === 'PENDING' ? 'There are no comments waiting for approval.' : 'No comments match this filter.'} />
        )}
        {items.map((c) => <Row key={c.id} c={c} selected={picked.includes(c.id)} onSelect={() => setPicked((p) => (p.includes(c.id) ? p.filter((x) => x !== c.id) : [...p, c.id]))} reload={reload} />)}
        <div className="p-3"><Pagination meta={data?.meta} onChange={(page) => setParams({ ...params, page })} /></div>
      </div>
    </>
  );
}

export default function CommentsPage() {
  return <Suspense fallback={null}><CommentsInner /></Suspense>;
}
