import Link from 'next/link';
import { ArrowLeft, Search } from 'lucide-react';
import { ReportNotFound } from '@/components/site/ReportNotFound';
import { getT } from '@/lib/server';

export default async function NotFound() {
  const t = await getT().catch(() => (k, f) => f || k);
  return (
    <section className="relative overflow-hidden py-32 text-center">
      <ReportNotFound />
      <div className="pointer-events-none absolute left-1/2 top-10 h-80 w-[600px] -translate-x-1/2 rounded-full bg-primary/20 blur-[100px]" />
      <div className="relative px-5">
        <div className="text-gradient font-heading text-[9rem] font-black leading-none tracking-tighter sm:text-[12rem]">404</div>
        <h1 className="font-heading text-3xl font-extrabold">{t('notFoundTitle')}</h1>
        <p className="mx-auto mt-3 max-w-md text-fg/60">{t('notFoundText')}</p>
        <form action="/search" className="mx-auto mt-8 flex max-w-md items-center gap-2 rounded-full border border-fg/10 bg-surface p-1.5 pl-5">
          <Search className="h-4 w-4 shrink-0 text-fg/40" />
          <input name="q" type="search" placeholder={t('searchSite')} aria-label={t('searchSite')} className="min-w-0 flex-1 bg-transparent py-2 text-sm outline-none" />
          <button type="submit" className="btn-site-primary !px-5 !py-2 text-sm">{t('search')}</button>
        </form>
        <Link href="/" className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-fg/60 hover:text-primary"><ArrowLeft className="h-4 w-4" />{t('backHome')}</Link>
      </div>
    </section>
  );
}
