const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });

const P = {
  sphere: '1618005198919-d3d4b5a92ead', wave: '1618005182384-a83a8bd57fbe', blueWaves: '1634017839464-5c339ebe3cb4', fluid: '1557672172-298e090bd0f1',
  gradient: '1579546929518-9e396f3cc809', orange: '1604079628040-94301bb21b91', screen: '1559028012-481c04fa702d', designer: '1542744094-3a31f272c490',
  swatches: '1561070791-2526d30994b5', wireframes: '1522542550221-31fd19575a2d', blueprint: '1600132806370-bf17e65e942f', uxWall: '1531403009284-440f080d1e12',
  flatlay: '1541462608143-67571c6738dd', desk: '1497032628192-86f99bcd76bc', laptop: '1515378791036-0648a3ef77b2', retro: '1550745165-9bc0b252726f',
  tablet: '1558655146-9f40138edfeb', team: '1522071820081-009f0129c71c', loft: '1559136555-9303baea8ebd', sticky: '1552664730-d307ca884978',
};

const WORK = [
  { image: un(P.wave, 1400), client: 'Lumen Bank', title: 'Rebranding a challenger bank for its next 10 million customers', text: 'A new identity, motion system and app design language that made a fintech feel human — launched across 14 markets in a single day.', metrics: [{ value: '+212%', label: 'App downloads' }, { value: '14', label: 'Markets launched' }], tags: ['Brand', 'Motion', 'App'], url: '/contact' },
  { image: un(P.screen, 1400), client: 'Orbit Studios', title: 'A website that sells tickets while you scroll', text: 'An immersive, story-led site for a cinema chain with real-time seat selection built right into the page.', metrics: [{ value: '+68%', label: 'Online bookings' }, { value: '1.2s', label: 'Load time' }], tags: ['Web', 'E-commerce'], url: '/contact' },
  { image: un(P.blueWaves, 1400), client: 'Tidal Energy', title: 'Making renewable energy impossible to ignore', text: 'Campaign strategy, film and an interactive data story that reached 40 million people in its first month.', metrics: [{ value: '40M', label: 'People reached' }, { value: '3', label: 'Industry awards' }], tags: ['Campaign', 'Film'], url: '/contact' },
  { image: un(P.fluid, 1400), client: 'Bloom Skincare', title: 'From kitchen-table brand to global shelf', text: 'Packaging, e-commerce and launch content for a skincare brand now sold in 2,000 stores.', metrics: [{ value: '5x', label: 'Revenue in 18 months' }, { value: '2,000', label: 'Retail doors' }], tags: ['Packaging', 'Commerce'], url: '/contact' },
];

const SERVICES = [
  ['Compass', 'Brand strategy', 'Positioning, naming and narrative that give your brand a reason to exist.', P.sticky],
  ['PenTool', 'Identity & design systems', 'Logos, type, colour and the systems that keep them consistent everywhere.', P.swatches],
  ['Monitor', 'Websites & products', 'Fast, accessible, beautifully crafted digital experiences that convert.', P.designer],
  ['Film', 'Motion & film', 'Brand films, product animation and social content that stops the scroll.', P.tablet],
  ['Megaphone', 'Campaigns', 'Integrated launches across digital, social, OOH and everything in between.', P.uxWall],
];

const POSTS = [
  ['Process', 'Why we start every project with a one-page brief', 'The constraint that makes everything after it faster and better.', P.sticky],
  ['Design', 'Variable fonts are the most underrated tool in branding', 'How one font file can carry an entire brand’s personality.', P.swatches],
  ['Studio', 'Inside the studio: how we run a four-day week', 'Two years in, here is what we learned about doing better work in less time.', P.loft],
  ['Design', 'Motion principles for brands that want to feel alive', 'Timing, easing and restraint — our five rules for animation.', P.gradient],
  ['Process', 'How to brief a design agency (and get great work back)', 'A template we wish every client used.', P.desk],
];

const body = (t) => `<p>${t}. Notes from our studio on craft, process and the work behind the work.</p><h2>The idea</h2><p>Great creative work rarely comes from a blank page. It comes from a sharp question, honest constraints and a team that trusts each other enough to throw ideas away.</p><blockquote><p>“Design is the conversation between what a brand says and what people actually feel.”</p></blockquote><h2>In practice</h2><ul><li>Write the brief on one page.</li><li>Show work early, and often.</li><li>Kill your darlings — then kill a few more.</li></ul><p>Have a project in mind? <a href="/contact">Let’s talk</a>.</p>`;

module.exports = {
  id: 'kinetic',
  name: 'Kinetic',
  category: 'Creative agency',
  description: 'A bold studio website: fixed sidebar navigation, giant kinetic-type hero with rotating words and spinning badge, sticky stacking case studies, services list and a statement footer.',
  features: { formats: ['STANDARD', 'GALLERY'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Content', 'Media', 'Conversion', 'Dynamic', 'Layout'] },
  layout: { header: 'sidebar', article: 'blog', listing: 'cards' },
  general: { siteName: 'Kinetic', tagline: 'Have a bold idea? Let’s make it move.' },
  contact: { email: 'hello@kinetic.studio', phone: '+44 20 7946 0321', address: '14 Redchurch Street, London E2 7DJ', workingHours: 'Mon – Thu, 9:30 – 18:00' },
  social: { instagram: 'https://instagram.com', linkedin: 'https://linkedin.com', twitter: 'https://x.com', youtube: '', facebook: '', github: '' },
  seo: { metaTitle: 'Kinetic — Independent creative studio', metaDescription: 'Brand strategy, identity, websites, motion and campaigns for ambitious companies.' },
  appearance: {
    preset: 'kinetic', primaryColor: '#ff3d00', accentColor: '#7c3aed', backgroundColor: '#f5f3ee', surfaceColor: '#ebe7df', textColor: '#111111',
    darkBackgroundColor: '#0c0c0c', darkSurfaceColor: '#171717', darkTextColor: '#f1efe9', headingFont: 'Syne', bodyFont: 'Inter',
    radius: 6, colorMode: 'light', headerStyle: 'solid', headerSticky: true, footerStyle: 'big', containerWidth: 1280, backToTop: true, blogLayout: 'grid',
    footerText: 'Independent since 2014.',
    headerCta: { enabled: true, label: 'Start a project', url: '/contact' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Home', '/'),
        m('Work', '/work'),
        m('Services', '/services'),
        m('Studio', '/studio', [m('About', '/studio'), m('Careers', '/studio#careers')]),
        m('Journal', '/blog'),
        m('Contact', '/contact'),
      ],
    },
    footer: { name: 'Studio', items: [m('Work', '/work'), m('Services', '/services'), m('About', '/studio'), m('Careers', '/studio#careers')] },
    'footer-2': { name: 'More', items: [m('Journal', '/blog'), m('FAQ', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'kinetic-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Kinetic — Independent creative studio',
      blocks: [
        B('kineticHero', {
          eyebrow: 'Independent creative studio — London', lines: ['We build', 'brands that'], rotate: ['move people.', 'stand out.', 'grow fast.', 'feel alive.'],
          subtitle: 'Kinetic is a studio of strategists, designers and makers creating brands, websites and campaigns for companies with something to say.',
          primaryLabel: 'See our work', primaryUrl: '#work', secondaryLabel: 'Start a project', secondaryUrl: '/contact',
          image: un(P.sphere, 500), badge: 'Scroll to explore ✦ Scroll to explore ✦ ', marquee: ['Brand strategy', 'Identity', 'Websites', 'Motion', 'Campaigns', 'Packaging'],
        }, { paddingY: 'xl', width: 'wide', animate: false }),
        B('logoWall', { title: 'Trusted by teams who care about craft', variant: 'grid', speed: 30, logos: ['Lumen', 'Orbit', 'Tidal', 'Bloom', 'Northwind', 'Polar', 'Helix', 'Quanta'].map((name) => ({ name, image: '', url: '' })) }, { paddingY: 'lg', width: 'wide' }),
        B('caseStudies', { eyebrow: 'Selected work', title: 'Work that moved the needle', subtitle: 'A few recent projects we are proud of.', variant: 'stack', items: WORK }, { paddingY: 'xl', width: 'wide', anchor: 'work' }),
        B('serviceCards', { eyebrow: 'Services', title: 'What we do best', subtitle: '', variant: 'rows', columns: 3, buttonLabel: 'All services', buttonUrl: '/services',
          items: SERVICES.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 600), url: '/services', linkLabel: '' })) }, { paddingY: 'xl', width: 'wide' }),
        B('stats', { items: [{ value: '12', label: 'Years independent' }, { value: '180+', label: 'Brands launched' }, { value: '34', label: 'Awards won' }, { value: '28', label: 'Makers in the studio' }] }, { background: 'surface', paddingY: 'lg', width: 'wide' }),
        B('steps', { eyebrow: 'Process', title: 'How a Kinetic project works', subtitle: '', variant: 'cards', items: [
          { icon: 'Lightbulb', title: 'Discover', text: 'Workshops, research and a one-page brief we all sign up to.' },
          { icon: 'PenTool', title: 'Define', text: 'Strategy and creative territories, tested with real people.' },
          { icon: 'Code2', title: 'Design & build', text: 'Weekly reviews, clickable prototypes and production-ready code.' },
          { icon: 'Rocket', title: 'Launch & grow', text: 'We launch together and stay on to optimise what works.' },
        ] }, { paddingY: 'xl', width: 'wide' }),
        B('team', { eyebrow: 'The studio', title: 'Small team. Big ideas.', subtitle: '', variant: 'cards', columns: 4, members: [
          { name: 'Zoe Laurent', role: 'Founder & Creative Director', image: face('w3'), bio: 'Fifteen years leading brand work at global studios.', linkedin: '#', twitter: '#', email: '' },
          { name: 'Kai Andersen', role: 'Design Director', image: face('m7'), bio: 'Type nerd. Grid enthusiast. Occasional DJ.', linkedin: '#', twitter: '', email: '' },
          { name: 'Maya Brooks', role: 'Strategy Lead', image: face('w1'), bio: 'Turns messy problems into one sharp sentence.', linkedin: '#', twitter: '', email: '' },
          { name: 'Theo Nakamura', role: 'Technical Director', image: face('m2'), bio: 'Builds fast websites that feel like magic.', linkedin: '#', twitter: '#', email: '' },
        ] }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
        B('testimonials', { eyebrow: 'Kind words', title: 'Clients say it better' }, { paddingY: 'xl', width: 'wide' }),
        B('ctaBanner', { variant: 'split', image: un(P.gradient, 1400), eyebrow: 'New business', title: 'Got a project? Let’s make it move.', text: 'Tell us what you are working on — we reply to every brief within two days.', primaryLabel: 'Start a project', primaryUrl: '/contact', secondaryLabel: 'hello@kinetic.studio', secondaryUrl: 'mailto:hello@kinetic.studio', phone: '' }, { paddingY: 'lg', width: 'wide' }),
      ],
    },
    {
      slug: 'work', title: 'Work', template: 'default', seoTitle: 'Work — Kinetic',
      blocks: [
        B('kineticHero', { eyebrow: 'Selected work 2019 – 2026', lines: ['Our'], rotate: ['work.', 'craft.', 'results.'], subtitle: 'Brand, digital and campaign projects for ambitious companies around the world.', primaryLabel: '', primaryUrl: '', secondaryLabel: '', secondaryUrl: '', image: '', badge: 'Selected work ✦ Selected work ✦ ', marquee: [] }, { paddingY: 'lg', width: 'wide', animate: false }),
        B('caseStudies', { eyebrow: '', title: '', subtitle: '', variant: 'grid', items: WORK }, { paddingY: 'lg', width: 'wide' }),
        B('masonryGallery', { eyebrow: 'Studio archive', title: 'Explorations & side projects', subtitle: '', columns: 3, filters: true, items: [
          [P.wave, 'Liquid identity', 'Motion'], [P.swatches, 'Colour studies', 'Identity'], [P.retro, 'Arcade campaign', 'Campaign'], [P.blueprint, 'Wayfinding system', 'Identity'],
          [P.orange, 'Glow gradient kit', 'Motion'], [P.wireframes, 'Product sketches', 'Digital'], [P.flatlay, 'Studio stationery', 'Identity'], [P.screen, 'Dashboard UI', 'Digital'], [P.fluid, 'Packaging textures', 'Campaign'],
        ].map(([id, title, category]) => ({ src: un(id, 900), title, category, caption: '' })) }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
      ],
    },
    {
      slug: 'services', title: 'Services', template: 'default', seoTitle: 'Services — Kinetic',
      blocks: [
        B('pageHeader', { title: 'Services', subtitle: 'Five disciplines, one studio — so your brand looks and feels the same everywhere.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('serviceCards', { eyebrow: '', title: '', subtitle: '', variant: 'image', columns: 3, items: SERVICES.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 900), url: '/contact', linkLabel: 'Start a project' })) }, { paddingY: 'xl', width: 'wide' }),
        B('comparison', { eyebrow: 'Engagements', title: 'Ways to work with us', columns: ['Sprint', 'Project', 'Partnership'], highlight: 2, highlightLabel: 'Most popular', groups: false, rows: [
          { group: '', feature: 'Duration', values: ['2 weeks', '6 – 16 weeks', 'Ongoing'] },
          { group: '', feature: 'Brand strategy', values: ['Workshop', 'yes', 'yes'] },
          { group: '', feature: 'Identity & design system', values: ['no', 'yes', 'yes'] },
          { group: '', feature: 'Website or product', values: ['Prototype', 'yes', 'yes'] },
          { group: '', feature: 'Dedicated team', values: ['no', 'yes', 'yes'] },
          { group: '', feature: 'From', values: ['£12k', '£45k', '£15k / month'] },
        ], buttons: [{ label: 'Book a sprint', url: '/contact' }, { label: 'Start a project', url: '/contact' }, { label: 'Let’s talk', url: '/contact' }] }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
        B('faq', { eyebrow: 'FAQ', title: 'Before we start' }, { paddingY: 'xl' }),
      ],
    },
    {
      slug: 'studio', title: 'Studio', template: 'default', seoTitle: 'Studio — Kinetic',
      blocks: [
        B('pageHeader', { title: 'A studio built for craft', subtitle: '28 makers, one four-day week and a stubborn belief that work should be fun.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('accordionImage', { eyebrow: 'How we work', title: 'Small, senior and fully independent', subtitle: '', imagePosition: 'right', autoplay: true, items: [
          { title: 'No account managers', text: 'You talk directly to the people doing the work.', image: un(P.team, 1200) },
          { title: 'A four-day week', text: 'Rested people make better work. Fridays are for learning, side projects and life.', image: un(P.loft, 1200) },
          { title: 'Independent forever', text: 'No holding company, no shareholders — just clients and craft.', image: un(P.desk, 1200) },
        ] }, { paddingY: 'xl', width: 'wide' }),
        B('jobs', { eyebrow: 'Careers', title: 'Join the studio', subtitle: 'We hire kind, curious people who love their craft.', applyEmail: 'jobs@kinetic.studio', items: [
          { title: 'Senior Brand Designer', department: 'Design', location: 'London', type: 'Full-time', description: 'Lead identity projects from first sketch to final guidelines.', url: '' },
          { title: 'Creative Developer', department: 'Technology', location: 'London / Remote', type: 'Full-time', description: 'Build expressive, high-performance websites with WebGL and motion.', url: '' },
          { title: 'Motion Designer', department: 'Motion', location: 'London', type: 'Freelance', description: 'Bring identities to life for launch films and social.', url: '' },
        ] }, { background: 'surface', paddingY: 'xl', anchor: 'careers' }),
      ],
    },
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Design', '#ff3d00'], ['Process', '#7c3aed'], ['Studio', '#111111']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 5 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 5, views: rand(200, 4000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Hannah Weiss', position: 'CMO', company: 'Lumen Bank', avatar: face('w5', 200), content: 'Kinetic gave us a brand our customers genuinely love. The launch was the most talked-about moment in our company’s history.', rating: 5, order: 0 },
        { name: 'Oscar Diaz', position: 'Founder', company: 'Bloom Skincare', avatar: face('m6', 200), content: 'They thought like owners, not suppliers. Our packaging redesign alone doubled sell-through.', rating: 5, order: 1 },
        { name: 'Ruth Adeyemi', position: 'Head of Digital', company: 'Orbit Studios', avatar: face('w7', 200), content: 'The fastest, most beautiful website we have ever had — and it keeps winning awards.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['What size of companies do you work with?', 'From funded start-ups to global brands. What matters most is ambition and a willingness to be bold.'],
      ['How much does a project cost?', 'Most brand and website projects range from £45k to £250k. Two-week sprints start at £12k.'],
      ['How long does a rebrand take?', 'Typically 10 to 16 weeks from kickoff to launch-ready guidelines.'],
      ['Do you work with clients outside the UK?', 'Yes — around half of our clients are in Europe, the US and Asia.'],
      ['Can you work with our in-house team?', 'Absolutely. Many of our best projects are true collaborations with in-house designers and engineers.'],
    ]);
  },
};
