const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };

const P = {
  kids: '1488521787991-ed7bbaae773c', kids2: '1509099836639-18ba1795216d', kidsGroup: '1497486751825-1233686d5d80', kidsSeated: '1542810634-71277d95dcbb',
  kidsPlay: '1594708767771-a7502209ff51', writing: '1529390079861-591de354faf5', handsHeart: '1469571486292-0ba58a3f068b', community: '1491438590914-bc09fcaaf77a',
  volunteer: '1559027615-cd4628902d4a', boxes: '1593113598332-cd288d649433', helping: '1578357078586-491adf1aa5ba', reaching: '1544027993-37dbfe43562a',
  coins: '1532629345422-7515f3d16bb6', seedlings: '1466692476868-aef1dfb1e735', soil: '1416879595882-3373a0480b5b', field: '1500382017468-9049fed747ef',
  recycling: '1532996122724-e3c354a0b15b', food: '1547496502-affa22d38842', classroom: '1509062522246-3755977927d7', lake: '1501785888041-af3ef285b470',
};

const PROGRAMS = [
  ['Droplets', 'Clean water', 'Wells, filters and hygiene training that bring safe water to whole villages.', P.lake],
  ['School', 'Education', 'Classrooms, teachers and school meals so every child can learn.', P.writing],
  ['Utensils', 'Food security', 'Community gardens and emergency food parcels for families in crisis.', P.food],
  ['Sprout', 'Reforestation', 'Native trees planted with local farmers to restore land and livelihoods.', P.seedlings],
];

const S = (time, title, host, location, tag = '') => ({ time, title, host, location, tag });
const EVENTS = [
  { label: 'November', sessions: [S('8 Nov', 'Community Tree-Planting Day', 'Riverside Park', '09:00 – 13:00', 'Volunteers'), S('16 Nov', 'Charity 10K Run', 'City Waterfront', '08:00 start', 'Popular'), S('28 Nov', 'Giving Tuesday Live', 'Online', '18:00 – 21:00')] },
  { label: 'December', sessions: [S('6 Dec', 'Winter Food Drive', 'All community hubs', 'All day', 'Donate'), S('12 Dec', 'Annual Gala Dinner', 'The Grand Hall', '19:00', 'Tickets'), S('20 Dec', 'Holiday Gift Wrapping', 'Main office', '10:00 – 16:00', 'Volunteers')] },
  { label: 'January', sessions: [S('18 Jan', 'Volunteer Orientation', 'Main office & online', '10:00 – 12:00', 'New'), S('25 Jan', 'Impact Report Launch', 'Online', '17:00')] },
];

const POSTS = [
  ['Impact', 'One year, one village: the story of Kalanga’s new well', 'How clean water changed school attendance, health and income in twelve months.', P.kids2],
  ['News', 'Our 2026 impact report is here', '1.2 million people reached — and exactly where every dollar went.', P.community],
  ['Volunteering', 'Ten ways to help that don’t cost a thing', 'Your time, voice and skills can be as powerful as a donation.', P.volunteer],
  ['Impact', 'Planting 500,000 trees with 2,000 farmers', 'Inside our largest reforestation programme yet.', P.seedlings],
  ['News', 'Winter food drive: how to get involved', 'Drop-off points, volunteer shifts and what families need most.', P.boxes],
];

const body = (t) => `<p>${t}. Stories like this are only possible because of supporters like you.</p><h2>The challenge</h2><p>Lasting change starts with listening. We work alongside local communities to understand what they need — and then we build it together.</p><blockquote><p>“We don’t do things for communities. We do them with communities.”</p></blockquote><h2>How you can help</h2><ul><li><a href="/donate">Give once or monthly</a> — 92% goes directly to programmes.</li><li>Volunteer at one of our events.</li><li>Share our work with your friends.</li></ul>`;

module.exports = {
  id: 'evergreen',
  name: 'Evergreen',
  category: 'Nonprofit & charity',
  description: 'A hopeful, conversion-focused charity website: slideshow hero, trust strip, donation widget with live goal and impact per amount, programmes, impact stories, events calendar and volunteering.',
  features: { formats: ['STANDARD', 'GALLERY'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Content', 'Conversion', 'Dynamic', 'Media', 'Layout'] },
  layout: { header: 'default', article: 'blog', listing: 'cards' },
  general: { siteName: 'Evergreen', tagline: 'Together, we grow brighter futures.' },
  contact: { email: 'hello@evergreen-foundation.example', phone: '+1 (503) 555-0177', address: '520 SW Yamhill Street, Portland, OR 97204', workingHours: 'Mon – Fri, 9:00 – 17:00' },
  social: { facebook: 'https://facebook.com', instagram: 'https://instagram.com', youtube: 'https://youtube.com', linkedin: 'https://linkedin.com', twitter: '', github: '' },
  seo: { metaTitle: 'Evergreen — Clean water, education & food for every community', metaDescription: 'Evergreen partners with communities to provide clean water, education, food security and reforestation. 92% of donations go directly to programmes.' },
  appearance: {
    preset: 'evergreen', primaryColor: '#15803d', accentColor: '#f97316', backgroundColor: '#fcfcf7', surfaceColor: '#eff4e9', textColor: '#14210f',
    darkBackgroundColor: '#0b120a', darkSurfaceColor: '#141f12', darkTextColor: '#e8f0e4', headingFont: 'Red Hat Display', bodyFont: 'Nunito',
    radius: 16, colorMode: 'light', headerStyle: 'solid', headerSticky: true, footerStyle: 'columns', containerWidth: 1240, backToTop: true, blogLayout: 'grid',
    footerText: 'Registered nonprofit. Donations are tax-deductible where applicable.',
    headerCta: { enabled: true, label: 'Donate', url: '/donate' },
    announcement: { enabled: true, text: 'Winter appeal: every gift is matched until 31 December.', linkLabel: 'Double your impact', url: '/donate' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Home', '/'),
        m('Our work', '/programs', PROGRAMS.map(([icon, title]) => m(title, '/programs', [], { icon }))),
        m('Get involved', '/get-involved', [m('Volunteer', '/get-involved'), m('Events', '/get-involved#events'), m('Fundraise', '/get-involved')]),
        m('Stories', '/blog'),
        m('About', '/about'),
      ],
    },
    footer: { name: 'Our work', items: PROGRAMS.map(([, title]) => m(title, '/programs')) },
    'footer-2': { name: 'Get involved', items: [m('Donate', '/donate'), m('Volunteer', '/get-involved'), m('Events', '/get-involved#events'), m('FAQ', '/faq'), m('Contact', '/contact')] },
  },
  pages: () => [
    {
      slug: 'evergreen-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Evergreen — Together, we grow brighter futures',
      blocks: [
        B('heroSlideshow', { height: 'tall', align: 'center', interval: 6, slides: [
          { image: un(P.kids, 2200), eyebrow: 'Clean water · Education · Food · Forests', title: 'Every child deserves a brighter tomorrow', subtitle: 'Join 40,000 supporters building healthier, more hopeful communities.', buttonLabel: 'Donate today', buttonUrl: '/donate' },
          { image: un(P.volunteer, 2200), eyebrow: 'Volunteers make it happen', title: 'Give your time. Change a life.', subtitle: 'From tree-planting days to food drives, there is a role for everyone.', buttonLabel: 'Get involved', buttonUrl: '/get-involved' },
          { image: un(P.field, 2200), eyebrow: 'Reforestation', title: '500,000 trees and counting', subtitle: 'Restoring land and livelihoods with 2,000 local farmers.', buttonLabel: 'See our work', buttonUrl: '/programs' },
        ] }, HERO),
        B('trustBar', { variant: 'strip', items: [
          { icon: 'PieChart', title: '92% to programmes', text: 'Only 8% on fundraising and admin.' },
          { icon: 'BadgeCheck', title: 'Fully transparent', text: 'Audited accounts, published yearly.' },
          { icon: 'Users', title: 'Community-led', text: 'Local partners in 18 countries.' },
          { icon: 'HeartPulse', title: '1.2M lives reached', text: 'In 2026 alone.' },
        ] }, { background: 'surface', paddingY: 'lg' }),
        B('donation', { eyebrow: 'Winter appeal', title: 'Help us bring clean water to 50 more villages', text: 'Every gift is matched until 31 December — so your donation goes twice as far.', image: un(P.kids2, 1000), currency: '$', goal: 250000, raised: 168400, supporters: 3120, amounts: ['25', '50', '100', '250'],
          impact: [{ amount: '25', text: 'provides a family water filter for a year' }, { amount: '50', text: 'buys school supplies for five children' }, { amount: '100', text: 'feeds a family of four for a month' }, { amount: '250', text: 'plants 250 native trees with local farmers' }],
          monthly: true, buttonLabel: 'Donate', url: '/donate' }, { paddingY: 'xl' }),
        B('serviceCards', { eyebrow: 'Our work', title: 'Four programmes, one goal: thriving communities', subtitle: '', variant: 'image', columns: 4, buttonLabel: 'Explore our work', buttonUrl: '/programs',
          items: PROGRAMS.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 800), url: '/programs', linkLabel: 'Learn more' })) }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
        B('stats', { items: [{ value: '1.2M', label: 'People reached in 2026' }, { value: '840', label: 'Wells built' }, { value: '500,000', label: 'Trees planted' }, { value: '18', label: 'Countries' }] }, { background: 'primary', paddingY: 'lg' }),
        B('caseStudies', { eyebrow: 'Stories of change', title: 'What your support makes possible', subtitle: '', variant: 'grid', items: [
          { image: un(P.writing, 1200), client: 'Education · Uganda', title: 'Amani’s school now has teachers, books and lunch every day', text: 'Since the school-meals programme began, attendance has nearly doubled — and so have exam results.', metrics: [{ value: '+92%', label: 'Attendance' }, { value: '640', label: 'Children fed daily' }], tags: ['Education'], url: '/blog' },
          { image: un(P.community, 1200), client: 'Water · Kenya', title: 'A well that gave a whole village its mornings back', text: 'Women in Kalanga used to walk four hours a day for water. Now it is two minutes from home.', metrics: [{ value: '4 hrs', label: 'Saved every day' }, { value: '1,800', label: 'People served' }], tags: ['Clean water'], url: '/blog' },
        ] }, { paddingY: 'xl' }),
        B('schedule', { eyebrow: 'Events', title: 'Join us in person', subtitle: 'Volunteer days, runs and our annual gala — everyone is welcome.', buttonLabel: 'Sign up', buttonUrl: '/get-involved', hostIcon: 'MapPin', locationIcon: 'Clock', days: EVENTS }, { background: 'surface', paddingY: 'xl', anchor: 'events' }),
        B('testimonials', { eyebrow: 'Voices', title: 'From our supporters and partners' }, { paddingY: 'xl' }),
        B('logoWall', { title: 'With thanks to our partners', variant: 'marquee', speed: 35, logos: ['Greenleaf Fund', 'Riverstone', 'Blue Horizon', 'Northwind', 'Harvest Co.', 'Brightway', 'Open Hands', 'Terra Labs'].map((name) => ({ name, image: '', url: '' })) }, { paddingY: 'md' }),
        B('ctaBanner', { variant: 'image', image: un(P.handsHeart, 1800), eyebrow: 'Volunteer', title: 'Your time can change a life', text: 'Join 2,500 volunteers at food drives, planting days and fundraising events.', primaryLabel: 'Become a volunteer', primaryUrl: '/get-involved', secondaryLabel: 'Fundraise for us', secondaryUrl: '/get-involved', phone: '' }, { paddingY: 'lg', width: 'wide' }),
        B('newsletter', { title: 'Stories of hope, monthly', text: 'Get impact updates and stories from the field in your inbox.' }, { background: 'surface', paddingY: 'lg' }),
      ],
    },
    {
      slug: 'donate', title: 'Donate', template: 'default', seoTitle: 'Donate — Evergreen',
      blocks: [
        B('donation', { eyebrow: 'Donate', title: 'Give hope that lasts', text: '92 cents of every dollar goes directly to our programmes. Monthly gifts help us plan ahead.', image: un(P.kidsGroup, 1000), currency: '$', goal: 250000, raised: 168400, supporters: 3120, amounts: ['25', '50', '100', '250'],
          impact: [{ amount: '25', text: 'provides a family water filter for a year' }, { amount: '50', text: 'buys school supplies for five children' }, { amount: '100', text: 'feeds a family of four for a month' }, { amount: '250', text: 'plants 250 native trees with local farmers' }],
          monthly: true, buttonLabel: 'Donate', url: '/contact' }, { paddingY: 'xl' }),
        B('trustBar', { variant: 'strip', items: [
          { icon: 'Lock', title: 'Secure payments', text: 'Encrypted and PCI compliant.' },
          { icon: 'FileText', title: 'Tax receipts', text: 'Sent instantly by email.' },
          { icon: 'PieChart', title: '92% to programmes', text: 'Audited every year.' },
        ] }, { background: 'surface', paddingY: 'lg' }),
        B('faq', { eyebrow: 'FAQ', title: 'About giving' }, { paddingY: 'xl' }),
      ],
    },
    {
      slug: 'programs', title: 'Our work', template: 'default', seoTitle: 'Our work — Evergreen',
      blocks: [
        B('pageHeader', { title: 'Our work', subtitle: 'Four programmes designed with communities, measured honestly and built to last.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('serviceCards', { eyebrow: '', title: '', subtitle: '', variant: 'rows', columns: 3, items: PROGRAMS.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 600), url: '/donate', linkLabel: '' })) }, { paddingY: 'xl' }),
        B('stats', { items: [{ value: '840', label: 'Wells built' }, { value: '120', label: 'Schools supported' }, { value: '2.4M', label: 'Meals served' }, { value: '500,000', label: 'Trees planted' }] }, { background: 'primary', paddingY: 'lg' }),
        B('masonryGallery', { eyebrow: 'In the field', title: 'Moments from our programmes', subtitle: '', columns: 3, filters: false, items: [P.kidsSeated, P.seedlings, P.boxes, P.kidsPlay, P.soil, P.classroom].map((id) => ({ src: un(id, 900), title: '', category: '', caption: '' })) }, { paddingY: 'xl', width: 'wide' }),
      ],
    },
    {
      slug: 'get-involved', title: 'Get involved', template: 'default', seoTitle: 'Get involved — Evergreen',
      blocks: [
        B('pageHeader', { title: 'Get involved', subtitle: 'Volunteer, fundraise, attend an event — every action adds up.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('serviceCards', { eyebrow: '', title: 'Ways to help', subtitle: '', variant: 'icon', columns: 3, items: [
          { icon: 'HandHeart', title: 'Volunteer', text: 'Join food drives, planting days and office teams.', image: '', url: '#volunteer', linkLabel: 'See roles' },
          { icon: 'Trophy', title: 'Fundraise', text: 'Run, bake, cycle or celebrate — and raise money for a cause you love.', image: '', url: '/contact', linkLabel: 'Start a fundraiser' },
          { icon: 'Briefcase', title: 'Partner with us', text: 'Corporate giving, matched donations and employee volunteering.', image: '', url: '/contact', linkLabel: 'Talk to us' },
        ] }, { paddingY: 'xl' }),
        B('schedule', { eyebrow: 'Events', title: 'Upcoming events', subtitle: '', buttonLabel: 'Sign up', buttonUrl: '/contact', hostIcon: 'MapPin', locationIcon: 'Clock', days: EVENTS }, { background: 'surface', paddingY: 'xl', anchor: 'events' }),
        B('jobs', { eyebrow: 'Volunteer roles', title: 'Find your role', subtitle: 'No experience needed — just a big heart.', applyEmail: 'volunteer@evergreen-foundation.example', items: [
          { title: 'Food Drive Volunteer', department: 'Food security', location: 'Portland', type: 'Weekends', description: 'Sort, pack and deliver food parcels to families across the city.', url: '' },
          { title: 'Tree-Planting Crew', department: 'Reforestation', location: 'Oregon', type: 'Monthly', description: 'Plant native trees with our field team — tools and lunch provided.', url: '' },
          { title: 'Digital Storyteller', department: 'Communications', location: 'Remote', type: 'Flexible', description: 'Help us share stories from the field through writing, photo and video.', url: '' },
        ] }, { paddingY: 'xl', anchor: 'volunteer' }),
      ],
    },
    {
      slug: 'about', title: 'About', template: 'default', seoTitle: 'About Evergreen',
      blocks: [
        B('splitHero', { variant: 'arch', eyebrow: 'About Evergreen', title: 'Rooted in community', highlight: 'since 2004', subtitle: 'We started with one well in one village. Today we work with local partners in 18 countries — still listening first.', bullets: [], primaryLabel: 'Our impact report', primaryUrl: '/blog', secondaryLabel: '', secondaryUrl: '', image: un(P.community, 1000), image2: '', badges: [{ icon: 'Globe', value: '18', label: 'Countries' }, { icon: 'Users', value: '2,500', label: 'Volunteers' }], proof: '', avatars: [] }, { background: 'surface', paddingY: 'xl', animate: false }),
        B('team', { eyebrow: 'Leadership', title: 'The team', variant: 'round', columns: 4, members: [
          { name: 'Naomi Achieng', role: 'Executive Director', image: face('w6'), bio: '', linkedin: '#', twitter: '', email: '' },
          { name: 'Samuel Ortiz', role: 'Director of Programmes', image: face('m3'), bio: '', linkedin: '#', twitter: '', email: '' },
          { name: 'Hannah Lee', role: 'Head of Fundraising', image: face('w2'), bio: '', linkedin: '#', twitter: '', email: '' },
          { name: 'Peter Mwangi', role: 'Field Operations Lead', image: face('m6'), bio: '', linkedin: '#', twitter: '', email: '' },
        ] }, { paddingY: 'xl' }),
        B('timeline', { eyebrow: 'Our journey', title: 'Twenty years of growing together', items: [
          { period: '2004', title: 'The first well', org: 'Kalanga, Kenya', location: '', description: 'Three friends raise $8,000 to build one well.', bullets: [], tags: [] },
          { period: '2011', title: 'Education programme launches', org: '', location: '', description: 'School meals and classrooms in 20 communities.', bullets: [], tags: [] },
          { period: '2019', title: 'Reforestation begins', org: '', location: '', description: 'Our first 10,000 trees planted with local farmers.', bullets: [], tags: [] },
          { period: '2026', title: '1.2 million people reached', org: '', location: '', description: 'Working with partners in 18 countries.', bullets: [], tags: [] },
        ] }, { background: 'surface', paddingY: 'xl', width: 'narrow' }),
      ],
    },
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Impact', '#15803d'], ['News', '#f97316'], ['Volunteering', '#0ea5e9']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 5 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 4, views: rand(200, 4000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Grace Wanjiru', position: 'Community leader', company: 'Kalanga, Kenya', avatar: face('w6', 200), content: 'Before the well, our girls spent their mornings carrying water. Now they spend them in school. Evergreen listened to us first.', rating: 5, order: 0 },
        { name: 'Tom Harrington', position: 'Monthly donor since 2019', company: '', avatar: face('m1', 200), content: 'I love the transparency. Every year I can see exactly what my monthly gift achieved — it is the best $30 I spend.', rating: 5, order: 1 },
        { name: 'Lucia Romero', position: 'Volunteer', company: '', avatar: face('w3', 200), content: 'The tree-planting days are the highlight of my month. Wonderful people, real impact and great sandwiches!', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['How much of my donation goes to programmes?', '92% of every dollar goes directly to our programmes. The rest funds fundraising and administration.'],
      ['Is my donation tax-deductible?', 'Yes, where applicable. You will receive a receipt by email immediately after donating.'],
      ['Can I cancel a monthly gift?', 'Of course — you can change or cancel your monthly gift at any time with one email.'],
      ['How do I become a volunteer?', 'Choose a role on our Get involved page and we will invite you to the next orientation session.'],
      ['Can my company match my donation?', 'Many employers match gifts. Contact us and we will help you apply.'],
    ]);
  },
};
