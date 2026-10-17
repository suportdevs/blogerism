const { B: block, m, un, face, slug, rand, commonPages, seedFaqs } = require('./helpers');

// Sections reveal on scroll (heroes opt out explicitly).
const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });

const P = {
  meeting: '1556761175-5973dc0f32e7', highFive: '1600880292203-757bb62b4baf', handshake: '1600880292089-90a7e086ee0c', team: '1521737604893-d14cc237f11d',
  tower: '1486406146926-c627a92ad1ab', glass: '1462206092226-f46025ffe607', blue: '1560179707-f14e90ef3623', board: '1542744173-8e7e53415bb0',
  charts: '1551288049-bebda4e38f71', analytics: '1460925895917-afdab827c52f', notes: '1454165804606-c3d57bc86b40', office: '1497366811353-6870744d04b2',
  sticky: '1552664730-d307ca884978', diverse: '1531482615713-2afd69097998', loft: '1559136555-9303baea8ebd',
};

const SERVICES = [
  ['Target', 'Corporate strategy', 'Define where to play and how to win — with a plan your board and your teams can execute.', P.board],
  ['PiggyBank', 'Financial advisory', 'Capital structure, forecasting and funding strategy that keep growth fully financed.', P.charts],
  ['Handshake', 'Mergers & acquisitions', 'Target screening, valuation, due diligence and post-merger integration, end to end.', P.handshake],
  ['ShieldCheck', 'Risk & compliance', 'Regulatory readiness, controls and audit support that protect value and reputation.', P.notes],
  ['Cpu', 'Digital transformation', 'Modernise operations with data, automation and AI — measured against real business outcomes.', P.analytics],
  ['Workflow', 'Operational excellence', 'Leaner processes, smarter cost bases and teams aligned around what matters most.', P.sticky],
];

const CASES = [
  { image: un(P.meeting, 1400), client: 'Northwind Logistics', title: 'A turnaround plan that restored profitability in 14 months', text: 'Facing falling margins and a stretched balance sheet, Northwind asked us to rebuild its strategy. We redesigned the network, renegotiated $140M of debt and launched a pricing programme.', metrics: [{ value: '+18%', label: 'EBITDA margin' }, { value: '$140M', label: 'Debt refinanced' }], tags: ['Strategy', 'Restructuring'], url: '/contact' },
  { image: un(P.diverse, 1400), client: 'Helix Health', title: 'Merging two regional providers into one national brand', text: 'We led the due diligence, integration roadmap and change programme for a merger of two healthcare groups — on time and ahead of the synergy targets.', metrics: [{ value: '$62M', label: 'Annual synergies' }, { value: '9 mo', label: 'Integration' }], tags: ['M&A', 'Integration'], url: '/contact' },
  { image: un(P.analytics, 1400), client: 'Quanta Retail', title: 'Data-driven forecasting for 600 stores', text: 'A new planning model combining sales, weather and footfall data now drives buying decisions across the whole chain.', metrics: [{ value: '-27%', label: 'Excess stock' }, { value: '3.4x', label: 'Return on investment' }], tags: ['Digital', 'Analytics'], url: '/contact' },
];

const POSTS = [
  ['Strategy', 'Five questions every board should ask before a major acquisition', 'Most deals that fail were doomed before they were signed. Here is the checklist our partners use.', P.board],
  ['Finance', 'Rates are falling — is it time to refinance?', 'How CFOs are rethinking capital structure as borrowing costs come down.', P.charts],
  ['Leadership', 'Leading through uncertainty: lessons from 25 years of turnarounds', 'Clarity, cadence and candour — the three habits that separate resilient leaders.', P.team],
  ['Markets', 'Mid-market M&A outlook for 2027', 'Valuations, sectors to watch and where private capital is heading next year.', P.glass],
  ['Strategy', 'Why most transformation programmes stall — and how to restart yours', 'A practical framework for getting momentum back after the first wave of change.', P.sticky],
  ['Finance', 'Cash is still king: a 13-week forecast template', 'The simple tool that has saved more companies than any strategy deck.', P.notes],
];

const body = (t) => `<p>${t}. In this briefing our partners share what we are seeing across our client base and the practical steps leadership teams can take now.</p><h2>What is changing</h2><p>Markets reward companies that move decisively, but only when decisions are grounded in evidence. The leaders we work with combine speed with discipline.</p><blockquote><p>“Strategy is not the plan on the page — it is the choices you are willing to make when it gets hard.”</p></blockquote><h2>Where to start</h2><ul><li>Get a single, honest view of the numbers.</li><li>Agree the two or three decisions that matter most this year.</li><li>Build a cadence that turns decisions into action.</li></ul><p>Want to discuss how this applies to your business? <a href="/contact">Book a consultation</a> with one of our partners.</p>`;

module.exports = {
  id: 'atlas',
  name: 'Atlas',
  category: 'Consulting & finance',
  description: 'A corporate advisory website: contact top bar, framed split hero, overlapping trust bar, service tiles, sticky case-study cards and partner profiles.',
  features: { formats: ['STANDARD'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Content', 'Dynamic', 'Conversion', 'Media', 'Layout'] },
  layout: { header: 'corporate', article: 'blog', listing: 'cards' },
  general: { siteName: 'Atlas', tagline: 'Strategy & financial advisory for ambitious companies' },
  contact: { email: 'partners@atlas-advisory.example', phone: '+1 (212) 555-0148', address: '30 Hudson Yards, New York, NY 10001', workingHours: 'Mon – Fri, 8:00 – 18:00' },
  social: { linkedin: 'https://linkedin.com', twitter: 'https://x.com', facebook: '', instagram: '', github: '', youtube: 'https://youtube.com' },
  seo: { metaTitle: 'Atlas — Strategy & financial advisory', metaDescription: 'Independent strategy, M&A and financial advisory for leadership teams. Senior partners on every engagement.' },
  appearance: {
    preset: 'atlas', primaryColor: '#0f4c81', accentColor: '#c8a24a', backgroundColor: '#ffffff', surfaceColor: '#f3f6fa', textColor: '#0b1b2e',
    darkBackgroundColor: '#07111f', darkSurfaceColor: '#0e1c2f', darkTextColor: '#e6edf7', headingFont: 'Manrope', bodyFont: 'Inter',
    radius: 10, colorMode: 'light', headerStyle: 'solid', headerSticky: true, footerStyle: 'columns', containerWidth: 1240, backToTop: true, blogLayout: 'grid',
    footerText: 'Independent advice since 2001.',
    headerCta: { enabled: true, label: 'Book a consultation', url: '/contact' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Home', '/'),
        m('Services', '/services', [
          m('Advisory', '#', [
            m('Corporate strategy', '/services', [], { icon: 'Target', description: 'Where to play and how to win' }),
            m('Financial advisory', '/services', [], { icon: 'PiggyBank', description: 'Capital, forecasting & funding' }),
            m('Mergers & acquisitions', '/services', [], { icon: 'Handshake', description: 'From screening to integration' }),
          ]),
          m('Performance', '#', [
            m('Risk & compliance', '/services', [], { icon: 'ShieldCheck', description: 'Controls that protect value' }),
            m('Digital transformation', '/services', [], { icon: 'Cpu', description: 'Data, automation & AI' }),
            m('Operational excellence', '/services', [], { icon: 'Workflow', description: 'Leaner, faster, aligned' }),
          ]),
        ], { mega: true, image: un(P.board, 800), description: 'Senior-led advisory for decisions that shape the next decade.' }),
        m('Case studies', '/#cases'),
        m('Insights', '/blog'),
        m('About', '/about'),
        m('Contact', '/contact'),
      ],
    },
    footer: { name: 'Services', items: [m('Corporate strategy', '/services'), m('Financial advisory', '/services'), m('Mergers & acquisitions', '/services'), m('Risk & compliance', '/services')] },
    'footer-2': { name: 'Firm', items: [m('About', '/about'), m('Insights', '/blog'), m('FAQ', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'atlas-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Atlas — Strategy & financial advisory',
      blocks: [
        B('splitHero', {
          variant: 'framed', eyebrow: 'Strategy · Finance · Growth', title: 'Clarity for the decisions', highlight: 'that matter most',
          subtitle: 'Atlas is an independent advisory firm helping leadership teams grow, transform and invest with confidence — with senior partners on every engagement.',
          bullets: ['Senior partners on every project', 'Independent — no commissions', 'Fixed-fee proposals', '48-hour kickoff'],
          primaryLabel: 'Book a consultation', primaryUrl: '/contact', secondaryLabel: 'Our services', secondaryUrl: '/services',
          image: un(P.meeting, 1200), image2: '',
          badges: [{ icon: 'TrendingUp', value: '$2.4B', label: 'Capital advised' }, { icon: 'Award', value: '25+', label: 'Years of practice' }],
          proof: 'Trusted by 400+ leadership teams', avatars: [face('w5', 120), face('m4', 120), face('w6', 120), face('m5', 120)],
        }, { background: 'surface', paddingY: 'xl', animate: false }),
        B('trustBar', { variant: 'overlap', items: [
          { icon: 'ShieldCheck', title: 'Independent advice', text: 'No product sales, no hidden commissions.' },
          { icon: 'LineChart', title: 'Evidence first', text: 'Every recommendation is modelled.' },
          { icon: 'Users', title: 'Senior-led', text: 'Partners lead every engagement.' },
          { icon: 'Clock', title: '48-hour kickoff', text: 'From first call to working team.' },
        ] }, { paddingY: 'sm' }),
        B('logoWall', { title: 'Advising leaders at', variant: 'marquee', speed: 35, logos: ['Northwind', 'Helix Health', 'Quanta', 'Meridian', 'Orbital', 'Crestline', 'Vantage', 'Bluefin'].map((name) => ({ name, image: '', url: '' })) }, { paddingY: 'md' }),
        B('serviceCards', { eyebrow: 'What we do', title: 'Advisory across the full business lifecycle', subtitle: 'From the first strategic question to the last integration milestone.', variant: 'icon', columns: 3, buttonLabel: 'All services', buttonUrl: '/services',
          items: SERVICES.map(([icon, title, text]) => ({ icon, title, text, image: '', url: '/services', linkLabel: 'Learn more' })) }, { paddingY: 'xl' }),
        B('stats', { items: [{ value: '25+', label: 'Years of practice' }, { value: '$2.4B', label: 'Capital advised' }, { value: '400+', label: 'Clients served' }, { value: '96%', label: 'Client retention' }] }, { background: 'primary', paddingY: 'lg' }),
        B('caseStudies', { eyebrow: 'Case studies', title: 'Results our clients can measure', subtitle: 'A few of the engagements we are proud of.', variant: 'stack', items: CASES }, { paddingY: 'xl', anchor: 'cases' }),
        B('accordionImage', { eyebrow: 'Why Atlas', title: 'An advisor that sits on your side of the table', subtitle: '', imagePosition: 'left', autoplay: true, items: [
          { title: 'Senior attention, always', text: 'You work directly with partners who have run businesses — not with a rotating cast of juniors.', image: un(P.board, 1200) },
          { title: 'Truly independent', text: 'We do not sell products, take commissions or manage money. Our only incentive is your result.', image: un(P.handshake, 1200) },
          { title: 'Built to be implemented', text: 'Every recommendation comes with owners, milestones and the numbers to track them.', image: un(P.sticky, 1200) },
          { title: 'Proven across sectors', text: 'Logistics, healthcare, retail, technology and industrials — 400+ engagements and counting.', image: un(P.tower, 1200) },
        ] }, { background: 'surface', paddingY: 'xl' }),
        B('team', { eyebrow: 'Partners', title: 'The people who lead your engagement', subtitle: 'Former operators, CFOs and investment bankers.', variant: 'round', columns: 4, members: [
          { name: 'Eleanor Hayes', role: 'Managing Partner', image: face('w5'), bio: 'Former CFO of a FTSE 250 group. Leads our strategy practice.', linkedin: '#', twitter: '', email: '' },
          { name: 'Marcus Reid', role: 'Partner, M&A', image: face('m4'), bio: '20 years in investment banking and $9B of closed transactions.', linkedin: '#', twitter: '', email: '' },
          { name: 'Priya Natarajan', role: 'Partner, Digital', image: face('w7'), bio: 'Built data platforms for three global retailers.', linkedin: '#', twitter: '', email: '' },
          { name: 'Jonathan Price', role: 'Partner, Restructuring', image: face('m8'), bio: 'Has led more than 40 turnarounds across Europe and the US.', linkedin: '#', twitter: '', email: '' },
        ] }, { paddingY: 'xl' }),
        B('testimonials', { eyebrow: 'Client voices', title: 'What leadership teams say' }, { background: 'surface', paddingY: 'xl' }),
        B('latestPosts', { eyebrow: 'Insights', title: 'Perspectives from our partners', count: 3, buttonLabel: 'All insights', buttonUrl: '/blog' }, { paddingY: 'xl' }),
        B('ctaBanner', { variant: 'image', image: un(P.glass, 1800), eyebrow: 'Start a conversation', title: 'Let’s talk about your next big decision', text: 'Book a free 30-minute call with a partner. No obligation, no sales pitch.', primaryLabel: 'Book a consultation', primaryUrl: '/contact', secondaryLabel: 'Our services', secondaryUrl: '/services', phone: '+1 (212) 555-0148' }, { paddingY: 'lg', width: 'wide' }),
      ],
    },
    {
      slug: 'services', title: 'Services', template: 'default', seoTitle: 'Services — Atlas',
      blocks: [
        B('pageHeader', { title: 'Services', subtitle: 'Six practices, one integrated team — each led by partners who have sat in your chair.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('serviceCards', { eyebrow: '', title: '', subtitle: '', variant: 'image', columns: 3, items: SERVICES.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 900), url: '/contact', linkLabel: 'Discuss your needs' })) }, { paddingY: 'xl' }),
        B('steps', { eyebrow: 'How we work', title: 'From first call to measurable results', variant: 'timeline', items: [
          { icon: 'MessageCircle', title: 'Diagnose', text: 'A two-week sprint to understand the numbers, the market and your team.' },
          { icon: 'Target', title: 'Decide', text: 'A clear set of choices, each modelled and pressure-tested.' },
          { icon: 'Workflow', title: 'Deliver', text: 'We work alongside your people to make it happen.' },
          { icon: 'TrendingUp', title: 'Measure', text: 'Quarterly reviews against the outcomes we agreed.' },
        ] }, { background: 'surface', paddingY: 'xl' }),
        B('faq', { eyebrow: 'FAQ', title: 'Working with Atlas' }, { paddingY: 'xl' }),
        B('ctaBanner', { variant: 'split', image: un(P.handshake, 1400), eyebrow: 'Next step', title: 'Request a fixed-fee proposal', text: 'Tell us about the challenge — you will have a scoped proposal within five working days.', primaryLabel: 'Contact a partner', primaryUrl: '/contact', phone: '+1 (212) 555-0148' }, { paddingY: 'lg', width: 'wide' }),
      ],
    },
    {
      slug: 'about', title: 'About', template: 'default', seoTitle: 'About — Atlas',
      blocks: [
        B('splitHero', { variant: 'collage', eyebrow: 'About Atlas', title: 'Independent advice,', highlight: 'since 2001', subtitle: 'We started Atlas with a simple idea: leadership teams deserve advisors who have run businesses themselves and who are paid only for results.', primaryLabel: 'Meet the partners', primaryUrl: '#partners', secondaryLabel: '', secondaryUrl: '', image: un(P.team, 1000), image2: un(P.loft, 700), badges: [{ icon: 'Globe', value: '14', label: 'Countries' }, { icon: 'Users', value: '120', label: 'Advisors' }], proof: '', avatars: [] }, { paddingY: 'xl', animate: false }),
        B('stats', { items: [{ value: '2001', label: 'Founded' }, { value: '120', label: 'Advisors' }, { value: '14', label: 'Countries' }, { value: '400+', label: 'Clients' }] }, { background: 'surface', paddingY: 'lg' }),
        B('timeline', { eyebrow: 'Our story', title: 'Milestones', items: [
          { period: '2001', title: 'Atlas is founded', org: 'New York', location: '', description: 'Three former CFOs open a boutique advisory practice.', bullets: [], tags: [] },
          { period: '2009', title: 'M&A practice launches', org: 'London office opens', location: '', description: 'We advise on our first $1B cross-border transaction.', bullets: [], tags: [] },
          { period: '2017', title: 'Digital & analytics', org: '', location: '', description: 'A dedicated team for data-driven transformation joins the firm.', bullets: [], tags: [] },
          { period: '2026', title: '400 clients, 14 countries', org: '', location: '', description: 'Still independent, still partner-led.', bullets: [], tags: [] },
        ] }, { paddingY: 'xl', width: 'narrow' }),
        B('team', { eyebrow: 'Partners', title: 'Leadership', variant: 'portrait', columns: 4, members: [
          { name: 'Eleanor Hayes', role: 'Managing Partner', image: face('w5'), bio: '', linkedin: '#', twitter: '', email: '' },
          { name: 'Marcus Reid', role: 'Partner, M&A', image: face('m4'), bio: '', linkedin: '#', twitter: '', email: '' },
          { name: 'Priya Natarajan', role: 'Partner, Digital', image: face('w7'), bio: '', linkedin: '#', twitter: '', email: '' },
          { name: 'Jonathan Price', role: 'Partner, Restructuring', image: face('m8'), bio: '', linkedin: '#', twitter: '', email: '' },
        ] }, { background: 'surface', paddingY: 'xl', anchor: 'partners' }),
        B('jobs', { eyebrow: 'Careers', title: 'Join Atlas', subtitle: 'We hire experienced operators and exceptional analysts.', applyEmail: 'careers@atlas-advisory.example', items: [
          { title: 'Senior Consultant, Strategy', department: 'Strategy', location: 'New York', type: 'Full-time', description: 'Lead workstreams on growth and portfolio strategy engagements.', url: '' },
          { title: 'Associate, M&A', department: 'M&A', location: 'London', type: 'Full-time', description: 'Support due diligence, valuation and integration planning.', url: '' },
          { title: 'Data Scientist', department: 'Digital', location: 'Remote', type: 'Full-time', description: 'Build forecasting and pricing models for client programmes.', url: '' },
        ] }, { paddingY: 'xl' }),
      ],
    },
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Strategy', '#0f4c81'], ['Finance', '#c8a24a'], ['Leadership', '#0e7490'], ['Markets', '#6d28d9']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order, description: `Atlas perspectives on ${name.toLowerCase()}.` } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 5 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i < 2,
          publishedAt: date, createdAt: date, readingTime: 5 + (i % 4), views: rand(300, 5000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Catherine Moore', position: 'CEO', company: 'Northwind Logistics', avatar: face('w6', 200), content: 'Atlas gave us the clarity and the courage to make decisions we had postponed for years. Fourteen months later we are profitable and growing again.', rating: 5, order: 0 },
        { name: 'Daniel Okoye', position: 'CFO', company: 'Helix Health', avatar: face('m6', 200), content: 'The integration was the smoothest I have seen in twenty years. Their partners were in the room for every hard conversation.', rating: 5, order: 1 },
        { name: 'Sofia Lindqvist', position: 'Chief Strategy Officer', company: 'Quanta Retail', avatar: face('w4', 200), content: 'Rigorous, practical and genuinely independent. Our forecasting model paid for the engagement in the first quarter.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['How do you charge?', 'Most engagements are fixed-fee, agreed upfront after a short scoping call. For transactions we can combine a retainer with a success fee.'],
      ['Who will actually do the work?', 'A partner leads every engagement personally, supported by a small senior team. We never hand you off to juniors.'],
      ['Do you work with smaller companies?', 'Yes — around a third of our clients are founder-led businesses with revenues between $10M and $100M.'],
      ['How quickly can you start?', 'We can usually kick off within 48 hours of signing, and deliver an initial diagnosis within two weeks.'],
      ['Is our information kept confidential?', 'Always. We sign an NDA before any detailed discussion and never share client information.'],
    ]);
  },
};
