import { api, item, rss, SITE_URL, xmlResponse } from '@/lib/feed';

// Site-wide RSS feed of the latest posts. ?category=<slug> or ?tag=<slug> narrows it.
export const dynamic = 'force-dynamic';

export async function GET(request) {
  const params = new URL(request.url).searchParams;
  const filter = ['category', 'tag'].map((k) => (params.get(k) ? `&${k}=${encodeURIComponent(params.get(k))}` : '')).join('');
  const [boot, posts] = await Promise.all([api('/bootstrap'), api(`/posts?limit=30${filter}`)]);
  const general = boot?.settings?.general || {};
  const seo = boot?.settings?.seo || {};
  const label = params.get('category') || params.get('tag');
  return xmlResponse(rss({
    title: label ? `${general.siteName} — ${label}` : general.siteName || 'Feed',
    link: SITE_URL,
    description: general.tagline || seo.metaDescription || '',
    self: `${SITE_URL}/feed.xml${filter ? `?${filter.slice(1)}` : ''}`,
    image: general.logo || seo.ogImage,
    items: (posts?.items || []).map((p) => item(p)),
  }));
}
