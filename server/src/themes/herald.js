const { B, m, pic, slug, yt, hoursAgo, rand, FILMS, createCategories, commonPages, seedFaqs } = require('./helpers');

const NEWS = {
  World: ['Leaders agree on new framework for regional climate cooperation', 'Coastal cities race to adapt as sea levels rise faster than expected', 'Historic peace talks resume after a two-year pause', 'Global shipping routes shift as new trade corridor opens', 'Aid convoys reach flood-hit districts as waters recede'],
  Politics: ['Parliament passes landmark digital privacy bill', 'Election commission unveils new transparent counting system', 'Opposition calls for independent review of budget plan', 'Local councils to receive greater control over transport funds', 'Cabinet reshuffle brings younger faces to key ministries'],
  Business: ['Startups raise record funding in third quarter', 'Central bank holds interest rates steady amid cooling inflation', 'Electric vehicle makers announce shared charging network', 'Remote work reshapes office property market across the country', 'Garment exports hit new high on strong overseas demand'],
  Sports: ['Underdogs stun champions in dramatic final-minute victory', 'National team names young squad for upcoming tournament', 'Marathon record falls on a cool morning in the capital', 'Cricket board confirms new stadium for the coming season', 'Teen sprinter breaks 20-year-old national record'],
  Technology: ['New open-source AI model rivals commercial alternatives', 'Satellite internet reaches remote villages for the first time', 'Researchers unveil battery that charges in five minutes', 'Smartphone makers commit to seven years of software updates', 'City launches free public Wi-Fi across all bus routes'],
  Entertainment: ['Independent film sweeps awards at international festival', 'Streaming platforms bet big on regional language originals', 'Veteran band announces farewell tour across 30 cities', 'Animated feature breaks opening weekend box office record'],
  Health: ['Study links daily walks to sharply lower heart disease risk', 'Free vaccination drive reaches two million children', 'Hospitals adopt AI tools to cut emergency waiting times', 'Experts share practical tips for better sleep during heatwaves'],
};
const COLORS = { World: '#0369a1', Politics: '#b91c1c', Business: '#15803d', Sports: '#ea580c', Technology: '#7c3aed', Entertainment: '#be185d', Health: '#0f766e', Video: '#c4161c' };
const STRAPS = ['Exclusive', 'Analysis', 'Live', null, null];

const article = (title) => `
<p><strong>${title}.</strong> The development marks a significant moment, according to officials and independent analysts who spoke on Tuesday.</p>
<p>“This is a turning point,” said one senior figure familiar with the discussions. “What happens over the next few months will shape the years ahead.”</p>
<h2>What we know so far</h2>
<ul><li>The announcement was made earlier today following weeks of consultation.</li><li>Implementation is expected to begin within the next quarter.</li><li>Critics say more detail is needed on funding and oversight.</li></ul>
<p>Observers note that public reaction has been broadly positive, though several groups have called for further transparency.</p>
<h2>What happens next</h2>
<p>A follow-up review is scheduled, and further updates are expected as the situation develops. This story will be updated.</p>`;

const sections = ['World', 'Politics', 'Business', 'Sports', 'Technology', 'Entertainment', 'Health'];

module.exports = {
  id: 'herald',
  name: 'Herald',
  category: 'News portal',
  description: 'A newspaper-style portal with a masthead, breaking ticker, section fronts, most-read rankings and video stories.',
  features: { formats: ['STANDARD', 'GALLERY', 'VIDEO'], series: [], blocks: ['News', 'Headers', 'Interactive', 'Content', 'Media', 'Video', 'Conversion', 'Layout'] },
  layout: { header: 'masthead', article: 'news', listing: 'news' },
  general: { siteName: 'The Herald', tagline: 'Independent news, every hour.', postsPerPage: 12 },
  appearance: {
    preset: 'newsroom', primaryColor: '#c4161c', accentColor: '#0f4c81', backgroundColor: '#ffffff', surfaceColor: '#f4f4f2', textColor: '#121212',
    darkBackgroundColor: '#0f0f10', darkSurfaceColor: '#1a1a1c', darkTextColor: '#ededed', headingFont: 'Noto Serif', bodyFont: 'Roboto',
    radius: 2, colorMode: 'light', footerStyle: 'columns', blogLayout: 'list', containerWidth: 1280,
    headerCta: { enabled: true, label: 'Subscribe', url: '/contact' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: {
      name: 'Sections',
      items: [
        m('Home', '/'),
        ...sections.slice(0, 5).map((s) => m(s, `/category/${slug(s)}`)),
        m('Video', '/category/video'),
        // News-site style "More" mega menu with every section.
        m('More', '#', [
          m('News', '#', ['World', 'Politics', 'Business'].map((s) => m(s, `/category/${slug(s)}`))),
          m('Life', '#', ['Technology', 'Entertainment', 'Health', 'Sports'].map((s) => m(s, `/category/${slug(s)}`))),
          m('Watch & read', '#', [
            m('Video', '/category/video', [], { icon: 'Video', description: 'Reports and explainers' }),
            m('Saved stories', '/saved', [], { icon: 'Newspaper', description: 'Your reading list' }),
          ]),
          m('The Herald', '#', [m('About us', '/about'), m('Contact', '/contact'), m('FAQ', '/faq')]),
        ], { mega: true, image: pic('herald-mega', 800, 600), description: 'Independent news, every hour.' }),
      ],
    },
    footer: { name: 'Sections', items: sections.map((s) => m(s, `/category/${slug(s)}`)) },
    'footer-2': { name: 'The Herald', items: [m('About us', '/about'), m('Contact', '/contact'), m('FAQ', '/faq'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'herald-home', title: 'Home', home: true, template: 'landing', seoTitle: 'The Herald — latest news and analysis',
      blocks: [
        B('breakingNews', { label: 'Breaking', count: 6, breakingOnly: true, format: '', speed: 45 }, { paddingY: 'none', width: 'wide' }),
        B('newsHero', { layout: 'lead-center', category: '', format: 'STANDARD', count: 8, sort: 'latest' }, { paddingY: 'sm', width: 'wide' }),
        B('newsColumns', { count: 4, columns: [{ title: 'Politics', category: 'politics' }, { title: 'Business', category: 'business' }, { title: 'Sports', category: 'sports' }] }, { width: 'wide' }),
        B('latestWithSidebar', { title: 'Latest news', sidebarTitle: 'Most read', format: 'STANDARD', count: 6, sidebarCount: 6 }, { width: 'wide' }),
        B('mediaRail', { title: 'Video', source: 'posts', format: 'VIDEO', count: 10, cardStyle: 'landscape', linkLabel: 'All videos', linkUrl: '/category/video' }, { background: 'dark', width: 'wide' }),
        B('newsSection', { title: 'World', category: 'world', layout: 'lead-list', count: 5, linkLabel: 'More world news' }, { width: 'wide' }),
        B('newsSection', { title: 'Technology', category: 'technology', layout: 'overlay', count: 4, linkLabel: 'More technology' }, { background: 'surface', width: 'wide' }),
        B('newsColumns', { count: 4, columns: [{ title: 'Entertainment', category: 'entertainment' }, { title: 'Health', category: 'health' }] }, { width: 'wide' }),
        B('newsletter', { title: 'The morning briefing', text: 'The day’s most important stories, in your inbox at 7am.' }, { background: 'surface' }),
      ],
    },
    commonPages.about('The Herald', 'Independent journalism, published around the clock.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = await createCategories(prisma, Object.entries(COLORS));
    let h = 1;
    for (const section of sections) {
      for (const [i, title] of NEWS[section].entries()) {
        const date = hoursAgo(h);
        h += 2;
        await prisma.post.create({
          data: {
            title, slug: slug(title), format: 'STANDARD', status: 'PUBLISHED', publishedAt: date, createdAt: date,
            subtitle: STRAPS[i] || null, isBreaking: i === 0 && ['World', 'Politics', 'Sports'].includes(section),
            excerpt: 'Officials say the move could reshape the sector, while critics urge caution. Here is what you need to know.',
            content: article(title), coverImage: pic(`herald-${slug(title).slice(0, 24)}`), readingTime: 3,
            views: rand(300, 9000), authorId: authors[(h + i) % authors.length].id, categories: { connect: [{ id: cats[section].id }] },
          },
        });
      }
    }
    // A photo story.
    await prisma.post.create({
      data: {
        title: 'In pictures: a week of monsoon across the country', slug: 'in-pictures-a-week-of-monsoon', format: 'GALLERY', status: 'PUBLISHED',
        publishedAt: hoursAgo(5), subtitle: 'Photo story', excerpt: 'Our photographers capture life, work and play under the first heavy rains of the season.',
        content: '<p>From flooded markets to children playing in the rain, a week of monsoon in pictures.</p>', coverImage: pic('monsoon-0'),
        gallery: Array.from({ length: 7 }, (_, i) => ({ src: pic(`monsoon-${i}`, 1400, 933), caption: `Photo ${i + 1} — the monsoon arrives.` })),
        views: rand(2000, 6000), authorId: authors[0].id, categories: { connect: [{ id: cats.World.id }] },
      },
    });
    // Video stories.
    for (const [i, key] of ['spring', 'charge', 'cosmos', 'agent', 'sprite', 'hero'].entries()) {
      const [id, film, seconds] = FILMS[key];
      const title = `Watch: inside the making of “${film}”`;
      await prisma.post.create({
        data: {
          title, slug: slug(title), format: 'VIDEO', ...yt(id), duration: seconds, status: 'PUBLISHED', publishedAt: hoursAgo(3 + i * 6),
          excerpt: `Our culture desk looks at the open movie ${film} and the community that made it.`, content: `<p>Watch <strong>${film}</strong>, released under Creative Commons by the Blender Studio.</p>`,
          views: rand(3000, 20000), authorId: authors[1 % authors.length].id, categories: { connect: [{ id: cats.Video.id }, { id: cats.Entertainment.id }] },
        },
      });
    }
    await seedFaqs(prisma, [
      ['How do I submit a news tip?', 'Use our contact page. Tips can be anonymous and are read by our editors every day.'],
      ['How do I correct an error in a story?', 'Write to us via the contact page with the article link. We publish corrections promptly.'],
      ['Can I republish your articles?', 'Please contact us for syndication and licensing.'],
    ]);
  },
};
