import { fetchPublic, getBootstrap, themeFormats } from '@/lib/server';
import PostListing from '@/components/site/PostListing';

export async function generateMetadata({ params }) {
  const cat = await fetchPublic(`/categories/${params.slug}`, { allow404: true });
  return cat ? { title: cat.name, description: cat.description } : { title: 'Not found' };
}

export default async function CategoryPage({ params, searchParams }) {
  const page = Number(searchParams.page) || 1;
  const { settings, theme } = await getBootstrap();
  const [category, data, cats] = await Promise.all([
    fetchPublic(`/categories/${params.slug}`),
    fetchPublic(`/posts?category=${params.slug}&page=${page}&limit=${settings.general.postsPerPage}${themeFormats(theme)}`),
    fetchPublic('/categories'),
  ]);
  return (
    <PostListing
      eyebrow="Category"
      title={category.name}
      subtitle={category.description}
      data={data}
      categories={cats.items}
      activeCategory={params.slug}
      basePath={`/category/${params.slug}`}
      appearance={settings.appearance}
      mode={theme?.layout?.listing}
      emptyText="No posts in this category yet."
    />
  );
}
