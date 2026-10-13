'use client';

import { Suspense, useEffect, useState } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';
import { ArrowRight, Eye, EyeOff, Loader2, Lock, Mail, Sparkles } from 'lucide-react';
import { api, tokenStore } from '@/lib/api';
import { EDITION } from '@/lib/edition';

const DEMO = !EDITION.singleTheme; // the builder edition ships demo accounts; exported client projects don't

function LoginForm() {
  const router = useRouter();
  const params = useSearchParams();
  const [email, setEmail] = useState(DEMO ? 'admin@novacms.dev' : '');
  const [password, setPassword] = useState(DEMO ? 'admin123' : '');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const next = params.get('next') || '/admin';

  useEffect(() => { if (tokenStore.get()) router.replace(next); }, [router, next]);

  const onSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const { token } = await api.post('/auth/login', { email, password });
      tokenStore.set(token);
      router.replace(next.startsWith('/admin') ? next : '/admin');
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  return (
    <form onSubmit={onSubmit} className="space-y-4">
      <div>
        <label className="a-label">Email</label>
        <div className="relative">
          <Mail className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input type="email" required value={email} onChange={(e) => setEmail(e.target.value)} className="a-input h-12 pl-10" placeholder="you@company.com" />
        </div>
      </div>
      <div>
        <label className="a-label">Password</label>
        <div className="relative">
          <Lock className="pointer-events-none absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-ink-400" />
          <input type={show ? 'text' : 'password'} required value={password} onChange={(e) => setPassword(e.target.value)} className="a-input h-12 px-10" placeholder="••••••••" />
          <button type="button" onClick={() => setShow(!show)} className="absolute right-3 top-1/2 -translate-y-1/2 text-ink-400 hover:text-ink-600">{show ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}</button>
        </div>
      </div>
      {error && <div className="rounded-xl border border-rose-200 bg-rose-50 px-4 py-3 text-sm font-medium text-rose-600 dark:border-rose-500/20 dark:bg-rose-500/10">{error}</div>}
      <button disabled={loading} className="a-btn-primary h-12 w-full text-[15px]">
        {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <>Sign in <ArrowRight className="h-4 w-4" /></>}
      </button>
    </form>
  );
}

export default function LoginPage() {
  return (
    <div className="grid min-h-screen font-admin lg:grid-cols-2">
      <div className="relative hidden overflow-hidden bg-ink-950 p-12 text-white lg:flex lg:flex-col">
        <div className="absolute -left-32 -top-32 h-[500px] w-[500px] rounded-full bg-brand-500/40 blur-[120px]" />
        <div className="absolute -bottom-40 right-0 h-[400px] w-[400px] rounded-full bg-fuchsia-500/30 blur-[120px]" />
        <div className="absolute inset-0 opacity-[.07] [background-image:linear-gradient(#fff_1px,transparent_1px),linear-gradient(90deg,#fff_1px,transparent_1px)] [background-size:44px_44px]" />
        <div className="relative flex items-center gap-3">
          <span className="grid h-10 w-10 place-items-center rounded-xl bg-gradient-to-br from-brand-400 to-fuchsia-500 text-lg font-black shadow-brand-glow">{EDITION.brand[0]}</span>
          <span className="text-lg font-extrabold">{EDITION.brand}</span>
        </div>
        <div className="relative my-auto max-w-md">
          <span className="mb-6 inline-flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1 text-xs font-semibold backdrop-blur"><Sparkles className="h-3.5 w-3.5 text-brand-300" />Version 1.0</span>
          <h1 className="text-5xl font-extrabold leading-[1.05] tracking-tight">Craft your website, <span className="bg-gradient-to-r from-brand-300 to-fuchsia-300 bg-clip-text text-transparent">block by block.</span></h1>
          <p className="mt-5 text-lg text-ink-300">Visual page builder, theme customizer, media library and team permissions — all in one beautiful dashboard.</p>
          {DEMO && (
            <div className="mt-10 grid grid-cols-3 gap-3">
              {[['6', 'Site themes'], ['30+', 'Block types'], ['15', 'Permissions']].map(([v, l]) => (
                <div key={l} className="rounded-2xl border border-white/10 bg-white/5 p-4 backdrop-blur"><div className="text-2xl font-extrabold">{v}</div><div className="text-xs text-ink-400">{l}</div></div>
              ))}
            </div>
          )}
        </div>
        <p className="relative text-sm text-ink-500">© {new Date().getFullYear()} {EDITION.brand}</p>
      </div>
      <div className="flex items-center justify-center bg-white p-6 dark:bg-ink-900 sm:p-12">
        <div className="w-full max-w-sm">
          <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white">Welcome back 👋</h2>
          <p className="mb-8 mt-2 text-ink-500">Sign in to manage your website.</p>
          <Suspense fallback={null}><LoginForm /></Suspense>
          {DEMO && <div className="mt-8 rounded-xl border border-dashed border-ink-200 p-4 text-xs text-ink-500 dark:border-white/10">
            <b className="text-ink-700 dark:text-ink-200">Demo accounts</b> (password <code>admin123</code>)<br />
            admin@novacms.dev · editor@novacms.dev · author@novacms.dev
          </div>}
        </div>
      </div>
    </div>
  );
}
