import { fetchPublic, getBootstrap, themeFormats } from '@/lib/server';
import PostListing from '@/components/site/PostListing';

export async function generateMetadata({ params }) {
  const tag = await fetchPublic(`/tags/${params.slug}`, { allow404: true });
  return { title: tag ? `#${tag.name}` : 'Not found' };
}

export default async function TagPage({ params, searchParams }) {
  const page = Number(searchParams.page) || 1;
  const { settings, theme } = await getBootstrap();
  const [tag, data] = await Promise.all([
    fetchPublic(`/tags/${params.slug}`),
    fetchPublic(`/posts?tag=${params.slug}&page=${page}&limit=${settings.general.postsPerPage}${themeFormats(theme)}`),
  ]);
  return (
    <PostListing
      eyebrow="Tag"
      title={`#${tag.name}`}
      subtitle={`${data.meta.total} article${data.meta.total === 1 ? '' : 's'} tagged with “${tag.name}”`}
      data={data}
      basePath={`/tag/${params.slug}`}
      appearance={settings.appearance}
      mode={theme?.layout?.listing}
    />
  );
}
