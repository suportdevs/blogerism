'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Check, ExternalLink, Eye, Loader2, Monitor, Palette, Smartphone, Sparkles } from 'lucide-react';
import Link from 'next/link';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { useAuth } from '@/components/admin/AuthProvider';
import { useSiteTheme } from '@/components/admin/SiteTheme';
import { Badge, Modal, PageHeader, PageLoader, Toggle } from '@/components/admin/ui';

const FORMAT_LABELS = { STANDARD: 'Articles', VIDEO: 'Videos', AUDIO: 'Audio', GALLERY: 'Galleries' };
const SERIES_LABELS = { SHOW: 'Shows & seasons', PLAYLIST: 'Playlists', PODCAST: 'Podcasts' };

/* A small CSS wireframe of each theme's layout, painted with its colors. */
function Mockup({ theme, className }) {
  const a = theme.appearance;
  const dark = a.colorMode === 'dark';
  const bg = dark ? a.darkBackgroundColor : a.backgroundColor;
  const surface = dark ? a.darkSurfaceColor : a.surfaceColor;
  const fg = dark ? a.darkTextColor : a.textColor;
  const line = (w, o = 0.18, h = 4) => <div style={{ width: w, height: h, background: fg, opacity: o, borderRadius: 2 }} />;
  const box = (style) => <div style={{ background: surface, borderRadius: Math.min(a.radius, 10) / 2, ...style }} />;
  const header = theme.layout.header;

  return (
    <div className={cn('relative aspect-[16/10] overflow-hidden', className)} style={{ background: bg }}>
      {header === 'masthead' && (
        <div className="space-y-2 px-4 pt-3">
          <div className="flex justify-between">{line('22%', 0.25, 3)}{line('12%', 0.25, 3)}</div>
          <div className="py-1 text-center font-black" style={{ color: fg, fontFamily: a.headingFont, fontSize: 15 }}>{theme.general.siteName}</div>
          <div className="flex gap-2 border-y-2 py-1" style={{ borderColor: fg }}>{[0, 1, 2, 3, 4, 5].map((i) => <div key={i}>{line(18, i === 0 ? 1 : 0.3, 3)}</div>)}</div>
          <div className="flex h-3 items-center gap-2"><span style={{ background: a.primaryColor }} className="h-3 w-10 rounded-sm" />{line('70%', 0.2, 3)}</div>
          <div className="grid grid-cols-[1fr_2fr_1fr] gap-2">
            <div className="space-y-1.5">{box({ height: 26 })}{line('90%')}{box({ height: 26 })}{line('70%')}</div>
            <div className="space-y-1.5">{box({ height: 58 })}{line('95%', 0.6, 5)}{line('70%', 0.6, 5)}</div>
            <div className="space-y-2.5">{[0, 1, 2, 3].map((i) => <div key={i} className="space-y-1">{line('40%', 0.6, 2)}{line('95%')}</div>)}</div>
          </div>
        </div>
      )}
      {header === 'video' && (
        <div className="flex h-full flex-col">
          <div className="flex items-center gap-3 px-3 py-2">
            <span className="h-3 w-3 rounded" style={{ background: a.primaryColor }} />{line(30, 0.5)}
            <div className="mx-auto h-3 w-2/5 rounded-full border" style={{ borderColor: `${fg}30` }} />
          </div>
          <div className="flex flex-1 gap-3 px-3">
            <div className="w-1/6 space-y-2 pt-1">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="flex items-center gap-1.5"><span className="h-2 w-2 rounded-sm" style={{ background: fg, opacity: 0.4 }} />{line('70%', 0.25, 3)}</div>)}</div>
            <div className="flex-1">
              <div className="mb-2 flex gap-1.5">{[0, 1, 2, 3].map((i) => <span key={i} className="h-2.5 w-8 rounded" style={{ background: i ? `${fg}15` : fg }} />)}</div>
              <div className="grid grid-cols-4 gap-2">{Array.from({ length: 8 }).map((_, i) => <div key={i} className="space-y-1">{box({ aspectRatio: '16/9' })}{line('90%', 0.3, 3)}{line('60%', 0.15, 3)}</div>)}</div>
            </div>
          </div>
        </div>
      )}
      {header === 'streaming' && (
        <div className="h-full">
          <div className="absolute inset-x-0 top-0 h-[58%]" style={{ background: `linear-gradient(90deg, ${bg} 15%, transparent), linear-gradient(135deg, ${a.primaryColor}55, ${a.accentColor}33)` }} />
          <div className="relative flex items-center gap-3 px-4 py-2.5">
            <span className="text-[11px] font-black uppercase" style={{ color: a.primaryColor }}>{theme.general.siteName}</span>
            {[0, 1, 2].map((i) => <div key={i}>{line(18, 0.5, 3)}</div>)}
          </div>
          <div className="relative space-y-1.5 px-4 pt-5">
            <div className="text-sm font-black" style={{ color: fg, fontFamily: a.headingFont }}>Featured show</div>
            {line('35%', 0.4)}
            <div className="flex gap-1.5 pt-1"><span className="h-3.5 w-10 rounded-sm bg-white" /><span className="h-3.5 w-10 rounded-sm" style={{ background: `${fg}30` }} /></div>
          </div>
          <div className="absolute inset-x-4 bottom-3 space-y-1.5">
            {line(50, 0.6)}
            <div className="flex gap-1.5">{Array.from({ length: 7 }).map((_, i) => <div key={i} className="flex-1 rounded-sm" style={{ aspectRatio: '2/3', background: `hsl(${i * 47} 45% 35%)` }} />)}</div>
          </div>
        </div>
      )}
      {header === 'portfolio' && (
        <div className="relative h-full px-5 pt-3">
          <div className="absolute -left-6 top-6 h-24 w-24 rounded-full blur-2xl" style={{ background: `${a.primaryColor}66` }} />
          <div className="absolute bottom-0 right-4 h-20 w-20 rounded-full blur-2xl" style={{ background: `${a.accentColor}55` }} />
          <div className="relative mx-auto flex w-3/4 items-center gap-2 rounded-full border px-2 py-1" style={{ borderColor: `${fg}20` }}>
            <span className="h-3 w-3 rounded-full" style={{ background: `linear-gradient(135deg, ${a.primaryColor}, ${a.accentColor})` }} />
            <div className="mx-auto flex gap-2">{[0, 1, 2, 3].map((i) => <div key={i}>{line(14, 0.35, 3)}</div>)}</div>
            <span className="h-3 w-8 rounded-full" style={{ background: `linear-gradient(90deg, ${a.primaryColor}, ${a.accentColor})` }} />
          </div>
          <div className="relative mt-5 grid grid-cols-[1.2fr_1fr] items-center gap-4">
            <div className="space-y-1.5">
              <span className="block h-2 w-14 rounded-full bg-emerald-500/40" />
              <div className="text-sm font-bold leading-tight" style={{ color: fg, fontFamily: a.headingFont }}>{theme.general.siteName}</div>
              <div style={{ width: '70%', height: 5, borderRadius: 2, background: `linear-gradient(90deg, ${a.primaryColor}, ${a.accentColor})` }} />
              {line('90%', 0.2, 3)}{line('75%', 0.2, 3)}
              <div className="flex gap-1.5 pt-1"><span className="h-3 w-10 rounded-full" style={{ background: a.primaryColor }} /><span className="h-3 w-10 rounded-full border" style={{ borderColor: `${fg}30` }} /></div>
            </div>
            <div className="rounded-lg border p-2" style={{ background: '#0d1117', borderColor: '#ffffff20' }}>
              <div className="mb-1.5 flex gap-1"><span className="h-1.5 w-1.5 rounded-full bg-[#ff5f57]" /><span className="h-1.5 w-1.5 rounded-full bg-[#febc2e]" /><span className="h-1.5 w-1.5 rounded-full bg-[#28c840]" /></div>
              {[60, 85, 70, 90, 50].map((w, i) => <div key={i} className="mb-1 h-1 rounded" style={{ width: `${w}%`, background: ['#c084fc', '#7dd3fc', '#6ee7b7', '#7dd3fc', '#fcd34d'][i], opacity: 0.7 }} />)}
            </div>
          </div>
          <div className="relative mt-4 grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <div key={i}>{box({ height: 34, border: `1px solid ${fg}15` })}</div>)}</div>
        </div>
      )}
      {header === 'default' && (
        <div>
          <div className="flex items-center gap-3 px-4 py-2.5">
            <span className="h-3 w-3 rounded" style={{ background: `linear-gradient(135deg, ${a.primaryColor}, ${a.accentColor})` }} />{line(36, 0.5)}
            <div className="mx-auto flex gap-2">{[0, 1, 2, 3].map((i) => <div key={i}>{line(16, 0.3, 3)}</div>)}</div>
            <span className="h-3 w-10 rounded-full" style={{ background: a.primaryColor }} />
          </div>
          <div className="mx-4 mt-1 rounded-lg px-4 py-4 text-center" style={{ background: `linear-gradient(135deg, ${a.primaryColor}22, ${a.accentColor}22)` }}>
            <div className="mx-auto mb-1.5 w-fit">{line(60, 0.8, 6)}</div>
            <div className="mx-auto mb-2 w-fit">{line(90, 0.3, 3)}</div>
            <span className="mx-auto block h-3 w-12 rounded-full" style={{ background: a.primaryColor }} />
          </div>
          <div className={cn('mx-4 mt-3 grid gap-2', theme.layout.listing === 'audio' ? 'grid-cols-4' : 'grid-cols-3')}>
            {Array.from({ length: theme.layout.listing === 'audio' ? 4 : 3 }).map((_, i) => (
              <div key={i} className="space-y-1">{box({ aspectRatio: theme.layout.listing === 'audio' ? '1/1' : '16/10' })}{line('80%', 0.4, 3)}</div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

// Menu definitions from the theme registry lack ids; the site header needs them as React keys.
const withIds = (items, prefix = 'p') => items.map((it, i) => ({ ...it, id: `${prefix}-${i}`, children: withIds(it.children || [], `${prefix}-${i}`) }));

function PreviewModal({ theme, onClose, onActivate }) {
  const frame = useRef();
  const [device, setDevice] = useState('desktop');
  const { data: settings } = useApi('/admin/settings');

  useEffect(() => {
    if (!settings) return undefined;
    const send = () => {
      const w = frame.current?.contentWindow;
      if (!w) return;
      const appearance = { ...settings.appearance, ...theme.appearance };
      const menus = Object.fromEntries(Object.entries(theme.menus).map(([loc, mm]) => [loc, { name: mm.name, items: withIds(mm.items, loc) }]));
      w.postMessage({ type: 'nova:appearance', appearance, mode: theme.appearance.colorMode === 'dark' ? 'dark' : 'light' }, window.location.origin);
      w.postMessage({ type: 'nova:theme', theme: { id: theme.id, layout: theme.layout, features: theme.features }, menus, general: theme.general, appearance }, window.location.origin);
      w.postMessage({ type: 'nova:blocks', blocks: theme.homeBlocks }, window.location.origin);
    };
    const onMsg = (e) => e.origin === window.location.origin && e.data?.type === 'nova:preview-ready' && send();
    window.addEventListener('message', onMsg);
    send();
    return () => window.removeEventListener('message', onMsg);
  }, [settings, theme]);

  return (
    <Modal open onClose={onClose} size="full" title={`Preview: ${theme.name}`} description="Homepage, header and colors of this theme, shown with your current content." footer={<><button className="a-btn-secondary" onClick={onClose}>Close</button><button className="a-btn-primary" onClick={onActivate}><Sparkles className="h-4 w-4" />Activate {theme.name}</button></>}>
      <div className="mb-3 flex justify-center gap-1">
        {[['desktop', Monitor], ['mobile', Smartphone]].map(([k, I]) => (
          <button key={k} onClick={() => setDevice(k)} className={cn('grid h-8 w-10 place-items-center rounded-lg', device === k ? 'bg-brand-500 text-white' : 'bg-ink-100 text-ink-500 dark:bg-white/5')}><I className="h-4 w-4" /></button>
        ))}
      </div>
      <div className="flex justify-center rounded-xl bg-ink-100 p-3 dark:bg-ink-950">
        <iframe ref={frame} src="/preview" title="Theme preview" className="h-[65vh] rounded-lg border border-ink-200 bg-white shadow-xl transition-all dark:border-white/10" style={{ width: device === 'mobile' ? 390 : '100%' }} />
      </div>
    </Modal>
  );
}

function ActivateModal({ theme, onClose, onDone }) {
  const { can } = useAuth();
  const [opts, setOpts] = useState({ appearance: true, setup: true, demo: false });
  const [loading, setLoading] = useState(false);
  const activate = async () => {
    setLoading(true);
    try {
      await api.post(`/admin/themes/${theme.id}/activate`, opts);
      toast.success(`${theme.name} is now your active theme`);
      onDone();
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };
  return (
    <Modal open onClose={onClose} title={`Activate ${theme.name}`} description={theme.category} footer={<><button className="a-btn-secondary" onClick={onClose}>Cancel</button><button className={opts.demo ? 'a-btn-danger' : 'a-btn-primary'} onClick={activate} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{opts.demo ? 'Replace content & activate' : 'Activate theme'}</button></>}>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-ink-200 dark:border-white/10"><Mockup theme={theme} /></div>
        <Toggle label="Apply theme design" description="Colors, fonts, corner radius, header & footer style. Your current customizations are replaced." checked={opts.appearance} onChange={(v) => setOpts({ ...opts, appearance: v })} />
        <Toggle label="Set up homepage, pages & menus" description={`Creates: ${theme.pages.map((p) => p.title).join(', ')} (existing pages with the same URL are kept) and replaces the header & footer menus.`} checked={opts.setup || opts.demo} onChange={(v) => setOpts({ ...opts, setup: v })} />
        {can('settings') && (
          <div className={cn('rounded-xl border p-4 transition', opts.demo ? 'border-rose-300 bg-rose-50 dark:border-rose-500/30 dark:bg-rose-500/10' : 'border-ink-200 dark:border-white/10')}>
            <Toggle label="Import demo content" description="Deletes ALL posts, pages, series, categories, tags, menus, FAQs and testimonials, then installs this theme’s demo content. Users, media, messages and subscribers are kept." checked={opts.demo} onChange={(v) => setOpts({ ...opts, demo: v })} />
            {opts.demo && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-rose-600"><AlertTriangle className="h-4 w-4" />This cannot be undone.</p>}
          </div>
        )}
      </div>
    </Modal>
  );
}

export default function ThemesPage() {
  const { data, reload } = useApi('/admin/themes');
  const { reload: reloadActive } = useSiteTheme();
  const [preview, setPreview] = useState(null);
  const [activating, setActivating] = useState(null);
  if (!data) return <PageLoader />;
  const active = data.items.find((t) => t.id === data.active);
  const others = data.items.filter((t) => t.id !== data.active);

  const features = (t) => [...t.features.formats.map((f) => FORMAT_LABELS[f]), ...t.features.series.map((s) => SERIES_LABELS[s])];

  return (
    <>
      <PageHeader title="Themes" description="Each theme turns the site into a different kind of website — with its own layout, homepage, menus, design and content types." />

      {active && (
        <div className="a-card mb-8 grid overflow-hidden lg:grid-cols-[1.2fr_1fr]">
          <Mockup theme={active} />
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="mb-2 flex items-center gap-2"><Badge color="green" dot>Active theme</Badge><Badge>{active.category}</Badge></div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white">{active.name}</h2>
            <p className="mt-2 text-ink-500">{active.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">{features(active).map((f) => <Badge key={f} color="brand">{f}</Badge>)}</div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/admin/appearance" className="a-btn-primary"><Palette className="h-4 w-4" />Customize</Link>
              <a href="/" target="_blank" rel="noreferrer" className="a-btn-secondary"><ExternalLink className="h-4 w-4" />View site</a>
              <button onClick={() => setActivating(active)} className="a-btn-ghost">Re-apply / import demo</button>
            </div>
          </div>
        </div>
      )}

      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-400">Available themes</h3>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-4">
        {others.map((t) => (
          <div key={t.id} className="a-card group flex flex-col overflow-hidden">
            <div className="relative">
              <Mockup theme={t} className="transition duration-500 group-hover:scale-[1.03]" />
              <div className="absolute inset-0 flex items-center justify-center gap-2 bg-ink-950/50 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
                <button onClick={() => setPreview(t)} className="a-btn bg-white text-ink-900 hover:bg-ink-50"><Eye className="h-4 w-4" />Preview</button>
              </div>
            </div>
            <div className="flex flex-1 flex-col p-5">
              <div className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.category}</div>
              <h3 className="mt-1 text-lg font-extrabold text-ink-900 dark:text-white">{t.name}</h3>
              <p className="mt-1 flex-1 text-sm text-ink-500">{t.description}</p>
              <div className="mt-3 flex flex-wrap gap-1">{features(t).map((f) => <Badge key={f}>{f}</Badge>)}</div>
              <div className="mt-4 flex gap-2">
                <button onClick={() => setPreview(t)} className="a-btn-secondary flex-1"><Eye className="h-4 w-4" />Preview</button>
                <button onClick={() => setActivating(t)} className="a-btn-primary flex-1">Activate</button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {preview && <PreviewModal theme={preview} onClose={() => setPreview(null)} onActivate={() => { setActivating(preview); setPreview(null); }} />}
      {activating && <ActivateModal theme={activating} onClose={() => setActivating(null)} onDone={() => { setActivating(null); reload(); reloadActive(); }} />}
    </>
  );
}
