const { B, m, pic, slug, rand, commonPages, seedFaqs } = require('./helpers');

const body = (topic) => `
<p>${topic} is changing the way modern teams ship digital experiences. In this article we break down the ideas, the tooling and the workflow that make it practical for teams of any size.</p>
<h2>Why it matters</h2>
<p>Great products are built on clear structure. When your content model is flexible and your editors feel at home, publishing becomes a creative act instead of a chore.</p>
<blockquote><p>“The best interface is the one that gets out of the way and lets your content shine.”</p></blockquote>
<h2>Getting started</h2>
<ul><li>Define the goals your content must serve.</li><li>Model reusable blocks instead of one-off pages.</li><li>Automate the boring parts — SEO, images, and publishing.</li></ul>
<h3>A practical checklist</h3>
<ol><li>Audit your existing pages.</li><li>Group sections into reusable blocks.</li><li>Ship, measure, and refine.</li></ol>
<p>Subscribe to our newsletter to get the next deep dive straight to your inbox.</p>`;

const TITLES = [
  'Designing a content model that scales with your team', 'Next.js App Router: patterns we use in production', 'Why PostgreSQL is the only database you need',
  'The anatomy of a high-converting landing page', 'Building an accessible color system from scratch', 'SEO fundamentals every developer should know',
  'Shipping faster with a block-based page builder', 'Typography choices that make reading effortless', 'How we cut our page load time in half',
  'A practical guide to headless CMS architecture', 'Micro-interactions that delight your users', 'From idea to launch: our product playbook',
];

module.exports = {
  id: 'nova',
  name: 'Nova',
  category: 'Business & blog',
  description: 'A polished company website with a landing page, pricing, testimonials and a modern blog.',
  features: { formats: ['STANDARD', 'GALLERY'], series: [], blocks: ['Headers', 'Content', 'Media', 'Dynamic', 'Conversion', 'Layout'] },
  layout: { header: 'default', article: 'blog', listing: 'cards' },
  general: { siteName: 'Nova CMS', tagline: 'Build beautiful websites, faster.' },
  appearance: {
    preset: 'aurora', primaryColor: '#6d5dfc', accentColor: '#16c79a', backgroundColor: '#ffffff', surfaceColor: '#f6f7fb', textColor: '#0f172a',
    darkBackgroundColor: '#0b0d17', darkSurfaceColor: '#141729', darkTextColor: '#e7e9f3', headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter',
    radius: 16, colorMode: 'system', headerStyle: 'glass', footerStyle: 'columns', blogLayout: 'grid',
    headerCta: { enabled: true, label: 'Get started', url: '/contact' },
    announcement: { enabled: true, text: 'Nova CMS 1.0 is here — fully customizable, blazing fast.', linkLabel: 'Read more', url: '/blog' },
  },
  menus: {
    header: { name: 'Main menu', items: [m('Home', '/'), m('Blog', '/blog', [m('Design', '/category/design'), m('Engineering', '/category/engineering'), m('Product', '/category/product'), m('Tutorials', '/category/tutorials')]), m('About', '/about'), m('FAQ', '/faq'), m('Contact', '/contact')] },
    footer: { name: 'Company', items: [m('About', '/about'), m('Blog', '/blog'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
    'footer-2': { name: 'Resources', items: [m('Tutorials', '/category/tutorials'), m('Engineering', '/category/engineering'), m('FAQ', '/faq'), m('Sitemap', '/sitemap.xml')] },
  },
  pages: () => [
    {
      slug: 'nova-home', title: 'Home', home: true, template: 'landing', seoTitle: 'Nova CMS — Build websites your team will love',
      blocks: [
        B('hero', { variant: 'split', eyebrow: 'Introducing Nova CMS', title: 'Build websites your team will actually love to manage', subtitle: 'A modern, fully customizable content platform powered by Express, Next.js and PostgreSQL. Design visually, publish instantly, scale effortlessly.', primaryLabel: 'Start building', primaryUrl: '/contact', secondaryLabel: 'Read the blog', secondaryUrl: '/blog', image: pic('nova-hero', 1200, 900) }, { background: 'gradient', paddingY: 'lg', animate: true }),
        B('logos', { title: 'Trusted by fast-moving teams', items: ['Lumen', 'Stackwise', 'Bloom', 'Northwind', 'Acme', 'Vertex'] }, { paddingY: 'sm' }),
        B('features', { eyebrow: 'Everything included', title: 'All the power, none of the bloat', subtitle: 'Every feature you need to run a professional website — beautifully integrated.', columns: 3, items: [
          { icon: 'LayoutGrid', title: 'Visual page builder', text: 'Compose pages from flexible, reusable blocks with live preview.' },
          { icon: 'Palette', title: 'Themes & customizer', text: 'Switch site themes and tweak colors, fonts and layouts — no code required.' },
          { icon: 'Image', title: 'Media library', text: 'Organize uploads in folders and drop them anywhere in your content.' },
          { icon: 'ShieldCheck', title: 'Roles & permissions', text: 'Granular access control for every member of your team.' },
          { icon: 'Search', title: 'SEO built-in', text: 'Meta tags, Open Graph, sitemaps and clean URLs out of the box.' },
          { icon: 'Zap', title: 'Blazing fast', text: 'Server-rendered with Next.js and cached for instant page loads.' },
        ] }, { paddingY: 'lg' }),
        B('stats', { items: [{ value: '99.9%', label: 'Uptime' }, { value: '45ms', label: 'Avg. response' }, { value: '12k+', label: 'Pages published' }, { value: '4.9/5', label: 'Editor rating' }] }, { background: 'primary' }),
        B('imageText', { eyebrow: 'Built for editors', title: 'Write in a distraction-free editor', text: 'A rich text editor that feels familiar, with headings, lists, quotes, code, images and links. Scheduling keeps your workflow smooth.', image: pic('nova-editor', 1200, 900), imagePosition: 'right', bullets: ['Rich text with keyboard shortcuts', 'Scheduled publishing', 'Per-post SEO controls'], buttonLabel: 'See it in action', buttonUrl: '/blog' }, { paddingY: 'lg' }),
        B('latestPosts', { eyebrow: 'From the blog', title: 'Fresh ideas, every week', count: 3, buttonLabel: 'View all posts', buttonUrl: '/blog' }, { background: 'surface', paddingY: 'lg' }),
        B('testimonials', { eyebrow: 'Testimonials', title: 'Loved by teams worldwide' }, { paddingY: 'lg' }),
        B('pricing', { eyebrow: 'Pricing', title: 'Simple, transparent pricing', plans: [
          { name: 'Starter', price: '$0', period: '/month', description: 'For personal projects', features: ['1 website', 'Unlimited posts', 'Community support'], buttonLabel: 'Get started', buttonUrl: '/contact', highlighted: false },
          { name: 'Pro', price: '$29', period: '/month', description: 'For growing teams', features: ['5 websites', 'Team roles', 'Priority support', 'Custom domains'], buttonLabel: 'Start free trial', buttonUrl: '/contact', highlighted: true },
          { name: 'Enterprise', price: 'Custom', period: '', description: 'For large organizations', features: ['Unlimited websites', 'SSO & audit logs', 'Dedicated manager'], buttonLabel: 'Contact sales', buttonUrl: '/contact', highlighted: false },
        ] }, { background: 'surface', paddingY: 'lg' }),
        B('faq', { eyebrow: 'FAQ', title: 'Questions? Answers.' }, { paddingY: 'lg' }),
        B('cta', { title: 'Ready to build something beautiful?', text: 'Join thousands of teams publishing faster with Nova CMS.', primaryLabel: 'Get started free', primaryUrl: '/contact', secondaryLabel: 'Talk to us', secondaryUrl: '/contact' }, { paddingY: 'lg' }),
        B('newsletter', { title: 'Stay in the loop', text: 'Product updates and articles, once a month. No spam.' }, { background: 'surface' }),
      ],
    },
    commonPages.about('Nova', 'We are a small team on a mission to make publishing on the web delightful.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const colors = { Design: '#ec4899', Engineering: '#6366f1', Product: '#14b8a6', Marketing: '#f59e0b', Tutorials: '#8b5cf6' };
    const cats = [];
    for (const [order, [name, color]] of Object.entries(colors).entries()) {
      cats.push(await prisma.category.create({ data: { name, slug: slug(name), color, order, description: `Stories and insights about ${name.toLowerCase()}.` } }));
    }
    const tags = await Promise.all(['nextjs', 'react', 'postgresql', 'ux', 'seo', 'performance', 'design-systems', 'typography'].map((t) => prisma.tag.create({ data: { name: t, slug: t } })));
    for (const [i, title] of TITLES.entries()) {
      const published = i < 10;
      const date = new Date(Date.now() - (i + 1) * 2.6 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt: 'A deep dive into the techniques, tools and mindset behind modern publishing — with practical tips you can apply today.',
          content: body(title), coverImage: pic(`nova-${i}`), status: published ? 'PUBLISHED' : 'DRAFT', featured: i < 3,
          views: rand(120, 4000), readingTime: 4 + (i % 5), publishedAt: published ? date : null, createdAt: date,
          authorId: authors[i % 2].id, categories: { connect: [{ id: cats[i % cats.length].id }] },
          tags: { connect: [tags[i % tags.length], tags[(i + 3) % tags.length]].map((t) => ({ id: t.id })) },
        },
      });
    }
    await seedFaqs(prisma, [
      ['Is Nova CMS free to use?', 'Yes. Nova CMS is open source and free for personal and commercial projects.'],
      ['Can I customize the design?', 'Absolutely. Pick a theme, then change colors, fonts, radius, header and footer styles from the Theme Customizer — no code required.'],
      ['Does it support SEO?', 'Every post and page has its own meta title, description and social image, plus a generated sitemap and robots.txt.'],
      ['How do I build pages?', 'Use the visual block builder: drag in heroes, feature grids, testimonials, pricing tables and more, then publish.'],
      ['Can I invite my team?', 'Yes — create users and assign granular roles and permissions to each of them.'],
    ]);
    await prisma.testimonial.createMany({
      data: [
        { name: 'Sarah Chen', position: 'Head of Marketing', company: 'Lumen', avatar: 'https://i.pravatar.cc/200?img=5', content: 'We rebuilt our entire marketing site in a weekend. The block builder is a joy to use and our team finally owns the website.', rating: 5, order: 0 },
        { name: 'Marcus Johnson', position: 'CTO', company: 'Stackwise', avatar: 'https://i.pravatar.cc/200?img=14', content: 'Clean API, sensible data model, and the performance is outstanding. Exactly what we wanted from a modern CMS.', rating: 5, order: 1 },
        { name: 'Amara Okafor', position: 'Founder', company: 'Bloom Studio', avatar: 'https://i.pravatar.cc/200?img=32', content: 'The theme customizer let us match our brand perfectly without touching a line of code. Our clients love it.', rating: 5, order: 2 },
      ],
    });
  },
};
