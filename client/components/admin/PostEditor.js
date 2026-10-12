'use client';

import Link from 'next/link';
import { useRouter, useSearchParams } from 'next/navigation';
import { useEffect, useMemo, useState } from 'react';
import { toast } from 'sonner';
import { ArrowLeft, Calendar, Check, Clapperboard, ExternalLink, FileText, Images, Loader2, Mic, Plus, Save, Star, Tag, Trash2, Video, X, Zap } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi, useSaveShortcut, useUnsavedWarning } from '@/lib/hooks';
import { cn, embedUrl, formatDuration, slugify, stripHtml } from '@/lib/utils';
import RichEditor from './RichEditor';
import SeoPanel from './SeoPanel';
import { ImageField, MediaPicker, MediaUrlField } from './Media';
import { Card, Field, PageLoader, StatusBadge, Toggle, useConfirm } from './ui';
import { useSiteTheme } from './SiteTheme';

const EMPTY = {
  title: '', slug: '', excerpt: '', content: '', coverImage: '', status: 'DRAFT', featured: false, allowComments: true, categoryIds: [], tags: [], seoTitle: '', seoDescription: '', publishedAt: '',
  format: 'STANDARD', subtitle: '', videoUrl: '', audioUrl: '', duration: null, gallery: [], isBreaking: false, seriesId: '', season: '', episode: '',
};

const FORMATS = [
  { value: 'STANDARD', label: 'Article', icon: FileText },
  { value: 'VIDEO', label: 'Video', icon: Video },
  { value: 'AUDIO', label: 'Audio / podcast', icon: Mic },
  { value: 'GALLERY', label: 'Gallery', icon: Images },
];
const URL_PREFIX = { VIDEO: 'watch', AUDIO: 'listen' };

const parseDuration = (s) => {
  if (s === '' || s == null) return null;
  const parts = String(s).split(':').map(Number);
  if (parts.some(Number.isNaN)) return null;
  return Math.round(parts.reduce((acc, n) => acc * 60 + n, 0));
};

function DurationInput({ value, onChange }) {
  const [text, setText] = useState(formatDuration(value));
  useEffect(() => setText(formatDuration(value)), [value]);
  return <input className="a-input font-mono" value={text} placeholder="mm:ss" onChange={(e) => setText(e.target.value)} onBlur={() => onChange(parseDuration(text))} />;
}

function MediaCard({ form, set }) {
  const [pickerOpen, setPickerOpen] = useState(false);
  const autoDuration = (e) => { if (!form.duration && Number.isFinite(e.currentTarget.duration)) set('duration')(Math.round(e.currentTarget.duration)); };

  if (form.format === 'GALLERY') {
    return (
      <Card title="Gallery images" description="Shown as a grid above the article body." actions={<button type="button" onClick={() => setPickerOpen(true)} className="a-btn-secondary h-8 text-xs"><Plus className="h-3.5 w-3.5" />Add images</button>}>
        {form.gallery.length ? (
          <div className="grid grid-cols-2 gap-3 sm:grid-cols-3">
            {form.gallery.map((g, i) => (
              <div key={i} className="group relative">
                <img src={g.src} alt="" className="aspect-square w-full rounded-xl object-cover" />
                <button type="button" onClick={() => set('gallery')(form.gallery.filter((_, j) => j !== i))} className="absolute right-1.5 top-1.5 grid h-7 w-7 place-items-center rounded-full bg-black/60 text-white opacity-0 transition hover:bg-rose-500 group-hover:opacity-100"><X className="h-3.5 w-3.5" /></button>
                <input className="a-input mt-1.5 h-8 text-xs" placeholder="Caption" value={g.caption || ''} onChange={(e) => set('gallery')(form.gallery.map((x, j) => (j === i ? { ...x, caption: e.target.value } : x)))} />
              </div>
            ))}
          </div>
        ) : <p className="text-sm text-ink-400">No images yet.</p>}
        <MediaPicker open={pickerOpen} onClose={() => setPickerOpen(false)} multiple onPick={(list) => set('gallery')([...form.gallery, ...list.map((m) => ({ src: m.url, caption: m.alt || '' }))])} />
      </Card>
    );
  }

  const isVideo = form.format === 'VIDEO';
  const url = isVideo ? form.videoUrl : form.audioUrl;
  const embed = isVideo && embedUrl(url || '');
  return (
    <Card title={isVideo ? 'Video source' : 'Audio source'} description={isVideo ? 'Upload an MP4/WebM or paste a YouTube / Vimeo link.' : 'Upload an MP3/WAV or paste a direct audio URL.'}>
      <div className="space-y-4">
        <MediaUrlField value={url} onChange={set(isVideo ? 'videoUrl' : 'audioUrl')} accept={isVideo ? 'video' : 'audio'} placeholder={isVideo ? 'https://www.youtube.com/watch?v=… or /uploads/clip.mp4' : 'https://…/episode.mp3'} />
        {url && (isVideo ? (
          <div className="aspect-video overflow-hidden rounded-xl bg-black">
            {embed ? <iframe src={embed} title="Preview" className="h-full w-full" allowFullScreen /> : <video src={url} controls className="h-full w-full" onLoadedMetadata={autoDuration} />}
          </div>
        ) : <audio src={url} controls className="w-full" onLoadedMetadata={autoDuration} />)}
        <div className="grid gap-4 sm:grid-cols-2">
          <Field label="Duration" hint={embed ? 'Enter manually for embedded videos.' : 'Detected automatically from uploaded files.'}><DurationInput value={form.duration} onChange={set('duration')} /></Field>
        </div>
      </div>
    </Card>
  );
}

function SeriesCard({ form, set }) {
  const { data } = useApi('/admin/series', { limit: 100 });
  const label = { SHOW: 'Show', PLAYLIST: 'Playlist', PODCAST: 'Podcast' };
  return (
    <Card title={<span className="flex items-center gap-1.5"><Clapperboard className="h-4 w-4" />Series / episode</span>}>
      <div className="space-y-3">
        <select className="a-input" value={form.seriesId || ''} onChange={(e) => set('seriesId')(e.target.value)}>
          <option value="">Not part of a series</option>
          {data?.items.map((s) => <option key={s.id} value={s.id}>{s.title} · {label[s.type]}</option>)}
        </select>
        {form.seriesId && (
          <div className="grid grid-cols-2 gap-3">
            <Field label="Season"><input type="number" min={1} className="a-input" value={form.season ?? ''} onChange={(e) => set('season')(e.target.value)} /></Field>
            <Field label="Episode"><input type="number" min={1} className="a-input" value={form.episode ?? ''} onChange={(e) => set('episode')(e.target.value)} /></Field>
          </div>
        )}
      </div>
    </Card>
  );
}

const toLocalInput = (d) => (d ? new Date(new Date(d).getTime() - new Date().getTimezoneOffset() * 60000).toISOString().slice(0, 16) : '');

function TagInput({ value, onChange }) {
  const [input, setInput] = useState('');
  const { data } = useApi('/admin/taxonomy/tags');
  const suggestions = useMemo(
    () => (data?.items || []).filter((t) => t.name.toLowerCase().includes(input.toLowerCase()) && !value.includes(t.name)).slice(0, 6),
    [data, input, value],
  );
  const add = (name) => {
    const n = name.trim();
    if (n && !value.includes(n)) onChange([...value, n]);
    setInput('');
  };
  return (
    <div>
      <div className="flex min-h-10 flex-wrap items-center gap-1.5 rounded-xl border border-ink-200 bg-white p-1.5 focus-within:border-brand-400 dark:border-white/10 dark:bg-ink-950/60">
        {value.map((t) => (
          <span key={t} className="flex items-center gap-1 rounded-lg bg-brand-50 py-1 pl-2 pr-1 text-xs font-semibold text-brand-700 dark:bg-brand-500/15 dark:text-brand-200">
            #{t}<button type="button" onClick={() => onChange(value.filter((x) => x !== t))} className="rounded p-0.5 hover:bg-brand-100 dark:hover:bg-white/10"><X className="h-3 w-3" /></button>
          </span>
        ))}
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' || e.key === ',') { e.preventDefault(); add(input); }
            if (e.key === 'Backspace' && !input && value.length) onChange(value.slice(0, -1));
          }}
          placeholder={value.length ? '' : 'Add tags…'}
          className="min-w-[80px] flex-1 bg-transparent px-1.5 text-sm outline-none"
        />
      </div>
      {input && suggestions.length > 0 && (
        <div className="mt-1.5 flex flex-wrap gap-1">
          {suggestions.map((s) => <button type="button" key={s.id} onClick={() => add(s.name)} className="rounded-lg border border-ink-200 px-2 py-1 text-xs font-medium hover:border-brand-400 hover:text-brand-600 dark:border-white/10">#{s.name}</button>)}
        </div>
      )}
      <p className="a-hint">Press Enter or comma to add.</p>
    </div>
  );
}

function CategoryPicker({ value, onChange }) {
  const { data, reload } = useApi('/admin/taxonomy/categories');
  const [name, setName] = useState('');
  const [adding, setAdding] = useState(false);
  const toggle = (id) => onChange(value.includes(id) ? value.filter((x) => x !== id) : [...value, id]);
  const create = async () => {
    if (!name.trim()) return;
    const c = await api.post('/admin/taxonomy/categories', { name });
    await reload();
    onChange([...value, c.id]);
    setName('');
    setAdding(false);
  };
  return (
    <div>
      <div className="a-scroll max-h-56 space-y-0.5 overflow-y-auto">
        {data?.items.map((c) => (
          <label key={c.id} className={cn('flex cursor-pointer items-center gap-2.5 rounded-lg px-2 py-1.5 text-sm transition hover:bg-ink-50 dark:hover:bg-white/5', c.parentId && 'ml-5')}>
            <span className={cn('grid h-4 w-4 place-items-center rounded border', value.includes(c.id) ? 'border-brand-500 bg-brand-500 text-white' : 'border-ink-300 dark:border-white/20')}>{value.includes(c.id) && <Check className="h-3 w-3" />}</span>
            <input type="checkbox" hidden checked={value.includes(c.id)} onChange={() => toggle(c.id)} />
            <span className="h-2 w-2 rounded-full" style={{ background: c.color }} />
            <span className="flex-1 font-medium">{c.name}</span>
          </label>
        ))}
      </div>
      {adding ? (
        <div className="mt-2 flex gap-2">
          <input autoFocus className="a-input h-9" value={name} onChange={(e) => setName(e.target.value)} onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), create())} placeholder="Category name" />
          <button type="button" className="a-btn-primary" onClick={create}>Add</button>
        </div>
      ) : (
        <button type="button" onClick={() => setAdding(true)} className="mt-2 flex items-center gap-1 text-sm font-semibold text-brand-600"><Plus className="h-4 w-4" />Add new category</button>
      )}
    </div>
  );
}

export default function PostEditor({ id }) {
  const router = useRouter();
  const search = useSearchParams();
  const confirm = useConfirm();
  const isNew = !id;
  // "New episode" links pass ?format=VIDEO&series=3 to prefill the editor.
  const [form, setForm] = useState(() => ({
    ...EMPTY,
    format: FORMATS.some((f) => f.value === search.get('format')) ? search.get('format') : 'STANDARD',
    seriesId: search.get('series') || '',
  }));
  const [loaded, setLoaded] = useState(isNew);
  const [saving, setSaving] = useState(false);
  const [dirty, setDirty] = useState(false);
  const [slugTouched, setSlugTouched] = useState(!isNew);
  const [meta, setMeta] = useState(null);
  const [allFormats, setAllFormats] = useState(false);
  const { theme, formats: themeFormats, usesSeries } = useSiteTheme();
  const shownFormats = FORMATS.filter((f) => allFormats || themeFormats.includes(f.value) || f.value === form.format);
  useUnsavedWarning(dirty);

  // New posts start in the active theme's main format (e.g. Video for a video theme).
  useEffect(() => {
    if (isNew && theme && !search.get('format') && !dirty) setForm((f) => ({ ...f, format: themeFormats[0] }));
  }, [theme]); // eslint-disable-line react-hooks/exhaustive-deps

  useEffect(() => {
    if (isNew) return;
    api.get(`/admin/posts/${id}`).then((p) => {
      setForm({
        ...EMPTY, ...p,
        excerpt: p.excerpt || '', coverImage: p.coverImage || '', seoTitle: p.seoTitle || '', seoDescription: p.seoDescription || '',
        categoryIds: p.categories.map((c) => c.id), tags: p.tags.map((t) => t.name), publishedAt: toLocalInput(p.publishedAt),
        subtitle: p.subtitle || '', videoUrl: p.videoUrl || '', audioUrl: p.audioUrl || '', gallery: p.gallery || [],
        seriesId: p.seriesId || '', season: p.season ?? '', episode: p.episode ?? '',
      });
      setMeta(p);
      setLoaded(true);
    }).catch(() => { toast.error('Post not found'); router.replace('/admin/posts'); });
  }, [id, isNew, router]);

  const set = (k) => (v) => {
    setDirty(true);
    setForm((f) => {
      const next = { ...f, [k]: v };
      if (k === 'title' && !slugTouched) next.slug = slugify(v);
      return next;
    });
  };

  const save = async (statusOverride) => {
    if (!form.title.trim()) { toast.error('Please add a title'); return; }
    setSaving(true);
    const payload = {
      ...form,
      status: statusOverride || form.status,
      publishedAt: form.publishedAt ? new Date(form.publishedAt).toISOString() : null,
      coverImage: form.coverImage || null,
      subtitle: form.subtitle || null,
      videoUrl: form.videoUrl || null,
      audioUrl: form.audioUrl || null,
      seriesId: form.seriesId ? Number(form.seriesId) : null,
      season: form.seriesId && form.season !== '' ? Number(form.season) : null,
      episode: form.seriesId && form.episode !== '' ? Number(form.episode) : null,
    };
    ['id', 'author', 'categories', 'series', 'likes', 'createdAt', 'updatedAt', 'views', 'readingTime', 'authorId'].forEach((k) => delete payload[k]);
    try {
      const saved = isNew ? await api.post('/admin/posts', payload) : await api.put(`/admin/posts/${id}`, payload);
      setDirty(false);
      setForm((f) => ({ ...f, slug: saved.slug, status: saved.status, publishedAt: toLocalInput(saved.publishedAt) }));
      setMeta(saved);
      toast.success(isNew ? 'Post created' : 'Post saved');
      if (isNew) router.replace(`/admin/posts/${saved.id}`);
    } catch (e) {
      toast.error(e.message);
    } finally {
      setSaving(false);
    }
  };
  useSaveShortcut(() => save());

  const remove = async () => {
    if (!(await confirm({ title: 'Delete this post?' }))) return;
    await api.del(`/admin/posts/${id}`);
    setDirty(false);
    toast.success('Post deleted');
    router.replace('/admin/posts');
  };

  if (!loaded) return <PageLoader />;
  const words = stripHtml(form.content).split(' ').filter(Boolean).length;

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-center gap-3">
        <Link href="/admin/posts" className="a-btn-secondary a-btn-icon"><ArrowLeft className="h-4 w-4" /></Link>
        <div className="min-w-0 flex-1">
          <h1 className="truncate text-xl font-extrabold tracking-tight text-ink-900 dark:text-white">{isNew ? 'New post' : form.title || 'Untitled'}</h1>
          <div className="flex items-center gap-2 text-xs text-ink-400">
            {meta && <StatusBadge status={meta.status} />}
            {dirty ? <span className="font-semibold text-amber-500">● Unsaved changes</span> : !isNew && <span>All changes saved</span>}
            <span>· {words} words · ~{Math.max(1, Math.round(words / 220))} min read</span>
          </div>
        </div>
        {!isNew && meta?.status === 'PUBLISHED' && <a href={`/${URL_PREFIX[meta.format] || 'blog'}/${meta.slug}`} target="_blank" rel="noreferrer" className="a-btn-secondary"><ExternalLink className="h-4 w-4" />View</a>}
        <button onClick={() => save('DRAFT')} className="a-btn-secondary" disabled={saving}>Save draft</button>
        <button onClick={() => save(form.status === 'DRAFT' ? 'PUBLISHED' : form.status)} className="a-btn-primary" disabled={saving}>
          {saving ? <Loader2 className="h-4 w-4 animate-spin" /> : <Save className="h-4 w-4" />}
          {form.status === 'DRAFT' ? 'Publish' : 'Update'}
        </button>
      </div>

      <div className="grid gap-6 xl:grid-cols-[1fr_340px]">
        <div className="min-w-0 space-y-6">
          <div className="flex flex-wrap items-center gap-2">
            {shownFormats.map((f) => (
              <button
                key={f.value}
                type="button"
                onClick={() => set('format')(f.value)}
                className={cn('flex min-w-[140px] flex-1 items-center gap-2.5 rounded-xl border-2 bg-white px-3 py-2.5 text-sm font-bold transition dark:bg-ink-900 sm:flex-none', form.format === f.value ? 'border-brand-500 text-brand-700 shadow-brand-glow dark:text-brand-200' : 'border-ink-200 text-ink-500 hover:border-ink-300 dark:border-white/10')}
              >
                <f.icon className="h-4 w-4" />{f.label}
              </button>
            ))}
            {shownFormats.length < FORMATS.length && (
              <button type="button" onClick={() => setAllFormats(true)} className="text-xs font-semibold text-ink-400 hover:text-brand-600">+ Other formats</button>
            )}
          </div>

          <div className="a-card p-5">
            <input
              value={form.subtitle}
              onChange={(e) => set('subtitle')(e.target.value)}
              placeholder="Kicker / strapline (optional) — e.g. Exclusive, Live, Analysis"
              className="mb-1 w-full bg-transparent text-xs font-bold uppercase tracking-wider text-brand-600 outline-none placeholder:normal-case placeholder:tracking-normal placeholder:text-ink-300"
            />
            <input
              value={form.title}
              onChange={(e) => set('title')(e.target.value)}
              placeholder="Post title"
              className="w-full bg-transparent text-3xl font-extrabold tracking-tight text-ink-900 outline-none placeholder:text-ink-300 dark:text-white"
            />
            <div className="mt-3 flex items-center gap-1 rounded-lg bg-ink-50 px-3 py-2 text-sm dark:bg-white/5">
              <span className="text-ink-400">/{URL_PREFIX[form.format] || 'blog'}/</span>
              <input value={form.slug} onChange={(e) => { setSlugTouched(true); set('slug')(slugify(e.target.value)); }} className="flex-1 bg-transparent font-medium text-ink-700 outline-none dark:text-ink-200" placeholder="post-url" />
            </div>
            <textarea value={form.excerpt} onChange={(e) => set('excerpt')(e.target.value)} placeholder="Write a short excerpt (shown on cards and in search results)…" rows={2} className="mt-3 w-full resize-none bg-transparent text-ink-600 outline-none placeholder:text-ink-300 dark:text-ink-300" />
          </div>

          {form.format !== 'STANDARD' && <MediaCard form={form} set={set} />}

          <RichEditor value={form.content} onChange={set('content')} placeholder={form.format === 'STANDARD' ? undefined : form.format === 'AUDIO' ? 'Show notes, timestamps, links…' : 'Description…'} />

          <Card title="Search engine optimization" description="Customize how this post appears on Google and social media.">
            <SeoPanel
              title={form.seoTitle} description={form.seoDescription}
              onTitle={set('seoTitle')} onDescription={set('seoDescription')}
              fallbackTitle={form.title} fallbackDescription={form.excerpt}
              url={`${typeof window !== 'undefined' ? window.location.host : ''} › blog › ${form.slug || 'post-url'}`}
            />
          </Card>
        </div>

        <aside className="space-y-6">
          <Card title="Publish">
            <div className="space-y-4">
              <Field label="Status">
                <select className="a-input" value={form.status} onChange={(e) => set('status')(e.target.value)}>
                  <option value="DRAFT">Draft</option>
                  <option value="PUBLISHED">Published</option>
                  <option value="SCHEDULED">Scheduled</option>
                </select>
              </Field>
              <Field label={<span className="flex items-center gap-1.5"><Calendar className="h-3.5 w-3.5" />Publish date</span>} hint={form.status === 'SCHEDULED' ? 'Post goes live automatically at this time.' : 'Leave empty to publish now.'}>
                <input type="datetime-local" className="a-input" value={form.publishedAt} onChange={(e) => set('publishedAt')(e.target.value)} />
              </Field>
              <Toggle label={<span className="flex items-center gap-1.5"><Star className="h-3.5 w-3.5 text-amber-400" />Featured post</span>} description="Highlight on the blog page" checked={form.featured} onChange={set('featured')} />
              <Toggle label={<span className="flex items-center gap-1.5"><Zap className="h-3.5 w-3.5 text-rose-500" />Breaking news</span>} description="Show in breaking tickers with a red badge" checked={form.isBreaking} onChange={set('isBreaking')} />
              {!isNew && <button onClick={remove} className="flex items-center gap-1.5 text-sm font-semibold text-rose-600 hover:underline"><Trash2 className="h-4 w-4" />Move to trash</button>}
            </div>
          </Card>
          <Card title={form.format === 'VIDEO' ? 'Thumbnail' : form.format === 'AUDIO' ? 'Episode artwork' : 'Cover image'}>
            <ImageField value={form.coverImage} onChange={set('coverImage')} aspect={form.format === 'AUDIO' ? 'aspect-square' : 'aspect-video'} />
            {form.format === 'VIDEO' && !form.coverImage && embedUrl(form.videoUrl || '')?.includes('youtube') && (
              <button type="button" onClick={() => set('coverImage')(`https://i.ytimg.com/vi/${form.videoUrl.match(/([\w-]{11})(?:[?&#]|$)/)?.[1]}/hqdefault.jpg`)} className="mt-2 text-xs font-semibold text-brand-600">Use YouTube thumbnail</button>
            )}
          </Card>
          {form.format !== 'STANDARD' && (usesSeries || form.seriesId) && <SeriesCard form={form} set={set} />}
          <Card title="Categories"><CategoryPicker value={form.categoryIds} onChange={set('categoryIds')} /></Card>
          <Card title={<span className="flex items-center gap-1.5"><Tag className="h-4 w-4" />Tags</span>}><TagInput value={form.tags} onChange={set('tags')} /></Card>
        </aside>
      </div>
    </div>
  );
}
