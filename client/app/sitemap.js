const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';
const SITE_URL = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000';

export const revalidate = 3600;

export default async function sitemap() {
  try {
    const res = await fetch(`${API_URL}/api/public/sitemap`, { next: { revalidate: 3600 } });
    const { posts, pages, categories, series = [] } = await res.json();
    const prefix = { VIDEO: 'watch', AUDIO: 'listen' };
    return [
      { url: SITE_URL, changeFrequency: 'daily', priority: 1 },
      { url: `${SITE_URL}/blog`, changeFrequency: 'daily', priority: 0.9 },
      ...pages.filter((p) => p.slug !== 'home').map((p) => ({ url: `${SITE_URL}/${p.slug}`, lastModified: p.updatedAt, priority: 0.7 })),
      ...posts.map((p) => ({ url: `${SITE_URL}/${prefix[p.format] || 'blog'}/${p.slug}`, lastModified: p.updatedAt, priority: 0.8 })),
      ...series.map((s) => ({ url: `${SITE_URL}/series/${s.slug}`, lastModified: s.updatedAt, priority: 0.7 })),
      ...categories.map((c) => ({ url: `${SITE_URL}/category/${c.slug}`, lastModified: c.updatedAt, priority: 0.5 })),
    ];
  } catch {
    return [{ url: SITE_URL }];
  }
}
