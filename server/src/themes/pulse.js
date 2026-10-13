const { B: block, m, pic, slug, rand, commonPages, seedFaqs } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });

const POSTS = [
  ['Changelog', 'Pulse 2.0: AI insights for every team', 'Ask questions in plain English and get charts, anomalies and forecasts in seconds.'],
  ['Product', 'Introducing real-time funnels', 'See exactly where users drop off — as it happens, not tomorrow morning.'],
  ['Engineering', 'How we process 2 billion events a day', 'A look inside the streaming pipeline that powers Pulse dashboards.'],
  ['Product', 'Five dashboards every SaaS founder needs', 'The metrics that actually predict growth, and how to track them.'],
  ['Engineering', 'Privacy by design: cookieless analytics', 'How Pulse delivers accurate analytics without tracking individuals.'],
  ['Changelog', 'New: Slack & Teams alerts', 'Get notified the moment a metric moves — right where your team works.'],
];

const body = (t) => `<p>${t}. In this post we walk through what changed, why it matters and how to get started.</p><h2>What’s new</h2><ul><li>Faster queries across large datasets</li><li>Smarter defaults for new workspaces</li><li>Improved sharing and permissions</li></ul><h2>Getting started</h2><p>Everything is live today for all plans. Open your workspace and look for the ✨ icon.</p>`;

module.exports = {
  id: 'pulse',
  name: 'Pulse',
  category: 'SaaS & startup',
  description: 'A high-conversion product site: interactive spotlight hero with a 3D dashboard, bento features, animated stats and a monthly/yearly pricing toggle.',
  features: { formats: ['STANDARD'], series: [], blocks: ['Headers', 'Content', 'Conversion', 'Dynamic', 'Media', 'Layout'] },
  layout: { header: 'default', article: 'blog', listing: 'cards' },
  general: { siteName: 'Pulse', tagline: 'Product analytics for modern teams' },
  contact: { email: 'hello@pulse.example', phone: '+1 (415) 555-0199', address: '548 Market St, San Francisco, CA', workingHours: 'Support 24/7' },
  social: { twitter: 'https://x.com', github: 'https://github.com', linkedin: 'https://linkedin.com', facebook: '', instagram: '', youtube: '' },
  seo: { metaTitle: 'Pulse — product analytics your whole team will use', metaDescription: 'Real-time dashboards, AI insights and privacy-first tracking. Start free in minutes.' },
  appearance: {
    preset: 'pulse', primaryColor: '#8b5cf6', accentColor: '#22d3ee', backgroundColor: '#ffffff', surfaceColor: '#f5f5fa', textColor: '#0a0a14',
    darkBackgroundColor: '#06060b', darkSurfaceColor: '#0f1018', darkTextColor: '#ececf4', headingFont: 'Sora', bodyFont: 'Inter',
    radius: 18, colorMode: 'dark', headerStyle: 'glass', headerSticky: true, footerStyle: 'columns', containerWidth: 1200, backToTop: true,
    footerText: 'Built for teams who ship.',
    headerCta: { enabled: true, label: 'Start free', url: '/#pricing' },
    announcement: { enabled: true, text: 'Pulse 2.0 is live — AI insights for every team.', linkLabel: 'See what’s new', url: '/blog' },
  },
  menus: {
    header: { name: 'Main menu', items: [m('Features', '/#features'), m('Customers', '/#customers'), m('Pricing', '/#pricing'), m('Blog', '/blog'), m('FAQ', '/#faq')] },
    footer: { name: 'Product', items: [m('Features', '/#features'), m('Pricing', '/#pricing'), m('Changelog', '/category/changelog'), m('FAQ', '/faq')] },
    'footer-2': { name: 'Company', items: [m('About', '/about'), m('Blog', '/blog'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'pulse-home', title: 'Home', home: true, template: 'landing', seoTitle: 'Pulse — product analytics your whole team will use',
      blocks: [
        B('spotlightHero', {
          badge: 'Pulse 2.0 — AI insights are here', badgeUrl: '/blog', title: 'Analytics your whole team', highlight: 'actually uses',
          subtitle: 'Real-time dashboards, AI-powered answers and privacy-first tracking. Set up in five minutes — no data team required.',
          primaryLabel: 'Start free trial', primaryUrl: '#pricing', secondaryLabel: 'Watch demo', secondaryUrl: '#features',
          note: 'Trusted by 2,000+ product teams', domain: 'pulse.dev', image: '',
        }, { paddingY: 'none', width: 'wide', animate: false }),
        B('logos', { title: 'Powering teams at', items: ['Lumen', 'Stackwise', 'Northwind', 'Acme', 'Vertex', 'Globex', 'Initech'] }, { paddingY: 'md' }),
        B('bentoGrid', {
          eyebrow: 'Features', title: 'Everything you need to understand your users', subtitle: 'One platform from first click to renewal.',
          items: [
            { icon: 'BarChart3', title: 'Real-time analytics', text: 'Dashboards update the second events arrive. Spot trends while they’re happening.', size: 'lg', visual: 'chart', image: '' },
            { icon: 'Globe', title: 'Global edge network', text: '35 regions, sub-50ms ingestion anywhere.', size: 'tall', visual: 'globe', image: '' },
            { icon: 'Sparkles', title: 'Ask AI', text: '“Why did signups drop last Tuesday?” — answered with charts.', size: 'sm', visual: '', image: '' },
            { icon: 'Code2', title: 'Developer-first API', text: 'Typed SDKs for JS, Python and Go. Track anything in one line.', size: 'wide', visual: 'code', image: '' },
            { icon: 'Users', title: 'Built for teams', text: 'Shared boards, comments and roles.', size: 'sm', visual: 'avatars', image: '' },
            { icon: 'ShieldCheck', title: 'Reliable & private', text: 'SOC 2, GDPR-ready, cookieless by default.', size: 'wide', visual: 'metrics', image: '' },
            { icon: 'Zap', title: '5-minute setup', text: 'Paste one snippet and you’re live.', size: 'sm', visual: '', image: '' },
          ],
        }, { paddingY: 'xl', width: 'wide', anchor: 'features' }),
        B('stats', { items: [{ value: '2,000+', label: 'Teams' }, { value: '2B+', label: 'Events per day' }, { value: '99.99%', label: 'Uptime' }, { value: '45ms', label: 'Median latency' }] }, { background: 'surface', paddingY: 'lg' }),
        B('imageText', { eyebrow: 'AI insights', title: 'Ask questions. Get answers. Ship faster.', text: 'Pulse AI reads your data so you don’t have to. Get weekly summaries, anomaly alerts and plain-English explanations of every chart.', image: pic('pulse-ai', 1200, 900), imagePosition: 'right', bullets: ['Natural-language queries', 'Automatic anomaly detection', 'Weekly digest in Slack'], buttonLabel: 'Explore AI', buttonUrl: '/blog' }, { paddingY: 'xl' }),
        B('testimonials', { eyebrow: 'Customers', title: 'Teams grow faster with Pulse' }, { paddingY: 'xl', anchor: 'customers' }),
        B('pricingToggle', {
          eyebrow: 'Pricing', title: 'Start free. Scale when you’re ready.', subtitle: 'No credit card required. Cancel anytime.', currency: '$', yearlyNote: '-20%',
          plans: [
            { name: 'Starter', description: 'For side projects and early startups', monthly: '0', yearly: '0', features: ['10k events / month', '3 dashboards', '7-day history', 'Community support'], buttonLabel: 'Start free', buttonUrl: '/contact', highlighted: false },
            { name: 'Growth', description: 'For growing product teams', monthly: '49', yearly: '39', features: ['1M events / month', 'Unlimited dashboards', 'AI insights', '1-year history', 'Slack alerts'], buttonLabel: 'Start 14-day trial', buttonUrl: '/contact', highlighted: true },
            { name: 'Scale', description: 'For companies with advanced needs', monthly: '199', yearly: '159', features: ['Unlimited events', 'SSO & audit logs', 'Data warehouse sync', 'Dedicated success manager'], buttonLabel: 'Talk to sales', buttonUrl: '/contact', highlighted: false },
          ],
        }, { background: 'surface', paddingY: 'xl', anchor: 'pricing' }),
        B('faq', { eyebrow: 'FAQ', title: 'Questions, answered' }, { paddingY: 'xl', anchor: 'faq' }),
        B('cta', { title: 'Ready to see your product clearly?', text: 'Start free in five minutes. Upgrade when you grow.', primaryLabel: 'Start free trial', primaryUrl: '#pricing', secondaryLabel: 'Contact sales', secondaryUrl: '/contact' }, { paddingY: 'lg' }),
      ],
    },
    commonPages.about('Pulse', 'We help product teams understand their users — without spreadsheets or a data team.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Product', '#8b5cf6'], ['Engineering', '#22d3ee'], ['Changelog', '#f472b6']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 4 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: pic(`pulse-${i}`), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 4, views: rand(300, 6000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Lena Fischer', position: 'Head of Product', company: 'Northwind', avatar: 'https://i.pravatar.cc/200?img=44', content: 'We replaced three tools with Pulse. Our PMs finally answer their own questions — and the AI summaries are scarily good.', rating: 5, order: 0 },
        { name: 'David Kim', position: 'CTO', company: 'Stackwise', avatar: 'https://i.pravatar.cc/200?img=59', content: 'Setup took ten minutes. The SDK is clean, the data is real-time and our infra bill went down.', rating: 5, order: 1 },
        { name: 'Sofia Martins', position: 'Growth Lead', company: 'Lumen', avatar: 'https://i.pravatar.cc/200?img=36', content: 'Funnels and retention cohorts in one place. We found a 23% conversion lift in our first week.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['Is there a free plan?', 'Yes — Starter is free forever for up to 10,000 events per month.'],
      ['Do you use cookies?', 'No. Pulse is cookieless by default and GDPR-ready.'],
      ['Can I import existing data?', 'Yes, from Google Analytics, Mixpanel, Amplitude or any CSV.'],
      ['How does yearly billing work?', 'Pay annually and save 20% on every paid plan.'],
      ['Can I cancel anytime?', 'Absolutely. Plans are month-to-month unless you choose yearly billing.'],
    ]);
  },
};
