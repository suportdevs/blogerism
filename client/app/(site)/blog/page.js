import Link from 'next/link';
import { ArrowUpRight } from 'lucide-react';
import { fetchPublic, getBootstrap, themeFormats } from '@/lib/server';
import PostListing from '@/components/site/PostListing';
import { CategoryPill } from '@/components/site/PostCard';
import { formatDate } from '@/lib/utils';

export const metadata = { title: 'Blog' };

export default async function BlogPage({ searchParams }) {
  const page = Number(searchParams.page) || 1;
  const { settings, theme } = await getBootstrap();
  const fmt = themeFormats(theme);
  const mode = theme?.layout?.listing || 'cards';
  const limit = settings.general.postsPerPage || 9;
  const [data, cats, featured] = await Promise.all([
    fetchPublic(`/posts?page=${page}&limit=${limit}${fmt}`),
    fetchPublic('/categories'),
    page === 1 && mode === 'cards' ? fetchPublic(`/posts?featured=true&limit=1${fmt}`) : { items: [] },
  ]);
  const hero = featured.items[0];

  return (
    <PostListing
      eyebrow={mode === 'cards' ? 'Our blog' : mode === 'luxe' ? 'The journal' : null}
      title={{ news: 'Latest news', video: 'All videos', audio: 'All episodes' }[mode] || 'Insights, stories & guides'}
      subtitle={mode === 'cards' ? 'Deep dives on design, engineering and building products people love.' : null}
      data={data}
      categories={cats.items}
      basePath="/blog"
      appearance={settings.appearance}
      mode={mode}
      featured={hero && (
        <section className="site-container pt-14">
          <Link href={`/blog/${hero.slug}`} className="group grid overflow-hidden rounded-theme-lg border border-fg/10 bg-surface transition hover:shadow-glow lg:grid-cols-2">
            <div className="aspect-[16/10] overflow-hidden lg:aspect-auto">
              {hero.coverImage && <img src={hero.coverImage} alt="" className="h-full w-full object-cover transition duration-700 group-hover:scale-105" />}
            </div>
            <div className="flex flex-col justify-center p-8 sm:p-12">
              <div className="mb-4 flex items-center gap-3">
                <span className="eyebrow">Featured</span>
                {hero.categories[0] && <CategoryPill category={hero.categories[0]} />}
              </div>
              <h2 className="font-heading text-3xl font-extrabold leading-tight tracking-tight group-hover:text-primary sm:text-4xl">{hero.title}</h2>
              <p className="mt-4 text-lg text-fg/60">{hero.excerpt}</p>
              <div className="mt-8 flex items-center gap-3 text-sm text-fg/60">
                {hero.author?.avatar && <img src={hero.author.avatar} alt="" className="h-9 w-9 rounded-full" />}
                <span className="font-semibold text-fg">{hero.author?.name}</span>·<span>{formatDate(hero.publishedAt)}</span>
                <ArrowUpRight className="ml-auto h-5 w-5 transition group-hover:-translate-y-1 group-hover:translate-x-1 group-hover:text-primary" />
              </div>
            </div>
          </Link>
        </section>
      )}
    />
  );
}
