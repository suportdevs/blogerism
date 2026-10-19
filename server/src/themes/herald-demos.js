// Ten homepage demos for Herald. Same news content as Herald Classic — each demo has its own header layout,
// homepage, colours and fonts. Category slugs: world, politics, business, sports, technology, entertainment, health, video.
const { B: block, un, demoVariant, FILMS } = require('./helpers');
const herald = require('./herald');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };
const W = { width: 'wide' };
const yt = (k) => `https://www.youtube.com/watch?v=${FILMS[k][0]}`;
const demo = (def) => demoVariant(herald, { source: 'herald-demos.js', blocks: ['News', 'Luxury', 'Showcase'], ...def });

const IMG = {
  newspapers: '1504711434969-e33886168f5c', reader: '1495020689067-958852a7765e', typewriter: '1585829365295-ab7cd400c167', city: '1477959858617-67f85cf4f1df',
  street: '1480714378408-67cf0d13bc1b', tower: '1486406146926-c627a92ad1ab', court: '1453945619913-79ec89a82c51', chart: '1590283603385-17ffb3a7f29f',
  candles: '1611974789855-9c2a0a7236a3', meeting: '1557804506-669a67965ba0', circuit: '1518770660439-4636190af475', chip: '1550751827-4bd374c3f58b',
  code: '1555066931-4365d14bab8c', stadium: '1431324155629-1a6deb1dec8d', ball: '1579952363873-27f3bade9f55', grass: '1574629810360-7efbbe195018',
  sprint: '1461896836934-ffe607ba8211', hoops: '1546519638-68e109498ffc', cycling: '1517649763962-0c623066013b', crowd: '1501386761578-eac5c94b800a',
  concert: '1470229722913-7c0e2dbbafd3', stage: '1514525253161-7a46d19cd819', cinema: '1536440136628-849c177e76a1', seats: '1489599849927-2ee91cede3ba',
  projector: '1478720568477-152d9b164e26', camera: '1516035069371-29a1b244cc32', guitars: '1511379938547-c1f69419868d', london: '1513635269975-59663e0ac1ad',
  library: '1507842217343-583bb7270b66', signing: '1450101499163-c8848c66ca85', mic: '1590602847861-f357a9332bbc', community: '1491438590914-bc09fcaaf77a',
};

const newsletter = (title, text) => B('newsletter', { title, text }, { background: 'surface', paddingY: 'lg' });

/* 1 ─ The Daily: punchy tabloid front page */
const daily = demo({
  id: 'herald-daily', name: 'Daily',
  description: 'A punchy tabloid front page: red solid header, mosaic headlines, section columns, video row and an app banner.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#e11d48', accentColor: '#0f172a', backgroundColor: '#ffffff', surfaceColor: '#f5f5f4', textColor: '#111111', headingFont: 'Archivo', bodyFont: 'Inter', radius: 4, colorMode: 'light', headerStyle: 'solid', footerStyle: 'columns' },
  home: () => [
    B('breakingNews', { label: 'Breaking', count: 8, breakingOnly: false, format: 'STANDARD', speed: 40 }, { paddingY: 'none', width: 'full', animate: false }),
    B('newsHero', { layout: 'mosaic', category: '', format: 'STANDARD', count: 5, sort: 'latest' }, { paddingY: 'md', ...W }),
    B('newsColumns', { count: 4, columns: [{ title: 'Politics', category: 'politics' }, { title: 'Business', category: 'business' }, { title: 'Health', category: 'health' }] }, W),
    B('newsSection', { title: 'Showbiz', category: 'entertainment', layout: 'grid', count: 4, linkLabel: 'All showbiz' }, { background: 'surface', ...W }),
    B('mediaRail', { title: 'Watch now', source: 'posts', format: 'VIDEO', count: 10, cardStyle: 'landscape', linkLabel: 'All videos', linkUrl: '/category/video' }, { background: 'dark', ...W }),
    B('newsSection', { title: 'Sport', category: 'sports', layout: 'overlay', count: 4, linkLabel: 'More sport' }, W),
    B('latestWithSidebar', { title: 'Just in', sidebarTitle: 'Most read', format: 'STANDARD', count: 6, sidebarCount: 5 }, W),
    B('ctaBanner', { variant: 'image', image: un(IMG.reader, 1800), eyebrow: 'The Daily app', title: 'Breaking news the moment it happens', text: 'Personalised alerts, offline reading and the morning briefing — free.', primaryLabel: 'Get the app', primaryUrl: '/contact', secondaryLabel: 'Newsletter', secondaryUrl: '#daily-signup', phone: '' }, { paddingY: 'lg', ...W }),
    B('newsletter', { title: 'The Daily briefing', text: 'Top stories at 7am, every day.' }, { background: 'surface', paddingY: 'lg', anchor: 'daily-signup' }),
  ],
});

/* 2 ─ Broadsheet: serif paper of record */
const broadsheet = demo({
  id: 'herald-broadsheet', name: 'Broadsheet',
  description: 'A paper-of-record front page on warm newsprint: serif masthead, lead story, headline lists, editor’s note and four-column sections.',
  layout: { header: 'masthead' },
  appearance: { primaryColor: '#1f2937', accentColor: '#b45309', backgroundColor: '#f6f1e7', surfaceColor: '#ece5d6', textColor: '#1c1917', darkBackgroundColor: '#14120f', darkSurfaceColor: '#1f1c17', darkTextColor: '#ede6d8', headingFont: 'Source Serif 4', bodyFont: 'Work Sans', radius: 0, colorMode: 'light', footerStyle: 'columns' },
  home: () => [
    B('newsHero', { layout: 'lead-left', category: '', format: 'STANDARD', count: 6, sort: 'latest' }, { paddingY: 'md', ...W }),
    B('newsSection', { title: 'Politics', category: 'politics', layout: 'headlines', count: 5, linkLabel: 'Politics' }, W),
    B('luxeStatement', { overline: 'From the editor', text: 'Good journalism is slow to judge and quick to correct. This week we checked every claim twice — and published three corrections we are proud of.', signature: 'The Editor' }, { background: 'surface', paddingY: 'xl' }),
    B('newsColumns', { count: 4, columns: [{ title: 'World', category: 'world' }, { title: 'Business', category: 'business' }, { title: 'Technology', category: 'technology' }, { title: 'Health', category: 'health' }] }, W),
    B('newsSection', { title: 'World affairs', category: 'world', layout: 'lead-list', count: 5, linkLabel: 'All world news' }, W),
    B('newsSection', { title: 'Arts & culture', category: 'entertainment', layout: 'headlines', count: 4, linkLabel: 'Culture' }, { background: 'surface', ...W }),
    newsletter('The morning edition', 'A calm, considered summary of the day’s news — every weekday at 6am.'),
  ],
});

/* 3 ─ Tech Wire: dark neon technology desk */
const tech = demo({
  id: 'herald-tech', name: 'Tech Wire',
  description: 'A dark, neon technology desk: floating header, kinetic type hero, mosaic headlines, bento topics and a documentary feature.',
  layout: { header: 'floating' },
  appearance: { primaryColor: '#06b6d4', accentColor: '#a855f7', backgroundColor: '#f8fafc', surfaceColor: '#eef2f7', textColor: '#0b1020', darkBackgroundColor: '#05070d', darkSurfaceColor: '#0d1220', darkTextColor: '#e6ebf5', headingFont: 'Space Grotesk', bodyFont: 'Inter', radius: 16, colorMode: 'dark', footerStyle: 'big' },
  home: () => [
    B('kineticHero', { eyebrow: 'The technology desk', lines: ['The future,'], rotate: ['explained.', 'decoded.', 'reported.'], subtitle: 'Sharp reporting on AI, chips, space and the startups shaping tomorrow.', primaryLabel: 'Latest stories', primaryUrl: '#latest', secondaryLabel: 'Newsletter', secondaryUrl: '#signup', image: un(IMG.chip, 500), badge: 'Read the future ✦ Read the future ✦ ', marquee: ['AI', 'Chips', 'Space', 'Security', 'Startups', 'Gadgets'] }, { paddingY: 'xl', width: 'wide', animate: false }),
    B('newsHero', { layout: 'mosaic', category: 'technology', format: 'STANDARD', count: 5, sort: 'latest' }, { anchor: 'latest', ...W }),
    B('bentoGrid', { eyebrow: 'Topics', title: 'What we cover', subtitle: '', items: [
      { icon: 'Cpu', title: 'Artificial intelligence', text: 'Models, regulation and the people building them.', size: 'lg', visual: 'chart', image: '' },
      { icon: 'Globe', title: 'Space', text: 'Launches, satellites and the new space race.', size: 'tall', visual: 'globe', image: '' },
      { icon: 'Shield', title: 'Security', text: 'Breaches, privacy and defence.', size: 'sm', visual: '', image: '' },
      { icon: 'Code2', title: 'Developers', text: 'Open source, tools and the craft of code.', size: 'wide', visual: 'code', image: '' },
      { icon: 'Rocket', title: 'Startups', text: 'Funding rounds and founders to watch.', size: 'sm', visual: '', image: '' },
    ] }, { paddingY: 'xl', ...W }),
    B('newsSection', { title: 'More technology', category: 'technology', layout: 'grid', count: 4, linkLabel: 'All tech' }, { background: 'surface', ...W }),
    B('videoLightbox', { eyebrow: 'Documentary', title: 'Tears of Steel: making sci-fi in the open', text: 'Our culture desk on the open movie that pushed visual effects forward.', poster: un(IMG.circuit, 1800), videoUrl: yt('steel'), layout: 'split', duration: '12:14', stats: [{ value: '3M+', label: 'Views' }, { value: '2012', label: 'Released' }] }, { paddingY: 'xl', ...W }),
    B('newsletter', { title: 'The Wire, every Friday', text: 'Five tech stories that actually matter. No hype.' }, { background: 'surface', paddingY: 'lg', anchor: 'signup' }),
  ],
});

/* 4 ─ Business Journal: markets & money */
const business = demo({
  id: 'herald-business', name: 'Business Journal',
  description: 'A financial journal: corporate header with contact bar, markets ticker, framed hero, ranked feed, plans comparison and premium banner.',
  layout: { header: 'corporate' },
  appearance: { primaryColor: '#0f766e', accentColor: '#ca8a04', backgroundColor: '#ffffff', surfaceColor: '#f1f5f4', textColor: '#0b1a17', darkBackgroundColor: '#061210', darkSurfaceColor: '#0d1f1c', darkTextColor: '#e3eeeb', headingFont: 'Manrope', bodyFont: 'Inter', radius: 8, colorMode: 'light', footerStyle: 'columns', headerCta: { enabled: true, label: 'Subscribe', url: '/contact' } },
  home: () => [
    B('breakingNews', { label: 'Markets', count: 8, breakingOnly: false, category: 'business', format: 'STANDARD', speed: 45 }, { paddingY: 'none', width: 'full', animate: false }),
    B('splitHero', { variant: 'framed', eyebrow: 'Business · Markets · Economy', title: 'The numbers behind', highlight: 'every headline', subtitle: 'Independent business journalism for founders, investors and decision makers.', bullets: ['Daily market briefing', 'Company deep dives', 'Expert columns', 'Data you can trust'], primaryLabel: 'Read today’s briefing', primaryUrl: '/category/business', secondaryLabel: 'Subscribe', secondaryUrl: '/contact', image: un(IMG.chart, 1200), image2: '', badges: [{ icon: 'TrendingUp', value: '2.1M', label: 'Monthly readers' }, { icon: 'Award', value: '14', label: 'Journalism awards' }], proof: '', avatars: [] }, { background: 'surface', paddingY: 'xl', animate: false }),
    B('newsHero', { layout: 'lead-left', category: 'business', format: 'STANDARD', count: 5, sort: 'latest' }, W),
    B('latestWithSidebar', { title: 'Business & economy', sidebarTitle: 'Most read', category: 'business', format: 'STANDARD', count: 6, sidebarCount: 5 }, { background: 'surface', ...W }),
    B('newsColumns', { count: 4, columns: [{ title: 'Technology', category: 'technology' }, { title: 'Politics', category: 'politics' }, { title: 'World', category: 'world' }] }, W),
    B('comparison', { eyebrow: 'Membership', title: 'Choose your access', columns: ['Free', 'Digital', 'Premium'], highlight: 3, highlightLabel: 'Best value', groups: false, rows: [
      { group: '', feature: 'Articles per month', values: ['5', 'Unlimited', 'Unlimited'] }, { group: '', feature: 'Morning briefing', values: ['yes', 'yes', 'yes'] },
      { group: '', feature: 'Data & charts', values: ['no', 'yes', 'yes'] }, { group: '', feature: 'Investor reports', values: ['no', 'no', 'yes'] }, { group: '', feature: 'Price', values: ['$0', '$9 / mo', '$19 / mo'] },
    ], buttons: [{ label: 'Start free', url: '/contact' }, { label: 'Subscribe', url: '/contact' }, { label: 'Go Premium', url: '/contact' }] }, { background: 'surface', paddingY: 'xl', ...W }),
    B('ctaBanner', { variant: 'split', image: un(IMG.candles, 1400), eyebrow: 'Premium', title: 'Make better decisions, faster', text: 'Investor reports, data tools and every story — from $19 a month.', primaryLabel: 'Go Premium', primaryUrl: '/contact', phone: '' }, { paddingY: 'lg', ...W }),
  ],
});

/* 5 ─ Sports Arena: matchday energy */
const sports = demo({
  id: 'herald-sports', name: 'Sports Arena',
  description: 'A matchday sports hub: bold header, stadium slideshow, live ticker, fixtures table, derby countdown and video highlights.',
  layout: { header: 'bold' },
  appearance: { primaryColor: '#2563eb', accentColor: '#facc15', backgroundColor: '#f8fafc', surfaceColor: '#eef1f6', textColor: '#0a0f1c', darkBackgroundColor: '#060a14', darkSurfaceColor: '#0f1626', darkTextColor: '#eef2fa', headingFont: 'Barlow Condensed', bodyFont: 'Inter', radius: 6, colorMode: 'dark', footerStyle: 'big', headerCta: { enabled: true, label: 'Live scores', url: '/category/sports' } },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'left', interval: 6, slides: [
      { image: un(IMG.stadium, 2200), eyebrow: 'Matchday', title: 'Every goal. Every game. Live.', subtitle: 'Scores, analysis and highlights from every league that matters.', buttonLabel: 'Latest sport', buttonUrl: '/category/sports' },
      { image: un(IMG.sprint, 2200), eyebrow: 'Athletics', title: 'Records are made to be broken', subtitle: 'Behind the scenes with the fastest athletes in the country.', buttonLabel: 'Read the story', buttonUrl: '/category/sports' },
      { image: un(IMG.hoops, 2200), eyebrow: 'Basketball', title: 'The playoff race heats up', subtitle: 'Who makes it, who doesn’t — our verdict.', buttonLabel: 'Analysis', buttonUrl: '/category/sports' },
    ] }, HERO),
    B('breakingNews', { label: 'Live', count: 6, breakingOnly: false, category: 'sports', format: 'STANDARD', speed: 35 }, { paddingY: 'none', width: 'full', animate: false }),
    B('newsHero', { layout: 'lead-center', category: 'sports', format: 'STANDARD', count: 5, sort: 'latest' }, { paddingY: 'lg', ...W }),
    B('schedule', { eyebrow: 'Fixtures', title: 'This weekend', subtitle: 'Kick-off times are local.', buttonLabel: 'Preview', buttonUrl: '/category/sports', hostIcon: 'MapPin', locationIcon: 'Tv', days: [
      { label: 'Saturday', sessions: [{ time: '15:00', title: 'City United vs Riverside FC', host: 'National Stadium', location: 'Sports One', tag: 'Derby' }, { time: '17:30', title: 'Northern Lions vs Harbour Town', host: 'Lions Park', location: 'Sports Two', tag: '' }, { time: '20:00', title: 'Capital Kings vs Valley Rovers', host: 'King’s Ground', location: 'Sports One', tag: 'Top of table' }] },
      { label: 'Sunday', sessions: [{ time: '13:00', title: 'Women’s Cup semi-final', host: 'Central Arena', location: 'Sports One', tag: 'Cup' }, { time: '16:00', title: 'Basketball: Hawks vs Comets', host: 'Dome Arena', location: 'Sports Three', tag: '' }] },
    ] }, { paddingY: 'xl' }),
    B('countdown', { eyebrow: 'The big one', title: 'Derby day kicks off in', text: 'Full live coverage, minute by minute.', date: '2027-03-14T15:00', variant: 'image', image: un(IMG.grass, 2000), expiredText: 'We are live!', buttonLabel: 'Follow live', buttonUrl: '/category/sports' }, { paddingY: 'lg', ...W }),
    B('newsSection', { title: 'Sport', category: 'sports', layout: 'overlay', count: 4, linkLabel: 'More sport' }, W),
    B('mediaRail', { title: 'Highlights', source: 'posts', format: 'VIDEO', count: 10, cardStyle: 'landscape', linkLabel: 'All videos', linkUrl: '/category/video' }, { background: 'surface', ...W }),
    newsletter('Full-time', 'The weekend’s results and talking points, every Monday morning.'),
  ],
});

/* 6 ─ Culture: arts & entertainment magazine */
const culture = demo({
  id: 'herald-culture', name: 'Culture',
  description: 'An arts & culture magazine: minimal transparent header, full-screen slideshow, cover feature, photo essay and “what to watch” carousel.',
  layout: { header: 'minimal' },
  appearance: { primaryColor: '#be185d', accentColor: '#7c3aed', backgroundColor: '#fffbf7', surfaceColor: '#f7efe9', textColor: '#1a1214', darkBackgroundColor: '#110b0d', darkSurfaceColor: '#1c1316', darkTextColor: '#f5ebee', headingFont: 'Playfair Display', bodyFont: 'DM Sans', radius: 10, colorMode: 'light', footerStyle: 'simple' },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'center', interval: 6, slides: [
      { image: un(IMG.concert, 2200), eyebrow: 'Music', title: 'The sound of the season', subtitle: 'Festivals, tours and the albums everyone is talking about.', buttonLabel: 'Read more', buttonUrl: '/category/entertainment' },
      { image: un(IMG.cinema, 2200), eyebrow: 'Film', title: 'Independent cinema is back', subtitle: 'Why small screens can’t replace the big night out.', buttonLabel: 'Read more', buttonUrl: '/category/entertainment' },
      { image: un(IMG.guitars, 2200), eyebrow: 'Studio sessions', title: 'Inside the rooms where songs are made', subtitle: '', buttonLabel: 'Watch', buttonUrl: '/category/video' },
    ] }, HERO),
    B('luxeFeatured', { overline: 'Cover story', title: 'This week in culture', category: 'entertainment', format: '', sort: 'latest', count: 5, linkLabel: 'All culture', linkUrl: '/category/entertainment' }, { paddingY: 'xl', ...W }),
    B('masonryGallery', { eyebrow: 'Photo essay', title: 'A summer of live music', subtitle: 'Our photographers on the road with three festivals.', columns: 3, filters: true, items: [
      [IMG.stage, 'Main stage', 'Festivals'], [IMG.crowd, 'Front row', 'Festivals'], [IMG.guitars, 'Backstage', 'Studios'], [IMG.seats, 'Before the show', 'Cinema'], [IMG.projector, 'Projection room', 'Cinema'], [IMG.camera, 'On set', 'Studios'],
    ].map(([id, title, category]) => ({ src: un(id, 900), title, category, caption: '' })) }, { background: 'surface', paddingY: 'xl', ...W }),
    B('cardCarousel', { eyebrow: 'Our picks', title: 'What to watch, read & hear', subtitle: '', cardStyle: 'glass', size: 'md', items: [
      [IMG.cinema, 'Film', 'Five films to see this month'], [IMG.concert, 'Music', 'The tour of the year'], [IMG.library, 'Books', 'Autumn reading list'], [IMG.projector, 'Classics', 'Rediscovering silent cinema'], [IMG.mic, 'Podcasts', 'Shows worth your commute'],
    ].map(([id, tag, title]) => ({ image: un(id, 900), tag, title, text: 'Our critics’ choices.', url: '/category/entertainment' })) }, { paddingY: 'xl', ...W }),
    B('newsSection', { title: 'Health & living', category: 'health', layout: 'grid', count: 4, linkLabel: 'More' }, W),
    newsletter('The culture letter', 'Our critics’ picks, every Thursday.'),
  ],
});

/* 7 ─ City: local community news */
const city = demo({
  id: 'herald-city', name: 'City',
  description: 'A friendly local newsroom: centered header, collage hero, topic pills, “what’s on” calendar, tip line and contact form.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#0369a1', accentColor: '#f97316', backgroundColor: '#ffffff', surfaceColor: '#f0f6fa', textColor: '#0b1b29', darkBackgroundColor: '#07121b', darkSurfaceColor: '#0e1d2a', darkTextColor: '#e2edf5', headingFont: 'Lexend', bodyFont: 'Figtree', radius: 16, colorMode: 'light', headerStyle: 'centered', footerStyle: 'columns' },
  home: () => [
    B('splitHero', { variant: 'collage', eyebrow: 'Your city, every day', title: 'News from the streets', highlight: 'you live on', subtitle: 'Council decisions, new openings, school news and weekend plans — reported by neighbours who care.', bullets: [], primaryLabel: 'Today’s stories', primaryUrl: '#today', secondaryLabel: 'Send a tip', secondaryUrl: '/contact', image: un(IMG.street, 1000), image2: un(IMG.community, 700), badges: [{ icon: 'Users', value: '180k', label: 'Neighbours reading' }, { icon: 'MapPin', value: '42', label: 'Neighbourhoods' }], proof: '', avatars: [] }, { background: 'surface', paddingY: 'xl', animate: false }),
    B('trustBar', { variant: 'pills', items: [{ icon: 'Landmark', title: 'Council' }, { icon: 'School', title: 'Schools' }, { icon: 'Utensils', title: 'Food & drink' }, { icon: 'Car', title: 'Traffic' }, { icon: 'Trophy', title: 'Local sport' }, { icon: 'Sun', title: 'Weather' }] }, { paddingY: 'md' }),
    B('newsHero', { layout: 'lead-left', category: '', format: 'STANDARD', count: 5, sort: 'latest' }, { anchor: 'today', ...W }),
    B('schedule', { eyebrow: 'What’s on', title: 'This week in the city', subtitle: '', buttonLabel: 'Details', buttonUrl: '/contact', hostIcon: 'MapPin', locationIcon: 'Clock', days: [
      { label: 'Friday', sessions: [{ time: '18:00', title: 'Night market & street food', host: 'Riverside Square', location: 'Until 23:00', tag: 'Free' }, { time: '19:30', title: 'Open-air cinema', host: 'Central Park', location: '2 hrs', tag: '' }] },
      { label: 'Saturday', sessions: [{ time: '09:00', title: 'Farmers’ market', host: 'Old Town Hall', location: 'Until 14:00', tag: 'Weekly' }, { time: '15:00', title: 'Community clean-up', host: 'Harbour Walk', location: '3 hrs', tag: 'Volunteers' }] },
      { label: 'Sunday', sessions: [{ time: '11:00', title: 'Family fun run', host: 'Lakeside Park', location: '5 km', tag: '' }] },
    ] }, { background: 'surface', paddingY: 'xl' }),
    B('newsColumns', { count: 4, columns: [{ title: 'Politics', category: 'politics' }, { title: 'Health', category: 'health' }, { title: 'Sport', category: 'sports' }] }, W),
    B('ctaBanner', { variant: 'image', image: un(IMG.city, 1800), eyebrow: 'Tip line', title: 'Seen something we should know about?', text: 'Tell us in confidence — our reporters read every message.', primaryLabel: 'Send a tip', primaryUrl: '/contact', phone: '+1 (555) 010-2030' }, { paddingY: 'lg', ...W }),
  ],
});

/* 8 ─ Live Desk: 24/7 broadcast */
const live = demo({
  id: 'herald-live', name: 'Live Desk',
  description: 'A 24/7 broadcast newsroom: dark sidebar navigation, live ticker, featured video player, ranked feed and election-night countdown.',
  layout: { header: 'sidebar' },
  appearance: { primaryColor: '#ef4444', accentColor: '#f59e0b', backgroundColor: '#fafafa', surfaceColor: '#f1f1f2', textColor: '#111113', darkBackgroundColor: '#09090b', darkSurfaceColor: '#141417', darkTextColor: '#ededf0', headingFont: 'Sora', bodyFont: 'Inter', radius: 10, colorMode: 'dark', footerStyle: 'simple', headerCta: { enabled: true, label: 'Watch live', url: '/category/video' } },
  home: () => [
    B('breakingNews', { label: 'Live', count: 8, breakingOnly: false, format: '', speed: 40 }, { paddingY: 'none', width: 'full', animate: false }),
    B('videoFeature', { title: 'Watch now', category: '', series: '', format: 'VIDEO', sort: 'latest', count: 6 }, { paddingY: 'md', ...W }),
    B('latestWithSidebar', { title: 'Latest updates', sidebarTitle: 'Trending', format: 'STANDARD', count: 8, sidebarCount: 6 }, W),
    B('countdown', { eyebrow: 'Election night', title: 'Results coverage begins in', text: 'Live results, analysis and reaction from every constituency.', date: '2027-05-06T20:00', variant: 'cards', image: '', expiredText: 'We are live — follow the results', buttonLabel: 'Set a reminder', buttonUrl: '/contact' }, { background: 'surface', paddingY: 'xl' }),
    B('newsSection', { title: 'World', category: 'world', layout: 'overlay', count: 4, linkLabel: 'More world' }, W),
    B('mediaRail', { title: 'Explainers', source: 'posts', format: 'VIDEO', count: 10, cardStyle: 'landscape', sort: 'popular' }, { background: 'surface', ...W }),
    newsletter('Live alerts', 'Only the stories that can’t wait.'),
  ],
});

/* 9 ─ Reader: calm, text-first */
const reader = demo({
  id: 'herald-reader', name: 'Reader',
  description: 'A calm, text-first reading experience: floating pill nav, big serif statement, cursor-preview story list and quiet headline sections.',
  layout: { header: 'portfolio' },
  appearance: { primaryColor: '#3f3f46', accentColor: '#d97706', backgroundColor: '#fcfcfa', surfaceColor: '#f3f3ef', textColor: '#18181b', darkBackgroundColor: '#0f0f10', darkSurfaceColor: '#18181a', darkTextColor: '#ececea', headingFont: 'Fraunces', bodyFont: 'Inter', radius: 22, colorMode: 'light', footerStyle: 'simple', headerCta: { enabled: true, label: 'Subscribe', url: '/contact' } },
  home: () => [
    B('luxeStatement', { overline: 'Slow news', text: 'Fewer stories, better told. Everything you need to understand the world — nothing that wastes your time.', signature: 'The Herald Reader' }, { paddingY: 'xl' }),
    B('luxeList', { overline: 'Today', title: 'The stories worth your time', source: 'posts', format: 'STANDARD', category: '', series: '', seriesType: '', sort: 'latest', count: 7, linkLabel: 'All stories', linkUrl: '/blog' }, { paddingY: 'lg', ...W }),
    B('newsSection', { title: 'World', category: 'world', layout: 'headlines', count: 4, linkLabel: 'More' }, { background: 'surface', ...W }),
    B('newsSection', { title: 'Technology', category: 'technology', layout: 'headlines', count: 4, linkLabel: 'More' }, W),
    B('newsColumns', { count: 3, columns: [{ title: 'Politics', category: 'politics' }, { title: 'Business', category: 'business' }, { title: 'Health', category: 'health' }] }, { background: 'surface', ...W }),
    newsletter('One email a day', 'Five stories, five minutes, every morning.'),
  ],
});

/* 10 ─ Investigations: long-form & documentaries */
const investigations = demo({
  id: 'herald-investigations', name: 'Investigations',
  description: 'A dark investigative desk: transparent header over a framed hero, cover feature, method accordion, vertical process and documentary.',
  layout: { header: 'overlay' },
  appearance: { primaryColor: '#d97706', accentColor: '#dc2626', backgroundColor: '#faf8f5', surfaceColor: '#f1ece4', textColor: '#16130f', darkBackgroundColor: '#0b0a08', darkSurfaceColor: '#16140f', darkTextColor: '#efe9df', headingFont: 'EB Garamond', bodyFont: 'Inter', radius: 2, colorMode: 'dark', footerStyle: 'luxe', headerCta: { enabled: true, label: 'Donate', url: '/contact' } },
  home: () => [
    B('luxeHero', { image: un(IMG.newspapers, 2200), video: '', overline: 'The investigations desk', title: 'Follow the', italic: 'evidence', subtitle: 'Months of reporting. Thousands of documents. Stories that hold power to account.', buttonLabel: 'Read the latest', buttonUrl: '#latest', height: 'full', align: 'center', overlay: 55 }, HERO),
    B('luxeFeatured', { overline: 'Latest investigation', title: '', category: 'politics', format: 'STANDARD', sort: 'latest', count: 5, linkLabel: 'All investigations', linkUrl: '/category/politics' }, { paddingY: 'xl', anchor: 'latest', ...W }),
    B('accordionImage', { eyebrow: 'Our method', title: 'How an investigation comes together', subtitle: '', imagePosition: 'left', autoplay: true, items: [
      { title: 'A tip becomes a question', text: 'Every story starts with a lead — usually from a reader. We test it before we chase it.', image: un(IMG.typewriter, 1200) },
      { title: 'Documents, not opinions', text: 'Records requests, court filings and leaked data — verified by two reporters independently.', image: un(IMG.signing, 1200) },
      { title: 'The right to reply', text: 'Everyone we write about gets a fair chance to respond before publication.', image: un(IMG.court, 1200) },
    ] }, { background: 'surface', paddingY: 'xl' }),
    B('newsSection', { title: 'World', category: 'world', layout: 'overlay', count: 4, linkLabel: 'More' }, W),
    B('videoLightbox', { eyebrow: 'Documentary', title: 'Inside the newsroom', text: 'A short film about the people who spend months on a single story.', poster: un(IMG.projector, 1800), videoUrl: yt('sintel'), layout: 'full', duration: '14:48', stats: [] }, { paddingY: 'xl', ...W }),
    B('ctaBanner', { variant: 'split', image: un(IMG.library, 1400), eyebrow: 'Reader-funded', title: 'Independent journalism needs you', text: 'No billionaire owner. No paywall on investigations. Just readers who care.', primaryLabel: 'Support us', primaryUrl: '/contact', phone: '' }, { paddingY: 'lg', ...W }),
  ],
});

module.exports = [daily, broadsheet, tech, business, sports, culture, city, live, reader, investigations];
