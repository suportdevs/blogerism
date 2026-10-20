'use client';

import { Suspense, useEffect, useMemo, useRef, useState } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { toast } from 'sonner';
import { AlertTriangle, Check, Languages, Loader2, Pencil, Save, Sparkles, Square } from 'lucide-react';
import { api } from '@/lib/api';
import { cn } from '@/lib/utils';
import RichEditor from '@/components/admin/RichEditor';
import { Badge, EmptyState, Modal, PageHeader, PageLoader, SearchInput, Tabs, useConfirm } from '@/components/admin/ui';

const TYPES = [
  ['page', 'Pages'], ['post', 'Posts'], ['menuItem', 'Menus'], ['category', 'Categories'], ['tag', 'Tags'], ['series', 'Series'],
  ['faq', 'FAQs'], ['testimonial', 'Testimonials'], ['settings', 'Site text'], ['ui', 'Interface'],
];
const pct = (p) => (p?.total ? Math.round((p.done / p.total) * 100) : 100);
const label = (key) => key
  .replace(/^blocks\.[^.]+\./, '').replace(/\.(\d+)\./g, ' $1 · ').replace(/\./g, ' · ')
  .replace(/([a-z])([A-Z])/g, '$1 $2').replace(/^./, (c) => c.toUpperCase());

function Progress({ p }) {
  const v = pct(p);
  return (
    <div className="flex items-center gap-3">
      <div className="h-1.5 w-28 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10"><div className={cn('h-full rounded-full', v === 100 ? 'bg-emerald-500' : 'bg-brand-500')} style={{ width: `${v}%` }} /></div>
      <span className="w-20 text-xs tabular-nums text-ink-500">{p?.done ?? 0} / {p?.total ?? 0}</span>
      {p?.outdated > 0 && <Badge color="amber">{p.outdated} outdated</Badge>}
    </div>
  );
}

function Editor({ item, entity, locale, language, aiReady, onClose, onSaved }) {
  const [data, setData] = useState(null);
  const [texts, setTexts] = useState({});
  const [busy, setBusy] = useState('');
  const [dirty, setDirty] = useState(false);
  const confirm = useConfirm();

  useEffect(() => {
    api.get(`/admin/translations/${entity}/${item.id}/${locale}`).then((d) => { setData(d); setTexts(Object.fromEntries(d.segments.map((s) => [s.key, s.text]))); }).catch((e) => toast.error(e.message));
  }, [entity, item.id, locale]);

  const ai = async (mode) => {
    setBusy(mode);
    try {
      const r = await api.post(`/admin/translations/${entity}/${item.id}/${locale}/ai`, { mode });
      setTexts((t) => ({ ...t, ...r.texts }));
      setData((d) => ({ ...d, segments: d.segments.map((s) => (r.texts[s.key] ? { ...s, outdated: false } : s)) }));
      setDirty(true);
      toast.success(r.translated ? `${r.translated} segment(s) translated — review and save` : 'Nothing left to translate');
    } catch (e) {
      toast.error(e.message, { duration: 8000 });
    } finally {
      setBusy('');
    }
  };
  const save = async () => {
    setBusy('save');
    try {
      await api.put(`/admin/translations/${entity}/${item.id}/${locale}`, { texts });
      toast.success('Translation saved');
      setDirty(false);
      onSaved();
    } catch (e) {
      toast.error(e.message);
    } finally {
      setBusy('');
    }
  };
  const close = async () => {
    if (dirty && !(await confirm({ title: 'Discard unsaved translation?', confirmLabel: 'Discard' }))) return;
    onClose();
  };

  return (
    <Modal
      open
      size="full"
      onClose={close}
      title={`${data?.title || item.title} → ${language?.native || locale}`}
      description="Left: the original. Right: the translation. Empty fields show the original on the site."
      footer={(
        <div className="flex w-full flex-wrap items-center gap-2">
          {aiReady ? (
            <>
              <button className="a-btn-secondary" disabled={!!busy || !data} onClick={() => ai('missing')}>{busy === 'missing' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4 text-brand-500" />}AI: fill missing & outdated</button>
              <button className="a-btn-ghost" disabled={!!busy || !data} onClick={() => ai('all')}>{busy === 'all' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Sparkles className="h-4 w-4" />}Re-translate everything</button>
            </>
          ) : <Link href="/admin/settings?tab=i18n" className="text-xs text-ink-500 underline">Add an Anthropic API key to translate with AI</Link>}
          <div className="ml-auto flex gap-2">
            <button className="a-btn-secondary" onClick={close}>Close</button>
            <button className="a-btn-primary" disabled={!!busy || !data} onClick={save}>{busy === 'save' ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Save translation</button>
          </div>
        </div>
      )}
    >
      {!data ? <div className="grid h-40 place-items-center"><Loader2 className="h-5 w-5 animate-spin text-ink-400" /></div> : !data.segments.length ? (
        <EmptyState icon={Languages} title="Nothing to translate" description="This item has no text yet." />
      ) : (
        <div className="space-y-4" dir="auto">
          {data.segments.map((s) => {
            const long = s.html && s.source.length > 280;
            return (
              <div key={s.key} className="grid gap-3 rounded-xl border border-ink-100 p-4 dark:border-white/5 lg:grid-cols-2">
                <div className="min-w-0">
                  <div className="mb-1.5 flex items-center gap-2 text-[11px] font-bold uppercase tracking-wider text-ink-400">{label(s.key)}{s.outdated && <Badge color="amber"><AlertTriangle className="h-3 w-3" />Original changed</Badge>}</div>
                  {s.html ? <div className="prose prose-sm max-h-72 max-w-none overflow-y-auto rounded-lg bg-ink-50 p-3 dark:prose-invert dark:bg-white/5" dangerouslySetInnerHTML={{ __html: s.source }} /> : <div className="whitespace-pre-wrap rounded-lg bg-ink-50 p-3 text-sm text-ink-700 dark:bg-white/5 dark:text-ink-200">{s.source}</div>}
                </div>
                <div className="min-w-0" lang={locale} dir={language?.dir || 'auto'}>
                  <div className="mb-1.5 text-[11px] font-bold uppercase tracking-wider text-ink-400">{language?.native || locale}</div>
                  {long ? (
                    <RichEditor minimal value={texts[s.key] || ''} onChange={(v) => { setTexts((t) => ({ ...t, [s.key]: v })); setDirty(true); }} placeholder="Translation…" stickyClass="top-0" />
                  ) : !s.html && s.source.length <= 90 && !s.source.includes('\n') ? (
                    <input className="a-input" value={texts[s.key] || ''} placeholder={s.source} onChange={(e) => { setTexts((t) => ({ ...t, [s.key]: e.target.value })); setDirty(true); }} />
                  ) : (
                    <textarea className="a-textarea" rows={Math.min(8, Math.max(1, Math.ceil(s.source.length / 70)))} value={texts[s.key] || ''} placeholder={s.source.slice(0, 120)}
                      onChange={(e) => { setTexts((t) => ({ ...t, [s.key]: e.target.value })); setDirty(true); }} />
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Modal>
  );
}

function TranslationsInner() {
  const search = useSearchParams();
  const confirm = useConfirm();
  const [data, setData] = useState(null);
  const [type, setType] = useState(search.get('type') || 'page');
  const [locale, setLocale] = useState('');
  const [q, setQ] = useState('');
  const [editing, setEditing] = useState(null);
  const [bulk, setBulk] = useState(null); // { done, total, failed, running }
  const stopRef = useRef(false);

  const load = () => api.get('/admin/translations/overview').then((d) => { setData(d); setLocale((l) => l || search.get('locale') || d.locales[0] || ''); }).catch((e) => toast.error(e.message));
  useEffect(() => { load(); }, []); // eslint-disable-line react-hooks/exhaustive-deps
  useEffect(() => {
    const id = search.get('id');
    if (id && data) {
      const it = data.items[type]?.find((x) => String(x.id) === id);
      if (it) setEditing(it);
    }
  }, [data]); // eslint-disable-line react-hooks/exhaustive-deps

  const items = useMemo(() => (data?.items[type] || []).filter((i) => !q || i.title?.toLowerCase().includes(q.toLowerCase())), [data, type, q]);
  if (!data) return <PageLoader />;
  const language = data.languages.find((l) => l.code === locale);

  if (!data.locales.length) {
    return (
      <>
        <PageHeader title="Translations" description="Translate your pages, posts and menus into other languages." />
        <div className="a-card"><EmptyState icon={Languages} title="Add a second language first" description="Turn on multiple languages and choose which ones your site offers." action={<Link href="/admin/settings?tab=i18n" className="a-btn-primary">Open language settings</Link>} /></div>
      </>
    );
  }

  const missing = items.filter((i) => pct(i.status[locale]) < 100 || i.status[locale]?.outdated);
  const translateAll = async () => {
    if (!(await confirm({ title: `Translate ${missing.length} item(s) to ${language?.native} with AI?`, message: 'Missing and outdated text is translated and saved right away. You can review and edit everything afterwards. This uses your Anthropic API credits.', confirmLabel: 'Translate with AI' }))) return;
    stopRef.current = false;
    setBulk({ done: 0, total: missing.length, failed: 0, running: true });
    let failed = 0;
    for (let i = 0; i < missing.length; i++) {
      if (stopRef.current) break;
      try {
        await api.post(`/admin/translations/${type}/${missing[i].id}/${locale}/ai`, { mode: 'missing', save: true });
      } catch (e) {
        failed++;
        if (/API key|not valid|rate limit/i.test(e.message)) { toast.error(e.message); break; }
      }
      setBulk({ done: i + 1, total: missing.length, failed, running: true });
    }
    setBulk((b) => ({ ...b, running: false }));
    toast.success(failed ? `Done — ${failed} item(s) could not be translated` : 'All done');
    load();
  };

  return (
    <>
      <PageHeader
        title="Translations"
        description="Translate pages, posts, menus and site text. Untranslated text falls back to the original language."
        actions={(
          <>
            {data.locales.length > 1 && (
              <select className="a-input w-48" value={locale} onChange={(e) => setLocale(e.target.value)}>
                {data.locales.map((c) => <option key={c} value={c}>{data.languages.find((l) => l.code === c)?.native} ({c})</option>)}
              </select>
            )}
            {data.aiReady && missing.length > 0 && (
              bulk?.running
                ? <button className="a-btn-secondary" onClick={() => { stopRef.current = true; }}><Square className="h-4 w-4" />Stop ({bulk.done}/{bulk.total})</button>
                : <button className="a-btn-primary" onClick={translateAll}><Sparkles className="h-4 w-4" />AI-translate {missing.length} missing</button>
            )}
          </>
        )}
      />

      <div className="mb-5 grid gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {TYPES.map(([key, name]) => {
          const s = data.summary[key]?.[locale];
          if (!s?.items) return null;
          return (
            <button key={key} onClick={() => setType(key)} className={cn('a-card p-4 text-left transition hover:-translate-y-0.5', type === key && 'ring-2 ring-brand-400/60')}>
              <div className="text-xs font-bold uppercase tracking-wider text-ink-400">{name}</div>
              <div className="mt-1 text-xl font-extrabold text-ink-900 dark:text-white">{s.complete}<span className="text-sm font-semibold text-ink-400"> / {s.items}</span></div>
              <div className="mt-2 h-1 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10"><div className="h-full bg-emerald-500" style={{ width: `${Math.round((s.complete / s.items) * 100)}%` }} /></div>
              {s.outdated > 0 && <div className="mt-1.5 text-[11px] font-semibold text-amber-600">{s.outdated} outdated</div>}
            </button>
          );
        })}
      </div>

      {bulk && (
        <div className="a-card mb-5 flex items-center gap-4 p-4">
          {bulk.running ? <Loader2 className="h-5 w-5 animate-spin text-brand-500" /> : <Check className="h-5 w-5 text-emerald-500" />}
          <div className="flex-1">
            <div className="text-sm font-semibold">{bulk.running ? 'Translating with AI…' : 'Finished'} {bulk.done} / {bulk.total}{bulk.failed ? ` · ${bulk.failed} failed` : ''}</div>
            <div className="mt-2 h-1.5 overflow-hidden rounded-full bg-ink-100 dark:bg-white/10"><div className="h-full bg-brand-500 transition-all" style={{ width: `${(bulk.done / Math.max(1, bulk.total)) * 100}%` }} /></div>
          </div>
          {!bulk.running && <button className="a-btn-ghost" onClick={() => setBulk(null)}>Dismiss</button>}
        </div>
      )}

      <div className="a-card overflow-hidden">
        <div className="flex flex-wrap items-center gap-3 border-b border-ink-100 p-4 dark:border-white/5">
          <Tabs value={type} onChange={setType} tabs={TYPES.filter(([k]) => data.items[k]?.length).map(([k, n]) => ({ value: k, label: n, count: data.items[k].length }))} />
          <SearchInput value={q} onChange={setQ} placeholder="Filter…" className="ml-auto w-56" />
        </div>
        <div className="a-scroll overflow-x-auto">
          <table className="a-table min-w-[720px]">
            <thead><tr><th>Item</th><th>{language?.native || locale}</th><th className="w-32" /></tr></thead>
            <tbody>
              {items.map((it) => (
                <tr key={it.id}>
                  <td>
                    <button onClick={() => setEditing(it)} className="text-left font-semibold text-ink-900 hover:text-brand-600 dark:text-white">{it.title || '(untitled)'}</button>
                    {it.group && <div className="text-xs text-ink-400">{it.group}</div>}
                  </td>
                  <td><Progress p={it.status[locale]} /></td>
                  <td><button onClick={() => setEditing(it)} className="a-btn-secondary h-8 text-xs"><Pencil className="h-3.5 w-3.5" />Translate</button></td>
                </tr>
              ))}
            </tbody>
          </table>
          {!items.length && <EmptyState icon={Languages} title="Nothing here" description="No items of this type yet." />}
        </div>
      </div>

      {editing && <Editor item={editing} entity={type} locale={locale} language={language} aiReady={data.aiReady} onClose={() => setEditing(null)} onSaved={load} />}
    </>
  );
}

export default function TranslationsPage() {
  return <Suspense fallback={null}><TranslationsInner /></Suspense>;
}
