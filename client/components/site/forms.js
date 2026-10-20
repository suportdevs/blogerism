'use client';

import { useEffect, useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { cn } from '@/lib/utils';
import { useT } from './I18n';

async function submit(path, body) {
  const res = await fetch(`${API_URL}/api/public${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

// Spam trap: a field people never see or fill in; bots that fill every field are silently ignored by the API.
export function Honeypot() {
  return (
    <div aria-hidden="true" className="absolute -left-[9999px] h-px w-px overflow-hidden">
      <label>Website<input type="text" name="website" tabIndex={-1} autoComplete="off" defaultValue="" /></label>
    </div>
  );
}
const trap = (e) => e.currentTarget.elements.namedItem('website')?.value || '';

export function NewsletterForm({ compact, className }) {
  const t = useT();
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading' });
    try {
      const r = await submit('/subscribe', { email, website: trap(e) });
      setState({ status: 'success', message: r.message });
      setEmail('');
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  };

  return (
    <form onSubmit={onSubmit} className={cn('relative w-full', className)}>
      <Honeypot />
      <div className={cn('flex gap-2 rounded-theme border border-fg/10 bg-bg p-1.5 shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15', compact && 'flex-col p-2 [&>button]:w-full [&>input]:py-2')}>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder={t('emailPlaceholder')}
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg/40"
        />
        <button className="btn-site-primary !px-4 !py-2.5 !shadow-none" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <>{t('subscribe')} <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
      {state.message && (
        <p className={cn('mt-2 text-sm', state.status === 'error' ? 'text-rose-500' : 'text-emerald-600')}>{state.message}</p>
      )}
    </form>
  );
}

const IGNORED_PARAMS = new Set(['utm_source', 'utm_medium', 'utm_campaign', 'utm_term', 'utm_content', 'fbclid', 'gclid', 'tab']);
const label = (k) => k.replace(/[-_]/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());

function contextFromUrl() {
  const params = new URLSearchParams(window.location.search);
  const details = {};
  params.forEach((v, k) => { if (v && !IGNORED_PARAMS.has(k) && Object.keys(details).length < 12) details[label(k)] = v.slice(0, 200); });
  if (!Object.keys(details).length) return null;
  if (details.Amount) {
    const monthly = /month/i.test(details.Frequency || '');
    return { kind: 'donation', details, subject: `Donation — ${details.Amount}${monthly ? ' per month' : ''}`, intro: `You’re giving ${details.Amount}${monthly ? ' every month' : ''}. Leave your details and we’ll send you the payment instructions.` };
  }
  const item = details.Item || details.Tour || details.Property || details.Course || details.Room;
  return { kind: 'enquiry', details, subject: item ? `Enquiry — ${item}` : 'Enquiry', intro: 'Your enquiry includes:' };
}

export function ContactForm() {
  const t = useT();
  const empty = { name: '', email: '', phone: '', subject: '', message: '' };
  const [form, setForm] = useState(empty);
  const [state, setState] = useState({ status: 'idle', message: '' });
  const [context, setContext] = useState(null);
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));
  useEffect(() => {
    const c = contextFromUrl();
    if (c) { setContext(c); setForm((f) => ({ ...f, subject: f.subject || c.subject })); }
  }, []);

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading' });
    try {
      const r = await submit('/contact', { ...form, ...(context ? { kind: context.kind, details: context.details } : {}), website: trap(e) });
      setState({ status: 'success', message: r.message });
      setForm(empty);
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  };

  if (state.status === 'success') {
    return (
      <div className="flex flex-col items-center justify-center rounded-theme-lg border border-fg/10 bg-bg p-10 text-center">
        <div className="mb-4 grid h-14 w-14 place-items-center rounded-full bg-emerald-500/10 text-emerald-500"><CheckCircle2 className="h-7 w-7" /></div>
        <h3 className="font-heading text-xl font-bold text-fg">{t('messageSent')}</h3>
        <p className="mt-2 text-fg/60">{state.message}</p>
        <button onClick={() => setState({ status: 'idle' })} className="btn-site-ghost mt-6">{t('sendAnother')}</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="relative grid gap-4 rounded-theme-lg border border-fg/10 bg-bg p-6 shadow-sm sm:grid-cols-2 sm:p-8">
      <Honeypot />
      {context && (
        <div className="rounded-theme border border-primary/20 bg-primary/5 p-4 text-sm sm:col-span-2">
          <p className="font-semibold text-fg">{context.intro}</p>
          <div className="mt-2 flex flex-wrap gap-2">{Object.entries(context.details).map(([k, v]) => <span key={k} className="rounded-full bg-bg px-3 py-1 text-xs text-fg/75 ring-1 ring-fg/10"><b className="text-fg">{k}:</b> {v}</span>)}</div>
        </div>
      )}
      <input className="site-input" placeholder={t('yourName')} required value={form.name} onChange={set('name')} />
      <input className="site-input" type="email" placeholder={t('emailAddress')} required value={form.email} onChange={set('email')} />
      <input className="site-input" placeholder={t('phoneOptional')} value={form.phone} onChange={set('phone')} />
      <input className="site-input" placeholder={t('subject')} value={form.subject} onChange={set('subject')} />
      <textarea className="site-input min-h-[140px] sm:col-span-2" placeholder={t('howCanWeHelp')} required value={form.message} onChange={set('message')} />
      {state.status === 'error' && <p className="text-sm text-rose-500 sm:col-span-2">{state.message}</p>}
      <button className="btn-site-primary sm:col-span-2" disabled={state.status === 'loading'}>
        {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> {t('sendMessage')}</>}
      </button>
    </form>
  );
}
