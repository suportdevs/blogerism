// Ten homepage demos for Folio. Every demo reuses the same CV data (profile, skills, experience, projects, education)
// in a different design. Header menus link to #about, #skills, #experience, #projects and #contact, so every demo keeps those anchors.
const { B: block, un, demoVariant } = require('./helpers');
const folio = require('./folio');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };
const W = { width: 'wide' };
const demo = (def) => demoVariant(folio, { source: 'folio-demos.js', blocks: ['Portfolio', 'Luxury', 'Showcase'], ...def });

const homeBlocks = folio.pages().find((p) => p.home).blocks;
const data = (type, n = 0) => structuredClone(homeBlocks.filter((b) => b.type === type)[n]?.data || {});
const hero = data('profileHero');
const about = data('aboutMe');
const skills = data('skills');
const experience = data('timeline', 0);
const education = data('timeline', 1);
const projects = data('projects');
const stats = data('stats');
const NAME = hero.name;
const SHORT = NAME.replace(/^md\.?\s+/i, ''); // "Mamunur Rashid"

const IMG = { desk: '1498050108023-c5249f4df085', code: '1555066931-4365d14bab8c', code2: '1587620962725-abab7fe55159', code3: '1461749280684-dccba630e2f6', screen: '1488590528505-98d2b5aba04b', laptop: '1517694712202-14dd9538aa97', analytics: '1460925895917-afdab827c52f', charts: '1551288049-bebda4e38f71', team: '1522071820081-009f0129c71c', workspace: '1497032628192-86f99bcd76bc', wireframes: '1522542550221-31fd19575a2d', designer: '1542744094-3a31f272c490', circuit: '1518770660439-4636190af475', matrix: '1526374965328-7f61d4dc18c5', mountain: '1492691527719-9d1e07e534b4', lake: '1493246507139-91e8fad9978e', office: '1497366811353-6870744d04b2' };
const SHOTS = [IMG.analytics, IMG.charts, IMG.designer, IMG.screen, IMG.code2, IMG.wireframes, IMG.laptop];

// Projects with screenshots, for designs that need imagery.
const projectsWithImages = () => ({ ...projects, items: projects.items.map((p, i) => ({ ...p, image: p.image || un(SHOTS[i % SHOTS.length], 1200) })) });
const caseItems = (n = 4) => projects.items.slice(0, n).map((p, i) => ({ image: un(SHOTS[i % SHOTS.length], 1400), client: p.category, title: p.title, text: p.description, metrics: [[{ value: '6+', label: 'Business units' }, { value: '30%', label: 'Less manual work' }], [{ value: '35%', label: 'Faster pages' }, { value: '<300ms', label: 'API response' }], [{ value: 'Multi', label: 'Tenant SaaS' }, { value: '99.9%', label: 'Uptime' }], [{ value: 'Real-time', label: 'Stock tracking' }, { value: '24/7', label: 'Operations' }]][i % 4], tags: p.tags, url: p.url }));
const contact = (title = 'Let’s work together', style = {}) => B('contactForm', { title, text: 'Tell me about your project — I usually reply within 24 hours.', showInfo: true }, { paddingY: 'xl', anchor: 'contact', ...style });
const SERVICES = [
  ['Boxes', 'ERP systems', 'POS, inventory, HR and accounting in one system — built around how your business really works.'],
  ['Cloud', 'Multi-tenant SaaS', 'Scalable SaaS platforms with tenant isolation, billing-ready architecture and RBAC.'],
  ['Server', 'REST APIs', 'Secure, documented APIs with JWT/Sanctum auth for web and mobile apps.'],
  ['Gauge', 'Performance tuning', 'Query optimisation, indexing and caching — faster pages and smaller server bills.'],
];

/* 1 ─ Minimal */
const minimal = demo({
  id: 'folio-minimal', name: 'Minimal',
  description: 'A quiet, typographic portfolio: transparent minimal header, full-screen photo hero, about, projects, skills, experience and contact.',
  layout: { header: 'minimal' },
  appearance: { primaryColor: '#111827', accentColor: '#6b7280', backgroundColor: '#ffffff', surfaceColor: '#f5f5f5', textColor: '#111111', darkBackgroundColor: '#0a0a0a', darkSurfaceColor: '#151515', darkTextColor: '#f2f2f2', headingFont: 'Inter', bodyFont: 'Inter', radius: 0, colorMode: 'light', footerStyle: 'simple' },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'left', interval: 8, slides: [{ image: un(IMG.desk, 2200), eyebrow: hero.roles[0], title: NAME, subtitle: hero.intro, buttonLabel: 'Selected work', buttonUrl: '#projects' }] }, HERO),
    B('aboutMe', about, { paddingY: 'xl', anchor: 'about' }),
    B('projects', projects, { background: 'surface', paddingY: 'xl', anchor: 'projects', ...W }),
    B('skills', skills, { paddingY: 'xl', anchor: 'skills' }),
    B('timeline', experience, { background: 'surface', paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    contact('Say hello'),
  ],
});

/* 2 ─ Terminal */
const terminal = demo({
  id: 'folio-terminal', name: 'Terminal',
  description: 'A hacker-green terminal aesthetic: monospace everything, code-card hero, scrolling stack marquee, skills, experience and projects.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#16a34a', accentColor: '#22d3ee', backgroundColor: '#f6fbf7', surfaceColor: '#e9f3ec', textColor: '#08120b', darkBackgroundColor: '#030805', darkSurfaceColor: '#0b140e', darkTextColor: '#d7f5df', headingFont: 'JetBrains Mono', bodyFont: 'JetBrains Mono', radius: 6, colorMode: 'dark', headerStyle: 'solid', footerStyle: 'simple' },
  home: () => [
    B('profileHero', { ...hero, greeting: '$ whoami →' }, { paddingY: 'xl', ...W, anchor: 'home', animate: false }),
    B('textMarquee', { items: ['Laravel', 'Node.js', 'Django', 'React', 'Next.js', 'PostgreSQL'], speed: 34, twoRows: false }, { background: 'surface', paddingY: 'sm', width: 'full' }),
    B('aboutMe', about, { paddingY: 'xl', anchor: 'about' }),
    B('skills', skills, { background: 'surface', paddingY: 'xl', anchor: 'skills' }),
    B('timeline', experience, { paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    B('projects', projects, { background: 'surface', paddingY: 'xl', anchor: 'projects', ...W }),
    contact('./contact --now'),
  ],
});

/* 3 ─ Studio */
const studio = demo({
  id: 'folio-studio', name: 'Studio',
  description: 'A creative-studio portfolio: fixed sidebar navigation, giant rotating-word headline, stacking case studies, services and statement footer.',
  layout: { header: 'sidebar' },
  appearance: { primaryColor: '#ff5a1f', accentColor: '#7c3aed', backgroundColor: '#f6f3ee', surfaceColor: '#ece7df', textColor: '#121110', darkBackgroundColor: '#0c0b0a', darkSurfaceColor: '#171614', darkTextColor: '#f1eee9', headingFont: 'Syne', bodyFont: 'Inter', radius: 6, colorMode: 'light', footerStyle: 'big' },
  home: () => [
    B('kineticHero', { eyebrow: `${NAME} — ${hero.location}`, lines: ['I build'], rotate: ['ERPs.', 'SaaS.', 'APIs.', 'products.'], subtitle: hero.intro, primaryLabel: 'Selected work', primaryUrl: '#projects', secondaryLabel: 'Hire me', secondaryUrl: '#contact', image: un(IMG.code, 500), badge: 'Available for work ✦ Available for work ✦ ', marquee: ['Laravel', 'Node.js', 'Django', 'React', 'Next.js', 'PostgreSQL'] }, { paddingY: 'xl', width: 'wide', animate: false }),
    B('caseStudies', { eyebrow: 'Selected work', title: 'Systems in production', subtitle: '', variant: 'stack', items: caseItems(4) }, { paddingY: 'xl', anchor: 'projects', ...W }),
    B('serviceCards', { eyebrow: 'Services', title: 'What I can build for you', subtitle: '', variant: 'rows', columns: 3, buttonLabel: '', buttonUrl: '', items: SERVICES.map(([icon, title, text], i) => ({ icon, title, text, image: un(SHOTS[i], 600), url: '#contact', linkLabel: '' })) }, { anchor: 'about', ...W }),
    B('skills', skills, { background: 'surface', paddingY: 'xl', anchor: 'skills', ...W }),
    B('timeline', experience, { paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    contact('Got a project? Let’s talk.', { background: 'surface' }),
  ],
});

/* 4 ─ Corporate */
const corporate = demo({
  id: 'folio-corporate', name: 'Corporate',
  description: 'A recruiter-ready corporate CV: contact top bar, framed hero with stats, overlapping highlights, experience, skills and a call booking form.',
  layout: { header: 'corporate' },
  appearance: { primaryColor: '#1d4ed8', accentColor: '#0ea5e9', backgroundColor: '#ffffff', surfaceColor: '#f2f5fb', textColor: '#0b1324', darkBackgroundColor: '#060b16', darkSurfaceColor: '#0e1626', darkTextColor: '#e5ebf6', headingFont: 'Manrope', bodyFont: 'Inter', radius: 10, colorMode: 'light', footerStyle: 'columns', headerCta: { enabled: true, label: 'Book a call', url: '/#contact' } },
  home: () => [
    B('splitHero', { variant: 'framed', eyebrow: hero.availability, title: NAME, highlight: hero.roles[0], subtitle: hero.intro, bullets: hero.badges, primaryLabel: 'Book a call', primaryUrl: '#contact', secondaryLabel: 'View projects', secondaryUrl: '#projects', image: un(IMG.office, 1200), image2: '', badges: [{ icon: 'Boxes', value: stats.items[1].value, label: stats.items[1].label }, { icon: 'Users', value: stats.items[3].value, label: stats.items[3].label }], proof: '', avatars: [] }, { background: 'surface', paddingY: 'xl', animate: false }),
    B('trustBar', { variant: 'overlap', items: [{ icon: 'Server', title: '150+ REST APIs', text: 'Documented and secured.' }, { icon: 'Gauge', title: '35% faster', text: 'Page loads after tuning.' }, { icon: 'ShieldCheck', title: '99.9% uptime', text: 'Across production apps.' }, { icon: 'Clock', title: '24h replies', text: 'On every enquiry.' }] }, { paddingY: 'sm' }),
    B('aboutMe', about, { paddingY: 'xl', anchor: 'about' }),
    B('timeline', experience, { background: 'surface', paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    B('skills', skills, { paddingY: 'xl', anchor: 'skills' }),
    B('projects', projectsWithImages(), { background: 'surface', paddingY: 'xl', anchor: 'projects', ...W }),
    B('appointment', { eyebrow: 'Contact', title: 'Book a 30-minute call', text: 'Pick a time — I will send a meeting link by email.', serviceLabel: 'Topic', services: ['Full-time role', 'Freelance project', 'Consulting', 'Something else'], firstSlot: '10:00', lastSlot: '19:00', interval: 60, image: '', phone: folio.contact.phone, bullets: ['Based in Dhaka (GMT+6)', 'Remote-friendly', 'English & Bengali'] }, { paddingY: 'xl', anchor: 'contact' }),
  ],
});

/* 5 ─ Swiss */
const swiss = demo({
  id: 'folio-swiss', name: 'Swiss',
  description: 'A Swiss-grid portfolio in black, white and red: centered header, big stats, bento capabilities, project grid, timeline and split CTA.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#e10600', accentColor: '#111111', backgroundColor: '#ffffff', surfaceColor: '#f3f3f3', textColor: '#0a0a0a', darkBackgroundColor: '#0a0a0a', darkSurfaceColor: '#161616', darkTextColor: '#f5f5f5', headingFont: 'Archivo', bodyFont: 'Inter', radius: 0, colorMode: 'light', headerStyle: 'centered', footerStyle: 'simple' },
  home: () => [
    B('hero', { variant: 'centered', eyebrow: hero.roles[0], title: `${NAME}.`, subtitle: hero.intro, primaryLabel: 'Projects', primaryUrl: '#projects', secondaryLabel: 'Contact', secondaryUrl: '#contact', image: '' }, { paddingY: 'xl', animate: false }),
    B('stats', stats, { background: 'primary', paddingY: 'lg' }),
    B('bentoGrid', { eyebrow: 'Capabilities', title: 'Full stack, end to end', subtitle: '', items: [
      { icon: 'Server', title: 'Backend', text: skills.groups[0].items.join(' · '), size: 'lg', visual: 'code', image: '' },
      { icon: 'Code2', title: 'Frontend', text: skills.groups[1].items.join(' · '), size: 'tall', visual: '', image: '' },
      { icon: 'Database', title: 'Data', text: skills.groups[3].items.join(' · '), size: 'sm', visual: '', image: '' },
      { icon: 'Gauge', title: 'Performance', text: skills.groups[5].items.join(' · '), size: 'wide', visual: 'chart', image: '' },
      { icon: 'Terminal', title: 'DevOps', text: skills.groups[6].items.join(' · '), size: 'sm', visual: '', image: '' },
    ] }, { paddingY: 'xl', anchor: 'skills', ...W }),
    B('aboutMe', about, { background: 'surface', paddingY: 'xl', anchor: 'about' }),
    B('projects', projectsWithImages(), { paddingY: 'xl', anchor: 'projects', ...W }),
    B('timeline', experience, { background: 'surface', paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    B('ctaBanner', { variant: 'split', image: un(IMG.code3, 1400), eyebrow: 'Available now', title: 'Need a developer who ships?', text: hero.availability, primaryLabel: 'Get in touch', primaryUrl: '#contact', phone: '' }, { paddingY: 'lg', ...W }),
    contact(),
  ],
});

/* 6 ─ Freelancer */
const freelancer = demo({
  id: 'folio-freelancer', name: 'Freelancer',
  description: 'A client-winning freelance site: floating header, collage hero, service tiles, process steps, fixed-price packages and contact.',
  layout: { header: 'floating' },
  appearance: { primaryColor: '#10b981', accentColor: '#6366f1', backgroundColor: '#f8fdfb', surfaceColor: '#eaf7f1', textColor: '#0a1712', darkBackgroundColor: '#04100b', darkSurfaceColor: '#0b1c15', darkTextColor: '#e1f3ea', headingFont: 'Outfit', bodyFont: 'Inter', radius: 18, colorMode: 'light', footerStyle: 'big', headerCta: { enabled: true, label: 'Hire me', url: '/#contact' } },
  home: () => [
    B('splitHero', { variant: 'collage', eyebrow: hero.availability, title: 'Business software that', highlight: 'just works', subtitle: `I’m ${NAME} — I design and build ERPs, SaaS platforms and APIs for growing businesses.`, bullets: ['Fixed-price projects', 'Weekly demos', 'Clean, documented code', 'Ongoing support'], primaryLabel: 'See packages', primaryUrl: '#packages', secondaryLabel: 'View work', secondaryUrl: '#projects', image: un(IMG.desk, 1000), image2: un(IMG.charts, 700), badges: [{ icon: 'Boxes', value: '18+', label: 'Apps shipped' }, { icon: 'Star', value: '100%', label: 'Repeat clients' }], proof: '', avatars: [] }, { paddingY: 'xl', anchor: 'about', animate: false }),
    B('serviceCards', { eyebrow: 'Services', title: 'How I can help', subtitle: '', variant: 'icon', columns: 4, buttonLabel: '', buttonUrl: '', items: SERVICES.map(([icon, title, text]) => ({ icon, title, text, image: '', url: '#contact', linkLabel: 'Discuss' })) }, { background: 'surface', paddingY: 'xl', anchor: 'skills', ...W }),
    B('steps', { eyebrow: 'Process', title: 'How we’ll work together', variant: 'timeline', items: [{ icon: 'MessageCircle', title: 'Discovery call', text: 'We map your workflows and goals.' }, { icon: 'FileText', title: 'Proposal', text: 'A fixed price and a clear timeline.' }, { icon: 'Code2', title: 'Build', text: 'Weekly demos on a staging link.' }, { icon: 'Rocket', title: 'Launch & support', text: 'Deployment, training and maintenance.' }] }, { paddingY: 'xl', anchor: 'experience' }),
    B('projects', projectsWithImages(), { background: 'surface', paddingY: 'xl', anchor: 'projects', ...W }),
    B('pricing', { eyebrow: 'Packages', title: 'Transparent starting prices', plans: [
      { name: 'API & integration', price: '$800', period: '+', description: 'For apps that need a solid backend', features: ['REST API design', 'Auth & RBAC', 'Documentation'], buttonLabel: 'Enquire', buttonUrl: '#contact', highlighted: false },
      { name: 'Business web app', price: '$2,500', period: '+', description: 'Most popular', features: ['Custom workflows', 'Admin dashboard', 'Reports', '1 month support'], buttonLabel: 'Enquire', buttonUrl: '#contact', highlighted: true },
      { name: 'ERP / SaaS', price: 'Custom', period: '', description: 'For multi-unit businesses', features: ['POS & inventory', 'HR & accounting', 'Multi-tenant', 'Ongoing support'], buttonLabel: 'Book a call', buttonUrl: '#contact', highlighted: false },
    ] }, { paddingY: 'xl', anchor: 'packages' }),
    contact('Start your project', { background: 'surface' }),
  ],
});

/* 7 ─ Neon */
const neon = demo({
  id: 'folio-neon', name: 'Neon',
  description: 'A glowing dark portfolio: pill navigation, aurora spotlight hero with a 3D dashboard, bento highlights, projects and skills.',
  layout: { header: 'portfolio' },
  appearance: { primaryColor: '#a855f7', accentColor: '#22d3ee', backgroundColor: '#fbf9ff', surfaceColor: '#f2eefb', textColor: '#120d1f', darkBackgroundColor: '#06040c', darkSurfaceColor: '#100b1c', darkTextColor: '#efe9fb', headingFont: 'Sora', bodyFont: 'Inter', radius: 20, colorMode: 'dark', footerStyle: 'simple', headerCta: { enabled: true, label: 'Hire me', url: '/#contact' } },
  home: () => [
    B('spotlightHero', { badge: hero.availability, badgeUrl: '#contact', title: 'I build software that', highlight: 'scales with you', subtitle: hero.intro, primaryLabel: 'View projects', primaryUrl: '#projects', secondaryLabel: 'Contact me', secondaryUrl: '#contact', note: `${NAME} · ${hero.location}`, domain: 'dashboard.app', image: '' }, { paddingY: 'none', width: 'wide', animate: false }),
    B('bentoGrid', { eyebrow: 'Highlights', title: 'By the numbers', subtitle: '', items: [
      { icon: 'Boxes', title: '18+ production apps', text: 'ERPs and SaaS platforms used every day.', size: 'lg', visual: 'metrics', image: '' },
      { icon: 'Users', title: '100K+ monthly users', text: 'Across all live systems.', size: 'tall', visual: 'avatars', image: '' },
      { icon: 'Gauge', title: '<300ms APIs', text: 'From 1.2s after optimisation.', size: 'sm', visual: '', image: '' },
      { icon: 'Server', title: '150+ REST APIs', text: 'JWT/Sanctum, RBAC, documented.', size: 'wide', visual: 'code', image: '' },
    ] }, { paddingY: 'xl', anchor: 'about', ...W }),
    B('projects', projectsWithImages(), { background: 'surface', paddingY: 'xl', anchor: 'projects', ...W }),
    B('skills', skills, { paddingY: 'xl', anchor: 'skills' }),
    B('timeline', experience, { background: 'surface', paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    contact(),
  ],
});

/* 8 ─ Brutal */
const brutal = demo({
  id: 'folio-brutal', name: 'Brutal',
  description: 'A loud neo-brutalist portfolio: athletic header with full-screen menu, giant name headline, word marquee, projects and timeline.',
  layout: { header: 'bold' },
  appearance: { primaryColor: '#111111', accentColor: '#ff3b30', backgroundColor: '#fde047', surfaceColor: '#fcd34d', textColor: '#0a0a0a', darkBackgroundColor: '#0a0a0a', darkSurfaceColor: '#171717', darkTextColor: '#fde047', headingFont: 'Archivo', bodyFont: 'Inter', radius: 0, colorMode: 'light', footerStyle: 'big', headerCta: { enabled: true, label: 'Hire me', url: '/#contact' } },
  home: () => [
    B('kineticHero', { eyebrow: hero.roles[0], lines: SHORT.split(' '), rotate: [], subtitle: hero.intro, primaryLabel: 'See work', primaryUrl: '#projects', secondaryLabel: 'Contact', secondaryUrl: '#contact', image: '', badge: 'Full stack ✦ Full stack ✦ ', marquee: ['Laravel', 'Node.js', 'Django', 'React', 'Next.js'] }, { paddingY: 'xl', width: 'wide', anchor: 'about', animate: false }),
    B('stats', stats, { background: 'dark', paddingY: 'lg' }),
    B('projects', projectsWithImages(), { paddingY: 'xl', anchor: 'projects', ...W }),
    B('textMarquee', { items: ['ERP', 'SaaS', 'API', 'Real-time'], speed: 26, twoRows: true }, { paddingY: 'md', width: 'full' }),
    B('skills', skills, { background: 'surface', paddingY: 'xl', anchor: 'skills' }),
    B('timeline', experience, { paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    contact('Let’s build something loud', { background: 'surface' }),
  ],
});

/* 9 ─ Story */
const story = demo({
  id: 'folio-story', name: 'Story',
  description: 'A narrative portfolio: transparent header over a landscape slideshow, scroll-filling journey steps, statement, timeline and projects.',
  layout: { header: 'overlay' },
  appearance: { primaryColor: '#0ea5e9', accentColor: '#f59e0b', backgroundColor: '#fbfbf8', surfaceColor: '#f1f1ea', textColor: '#14161a', darkBackgroundColor: '#090b0e', darkSurfaceColor: '#12151a', darkTextColor: '#e9ecf0', headingFont: 'Fraunces', bodyFont: 'Inter', radius: 16, colorMode: 'light', footerStyle: 'simple', headerCta: { enabled: true, label: 'Contact', url: '/#contact' } },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'center', interval: 7, slides: [
      { image: un(IMG.mountain, 2200), eyebrow: 'My story', title: 'From a diploma to 18 apps in production', subtitle: hero.intro, buttonLabel: 'Read the journey', buttonUrl: '#experience' },
      { image: un(IMG.lake, 2200), eyebrow: hero.location, title: 'Building software real teams depend on', subtitle: '', buttonLabel: 'See projects', buttonUrl: '#projects' },
    ] }, HERO),
    B('luxeStatement', { overline: 'Why I build', text: 'Good software disappears into the work. When a bakery can run six units from one screen, that’s the job done.', signature: NAME }, { paddingY: 'xl', anchor: 'about' }),
    B('steps', { eyebrow: 'The journey', title: 'How I got here', variant: 'vertical', items: [
      { icon: 'GraduationCap', title: 'SSC — Electronics Technology', text: 'Rangpur Technical School & College, 2016–2017.' },
      { icon: 'Cpu', title: 'Diploma in Computer Engineering', text: 'Rangpur Polytechnic Institute, 2017–2022.' },
      { icon: 'Briefcase', title: 'Application Developer', text: 'Legend IT Solution, since January 2022.' },
      { icon: 'Rocket', title: '18+ production systems', text: 'ERPs and SaaS platforms serving 100,000+ monthly users.' },
    ] }, { background: 'surface', paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    B('timeline', experience, { paddingY: 'xl', width: 'narrow' }),
    B('projects', projectsWithImages(), { background: 'surface', paddingY: 'xl', anchor: 'projects', ...W }),
    B('skills', skills, { paddingY: 'xl', anchor: 'skills' }),
    contact('Write the next chapter with me', { background: 'surface' }),
  ],
});

/* 10 ─ Gazette */
const gazette = demo({
  id: 'folio-gazette', name: 'Gazette',
  description: 'A CV styled as a broadsheet newspaper: masthead with your name, front-page statement, about, experience, education, skills and projects.',
  layout: { header: 'masthead' },
  appearance: { primaryColor: '#b91c1c', accentColor: '#1f2937', backgroundColor: '#f7f3ea', surfaceColor: '#ede6d7', textColor: '#1a1814', darkBackgroundColor: '#12110e', darkSurfaceColor: '#1d1b16', darkTextColor: '#ece6d8', headingFont: 'Source Serif 4', bodyFont: 'Work Sans', radius: 0, colorMode: 'light', footerStyle: 'luxe', headerCta: { enabled: true, label: 'Hire me', url: '/#contact' } },
  home: () => [
    B('luxeStatement', { overline: `Front page · ${hero.location}`, text: 'Local developer ships 18 enterprise systems — and cuts response times from 1.2 seconds to under 300 milliseconds.', signature: 'Special report' }, { paddingY: 'xl' }),
    B('stats', stats, { background: 'surface', paddingY: 'md' }),
    B('aboutMe', about, { paddingY: 'xl', anchor: 'about' }),
    B('timeline', experience, { background: 'surface', paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
    B('projects', projects, { paddingY: 'xl', anchor: 'projects', ...W }),
    B('skills', skills, { background: 'surface', paddingY: 'xl', anchor: 'skills' }),
    B('timeline', education, { paddingY: 'xl', width: 'narrow', anchor: 'education' }),
    contact('Letters to the editor', { background: 'surface' }),
  ],
});

module.exports = [minimal, terminal, studio, corporate, swiss, freelancer, neon, brutal, story, gazette];
