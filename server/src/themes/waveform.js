const { B, m, pic, slug, mp3, hoursAgo, rand, createCategories, commonPages, seedFaqs } = require('./helpers');

const PODCASTS = [
  { title: 'The Blogerism Podcast', tagline: 'Conversations about building on the web.', genre: 'Technology', episodes: ['Why every team needs a design system', 'Shipping fast without breaking things', 'The future of headless CMS', 'Lessons from ten years of open source'] },
  { title: 'Design Matters Weekly', tagline: 'Short, sharp episodes on product design.', genre: 'Design', episodes: ['Typography in 15 minutes', 'Color systems for dark mode', 'Designing empty states'] },
  { title: 'Night Owls Radio', tagline: 'Late-night stories, music and calm conversation.', genre: 'Culture', episodes: ['Cities after midnight', 'The art of slow mornings', 'Songs that changed us'] },
];

module.exports = {
  id: 'waveform',
  name: 'Waveform',
  category: 'Podcast & audio',
  description: 'A warm podcast network with show artwork, episode lists and a player that keeps playing while you browse.',
  features: { formats: ['AUDIO', 'STANDARD'], series: ['PODCAST'], blocks: ['Audio', 'Headers', 'Interactive', 'Content', 'Media', 'Conversion', 'Layout'] },
  layout: { header: 'default', article: 'blog', listing: 'audio' },
  general: { siteName: 'Waveform', tagline: 'Stories worth listening to.' },
  appearance: {
    preset: 'waveform', primaryColor: '#f97316', accentColor: '#ec4899', backgroundColor: '#fffaf5', surfaceColor: '#fff1e6', textColor: '#1c1310',
    darkBackgroundColor: '#120c09', darkSurfaceColor: '#1f1512', darkTextColor: '#fbeee6', headingFont: 'Bricolage Grotesque', bodyFont: 'DM Sans',
    radius: 22, colorMode: 'system', headerStyle: 'glass', footerStyle: 'simple',
    headerCta: { enabled: true, label: 'Start listening', url: '/episodes' },
    announcement: { enabled: true, text: 'New: Night Owls Radio — late-night stories, every Friday.', linkLabel: 'Listen', url: '/series/night-owls-radio' },
  },
  menus: {
    header: { name: 'Main menu', items: [m('Home', '/'), m('Shows', '/shows'), m('Episodes', '/episodes'), m('About', '/about'), m('Contact', '/contact')] },
    footer: { name: 'Waveform', items: [m('Shows', '/shows'), m('About', '/about'), m('FAQ', '/faq'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'waveform-home', title: 'Home', home: true, template: 'landing', seoTitle: 'Waveform — stories worth listening to',
      blocks: [
        B('hero', { variant: 'centered', eyebrow: 'New episodes every week', title: 'Stories worth listening to', subtitle: 'Original podcasts on design, technology and culture. Press play and keep browsing — the player follows you.', primaryLabel: 'Browse shows', primaryUrl: '/shows', secondaryLabel: 'Latest episodes', secondaryUrl: '/episodes' }, { background: 'gradient', paddingY: 'lg', animate: true }),
        B('seriesGrid', { title: 'Our shows', seriesType: 'PODCAST', count: 8, cardStyle: 'square' }),
        B('audioPlaylist', { title: 'Latest episodes', series: '', count: 6, sort: 'latest' }, { background: 'surface', width: 'narrow', paddingY: 'lg' }),
        B('audioPlaylist', { title: 'Most played', series: '', count: 4, sort: 'popular' }, { width: 'narrow' }),
        B('newsletter', { title: 'Never miss an episode', text: 'Get new episodes and show notes in your inbox.' }, { background: 'surface' }),
      ],
    },
    { slug: 'shows', title: 'Shows', blocks: [B('pageHeader', { title: 'All shows', subtitle: 'Pick a show and press play.' }, { background: 'gradient' }), B('seriesGrid', { title: '', seriesType: 'PODCAST', count: 24, cardStyle: 'square' })] },
    { slug: 'episodes', title: 'Episodes', blocks: [B('pageHeader', { title: 'All episodes', subtitle: 'The latest from every Waveform show.' }, { background: 'gradient' }), B('audioPlaylist', { title: '', count: 40, sort: 'latest' }, { width: 'narrow', paddingY: 'lg' })] },
    commonPages.about('Waveform', 'An independent podcast network for curious minds.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = await createCategories(prisma, [['Technology', '#f97316'], ['Design', '#ec4899'], ['Culture', '#8b5cf6']]);
    let song = 1;
    for (const [pi, pod] of PODCASTS.entries()) {
      const s = await prisma.series.create({
        data: { title: pod.title, slug: slug(pod.title), type: 'PODCAST', tagline: pod.tagline, genres: [pod.genre], poster: pic(`waveform-${pi}`, 800, 800), backdrop: pic(`waveform-bg-${pi}`, 1920, 1080), order: pi, featured: pi === 0, description: `${pod.tagline} New episodes every week.` },
      });
      for (const [ei, title] of pod.episodes.entries()) {
        const date = hoursAgo(24 * 5 * (pod.episodes.length - ei) + pi * 20);
        await prisma.post.create({
          data: {
            title, slug: slug(`${pod.title} ${title}`), format: 'AUDIO', audioUrl: mp3(song++), duration: 300 + ((ei * 47 + pi * 31) % 140),
            coverImage: s.poster, status: 'PUBLISHED', publishedAt: date, createdAt: date, seriesId: s.id, season: 1, episode: ei + 1,
            excerpt: `Episode ${ei + 1}: ${title}.`,
            content: `<h2>Show notes</h2><p>In this episode of <em>${pod.title}</em> we talk about ${title.toLowerCase()}.</p><ul><li>00:00 — Intro</li><li>02:30 — Main discussion</li><li>12:00 — Listener questions</li></ul>`,
            views: rand(200, 6000), likes: rand(20, 900), authorId: authors[1 % authors.length].id, categories: { connect: [{ id: cats[pod.genre].id }] },
          },
        });
      }
    }
    await seedFaqs(prisma, [
      ['How do I listen?', 'Press play on any episode — the player stays at the bottom of the screen while you browse.'],
      ['Can I download episodes?', 'Yes, every episode page has a download link.'],
      ['How do I pitch a guest?', 'Send us a message via the contact page.'],
    ]);
  },
};
