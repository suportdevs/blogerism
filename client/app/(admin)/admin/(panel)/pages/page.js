'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, ExternalLink, FileText, Home, LayoutTemplate, MoreHorizontal, Pencil, Plus, RotateCcw, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { formatDate, timeAgo } from '@/lib/utils';
import { Badge, Dropdown, DropdownItem, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge, Tabs, useConfirm } from '@/components/admin/ui';
import { useAuth } from '@/components/admin/AuthProvider';

export default function PagesPage() {
  const router = useRouter();
  const confirm = useConfirm();
  const { can } = useAuth();
  const [params, setParams] = useState({ page: 1, q: '', status: '' });
  const { data, loading, reload } = useApi('/admin/pages', params);
  const { data: settings, reload: reloadSettings } = useApi(can('settings') ? '/admin/settings' : null);
  const homepageId = settings?.general?.homepageId;
  const items = data?.items || [];
  const counts = data?.statusCounts || {};
  const total = Object.entries(counts).reduce((a, [k, n]) => (k === 'TRASH' ? a : a + n), 0);
  const inTrash = params.status === 'TRASH';

  const restore = async (p) => {
    await api.post(`/admin/pages/${p.id}/restore`);
    toast.success(`“${p.title}” restored as a draft`);
    reload();
  };
  // Deleting moves a page to the trash (with undo); deleting from the trash is permanent.
  const remove = async (p) => {
    if (p.status === 'TRASH') {
      if (!(await confirm({ title: `Permanently delete “${p.title}”?`, message: 'The page and its revision history are removed. This cannot be undone.' }))) return;
      await api.del(`/admin/pages/${p.id}`);
      toast.success('Page deleted permanently');
    } else {
      if (homepageId === p.id && !(await confirm({ title: `“${p.title}” is your homepage`, message: 'Move it to the trash anyway? Visitors will see the default homepage until you choose another one.', confirmLabel: 'Move to trash' }))) return;
      await api.del(`/admin/pages/${p.id}`);
      toast.success('Page moved to the trash', { action: { label: 'Undo', onClick: () => restore(p) } });
    }
    reload();
  };
  const emptyTrash = async () => {
    if (!(await confirm({ title: 'Empty the trash?', message: `${counts.TRASH} page(s) will be deleted permanently. This cannot be undone.`, confirmLabel: 'Empty trash' }))) return;
    const { count } = await api.post('/admin/pages/empty-trash');
    toast.success(`${count} page(s) deleted permanently`);
    reload();
  };
  const duplicate = async (p) => {
    const copy = await api.post(`/admin/pages/${p.id}/duplicate`);
    toast.success('Page duplicated');
    router.push(`/admin/pages/${copy.id}`);
  };
  const setHome = async (p) => {
    await api.put('/admin/settings/general', { homepageId: p.id });
    toast.success(`“${p.title}” is now your homepage`);
    reloadSettings();
  };

  return (
    <>
      <PageHeader
        title="Pages"
        description="Build pages visually with drag-and-drop blocks."
        actions={inTrash && counts.TRASH ? <button onClick={emptyTrash} className="a-btn-danger"><Trash2 className="h-4 w-4" />Empty trash</button> : <Link href="/admin/pages/new" className="a-btn-primary"><Plus className="h-4 w-4" />New page</Link>}
      />
      <div className="a-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
          <Tabs
            value={params.status}
            onChange={(status) => setParams({ ...params, page: 1, status })}
            tabs={[
              { value: '', label: 'All', count: total },
              { value: 'PUBLISHED', label: 'Published', count: counts.PUBLISHED || 0 },
              { value: 'DRAFT', label: 'Drafts', count: counts.DRAFT || 0 },
              { value: 'TRASH', label: 'Trash', count: counts.TRASH || 0 },
            ]}
          />
          <SearchInput value={params.q} onChange={(q) => setParams({ ...params, page: 1, q })} placeholder="Search pages…" className="ml-auto w-64" />
        </div>
        {inTrash && items.length > 0 && <div className="border-b border-ink-100 bg-ink-50/60 px-4 py-2.5 text-xs text-ink-500 dark:border-white/5 dark:bg-white/[.02]">Pages in the trash are deleted permanently after 30 days. Restoring a page brings it back as a draft.</div>}
        <div className="a-scroll overflow-x-auto">
          <table className="a-table min-w-[720px]">
            <thead><tr><th>Page</th><th>Template</th><th>Status</th><th>{inTrash ? 'Trashed' : 'Last updated'}</th><th className="w-12" /></tr></thead>
            <tbody className={loading ? 'opacity-60' : ''}>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={inTrash ? '#' : `/admin/pages/${p.id}`} onClick={(e) => inTrash && e.preventDefault()} className="group flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-fuchsia-50 text-brand-500 dark:from-brand-500/10 dark:to-fuchsia-500/10">{homepageId === p.id ? <Home className="h-4 w-4" /> : <FileText className="h-4 w-4" />}</span>
                      <div>
                        <div className="flex items-center gap-2 font-semibold text-ink-900 group-hover:text-brand-600 dark:text-white">{p.title}{homepageId === p.id && <Badge color="brand">Homepage</Badge>}</div>
                        <div className="text-xs text-ink-400">/{p.slug}</div>
                      </div>
                    </Link>
                  </td>
                  <td><Badge>{p.template}</Badge></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td className="text-xs"><span title={formatDate(p.trashedAt || p.updatedAt)}>{timeAgo(p.trashedAt || p.updatedAt)}</span></td>
                  <td>
                    <Dropdown trigger={<button className="a-btn-ghost a-btn-icon h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button>}>
                      {p.status === 'TRASH' ? (
                        <>
                          <DropdownItem icon={RotateCcw} onClick={() => restore(p)}>Restore</DropdownItem>
                          <DropdownItem icon={Trash2} danger onClick={() => remove(p)}>Delete permanently</DropdownItem>
                        </>
                      ) : (
                        <>
                          <DropdownItem icon={Pencil} onClick={() => router.push(`/admin/pages/${p.id}`)}>Open builder</DropdownItem>
                          {p.status === 'PUBLISHED' && <DropdownItem icon={ExternalLink} href={homepageId === p.id ? '/' : `/${p.slug}`}>View on site</DropdownItem>}
                          <DropdownItem icon={Copy} onClick={() => duplicate(p)}>Duplicate</DropdownItem>
                          {can('settings') && homepageId !== p.id && p.status === 'PUBLISHED' && <DropdownItem icon={Home} onClick={() => setHome(p)}>Set as homepage</DropdownItem>}
                          <DropdownItem icon={Trash2} danger onClick={() => remove(p)}>Move to trash</DropdownItem>
                        </>
                      )}
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !items.length && (inTrash
            ? <EmptyState icon={Trash2} title="The trash is empty" description="Deleted pages wait here for 30 days before they are removed for good." />
            : <EmptyState icon={LayoutTemplate} title="No pages yet" description="Start from a template or a blank canvas." action={<Link href="/admin/pages/new" className="a-btn-primary"><Plus className="h-4 w-4" />Create page</Link>} />)}
        </div>
        <Pagination meta={data?.meta} onChange={(page) => setParams({ ...params, page })} />
      </div>
    </>
  );
}
