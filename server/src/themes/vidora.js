const { B, m, pic, slug, yt, hoursAgo, rand, FILMS, MDN_VIDEO, createCategories, commonPages, seedFaqs } = require('./helpers');

// Which films go into which playlist ("standalone" = no playlist).
const PLAYLISTS = [
  { title: 'Blender Studio classics', tagline: 'The open movies that started it all.', films: ['elephants', 'bunny', 'sintel', 'steel'], category: 'Short films' },
  { title: 'Caminandes collection', tagline: 'One llama. Endless trouble.', films: ['llama2', 'llama3'], category: 'Animation' },
  { title: 'Spies, heroes & caffeine', tagline: 'Fast, funny and action packed.', films: ['agent', 'hero', 'coffee'], category: 'Animation' },
];
const STANDALONE = ['cosmos', 'spring', 'sprite', 'charge'];

module.exports = {
  id: 'vidora',
  name: 'Vidora',
  category: 'Video sharing',
  description: 'A video-sharing platform with a sidebar, search-first header, recommended grid, trending and playlists.',
  features: { formats: ['VIDEO'], series: ['PLAYLIST'], blocks: ['Video', 'Headers', 'Content', 'Media', 'Layout'] },
  layout: { header: 'video', article: 'blog', listing: 'video' },
  general: { siteName: 'Vidora', tagline: 'Watch, share and discover great videos.', postsPerPage: 16 },
  appearance: {
    preset: 'vidora', primaryColor: '#f43f5e', accentColor: '#8b5cf6', backgroundColor: '#ffffff', surfaceColor: '#f4f4f5', textColor: '#0f0f10',
    darkBackgroundColor: '#0f0f0f', darkSurfaceColor: '#1f1f1f', darkTextColor: '#f1f1f1', headingFont: 'Roboto', bodyFont: 'Roboto',
    radius: 12, colorMode: 'system', footerStyle: 'simple', containerWidth: 1600,
    headerCta: { enabled: true, label: 'Upload', url: '/admin/posts/new?format=VIDEO' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: { name: 'Browse', items: [m('Home', '/'), m('Trending', '/trending'), m('Playlists', '/playlists'), m('Animation', '/category/animation'), m('Short films', '/category/short-films'), m('Clips', '/category/clips')] },
    footer: { name: 'Vidora', items: [m('About', '/about'), m('Contact', '/contact'), m('FAQ', '/faq'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'vidora-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Vidora — watch & share videos',
      blocks: [
        B('videoGrid', { title: '', showChips: true, count: 16, sort: 'latest', columns: 4 }, { width: 'full', paddingY: 'sm' }),
        B('mediaRail', { title: 'Playlists', source: 'series', seriesType: 'PLAYLIST', count: 10, cardStyle: 'landscape', linkLabel: 'All playlists', linkUrl: '/playlists' }, { width: 'full', paddingY: 'sm' }),
        B('videoGrid', { title: 'Most viewed', showChips: false, count: 8, sort: 'popular', columns: 4 }, { width: 'full', paddingY: 'sm' }),
      ],
    },
    {
      slug: 'trending', title: 'Trending', template: 'full-width',
      blocks: [
        B('videoFeature', { title: 'Trending now', count: 6, sort: 'popular' }, { width: 'full', paddingY: 'sm' }),
        B('videoGrid', { title: 'Most liked', showChips: false, count: 12, sort: 'liked', columns: 4 }, { width: 'full', paddingY: 'sm' }),
      ],
    },
    { slug: 'playlists', title: 'Playlists', template: 'full-width', blocks: [B('seriesGrid', { title: 'Playlists', seriesType: 'PLAYLIST', count: 24, cardStyle: 'landscape' }, { width: 'full', paddingY: 'sm' })] },
    commonPages.about('Vidora', 'A home for creators and the people who love their work.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = await createCategories(prisma, [['Animation', '#f43f5e'], ['Short films', '#8b5cf6'], ['Clips', '#0ea5e9']]);
    let n = 0;
    const createVideo = (key, extra) => {
      const [id, film, seconds] = FILMS[key];
      n += 1;
      return prisma.post.create({
        data: {
          title: film, slug: slug(`${film}-${key}`), format: 'VIDEO', ...yt(id), duration: seconds, status: 'PUBLISHED', publishedAt: hoursAgo(n * 9),
          excerpt: `${film} — an open movie made by the Blender Studio and community.`,
          content: `<p><strong>${film}</strong> is an open movie released under Creative Commons. Like and share if you enjoyed it!</p>`,
          views: rand(5000, 250000), likes: rand(200, 12000), featured: n === 1, authorId: authors[n % authors.length].id, ...extra,
        },
      });
    };
    for (const [pi, pl] of PLAYLISTS.entries()) {
      const s = await prisma.series.create({ data: { title: pl.title, slug: slug(pl.title), type: 'PLAYLIST', tagline: pl.tagline, poster: pic(`vidora-pl-${pi}`, 1280, 720), order: pi } });
      for (const [i, key] of pl.films.entries()) {
        await createVideo(key, { seriesId: s.id, season: 1, episode: i + 1, categories: { connect: [{ id: cats[pl.category].id }] } });
      }
    }
    for (const key of STANDALONE) await createVideo(key, { categories: { connect: [{ id: cats['Short films'].id }] } });
    for (const [i, [file, title]] of [['flower.mp4', 'Time-lapse: a flower in bloom'], ['friday.mp4', 'Friday night city vibes']].entries()) {
      await prisma.post.create({
        data: {
          title, slug: slug(title), format: 'VIDEO', videoUrl: `${MDN_VIDEO}/${file}`, coverImage: pic(`clip-${i}`, 1280, 720), duration: 8, status: 'PUBLISHED',
          publishedAt: hoursAgo(2 + i), excerpt: 'A short clip uploaded straight to the media library.', content: '<p>Self-hosted MP4 — upload your own from the admin panel.</p>',
          views: rand(400, 3000), likes: rand(10, 300), authorId: authors[0].id, categories: { connect: [{ id: cats.Clips.id }] },
        },
      });
    }
    await seedFaqs(prisma, [
      ['How do I upload a video?', 'Sign in to the admin panel, create a new post with the Video format and either upload a file or paste a YouTube/Vimeo link.'],
      ['Which formats are supported?', 'MP4 and WebM uploads, plus YouTube and Vimeo links.'],
    ]);
  },
};
