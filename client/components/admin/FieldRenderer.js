'use client';

import { useState } from 'react';
import { ChevronDown, ChevronUp, Copy, GripVertical, Plus, Trash2, X } from 'lucide-react';
import { ICONS } from '@/lib/icons';
import { useApi } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { ImageField } from './Media';
import RichEditor from './RichEditor';
import { Field, Toggle } from './ui';

function StringList({ value = [], onChange }) {
  return (
    <div className="space-y-1.5">
      {value.map((v, i) => (
        <div key={i} className="flex gap-1.5">
          <input className="a-input h-9" value={v} onChange={(e) => onChange(value.map((x, j) => (j === i ? e.target.value : x)))} />
          <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="a-btn-ghost a-btn-icon h-9 w-9 shrink-0 hover:text-rose-600"><X className="h-4 w-4" /></button>
        </div>
      ))}
      <button type="button" onClick={() => onChange([...value, ''])} className="flex items-center gap-1 text-xs font-semibold text-brand-600"><Plus className="h-3.5 w-3.5" />Add item</button>
    </div>
  );
}

function IconPicker({ value, onChange, options }) {
  const [open, setOpen] = useState(false);
  const Current = ICONS[value] || ICONS.Star;
  return (
    <div>
      <button type="button" onClick={() => setOpen(!open)} className="a-input flex items-center gap-2">
        <Current className="h-4 w-4 text-brand-500" /><span className="flex-1 text-left">{value}</span><ChevronDown className="h-4 w-4 text-ink-400" />
      </button>
      {open && (
        <div className="mt-1.5 grid grid-cols-6 gap-1 rounded-xl border border-ink-200 p-1.5 dark:border-white/10">
          {options.map((name) => {
            const I = ICONS[name];
            return (
              <button type="button" key={name} title={name} onClick={() => { onChange(name); setOpen(false); }} className={cn('grid aspect-square place-items-center rounded-lg transition hover:bg-brand-50 hover:text-brand-600 dark:hover:bg-brand-500/10', value === name && 'bg-brand-500 text-white hover:bg-brand-500 hover:text-white')}>
                <I className="h-4 w-4" />
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}

function Repeater({ field, value = [], onChange }) {
  const [open, setOpen] = useState(0);
  const move = (i, d) => {
    const next = [...value];
    const j = i + d;
    if (j < 0 || j >= next.length) return;
    [next[i], next[j]] = [next[j], next[i]];
    onChange(next);
    setOpen(j);
  };
  return (
    <div className="space-y-2">
      {value.map((item, i) => (
        <div key={i} className="overflow-hidden rounded-xl border border-ink-200 dark:border-white/10">
          <div className="flex items-center gap-1 bg-ink-50 px-2 py-1.5 dark:bg-white/[.03]">
            <GripVertical className="h-4 w-4 text-ink-300" />
            <button type="button" onClick={() => setOpen(open === i ? -1 : i)} className="flex-1 truncate text-left text-sm font-semibold">
              {item[field.itemLabel] || `Item ${i + 1}`}
            </button>
            <button type="button" onClick={() => move(i, -1)} className="rounded p-1 text-ink-400 hover:text-ink-700"><ChevronUp className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => move(i, 1)} className="rounded p-1 text-ink-400 hover:text-ink-700"><ChevronDown className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => onChange([...value.slice(0, i + 1), structuredClone(item), ...value.slice(i + 1)])} className="rounded p-1 text-ink-400 hover:text-ink-700"><Copy className="h-3.5 w-3.5" /></button>
            <button type="button" onClick={() => onChange(value.filter((_, j) => j !== i))} className="rounded p-1 text-ink-400 hover:text-rose-600"><Trash2 className="h-3.5 w-3.5" /></button>
          </div>
          {open === i && (
            <div className="grid grid-cols-2 gap-3 p-3">
              <SchemaFields fields={field.fields} values={item} onChange={(k, v) => onChange(value.map((x, j) => (j === i ? { ...x, [k]: v } : x)))} />
            </div>
          )}
        </div>
      ))}
      <button type="button" onClick={() => { onChange([...value, structuredClone(field.defaults || {})]); setOpen(value.length); }} className="flex w-full items-center justify-center gap-1.5 rounded-xl border-2 border-dashed border-ink-200 py-2 text-sm font-semibold text-ink-500 transition hover:border-brand-400 hover:text-brand-600 dark:border-white/10">
        <Plus className="h-4 w-4" />Add {field.label.toLowerCase().replace(/s$/, '')}
      </button>
    </div>
  );
}

// Selects backed by live data (cached by useApi per mount).
function CategorySelect({ value, onChange }) {
  const { data } = useApi('/admin/taxonomy/categories');
  return (
    <select className="a-input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">All categories</option>
      {data?.items.map((c) => <option key={c.id} value={c.slug}>{c.name}</option>)}
    </select>
  );
}

function SeriesSelect({ value, onChange }) {
  const { data } = useApi('/admin/series', { limit: 100 });
  const label = { SHOW: 'Show', PLAYLIST: 'Playlist', PODCAST: 'Podcast' };
  return (
    <select className="a-input" value={value || ''} onChange={(e) => onChange(e.target.value)}>
      <option value="">Any / none</option>
      {data?.items.map((s) => <option key={s.id} value={s.slug}>{s.title} ({label[s.type]})</option>)}
    </select>
  );
}

function Input({ field, value, onChange }) {
  switch (field.type) {
    case 'category':
      return <CategorySelect value={value} onChange={onChange} />;
    case 'series':
      return <SeriesSelect value={value} onChange={onChange} />;
    case 'textarea':
      return <textarea className={cn('a-textarea', field.mono && 'font-mono text-xs')} rows={field.rows || 3} value={value ?? ''} onChange={(e) => onChange(e.target.value)} spellCheck={!field.mono} />;
    case 'richtext':
      return <RichEditor value={value} onChange={onChange} minimal className="[&_.ProseMirror]:min-h-[200px]" />;
    case 'image':
      return <ImageField value={value} onChange={onChange} />;
    case 'select':
      return (
        <select className="a-input" value={value ?? ''} onChange={(e) => { const opt = field.options.find(([v]) => String(v) === e.target.value); onChange(opt ? opt[0] : e.target.value); }}>
          {field.options.map(([v, l]) => <option key={v} value={v}>{l}</option>)}
        </select>
      );
    case 'number':
      return <input type="number" className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value === '' ? '' : Number(e.target.value))} />;
    case 'toggle':
      return <Toggle checked={!!value} onChange={onChange} label={field.label} />;
    case 'stringList':
      return <StringList value={value} onChange={onChange} />;
    case 'list':
      return <Repeater field={field} value={value} onChange={onChange} />;
    case 'icon':
      return <IconPicker value={value} onChange={onChange} options={field.options} />;
    default:
      return <input className="a-input" value={value ?? ''} onChange={(e) => onChange(e.target.value)} placeholder={field.type === 'url' ? '/page or https://…' : ''} />;
  }
}

export function SchemaFields({ fields, values, onChange }) {
  return fields.filter((f) => !f.showIf || f.showIf(values)).map((f) => (
    <Field key={f.name} label={f.type === 'toggle' ? null : f.label} hint={f.hint} className={f.half ? 'col-span-1' : 'col-span-2'}>
      <Input field={f} value={values[f.name]} onChange={(v) => onChange(f.name, v)} />
    </Field>
  ));
}
