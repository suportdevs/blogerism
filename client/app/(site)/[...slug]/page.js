import { notFound } from 'next/navigation';
import { fetchPublic, getBlockContext, getBootstrap } from '@/lib/server';
import Blocks from '@/components/site/Blocks';

export async function generateMetadata({ params }) {
  if (params.slug.length !== 1) return {};
  const page = await fetchPublic(`/pages/${params.slug[0]}`, { allow404: true });
  if (!page) return { title: 'Not found' };
  return {
    title: page.seoTitle || page.title,
    description: page.seoDescription || undefined,
    openGraph: page.ogImage ? { images: [page.ogImage] } : undefined,
  };
}

export default async function CmsPage({ params }) {
  if (params.slug.length !== 1) notFound();
  const [page, { settings }] = await Promise.all([fetchPublic(`/pages/${params.slug[0]}`), getBootstrap()]);
  const ctx = await getBlockContext(page.blocks);
  return <Blocks blocks={page.blocks} ctx={ctx} settings={settings} />;
}
