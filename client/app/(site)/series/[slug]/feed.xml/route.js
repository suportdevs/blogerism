import { abs, api, esc, hms, item, rss, SITE_URL, xmlResponse } from '@/lib/feed';
import { stripHtml } from '@/lib/utils';

// Per-series feed. Podcasts get the iTunes tags Apple Podcasts and Spotify need; shows and playlists get a plain RSS feed.
export const dynamic = 'force-dynamic';

export async function GET(_request, { params }) {
  const [boot, data] = await Promise.all([api('/bootstrap'), api(`/series/${encodeURIComponent(params.slug)}`)]);
  if (!data?.series) return new Response('Not found', { status: 404 });
  const { series, episodes } = data;
  const general = boot?.settings?.general || {};
  const contact = boot?.settings?.contact || {};
  const podcast = series.type === 'PODCAST';
  const link = `${SITE_URL}/series/${series.slug}`;
  const author = general.siteName || '';
  const image = series.poster || series.backdrop;
  const summary = stripHtml(series.description || series.tagline || '');

  const channelExtra = podcast ? `<language>en</language>
<itunes:author>${esc(author)}</itunes:author>
<itunes:summary>${esc(summary)}</itunes:summary>
<itunes:type>${episodes.some((e) => e.season) ? 'serial' : 'episodic'}</itunes:type>
<itunes:owner><itunes:name>${esc(author)}</itunes:name>${contact.email ? `<itunes:email>${esc(contact.email)}</itunes:email>` : ''}</itunes:owner>
${image ? `<itunes:image href="${esc(abs(image))}" />` : ''}
${(series.genres || []).slice(0, 2).map((g) => `<itunes:category text="${esc(g)}" />`).join('')}
<itunes:explicit>${/18|mature|explicit/i.test(series.maturity || '') ? 'true' : 'false'}</itunes:explicit>` : '';

  const items = [...episodes].reverse().map((e) => item(e, podcast ? [
    e.duration ? `<itunes:duration>${hms(e.duration)}</itunes:duration>` : '',
    e.episode ? `<itunes:episode>${e.episode}</itunes:episode>` : '',
    e.season ? `<itunes:season>${e.season}</itunes:season>` : '',
    e.coverImage ? `<itunes:image href="${esc(abs(e.coverImage))}" />` : '',
    '<itunes:episodeType>full</itunes:episodeType>',
  ].join('') : ''));

  return xmlResponse(rss({
    title: series.title,
    link,
    description: summary,
    self: `${link}/feed.xml`,
    image,
    extraNs: podcast ? ' xmlns:itunes="http://www.itunes.com/dtds/podcast-1.0.dtd"' : '',
    channelExtra,
    items,
  }));
}
