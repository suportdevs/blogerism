'use client';

import { useRef, useState } from 'react';
import { toast } from 'sonner';
import { Archive, Check, DatabaseBackup, Download, Loader2, RotateCcw, ShieldCheck, Trash2, Upload, X } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { formatDate, timeAgo } from '@/lib/utils';
import { Badge, Card, EmptyState, PageHeader, PageLoader, useConfirm } from '@/components/admin/ui';

const size = (b) => (b > 1048576 ? `${(b / 1048576).toFixed(1)} MB` : `${Math.max(1, Math.round(b / 1024))} KB`);
const INCLUDED = ['Posts, pages, series, comments & revisions', 'Categories, tags, menus, FAQs & testimonials', 'All settings and the active theme', 'Every theme’s saved content', 'Media library records, redirects', 'Newsletter subscribers & messages'];
const EXCLUDED = ['Users, roles and passwords (never touched)', 'The uploaded files themselves — back up server/uploads too'];

export default function BackupsPage() {
  const confirm = useConfirm();
  const { data, loading, reload } = useApi('/admin/backups');
  const [busy, setBusy] = useState(null);
  const fileRef = useRef();
  const items = data?.items || [];

  const run = async (key, fn) => {
    setBusy(key);
    try { await fn(); } catch (e) { toast.error(e.message); } finally { setBusy(null); }
  };

  const create = () => run('create', async () => {
    const b = await api.post('/admin/backups');
    toast.success(`Backup created (${size(b.size)})`);
    reload();
  });

  const upload = (file) => run('upload', async () => {
    const fd = new FormData();
    fd.append('file', file);
    await api.upload('/admin/backups/upload', fd);
    toast.success('Backup uploaded — restore it from the list when you are ready');
    reload();
  });

  const restore = async (b) => {
    const ok = await confirm({
      title: `Restore the backup from ${formatDate(b.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}?`,
      message: 'All current content and settings are replaced with this backup. A safety backup of the current site is created first, so you can undo this.',
      confirmLabel: 'Restore backup',
    });
    if (!ok) return;
    await run(b.name, async () => {
      const r = await api.post(`/admin/backups/${b.name}/restore`);
      toast.success(`Backup restored. Safety copy saved as ${r.safety.name}`);
      setTimeout(() => window.location.reload(), 900); // the theme and menus may have changed
    });
  };

  const remove = async (b) => {
    if (!(await confirm({ title: 'Delete this backup?', message: `${b.name} is removed from the server.` }))) return;
    await run(b.name, async () => {
      await api.del(`/admin/backups/${b.name}`);
      toast.success('Backup deleted');
      reload();
    });
  };

  return (
    <>
      <PageHeader
        title="Backup & restore"
        description="Save a copy of the whole site’s content and settings, download it, or roll back to an earlier copy."
        actions={(
          <>
            <input ref={fileRef} type="file" accept="application/json,.json" className="hidden" onChange={(e) => { if (e.target.files[0]) upload(e.target.files[0]); e.target.value = ''; }} />
            <button onClick={() => fileRef.current.click()} disabled={!!busy} className="a-btn-secondary">{busy === 'upload' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Upload className="h-4 w-4" />}Upload backup</button>
            <button onClick={create} disabled={!!busy} className="a-btn-primary">{busy === 'create' ? <Loader2 className="h-4 w-4 animate-spin" /> : <DatabaseBackup className="h-4 w-4" />}Create backup</button>
          </>
        )}
      />

      <div className="grid gap-6 xl:grid-cols-[1fr_320px]">
        <div className="a-card overflow-hidden">
          {loading && !data ? <PageLoader /> : !items.length ? (
            <EmptyState icon={Archive} title="No backups yet" description="Create one before big changes — switching themes, importing content or bulk edits." action={<button onClick={create} className="a-btn-primary"><DatabaseBackup className="h-4 w-4" />Create first backup</button>} />
          ) : (
            <div className="a-scroll overflow-x-auto">
              <table className="a-table min-w-[720px]">
                <thead><tr><th>Backup</th><th>Contents</th><th>Size</th><th className="w-56" /></tr></thead>
                <tbody>
                  {items.map((b) => (
                    <tr key={b.name}>
                      <td>
                        <div className="flex items-center gap-2 font-semibold text-ink-900 dark:text-white">
                          {formatDate(b.createdAt, { dateStyle: 'medium', timeStyle: 'short' })}
                          {b.auto && <Badge color="amber">Safety copy</Badge>}
                          {b.uploaded && <Badge color="blue">Uploaded</Badge>}
                          {b.invalid && <Badge color="red">Unreadable</Badge>}
                        </div>
                        <div className="text-xs text-ink-400">{timeAgo(b.createdAt)}{b.siteName ? ` · ${b.siteName}` : ''}{b.theme ? ` · ${b.theme} theme` : ''}</div>
                      </td>
                      <td className="text-xs text-ink-500">{b.counts ? `${b.counts.posts} posts · ${b.counts.pages} pages · ${b.counts.media} media · ${b.counts.themes} theme workspaces` : '—'}</td>
                      <td className="text-xs">{size(b.size)}</td>
                      <td>
                        <div className="flex justify-end gap-1">
                          <button onClick={() => api.download(`/admin/backups/${b.name}/download`, b.name).catch((e) => toast.error(e.message))} className="a-btn-ghost a-btn-icon h-8 w-8" title="Download"><Download className="h-4 w-4" /></button>
                          <button onClick={() => restore(b)} disabled={!!busy || b.invalid} className="a-btn-secondary h-8 text-xs">{busy === b.name ? <Loader2 className="h-3.5 w-3.5 animate-spin" /> : <RotateCcw className="h-3.5 w-3.5" />}Restore</button>
                          <button onClick={() => remove(b)} disabled={!!busy} className="a-btn-ghost a-btn-icon h-8 w-8 text-rose-500" title="Delete"><Trash2 className="h-4 w-4" /></button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        <Card title="What’s in a backup" actions={<ShieldCheck className="h-4 w-4 text-emerald-500" />}>
          <ul className="space-y-2 text-sm">
            {INCLUDED.map((t) => <li key={t} className="flex gap-2"><Check className="mt-0.5 h-4 w-4 shrink-0 text-emerald-500" />{t}</li>)}
            {EXCLUDED.map((t) => <li key={t} className="flex gap-2 text-ink-500"><X className="mt-0.5 h-4 w-4 shrink-0 text-ink-300" />{t}</li>)}
          </ul>
          <p className="mt-4 rounded-xl bg-ink-50 p-3 text-xs text-ink-500 dark:bg-white/5">Backups are stored on the server in <code>server/backups</code>. Download important ones and keep them somewhere safe.</p>
        </Card>
      </div>
    </>
  );
}
