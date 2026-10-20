import { Search } from 'lucide-react';
import { fetchPublic, getBootstrap, getT, themeFormats } from '@/lib/server';
import PostListing from '@/components/site/PostListing';

export const metadata = { title: 'Search', robots: { index: false } };

export default async function SearchPage({ searchParams }) {
  const q = (searchParams.q || '').toString();
  const page = Number(searchParams.page) || 1;
  const { settings, theme } = await getBootstrap();
  const t = await getT();
  const data = q ? await fetchPublic(`/posts?q=${encodeURIComponent(q)}&page=${page}&limit=${settings.general.postsPerPage}${themeFormats(theme)}`, { revalidate: 0 }) : { items: [], meta: { pages: 1 } };

  return (
    <>
      <PostListing
        eyebrow={t('search')}
        title={q ? `${t('resultsFor')} “${q}”` : t('search')}
        subtitle={q ? `${data.meta.total} ${t('resultsFound')}` : t('findArticles')}
        data={data}
        basePath="/search"
        query={{ q }}
        appearance={settings.appearance}
        mode={theme?.layout?.listing === 'news' ? 'news' : theme?.layout?.listing}
        emptyText={q ? t('nothingMatched') : t('typeToSearch')}
        featured={(
          <form action="/search" className={`site-container max-w-2xl ${theme?.layout?.listing === 'cards' ? '-mt-8' : 'mt-6'}`}>
            <div className="flex items-center gap-3 rounded-full border border-fg/10 bg-bg p-2 pl-5 shadow-xl focus-within:border-primary">
              <Search className="h-5 w-5 text-fg/40" />
              <input name="q" defaultValue={q} placeholder={t('searchArticles')} className="flex-1 bg-transparent text-fg outline-none placeholder:text-fg/40" />
              <button className="btn-site-primary !rounded-full !py-2.5">{t('search')}</button>
            </div>
          </form>
        )}
      />
    </>
  );
}
