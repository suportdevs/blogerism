import clsx from 'clsx';

export const cn = (...args) => clsx(...args);

export function formatDate(value, opts = { month: 'short', day: 'numeric', year: 'numeric' }) {
  if (!value) return '—';
  return new Intl.DateTimeFormat('en-US', opts).format(new Date(value));
}

export function timeAgo(value) {
  const diff = (Date.now() - new Date(value).getTime()) / 1000;
  const units = [[31536000, 'y'], [2592000, 'mo'], [604800, 'w'], [86400, 'd'], [3600, 'h'], [60, 'm']];
  for (const [secs, label] of units) if (diff >= secs) return `${Math.floor(diff / secs)}${label} ago`;
  return 'just now';
}

export function formatBytes(bytes = 0) {
  if (bytes < 1024) return `${bytes} B`;
  if (bytes < 1048576) return `${(bytes / 1024).toFixed(1)} KB`;
  return `${(bytes / 1048576).toFixed(1)} MB`;
}

export const compact = (n = 0) => new Intl.NumberFormat('en-US', { notation: 'compact' }).format(n);

export const uid = () => Math.random().toString(36).slice(2, 10);

export const slugify = (s = '') =>
  s.toString().toLowerCase().normalize('NFKD').replace(/[̀-ͯ]/g, '').replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

export const stripHtml = (html = '') => html.replace(/<[^>]+>/g, ' ').replace(/\s+/g, ' ').trim();

export const initials = (name = '') => name.split(' ').map((p) => p[0]).join('').slice(0, 2).toUpperCase();

// Public URL for a post, based on its media format.
export function postUrl(post) {
  if (post.format === 'VIDEO') return `/watch/${post.slug}`;
  if (post.format === 'AUDIO') return `/listen/${post.slug}`;
  return `/blog/${post.slug}`;
}

export const seriesUrl = (series) => `/series/${series.slug}`;

export function formatDuration(sec) {
  if (sec == null || Number.isNaN(sec)) return '';
  const s = Math.max(0, Math.round(sec));
  const h = Math.floor(s / 3600);
  const m = Math.floor((s % 3600) / 60);
  const r = String(s % 60).padStart(2, '0');
  return h ? `${h}:${String(m).padStart(2, '0')}:${r}` : `${m}:${r}`;
}

// Converts YouTube / Vimeo page links to embeddable player URLs. Returns null for direct media files.
export function embedUrl(url = '', { autoplay = false } = {}) {
  const yt = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/|youtube\.com\/shorts\/)([\w-]{11})/);
  if (yt) return `https://www.youtube-nocookie.com/embed/${yt[1]}?rel=0&modestbranding=1${autoplay ? '&autoplay=1' : ''}`;
  const vimeo = url.match(/vimeo\.com\/(?:video\/)?(\d+)/);
  if (vimeo) return `https://player.vimeo.com/video/${vimeo[1]}${autoplay ? '?autoplay=1' : ''}`;
  return null;
}

// Shape used by the global audio player.
export const toTrack = (post) => ({
  id: post.id,
  title: post.title,
  src: post.audioUrl,
  cover: post.coverImage || post.series?.poster,
  subtitle: post.series?.title || post.author?.name || '',
  href: postUrl(post),
  duration: post.duration,
});
