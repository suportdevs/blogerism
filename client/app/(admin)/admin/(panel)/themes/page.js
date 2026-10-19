'use client';

import { useEffect, useRef, useState } from 'react';
import { toast } from 'sonner';
import { AlertTriangle, Check, Crown, ExternalLink, Eye, Loader2, Monitor, Palette, Smartphone, Sparkles } from 'lucide-react';
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
      {header === 'luxe' && (
        <div className="relative h-full" style={{ color: fg }}>
          <div className="absolute inset-2 border" style={{ borderColor: `${a.primaryColor}55` }} />
          <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-5 pt-4">
            <div className="flex flex-col gap-[3px]"><span className="h-px w-4" style={{ background: fg }} /><span className="h-px w-2.5" style={{ background: fg }} /></div>
            <span className="text-[9px] uppercase tracking-[0.35em]" style={{ fontFamily: a.headingFont }}>{theme.general.siteName}</span>
            <span className="justify-self-end border-b text-[6px] uppercase tracking-[0.3em]" style={{ borderColor: fg }}>{a.headerCta?.label || 'Enquire'}</span>
          </div>
          <div className="relative mx-5 mt-2 flex justify-center gap-3 border-t pt-1.5" style={{ borderColor: `${fg}20` }}>{[0, 1, 2, 3].map((i) => <span key={i} className="h-px w-5" style={{ background: `${fg}55` }} />)}</div>
          <div className="relative mt-5 text-center">
            <div className="flex items-center justify-center gap-2 text-[6px] uppercase tracking-[0.4em]" style={{ color: a.primaryColor }}><span className="h-px w-4" style={{ background: a.primaryColor }} />Est. 2019<span className="h-px w-4" style={{ background: a.primaryColor }} /></div>
            <div className="mt-1.5 text-xl leading-none" style={{ fontFamily: a.headingFont }}>Timeless</div>
            <div className="text-xl italic leading-tight" style={{ fontFamily: a.headingFont, color: a.primaryColor }}>by design</div>
            <span className="mx-auto mt-3 block h-3.5 w-16 border" style={{ borderColor: `${fg}60` }} />
          </div>
          <div className="absolute inset-x-6 bottom-4 grid grid-cols-[1.4fr_1fr] gap-3">
            {box({ height: 34 })}
            <div className="space-y-1.5 pt-1">{[0, 1, 2].map((i) => <div key={i} className="flex items-center gap-1.5"><span className="text-[7px] italic" style={{ color: a.primaryColor }}>0{i + 1}</span>{line('80%', 0.3, 2)}</div>)}</div>
          </div>
        </div>
      )}
      {header === 'overlay' && (
        <div className="h-full">
          <div className="relative h-[58%] overflow-hidden" style={{ background: `linear-gradient(135deg, ${a.primaryColor}, ${a.accentColor} 60%, #1f140c)` }}>
            <div className="absolute inset-0 bg-black/25" />
            <div className="relative grid grid-cols-[1fr_auto_1fr] items-center px-4 py-2.5 text-white">
              <div className="flex gap-2">{[0, 1].map((i) => <span key={i} className="h-[3px] w-6 rounded bg-white/70" />)}</div>
              <span className="text-xs font-semibold italic" style={{ fontFamily: a.headingFont }}>{theme.general.siteName}</span>
              <div className="flex justify-end gap-2"><span className="h-[3px] w-6 rounded bg-white/70" /><span className="h-3 w-10 rounded-full border border-white/70" /></div>
            </div>
            <div className="relative mt-3 text-center text-white">
              <div className="text-sm font-semibold" style={{ fontFamily: a.headingFont }}>A taste of the season</div>
              <span className="mx-auto mt-2 block h-3 w-14 rounded-full border border-white/70" />
            </div>
          </div>
          <div className="mx-5 mt-3 grid grid-cols-2 gap-x-4 gap-y-2">
            {[0, 1, 2, 3].map((i) => (
              <div key={i} className="flex items-center gap-1.5">
                <span className="h-4 w-4 shrink-0 rounded-full" style={{ background: `${a.primaryColor}55` }} />
                {line('40%', 0.5, 3)}<span className="h-px flex-1 border-b border-dotted" style={{ borderColor: `${fg}40` }} /><span className="h-[3px] w-4 rounded" style={{ background: a.primaryColor }} />
              </div>
            ))}
          </div>
        </div>
      )}
      {header === 'minimal' && (
        <div className="relative h-full">
          <div className="absolute inset-0 grid grid-cols-3 gap-1 p-1 opacity-90">
            {['#3b3a36', '#5c544a', '#2a2f35', '#6b5e4e', '#23272b', '#4a4640'].map((c, i) => <div key={i} className={cn('rounded-sm', i === 0 && 'row-span-2')} style={{ background: `linear-gradient(160deg, ${c}, #111)` }} />)}
          </div>
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-black/40" />
          <div className="relative flex items-center justify-between px-4 py-2.5 text-white">
            <span className="text-[8px] font-semibold uppercase tracking-[0.3em]">{theme.general.siteName}</span>
            <div className="flex gap-2.5">{[0, 1, 2].map((i) => <span key={i} className="h-[2px] w-5 bg-white/60" />)}</div>
          </div>
          <div className="absolute bottom-4 left-4 text-white">
            <div className="text-lg leading-none" style={{ fontFamily: a.headingFont }}>Light, story & feeling</div>
            <div className="mt-2 flex gap-1">{[0, 1, 2].map((i) => <span key={i} className={cn('h-[2px] w-6', i ? 'bg-white/30' : 'bg-white')} />)}</div>
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
      {header === 'corporate' && (
        <div>
          <div className="flex h-3 items-center justify-between px-4" style={{ background: a.primaryColor }}>
            <div className="flex gap-2">{[0, 1, 2].map((i) => <span key={i} className="h-[2px] w-8 rounded bg-white/70" />)}</div>
            <div className="flex gap-1">{[0, 1, 2].map((i) => <span key={i} className="h-1.5 w-1.5 rounded-full bg-white/70" />)}</div>
          </div>
          <div className="flex items-center gap-3 border-b px-4 py-2" style={{ borderColor: `${fg}15` }}>
            <span className="h-3 w-3 rounded" style={{ background: `linear-gradient(135deg, ${a.primaryColor}, ${a.accentColor})` }} />{line(30, 0.5)}
            <div className="mx-auto flex gap-2.5">{[0, 1, 2, 3].map((i) => <div key={i} className="relative">{line(16, i ? 0.3 : 0.7, 3)}{!i && <span className="absolute -bottom-1.5 left-0 h-[2px] w-full" style={{ background: a.primaryColor }} />}</div>)}</div>
            <span className="h-3 w-11 rounded-sm" style={{ background: a.primaryColor }} />
          </div>
          <div className="grid grid-cols-[1.1fr_1fr] items-center gap-3 px-4 pt-3">
            <div className="space-y-1.5">{line('40%', 0.6, 3)}<div className="text-[11px] font-extrabold leading-tight" style={{ color: fg, fontFamily: a.headingFont }}>Trusted experts</div>{line('90%', 0.2, 3)}{line('70%', 0.2, 3)}<span className="mt-1 block h-3 w-12 rounded-sm" style={{ background: a.primaryColor }} /></div>
            <div className="relative h-20">{box({ position: 'absolute', inset: '0 0 0 18%' })}{box({ position: 'absolute', left: 0, bottom: -6, width: '45%', height: '55%', border: `2px solid ${bg}` })}</div>
          </div>
          <div className="mx-4 mt-3 grid grid-cols-3 rounded-md shadow" style={{ background: bg, border: `1px solid ${fg}15` }}>{[0, 1, 2].map((i) => <div key={i} className="flex items-center gap-1 p-1.5"><span className="h-2.5 w-2.5 rounded-sm" style={{ background: `${a.primaryColor}40` }} />{line('60%', 0.3, 2)}</div>)}</div>
        </div>
      )}
      {header === 'floating' && (
        <div className="relative h-full">
          <div className="absolute inset-x-0 top-0 h-[62%]" style={{ background: `linear-gradient(160deg, ${a.primaryColor}cc, #1d2a2a 70%)` }} />
          <div className="relative mx-3 mt-2.5 flex items-center gap-2 rounded-full border border-white/25 bg-white/10 px-2 py-1">
            <span className="h-3 w-3 rounded-full" style={{ background: a.primaryColor }} /><span className="h-[3px] w-8 rounded bg-white/80" />
            <div className="mx-auto flex gap-2">{[0, 1, 2, 3].map((i) => <span key={i} className="h-[3px] w-4 rounded bg-white/60" />)}</div>
            <span className="h-3 w-9 rounded-full" style={{ background: a.primaryColor }} />
          </div>
          <div className="relative mt-3 text-center text-[11px] font-extrabold text-white" style={{ fontFamily: a.headingFont }}>Find your next home</div>
          <div className="relative mx-auto mt-2 flex w-4/5 items-center gap-1 rounded-md bg-white p-1 shadow-lg">{[0, 1, 2].map((i) => <div key={i} className="flex-1 border-r border-black/10 px-1">{line('70%', 0.25, 2)}</div>)}<span className="h-3 w-8 rounded-sm" style={{ background: a.primaryColor }} /></div>
          <div className="absolute inset-x-4 bottom-3 grid grid-cols-3 gap-2">{[0, 1, 2].map((i) => <div key={i} className="overflow-hidden rounded" style={{ background: surface, border: `1px solid ${fg}15` }}><div style={{ height: 18, background: `hsl(${150 + i * 25} 25% 55%)` }} /><div className="space-y-1 p-1">{line('80%', 0.4, 2)}{line('50%', 0.2, 2)}</div></div>)}</div>
        </div>
      )}
      {header === 'bold' && (
        <div className="relative h-full" style={{ color: fg }}>
          <div className="absolute inset-0" style={{ background: `linear-gradient(120deg, #000 30%, ${a.primaryColor}55)` }} />
          <div className="relative flex items-center gap-3 px-4 py-2.5 text-white">
            <span className="text-[10px] font-black uppercase italic" style={{ fontFamily: a.headingFont }}>{theme.general.siteName}<span style={{ color: a.primaryColor }}>.</span></span>
            <div className="flex gap-2">{[0, 1, 2].map((i) => <span key={i} className="h-[3px] w-5 bg-white/60" />)}</div>
            <span className="ml-auto h-3.5 w-12 -skew-x-12" style={{ background: a.primaryColor }} />
          </div>
          <div className="relative px-4 pt-3 font-black uppercase italic leading-[0.9] text-white" style={{ fontFamily: a.headingFont, fontSize: 22 }}>No limits.<br /><span style={{ color: a.primaryColor }}>Just results.</span></div>
          <div className="absolute inset-x-0 bottom-4 -rotate-2 py-1 text-center text-[8px] font-black uppercase tracking-widest text-black" style={{ background: a.primaryColor }}>Strength ✦ Conditioning ✦ Boxing ✦ Yoga</div>
        </div>
      )}
      {header === 'sidebar' && (
        <div className="flex h-full">
          <div className="flex w-[26%] flex-col gap-2 border-r px-2.5 py-3" style={{ borderColor: `${fg}15` }}>
            <span className="text-[9px] font-extrabold" style={{ color: fg, fontFamily: a.headingFont }}>{theme.general.siteName}<span style={{ color: a.primaryColor }}>*</span></span>
            <div className="mt-2 space-y-1.5">{[0, 1, 2, 3, 4].map((i) => <div key={i} className="flex items-center gap-1"><span className="text-[5px]" style={{ color: a.primaryColor }}>0{i + 1}</span>{line('70%', i ? 0.3 : 0.8, 4)}</div>)}</div>
            <span className="mt-auto h-3 w-full rounded-sm" style={{ background: a.primaryColor }} />
          </div>
          <div className="relative flex-1 overflow-hidden px-3 pt-3">
            <div className="font-extrabold uppercase leading-[0.9]" style={{ color: fg, fontFamily: a.headingFont, fontSize: 20 }}>We make<br /><span style={{ color: a.primaryColor }}>brands</span></div>
            <div className="absolute bottom-10 right-3 h-9 w-9 rounded-full border border-dashed" style={{ borderColor: fg }} />
            <div className="absolute inset-x-0 bottom-3 -rotate-2 py-1 text-center text-[7px] font-extrabold uppercase text-white" style={{ background: a.primaryColor }}>Branding ✦ Web ✦ Motion ✦ Strategy</div>
          </div>
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

const familyOf = (t) => t.variantOf || t.id;

function ActivateModal({ theme, activeId, activeFamily, onClose, onDone }) {
  const { can } = useAuth();
  const isCurrent = theme.id === activeId;
  const sameFamily = !isCurrent && familyOf(theme) === activeFamily;
  const ws = theme.workspace;
  const [opts, setOpts] = useState({ appearance: true, setup: true, demo: !isCurrent && !sameFamily && !ws, restore: true });
  const [loading, setLoading] = useState(false);
  const activate = async () => {
    setLoading(true);
    try {
      const r = await api.post(`/admin/themes/${theme.id}/activate`, opts);
      toast.success(sameFamily ? `Switched to ${theme.name} — same content, new design` : r.restored ? `${theme.name} is active — its saved content was restored` : `${theme.name} is now your active theme`);
      onDone();
    } catch (e) {
      toast.error(e.message);
      setLoading(false);
    }
  };
  const label = sameFamily ? `Switch to ${theme.variantName}` : opts.demo ? 'Install demo & activate' : isCurrent ? 'Re-apply' : 'Activate theme';

  return (
    <Modal open onClose={onClose} title={isCurrent ? `Re-apply ${theme.name}` : `Activate ${theme.name}`} description={theme.category} footer={<><button className="a-btn-secondary" onClick={onClose}>Cancel</button><button className="a-btn-primary" onClick={activate} disabled={loading}>{loading ? <Loader2 className="h-4 w-4 animate-spin" /> : <Check className="h-4 w-4" />}{label}</button></>}>
      <div className="space-y-4">
        <div className="overflow-hidden rounded-xl border border-ink-200 dark:border-white/10"><Mockup theme={theme} /></div>
        {sameFamily ? (
          <div className="rounded-xl bg-brand-50 p-4 text-sm text-brand-800 dark:bg-brand-500/10 dark:text-brand-200">
            <b>Same theme, new design.</b> All posts, pages, series, categories and settings stay exactly as they are — only the design, homepage layout, structure and menus change. You can switch back any time; each version remembers its own customised design.
          </div>
        ) : (
          <>
            {!isCurrent && ws && !opts.demo && (
              <div className="rounded-xl border border-emerald-200 bg-emerald-50 p-4 dark:border-emerald-500/20 dark:bg-emerald-500/10">
                <Toggle label="Restore this theme's saved content" description={`${ws.posts} posts · ${ws.pages} pages${ws.series ? ` · ${ws.series} series` : ''} — saved ${new Date(ws.savedAt).toLocaleString()}`} checked={opts.restore} onChange={(v) => setOpts({ ...opts, restore: v })} />
              </div>
            )}
            {(isCurrent || !ws || !opts.restore) && !opts.demo && (
              <>
                <Toggle label="Apply theme design" description="Colors, fonts, corner radius, header & footer style." checked={opts.appearance} onChange={(v) => setOpts({ ...opts, appearance: v })} />
                <Toggle label="Set up homepage, pages & menus" description={`Creates: ${theme.pages.map((p) => p.title).join(', ')} (existing pages with the same URL are kept).`} checked={opts.setup} onChange={(v) => setOpts({ ...opts, setup: v })} />
              </>
            )}
            {can('settings') && (
              <div className={cn('rounded-xl border p-4 transition', opts.demo ? 'border-amber-300 bg-amber-50 dark:border-amber-500/30 dark:bg-amber-500/10' : 'border-ink-200 dark:border-white/10')}>
                <Toggle label="Install demo content" description={ws || isCurrent ? "Replaces this theme's content with fresh demo content. Other themes keep their own saved content." : 'This theme has no content yet — start from its demo content.'} checked={opts.demo} onChange={(v) => setOpts({ ...opts, demo: v })} />
                {opts.demo && (ws || isCurrent) && <p className="mt-3 flex items-center gap-2 text-xs font-semibold text-amber-600"><AlertTriangle className="h-4 w-4" />This theme's current content will be replaced.</p>}
              </div>
            )}
            {!isCurrent && <p className="text-xs text-ink-400">The current theme's content is saved automatically before switching — nothing is lost.</p>}
          </>
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
  const [picked, setPicked] = useState({});
  if (!data) return <PageLoader />;

  const active = data.items.find((t) => t.id === data.active);
  const activeFamily = active ? familyOf(active) : null;
  const families = data.items.filter((t) => !t.variantOf).map((base) => [base, ...data.items.filter((v) => v.variantOf === base.id)]);
  const features = (t) => [...t.features.formats.map((f) => FORMAT_LABELS[f]), ...t.features.series.map((s) => SERIES_LABELS[s])];
  const siblings = active ? data.items.filter((t) => t.id !== active.id && familyOf(t) === activeFamily) : [];
  const versionIcon = (v) => (!v.variantOf ? null : v.variantName === 'Luxe' ? <Crown className="h-3 w-3 text-amber-500" /> : <Sparkles className="h-3 w-3 text-brand-500" />);

  return (
    <>
      <PageHeader title="Themes" description="Each theme turns the site into a different kind of website. Many themes come with extra designs (Luxe and homepage demos) — switching between them keeps all your content." />

      {active && (
        <div className="a-card mb-8 grid overflow-hidden lg:grid-cols-[1.2fr_1fr]">
          <Mockup theme={active} />
          <div className="flex flex-col justify-center p-6 sm:p-8">
            <div className="mb-2 flex flex-wrap items-center gap-2"><Badge color="green" dot>Active theme</Badge><Badge>{active.category}</Badge>{active.variantOf && <Badge color="amber">{versionIcon(active)}{active.variantName}</Badge>}</div>
            <h2 className="text-3xl font-extrabold tracking-tight text-ink-900 dark:text-white">{active.name}</h2>
            <p className="mt-2 text-ink-500">{active.description}</p>
            <div className="mt-4 flex flex-wrap gap-1.5">{features(active).map((f) => <Badge key={f} color="brand">{f}</Badge>)}</div>
            <div className="mt-6 flex flex-wrap gap-2">
              <Link href="/admin/appearance" className="a-btn-primary"><Palette className="h-4 w-4" />Customize</Link>
              {siblings.length === 1 && <button onClick={() => setActivating(siblings[0])} className="a-btn-secondary">{siblings[0].variantOf ? <Crown className="h-4 w-4 text-amber-500" /> : <Sparkles className="h-4 w-4" />}Switch to {siblings[0].variantName} design</button>}
              {siblings.length > 1 && (
                <select className="a-input w-auto" value="" onChange={(e) => { const v = siblings.find((s) => s.id === e.target.value); if (v) setActivating(v); }}>
                  <option value="">Switch design ({siblings.length} more)…</option>
                  {siblings.map((s) => <option key={s.id} value={s.id}>{s.variantName}</option>)}
                </select>
              )}
              <a href="/" target="_blank" rel="noreferrer" className="a-btn-ghost"><ExternalLink className="h-4 w-4" />View site</a>
              <button onClick={() => setActivating(active)} className="a-btn-ghost">Re-apply / demo</button>
            </div>
          </div>
        </div>
      )}

      <h3 className="mb-4 text-sm font-bold uppercase tracking-wider text-ink-400">All themes</h3>
      <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3 2xl:grid-cols-4">
        {families.map((versions) => {
          const base = versions[0];
          const t = versions.find((v) => v.id === picked[base.id]) || (activeFamily === base.id ? active : base);
          const isActive = t.id === data.active;
          return (
            <div key={base.id} className={cn('a-card group flex flex-col overflow-hidden', familyOf(t) === activeFamily && 'ring-2 ring-emerald-400/60')}>
              <div className="relative overflow-hidden">
                <Mockup theme={t} className="transition duration-500 group-hover:scale-[1.03]" />
                <div className="absolute inset-0 flex items-center justify-center bg-ink-950/50 opacity-0 backdrop-blur-[2px] transition group-hover:opacity-100">
                  <button onClick={() => setPreview(t)} className="a-btn bg-white text-ink-900 hover:bg-ink-50"><Eye className="h-4 w-4" />Preview</button>
                </div>
                {t.workspace && <span className="absolute left-3 top-3 rounded-full bg-black/60 px-2.5 py-1 text-[11px] font-semibold text-white backdrop-blur">{t.workspace.posts ? `${t.workspace.posts} posts` : `${t.workspace.pages} pages`} saved</span>}
              </div>
              <div className="flex flex-1 flex-col p-5">
                <div className="flex items-start justify-between gap-3">
                  <div>
                    <div className="text-xs font-bold uppercase tracking-wider text-brand-600">{t.category}</div>
                    <h3 className="mt-1 text-lg font-extrabold text-ink-900 dark:text-white">{t.name}</h3>
                  </div>
                  {versions.length === 2 && (
                    <div className="flex shrink-0 rounded-lg bg-ink-100 p-0.5 dark:bg-white/5">
                      {versions.map((v) => (
                        <button key={v.id} onClick={() => setPicked((p) => ({ ...p, [base.id]: v.id }))} className={cn('flex items-center gap-1 rounded-md px-2.5 py-1 text-xs font-bold transition', v.id === t.id ? 'bg-white text-ink-900 shadow-sm dark:bg-ink-800 dark:text-white' : 'text-ink-400 hover:text-ink-700')}>
                          {versionIcon(v)}{v.variantName}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                {versions.length > 2 && (
                  <label className="mt-2 block">
                    <span className="mb-1 flex items-center gap-2 text-xs font-semibold text-ink-500">Design <span className="rounded-full bg-brand-50 px-2 py-0.5 text-[10px] font-bold text-brand-700 dark:bg-brand-500/10 dark:text-brand-300">{versions.length} designs</span></span>
                    <select className="a-input" value={t.id} onChange={(e) => setPicked((p) => ({ ...p, [base.id]: e.target.value }))}>
                      {versions.map((v) => <option key={v.id} value={v.id}>{v.variantName}{v.id === data.active ? ' — active' : ''}</option>)}
                    </select>
                  </label>
                )}
                <p className="mt-2 flex-1 text-sm text-ink-500">{t.description}</p>
                <div className="mt-3 flex flex-wrap gap-1">{features(t).map((f) => <Badge key={f}>{f}</Badge>)}</div>
                <div className="mt-4 flex gap-2">
                  <button onClick={() => setPreview(t)} className="a-btn-secondary flex-1"><Eye className="h-4 w-4" />Preview</button>
                  {isActive ? <span className="a-btn flex-1 bg-emerald-50 text-emerald-700 dark:bg-emerald-500/10 dark:text-emerald-300"><Check className="h-4 w-4" />Active</span> : (
                    <button onClick={() => setActivating(t)} className="a-btn-primary flex-1">{familyOf(t) === activeFamily ? `Use ${t.variantName}` : 'Activate'}</button>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {preview && <PreviewModal theme={preview} onClose={() => setPreview(null)} onActivate={() => { setActivating(preview); setPreview(null); }} />}
      {activating && <ActivateModal theme={activating} activeId={data.active} activeFamily={activeFamily} onClose={() => setActivating(null)} onDone={() => { setActivating(null); reload(); reloadActive(); }} />}
    </>
  );
}
