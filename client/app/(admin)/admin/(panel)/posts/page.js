'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, ExternalLink, Eye, MoreHorizontal, Newspaper, Pencil, Plus, Star, Trash2, CheckCircle2, FileX, Video, Mic, Images, Zap, RotateCcw } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi, useSelection } from '@/lib/hooks';
import { compact, formatDate, formatDuration, postUrl } from '@/lib/utils';

const FORMAT_ICONS = { VIDEO: Video, AUDIO: Mic, GALLERY: Images };
import { Avatar, Checkbox, Dropdown, DropdownItem, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge, Tabs, useConfirm } from '@/components/admin/ui';

export default function PostsPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '', status: '', category: '', format: '', sort: 'createdAt', order: 'desc' });
  const { data, loading, reload } = useApi('/admin/posts', params);
  const { data: cats } = useApi('/admin/taxonomy/categories');
  const items = data?.items || [];
  const sel = useSelection(items);
  const counts = data?.statusCounts || {};
  const total = Object.entries(counts).reduce((a, [k, n]) => (k === 'TRASH' ? a : a + n), 0);
  const inTrash = params.status === 'TRASH';
  const set = (p) => setParams((s) => ({ ...s, page: 1, ...p }));

  const BULK_DONE = { publish: 'published', draft: 'moved to drafts', trash: 'moved to the trash', restore: 'restored', delete: 'deleted permanently' };
  const bulk = async (action) => {
    if (action === 'delete' && !(await confirm({ title: `Permanently delete ${sel.selected.length} post(s)?` }))) return;
    const { count } = await api.post('/admin/posts/bulk', { ids: sel.selected, action });
    toast.success(`${count} post(s) ${BULK_DONE[action]}`);
    sel.clear();
    reload();
  };

  const restore = async (post) => {
    await api.post(`/admin/posts/${post.id}/restore`);
    toast.success(`“${post.title}” restored as a draft`);
    reload();
  };

  // Deleting moves a post to the trash (with undo); deleting from the trash is permanent.
  const remove = async (post) => {
    if (post.status === 'TRASH') {
      if (!(await confirm({ title: `Permanently delete “${post.title}”?`, message: 'The post, its comments and its revision history are removed. This cannot be undone.' }))) return;
      await api.del(`/admin/posts/${post.id}`);
      toast.success('Post deleted permanently');
    } else {
      await api.del(`/admin/posts/${post.id}`);
      toast.success('Post moved to the trash', { action: { label: 'Undo', onClick: () => restore(post) } });
    }
    reload();
  };

  const emptyTrash = async () => {
    if (!(await confirm({ title: 'Empty the trash?', message: `${counts.TRASH} post(s) will be deleted permanently. This cannot be undone.`, confirmLabel: 'Empty trash' }))) return;
    const { count } = await api.post('/admin/posts/empty-trash');
    toast.success(`${count} post(s) deleted permanently`);
    reload();
  };

  const duplicate = async (post) => {
    const copy = await api.post(`/admin/posts/${post.id}/duplicate`);
    toast.success('Post duplicated');
    router.push(`/admin/posts/${copy.id}`);
  };

  const sortBy = (field) => set({ sort: field, order: params.sort === field && params.order === 'desc' ? 'asc' : 'desc' });
  const SortTh = ({ field, children, className }) => (
    <th className={className}>
      <button onClick={() => sortBy(field)} className="inline-flex items-center gap-1 uppercase hover:text-ink-700">{children}{params.sort === field && (params.order === 'desc' ? '↓' : '↑')}</button>
    </th>
  );

  return (
    <>
      <PageHeader
        title="Posts"
        description="Write, schedule and manage your blog articles."
        actions={inTrash && counts.TRASH ? <button onClick={emptyTrash} className="a-btn-danger"><Trash2 className="h-4 w-4" />Empty trash</button> : <Link href="/admin/posts/new" className="a-btn-primary"><Plus className="h-4 w-4" />New post</Link>}
      />

      <div className="a-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
          <Tabs
            value={params.status}
            onChange={(status) => set({ status })}
            tabs={[
              { value: '', label: 'All', count: total },
              { value: 'PUBLISHED', label: 'Published', count: counts.PUBLISHED || 0 },
              { value: 'DRAFT', label: 'Drafts', count: counts.DRAFT || 0 },
              { value: 'SCHEDULED', label: 'Scheduled', count: counts.SCHEDULED || 0 },
              { value: 'TRASH', label: 'Trash', count: counts.TRASH || 0 },
            ]}
          />
          <div className="ml-auto flex flex-wrap gap-2">
            <select className="a-input w-36" value={params.format} onChange={(e) => set({ format: e.target.value })}>
              <option value="">All formats</option>
              <option value="STANDARD">Articles</option>
              <option value="VIDEO">Videos</option>
              <option value="AUDIO">Audio</option>
              <option value="GALLERY">Galleries</option>
            </select>
            <select className="a-input w-44" value={params.category} onChange={(e) => set({ category: e.target.value })}>
              <option value="">All categories</option>
              {cats?.items.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
            </select>
            <SearchInput value={params.q} onChange={(q) => set({ q })} placeholder="Search posts…" className="w-56" />
          </div>
        </div>

        {sel.selected.length > 0 && (
          <div className="flex items-center gap-2 border-b border-brand-100 bg-brand-50/70 px-4 py-2.5 text-sm dark:border-brand-500/20 dark:bg-brand-500/10">
            <b className="text-brand-700 dark:text-brand-200">{sel.selected.length} selected</b>
            <div className="ml-auto flex gap-2">
              {inTrash ? (
                <>
                  <button className="a-btn-secondary h-8" onClick={() => bulk('restore')}><RotateCcw className="h-4 w-4" />Restore</button>
                  <button className="a-btn-danger h-8" onClick={() => bulk('delete')}><Trash2 className="h-4 w-4" />Delete permanently</button>
                </>
              ) : (
                <>
                  <button className="a-btn-secondary h-8" onClick={() => bulk('publish')}><CheckCircle2 className="h-4 w-4" />Publish</button>
                  <button className="a-btn-secondary h-8" onClick={() => bulk('draft')}><FileX className="h-4 w-4" />Move to draft</button>
                  <button className="a-btn-danger h-8" onClick={() => bulk('trash')}><Trash2 className="h-4 w-4" />Move to trash</button>
                </>
              )}
            </div>
          </div>
        )}

        {inTrash && items.length > 0 && <div className="border-b border-ink-100 bg-ink-50/60 px-4 py-2.5 text-xs text-ink-500 dark:border-white/5 dark:bg-white/[.02]">Posts in the trash are deleted permanently after 30 days. Restoring a post brings it back as a draft.</div>}

        <div className="a-scroll overflow-x-auto">
          <table className="a-table min-w-[860px]">
            <thead>
              <tr>
                <th className="w-10"><Checkbox checked={sel.allSelected} indeterminate={sel.someSelected} onChange={sel.toggleAll} /></th>
                <SortTh field="title">Post</SortTh>
                <th>Author</th>
                <th>Category</th>
                <th>Status</th>
                <SortTh field="views">Views</SortTh>
                <SortTh field="createdAt">Date</SortTh>
                <th className="w-12" />
              </tr>
            </thead>
            <tbody className={loading ? 'opacity-60' : ''}>
              {items.map((p) => (
                <tr key={p.id}>
                  <td><Checkbox checked={sel.isSelected(p.id)} onChange={() => sel.toggle(p.id)} /></td>
                  <td>
                    <Link href={`/admin/posts/${p.id}`} className="group flex items-center gap-3">
                      {p.coverImage ? <img src={p.coverImage} alt="" className="h-11 w-16 shrink-0 rounded-lg object-cover" /> : <div className="grid h-11 w-16 shrink-0 place-items-center rounded-lg bg-ink-100 text-ink-300 dark:bg-white/5"><Newspaper className="h-4 w-4" /></div>}
                      <div className="min-w-0">
                        <div className="flex items-center gap-1.5 font-semibold text-ink-900 group-hover:text-brand-600 dark:text-white">
                          {p.featured && <Star className="h-3.5 w-3.5 shrink-0 fill-amber-400 text-amber-400" />}
                          {p.isBreaking && <Zap className="h-3.5 w-3.5 shrink-0 fill-rose-500 text-rose-500" />}
                          {FORMAT_ICONS[p.format] && (() => { const I = FORMAT_ICONS[p.format]; return <I className="h-3.5 w-3.5 shrink-0 text-brand-500" />; })()}
                          <span className="line-clamp-1">{p.title}</span>
                        </div>
                        <div className="truncate text-xs text-ink-400">{postUrl(p)}{p.series && <span className="ml-1.5 font-semibold text-brand-500">· {p.series.title}{p.episode ? ` S${p.season || 1}E${p.episode}` : ''}</span>}{p.duration ? ` · ${formatDuration(p.duration)}` : ''}</div>
                      </div>
                    </Link>
                  </td>
                  <td><div className="flex items-center gap-2"><Avatar src={p.author?.avatar} name={p.author?.name || '?'} size={26} /><span className="text-sm">{p.author?.name || '—'}</span></div></td>
                  <td>
                    <div className="flex flex-wrap gap-1">
                      {p.categories.map((c) => <span key={c.id} className="rounded-md px-2 py-0.5 text-xs font-semibold" style={{ background: `${c.color}1a`, color: c.color }}>{c.name}</span>)}
                    </div>
                  </td>
                  <td><StatusBadge status={p.status} /></td>
                  <td><span className="flex items-center gap-1 font-semibold"><Eye className="h-3.5 w-3.5 text-ink-400" />{compact(p.views)}</span></td>
                  <td className="whitespace-nowrap text-xs">{formatDate(p.publishedAt || p.createdAt)}</td>
                  <td>
                    <Dropdown trigger={<button className="a-btn-ghost a-btn-icon h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button>}>
                      {p.status === 'TRASH' ? (
                        <>
                          <DropdownItem icon={RotateCcw} onClick={() => restore(p)}>Restore</DropdownItem>
                          <DropdownItem icon={Trash2} danger onClick={() => remove(p)}>Delete permanently</DropdownItem>
                        </>
                      ) : (
                        <>
                          <DropdownItem icon={Pencil} onClick={() => router.push(`/admin/posts/${p.id}`)}>Edit</DropdownItem>
                          {p.status === 'PUBLISHED' && <DropdownItem icon={ExternalLink} href={postUrl(p)}>View on site</DropdownItem>}
                          <DropdownItem icon={Copy} onClick={() => duplicate(p)}>Duplicate</DropdownItem>
                          <DropdownItem icon={Trash2} danger onClick={() => remove(p)}>Move to trash</DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && items.length === 0 && (
            inTrash
              ? <EmptyState icon={Trash2} title="The trash is empty" description="Deleted posts wait here for 30 days before they are removed for good." />
              : <EmptyState icon={Newspaper} title="No posts found" description="Try a different filter, or write your first article." action={<Link href="/admin/posts/new" className="a-btn-primary"><Plus className="h-4 w-4" />New post</Link>} />
          )}
        </div>
        <Pagination meta={data?.meta} onChange={(page) => setParams((s) => ({ ...s, page }))} />
      </div>
    </>
  );
}
