// Homepage demos for Folio. Every demo reuses the same CV data (profile, skills, experience, projects, education)
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
    B('appointment', { requestType: 'consultation', eyebrow: 'Contact', title: 'Book a 30-minute call', text: 'Pick a time — I will send a meeting link by email.', serviceLabel: 'Topic', services: ['Full-time role', 'Freelance project', 'Consulting', 'Something else'], firstSlot: '10:00', lastSlot: '19:00', interval: 60, image: '', phone: folio.contact.phone, bullets: ['Based in Dhaka (GMT+6)', 'Remote-friendly', 'English & Bengali'] }, { paddingY: 'xl', anchor: 'contact' }),
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

/* 11 ─ Glow */
// Pure black with a neon glow: centered name hero with floating chips, giant solid/outline titles, glass bio card,
// glowing timelines and a "tech set" of brand-logo tiles that glow in each brand's colour.
const TECH = (label, logo, color) => ({ label, logo, color, image: '' });
const glow = demo({
  id: 'folio-glow', name: 'Glow',
  description: 'A neon-on-black developer portfolio: glowing name hero with floating chips, giant outline titles, glass bio card, glowing timelines and a brand-logo tech set.',
  layout: { header: 'minimal' },
  appearance: { primaryColor: '#1cc8ff', accentColor: '#7af5d6', backgroundColor: '#f4f8fb', surfaceColor: '#e6eef4', textColor: '#05080b', darkBackgroundColor: '#000000', darkSurfaceColor: '#0a1218', darkTextColor: '#ffffff', headingFont: 'Fugaz One', bodyFont: 'Open Sans', radius: 12, colorMode: 'dark', footerStyle: 'simple', headerCta: { enabled: true, label: 'Hire me', url: '/#contact' } },
  home: () => [
    B('glowHero', {
      greeting: 'Hi, I am', name: SHORT.split(' ')[0], role: hero.roles[0], intro: '',
      chips: [{ label: 'About me', url: '#about', position: 'tl' }, { label: 'Projects', url: '#projects', position: 'tr' }, { label: 'Tech', url: '#skills', position: 'br' }],
      socials: [
        { icon: 'Github', url: folio.social.github, label: 'GitHub' },
        { icon: 'Linkedin', url: folio.social.linkedin, label: 'LinkedIn' },
        { icon: 'Mail', url: `mailto:${folio.contact.email}`, label: 'Email' },
      ],
    }, { paddingY: 'none', width: 'wide', anchor: 'home', animate: false }),
    B('glowAbout', {
      solid: 'About', outline: 'Me',
      lead: `👋 Hey, I’m ${SHORT}, a ${hero.roles[0]}.`,
      text: about.text,
      groups: [
        { title: 'Experience', anchor: 'experience', items: experience.items.map((e) => ({ title: e.title, org: `@${e.org}`, period: e.period, text: e.description || '', bullets: e.bullets.slice(0, 4).map((b) => b.replace(/^[^:]{3,40}:\s*/, '')) })) },
        { title: 'Education', anchor: 'education', items: education.items.map((e) => ({ title: e.title, org: e.org, period: e.period, text: '', bullets: [] })) },
      ],
    }, { paddingY: 'xl', width: 'wide', anchor: 'about' }),
    B('glowTech', {
      solid: 'Tech', outline: 'Set', titleSide: 'right',
      groups: [
        { title: 'Core stack I work with', items: [TECH('Laravel', 'laravel', '#FF2D20'), TECH('PHP', 'php', '#8892BF'), TECH('Node.js', 'nodedotjs', '#5FA04E'), TECH('Express', 'express', '#FFFFFF'), TECH('Django', 'django', '#44B78B'), TECH('Python', 'python', '#3776AB')] },
        { title: 'Frontend & UI', items: [TECH('JavaScript', 'javascript', '#F7DF1E'), TECH('React', 'react', '#61DAFB'), TECH('Next.js', 'nextdotjs', '#FFFFFF'), TECH('Redux', 'redux', '#9B6DD8'), TECH('Tailwind CSS', 'tailwindcss', '#06B6D4'), TECH('Material UI', 'mui', '#007FFF'), TECH('Bootstrap', 'bootstrap', '#9B6BF2')] },
        { title: 'Databases I use', items: [TECH('PostgreSQL', 'postgresql', '#4F8FEA'), TECH('MySQL', 'mysql', '#5D9BD5'), TECH('MongoDB', 'mongodb', '#47A248'), TECH('Prisma', 'prisma', '#FFFFFF')] },
        { title: 'Tools & DevOps', items: [TECH('Git', 'git', '#F05032'), TECH('GitHub', 'github', '#FFFFFF'), TECH('Ubuntu', 'ubuntu', '#E95420'), TECH('Nginx', 'nginx', '#009639'), TECH('PM2', 'pm2', '#A78BFA'), TECH('Postman', 'postman', '#FF6C37')] },
      ],
    }, { paddingY: 'lg', width: 'wide', anchor: 'skills' }),
    B('glowTitle', { solid: 'My', outline: 'Work', align: 'center', size: 'lg', subtitle: projects.subtitle }, { paddingY: 'md', anchor: 'projects' }),
    B('projects', { ...projectsWithImages(), eyebrow: '', title: '', subtitle: '' }, { paddingY: 'md', ...W }),
    B('stats', stats, { paddingY: 'lg' }),
    B('glowTitle', { solid: 'Say', outline: 'Hello', align: 'center', size: 'lg', subtitle: '' }, { paddingY: 'lg', anchor: 'contact' }),
    B('contactForm', { title: 'Got a project in mind?', text: hero.availability ? `${hero.availability}. I usually reply within 24 hours.` : 'I usually reply within 24 hours.', showInfo: true }, { paddingY: 'md' }),
  ],
});

/* 12 ─ Bento */
// A minimal software-engineer portfolio: bento hero (photo optional), filterable projects with case-study pages,
// tech stack, expandable work history, live GitHub repos, testimonials, writing and a printable résumé at /resume.
const { m: menuItem, face } = require('./helpers');
const LOGO = (label, logo, color) => ({ label, logo, color, image: '' });
const GH = folio.social.github;
const CATEGORY = (c) => (/saas/i.test(c) ? 'SaaS' : /erp/i.test(c) ? 'ERP systems' : 'Side projects');
const CASE = { 'Akboria Limited': '/akboria-erp-case-study', 'Tarek Bakery & Equator': '/tarek-saas-case-study' };
const CODE = { 'Real-Time Private Chat': `${GH}/node-chat-application` };
const bentoProjects = projects.items.map((p, i) => ({
  title: p.title, category: CATEGORY(p.category), year: i < 4 ? '2024' : '2023', summary: p.description, image: un(SHOTS[i % SHOTS.length], 1400),
  stack: p.tags.slice(0, 4), live: p.url || '', code: CODE[p.title] || '', caseStudy: CASE[p.title] || '', featured: !!CASE[p.title],
}));
const STACK = {
  backend: [LOGO('Laravel', 'laravel', '#FF2D20'), LOGO('PHP', 'php', '#777BB4'), LOGO('Node.js', 'nodedotjs', '#5FA04E'), LOGO('Express', 'express', ''), LOGO('Django', 'django', '#44B78B'), LOGO('Python', 'python', '#3776AB')],
  frontend: [LOGO('React', 'react', '#61DAFB'), LOGO('Next.js', 'nextdotjs', ''), LOGO('JavaScript', 'javascript', '#F7DF1E'), LOGO('Redux', 'redux', '#764ABC'), LOGO('Tailwind CSS', 'tailwindcss', '#06B6D4'), LOGO('Material UI', 'mui', '#007FFF'), LOGO('Bootstrap', 'bootstrap', '#7952B3')],
  data: [LOGO('PostgreSQL', 'postgresql', '#4169E1'), LOGO('MySQL', 'mysql', '#4479A1'), LOGO('MongoDB', 'mongodb', '#47A248'), LOGO('Prisma', 'prisma', ''), LOGO('Socket.io', 'socketdotio', '')],
  ops: [LOGO('Linux', 'linux', ''), LOGO('Ubuntu', 'ubuntu', '#E95420'), LOGO('Nginx', 'nginx', '#009639'), LOGO('PM2', 'pm2', ''), LOGO('Git', 'git', '#F05032'), LOGO('GitHub', 'github', ''), LOGO('Postman', 'postman', '#FF6C37')],
};
const plainBullet = (b) => b.replace(/^[^:]{3,40}:\s*/, '');

const caseStudy = ({ slug, title, project, client, year, duration, stack, metrics, challenge, built, results, cover, gallery }) => ({
  slug, title: `${title} — case study`, template: 'full-width', seoTitle: `${title} — case study | ${NAME}`,
  blocks: [
    B('caseStudyHero', { backLabel: 'All projects', backUrl: '/#projects', eyebrow: `Case study · ${project.category}`, title, summary: project.description, client, role: 'Lead full-stack developer', year, duration, stack, live: project.url, code: '', cover: un(cover, 2000), metrics }, { paddingY: 'lg', width: 'wide', animate: false }),
    B('richText', { html: `<h2>The challenge</h2>${challenge}<h2>What I built</h2>${built}<h2>Results</h2>${results}` }, { paddingY: 'md', width: 'narrow' }),
    B('gallery', { title: '', columns: 2, images: gallery.map((g) => ({ src: un(g, 1400), alt: title })) }, { paddingY: 'md', width: 'wide' }),
    B('cta', { title: 'Have a similar project?', text: 'I build ERPs, SaaS platforms and APIs that teams rely on every day.', primaryLabel: 'Start a conversation', primaryUrl: '/#contact', secondaryLabel: 'More projects', secondaryUrl: '/#projects' }, { paddingY: 'lg' }),
  ],
});
const akboria = projects.items.find((p) => p.title === 'Akboria Limited');
const tarek = projects.items.find((p) => p.title === 'Tarek Bakery & Equator');

const bento = demo({
  id: 'folio-bento', name: 'Bento',
  description: 'A minimal, modern software-engineer portfolio: bento hero with optional photo and live local time, filterable projects with case-study pages, tech stack, work history, live GitHub repos, writing and a printable résumé.',
  layout: { header: 'floating' },
  appearance: { primaryColor: '#3b5bfd', accentColor: '#14b8a6', backgroundColor: '#fafaf9', surfaceColor: '#ffffff', textColor: '#0c0c0d', darkBackgroundColor: '#09090b', darkSurfaceColor: '#131316', darkTextColor: '#ededef', headingFont: 'Geist', bodyFont: 'Geist', radius: 18, colorMode: 'light', footerStyle: 'simple', headerCta: { enabled: true, label: 'Let’s talk', url: '/#contact' } },
  menus: {
    header: { name: 'Main', items: [menuItem('Work', '/#projects'), menuItem('About', '/#about'), menuItem('Experience', '/#experience'), menuItem('Writing', '/blog'), menuItem('Résumé', '/resume')] },
    footer: { name: 'Links', items: [menuItem('Work', '/#projects'), menuItem('Writing', '/blog'), menuItem('Résumé', '/resume'), menuItem('Contact', '/#contact')] },
  },
  home: () => [
    B('devBento', {
      availability: hero.availability, greeting: 'Hi, I’m', name: SHORT, role: `${hero.roles[0]} · ${hero.roles[2]}`,
      intro: 'I design and ship ERPs, multi-tenant SaaS platforms and APIs that real businesses run on — 18+ systems in production, built to stay fast as they grow.',
      photo: '', location: hero.location, timezone: 'Asia/Dhaka', currentlyLabel: 'Currently', currently: 'Application Developer at Legend IT Solution — scaling ERP and SaaS products.',
      stats: [{ value: '3+', label: 'years shipping production code' }, { value: '18+', label: 'apps in production' }, { value: '<300ms', label: 'typical API response' }],
      stackLabel: 'Daily stack', stack: [...STACK.backend.slice(0, 4), ...STACK.frontend.slice(0, 3), ...STACK.data.slice(0, 3), STACK.ops[2]],
      primaryLabel: 'View projects', primaryUrl: '#projects', resumeLabel: 'Résumé', resumeUrl: '/resume', email: folio.contact.email,
      socials: [{ icon: 'Github', url: GH, label: 'GitHub' }, { icon: 'Linkedin', url: folio.social.linkedin, label: 'LinkedIn' }, { icon: 'Mail', url: `mailto:${folio.contact.email}`, label: 'Email' }],
    }, { paddingY: 'lg', width: 'wide', anchor: 'about', animate: false }),
    B('projectShowcase', { eyebrow: '01 · Selected work', title: 'Systems I’ve built', subtitle: 'Production ERPs and SaaS platforms used every day — plus a few things I build for fun.', filters: true, buttonLabel: 'GitHub', buttonUrl: GH, items: bentoProjects }, { paddingY: 'md', width: 'wide', anchor: 'projects' }),
    B('stackGrid', { eyebrow: '02 · Toolbox', title: 'The stack I reach for', subtitle: 'Picked for reliability first — then speed of delivery.', groups: [
      { icon: 'Server', title: 'Backend & APIs', text: 'REST APIs, auth & RBAC, queues, microservices.', wide: true, items: STACK.backend },
      { icon: 'Database', title: 'Data', text: 'Modelling, indexing, query tuning.', wide: false, items: STACK.data },
      { icon: 'Code2', title: 'Frontend', text: 'Fast, accessible interfaces.', wide: true, items: STACK.frontend },
      { icon: 'Terminal', title: 'Ops & tooling', text: 'Linux servers, deploys, CI.', wide: false, items: STACK.ops },
    ] }, { paddingY: 'lg', width: 'wide', anchor: 'skills' }),
    B('workHistory', { eyebrow: '03 · Experience', title: 'Where I’ve worked', subtitle: '', buttonLabel: 'Full résumé', buttonUrl: '/resume', items: [
      ...experience.items.map((e) => ({ company: e.org, role: e.title, period: e.period, location: e.location, logo: '', summary: e.description || '', bullets: e.bullets, tags: e.tags || [] })),
      ...education.items.slice(0, 2).map((e) => ({ company: e.org, role: e.title, period: e.period, location: e.location || '', logo: '', summary: '', bullets: e.bullets || [], tags: ['Education'] })),
    ] }, { paddingY: 'lg', width: 'wide', anchor: 'experience' }),
    B('githubRepos', { eyebrow: '04 · Open source', title: 'Recently on GitHub', subtitle: 'Experiments, starters and learning projects.', username: GH.split('/').pop(), sort: 'updated', count: 6, exclude: [GH.split('/').pop()], buttonLabel: 'All repositories' }, { paddingY: 'lg', width: 'wide' }),
    B('testimonials', { eyebrow: '05 · Kind words', title: 'What people say' }, { paddingY: 'lg', width: 'wide' }),
    B('latestPosts', { eyebrow: '06 · Writing', title: 'Notes from the work', count: 3, buttonLabel: 'All articles', buttonUrl: '/blog' }, { paddingY: 'lg', width: 'wide' }),
    B('contactForm', { title: 'Let’s build something reliable.', text: `${hero.availability}. Tell me about your project — I reply within 24 hours.`, showInfo: true }, { paddingY: 'xl', width: 'wide', anchor: 'contact' }),
  ],
});

// Printable résumé at /resume, generated from the same CV data (Bento and Loop).
const resumePage = () => ({
  slug: 'resume', title: 'Résumé', template: 'full-width', seoTitle: `Résumé — ${NAME}`,
  blocks: [B('resumeSheet', {
    name: NAME, role: hero.roles[0], email: folio.contact.email, phone: folio.contact.phone, location: hero.location, website: '',
    links: [{ label: GH.replace(/^https?:\/\//, ''), url: GH }, { label: folio.social.linkedin.replace(/^https?:\/\//, ''), url: folio.social.linkedin }],
    summary: about.text.split(/\n\n/)[0],
    experience: experience.items.map((e) => ({ role: e.title, company: e.org, period: e.period, location: e.location, bullets: e.bullets.slice(0, 6).map(plainBullet) })),
    projects: projects.items.slice(0, 6).map((p) => ({ title: p.title, url: p.url || '', summary: p.description })),
    skills: skills.groups.filter((g) => g.title !== 'Soft skills').map((g) => ({ title: g.title, items: g.items })),
    education: education.items.map((e) => ({ title: e.title, org: e.org, period: e.period })),
    printLabel: 'Download PDF', note: 'Always up to date — generated from this website.',
  }, { paddingY: 'xl', width: 'wide', animate: false })],
});

const bentoBasePages = bento.pages;
bento.pages = () => [
  ...bentoBasePages(),
  resumePage(),
  caseStudy({
    slug: 'akboria-erp-case-study', title: 'One ERP for six businesses', project: akboria, client: 'Akboria Limited', year: '2024', duration: 'Ongoing',
    stack: ['Laravel', 'MySQL', 'Tailwind CSS', 'REST APIs', 'RBAC'], cover: IMG.analytics, gallery: [IMG.charts, IMG.laptop],
    metrics: [{ value: '6+', label: 'business units on one system' }, { value: '30%', label: 'less manual operational work' }, { value: '1', label: 'shared POS, inventory & HR' }],
    challenge: '<p>Akboria runs a bakery, a hotel, a restaurant and sweet production — each with its own spreadsheets, cash counts and stock lists. Managers could not see the group’s position without collecting reports by hand.</p>',
    built: '<ul><li><strong>Centralised POS and inventory</strong> shared by every unit, with per-unit stock and transfers between them.</li><li><strong>HR and payroll workflows</strong> with role-based access so each manager sees only their unit.</li><li><strong>Reports for owners</strong> — sales, stock and staff across the whole group in one place.</li></ul><p>The system is modular: a new business unit is configuration, not new code.</p>',
    results: '<p>Daily operations moved off spreadsheets, manual workflow time dropped by around 30%, and owners now see the whole group in real time.</p>',
  }),
  caseStudy({
    slug: 'tarek-saas-case-study', title: 'Multi-tenant SaaS for food production', project: tarek, client: 'Tarek Bakery & Equator', year: '2024', duration: 'Ongoing',
    stack: ['Laravel', 'PostgreSQL', 'Multi-tenancy', 'Queues', 'REST APIs'], cover: IMG.designer, gallery: [IMG.screen, IMG.code2],
    metrics: [{ value: 'Multi', label: 'tenants on one platform' }, { value: '<300ms', label: 'API response after tuning' }, { value: '35%', label: 'faster page loads' }],
    challenge: '<p>Several food-production locations needed one platform for production, supply chain and corporate reporting — while keeping each location’s data strictly separate.</p>',
    built: '<ul><li><strong>Tenant isolation</strong> at the data layer, with central administration for head office.</li><li><strong>Production and supply-chain modules</strong> covering orders, batches and distribution.</li><li><strong>Performance work</strong> — indexing, eager loading and caching to keep responses fast as data grew.</li></ul>',
    results: '<p>Locations work in their own space while head office sees consolidated numbers, and response times stay under 300ms under daily load.</p>',
  }),
];

// Demo content: articles for the Writing section and testimonials. Replaces the Folio family's posts.
bento.demo = async (prisma, { authors }) => {
  const cats = {};
  for (const [slug, name, color] of [['engineering', 'Engineering', '#3b5bfd'], ['performance', 'Performance', '#14b8a6'], ['laravel', 'Laravel', '#ff2d20']]) cats[slug] = await prisma.category.create({ data: { name, slug, color } });
  const posts = [
    ['How I cut API response times from 1.2s to under 300ms', 'performance', IMG.charts, 'Indexes, eager loading and caching — in the order that actually mattered.', '<p>Slow endpoints rarely have one cause. When an ERP report endpoint crept past a second, I worked through it in a fixed order: measure, fix queries, then cache.</p><h2>1. Measure first</h2><p>Laravel Telescope and the database slow-query log showed the real problem: hundreds of small queries per request — a classic N+1 pattern hidden behind innocent-looking relationships.</p><h2>2. Fix the queries</h2><ul><li><strong>Eager load</strong> relationships used in loops (<code>with()</code>), turning 400 queries into 6.</li><li><strong>Add composite indexes</strong> matching the real <code>WHERE</code> and <code>ORDER BY</code> clauses.</li><li><strong>Select only the columns</strong> the response needs.</li></ul><h2>3. Cache what is read often</h2><p>Lookup tables and dashboard aggregates went into Redis with short, explicit lifetimes and invalidation on write.</p><p>The result: the endpoint settled under 300ms, and pages built on it loaded about 35% faster.</p>'],
    ['Designing role-based access control that doesn’t fall apart', 'engineering', IMG.code, 'Permissions as data, checked in one place — a pattern that scales from 3 roles to 30.', '<p>Every business app starts with “admin” and “user”. Six months later there are branch managers, cashiers and auditors — and permission checks scattered across controllers.</p><h2>Permissions are data</h2><p>Store permissions as named abilities (<code>sales.view</code>, <code>stock.adjust</code>) attached to roles, and let administrators edit roles without a deploy.</p><h2>Check in one place</h2><p>Use policies or middleware, never ad-hoc <code>if</code> statements in views. The UI should ask the same question the API does.</p><h2>Scope the data too</h2><p>In multi-unit ERPs a role is not enough — a branch manager must only see their branch. Add query scopes so the restriction is applied automatically.</p>'],
    ['Multi-tenant SaaS in Laravel: the decisions that matter early', 'laravel', IMG.screen, 'Single database or many? How I decide, and what I set up on day one.', '<p>Multi-tenancy is easy to start and expensive to change. These are the decisions I make before writing the first feature.</p><h2>Isolation model</h2><p>A shared database with a <code>tenant_id</code> on every table is simplest to run. Separate databases give stronger isolation and easier per-tenant backups. For most SMB SaaS I start shared — with global scopes so a query can never forget the tenant.</p><h2>Identify the tenant once</h2><p>Resolve the tenant from the subdomain or token in middleware, then make it available everywhere. Jobs and scheduled tasks need it too.</p><h2>Plan for the noisy neighbour</h2><p>Rate limits, queues per tenant and indexes that start with <code>tenant_id</code> keep one large customer from slowing everyone else down.</p>'],
  ];
  for (const [i, [title, cat, img, excerpt, content]] of posts.entries()) {
    const date = new Date(Date.now() - (i * 19 + 4) * 864e5);
    await prisma.post.create({ data: {
      title, slug: title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, ''), excerpt, content, coverImage: un(img, 1600), status: 'PUBLISHED',
      featured: i === 0, publishedAt: date, createdAt: date, readingTime: 4 + i, views: 400 + i * 230, authorId: authors[0]?.id, categories: { connect: [{ id: cats[cat].id }] },
    } });
  }
  await prisma.testimonial.createMany({ data: [
    { name: 'Nusrat Jahan', position: 'Operations Manager', company: 'Retail group', avatar: face('w3', 200), content: 'He turned a pile of spreadsheets into one system our managers actually enjoy using. Requests were understood the first time and shipped quickly.', rating: 5, order: 0 },
    { name: 'Arif Hossain', position: 'Product Owner', company: 'SaaS startup', avatar: face('m3', 200), content: 'Reliable, calm under deadlines and very strong on performance. Our slowest screens became our fastest.', rating: 5, order: 1 },
    { name: 'Farhana Akter', position: 'Team Lead', company: 'Software agency', avatar: face('w5', 200), content: 'Clean code, clear documentation and great communication. He is the developer you hand the hard problems to.', rating: 5, order: 2 },
  ] });
};

/* 13 ─ Loop */
// A dark, code-flavoured portfolio built around a Build → Learn → Improve → Repeat cycle: animated loop-ring hero with
// a fixed section rail, numbered "// 01. about_me" headings, a profile.json card, filterable projects, segmented
// skill meters, contact with a subject dropdown and an "end of file" sign-off. The lime accent is a highlighter.
const LOOP_CATEGORY = (c) => (/saas/i.test(c) ? 'SaaS' : /erp/i.test(c) ? 'ERP systems' : 'Side projects');
const SKILL = (label, level) => ({ label, level });
const LOOP_SOCIALS = [{ icon: 'Github', url: GH, label: 'GitHub' }, { icon: 'Linkedin', url: folio.social.linkedin, label: 'LinkedIn' }, { icon: 'Mail', url: `mailto:${folio.contact.email}`, label: 'Email' }];
const loop = demo({
  id: 'folio-loop', name: 'Loop',
  description: 'A dark, code-flavoured developer portfolio: animated Build → Learn → Improve → Repeat ring, fixed section rail, numbered comment-style headings, profile.json card, filterable projects, segmented skill meters and an “end of file” sign-off.',
  layout: { header: 'minimal' },
  appearance: { primaryColor: '#6c5cff', accentColor: '#c8f53b', backgroundColor: '#f4f2ec', surfaceColor: '#ffffff', textColor: '#111114', darkBackgroundColor: '#0b0b0e', darkSurfaceColor: '#141418', darkTextColor: '#ecebe4', headingFont: 'Space Grotesk', bodyFont: 'Inter', radius: 14, colorMode: 'dark', footerStyle: 'simple', headerCta: { enabled: true, label: 'Let’s connect', url: folio.social.linkedin } },
  menus: {
    header: { name: 'Main', items: [menuItem('Home', '/#home'), menuItem('About', '/#about'), menuItem('Projects', '/#projects'), menuItem('Skills', '/#skills'), menuItem('Contact', '/#contact')] },
    footer: { name: 'Links', items: [menuItem('Projects', '/#projects'), menuItem('Résumé', '/resume'), menuItem('Blog', '/blog'), menuItem('Contact', '/#contact')] },
  },
  home: () => [
    B('loopHero', {
      file: 'hello_world.tsx', status: hero.availability, location: hero.location, greeting: `Hi, I’m ${SHORT} —`,
      headline: 'I build *software* that businesses run on.', intro: hero.intro,
      primaryLabel: 'View projects', primaryUrl: '#projects', secondaryLabel: 'Download résumé', secondaryUrl: '/resume', socials: LOOP_SOCIALS,
      loop: ['Build', 'Learn', 'Improve', 'Repeat'], center: SHORT.split(' ').map((w) => w[0]).join(''), caption: 'while (curious) {…}', photo: '',
      terminal: ['git commit -m "faster reports"', 'php artisan test', '18 apps live · 99.9% uptime'], badge: '18+ systems running in production',
      marquee: ['Build', 'Learn', 'Improve', 'Repeat', 'Laravel', 'Node.js', 'React', 'Next.js', 'PostgreSQL'], scrollLabel: 'Scroll to explore',
      rail: [{ label: 'Home', anchor: 'home' }, { label: 'About', anchor: 'about' }, { label: 'Projects', anchor: 'projects' }, { label: 'Skills', anchor: 'skills' }, { label: 'Contact', anchor: 'contact' }],
    }, { paddingY: 'lg', width: 'wide', anchor: 'home', animate: false }),
    B('loopAbout', {
      index: '01', file: 'about_me', title: 'Turning messy workflows into *fast, reliable* software.', subtitle: '',
      text: about.text, quote: 'Good software disappears — people just get their work done.', quoteBy: SHORT,
      cardFile: 'profile.json', education: education.items.slice(0, 2).map((e) => ({ title: e.title, org: e.org, period: e.period })),
      interests: ['System design', 'Performance tuning', 'Open source', 'Mentoring'], currently: 'Application Developer @ Legend IT Solution',
      stats: [...stats.items.slice(0, 3), { value: '∞', label: 'Always curious' }],
    }, { paddingY: 'xl', width: 'wide', anchor: 'about' }),
    B('loopProjects', {
      index: '02', file: 'projects', title: 'Things I’ve *shipped*', subtitle: 'Production ERPs and SaaS platforms used every day — plus a few things I build for fun.',
      allLabel: 'All', viewLabel: 'View project', codeLabel: 'Source code', featuredLabel: 'Featured', buttonLabel: 'More on GitHub', buttonUrl: GH,
      items: projects.items.map((p, i) => ({ title: p.title, category: LOOP_CATEGORY(p.category), year: i < 4 ? '2024' : '2023', summary: p.description, image: un(SHOTS[i % SHOTS.length], 1400), stack: p.tags.slice(0, 4), live: p.url || '', code: CODE[p.title] || '', featured: i === 0 })),
    }, { paddingY: 'xl', width: 'wide', anchor: 'projects' }),
    B('loopSkills', {
      index: '03', file: 'toolbox', title: 'My *toolbox*', subtitle: 'What I reach for when something has to work in production.',
      allLabel: 'All', limit: 8, showingLabel: 'Showing', moreLabel: 'Show all', lessLabel: 'Show less',
      quote: 'Tools change every year. Curiosity, fundamentals and good habits don’t.',
      stats: [{ value: '20+', label: 'Technologies' }, { value: '150+', label: 'REST APIs built' }],
      groups: [
        { title: 'Backend', items: [SKILL('Laravel / PHP', 92), SKILL('Node.js & Express', 85), SKILL('REST API design', 90), SKILL('Django / Python', 70), SKILL('Microservices', 65)] },
        { title: 'Frontend', items: [SKILL('JavaScript (ES6+)', 88), SKILL('React', 84), SKILL('Next.js', 78), SKILL('Tailwind CSS', 90), SKILL('Redux Toolkit', 72)] },
        { title: 'Databases', items: [SKILL('MySQL', 90), SKILL('PostgreSQL', 82), SKILL('MongoDB', 70), SKILL('Prisma', 75), SKILL('Query optimisation', 86)] },
        { title: 'DevOps', items: [SKILL('Linux / Ubuntu', 80), SKILL('Nginx', 74), SKILL('Git & GitHub', 90), SKILL('PM2 & deployments', 76), SKILL('Socket.io', 70)] },
      ],
    }, { paddingY: 'xl', width: 'wide', anchor: 'skills' }),
    B('loopContact', {
      index: '04', file: 'contact', title: 'Let’s build something *together*', subtitle: `${hero.availability}. I usually reply within 24 hours.`,
      cards: [
        { icon: 'Mail', label: 'Email', value: folio.contact.email, url: `mailto:${folio.contact.email}` },
        { icon: 'Github', label: 'GitHub', value: GH.replace(/^https?:\/\//, ''), url: GH },
        { icon: 'Linkedin', label: 'LinkedIn', value: folio.social.linkedin.replace(/^https?:\/\//, ''), url: folio.social.linkedin },
        { icon: 'MapPin', label: 'Location', value: `${hero.location} · GMT+6`, url: '' },
      ],
      note: '', subjects: ['Full-time role', 'Freelance project', 'ERP / SaaS consultation', 'Collaboration', 'Just saying hi'],
    }, { paddingY: 'xl', width: 'wide', anchor: 'contact' }),
    B('loopOutro', {
      eyebrow: '// end of file', title: 'Thanks for *scrolling*.', text: 'Every project is another lap around the loop — I’d love the next one to be yours.',
      triad: ['Ideas', 'Code', 'Impact'], links: [{ label: 'About', url: '#about' }, { label: 'Projects', url: '#projects' }, { label: 'Skills', url: '#skills' }, { label: 'Résumé', url: '/resume' }],
      socials: LOOP_SOCIALS, topLabel: 'Back to top', topUrl: '#home',
    }, { paddingY: 'lg', width: 'wide' }),
  ],
});
const loopBasePages = loop.pages;
loop.pages = () => [...loopBasePages(), resumePage()];

module.exports = [minimal, terminal, studio, corporate, swiss, freelancer, neon, brutal, story, gazette, glow, bento, loop];
