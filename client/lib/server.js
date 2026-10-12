import { notFound } from 'next/navigation';
import { loadFeeds } from './blockData';

// Server-side data access for the storefront (React Server Components).
const API_URL = process.env.API_URL || process.env.NEXT_PUBLIC_API_URL || 'http://localhost:4000';

export async function fetchPublic(path, { revalidate = 30, allow404 = false } = {}) {
  let res;
  try {
    res = await fetch(`${API_URL}/api/public${path}`, { next: { revalidate } });
  } catch {
    throw new Error(`Cannot reach the API at ${API_URL}. Is the server running?`);
  }
  if (res.status === 404) {
    if (allow404) return null;
    notFound();
  }
  if (!res.ok) throw new Error(`API ${path} failed with ${res.status}`);
  return res.json();
}

export const getBootstrap = () => fetchPublic('/bootstrap', { revalidate: 10 });

// "&format=..." restricting archives to the content formats the active theme uses.
export const themeFormats = (theme) => (theme?.features?.formats?.length ? `&format=${theme.features.formats.join(',')}` : '');

// Data that dynamic blocks (latest posts, testimonials, FAQ) need, fetched once per page.
export async function getBlockContext(blocks = []) {
  const types = new Set(blocks.map((b) => b.type));
  const needPosts = blocks.filter((b) => b.type === 'latestPosts').reduce((m, b) => Math.max(m, Number(b.data?.count) || 3), 0);
  const [posts, testimonials, faqs, feeds, categories] = await Promise.all([
    needPosts ? fetchPublic(`/posts?limit=${needPosts}`).then((r) => r.items) : [],
    types.has('testimonials') ? fetchPublic('/testimonials').then((r) => r.items) : [],
    types.has('faq') ? fetchPublic('/faqs').then((r) => r.items) : [],
    loadFeeds(blocks, (path) => fetchPublic(path, { allow404: true })),
    types.has('videoGrid') ? fetchPublic('/categories').then((r) => r.items) : [],
  ]);
  return { posts, testimonials, faqs, feeds, categories };
}
