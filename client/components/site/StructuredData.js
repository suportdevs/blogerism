import { postUrl } from '@/lib/utils';

// schema.org structured data for search engines (rich results for articles, videos, podcasts and series).
const SITE_URL = (process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000').replace(/\/$/, '');
const abs = (u) => (!u ? undefined : /^https?:\/\//i.test(u) ? u : `${SITE_URL}${u.startsWith('/') ? '' : '/'}${u}`);
const isoDuration = (sec) => (sec ? `PT${Math.floor(sec / 3600) ? `${Math.floor(sec / 3600)}H` : ''}${Math.floor((sec % 3600) / 60)}M${sec % 60}S` : undefined);

export function JsonLd({ data }) {
  // "<" is escaped so content can never close the script tag.
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, '\\u003c') }} />;
}

export function postJsonLd(post, { news = false } = {}) {
  const url = abs(postUrl(post));
  const image = abs(post.coverImage);
  const author = post.author ? { '@type': 'Person', name: post.author.name } : undefined;
  const series = post.series ? { name: post.series.title, url: abs(`/series/${post.series.slug}`) } : null;
  const base = { '@context': 'https://schema.org', url, datePublished: post.publishedAt, dateModified: post.updatedAt, description: post.seoDescription || post.excerpt || undefined };
  if (post.format === 'VIDEO') {
    return {
      ...base, '@type': series ? 'Episode' : 'VideoObject', name: post.title, thumbnailUrl: image, uploadDate: post.publishedAt, duration: isoDuration(post.duration),
      ...(series ? { episodeNumber: post.episode || undefined, partOfSeason: post.season ? { '@type': 'TVSeason', seasonNumber: post.season } : undefined, partOfSeries: { '@type': 'TVSeries', ...series } } : { contentUrl: post.videoUrl || undefined }),
    };
  }
  if (post.format === 'AUDIO') {
    return {
      ...base, '@type': series ? 'PodcastEpisode' : 'AudioObject', name: post.title, image, timeRequired: isoDuration(post.duration),
      ...(series ? { episodeNumber: post.episode || undefined, associatedMedia: post.audioUrl ? { '@type': 'MediaObject', contentUrl: abs(post.audioUrl) } : undefined, partOfSeries: { '@type': 'PodcastSeries', ...series } } : { contentUrl: abs(post.audioUrl) }),
    };
  }
  return { ...base, '@type': news ? 'NewsArticle' : 'BlogPosting', headline: post.title, image, author, mainEntityOfPage: url };
}

export function seriesJsonLd(series, episodes = []) {
  const type = { PODCAST: 'PodcastSeries', SHOW: 'TVSeries' }[series.type] || 'CreativeWorkSeries';
  return {
    '@context': 'https://schema.org', '@type': type, name: series.title, url: abs(`/series/${series.slug}`), description: series.description || series.tagline || undefined,
    image: abs(series.poster || series.backdrop), genre: series.genres?.length ? series.genres : undefined, contentRating: series.maturity || undefined,
    ...(series.type === 'PODCAST' ? { webFeed: abs(`/series/${series.slug}/feed.xml`) } : {}),
    ...(series.type === 'SHOW' ? { numberOfEpisodes: episodes.length, numberOfSeasons: new Set(episodes.map((e) => e.season || 1)).size } : {}),
    ...(series.year ? { startDate: String(series.year) } : {}),
  };
}

// Site-level structured data: the business (or person) behind the site, typed by the active theme so Google can show
// it as a restaurant, clinic, law firm… with address, phone and social profiles.
const BUSINESS_TYPE = {
  saffron: 'Restaurant', vitalis: 'MedicalClinic', sterling: 'LegalService', haven: 'RealEstateAgent', forge: 'ExerciseGym',
  aurelia: 'Hotel', wanderly: 'TravelAgency', scholar: 'EducationalOrganization', evergreen: 'NGO', atlas: 'ProfessionalService',
  kinetic: 'ProfessionalService', lens: 'ProfessionalService', herald: 'NewsMediaOrganization', folio: 'Person',
};
const LOCAL = new Set(['Restaurant', 'MedicalClinic', 'LegalService', 'RealEstateAgent', 'ExerciseGym', 'Hotel', 'TravelAgency', 'ProfessionalService']);

export function siteJsonLd(settings, theme) {
  const { general = {}, contact = {}, social = {}, seo = {} } = settings;
  const type = BUSINESS_TYPE[theme?.variantOf || theme?.id] || 'Organization';
  const sameAs = Object.values(social).filter((u) => typeof u === 'string' && /^https?:\/\//.test(u));
  const base = { '@context': 'https://schema.org', '@type': type, name: general.siteName, url: SITE_URL, sameAs: sameAs.length ? sameAs : undefined };
  if (type === 'Person') return { ...base, email: contact.email || undefined, image: abs(seo.ogImage) };
  return {
    ...base,
    description: general.tagline || seo.metaDescription || undefined,
    logo: abs(general.logo) || undefined,
    image: abs(seo.ogImage || general.logo) || undefined,
    email: contact.email || undefined,
    telephone: contact.phone || undefined,
    address: contact.address ? { '@type': 'PostalAddress', streetAddress: contact.address } : undefined,
    ...(LOCAL.has(type) && contact.mapEmbedUrl ? { hasMap: contact.mapEmbedUrl } : {}),
  };
}
