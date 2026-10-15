const { B, m, pic, slug, yt, hoursAgo, rand, FILMS, createCategories, commonPages, seedFaqs } = require('./helpers');

const SHOWS = [
  { title: 'Open Movie Originals', tagline: 'Award-winning short films, made in the open.', genres: ['Animation', 'Fantasy', 'Sci-Fi'], year: 2024, maturity: '13+', featured: true, seasons: [['elephants', 'bunny', 'sintel', 'steel'], ['cosmos', 'spring', 'sprite', 'charge']] },
  { title: 'Llama Tales', tagline: 'One llama. Endless trouble.', genres: ['Comedy', 'Family'], year: 2023, maturity: 'All', seasons: [['llama2', 'llama3']] },
  { title: 'Agents & Heroes', tagline: 'Spies, stunts and caffeine.', genres: ['Action', 'Comedy'], year: 2023, maturity: '7+', seasons: [['agent', 'hero', 'coffee']] },
  { title: 'Night Shift', tagline: 'The city never sleeps. Neither do they.', genres: ['Drama', 'Thriller'], year: 2025, maturity: '16+', seasons: [['steel', 'sprite']] },
  { title: 'Deep Blue', tagline: 'Journeys beneath the surface.', genres: ['Documentary', 'Nature'], year: 2025, maturity: 'All', seasons: [['spring', 'cosmos']] },
  { title: 'The Makers', tagline: 'Inside the studios that build worlds.', genres: ['Documentary'], year: 2022, maturity: 'All', seasons: [['charge', 'hero']] },
  { title: 'Northern Lights', tagline: 'Stories from the edge of the world.', genres: ['Drama', 'Romance'], year: 2024, maturity: '13+', seasons: [['sintel', 'elephants']] },
  { title: 'Paper Kingdoms', tagline: 'Small worlds, big adventures.', genres: ['Animation', 'Adventure'], year: 2025, maturity: '7+', seasons: [['bunny', 'llama2', 'coffee']] },
];

module.exports = {
  id: 'marquee',
  name: 'Marquee',
  category: 'Streaming service',
  description: 'A cinematic dark streaming experience: billboard hero, Top 10, poster rows, shows with seasons and episodes.',
  features: { formats: ['VIDEO'], series: ['SHOW'], blocks: ['Video', 'Headers', 'Interactive', 'Content', 'Media', 'Layout'] },
  layout: { header: 'streaming', article: 'blog', listing: 'video' },
  general: { siteName: 'Marquee', tagline: 'Unlimited originals. Watch anywhere.' },
  appearance: {
    preset: 'cinema', primaryColor: '#e50914', accentColor: '#f5c518', backgroundColor: '#ffffff', surfaceColor: '#f3f3f3', textColor: '#141414',
    darkBackgroundColor: '#0b0b0b', darkSurfaceColor: '#181818', darkTextColor: '#f5f5f1', headingFont: 'Outfit', bodyFont: 'Inter',
    radius: 6, colorMode: 'dark', footerStyle: 'simple', containerWidth: 1600,
    headerCta: { enabled: false, label: '', url: '' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: { name: 'Browse', items: [m('Home', '/'), m('Shows', '/shows'), m('New & popular', '/new-popular')] },
    footer: { name: 'Marquee', items: [m('About', '/about'), m('Help centre', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'marquee-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Marquee — originals & series',
      blocks: [
        B('billboard', { series: '', seriesType: 'SHOW' }, { paddingY: 'none', width: 'full' }),
        B('top10', { title: 'Top 10 shows today', source: 'series', seriesType: 'SHOW' }, { paddingY: 'sm', width: 'wide' }),
        B('mediaRail', { title: 'Marquee originals', source: 'series', seriesType: 'SHOW', count: 12, cardStyle: 'poster' }, { paddingY: 'sm', width: 'wide' }),
        B('mediaRail', { title: 'New episodes', source: 'posts', format: 'VIDEO', sort: 'latest', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', width: 'wide' }),
        B('mediaRail', { title: 'Continue: Open Movie Originals', source: 'posts', series: 'open-movie-originals', sort: 'episodes', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', width: 'wide' }),
        B('mediaRail', { title: 'Trending now', source: 'posts', format: 'VIDEO', sort: 'popular', count: 12, cardStyle: 'landscape' }, { paddingY: 'md', width: 'wide' }),
      ],
    },
    { slug: 'shows', title: 'Shows', template: 'full-width', blocks: [B('seriesGrid', { title: 'All shows', seriesType: 'SHOW', count: 48, cardStyle: 'poster' }, { width: 'wide', paddingY: 'md' })] },
    {
      slug: 'new-popular', title: 'New & popular', template: 'full-width',
      blocks: [
        B('top10', { title: 'Top 10 episodes', source: 'posts', format: 'VIDEO' }, { width: 'wide', paddingY: 'md' }),
        B('mediaRail', { title: 'Just added', source: 'posts', format: 'VIDEO', sort: 'latest', count: 16, cardStyle: 'landscape' }, { width: 'wide', paddingY: 'sm' }),
        B('mediaRail', { title: 'Newest shows', source: 'series', seriesType: 'SHOW', sort: 'latest', count: 12, cardStyle: 'poster' }, { width: 'wide', paddingY: 'md' }),
      ],
    },
    commonPages.about('Marquee', 'Original stories from independent studios, streaming worldwide.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = await createCategories(prisma, [['Animation', '#e50914'], ['Documentary', '#f5c518'], ['Drama', '#a855f7']]);
    for (const [si, show] of SHOWS.entries()) {
      const s = await prisma.series.create({
        data: {
          title: show.title, slug: slug(show.title), type: 'SHOW', tagline: show.tagline, genres: show.genres, year: show.year, maturity: show.maturity,
          featured: !!show.featured, order: si, poster: pic(`marquee-poster-${si}`, 600, 900), backdrop: pic(`marquee-backdrop-${si}`, 1920, 1080),
          trailerUrl: yt(FILMS[show.seasons[0][0]][0]).videoUrl,
          description: `${show.tagline} A ${show.genres.join(' / ').toLowerCase()} series — every episode streaming now.`,
        },
      });
      const cat = show.genres.includes('Documentary') ? cats.Documentary : show.genres.includes('Drama') ? cats.Drama : cats.Animation;
      for (const [seasonIdx, eps] of show.seasons.entries()) {
        for (const [epIdx, key] of eps.entries()) {
          const [id, film, seconds] = FILMS[key];
          const date = hoursAgo(24 * (si * 2 + seasonIdx) + epIdx * 3 + 4);
          await prisma.post.create({
            data: {
              title: `${show.title}: ${film}`, slug: `${slug(show.title)}-s${seasonIdx + 1}e${epIdx + 1}`, format: 'VIDEO', ...yt(id), duration: seconds,
              status: 'PUBLISHED', publishedAt: date, createdAt: date, seriesId: s.id, season: seasonIdx + 1, episode: epIdx + 1,
              excerpt: `Season ${seasonIdx + 1}, episode ${epIdx + 1}. ${film} — an open movie from the Blender community.`,
              content: `<p><strong>${film}</strong> — episode ${epIdx + 1} of <em>${show.title}</em>. Released under Creative Commons.</p>`,
              views: rand(1000, 60000), likes: rand(50, 4000), authorId: authors[0].id, categories: { connect: [{ id: cat.id }] },
            },
          });
        }
      }
    }
    await seedFaqs(prisma, [
      ['What can I watch on Marquee?', 'Original shows, documentaries and animated series — new episodes every week.'],
      ['Where can I watch?', 'In any modern browser on your computer, phone, tablet or TV.'],
      ['How do I add new shows?', 'In the admin panel go to Shows & podcasts, create a show, then add episodes with “+ Episode”.'],
    ]);
  },
};
