'use client';

import { useCallback, useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import {
  Brush, Check, ChevronDown, LayoutPanelTop, Loader2, Megaphone, Monitor, Moon, Newspaper, PanelBottom, RotateCcw, Ruler, Save,
  Smartphone, Sun, Tablet, Type, Wand2,
} from 'lucide-react';
import { api } from '@/lib/api';
import { FONT_OPTIONS, THEME_PRESETS } from '@/lib/theme';
import { useSaveShortcut, useUnsavedWarning } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { ColorInput, Field, PageLoader, Toggle, useConfirm } from '@/components/admin/ui';

const DEVICES = { desktop: [Monitor, '100%'], tablet: [Tablet, '820px'], mobile: [Smartphone, '390px'] };

function Section({ icon: Icon, title, children, defaultOpen }) {
  const [open, setOpen] = useState(!!defaultOpen);
  return (
    <div className="border-b border-ink-100 dark:border-white/5">
      <button onClick={() => setOpen(!open)} className="flex w-full items-center gap-3 px-5 py-4 text-left">
        <span className="grid h-8 w-8 place-items-center rounded-lg bg-brand-50 text-brand-600 dark:bg-brand-500/10"><Icon className="h-4 w-4" /></span>
        <span className="flex-1 font-bold text-ink-900 dark:text-white">{title}</span>
        <ChevronDown className={cn('h-4 w-4 text-ink-400 transition', open && 'rotate-180')} />
      </button>
      {open && <div className="space-y-4 px-5 pb-5">{children}</div>}
    </div>
  );
}

function Segmented({ value, onChange, options }) {
  return (
    <div className="flex rounded-xl bg-ink-100 p-1 dark:bg-white/5">
      {options.map(([v, l]) => (
        <button key={v} type="button" onClick={() => onChange(v)} className={cn('flex-1 rounded-lg px-2 py-1.5 text-xs font-semibold transition', value === v ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-white' : 'text-ink-500')}>{l}</button>
      ))}
    </div>
  );
}

function Range({ value, onChange, min, max, step = 1, unit = 'px' }) {
  return (
    <div className="flex items-center gap-3">
      <input type="range" min={min} max={max} step={step} value={value} onChange={(e) => onChange(Number(e.target.value))} className="flex-1 accent-brand-500" />
      <span className="w-16 rounded-lg bg-ink-100 px-2 py-1 text-center font-mono text-xs dark:bg-white/5">{value}{unit}</span>
    </div>
  );
}

export default function AppearancePage() {
  const confirm = useConfirm();
  const [a, setA] = useState(null);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [device, setDevice] = useState('desktop');
  const [mode, setMode] = useState('light');
  const [path, setPath] = useState('/');
  const frame = useRef();
  useUnsavedWarning(dirty);

  useEffect(() => { api.get('/admin/settings').then((s) => setA(s.appearance)); }, []);

  const push = useCallback(() => {
    if (a) frame.current?.contentWindow?.postMessage({ type: 'nova:appearance', appearance: a, mode }, window.location.origin);
  }, [a, mode]);
  useEffect(() => { push(); }, [push]);
  useEffect(() => {
    const onMsg = (e) => e.origin === window.location.origin && e.data?.type === 'nova:preview-ready' && push();
    window.addEventListener('message', onMsg);
    return () => window.removeEventListener('message', onMsg);
  }, [push]);

  const set = (k) => (v) => { setA((s) => ({ ...s, [k]: v })); setDirty(true); };
  const setNested = (k, sub) => (v) => { setA((s) => ({ ...s, [k]: { ...s[k], [sub]: v } })); setDirty(true); };

  const save = async () => {
    setSaving(true);
    try {
      const s = await api.put('/admin/settings/appearance', a);
      setA(s.appearance);
      setDirty(false);
      toast.success('Theme published — your site is updated');
      // Layout options (header, footer, blog) are server-rendered, so refresh the preview after publishing.
      setTimeout(() => frame.current?.contentWindow?.location.reload(), 900);
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };
  useSaveShortcut(() => a && save());

  const reset = async () => {
    if (!(await confirm({ title: 'Reset theme to defaults?', message: 'All appearance customizations will be lost.', confirmLabel: 'Reset' }))) return;
    const s = await api.post('/admin/settings/appearance/reset');
    setA(s.appearance);
    setDirty(false);
    toast.success('Theme reset');
  };

  if (!a) return <PageLoader />;

  return (
    <div className="flex h-[calc(100vh-4rem)] flex-col lg:flex-row">
      <aside className="flex w-full shrink-0 flex-col border-r border-ink-200/70 bg-white dark:border-white/5 dark:bg-ink-900 lg:w-[380px]">
        <div className="flex items-center gap-2 border-b border-ink-100 px-5 py-3 dark:border-white/5">
          <div className="flex-1">
            <h1 className="font-extrabold text-ink-900 dark:text-white">Theme customizer</h1>
            <p className="text-xs text-ink-400">{dirty ? <span className="font-semibold text-amber-500">● Unpublished changes</span> : 'Live preview — changes apply instantly'}</p>
          </div>
          <button onClick={reset} className="a-btn-ghost a-btn-icon" title="Reset to defaults"><RotateCcw className="h-4 w-4" /></button>
          <button onClick={save} disabled={saving || !dirty} className="a-btn-primary">{saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}Publish</button>
        </div>

        <div className="a-scroll flex-1 overflow-y-auto">
          <Section icon={Wand2} title="Presets" defaultOpen>
            <div className="grid grid-cols-2 gap-2">
              {Object.entries(THEME_PRESETS).map(([key, p]) => (
                <button
                  key={key}
                  onClick={() => { const { label, ...rest } = p; setA((s) => ({ ...s, ...rest, preset: key })); setDirty(true); }} // eslint-disable-line no-unused-vars
                  className={cn('relative overflow-hidden rounded-xl border-2 p-3 text-left transition hover:-translate-y-0.5', a.preset === key ? 'border-brand-500' : 'border-ink-200 dark:border-white/10')}
                  style={{ background: p.backgroundColor }}
                >
                  <div className="mb-2 flex gap-1">
                    {[p.primaryColor, p.accentColor, p.surfaceColor, p.textColor].map((c) => <span key={c} className="h-5 w-5 rounded-full ring-1 ring-black/10" style={{ background: c }} />)}
                  </div>
                  <div className="text-sm font-bold" style={{ color: p.textColor, fontFamily: p.headingFont }}>{p.label}</div>
                  <div className="text-[10px] opacity-60" style={{ color: p.textColor }}>{p.headingFont}</div>
                  {a.preset === key && <span className="absolute right-2 top-2 grid h-5 w-5 place-items-center rounded-full bg-brand-500 text-white"><Check className="h-3 w-3" /></span>}
                </button>
              ))}
            </div>
          </Section>

          <Section icon={Brush} title="Colors">
            <div className="grid grid-cols-2 gap-3">
              <Field label="Primary"><ColorInput value={a.primaryColor} onChange={set('primaryColor')} /></Field>
              <Field label="Accent"><ColorInput value={a.accentColor} onChange={set('accentColor')} /></Field>
            </div>
            <div className="rounded-xl bg-ink-50 p-3 dark:bg-white/5">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-400"><Sun className="h-3.5 w-3.5" />Light mode</div>
              <div className="grid grid-cols-1 gap-2">
                <Field label="Background"><ColorInput value={a.backgroundColor} onChange={set('backgroundColor')} /></Field>
                <Field label="Surface"><ColorInput value={a.surfaceColor} onChange={set('surfaceColor')} /></Field>
                <Field label="Text"><ColorInput value={a.textColor} onChange={set('textColor')} /></Field>
              </div>
            </div>
            <div className="rounded-xl bg-ink-900 p-3 text-white">
              <div className="mb-2 flex items-center gap-1.5 text-xs font-bold uppercase tracking-wider text-ink-400"><Moon className="h-3.5 w-3.5" />Dark mode</div>
              <div className="grid grid-cols-1 gap-2 [&_.a-label]:text-ink-300">
                <Field label="Background"><ColorInput value={a.darkBackgroundColor} onChange={set('darkBackgroundColor')} /></Field>
                <Field label="Surface"><ColorInput value={a.darkSurfaceColor} onChange={set('darkSurfaceColor')} /></Field>
                <Field label="Text"><ColorInput value={a.darkTextColor} onChange={set('darkTextColor')} /></Field>
              </div>
            </div>
            <Field label="Default color mode"><Segmented value={a.colorMode} onChange={set('colorMode')} options={[['light', 'Light'], ['dark', 'Dark'], ['system', 'System']]} /></Field>
          </Section>

          <Section icon={Type} title="Typography">
            <Field label="Heading font">
              <select className="a-input" value={a.headingFont} onChange={(e) => set('headingFont')(e.target.value)}>{FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}</select>
            </Field>
            <Field label="Body font">
              <select className="a-input" value={a.bodyFont} onChange={(e) => set('bodyFont')(e.target.value)}>{FONT_OPTIONS.map((f) => <option key={f}>{f}</option>)}</select>
            </Field>
            <Field label="Base font size"><Range value={a.baseFontSize} onChange={set('baseFontSize')} min={14} max={20} /></Field>
          </Section>

          <Section icon={Ruler} title="Layout & shape">
            <Field label="Corner radius">
              <Range value={a.radius} onChange={set('radius')} min={0} max={32} />
              <div className="mt-2 flex gap-2">{[0, 6, 12, 16, 24].map((r) => <button key={r} onClick={() => set('radius')(r)} className="h-8 flex-1 border-2 border-ink-300 bg-ink-50 dark:border-white/20 dark:bg-white/5" style={{ borderRadius: r }} />)}</div>
            </Field>
            <Field label="Container width"><Range value={a.containerWidth} onChange={set('containerWidth')} min={960} max={1600} step={20} /></Field>
            <Toggle label="Back-to-top button" checked={a.backToTop} onChange={set('backToTop')} />
          </Section>

          <p className="px-5 pt-4 text-xs text-ink-400">Colors, fonts and shape update the preview instantly. Header, footer, blog and announcement options appear after you publish.</p>
          <Section icon={LayoutPanelTop} title="Header">
            <Field label="Style"><Segmented value={a.headerStyle} onChange={set('headerStyle')} options={[['glass', 'Glass'], ['solid', 'Solid'], ['centered', 'Centered']]} /></Field>
            <Toggle label="Sticky header" description="Stays visible while scrolling" checked={a.headerSticky} onChange={set('headerSticky')} />
            <Toggle label="Call-to-action button" checked={a.headerCta?.enabled} onChange={setNested('headerCta', 'enabled')} />
            {a.headerCta?.enabled && (
              <div className="grid grid-cols-2 gap-2">
                <Field label="Label"><input className="a-input" value={a.headerCta.label} onChange={(e) => setNested('headerCta', 'label')(e.target.value)} /></Field>
                <Field label="Link"><input className="a-input" value={a.headerCta.url} onChange={(e) => setNested('headerCta', 'url')(e.target.value)} /></Field>
              </div>
            )}
          </Section>

          <Section icon={Megaphone} title="Announcement bar">
            <Toggle label="Show announcement bar" checked={a.announcement?.enabled} onChange={setNested('announcement', 'enabled')} />
            <Field label="Text"><input className="a-input" value={a.announcement?.text || ''} onChange={(e) => setNested('announcement', 'text')(e.target.value)} /></Field>
            <div className="grid grid-cols-2 gap-2">
              <Field label="Link label"><input className="a-input" value={a.announcement?.linkLabel || ''} onChange={(e) => setNested('announcement', 'linkLabel')(e.target.value)} /></Field>
              <Field label="Link URL"><input className="a-input" value={a.announcement?.url || ''} onChange={(e) => setNested('announcement', 'url')(e.target.value)} /></Field>
            </div>
          </Section>

          <Section icon={Newspaper} title="Blog">
            <Field label="Archive layout"><Segmented value={a.blogLayout} onChange={set('blogLayout')} options={[['grid', 'Grid'], ['list', 'List']]} /></Field>
            <Toggle label="Show author" checked={a.showAuthor} onChange={set('showAuthor')} />
            <Toggle label="Show reading time" checked={a.showReadingTime} onChange={set('showReadingTime')} />
          </Section>

          <Section icon={PanelBottom} title="Footer">
            <Field label="Style"><Segmented value={a.footerStyle} onChange={set('footerStyle')} options={[['columns', 'Columns'], ['simple', 'Simple'], ['big', 'Statement']]} /></Field>
            <Field label="Footer text"><input className="a-input" value={a.footerText} onChange={(e) => set('footerText')(e.target.value)} /></Field>
          </Section>
        </div>
      </aside>

      <div className="flex min-h-[60vh] flex-1 flex-col bg-ink-100 dark:bg-ink-950">
        <div className="flex flex-wrap items-center gap-2 border-b border-ink-200/70 bg-white/60 px-4 py-2 backdrop-blur dark:border-white/5 dark:bg-ink-900/60">
          <select value={path} onChange={(e) => setPath(e.target.value)} className="a-input h-8 w-44 text-xs">
            <option value="/">Home</option><option value="/blog">Blog</option><option value="/about">About</option><option value="/contact">Contact</option><option value="/faq">FAQ</option>
          </select>
          <div className="mx-auto flex gap-1 rounded-xl bg-ink-100 p-1 dark:bg-white/5">
            {Object.entries(DEVICES).map(([k, [Icon]]) => <button key={k} onClick={() => setDevice(k)} className={cn('grid h-7 w-8 place-items-center rounded-lg', device === k ? 'bg-white text-brand-600 shadow-sm dark:bg-ink-800' : 'text-ink-400')}><Icon className="h-4 w-4" /></button>)}
          </div>
          <div className="flex gap-1 rounded-xl bg-ink-100 p-1 dark:bg-white/5">
            <button onClick={() => setMode('light')} className={cn('grid h-7 w-8 place-items-center rounded-lg', mode === 'light' ? 'bg-white text-amber-500 shadow-sm dark:bg-ink-800' : 'text-ink-400')}><Sun className="h-4 w-4" /></button>
            <button onClick={() => setMode('dark')} className={cn('grid h-7 w-8 place-items-center rounded-lg', mode === 'dark' ? 'bg-white text-brand-500 shadow-sm dark:bg-ink-800' : 'text-ink-400')}><Moon className="h-4 w-4" /></button>
          </div>
        </div>
        <div className="flex flex-1 justify-center overflow-hidden p-4">
          <div className="h-full overflow-hidden rounded-2xl border border-ink-200 bg-white shadow-2xl transition-all duration-300 dark:border-white/10" style={{ width: DEVICES[device][1], maxWidth: '100%' }}>
            <iframe ref={frame} src={path} onLoad={push} title="Site preview" className="h-full w-full" />
          </div>
        </div>
      </div>
    </div>
  );
}
