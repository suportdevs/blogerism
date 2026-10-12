'use client';

import { Suspense, useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { Check, Inbox, Mail, MailOpen, Phone, Reply, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn, formatDate, timeAgo } from '@/lib/utils';
import { Avatar, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge, Tabs, useConfirm } from '@/components/admin/ui';

function ContactsInner() {
  const search = useSearchParams();
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '', status: search.get('status') || '' });
  const { data, reload } = useApi('/admin/contacts', params);
  const [openId, setOpenId] = useState(null);
  const items = data?.items || [];
  const current = items.find((m) => m.id === openId);
  const counts = data?.statusCounts || {};

  useEffect(() => { if (!openId && items[0]) setOpenId(items[0].id); }, [items, openId]);

  const setStatus = async (m, status) => {
    await api.put(`/admin/contacts/${m.id}`, { status });
    reload();
  };
  const open = (m) => {
    setOpenId(m.id);
    if (m.status === 'UNREAD') setStatus(m, 'READ');
  };
  const remove = async (m) => {
    if (!(await confirm({ title: 'Delete this message?' }))) return;
    await api.del(`/admin/contacts/${m.id}`);
    setOpenId(null);
    toast.success('Message deleted');
    reload();
  };

  return (
    <>
      <PageHeader title="Messages" description="Contact form submissions from your website." />
      <div className="a-card grid overflow-hidden lg:h-[calc(100vh-14rem)] lg:grid-cols-[380px_1fr]">
        <div className="flex min-h-0 flex-col border-b border-ink-100 dark:border-white/5 lg:border-b-0 lg:border-r">
          <div className="space-y-3 border-b border-ink-100 p-3 dark:border-white/5">
            <Tabs className="w-full [&>button]:flex-1 [&>button]:justify-center" value={params.status} onChange={(status) => { setParams({ ...params, page: 1, status }); setOpenId(null); }} tabs={[
              { value: '', label: 'All' }, { value: 'UNREAD', label: 'Unread', count: counts.UNREAD || 0 }, { value: 'READ', label: 'Read' }, { value: 'REPLIED', label: 'Replied' },
            ]} />
            <SearchInput value={params.q} onChange={(q) => setParams({ ...params, page: 1, q })} placeholder="Search messages…" />
          </div>
          <div className="a-scroll flex-1 overflow-y-auto">
            {items.length === 0 && <EmptyState icon={Inbox} title="Inbox zero" description="No messages match this filter." />}
            {items.map((m) => (
              <button key={m.id} onClick={() => open(m)} className={cn('flex w-full gap-3 border-b border-ink-100 p-4 text-left transition dark:border-white/5', openId === m.id ? 'bg-brand-50/70 dark:bg-brand-500/10' : 'hover:bg-ink-50 dark:hover:bg-white/[.02]')}>
                <div className="relative"><Avatar name={m.name} size={38} />{m.status === 'UNREAD' && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-brand-500 dark:border-ink-900" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className={cn('truncate text-sm', m.status === 'UNREAD' ? 'font-extrabold text-ink-900 dark:text-white' : 'font-semibold')}>{m.name}</span><span className="ml-auto shrink-0 text-[11px] text-ink-400">{timeAgo(m.createdAt)}</span></div>
                  <div className="truncate text-sm font-medium text-ink-700 dark:text-ink-300">{m.subject || '(no subject)'}</div>
                  <div className="truncate text-xs text-ink-400">{m.message}</div>
                </div>
              </button>
            ))}
          </div>
          <Pagination meta={data?.meta} onChange={(page) => setParams({ ...params, page })} />
        </div>

        <div className="min-h-[400px] min-w-0">
          {current ? (
            <div className="flex h-full flex-col">
              <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 p-4 dark:border-white/5">
                <StatusBadge status={current.status} />
                <div className="ml-auto flex gap-2">
                  {current.status !== 'UNREAD' && <button onClick={() => setStatus(current, 'UNREAD')} className="a-btn-secondary"><Mail className="h-4 w-4" />Mark unread</button>}
                  {current.status !== 'REPLIED' && <button onClick={() => setStatus(current, 'REPLIED')} className="a-btn-secondary"><Check className="h-4 w-4" />Mark replied</button>}
                  <button onClick={() => remove(current)} className="a-btn-ghost a-btn-icon text-rose-600"><Trash2 className="h-4 w-4" /></button>
                </div>
              </div>
              <div className="a-scroll flex-1 overflow-y-auto p-6">
                <h2 className="text-2xl font-extrabold tracking-tight text-ink-900 dark:text-white">{current.subject || '(no subject)'}</h2>
                <div className="mt-4 flex items-center gap-3">
                  <Avatar name={current.name} size={44} />
                  <div>
                    <div className="font-bold text-ink-900 dark:text-white">{current.name}</div>
                    <div className="flex flex-wrap gap-x-4 text-sm text-ink-500">
                      <a href={`mailto:${current.email}`} className="hover:text-brand-600">{current.email}</a>
                      {current.phone && <span className="flex items-center gap-1"><Phone className="h-3.5 w-3.5" />{current.phone}</span>}
                    </div>
                  </div>
                  <div className="ml-auto text-right text-xs text-ink-400">{formatDate(current.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}<br />{current.ip && `IP ${current.ip}`}</div>
                </div>
                <div className="mt-6 whitespace-pre-wrap rounded-2xl bg-ink-50 p-5 leading-relaxed text-ink-800 dark:bg-white/5 dark:text-ink-200">{current.message}</div>
                <a
                  href={`mailto:${current.email}?subject=${encodeURIComponent(`Re: ${current.subject || 'Your message'}`)}`}
                  onClick={() => setStatus(current, 'REPLIED')}
                  className="a-btn-primary mt-6"
                >
                  <Reply className="h-4 w-4" />Reply by email
                </a>
              </div>
            </div>
          ) : <EmptyState icon={MailOpen} title="Select a message" description="Choose a conversation from the list to read it." />}
        </div>
      </div>
    </>
  );
}

export default function ContactsPage() {
  return <Suspense fallback={null}><ContactsInner /></Suspense>;
}
