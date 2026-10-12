import Link from 'next/link';
import { fetchPublic } from '@/lib/server';
import { FaqList } from '@/components/site/Blocks';

export const metadata = { title: 'FAQ' };

export default async function FaqPage() {
  const { items } = await fetchPublic('/faqs');
  const groups = items.reduce((acc, f) => {
    const k = f.category || 'General';
    (acc[k] ||= []).push(f);
    return acc;
  }, {});
  const jsonLd = {
    '@context': 'https://schema.org', '@type': 'FAQPage',
    mainEntity: items.map((f) => ({ '@type': 'Question', name: f.question, acceptedAnswer: { '@type': 'Answer', text: f.answer } })),
  };

  return (
    <>
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }} />
      <section className="relative overflow-hidden py-20 text-center">
        <div className="pointer-events-none absolute -top-32 left-1/2 h-80 w-[700px] -translate-x-1/2 rounded-full bg-primary/15 blur-[100px]" />
        <span className="eyebrow mb-4">Help center</span>
        <h1 className="font-heading text-4xl font-extrabold tracking-tight sm:text-5xl">Frequently asked questions</h1>
        <p className="mx-auto mt-4 max-w-xl text-lg text-fg/60">Can’t find what you’re looking for? <Link href="/contact" className="font-semibold text-primary">Contact us</Link>.</p>
      </section>
      <section className="site-container space-y-14 pb-24">
        {Object.entries(groups).map(([name, list]) => (
          <div key={name}>
            {Object.keys(groups).length > 1 && <h2 className="mx-auto mb-5 max-w-3xl font-heading text-xl font-bold">{name}</h2>}
            <FaqList items={list} />
          </div>
        ))}
      </section>
    </>
  );
}
