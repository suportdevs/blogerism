'use client';

import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useState } from 'react';
import { toast } from 'sonner';
import { Copy, ExternalLink, FileText, Home, LayoutTemplate, MoreHorizontal, Pencil, Plus, Trash2 } from 'lucide-react';
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

  const remove = async (p) => {
    if (!(await confirm({ title: `Delete “${p.title}”?` }))) return;
    await api.del(`/admin/pages/${p.id}`);
    toast.success('Page deleted');
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
      <PageHeader title="Pages" description="Build pages visually with drag-and-drop blocks." actions={<Link href="/admin/pages/new" className="a-btn-primary"><Plus className="h-4 w-4" />New page</Link>} />
      <div className="a-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
          <Tabs value={params.status} onChange={(status) => setParams({ ...params, page: 1, status })} tabs={[{ value: '', label: 'All' }, { value: 'PUBLISHED', label: 'Published' }, { value: 'DRAFT', label: 'Drafts' }]} />
          <SearchInput value={params.q} onChange={(q) => setParams({ ...params, page: 1, q })} placeholder="Search pages…" className="ml-auto w-64" />
        </div>
        <div className="a-scroll overflow-x-auto">
          <table className="a-table min-w-[720px]">
            <thead><tr><th>Page</th><th>Template</th><th>Status</th><th>Last updated</th><th className="w-12" /></tr></thead>
            <tbody className={loading ? 'opacity-60' : ''}>
              {items.map((p) => (
                <tr key={p.id}>
                  <td>
                    <Link href={`/admin/pages/${p.id}`} className="group flex items-center gap-3">
                      <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-50 to-fuchsia-50 text-brand-500 dark:from-brand-500/10 dark:to-fuchsia-500/10">{homepageId === p.id ? <Home className="h-4 w-4" /> : <FileText className="h-4 w-4" />}</span>
                      <div>
                        <div className="flex items-center gap-2 font-semibold text-ink-900 group-hover:text-brand-600 dark:text-white">{p.title}{homepageId === p.id && <Badge color="brand">Homepage</Badge>}</div>
                        <div className="text-xs text-ink-400">/{p.slug}</div>
                      </div>
                    </Link>
                  </td>
                  <td><Badge>{p.template}</Badge></td>
                  <td><StatusBadge status={p.status} /></td>
                  <td className="text-xs"><span title={formatDate(p.updatedAt)}>{timeAgo(p.updatedAt)}</span></td>
                  <td>
                    <Dropdown trigger={<button className="a-btn-ghost a-btn-icon h-8 w-8"><MoreHorizontal className="h-4 w-4" /></button>}>
                      <DropdownItem icon={Pencil} onClick={() => router.push(`/admin/pages/${p.id}`)}>Open builder</DropdownItem>
                      {p.status === 'PUBLISHED' && <DropdownItem icon={ExternalLink} href={homepageId === p.id ? '/' : `/${p.slug}`}>View on site</DropdownItem>}
                      <DropdownItem icon={Copy} onClick={() => duplicate(p)}>Duplicate</DropdownItem>
                      {can('settings') && homepageId !== p.id && p.status === 'PUBLISHED' && <DropdownItem icon={Home} onClick={() => setHome(p)}>Set as homepage</DropdownItem>}
                      <DropdownItem icon={Trash2} danger onClick={() => remove(p)}>Delete</DropdownItem>
                    </Dropdown>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
          {!loading && !items.length && <EmptyState icon={LayoutTemplate} title="No pages yet" description="Start from a template or a blank canvas." action={<Link href="/admin/pages/new" className="a-btn-primary"><Plus className="h-4 w-4" />Create page</Link>} />}
        </div>
        <Pagination meta={data?.meta} onChange={(page) => setParams({ ...params, page })} />
      </div>
    </>
  );
}
