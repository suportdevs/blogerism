'use client';

import Link from 'next/link';
import { useState } from 'react';
import { toast } from 'sonner';
import { Clapperboard, ExternalLink, ListVideo, Loader2, Mic, MoreHorizontal, Pencil, Plus, Star, Trash2, Tv } from 'lucide-react';
import { api } from '@/lib/api';
import { useApi } from '@/lib/hooks';
import { cn } from '@/lib/utils';
import { ImageField, MediaUrlField } from '@/components/admin/Media';
import { Badge, Dropdown, DropdownItem, EmptyState, Field, Modal, PageHeader, SearchInput, Tabs, Toggle, useConfirm } from '@/components/admin/ui';

const TYPES = {
  SHOW: { label: 'Show', icon: Tv, color: 'brand', episode: 'VIDEO', hint: 'Seasons & episodes — streaming style' },
  PLAYLIST: { label: 'Playlist', icon: ListVideo, color: 'blue', episode: 'VIDEO', hint: 'Ordered list of videos' },
  PODCAST: { label: 'Podcast', icon: Mic, color: 'green', episode: 'AUDIO', hint: 'Audio episodes with a feed-style page' },
};
const EMPTY = { title: '', slug: '', type: 'SHOW', tagline: '', description: '', poster: '', backdrop: '', trailerUrl: '', year: '', maturity: '', genres: [], featured: false, status: 'PUBLISHED', order: 0 };

export default function SeriesPage() {
  const confirm = useConfirm();
  const [params, setParams] = useState({ type: '', q: '' });
  const { data, loading, reload } = useApi('/admin/series', params);
  const [form, setForm] = useState(null);
  const [saving, setSaving] = useState(false);
  const items = data?.items || [];
  const set = (k) => (v) => setForm((f) => ({ ...f, [k]: v }));

  const save = async () => {
    setSaving(true);
    const { id, _count, createdAt, updatedAt, posts, ...body } = form; // eslint-disable-line no-unused-vars
    Object.assign(body, {
      year: body.year ? Number(body.year) : null,
      order: Number(body.order) || 0,
      genres: typeof body.genres === 'string' ? body.genres.split(',').map((g) => g.trim()).filter(Boolean) : body.genres,
      poster: body.poster || null, backdrop: body.backdrop || null, trailerUrl: body.trailerUrl || null,
    });
    try {
      if (id) await api.put(`/admin/series/${id}`, body);
      else await api.post('/admin/series', body);
      toast.success(`${TYPES[body.type].label} saved`);
      setForm(null);
      reload();
    } catch (e) { toast.error(e.message); } finally { setSaving(false); }
  };

  const remove = async (s) => {
    if (!(await confirm({ title: `Delete “${s.title}”?`, message: 'Episodes are kept but detached from this series.' }))) return;
    await api.del(`/admin/series/${s.id}`);
    toast.success('Deleted');
    reload();
  };

  return (
    <>
      <PageHeader
        title="Shows & podcasts"
        description="Group videos and audio into shows (with seasons), playlists and podcasts. Episodes are regular posts."
        actions={<button onClick={() => setForm({ ...EMPTY, type: params.type || 'SHOW' })} className="a-btn-primary"><Plus className="h-4 w-4" />New series</button>}
      />
      <div className="mb-5 flex flex-wrap items-center gap-3">
        <Tabs value={params.type} onChange={(type) => setParams({ ...params, type })} tabs={[{ value: '', label: 'All' }, ...Object.entries(TYPES).map(([value, t]) => ({ value, label: `${t.label}s`, icon: t.icon }))]} />
        <SearchInput value={params.q} onChange={(q) => setParams({ ...params, q })} className="ml-auto w-64" />
      </div>

      {!loading && !items.length ? (
        <div className="a-card"><EmptyState icon={Clapperboard} title="No series yet" description="Create a show, playlist or podcast, then add episodes to it." /></div>
      ) : (
        <div className={cn('grid gap-5 sm:grid-cols-2 lg:grid-cols-3 2xl:grid-cols-4', loading && 'opacity-60')}>
          {items.map((s) => {
            const T = TYPES[s.type];
            return (
              <div key={s.id} className="a-card group overflow-hidden">
                <div className="relative aspect-video overflow-hidden bg-ink-100 dark:bg-white/5">
                  {(s.backdrop || s.poster) && <img src={s.backdrop || s.poster} alt="" className="h-full w-full object-cover transition duration-500 group-hover:scale-105" />}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent" />
                  {s.poster && <img src={s.poster} alt="" className={cn('absolute bottom-3 left-3 rounded-lg object-cover shadow-xl ring-2 ring-white/20', s.type === 'SHOW' ? 'h-24 w-16' : 'h-16 w-16')} />}
                  <div className="absolute bottom-3 left-24 right-3 text-white">
                    <div className="line-clamp-1 font-extrabold">{s.title}</div>
                    <div className="text-xs text-white/70">{s._count.posts} episode{s._count.posts === 1 ? '' : 's'}{s.year ? ` · ${s.year}` : ''}</div>
                  </div>
                  <div className="absolute left-3 top-3 flex gap-1.5">
                    <Badge color={T.color}><T.icon className="h-3 w-3" />{T.label}</Badge>
                    {s.featured && <Badge color="amber"><Star className="h-3 w-3 fill-current" />Featured</Badge>}
                    {s.status !== 'PUBLISHED' && <Badge>{s.status.toLowerCase()}</Badge>}
                  </div>
                  <div className="absolute right-2 top-2">
                    <Dropdown trigger={<button className="grid h-8 w-8 place-items-center rounded-lg bg-black/40 text-white backdrop-blur hover:bg-black/60"><MoreHorizontal className="h-4 w-4" /></button>}>
                      <DropdownItem icon={Pencil} onClick={() => setForm({ ...EMPTY, ...s, year: s.year || '', tagline: s.tagline || '', description: s.description || '', poster: s.poster || '', backdrop: s.backdrop || '', trailerUrl: s.trailerUrl || '', maturity: s.maturity || '' })}>Edit</DropdownItem>
                      <DropdownItem icon={ExternalLink} href={`/series/${s.slug}`}>View on site</DropdownItem>
                      <DropdownItem icon={Trash2} danger onClick={() => remove(s)}>Delete</DropdownItem>
                    </Dropdown>
                  </div>
                </div>
                <div className="flex items-center gap-2 p-3">
                  <p className="line-clamp-1 flex-1 text-sm text-ink-500">{s.tagline || '—'}</p>
                  <Link href={`/admin/posts/new?format=${T.episode}&series=${s.id}`} className="a-btn-secondary h-8 px-2.5 text-xs"><Plus className="h-3.5 w-3.5" />Episode</Link>
                </div>
              </div>
            );
          })}
        </div>
      )}

      <Modal open={!!form} onClose={() => setForm(null)} size="lg" title={form?.id ? 'Edit series' : 'New series'} footer={<><button className="a-btn-secondary" onClick={() => setForm(null)}>Cancel</button><button className="a-btn-primary" onClick={save} disabled={saving || !form?.title}>{saving && <Loader2 className="h-4 w-4 animate-spin" />}Save</button></>}>
        {form && (
          <div className="space-y-5">
            <div className="grid gap-2 sm:grid-cols-3">
              {Object.entries(TYPES).map(([value, t]) => (
                <button key={value} type="button" onClick={() => set('type')(value)} className={cn('rounded-xl border-2 p-3 text-left transition', form.type === value ? 'border-brand-500 bg-brand-50 dark:bg-brand-500/10' : 'border-ink-200 dark:border-white/10')}>
                  <t.icon className="mb-1.5 h-5 w-5 text-brand-500" />
                  <div className="text-sm font-bold">{t.label}</div>
                  <div className="text-xs text-ink-400">{t.hint}</div>
                </button>
              ))}
            </div>
            <div className="grid gap-4 sm:grid-cols-2">
              <Field label="Title" required className="sm:col-span-2"><input className="a-input" value={form.title} onChange={(e) => set('title')(e.target.value)} /></Field>
              <Field label="Tagline" className="sm:col-span-2"><input className="a-input" value={form.tagline} onChange={(e) => set('tagline')(e.target.value)} /></Field>
              <Field label="Description" className="sm:col-span-2"><textarea className="a-textarea" rows={3} value={form.description} onChange={(e) => set('description')(e.target.value)} /></Field>
              <Field label={form.type === 'SHOW' ? 'Poster (2:3)' : 'Cover art (square)'}><ImageField value={form.poster} onChange={set('poster')} aspect={form.type === 'SHOW' ? 'aspect-[2/3] max-w-[160px]' : 'aspect-square max-w-[180px]'} /></Field>
              <Field label="Backdrop (16:9)" hint="Used by billboards and the series page hero."><ImageField value={form.backdrop} onChange={set('backdrop')} /></Field>
              {form.type !== 'PODCAST' && <Field label="Trailer URL" className="sm:col-span-2"><MediaUrlField value={form.trailerUrl} onChange={set('trailerUrl')} placeholder="YouTube link or uploaded video" /></Field>}
              <Field label="Genres" hint="Comma separated"><input className="a-input" value={Array.isArray(form.genres) ? form.genres.join(', ') : form.genres} onChange={(e) => set('genres')(e.target.value)} /></Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Year"><input type="number" className="a-input" value={form.year} onChange={(e) => set('year')(e.target.value)} /></Field>
                <Field label="Rating"><input className="a-input" placeholder="13+" value={form.maturity} onChange={(e) => set('maturity')(e.target.value)} /></Field>
              </div>
              <Field label="Status">
                <select className="a-input" value={form.status} onChange={(e) => set('status')(e.target.value)}><option value="PUBLISHED">Published</option><option value="DRAFT">Draft</option></select>
              </Field>
              <Field label="Sort order"><input type="number" className="a-input" value={form.order} onChange={(e) => set('order')(e.target.value)} /></Field>
              <Toggle className="sm:col-span-2" label="Featured" description="Eligible for billboards and featured rows" checked={form.featured} onChange={set('featured')} />
            </div>
          </div>
        )}
      </Modal>
    </>
  );
}
