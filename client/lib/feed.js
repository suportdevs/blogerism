import { postUrl, stripHtml } from './utils';

// RSS 2.0 helpers shared by the site feed and the per-series podcast feeds.
export const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
export const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');

export const esc = (s = '') => String(s ?? '').replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;').replace(/'/g, '&apos;');
export const abs = (url) => (!url ? '' : /^https?:\/\//i.test(url) ? url : `${SITE_URL}${url.startsWith('/') ? '' : '/'}${url}`);
const date = (d) => new Date(d || Date.now()).toUTCString();

export async function api(path) {
  const res = await fetch(`${API_URL}/api/public${path}`, { next: { revalidate: 300 } });
  if (!res.ok) return null;
  return res.json();
}

const MIME = { mp3: 'audio/mpeg', m4a: 'audio/mp4', wav: 'audio/wav', ogg: 'audio/ogg', mp4: 'video/mp4', webm: 'video/webm', jpg: 'image/jpeg', jpeg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };
export const mimeOf = (url = '', fallback = 'audio/mpeg') => MIME[(url.split('?')[0].split('.').pop() || '').toLowerCase()] || fallback;

// h:mm:ss for itunes:duration.
export function hms(sec) {
  if (!sec) return '';
  const h = Math.floor(sec / 3600);
  const m = Math.floor((sec % 3600) / 60);
  const s = sec % 60;
  return [h, m, s].map((v, i) => (i ? String(v).padStart(2, '0') : String(v))).join(':');
}

export function item(post, extra = '') {
  const link = abs(postUrl(post));
  const media = post.audioUrl || (post.format === 'VIDEO' && /\.(mp4|webm)(\?|$)/i.test(post.videoUrl || '') ? post.videoUrl : '');
  return `<item>
<title>${esc(post.title)}</title>
<link>${esc(link)}</link>
<guid isPermaLink="true">${esc(link)}</guid>
<pubDate>${date(post.publishedAt || post.createdAt)}</pubDate>
${post.author?.name ? `<dc:creator>${esc(post.author.name)}</dc:creator>` : ''}
${(post.categories || []).map((c) => `<category>${esc(c.name)}</category>`).join('')}
<description>${esc(stripHtml(post.excerpt || post.subtitle || ''))}</description>
${post.coverImage ? `<media:content url="${esc(abs(post.coverImage))}" medium="image" type="${mimeOf(post.coverImage, 'image/jpeg')}" />` : ''}
${media ? `<enclosure url="${esc(abs(media))}" length="0" type="${mimeOf(media)}" />` : ''}
${extra}
</item>`;
}

export function rss({ title, link, description, self, image, extraNs = '', channelExtra = '', items }) {
  return `<?xml version="1.0" encoding="UTF-8"?>
<rss version="2.0" xmlns:atom="http://www.w3.org/2005/Atom" xmlns:dc="http://purl.org/dc/elements/1.1/" xmlns:media="http://search.yahoo.com/mrss/"${extraNs}>
<channel>
<title>${esc(title)}</title>
<link>${esc(link)}</link>
<description>${esc(description)}</description>
<atom:link href="${esc(self)}" rel="self" type="application/rss+xml" />
<lastBuildDate>${date()}</lastBuildDate>
${image ? `<image><url>${esc(abs(image))}</url><title>${esc(title)}</title><link>${esc(link)}</link></image>` : ''}
${channelExtra}
${items.join('\n')}
</channel>
</rss>`;
}

export const xmlResponse = (body) => new Response(body, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 'public, max-age=300' } });
