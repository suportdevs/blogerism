'use client';

import { useState } from 'react';
import { toast } from 'sonner';
import { Activity, LogIn, Pencil, Plus, Trash2, Upload } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { formatDate, timeAgo } from '@/lib/utils';
import { Avatar, Badge, EmptyState, PageHeader, Pagination, SearchInput, useConfirm } from '@/components/admin/ui';

const ACTIONS = {
  created: [Plus, 'green'], updated: [Pencil, 'blue'], deleted: [Trash2, 'red'], login: [LogIn, 'brand'], uploaded: [Upload, 'amber'],
};

export default function LogsPage() {
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '', entity: '', action: '' });
  const { data, loading, reload } = useApi('/admin/system/logs', params);
  const items = data?.items || [];
  const set = (p) => setParams((s) => ({ ...s, page: 1, ...p }));

  const clear = async () => {
    if (!(await confirm({ title: 'Clear all activity logs?', confirmLabel: 'Clear logs' }))) return;
    await api.del('/admin/system/logs');
    toast.success('Logs cleared');
    reload();
  };

  return (
    <>
      <PageHeader title="Activity logs" description="An audit trail of everything that happens in the admin panel." actions={<button onClick={clear} className="a-btn-secondary text-rose-600"><Trash2 className="h-4 w-4" />Clear logs</button>} />
      <div className="a-card overflow-hidden">
        <div className="flex flex-wrap gap-3 border-b border-ink-100 p-4 dark:border-white/5">
          <SearchInput value={params.q} onChange={(q) => set({ q })} className="w-full sm:w-72" />
          <select className="a-input w-40" value={params.action} onChange={(e) => set({ action: e.target.value })}>
            <option value="">All actions</option>
            {Object.keys(ACTIONS).map((a) => <option key={a} value={a}>{a}</option>)}
          </select>
          <select className="a-input w-40" value={params.entity} onChange={(e) => set({ entity: e.target.value })}>
            <option value="">All modules</option>
            {data?.entities.map((e) => <option key={e} value={e}>{e}</option>)}
          </select>
        </div>
        <div className={loading ? 'opacity-60' : ''}>
          {items.map((l) => {
            const [Icon, color] = ACTIONS[l.action] || [Activity, 'gray'];
            return (
              <div key={l.id} className="flex items-center gap-4 border-b border-ink-100 px-5 py-3.5 last:border-0 dark:border-white/5">
                <div className="relative">
                  <Avatar src={l.user?.avatar} name={l.user?.name || 'System'} size={38} />
                  <span className="absolute -bottom-1 -right-1 grid h-5 w-5 place-items-center rounded-full bg-white ring-2 ring-white dark:bg-ink-900 dark:ring-ink-900"><Icon className="h-3 w-3 text-ink-500" /></span>
                </div>
                <div className="min-w-0 flex-1">
                  <p className="text-sm"><b className="text-ink-900 dark:text-white">{l.user?.name || 'System'}</b> <span className="text-ink-600 dark:text-ink-300">{l.description}</span></p>
                  <p className="text-xs text-ink-400">{formatDate(l.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}{l.ip && ` · ${l.ip}`}</p>
                </div>
                <Badge color={color}>{l.action}</Badge>
                <Badge>{l.entity}</Badge>
                <span className="hidden w-20 text-right text-xs text-ink-400 sm:block">{timeAgo(l.createdAt)}</span>
              </div>
            );
          })}
          {!loading && !items.length && <EmptyState icon={Activity} title="No activity recorded" />}
        </div>
        <Pagination meta={data?.meta} onChange={(page) => setParams((s) => ({ ...s, page }))} />
      </div>
    </>
  );
}
