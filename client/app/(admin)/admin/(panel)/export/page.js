'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { toast } from 'sonner';
import { Boxes, CheckCircle2, Container, Download, FileCode2, KeyRound, Loader2, PackageOpen, Server, Settings2 } from 'lucide-react';
import { API_URL, tokenStore } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { useAuth } from '@/components/admin/AuthProvider';
import { Badge, Card, Field, PageHeader, PageLoader, Toggle } from '@/components/admin/ui';

const INCLUDED = [
  [FileCode2, 'Full source code', 'Express API + Next.js site & admin, locked to the active theme — other themes are removed.'],
  [Boxes, 'This site’s content', 'Pages, posts, series, menus, categories, settings and design as a snapshot that installs on first start.'],
  [PackageOpen, 'Media files in use', 'Only uploads referenced by the content are included.'],
  [Container, 'Docker setup', 'docker-compose.yml with PostgreSQL, API and website — one command to run.'],
  [Server, 'VPS setup', 'PM2 process file and an Nginx reverse-proxy config.'],
  [KeyRound, 'Ready-made config', '.env files with fresh secrets, your URLs and the client’s admin account.'],
];

export default function ExportPage() {
  const { user } = useAuth();
  const { data } = useApi('/admin/system/export/summary');
  const [form, setForm] = useState({ name: '', siteUrl: 'https://', apiUrl: 'https://', adminName: '', adminEmail: '', adminPassword: '', includeMessages: false, includeUsers: false });
  const [loading, setLoading] = useState(false);
  const [done, setDone] = useState(null);
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  useEffect(() => {
    if (data && !form.name) setForm((f) => ({ ...f, name: data.siteName || '', adminEmail: user?.email || '' }));
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  // Suggest api.<domain> once a site URL is typed.
  const onSiteUrl = (v) => {
    setForm((f) => {
      const next = { ...f, siteUrl: v };
      const host = v.replace(/^https?:\/\//, '').replace(/\/.*$/, '');
      if (host && (f.apiUrl === 'https://' || f.apiUrl.startsWith('https://api.'))) next.apiUrl = `https://api.${host.replace(/^www\./, '')}`;
      return next;
    });
  };

  const download = async (e) => {
    e.preventDefault();
    setLoading(true);
    setDone(null);
    try {
      const res = await fetch(`${API_URL}/api/admin/system/export`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${tokenStore.get()}` },
        body: JSON.stringify(form),
      });
      if (!res.ok) throw new Error((await res.json().catch(() => ({}))).message || 'Export failed');
      const blob = await res.blob();
      const name = res.headers.get('Content-Disposition')?.match(/filename="(.+)"/)?.[1] || 'project.zip';
      const a = document.createElement('a');
      a.href = URL.createObjectURL(blob);
      a.download = name;
      a.click();
      URL.revokeObjectURL(a.href);
      setDone({ name, size: blob.size });
      toast.success('Project exported');
    } catch (err) {
      toast.error(err.message);
    } finally {
      setLoading(false);
    }
  };

  if (!data) return <PageLoader />;
  if (!data.enabled) return <Card><p className="text-sm text-ink-500">Project export is disabled on this installation.</p></Card>;
  const c = data.counts;

  return (
    <>
      <PageHeader
        title="Export project"
        description="Download a standalone, production-ready copy of this website for your client — only the active theme and its content."
      />
      <div className="grid items-start gap-6 xl:grid-cols-[1fr_400px]">
        <form onSubmit={download} className="space-y-6">
          <Card title="What will be exported" description="Switch the theme or edit content first if needed — the export uses the current state of this site.">
            <div className="mb-5 flex flex-wrap items-center gap-3 rounded-xl bg-brand-50 p-4 dark:bg-brand-500/10">
              <div className="flex-1">
                <div className="text-xs font-bold uppercase tracking-wider text-brand-600">Theme</div>
                <div className="text-lg font-extrabold text-ink-900 dark:text-white">{data.theme.name} <span className="text-sm font-semibold text-ink-500">· {data.theme.category}</span></div>
              </div>
              <Link href="/admin/themes" className="a-btn-secondary h-8 text-xs"><Settings2 className="h-3.5 w-3.5" />Change theme</Link>
            </div>
            <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
              {[['Pages', c.pages], ['Posts', c.posts], ['Series', c.series], ['Categories', c.categories], ['Menus', c.menus], ['Team members', c.users], ['Media files', c.mediaFiles]].map(([label, n]) => (
                <div key={label} className="rounded-xl border border-ink-200 p-3 dark:border-white/10">
                  <div className="text-2xl font-extrabold text-ink-900 dark:text-white">{n}</div>
                  <div className="text-xs text-ink-400">{label}</div>
                </div>
              ))}
            </div>
          </Card>

          <Card title="Client project settings">
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Project name" required hint="Used for the folder, packages and admin branding." className="sm:col-span-2">
                <input className="a-input" required value={form.name} onChange={(e) => set('name')(e.target.value)} placeholder="Acme News" />
              </Field>
              <Field label="Website URL" required hint="Where the client will host the site.">
                <input className="a-input" required type="url" value={form.siteUrl} onChange={(e) => onSiteUrl(e.target.value)} placeholder="https://example.com" />
              </Field>
              <Field label="API URL" required hint="Usually a subdomain, e.g. https://api.example.com">
                <input className="a-input" required type="url" value={form.apiUrl} onChange={(e) => set('apiUrl')(e.target.value)} />
              </Field>
              <Field label="Client admin name" hint="Shown as the author of existing posts unless team members are included." className="sm:col-span-2">
                <input className="a-input" value={form.adminName} onChange={(e) => set('adminName')(e.target.value)} placeholder="Newsroom" />
              </Field>
              <Field label="Client admin email" required>
                <input className="a-input" required type="email" value={form.adminEmail} onChange={(e) => set('adminEmail')(e.target.value)} />
              </Field>
              <Field label="Client admin password" required hint="Min. 8 characters — stored in the project’s server/.env.">
                <input className="a-input" required minLength={8} type="text" autoComplete="off" value={form.adminPassword} onChange={(e) => set('adminPassword')(e.target.value)} />
              </Field>
              <Toggle className="sm:col-span-2" label="Include team members" description="Exports this site’s users (without passwords) and keeps them as post authors. Off: all posts are assigned to the client admin." checked={form.includeUsers} onChange={set('includeUsers')} />
              <Toggle className="sm:col-span-2" label="Include messages & newsletter subscribers" description="Contact form submissions and subscriber emails from this site." checked={form.includeMessages} onChange={set('includeMessages')} />
            </div>
          </Card>

          <button className="a-btn-primary h-12 w-full text-base" disabled={loading}>
            {loading ? <><Loader2 className="h-5 w-5 animate-spin" />Packaging project…</> : <><Download className="h-5 w-5" />Download production-ready project (.zip)</>}
          </button>
          {done && (
            <div className="flex items-center gap-3 rounded-xl border border-emerald-200 bg-emerald-50 p-4 text-sm text-emerald-800 dark:border-emerald-500/20 dark:bg-emerald-500/10 dark:text-emerald-300">
              <CheckCircle2 className="h-5 w-5 shrink-0" />
              <span><b>{done.name}</b> ({(done.size / 1048576).toFixed(1)} MB) downloaded. Unzip it and run <code className="rounded bg-white/60 px-1 dark:bg-black/30">docker compose up -d --build</code> — full instructions are in its README.md.</span>
            </div>
          )}
        </form>

        <Card title="Inside the ZIP">
          <ul className="space-y-4">
            {INCLUDED.map(([Icon, title, text]) => (
              <li key={title} className="flex gap-3">
                <span className="grid h-9 w-9 shrink-0 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10"><Icon className="h-4 w-4" /></span>
                <div><div className="text-sm font-bold text-ink-900 dark:text-white">{title}</div><div className="text-xs text-ink-500">{text}</div></div>
              </li>
            ))}
          </ul>
          <div className="mt-5 rounded-xl bg-ink-50 p-4 text-xs text-ink-500 dark:bg-white/5">
            <Badge color="amber" className="mb-2">Note</Badge>
            <p>Passwords are never exported — only the client admin account above can sign in at first. Your builder project is not changed by exporting.</p>
          </div>
        </Card>
      </div>
    </>
  );
}
