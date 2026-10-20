'use client';

import { Suspense, useEffect, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { CalendarCheck, CalendarX, Check, Download, ExternalLink, Inbox, Loader2, Mail, MailOpen, Phone, Reply, Send, Trash2 } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn, formatDate, timeAgo } from '@/lib/utils';
import { Avatar, Badge, EmptyState, PageHeader, Pagination, SearchInput, StatusBadge, Tabs, useConfirm } from '@/components/admin/ui';

const KIND_LABEL = { contact: 'Message', appointment: 'Appointment', reservation: 'Reservation', consultation: 'Consultation', valuation: 'Valuation', booking: 'Booking', enquiry: 'Enquiry', enrolment: 'Enrolment', donation: 'Donation' };
const isBooking = (m) => m && m.kind && m.kind !== 'contact';
const detailLine = (m) => Object.entries(m.details || {}).filter(([k]) => /date|time|service|guests|room|course|tour/i.test(k)).map(([, v]) => v).slice(0, 3).join(' · ');

// Ready-to-edit emails for the reply box.
function template(type, m, site, phone) {
  const what = (KIND_LABEL[m.kind] || 'request').toLowerCase();
  const lines = Object.entries(m.details || {}).map(([k, v]) => `${k}: ${v}`).join('\n');
  const sign = `\n\nBest regards,\n${site}${phone ? `\n${phone}` : ''}`;
  if (type === 'CONFIRMED') return { subject: `Your ${what} is confirmed`, body: `Hi ${m.name},\n\nGood news — your ${what} is confirmed.\n\n${lines}\n\nIf anything changes, just reply to this email.${sign}` };
  if (type === 'CANCELLED') return { subject: `About your ${what} request`, body: `Hi ${m.name},\n\nThank you for your ${what} request. Unfortunately we can’t accommodate it at the requested time.\n\n${lines}\n\nReply to this email and we’ll find another time that works for you.${sign}` };
  return { subject: `Re: ${m.subject || 'Your message'}`, body: `Hi ${m.name},\n\n\n${sign}` };
}

function Composer({ m, data, onSent }) {
  const [mode, setMode] = useState(isBooking(m) ? 'CONFIRMED' : 'REPLIED');
  const [draft, setDraft] = useState(() => template(mode, m, data.siteName, data.contactPhone));
  const [sending, setSending] = useState(false);
  const pick = (next) => { setMode(next); setDraft(template(next, m, data.siteName, data.contactPhone)); };

  const send = async () => {
    setSending(true);
    try {
      await api.post(`/admin/contacts/${m.id}/reply`, { ...draft, status: mode });
      toast.success(`Email sent to ${m.email}`);
      onSent();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSending(false);
    }
  };

  if (!data.emailReady) {
    return (
      <div className="mt-6 rounded-2xl border border-dashed border-ink-200 p-5 dark:border-white/10">
        <p className="text-sm text-ink-500">Set up email in <Link href="/admin/settings?tab=email" className="font-semibold text-brand-600">Settings → Email</Link> to reply, confirm and cancel right here. Until then:</p>
        <div className="mt-3 flex flex-wrap gap-2">
          <a href={`mailto:${m.email}?subject=${encodeURIComponent(draft.subject)}&body=${encodeURIComponent(draft.body)}`} onClick={() => onSent(mode)} className="a-btn-primary"><Reply className="h-4 w-4" />Reply in your mail app</a>
          {m.phone && <a href={`tel:${m.phone}`} className="a-btn-secondary"><Phone className="h-4 w-4" />Call {m.phone}</a>}
        </div>
      </div>
    );
  }

  return (
    <div className="mt-6 rounded-2xl border border-ink-200/70 dark:border-white/10">
      <div className="flex flex-wrap items-center gap-2 border-b border-ink-100 p-3 dark:border-white/5">
        <span className="mr-1 text-xs font-bold uppercase tracking-wider text-ink-400">Reply</span>
        {isBooking(m) ? (
          <Tabs value={mode} onChange={pick} tabs={[{ value: 'CONFIRMED', label: 'Confirm' }, { value: 'CANCELLED', label: 'Decline' }, { value: 'REPLIED', label: 'Message' }]} />
        ) : <span className="text-sm text-ink-500">to {m.email}</span>}
      </div>
      <div className="space-y-3 p-4">
        <input className="a-input" value={draft.subject} onChange={(e) => setDraft((d) => ({ ...d, subject: e.target.value }))} placeholder="Subject" />
        <textarea className="a-textarea" rows={9} value={draft.body} onChange={(e) => setDraft((d) => ({ ...d, body: e.target.value }))} />
        <div className="flex items-center justify-between gap-3">
          <span className="text-xs text-ink-400">Sent to {m.email} · status becomes “{mode.toLowerCase()}”</span>
          <button onClick={send} disabled={sending} className={cn('a-btn-primary', mode === 'CANCELLED' && '!bg-rose-600 hover:!bg-rose-700')}>
            {sending ? <Loader2 className="h-4 w-4 animate-spin" /> : mode === 'CONFIRMED' ? <CalendarCheck className="h-4 w-4" /> : mode === 'CANCELLED' ? <CalendarX className="h-4 w-4" /> : <Send className="h-4 w-4" />}
            {mode === 'CONFIRMED' ? 'Send confirmation' : mode === 'CANCELLED' ? 'Send & decline' : 'Send reply'}
          </button>
        </div>
      </div>
    </div>
  );
}

function ContactsInner() {
  const search = useSearchParams();
  const confirm = useConfirm();
  const [params, setParams] = useState({ page: 1, q: '', status: search.get('status') || '', kind: search.get('kind') || '' });
  const { data, reload } = useApi('/admin/contacts', params);
  const [openId, setOpenId] = useState(null);
  const items = data?.items || [];
  const current = items.find((m) => m.id === openId);
  const counts = data?.statusCounts || {};
  const bookingsView = params.kind === 'bookings';

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
  const switchKind = (kind) => { setParams({ ...params, page: 1, kind, status: '' }); setOpenId(null); };

  return (
    <>
      <PageHeader
        title="Messages"
        description="Contact form messages and booking requests from your website."
        actions={<button onClick={() => api.download('/admin/contacts/export', 'messages.csv').catch((e) => toast.error(e.message))} className="a-btn-secondary"><Download className="h-4 w-4" />Export CSV</button>}
      />
      <Tabs className="mb-4" value={params.kind} onChange={switchKind} tabs={[
        { value: '', label: 'Everything' }, { value: 'contact', label: 'Messages' }, { value: 'bookings', label: 'Bookings', count: data?.newBookings || 0 },
      ]} />
      <div className="a-card grid overflow-hidden lg:h-[calc(100vh-17rem)] lg:grid-cols-[380px_1fr]">
        <div className="flex min-h-0 flex-col border-b border-ink-100 dark:border-white/5 lg:border-b-0 lg:border-r">
          <div className="space-y-3 border-b border-ink-100 p-3 dark:border-white/5">
            <Tabs className="w-full [&>button]:flex-1 [&>button]:justify-center" value={params.status} onChange={(status) => { setParams({ ...params, page: 1, status }); setOpenId(null); }} tabs={[
              { value: '', label: 'All' }, { value: 'UNREAD', label: 'New', count: counts.UNREAD || 0 },
              ...(bookingsView ? [{ value: 'CONFIRMED', label: 'Confirmed' }, { value: 'CANCELLED', label: 'Declined' }] : [{ value: 'READ', label: 'Read' }, { value: 'REPLIED', label: 'Replied' }]),
            ]} />
            <SearchInput value={params.q} onChange={(q) => setParams({ ...params, page: 1, q })} placeholder="Search messages…" />
          </div>
          <div className="a-scroll flex-1 overflow-y-auto">
            {items.length === 0 && <EmptyState icon={Inbox} title={bookingsView ? 'No bookings yet' : 'Inbox zero'} description={bookingsView ? 'Appointment, reservation and consultation forms on your site land here.' : 'No messages match this filter.'} />}
            {items.map((m) => (
              <button key={m.id} onClick={() => open(m)} className={cn('flex w-full gap-3 border-b border-ink-100 p-4 text-left transition dark:border-white/5', openId === m.id ? 'bg-brand-50/70 dark:bg-brand-500/10' : 'hover:bg-ink-50 dark:hover:bg-white/[.02]')}>
                <div className="relative"><Avatar name={m.name} size={38} />{m.status === 'UNREAD' && <span className="absolute -right-0.5 -top-0.5 h-3 w-3 rounded-full border-2 border-white bg-brand-500 dark:border-ink-900" />}</div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-center gap-2"><span className={cn('truncate text-sm', m.status === 'UNREAD' ? 'font-extrabold text-ink-900 dark:text-white' : 'font-semibold')}>{m.name}</span><span className="ml-auto shrink-0 text-[11px] text-ink-400">{timeAgo(m.createdAt)}</span></div>
                  {isBooking(m) ? (
                    <div className="mt-0.5 flex items-center gap-1.5 text-sm"><Badge color={m.status === 'CONFIRMED' ? 'green' : m.status === 'CANCELLED' ? 'red' : 'brand'}>{KIND_LABEL[m.kind] || m.kind}</Badge><span className="truncate text-xs font-medium text-ink-600 dark:text-ink-300">{detailLine(m)}</span></div>
                  ) : <div className="truncate text-sm font-medium text-ink-700 dark:text-ink-300">{m.subject || '(no subject)'}</div>}
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
                {isBooking(current) && <Badge color="brand">{KIND_LABEL[current.kind] || current.kind}</Badge>}
                <StatusBadge status={current.status} />
                <div className="ml-auto flex gap-2">
                  {current.status !== 'UNREAD' && <button onClick={() => setStatus(current, 'UNREAD')} className="a-btn-secondary"><Mail className="h-4 w-4" />Mark unread</button>}
                  {isBooking(current)
                    ? current.status !== 'CONFIRMED' && <button onClick={() => setStatus(current, 'CONFIRMED')} className="a-btn-secondary"><CalendarCheck className="h-4 w-4" />Mark confirmed</button>
                    : current.status !== 'REPLIED' && <button onClick={() => setStatus(current, 'REPLIED')} className="a-btn-secondary"><Check className="h-4 w-4" />Mark replied</button>}
                  <button onClick={() => remove(current)} className="a-btn-ghost a-btn-icon text-rose-600" title="Delete"><Trash2 className="h-4 w-4" /></button>
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
                      {current.phone && <a href={`tel:${current.phone}`} className="flex items-center gap-1 hover:text-brand-600"><Phone className="h-3.5 w-3.5" />{current.phone}</a>}
                      {current.phone && <a href={`https://wa.me/${current.phone.replace(/\D/g, '')}`} target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-emerald-600"><ExternalLink className="h-3.5 w-3.5" />WhatsApp</a>}
                    </div>
                  </div>
                  <div className="ml-auto text-right text-xs text-ink-400">{formatDate(current.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}<br />{current.ip && `IP ${current.ip}`}</div>
                </div>
                {current.details && Object.keys(current.details).length > 0 && (
                  <dl className="mt-6 grid gap-px overflow-hidden rounded-2xl border border-ink-100 bg-ink-100 sm:grid-cols-2 dark:border-white/5 dark:bg-white/5">
                    {Object.entries(current.details).map(([k, v]) => (
                      <div key={k} className="bg-white px-4 py-3 dark:bg-ink-900 sm:[&:last-child:nth-child(odd)]:col-span-2"><dt className="text-[11px] font-bold uppercase tracking-wider text-ink-400">{k}</dt><dd className="mt-0.5 font-semibold text-ink-900 dark:text-white">{String(v)}</dd></div>
                    ))}
                  </dl>
                )}
                <div className="mt-6 whitespace-pre-wrap rounded-2xl bg-ink-50 p-5 leading-relaxed text-ink-800 dark:bg-white/5 dark:text-ink-200">{current.message}</div>
                <Composer key={current.id} m={current} data={data} onSent={(status) => (status ? setStatus(current, status) : reload())} />
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
