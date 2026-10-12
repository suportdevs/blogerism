import Link from 'next/link';
import { fetchPublic, getBlockContext, getBootstrap } from '@/lib/server';
import Blocks from '@/components/site/Blocks';

export async function generateMetadata() {
  const { page } = await fetchPublic('/home');
  if (!page) return {};
  return { title: { absolute: page.seoTitle || page.title }, description: page.seoDescription || undefined };
}

export default async function HomePage() {
  const [{ page }, { settings }] = await Promise.all([fetchPublic('/home'), getBootstrap()]);

  if (!page) {
    return (
      <section className="site-container py-32 text-center">
        <span className="eyebrow mb-6">Welcome</span>
        <h1 className="font-heading text-5xl font-extrabold tracking-tight">{settings.general.siteName}</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-fg/60">No homepage has been published yet. Create a page in the admin panel and set it as your homepage under Settings → General.</p>
        <Link href="/admin" className="btn-site-primary mt-8">Open admin panel</Link>
      </section>
    );
  }

  const ctx = await getBlockContext(page.blocks);
  return <Blocks blocks={page.blocks} ctx={ctx} settings={settings} />;
}
