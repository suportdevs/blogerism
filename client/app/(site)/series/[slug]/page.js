import Link from 'next/link';
import { Film, Play } from 'lucide-react';
import { fetchPublic } from '@/lib/server';
import { compact, formatDuration, postUrl } from '@/lib/utils';
import { PlayButton } from '@/components/site/AudioPlayer';
import { AudioRow, Thumb, postsToTracks } from '@/components/site/MediaCards';
import { SeasonEpisodes } from '@/components/site/MediaClient';

export async function generateMetadata({ params }) {
  const data = await fetchPublic(`/series/${params.slug}`, { allow404: true });
  if (!data) return { title: 'Not found' };
  const { series } = data;
  return { title: series.title, description: series.tagline || series.description, openGraph: { images: [series.backdrop || series.poster].filter(Boolean) } };
}

function Meta({ series, episodes }) {
  const seasons = new Set(episodes.map((e) => e.season || 1)).size;
  const total = episodes.reduce((n, e) => n + (e.duration || 0), 0);
  return (
    <div className="flex flex-wrap items-center gap-3 text-sm font-semibold text-fg/70">
      {series.year && <span>{series.year}</span>}
      {series.maturity && <span className="rounded border border-fg/30 px-1.5 py-0.5 text-xs">{series.maturity}</span>}
      {series.type === 'SHOW' && <span>{seasons} Season{seasons > 1 ? 's' : ''}</span>}
      <span>{episodes.length} {series.type === 'PLAYLIST' ? 'videos' : 'episodes'}</span>
      {total > 0 && <span>{formatDuration(total)} total</span>}
      {series.genres?.length > 0 && <span className="text-fg/50">{series.genres.join(' • ')}</span>}
    </div>
  );
}

export default async function SeriesPage({ params }) {
  const { series, episodes } = await fetchPublic(`/series/${params.slug}`);
  const first = episodes[0];

  /* ---------------- Podcast ---------------- */
  if (series.type === 'PODCAST') {
    const tracks = postsToTracks(episodes);
    const latestFirst = [...episodes].reverse();
    return (
      <>
        <section className="relative overflow-hidden">
          {series.poster && <img src={series.poster} alt="" className="absolute inset-0 h-full w-full scale-110 object-cover opacity-30 blur-3xl" />}
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-[rgb(var(--c-bg))]" />
          <div className="site-container relative grid items-center gap-10 py-16 md:grid-cols-[300px_1fr]">
            {series.poster && <img src={series.poster} alt="" className="aspect-square w-full max-w-[300px] rounded-theme-lg object-cover shadow-2xl" />}
            <div>
              <span className="eyebrow mb-4">Podcast</span>
              <h1 className="font-heading text-4xl font-black tracking-tight text-fg sm:text-6xl">{series.title}</h1>
              {series.tagline && <p className="mt-3 text-xl text-fg/70">{series.tagline}</p>}
              <div className="mt-4"><Meta series={series} episodes={episodes} /></div>
              {series.description && <p className="mt-4 max-w-2xl text-fg/65">{series.description}</p>}
              {tracks.length > 0 && (
                <div className="mt-7 flex flex-wrap gap-3">
                  <PlayButton tracks={[...tracks].reverse()} label="Play latest" className="!px-7 !py-3.5" />
                  <PlayButton tracks={tracks} label="Play from start" className="!bg-fg/10 !text-fg !shadow-none" />
                </div>
              )}
            </div>
          </div>
        </section>
        <section className="site-container max-w-4xl pb-20">
          <h2 className="mb-5 font-heading text-2xl font-extrabold text-fg">All episodes</h2>
          <div className="space-y-2.5">
            {latestFirst.map((p) => <AudioRow key={p.id} post={p} tracks={tracks} index={Math.max(0, tracks.findIndex((t) => t.id === p.id))} number={p.episode} />)}
          </div>
        </section>
      </>
    );
  }

  /* ---------------- Playlist (YouTube-style) ---------------- */
  if (series.type === 'PLAYLIST') {
    return (
      <div className="site-container grid gap-8 py-10 lg:grid-cols-[360px_1fr]">
        <aside className="lg:sticky lg:top-24 lg:self-start">
          <div className="overflow-hidden rounded-theme-lg bg-gradient-to-b from-primary/30 to-surface p-5">
            {(first?.coverImage || series.poster) && <img src={first?.coverImage || series.poster} alt="" className="aspect-video w-full rounded-theme object-cover shadow-xl" />}
            <h1 className="mt-5 font-heading text-2xl font-extrabold text-fg">{series.title}</h1>
            {series.tagline && <p className="mt-1 text-fg/65">{series.tagline}</p>}
            <div className="mt-3"><Meta series={series} episodes={episodes} /></div>
            {first && <Link href={postUrl(first)} className="btn-site-primary mt-5 w-full"><Play className="h-4 w-4 fill-current" />Play all</Link>}
          </div>
        </aside>
        <div className="divide-y divide-fg/10">
          {episodes.map((p, i) => (
            <Link key={p.id} href={postUrl(p)} className="group flex items-center gap-4 py-3">
              <span className="w-6 text-center text-sm text-fg/40">{i + 1}</span>
              <Thumb post={p} aspect="aspect-video" className="w-40 shrink-0" rounded="rounded-[calc(var(--radius)*0.6)]" />
              <div className="min-w-0">
                <h3 className="line-clamp-2 font-bold text-fg group-hover:text-primary">{p.title}</h3>
                <p className="text-sm text-fg/50">{p.author?.name} · {compact(p.views)} views</p>
              </div>
            </Link>
          ))}
        </div>
      </div>
    );
  }

  /* ---------------- Show (streaming-style) ---------------- */
  const bySeason = episodes.reduce((m, e) => { const k = e.season || 1; (m[k] ||= []).push(e); return m; }, {});
  const seasons = Object.entries(bySeason).map(([n, eps]) => [Number(n), eps]).sort((a, b) => a[0] - b[0]);
  return (
    <div className="dark bg-[#0b0b0f] text-white [--c-bg:11_11_15] [--c-fg:245_245_245] [--c-surface:24_24_30]">
      <section className="relative h-[70vh] min-h-[520px] max-h-[820px] overflow-hidden">
        {series.backdrop && <img src={series.backdrop} alt="" className="absolute inset-0 h-full w-full object-cover" />}
        <div className="absolute inset-0 bg-gradient-to-r from-black via-black/70 to-transparent" />
        <div className="absolute inset-x-0 bottom-0 h-48 bg-gradient-to-t from-[#0b0b0f] to-transparent" />
        <div className="site-container relative flex h-[70vh] min-h-[520px] max-h-[820px] items-end pb-16 pt-28">
          <div className="max-w-2xl">
            <h1 className="font-heading text-5xl font-black leading-none tracking-tight sm:text-7xl">{series.title}</h1>
            {series.tagline && <p className="mt-4 text-xl text-white/85">{series.tagline}</p>}
            <div className="mt-4"><Meta series={series} episodes={episodes} /></div>
            {series.description && <p className="mt-4 text-white/70">{series.description}</p>}
            <div className="mt-8 flex flex-wrap gap-3">
              {first && <Link href={postUrl(first)} className="btn-site bg-white px-7 text-black hover:bg-white/85"><Play className="h-5 w-5 fill-current" />Play S{first.season || 1}:E{first.episode || 1}</Link>}
              {series.trailerUrl && <a href={series.trailerUrl} target="_blank" rel="noreferrer" className="btn-site bg-white/15 px-6 text-white backdrop-blur hover:bg-white/25"><Film className="h-5 w-5" />Trailer</a>}
            </div>
          </div>
        </div>
      </section>
      <section className="site-container pb-24">
        <h2 className="mb-5 font-heading text-2xl font-extrabold">Episodes</h2>
        {seasons.length ? <SeasonEpisodes seasons={seasons} /> : <p className="text-white/50">No episodes published yet.</p>}
      </section>
    </div>
  );
}
