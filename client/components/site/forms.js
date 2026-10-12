'use client';

import { useState } from 'react';
import { ArrowRight, CheckCircle2, Loader2, Send } from 'lucide-react';
import { API_URL } from '@/lib/api';
import { cn } from '@/lib/utils';

async function submit(path, body) {
  const res = await fetch(`${API_URL}/api/public${path}`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) });
  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
}

export function NewsletterForm({ compact, className }) {
  const [email, setEmail] = useState('');
  const [state, setState] = useState({ status: 'idle', message: '' });

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading' });
    try {
      const r = await submit('/subscribe', { email });
      setState({ status: 'success', message: r.message });
      setEmail('');
    } catch (err) {
      setState({ status: 'error', message: err.message });
    }
  };

  return (
    <form onSubmit={onSubmit} className={cn('w-full', className)}>
      <div className={cn('flex gap-2 rounded-theme border border-fg/10 bg-bg p-1.5 shadow-sm focus-within:border-primary focus-within:ring-4 focus-within:ring-primary/15', compact && 'flex-col p-2 [&>button]:w-full [&>input]:py-2')}>
        <input
          type="email" required value={email} onChange={(e) => setEmail(e.target.value)} placeholder="you@company.com"
          className="min-w-0 flex-1 bg-transparent px-3 text-sm text-fg outline-none placeholder:text-fg/40"
        />
        <button className="btn-site-primary !px-4 !py-2.5 !shadow-none" disabled={state.status === 'loading'}>
          {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Subscribe <ArrowRight className="h-4 w-4" /></>}
        </button>
      </div>
      {state.message && (
        <p className={cn('mt-2 text-sm', state.status === 'error' ? 'text-rose-500' : 'text-emerald-600')}>{state.message}</p>
      )}
    </form>
  );
}

export function ContactForm() {
  const empty = { name: '', email: '', phone: '', subject: '', message: '' };
  const [form, setForm] = useState(empty);
  const [state, setState] = useState({ status: 'idle', message: '' });
  const set = (k) => (e) => setForm((f) => ({ ...f, [k]: e.target.value }));

  const onSubmit = async (e) => {
    e.preventDefault();
    setState({ status: 'loading' });
    try {
      const r = await submit('/contact', form);
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
        <h3 className="font-heading text-xl font-bold text-fg">Message sent!</h3>
        <p className="mt-2 text-fg/60">{state.message}</p>
        <button onClick={() => setState({ status: 'idle' })} className="btn-site-ghost mt-6">Send another</button>
      </div>
    );
  }

  return (
    <form onSubmit={onSubmit} className="grid gap-4 rounded-theme-lg border border-fg/10 bg-bg p-6 shadow-sm sm:grid-cols-2 sm:p-8">
      <input className="site-input" placeholder="Your name *" required value={form.name} onChange={set('name')} />
      <input className="site-input" type="email" placeholder="Email address *" required value={form.email} onChange={set('email')} />
      <input className="site-input" placeholder="Phone (optional)" value={form.phone} onChange={set('phone')} />
      <input className="site-input" placeholder="Subject" value={form.subject} onChange={set('subject')} />
      <textarea className="site-input min-h-[140px] sm:col-span-2" placeholder="How can we help? *" required value={form.message} onChange={set('message')} />
      {state.status === 'error' && <p className="text-sm text-rose-500 sm:col-span-2">{state.message}</p>}
      <button className="btn-site-primary sm:col-span-2" disabled={state.status === 'loading'}>
        {state.status === 'loading' ? <Loader2 className="h-4 w-4 animate-spin" /> : <><Send className="h-4 w-4" /> Send message</>}
      </button>
    </form>
  );
}
