const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };

const P = {
  columns: '1436450412740-6b988f486c6b', court: '1453945619913-79ec89a82c51', justice: '1589829545856-d10d557cf95f', gavel: '1575505586569-646b2ca898fc',
  gavelWhite: '1593115057322-e94b77572f20', busts: '1505664194779-8beaceb93744', library: '1479142506502-19b3a3b7ff33', curved: '1568667256549-094345857637',
  shelves: '1507842217343-583bb7270b66', shelves2: '1521587760476-6c12a4b040da', books: '1423592707957-3b212afa6733', signing: '1450101499163-c8848c66ca85',
  signing2: '1521791055366-0d553872125f', handshake: '1600880292089-90a7e086ee0c', meeting: '1542744173-8e7e53415bb0', tower: '1486406146926-c627a92ad1ab',
};

const PRACTICE = [
  ['Briefcase', 'Corporate & commercial', 'Formation, contracts, financing and M&A for founders, family businesses and listed companies.', P.meeting],
  ['Users', 'Family law', 'Divorce, custody and prenuptial agreements handled with discretion and care.', P.signing],
  ['Home', 'Real estate', 'Acquisitions, leasing, development and disputes for residential and commercial property.', P.tower],
  ['Handshake', 'Employment', 'Advice for employers and executives — from contracts to tribunal claims.', P.handshake],
  ['Gavel', 'Litigation & disputes', 'Robust representation in state and federal courts, arbitration and mediation.', P.gavel],
  ['Globe', 'Immigration', 'Visas, residency and citizenship for individuals, families and global teams.', P.signing2],
];

const PARTNERS = [
  { name: 'Victoria Sterling', role: 'Founding Partner · Litigation', image: face('w5'), bio: 'Thirty years in commercial litigation. Named a Top 100 Trial Lawyer.', linkedin: '#', twitter: '', email: 'v.sterling@sterlingvale.example' },
  { name: 'Robert Vale', role: 'Managing Partner · Corporate', image: face('m8'), bio: 'Advises boards and founders on transactions worth over $5B.', linkedin: '#', twitter: '', email: '' },
  { name: 'Amelia Ward', role: 'Partner · Family Law', image: face('w6'), bio: 'Collaborative-law specialist known for calm, fair settlements.', linkedin: '#', twitter: '', email: '' },
  { name: 'Henry Okafor', role: 'Partner · Real Estate', image: face('m5'), bio: 'Leads complex development and land-use matters across the state.', linkedin: '#', twitter: '', email: '' },
];

const POSTS = [
  ['Business law', 'Five clauses every shareholder agreement needs', 'The provisions that prevent the most expensive disputes we see.', P.signing],
  ['Family law', 'Prenuptial agreements: a modern, practical guide', 'Why more couples are signing them — and what makes one enforceable.', P.books],
  ['Real estate', 'Commercial leases in 2027: what tenants can negotiate now', 'Rising vacancy rates have shifted leverage. Here is how to use it.', P.tower],
  ['Firm news', 'Sterling & Vale named Law Firm of the Year', 'Recognised for our litigation and corporate practices for the third time.', P.court],
  ['Employment', 'Remote work and the law: a checklist for employers', 'Contracts, tax and data protection for distributed teams.', P.library],
];

const body = (t) => `<p>${t}. This note was prepared by our partners as general guidance for clients and is not legal advice for any specific situation.</p><h2>Why it matters</h2><p>Most legal problems are cheaper to prevent than to resolve. A short review today can save years of dispute later.</p><blockquote><p>“Good counsel is not about winning arguments — it is about avoiding the ones you cannot afford to have.”</p></blockquote><h2>Our recommendations</h2><ol><li>Review your existing documents at least every two years.</li><li>Put agreements in writing, even with people you trust.</li><li>Take advice before you sign, not after.</li></ol><p>To discuss your situation in confidence, <a href="/consultation">request a consultation</a>.</p>`;

module.exports = {
  id: 'sterling',
  name: 'Sterling',
  category: 'Law firm & legal',
  description: 'A distinguished law-firm website: centered classic header with announcement bar, serif slideshow hero, numbered practice-area rows, notable results, partner portraits and a consultation request form.',
  features: { formats: ['STANDARD'], series: [], blocks: ['Headers', 'Business', 'Interactive', 'Content', 'Conversion', 'Dynamic', 'Portfolio', 'Layout'] },
  layout: { header: 'default', article: 'blog', listing: 'cards' },
  general: { siteName: 'Sterling & Vale', tagline: 'Counsel you can trust. Results you can measure.' },
  contact: { email: 'counsel@sterlingvale.example', phone: '+1 (312) 555-0190', address: '200 West Madison Street, Suite 3800, Chicago, IL 60606', workingHours: 'Mon – Fri, 8:30 – 18:30' },
  social: { linkedin: 'https://linkedin.com', twitter: 'https://x.com', facebook: '', instagram: '', github: '', youtube: '' },
  seo: { metaTitle: 'Sterling & Vale — Attorneys at law', metaDescription: 'Corporate, litigation, family, real estate, employment and immigration law. Request a confidential consultation.' },
  appearance: {
    preset: 'sterling', primaryColor: '#7f1d1d', accentColor: '#b08d57', backgroundColor: '#fbf9f6', surfaceColor: '#f2ede5', textColor: '#1a1714',
    darkBackgroundColor: '#0f0d0c', darkSurfaceColor: '#1a1715', darkTextColor: '#efe9e1', headingFont: 'EB Garamond', bodyFont: 'Manrope',
    radius: 2, colorMode: 'light', headerStyle: 'centered', headerSticky: true, footerStyle: 'luxe', containerWidth: 1200, backToTop: true, blogLayout: 'list',
    footerText: 'Attorney advertising. Prior results do not guarantee a similar outcome.',
    headerCta: { enabled: true, label: 'Free consultation', url: '/consultation' },
    announcement: { enabled: true, text: 'New clients: your first 30-minute consultation is free and confidential.', linkLabel: 'Request yours', url: '/consultation' },
  },
  menus: {
    header: {
      name: 'Main menu',
      items: [
        m('Expertise', '/practice-areas', PRACTICE.map(([icon, title]) => m(title, '/practice-areas', [], { icon }))),
        m('Attorneys', '/attorneys'),
        m('Results', '/#results'),
        m('Insights', '/blog'),
        m('Contact', '/contact'),
      ],
    },
    footer: { name: 'Practice', items: [m('Corporate', '/practice-areas'), m('Litigation', '/practice-areas'), m('Family law', '/practice-areas'), m('Real estate', '/practice-areas')] },
    'footer-2': { name: 'Firm', items: [m('Attorneys', '/attorneys'), m('Insights', '/blog'), m('FAQ', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'sterling-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Sterling & Vale — Attorneys at law',
      blocks: [
        B('heroSlideshow', { height: 'tall', align: 'left', interval: 7, slides: [
          { image: un(P.columns, 2200), eyebrow: 'Attorneys at law · Since 1987', title: 'Counsel you can trust. Results you can measure.', subtitle: 'For nearly four decades, businesses and families have relied on Sterling & Vale when the stakes are highest.', buttonLabel: 'Request a consultation', buttonUrl: '/consultation' },
          { image: un(P.busts, 2200), eyebrow: 'Litigation & disputes', title: 'Prepared for every courtroom.', subtitle: 'Over $1.2 billion recovered for our clients in verdicts and settlements.', buttonLabel: 'See our results', buttonUrl: '#results' },
          { image: un(P.library, 2200), eyebrow: 'Corporate & private clients', title: 'Advice that protects what you have built.', subtitle: 'From the first contract to the final exit.', buttonLabel: 'Practice areas', buttonUrl: '/practice-areas' },
        ] }, HERO),
        B('trustBar', { variant: 'strip', items: [
          { icon: 'Landmark', title: 'Since 1987', text: 'Nearly four decades of practice.' },
          { icon: 'Scale', title: '$1.2B recovered', text: 'In verdicts and settlements.' },
          { icon: 'Award', title: 'Top-ranked firm', text: 'Recognised by leading legal directories.' },
          { icon: 'Lock', title: 'Strictly confidential', text: 'Every conversation is privileged.' },
        ] }, { background: 'surface', paddingY: 'lg' }),
        B('serviceCards', { eyebrow: 'Practice areas', title: 'Focused expertise across six practices', subtitle: '', variant: 'rows', columns: 3, buttonLabel: 'All practice areas', buttonUrl: '/practice-areas',
          items: PRACTICE.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 600), url: '/practice-areas', linkLabel: '' })) }, { paddingY: 'xl' }),
        B('stats', { items: [{ value: '38', label: 'Years in practice' }, { value: '$1.2B', label: 'Recovered for clients' }, { value: '45', label: 'Attorneys' }, { value: '94%', label: 'Cases resolved favourably' }] }, { background: 'dark', paddingY: 'lg' }),
        B('steps', { eyebrow: 'Our approach', title: 'How we handle your matter', variant: 'vertical', items: [
          { icon: 'MessageCircle', title: 'Confidential consultation', text: 'We listen, ask the right questions and explain your options in plain English.' },
          { icon: 'FileText', title: 'Clear strategy & fees', text: 'You receive a written plan and a transparent fee estimate before any work begins.' },
          { icon: 'Scale', title: 'Relentless advocacy', text: 'Your partner stays personally involved — at the negotiating table and in court.' },
          { icon: 'CheckCircle2', title: 'Resolution', text: 'We pursue the best achievable outcome, as quickly and cost-effectively as possible.' },
        ] }, { paddingY: 'xl', width: 'narrow' }),
        B('caseStudies', { eyebrow: 'Notable results', title: 'Outcomes that speak for themselves', subtitle: 'A selection of recent matters. Client names withheld for confidentiality.', variant: 'grid', items: [
          { image: un(P.court, 1200), client: 'Commercial litigation', title: 'Jury verdict for a manufacturer in a breach-of-contract dispute', text: 'After a three-week federal trial, the jury found in our client’s favour on every count.', metrics: [{ value: '$18.4M', label: 'Verdict' }, { value: '3 wks', label: 'Trial' }], tags: ['Litigation'], url: '' },
          { image: un(P.signing, 1200), client: 'Corporate', title: 'Sale of a family-owned logistics group to a private-equity buyer', text: 'We advised the founding family through negotiation, due diligence and closing.', metrics: [{ value: '$240M', label: 'Transaction value' }, { value: '11 wks', label: 'Signing to close' }], tags: ['M&A'], url: '' },
        ] }, { background: 'surface', paddingY: 'xl', anchor: 'results' }),
        B('team', { eyebrow: 'Partners', title: 'The attorneys behind your case', subtitle: '', variant: 'portrait', columns: 4, members: PARTNERS }, { paddingY: 'xl' }),
        B('testimonials', { eyebrow: 'Client testimonials', title: 'In our clients’ words' }, { background: 'surface', paddingY: 'xl' }),
        B('appointment', { eyebrow: 'Free consultation', title: 'Speak with an attorney', text: 'Tell us briefly about your matter. A partner will review it and call you back — usually the same day.', serviceLabel: 'Practice area', services: PRACTICE.map(([, t]) => t), firstSlot: '09:00', lastSlot: '17:30', interval: 30, image: '', phone: '+1 (312) 555-0190', bullets: ['First 30 minutes free', 'Strictly confidential', 'No obligation to instruct us'] }, { paddingY: 'xl', anchor: 'consultation' }),
        B('latestPosts', { eyebrow: 'Insights', title: 'Legal updates & guides', count: 3, buttonLabel: 'All insights', buttonUrl: '/blog' }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    {
      slug: 'practice-areas', title: 'Practice areas', template: 'default', seoTitle: 'Practice areas — Sterling & Vale',
      blocks: [
        B('heroSlideshow', { height: 'tall', align: 'left', interval: 7, slides: [{ image: un(P.shelves2, 2000), eyebrow: 'Practice areas', title: 'Depth where it matters', subtitle: 'Six practices, one firm — working together on every matter.', buttonLabel: '', buttonUrl: '' }] }, HERO),
        B('serviceCards', { eyebrow: '', title: '', subtitle: '', variant: 'image', columns: 3, items: PRACTICE.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 900), url: '/consultation', linkLabel: 'Speak to an attorney' })) }, { paddingY: 'xl' }),
        B('faq', { eyebrow: 'FAQ', title: 'Working with us' }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    {
      slug: 'attorneys', title: 'Attorneys', template: 'default', seoTitle: 'Our attorneys — Sterling & Vale',
      blocks: [
        B('pageHeader', { title: 'Our attorneys', subtitle: '45 lawyers. One standard of excellence.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('team', { eyebrow: 'Partners', title: '', subtitle: '', variant: 'cards', columns: 4, members: PARTNERS }, { paddingY: 'xl' }),
        B('timeline', { eyebrow: 'Our history', title: 'Since 1987', items: [
          { period: '1987', title: 'Victoria Sterling opens a two-lawyer litigation practice', org: 'Chicago', location: '', description: '', bullets: [], tags: [] },
          { period: '1998', title: 'Robert Vale joins; the corporate practice is born', org: 'Sterling & Vale', location: '', description: '', bullets: [], tags: [] },
          { period: '2012', title: 'Family, real estate and immigration teams added', org: '', location: '', description: '', bullets: [], tags: [] },
          { period: '2026', title: 'Law Firm of the Year — for the third time', org: '', location: '', description: '', bullets: [], tags: [] },
        ] }, { background: 'surface', paddingY: 'xl', width: 'narrow' }),
      ],
    },
    {
      slug: 'consultation', title: 'Consultation', template: 'default', seoTitle: 'Request a consultation — Sterling & Vale',
      blocks: [
        B('pageHeader', { title: 'Request a consultation', subtitle: 'Your first 30 minutes are free and completely confidential.' }, { background: 'surface', paddingY: 'lg', animate: false }),
        B('appointment', { eyebrow: '', title: 'Tell us how we can help', text: 'A partner will review your request and contact you, usually the same working day.', serviceLabel: 'Practice area', services: PRACTICE.map(([, t]) => t), firstSlot: '09:00', lastSlot: '17:30', interval: 30, image: un(P.justice, 1000), phone: '+1 (312) 555-0190', bullets: ['First 30 minutes free', 'Strictly confidential', 'No obligation to instruct us'] }, { paddingY: 'xl' }),
      ],
    },
    commonPages.about('Sterling & Vale', 'A Chicago law firm serving businesses and families since 1987.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Business law', '#7f1d1d'], ['Family law', '#b08d57'], ['Real estate', '#475569'], ['Employment', '#0f766e'], ['Firm news', '#1f2937']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 6 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 6, views: rand(200, 3000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Richard Hale', position: 'CEO', company: 'Hale Manufacturing', avatar: face('m1', 200), content: 'Victoria and her team were extraordinary. Calm, meticulous and utterly convincing in front of the jury. We could not have asked for more.', rating: 5, order: 0 },
        { name: 'Name withheld', position: 'Family law client', company: '', avatar: face('w4', 200), content: 'Amelia guided me through the hardest year of my life with compassion and complete clarity. I always knew where I stood.', rating: 5, order: 1 },
        { name: 'Grace Liu', position: 'Founder', company: 'Liu & Partners Realty', avatar: face('w7', 200), content: 'Henry closed a complex development deal in record time and spotted risks no one else had seen.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['Is the first consultation really free?', 'Yes. Your first 30-minute consultation is free, confidential and carries no obligation.'],
      ['How do you charge for your services?', 'Depending on the matter we offer fixed fees, hourly rates or contingency arrangements — always agreed in writing first.'],
      ['Will I work directly with a partner?', 'Yes. A partner is personally responsible for every matter we take on.'],
      ['How quickly will you respond?', 'We aim to reply to every new enquiry within one working day, and the same day for urgent matters.'],
      ['Is what I tell you confidential?', 'Yes. Communications with our attorneys are protected by attorney–client privilege.'],
    ]);
  },
};
