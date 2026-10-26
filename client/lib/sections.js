import { BLOCKS, DEFAULT_STYLE } from './blocks';
import { uid } from './utils';
import { BUSINESS_PAGE_DESIGNS, BUSINESS_SECTIONS } from './businessSections';

/*
 * Theme section library.
 * Each theme (and each Luxe version) has its own pre-designed sections: ready-made combinations of
 * blocks with theme-specific content, imagery and styling. The page builder's "Sections" tab inserts
 * them in one click; THEME_PAGE_DESIGNS strings sections together into complete page starters.
 */

const pic = (seed, w = 1600, h = 1000) => `https://picsum.photos/seed/${seed}/${w}/${h}`;
const un = (id, w = 1600) => `https://images.unsplash.com/photo-${id}?auto=format&fit=crop&w=${w}&q=80`;
const mono = (id, w = 1600) => `${un(id, w)}&sat=-100`;
const av = (n) => `https://i.pravatar.cc/600?img=${n}`;
const yt = (id) => `https://www.youtube.com/watch?v=${id}`;
// Sintel has no maxres thumbnail on YouTube.
const thumb = (id) => `https://i.ytimg.com/vi/${id}/${id === 'eRsGyueVLvQ' ? 'hqdefault' : 'maxresdefault'}.jpg`;

// Verified Blender open-movie uploads (same ids the themes' demo content uses).
const FILM = { bunny: 'aqz-KE-bpKQ', sintel: 'eRsGyueVLvQ', steel: 'R6MlUcmOul8', cosmos: 'Y-rmzh0PI3c', spring: 'WhWc3b3KhnY', sprite: '_cMxraX_5RE', charge: 'UXqq0ZvbOnk', agent: 'mN0zPOpADL4', hero: 'pKmSdY56VtY', coffee: 'PVGeM40dABA', elephants: 'TLkA0RELQ1g' };

const S = (type, data = {}, style = {}) => ({ type, data, style });
const sec = (key, name, description, ...blocks) => ({ key, name, description, blocks });
const DARK = { background: 'dark' };
const SURFACE = { background: 'surface' };
const words = (list) => list.map((name) => ({ name, image: '', url: '' }));
const rows = (group, list) => list.map(([feature, ...values]) => ({ group, feature, values }));

/* ================================== Blogerism ================================== */
const nova = [
  sec('nova-intro', 'Page intro', 'Gradient hero to open any page',
    S('hero', { variant: 'centered', eyebrow: 'About Blogerism', title: 'We build tools for people who build the web', subtitle: 'A small, senior team obsessed with making content management feel effortless.', primaryLabel: 'Meet the team', primaryUrl: '#team', secondaryLabel: 'Careers', secondaryUrl: '#careers', image: '' }, { background: 'gradient', paddingY: 'xl' })),
  sec('nova-tabs', 'Product tabs', 'Auto-playing feature tour with screenshots',
    S('featureTabs', { eyebrow: 'Inside Blogerism', title: 'Everything your content team needs', tabs: [
      { icon: 'LayoutGrid', label: 'Page builder', title: 'Drag, drop, publish', text: 'Compose pages from 60+ blocks with a live preview on desktop, tablet and phone.', bullets: ['Undo / redo history', 'Reusable sections', 'Per-block styling'], image: pic('nova-tab-builder', 1200, 900) },
      { icon: 'Image', label: 'Media', title: 'A media library that stays tidy', text: 'Folders, alt text and instant search keep thousands of assets organised.', bullets: ['Drag-and-drop uploads', 'Folders & search'], image: pic('nova-tab-media', 1200, 900) },
      { icon: 'Search', label: 'SEO', title: 'Rank without a plugin', text: 'Titles, descriptions, social images, sitemap and RSS — built in.', bullets: ['Live Google preview', 'Automatic sitemap'], image: pic('nova-tab-seo', 1200, 900) },
      { icon: 'ShieldCheck', label: 'Roles', title: 'The right access for everyone', text: 'Admins, editors and authors each see exactly what they need.', bullets: ['Granular permissions', 'Activity log'], image: pic('nova-tab-roles', 1200, 900) },
    ] }, SURFACE)),
  sec('nova-process', 'Onboarding steps', 'Four-step timeline with hover icons',
    S('steps', { eyebrow: 'Getting started', title: 'Live in an afternoon', variant: 'timeline', items: [
      { icon: 'Palette', title: 'Pick a theme', text: 'Start from a professionally designed theme.' },
      { icon: 'PenTool', title: 'Add your content', text: 'Write posts and build pages visually.' },
      { icon: 'Users', title: 'Invite your team', text: 'Give editors and authors their own logins.' },
      { icon: 'Rocket', title: 'Go live', text: 'Publish — or export a production-ready project.' },
    ] })),
  sec('nova-compare', 'Blogerism vs. the rest', 'Comparison table with a highlighted column',
    S('comparison', { eyebrow: 'Compare', title: 'Why teams switch to Blogerism', columns: ['Blogerism', 'Classic CMS', 'Site builder'], highlight: 1, highlightLabel: 'Best value', rows: [
      ...rows('Editing', [['Visual page builder', 'yes', 'Plugin', 'yes'], ['Rich text editor', 'yes', 'yes', 'Basic'], ['Scheduled publishing', 'yes', 'yes', 'no']]),
      ...rows('Platform', [['Own your code & data', 'yes', 'yes', 'no'], ['Export full project', 'yes', 'no', 'no'], ['Built-in SEO', 'yes', 'Plugin', 'Basic']]),
      ...rows('Cost', [['Monthly fee', '$0', '$0 + plugins', '$29+']]),
    ], buttons: [{ label: 'Get started', url: '/contact' }] })),
  sec('nova-accordion', 'Why Blogerism', 'Accordion that swaps a large image',
    S('accordionImage', { eyebrow: 'Why Blogerism', title: 'Designed around how teams really work', items: [
      { title: 'Fast by default', text: 'Server-rendered pages, optimised images and a tiny JavaScript footprint.', image: pic('nova-why-1', 1200, 1000) },
      { title: 'Endlessly customisable', text: 'Colours, fonts, layouts and blocks — every pixel is yours to tune.', image: pic('nova-why-2', 1200, 1000) },
      { title: 'Secure and reliable', text: 'Role-based access, hashed passwords, rate limiting and audit logs.', image: pic('nova-why-3', 1200, 1000) },
      { title: 'Developer friendly', text: 'A clean REST API, PostgreSQL and a codebase you will enjoy reading.', image: pic('nova-why-4', 1200, 1000) },
    ] })),
  sec('nova-video', 'Product tour video', 'Video lightbox with counting stats',
    S('videoLightbox', { eyebrow: 'Product tour', title: 'See Blogerism in two minutes', text: 'From a blank page to a published site — watch the whole flow.', poster: pic('nova-tour', 1600, 900), videoUrl: yt(FILM.bunny), layout: 'split', duration: '2:14', stats: [{ value: '2,000+', label: 'Teams' }, { value: '99.9%', label: 'Uptime' }, { value: '4.9/5', label: 'Rating' }] }, { background: 'gradient' })),
  sec('nova-team', 'Team', 'Cards with sliding bios and socials',
    S('team', { eyebrow: 'Our people', title: 'The team behind Blogerism', subtitle: 'Designers, engineers and writers who care about the details.' }, { anchor: 'team' })),
  sec('nova-logos', 'Customer logos', 'Infinite logo marquee',
    S('logoWall', { title: 'Trusted by 2,000+ teams worldwide', logos: words(['Lumen', 'Stackwise', 'Northwind', 'Orbit', 'Quanta', 'Helix', 'Polar', 'Vertex']) }, { paddingY: 'md' })),
  sec('nova-careers', 'Careers', 'Filterable job openings',
    S('jobs', { eyebrow: 'Careers', title: 'Build the future of publishing', subtitle: 'Remote-first, async-friendly and generous with learning budgets.', applyEmail: 'careers@nova.dev' }, { anchor: 'careers' })),
  sec('nova-launch', 'Launch countdown', 'Glass countdown cards for a release',
    S('countdown', { eyebrow: 'Blogerism 3.0', title: 'The biggest release yet is almost here', text: 'AI writing assistant, multilingual content and a brand-new theme engine.', date: '2027-03-01T10:00', variant: 'cards', buttonLabel: 'Join the waitlist', buttonUrl: '/contact' }, { background: 'gradient', paddingY: 'xl' })),
  sec('nova-gallery', 'Use-case carousel', 'Swipeable cards with overlay captions',
    S('cardCarousel', { eyebrow: 'Use cases', title: 'One CMS, many kinds of websites', cardStyle: 'overlay', items: [
      ['Marketing sites', 'Landing pages that convert'], ['Blogs & magazines', 'Long-form stories'], ['Documentation', 'Searchable knowledge bases'], ['Portfolios', 'Show your best work'], ['News portals', 'Breaking news, fast'], ['Restaurants', 'Menus & reservations'],
    ].map(([title, text], i) => ({ image: pic(`nova-case-${i}`, 900, 1100), tag: 'Use case', title, text, url: '/contact' })) })),
];

const novaLuxe = [
  sec('nova-luxe-atelier', 'The atelier', 'Tall monochrome portraits that colour on hover',
    S('team', { eyebrow: 'The atelier', title: 'A studio of craftspeople', variant: 'portrait', columns: 4 }, { paddingY: 'xl' })),
  sec('nova-luxe-method', 'The method', 'Vertical steps that fill as you scroll',
    S('steps', { eyebrow: 'Our method', title: 'Four chapters, one considered result', variant: 'vertical', items: [
      { icon: 'Compass', title: 'Listening', text: 'We begin with your brand, your audience and the story only you can tell.' },
      { icon: 'PenTool', title: 'Composition', text: 'Typography, rhythm and imagery are composed by hand, never templated.' },
      { icon: 'Code2', title: 'Craft', text: 'Interactions are tuned frame by frame; performance is non-negotiable.' },
      { icon: 'Gem', title: 'Unveiling', text: 'A quiet, confident launch — then a long-term partnership.' },
    ] }, { paddingY: 'xl', width: 'narrow' })),
  sec('nova-luxe-clients', 'Selected clients', 'Bordered logo grid',
    S('logoWall', { title: 'In the company of', variant: 'grid', logos: words(['Maison Vale', 'Aurelia', 'Noir & Co', 'Halden', 'Saint Clair', 'Oriel', 'Lumière', 'Cartier Row']) }, { width: 'narrow' })),
  sec('nova-luxe-preview', 'Private preview', 'Countdown over a full-bleed photograph',
    S('countdown', { eyebrow: 'By invitation', title: 'A private preview of our new collection', date: '2027-02-14T19:00', variant: 'image', image: un('1600607687939-ce8a6c25118c', 2000), buttonLabel: 'Request an invitation', buttonUrl: '/contact' }, { paddingY: 'md', width: 'wide' })),
  sec('nova-luxe-works', 'Selected works', 'Large cards with frosted captions',
    S('cardCarousel', { eyebrow: 'Selected works', title: 'Recent commissions', cardStyle: 'glass', size: 'lg', items: ['1600585154340-be6161a56a0c', '1618221195710-dd6b41faaea6', '1600607687939-ce8a6c25118c', '1497366216548-37526070297c'].map((id, i) => ({ image: un(id, 1000), tag: ['Residence', 'Interiors', 'Hospitality', 'Workplace'][i], title: ['Villa Serein', 'The Linen Room', 'Hotel Oriel', 'Studio North'][i], text: 'Brand, website and digital experience.', url: '/contact' })) }, { paddingY: 'xl' })),
];

/* ================================= Herald ================================= */
const herald = [
  sec('herald-columnists', 'Columnists', 'Round avatars with gradient ring',
    S('team', { eyebrow: 'Opinion', title: 'Our columnists', subtitle: 'Independent voices on politics, economy, culture and sport.', variant: 'round', columns: 4, members: [
      { name: 'Farhana Akter', role: 'Politics · Wednesdays', image: av(44), bio: 'Two decades covering parliament and elections.', twitter: '#', linkedin: '' },
      { name: 'Rafiq Hasan', role: 'Economy · Mondays', image: av(53), bio: 'Former central bank analyst, now explaining your money.', twitter: '#', linkedin: '#' },
      { name: 'Nadia Chowdhury', role: 'Culture · Fridays', image: av(45), bio: 'Books, film and the ideas shaping our cities.', twitter: '#', linkedin: '' },
      { name: 'Tanvir Ahmed', role: 'Sport · Sundays', image: av(59), bio: 'Cricket, football and the stories behind the scores.', twitter: '#', linkedin: '' },
    ] })),
  sec('herald-election', 'Election countdown', 'Live countdown over a news photo',
    S('countdown', { eyebrow: 'Live coverage', title: 'Election night: results coverage begins in', text: 'Live results, analysis from our reporters across all 64 districts, and real-time maps.', date: '2027-01-07T08:00', variant: 'image', image: un('1504711434969-e33886168f5c', 2000), expiredText: 'We are live — follow the results', buttonLabel: 'Get result alerts', buttonUrl: '/contact' }, { paddingY: 'md', width: 'wide' })),
  sec('herald-video', 'Video report', 'Featured video with “up next” (dynamic)',
    S('episodeSpotlight', { eyebrow: 'Watch', title: 'Today’s video reports', format: 'VIDEO', count: 5, linkLabel: 'All videos', linkUrl: '/category/video' }, SURFACE)),
  sec('herald-explainers', 'Explainers', 'Carousel of explainer cards',
    S('cardCarousel', { eyebrow: 'Explained', title: 'The big stories, made simple', cardStyle: 'stacked', size: 'md', items: [
      ['Economy', 'Why are prices still rising?', 'Inflation, the taka and what comes next.'], ['Climate', 'Monsoon season, explained', 'What a changing climate means for the delta.'], ['Politics', 'How the election works', 'Seats, constituencies and counting, step by step.'], ['Tech', 'Is mobile banking safe?', 'What to know before you send money.'], ['Health', 'Dengue: the facts', 'Symptoms, prevention and when to see a doctor.'],
    ].map(([tag, title, text], i) => ({ image: pic(`herald-explain-${i}`, 1000, 750), tag, title, text, url: '/blog' })) })),
  sec('herald-standards', 'Editorial standards', 'Accordion with changing photograph',
    S('accordionImage', { eyebrow: 'Trust', title: 'How we report', imagePosition: 'left', items: [
      { title: 'Accuracy first', text: 'Every fact is checked by a second editor before publication. Speed never beats being right.', image: pic('herald-std-1', 1200, 1000) },
      { title: 'Independence', text: 'We accept no money from political parties. Advertisers never influence our coverage.', image: pic('herald-std-2', 1200, 1000) },
      { title: 'Corrections policy', text: 'When we get something wrong we say so — clearly, quickly and at the top of the story.', image: pic('herald-std-3', 1200, 1000) },
      { title: 'Protecting sources', text: 'We never reveal confidential sources and use secure channels for sensitive tips.', image: pic('herald-std-4', 1200, 1000) },
    ] })),
  sec('herald-newsroom', 'How a story is made', 'Scroll-filled vertical timeline',
    S('steps', { eyebrow: 'Inside the newsroom', title: 'From tip-off to front page', variant: 'vertical', items: [
      { icon: 'Send', title: 'The tip', text: 'Readers, sources and our own reporters flag what matters.' },
      { icon: 'Search', title: 'Reporting', text: 'Interviews, documents and time on the ground.' },
      { icon: 'FileCheck2', title: 'Fact-check', text: 'A second editor verifies names, numbers and quotes.' },
      { icon: 'Feather', title: 'Editing', text: 'Headlines, photos and context are polished for clarity.' },
      { icon: 'Newspaper', title: 'Publishing', text: 'Live online first, then in print the next morning.' },
    ] }, SURFACE)),
  sec('herald-then-now', 'Then & now', 'Before/after slider for photo stories',
    S('beforeAfter', { eyebrow: 'In pictures', title: 'Then and now: a city transformed', text: 'Drag to compare the archive photograph with today.', before: mono('1477959858617-67f85cf4f1df', 1800), after: un('1477959858617-67f85cf4f1df', 1800), beforeLabel: '1995', afterLabel: '2026', layout: 'split', ratio: '4/3' })),
  sec('herald-partners', 'Syndication partners', 'Bordered wordmark grid',
    S('logoWall', { title: 'Our journalism is syndicated by', variant: 'grid', logos: words(['World Wire', 'Asia Daily', 'Global Post', 'The Courier', 'Metro News', 'Daybreak', 'Signal', 'Ledger']) })),
  sec('herald-careers', 'Newsroom jobs', 'Filterable openings',
    S('jobs', { eyebrow: 'Join the newsroom', title: 'Work with us', subtitle: 'Reporters, editors and engineers who believe journalism matters.', applyEmail: 'jobs@herald.news', items: [
      { title: 'Political Correspondent', department: 'Newsroom', location: 'Dhaka', type: 'Full-time', description: 'Cover parliament, ministries and elections with rigour and fairness.' },
      { title: 'Data Journalist', department: 'Newsroom', location: 'Dhaka / Remote', type: 'Full-time', description: 'Find stories in spreadsheets and build interactive graphics.' },
      { title: 'Video Producer', department: 'Video', location: 'Dhaka', type: 'Full-time', description: 'Shoot and edit short documentaries and daily explainers.' },
      { title: 'Senior Web Engineer', department: 'Product', location: 'Remote', type: 'Contract', description: 'Keep our site fast on election night and every other night.' },
    ] })),
  sec('herald-subscribe-plans', 'Subscription plans', 'Digital subscription comparison',
    S('comparison', { eyebrow: 'Subscribe', title: 'Support independent journalism', columns: ['Free', 'Digital', 'Digital + Print'], highlight: 2, highlightLabel: 'Most read', groups: false, rows: rows('', [['Articles per month', '10', 'Unlimited', 'Unlimited'], ['Ad-free reading', 'no', 'yes', 'yes'], ['Daily e-paper', 'no', 'yes', 'yes'], ['Weekend print edition', 'no', 'no', 'yes'], ['Subscriber newsletters', 'no', 'yes', 'yes']]), buttons: [{ label: 'Keep reading', url: '/' }, { label: '৳199 / month', url: '/contact' }, { label: '৳399 / month', url: '/contact' }] })),
];

const heraldLuxe = [
  sec('herald-luxe-editors', 'Contributing editors', 'Monochrome portrait grid',
    S('team', { eyebrow: 'Masthead', title: 'Contributing editors', variant: 'portrait', columns: 3, members: [
      { name: 'Eleanor Vance', role: 'Editor-at-large', image: av(49), linkedin: '#' }, { name: 'Julian Marsh', role: 'Arts & letters', image: av(60), linkedin: '#' }, { name: 'Sofia Laurent', role: 'Foreign affairs', image: av(41), linkedin: '#' },
    ] }, { paddingY: 'xl' })),
  sec('herald-luxe-weekend', 'The weekend edition', 'Long-read carousel',
    S('cardCarousel', { eyebrow: 'The weekend edition', title: 'Long reads for slow mornings', cardStyle: 'stacked', size: 'lg', items: [
      ['Essay', 'The quiet return of the letter', 'Why handwriting is having a renaissance.'], ['Profile', 'The last bookbinder of Old Dhaka', 'Four generations, one workshop.'], ['Travel', 'A slow train through the tea gardens', 'Sylhet at the speed of conversation.'], ['Culture', 'The architects of the new skyline', 'Who decides what our cities become?'],
    ].map(([tag, title, text], i) => ({ image: pic(`herald-luxe-read-${i}`, 1200, 900), tag, title, text, url: '/blog' })) }, { paddingY: 'xl' })),
  sec('herald-luxe-standards', 'Our principles', 'Editorial accordion',
    S('accordionImage', { eyebrow: 'Principles', title: 'Journalism, considered', items: [
      { title: 'Slow is a virtue', text: 'We publish when a story is ready — not a minute before.', image: un('1504711434969-e33886168f5c', 1200) },
      { title: 'Context over noise', text: 'Fewer stories, told with depth, history and nuance.', image: pic('herald-luxe-std-2', 1200, 1000) },
      { title: 'Beautifully made', text: 'Photography, typography and design worthy of the words.', image: pic('herald-luxe-std-3', 1200, 1000) },
    ] }, { paddingY: 'xl' })),
  sec('herald-luxe-archive', 'From the archive', 'Restored photograph comparison',
    S('beforeAfter', { eyebrow: 'From the archive', title: 'A century in a single frame', text: 'Our photo desk restores one archive image each week.', before: mono('1449824913935-59a10b8d2000', 1800), after: un('1449824913935-59a10b8d2000', 1800), beforeLabel: 'Archive', afterLabel: 'Restored', layout: 'stacked', ratio: '16/9' }, { width: 'narrow', paddingY: 'xl' })),
];

/* ================================= Vidora ================================= */
const vidora = [
  sec('vidora-premiere', 'Featured premiere', 'Featured video + up next (dynamic)',
    S('episodeSpotlight', { eyebrow: 'Premiere', title: 'Featured this week', format: 'VIDEO', count: 5, linkLabel: 'Trending', linkUrl: '/trending' })),
  sec('vidora-trailer', 'Trailer lightbox', 'Cinematic poster that plays in a popup',
    S('videoLightbox', { eyebrow: 'Staff pick', title: 'Sintel — a short film by the Blender Institute', text: 'A lonely girl, a baby dragon and a journey across a frozen world.', poster: thumb(FILM.sintel), videoUrl: yt(FILM.sintel), layout: 'full', duration: '14:48' }, DARK)),
  sec('vidora-creators', 'Featured creators', 'Round avatars with subscriber counts',
    S('team', { eyebrow: 'Creators', title: 'Channels to follow', variant: 'round', columns: 4, members: [
      { name: 'Blender Studio', role: '1.2M subscribers', image: av(68), bio: 'Open movies made with open-source tools.' }, { name: 'Pixel Kitchen', role: '840K subscribers', image: av(26), bio: 'Animation tutorials and breakdowns.' }, { name: 'Frame by Frame', role: '510K subscribers', image: av(33), bio: 'Short films from new directors.' }, { name: 'Clipwise', role: '290K subscribers', image: av(57), bio: 'The best moments, every day.' },
    ] })),
  sec('vidora-collections', 'Playlists carousel', 'Swipeable video collections',
    S('cardCarousel', { eyebrow: 'Collections', title: 'Binge-worthy playlists', cardStyle: 'overlay', size: 'md', items: [
      [FILM.bunny, 'Animation', 'Big Buck Bunny'], [FILM.spring, 'Short film', 'Spring'], [FILM.sprite, 'Comedy', 'Sprite Fright'], [FILM.charge, 'Action', 'Charge'], [FILM.coffee, 'Short', 'Coffee Run'], [FILM.agent, 'Spy', 'Agent 327'],
    ].map(([id, tag, title]) => ({ image: thumb(id), tag, title, text: 'Watch the full film and behind-the-scenes extras.', url: '/playlists' })) })),
  sec('vidora-studio', 'Creator studio tabs', 'Side tabs for creator features',
    S('featureTabs', { eyebrow: 'Vidora Studio', title: 'Everything creators need', variant: 'side', tabs: [
      { icon: 'Download', label: 'Upload', title: 'Upload in any format', text: 'Drag in a file or paste a YouTube link — we handle the rest.', image: thumb(FILM.steel) },
      { icon: 'BarChart3', label: 'Analytics', title: 'Know your audience', text: 'Views, likes and watch time for every video and playlist.', image: thumb(FILM.cosmos) },
      { icon: 'MessageCircle', label: 'Community', title: 'Build a community', text: 'Likes, shares and playlists keep viewers coming back.', image: thumb(FILM.hero) },
      { icon: 'Award', label: 'Monetise', title: 'Get paid for your work', text: 'Sponsorships and memberships for growing channels.', image: thumb(FILM.elephants) },
    ] }, SURFACE)),
  sec('vidora-creator-program', 'Creator program', 'Gradient step cards',
    S('steps', { eyebrow: 'Creator program', title: 'Start your channel today', variant: 'cards', items: [
      { icon: 'Video', title: 'Upload', text: 'Share your first video in minutes.' }, { icon: 'Users', title: 'Grow', text: 'Get discovered through trending and playlists.' }, { icon: 'Trophy', title: 'Qualify', text: 'Reach 1,000 subscribers to unlock rewards.' }, { icon: 'Gift', title: 'Earn', text: 'Monthly payouts straight to your account.' },
    ] })),
  sec('vidora-live', 'Live premiere', 'Big minimal countdown',
    S('countdown', { eyebrow: 'Live premiere', title: 'Tears of Steel — live watch party', text: 'Chat with the director while the film premieres.', date: '2027-01-20T20:00', variant: 'minimal', buttonLabel: 'Set a reminder', buttonUrl: '/contact' }, { background: 'gradient', paddingY: 'xl' })),
  sec('vidora-premium', 'Free vs Premium', 'Plan comparison',
    S('comparison', { eyebrow: 'Vidora Premium', title: 'Watch without interruptions', columns: ['Free', 'Premium'], highlight: 2, highlightLabel: 'Ad-free', groups: false, rows: rows('', [['Unlimited videos', 'yes', 'yes'], ['Ad-free playback', 'no', 'yes'], ['Background play', 'no', 'yes'], ['Offline downloads', 'no', 'yes'], ['Video quality', '1080p', '4K HDR']]), buttons: [{ label: 'Keep watching', url: '/' }, { label: 'Try Premium free', url: '/contact' }] })),
];

const vidoraLuxe = [
  sec('vidora-luxe-signature', 'Signature screening', 'Full-width cinematic lightbox',
    S('videoLightbox', { eyebrow: 'Signature', title: 'Cosmos Laundromat', text: 'A director’s cut, presented in full.', poster: thumb(FILM.cosmos), videoUrl: yt(FILM.cosmos), layout: 'full', duration: '12:04' }, { ...DARK, paddingY: 'xl', width: 'wide' })),
  sec('vidora-luxe-filmmakers', 'Filmmakers', 'Monochrome portraits',
    S('team', { eyebrow: 'In residence', title: 'The filmmakers', variant: 'portrait', columns: 4, members: [
      { name: 'Isabelle Moreau', role: 'Director', image: av(43) }, { name: 'Daniel Okafor', role: 'Cinematographer', image: av(52) }, { name: 'Hana Sato', role: 'Animator', image: av(23) }, { name: 'Marco Bellini', role: 'Composer', image: av(51) },
    ] }, { paddingY: 'xl' })),
  sec('vidora-luxe-reels', 'Curated reels', 'Frosted-glass carousel',
    S('cardCarousel', { eyebrow: 'Curated', title: 'Reels of the season', cardStyle: 'glass', size: 'lg', items: [[FILM.spring, 'Spring'], [FILM.hero, 'Hero'], [FILM.steel, 'Tears of Steel'], [FILM.sintel, 'Sintel']].map(([id, title]) => ({ image: thumb(id), tag: 'Short film', title, text: 'Presented in 4K.', url: '/playlists' })) }, { paddingY: 'xl' })),
  sec('vidora-luxe-festival', 'Festival countdown', 'Minimal countdown',
    S('countdown', { eyebrow: 'Vidora Film Festival', title: 'The festival opens in', date: '2027-04-10T19:00', variant: 'minimal', buttonLabel: 'Reserve a seat', buttonUrl: '/contact' }, { paddingY: 'xl' })),
];

/* ================================= Marquee ================================ */
const marquee = [
  sec('marquee-coming-soon', 'Coming soon', 'Countdown over key art',
    S('countdown', { eyebrow: 'Coming soon', title: 'Sprite Fright — streaming in', text: 'A camping trip goes horribly, hilariously wrong.', date: '2027-01-31T00:00', variant: 'image', image: thumb(FILM.sprite), expiredText: 'Now streaming', buttonLabel: 'Remind me', buttonUrl: '/new-popular' }, { ...DARK, paddingY: 'md', width: 'wide' })),
  sec('marquee-trailer', 'Trailer', 'Full-width trailer lightbox',
    S('videoLightbox', { eyebrow: 'Official trailer', title: 'Tears of Steel', text: 'Amsterdam, the future. A last attempt to save the world.', poster: thumb(FILM.steel), videoUrl: yt(FILM.steel), layout: 'full', duration: '12:14' }, DARK)),
  sec('marquee-cast', 'Cast & crew', 'Tall portraits, colour on hover',
    S('team', { eyebrow: 'Cast & crew', title: 'The people who made it', variant: 'portrait', columns: 4, members: [
      { name: 'Derek de Lint', role: 'Lead actor', image: av(13) }, { name: 'Sergio Hasselbaink', role: 'Supporting', image: av(18) }, { name: 'Rogier Schippers', role: 'Supporting', image: av(56) }, { name: 'Ian Hubert', role: 'Director', image: av(65) },
    ] }, DARK)),
  sec('marquee-collections', 'Collections', 'Large poster carousel',
    S('cardCarousel', { eyebrow: 'Collections', title: 'Award-winning originals', cardStyle: 'overlay', size: 'lg', items: [
      [FILM.cosmos, 'Drama', 'Cosmos Laundromat'], [FILM.sintel, 'Fantasy', 'Sintel'], [FILM.elephants, 'Sci-fi', 'Elephants Dream'], [FILM.agent, 'Action', 'Agent 327'], [FILM.hero, 'Animation', 'Hero'],
    ].map(([id, tag, title]) => ({ image: thumb(id), tag, title, text: 'Stream now in 4K with Dolby audio.', url: '/shows' })) }, DARK)),
  sec('marquee-devices', 'Watch anywhere', 'Device tabs',
    S('featureTabs', { eyebrow: 'Watch anywhere', title: 'On every screen you own', tabs: [
      { icon: 'Tv', label: 'TV', title: 'Enjoy on your TV', text: 'Smart TVs, PlayStation, Xbox, Chromecast, Apple TV and more.', image: thumb(FILM.bunny) },
      { icon: 'Smartphone', label: 'Mobile', title: 'Take it with you', text: 'Stream on your phone and tablet, wherever you are.', image: thumb(FILM.charge) },
      { icon: 'Download', label: 'Download', title: 'Download for offline', text: 'Save your favourites and watch without a connection.', image: thumb(FILM.coffee) },
      { icon: 'Users', label: 'Profiles', title: 'Profiles for kids', text: 'Their own space, with only family-friendly titles.', image: thumb(FILM.spring) },
    ] }, DARK)),
  sec('marquee-plans', 'Choose a plan', 'Plan comparison table',
    S('comparison', { eyebrow: 'Plans', title: 'Choose the plan that’s right for you', columns: ['Basic', 'Standard', 'Premium'], highlight: 3, highlightLabel: 'Best quality', groups: false, rows: rows('', [['Monthly price', '$6.99', '$15.49', '$22.99'], ['Video quality', 'Good', 'Great', 'Best'], ['Resolution', '720p', '1080p', '4K + HDR'], ['Screens at once', '1', '2', '4'], ['Downloads', 'no', 'yes', 'yes'], ['Spatial audio', 'no', 'no', 'yes']]), buttons: [{ label: 'Choose Basic', url: '/contact' }, { label: 'Choose Standard', url: '/contact' }, { label: 'Choose Premium', url: '/contact' }] }, DARK)),
  sec('marquee-how', 'Start watching', 'Three-step timeline',
    S('steps', { eyebrow: 'Get started', title: 'Ready to watch in three steps', variant: 'timeline', items: [
      { icon: 'Crown', title: 'Choose a plan', text: 'No commitments — cancel any time.' }, { icon: 'Users', title: 'Create your profile', text: 'Up to five profiles per account.' }, { icon: 'Popcorn', title: 'Start watching', text: 'Thousands of titles, on every device.' },
    ] }, DARK)),
];

const marqueeLuxe = [
  sec('marquee-luxe-premiere', 'Prestige premiere', 'Countdown over a cinema photograph',
    S('countdown', { eyebrow: 'World premiere', title: 'An evening at the cinema', date: '2027-02-20T20:00', variant: 'image', image: un('1489599849927-2ee91cede3ba', 2000), buttonLabel: 'Request seats', buttonUrl: '/contact' }, { ...DARK, paddingY: 'md', width: 'wide' })),
  sec('marquee-luxe-ensemble', 'The ensemble', 'Portrait grid',
    S('team', { eyebrow: 'The ensemble', title: 'Starring', variant: 'portrait', columns: 3, members: [{ name: 'Céline Dubois', role: 'Lead', image: av(20) }, { name: 'Arthur Wells', role: 'Lead', image: av(11) }, { name: 'Mei Tanaka', role: 'Director', image: av(9) }] }, { ...DARK, paddingY: 'xl' })),
  sec('marquee-luxe-membership', 'Membership tiers', 'Comparison table',
    S('comparison', { eyebrow: 'Membership', title: 'Choose your membership', columns: ['Member', 'Patron', 'Founder'], highlight: 2, highlightLabel: 'Recommended', groups: false, rows: rows('', [['Full catalogue in 4K', 'yes', 'yes', 'yes'], ['Early premieres', 'no', 'yes', 'yes'], ['Private screenings', 'no', '2 / year', 'Unlimited'], ['Director Q&As', 'no', 'yes', 'yes'], ['Annual price', '$149', '$399', '$1,200']]), buttons: [{ label: 'Join', url: '/contact' }, { label: 'Become a patron', url: '/contact' }, { label: 'Enquire', url: '/contact' }] }, { ...DARK, paddingY: 'xl' })),
  sec('marquee-luxe-screening', 'Private screening', 'Split video with stats',
    S('videoLightbox', { eyebrow: 'Private screening', title: 'Elephants Dream, restored', text: 'The first open movie, remastered for the big screen.', poster: thumb(FILM.elephants), videoUrl: yt(FILM.elephants), layout: 'split', duration: '10:54', stats: [{ value: '4K', label: 'Restoration' }, { value: '2006', label: 'Original release' }] }, { ...DARK, paddingY: 'xl' })),
];

/* ================================ Waveform ================================ */
const waveform = [
  sec('waveform-latest', 'Latest episode', 'Big player + up next (dynamic)',
    S('episodeSpotlight', { eyebrow: 'New episode', title: 'Fresh in your feed', format: 'AUDIO', count: 5, linkLabel: 'All episodes', linkUrl: '/episodes' })),
  sec('waveform-hosts', 'Your hosts', 'Round avatars with gradient ring',
    S('team', { eyebrow: 'Behind the mic', title: 'Meet your hosts', variant: 'round', columns: 3, members: [
      { name: 'Maya Lin', role: 'Host · The Build', image: av(29), bio: 'Interviews founders about what really happened.', twitter: '#' }, { name: 'Omar Faruk', role: 'Host · Night Owls Radio', image: av(67), bio: 'Late-night music and the stories behind the songs.', twitter: '#' }, { name: 'Zara Ahmed', role: 'Host · Design Matters', image: av(38), bio: 'Conversations with designers who changed the game.', twitter: '#' },
    ] })),
  sec('waveform-guests', 'Recent guests', 'Glass-caption carousel',
    S('cardCarousel', { eyebrow: 'On the show', title: 'Recent guests', cardStyle: 'glass', size: 'sm', items: [[5, 'Product lead'], [12, 'Founder'], [32, 'Illustrator'], [14, 'Engineer'], [47, 'Author'], [15, 'Musician']].map(([n, tag], i) => ({ image: `https://i.pravatar.cc/800?img=${n}`, tag, title: ['Sarah Chen', 'Marcus Johnson', 'Elena Park', 'David Kim', 'Priya Sharma', 'Leo Grant'][i], text: 'Listen to the conversation.', url: '/episodes' })) })),
  sec('waveform-listen', 'Listen on', 'Platform wordmark grid',
    S('logoWall', { title: 'Listen wherever you get your podcasts', variant: 'grid', logos: words(['Spotify', 'Apple Podcasts', 'YouTube Music', 'Pocket Casts', 'Overcast', 'Amazon Music', 'Castbox', 'RSS']) }, { width: 'narrow' })),
  sec('waveform-live', 'Live recording', 'Countdown to a live show',
    S('countdown', { eyebrow: 'Live show', title: 'Join us for a live recording', text: 'An evening of conversation, music and audience Q&A in Dhaka.', date: '2027-02-05T19:30', variant: 'cards', buttonLabel: 'Get tickets', buttonUrl: '/contact' }, { background: 'gradient', paddingY: 'xl' })),
  sec('waveform-guest', 'Be a guest', 'Gradient step cards',
    S('steps', { eyebrow: 'Be on the show', title: 'Pitch us your story', variant: 'cards', items: [
      { icon: 'Send', title: 'Pitch', text: 'Tell us who you are and the story only you can tell.' }, { icon: 'Phone', title: 'Pre-call', text: 'A relaxed 15-minute chat with the producer.' }, { icon: 'Mic', title: 'Record', text: 'In our studio or remotely with a kit we send you.' }, { icon: 'Radio', title: 'Release', text: 'We edit, mix and share it with 200k listeners.' },
    ] }, SURFACE)),
  sec('waveform-sponsor', 'Sponsorship packages', 'Comparison table for advertisers',
    S('comparison', { eyebrow: 'Advertise', title: 'Reach curious, loyal listeners', columns: ['Pre-roll', 'Mid-roll', 'Season partner'], highlight: 2, highlightLabel: 'Best reach', groups: false, rows: rows('', [['Host-read ad', 'yes', 'yes', 'yes'], ['Length', '15s', '60s', '60s + intro'], ['Episodes', '4', '8', 'Full season'], ['Show-notes link', 'yes', 'yes', 'yes'], ['Newsletter feature', 'no', 'yes', 'yes'], ['Live-show branding', 'no', 'no', 'yes']]), buttons: [{ label: 'Enquire', url: '/contact' }, { label: 'Enquire', url: '/contact' }, { label: 'Let’s talk', url: '/contact' }] })),
  sec('waveform-studio', 'Inside the studio', 'Split video with stats',
    S('videoLightbox', { eyebrow: 'Behind the scenes', title: 'Inside the Waveform studio', text: 'Microphones, mixing desks and a lot of coffee.', poster: un('1590602847861-f357a9332bbc', 1600), videoUrl: yt(FILM.coffee), layout: 'split', duration: '3:04', stats: [{ value: '200k', label: 'Monthly listeners' }, { value: '350+', label: 'Episodes' }, { value: '4.9', label: 'Apple rating' }] })),
];

const waveformLuxe = [
  sec('waveform-luxe-salon', 'Now in the salon', 'Featured episode (dynamic)',
    S('episodeSpotlight', { eyebrow: 'Now in the salon', title: 'This week’s conversation', format: 'AUDIO', count: 4, linkLabel: 'The archive', linkUrl: '/episodes' }, { paddingY: 'xl' })),
  sec('waveform-luxe-hosts', 'The hosts', 'Monochrome portraits',
    S('team', { eyebrow: 'Your hosts', title: 'Voices of the salon', variant: 'portrait', columns: 3, members: [{ name: 'Maya Lin', role: 'Host', image: av(29) }, { name: 'Omar Faruk', role: 'Host', image: av(67) }, { name: 'Zara Ahmed', role: 'Host', image: av(38) }] }, { paddingY: 'xl' })),
  sec('waveform-luxe-evening', 'Salon evenings', 'Countdown over a studio photograph',
    S('countdown', { eyebrow: 'An evening with', title: 'Salon evenings, live on stage', date: '2027-03-12T19:00', variant: 'image', image: un('1511379938547-c1f69419868d', 2000), buttonLabel: 'Reserve seats', buttonUrl: '/contact' }, { paddingY: 'md', width: 'wide' })),
  sec('waveform-luxe-patrons', 'Patrons', 'Wordmark grid',
    S('logoWall', { title: 'With the support of our patrons', variant: 'grid', logos: words(['Maison Vale', 'Aurelia', 'Halden', 'Oriel', 'Saint Clair', 'Lumière']) }, { width: 'narrow', paddingY: 'xl' })),
];

/* ================================== Folio ================================= */
const folio = [
  sec('folio-process', 'How I work', 'Four-step timeline',
    S('steps', { eyebrow: 'Process', title: 'How I turn requirements into software', variant: 'timeline', items: [
      { icon: 'MessageCircle', title: 'Discovery', text: 'Understand the business, users and the workflows to automate.' },
      { icon: 'Database', title: 'Architecture', text: 'Database design, modules and APIs planned before a line of code.' },
      { icon: 'Code2', title: 'Build', text: 'Laravel / Node back-ends with clean, tested, documented code.' },
      { icon: 'Rocket', title: 'Deploy & support', text: 'Production deployment, training and long-term maintenance.' },
    ] })),
  sec('folio-services', 'Services tabs', 'Side tabs for what I build',
    S('featureTabs', { eyebrow: 'Services', title: 'What I build', variant: 'side', tabs: [
      { icon: 'Boxes', label: 'ERP systems', title: 'Enterprise resource planning', text: 'Inventory, accounting, HR and production in one system — like Akboria and Matribhumi Dairy.', bullets: ['Multi-branch inventory', 'Accounting & reports'], image: un('1497366216548-37526070297c', 1200) },
      { icon: 'Globe', label: 'Web apps', title: 'Business web applications', text: 'Custom dashboards, portals and admin panels tailored to your workflow.', bullets: ['Role-based access', 'Responsive UI'], image: un('1498050108023-c5249f4df085', 1200) },
      { icon: 'Server', label: 'APIs', title: 'REST APIs & integrations', text: 'Secure APIs for mobile apps, payment gateways and third-party systems.', bullets: ['Authentication', 'Documentation'], image: un('1517694712202-14dd9538aa97', 1200) },
      { icon: 'BarChart3', label: 'Dashboards', title: 'Reports & analytics', text: 'Turn operational data into clear, real-time decisions.', bullets: ['Sales & stock reports', 'Export to PDF / Excel'], image: un('1461749280684-dccba630e2f6', 1200) },
    ] }, SURFACE)),
  sec('folio-cases', 'Case studies', 'Swipeable project cards',
    S('cardCarousel', { eyebrow: 'Case studies', title: 'Selected projects', cardStyle: 'stacked', size: 'md', items: [
      ['ERP', 'Akboria Group', 'Group-wide ERP: inventory, accounts and HR across companies.'], ['Poultry ERP', 'Sha Sultan & VIP Poultry', 'Farm, feed and sales management for poultry operations.'], ['Bakery ERP', 'Tarek Bakery & Equator', 'Production planning, outlets and distribution.'], ['Dairy ERP', 'Matribhumi Dairy & Varosha', 'Milk collection, processing and dealer sales.'],
    ].map(([tag, title, text], i) => ({ image: un(['1497366216548-37526070297c', '1498050108023-c5249f4df085', '1461749280684-dccba630e2f6', '1517694712202-14dd9538aa97'][i], 1000), tag, title, text, url: '/#projects' })) })),
  sec('folio-modernise', 'Legacy → modern', 'Before/after slider',
    S('beforeAfter', { eyebrow: 'Modernisation', title: 'From spreadsheets to a modern system', text: 'Drag to see how manual processes become a fast, reliable web application.', before: mono('1461749280684-dccba630e2f6', 1800), after: un('1461749280684-dccba630e2f6', 1800), beforeLabel: 'Manual', afterLabel: 'Automated', layout: 'split', ratio: '4/3' })),
  sec('folio-stack', 'Tech stack', 'Scrolling technology wordmarks',
    S('logoWall', { title: 'Technologies I work with every day', variant: 'marquee', speed: 35, logos: words(['Laravel', 'PHP', 'MySQL', 'PostgreSQL', 'Node.js', 'Express', 'React', 'Next.js', 'Tailwind CSS', 'Docker', 'Git']) }, { paddingY: 'md' })),
  sec('folio-engagement', 'Ways to work together', 'Engagement model comparison',
    S('comparison', { eyebrow: 'Engagement', title: 'Ways to work together', columns: ['Fixed project', 'Monthly retainer', 'Hourly'], highlight: 1, highlightLabel: 'Most popular', groups: false, rows: rows('', [['Best for', 'New systems', 'Ongoing work', 'Small fixes'], ['Fixed scope & price', 'yes', 'no', 'no'], ['Priority support', 'yes', 'yes', 'no'], ['Weekly progress demo', 'yes', 'yes', 'no'], ['Source code ownership', 'yes', 'yes', 'yes']]), buttons: [{ label: 'Get a quote', url: '/#contact' }, { label: 'Discuss', url: '/#contact' }, { label: 'Book hours', url: '/#contact' }] })),
  sec('folio-why', 'Why work with me', 'Accordion with changing image',
    S('accordionImage', { eyebrow: 'Why me', title: 'What clients value', items: [
      { title: 'Business-first thinking', text: 'I learn your operations before proposing software, so the system fits the way you work.', image: un('1497366216548-37526070297c', 1200) },
      { title: 'Proven ERP experience', text: 'Production systems running daily for poultry, dairy, bakery and group companies.', image: un('1461749280684-dccba630e2f6', 1200) },
      { title: 'Clean, maintainable code', text: 'Readable, documented code that another developer can pick up tomorrow.', image: un('1517694712202-14dd9538aa97', 1200) },
      { title: 'Long-term support', text: 'I stay available after launch for training, fixes and new features.', image: un('1498050108023-c5249f4df085', 1200) },
    ] })),
  sec('folio-walkthrough', 'Project walkthrough', 'Video lightbox with stats',
    S('videoLightbox', { eyebrow: 'Walkthrough', title: 'A tour of an ERP I built', text: 'Inventory, sales and accounting — see the full workflow in a few minutes.', poster: un('1498050108023-c5249f4df085', 1600), videoUrl: yt(FILM.bunny), layout: 'split', duration: '4:20', stats: [{ value: '4+', label: 'Years experience' }, { value: '10+', label: 'Production systems' }, { value: '100%', label: 'Client retention' }] }, SURFACE)),
];

const folioLuxe = [
  sec('folio-luxe-works', 'Selected works', 'Large stacked carousel',
    S('cardCarousel', { eyebrow: 'Selected works', title: 'Systems in production', cardStyle: 'glass', size: 'lg', items: [['Akboria Group', 'ERP'], ['Sha Sultan & VIP Poultry', 'Poultry ERP'], ['Tarek Bakery & Equator', 'Bakery ERP'], ['Matribhumi Dairy & Varosha', 'Dairy ERP']].map(([title, tag], i) => ({ image: un(['1497366216548-37526070297c', '1498050108023-c5249f4df085', '1461749280684-dccba630e2f6', '1517694712202-14dd9538aa97'][i], 1000), tag, title, text: 'Design, development and deployment.', url: '/#projects' })) }, { paddingY: 'xl' })),
  sec('folio-luxe-approach', 'Approach', 'Scroll-filled vertical steps',
    S('steps', { eyebrow: 'Approach', title: 'A considered way of building', variant: 'vertical', items: [
      { icon: 'Compass', title: 'Understand', text: 'Every engagement starts with the business, not the code.' }, { icon: 'Database', title: 'Design', text: 'Data models and flows drawn before development begins.' }, { icon: 'Code2', title: 'Build', text: 'Weekly demos, clean code, no surprises.' }, { icon: 'Handshake', title: 'Support', text: 'A long-term partner after launch.' },
    ] }, { paddingY: 'xl', width: 'narrow' })),
  sec('folio-luxe-engagements', 'Engagements', 'Comparison table',
    S('comparison', { eyebrow: 'Engagements', title: 'Working together', columns: ['Project', 'Retainer'], highlight: 1, highlightLabel: 'Recommended', groups: false, rows: rows('', [['Discovery workshop', 'yes', 'yes'], ['Dedicated hours', 'Scoped', '80 / month'], ['Priority support', 'yes', 'yes'], ['Code ownership', 'yes', 'yes']]), buttons: [{ label: 'Start a project', url: '/#contact' }, { label: 'Discuss a retainer', url: '/#contact' }] }, { width: 'narrow', paddingY: 'xl' })),
  sec('folio-luxe-stack', 'Craft & tools', 'Bordered wordmark grid',
    S('logoWall', { title: 'Craft & tools', variant: 'grid', logos: words(['Laravel', 'PHP', 'MySQL', 'PostgreSQL', 'Node.js', 'React', 'Next.js', 'Docker']) }, { width: 'narrow' })),
];

/* =============================== Saffron ================================== */
const FOOD = ['1504674900247-0877df9cc836', '1540189549336-e6e99c3679fe', '1565299624946-b28f40a0ae38', '1512621776951-a57141f2eefd', '1567620905732-2d1ec7ab7445', '1565958011703-44f9829ba187'];
const saffron = [
  sec('saffron-kitchen', 'Our kitchen', 'Tall chef portraits',
    S('team', { eyebrow: 'The kitchen', title: 'Meet the chefs', variant: 'portrait', columns: 3, members: [{ name: 'Marco Bellini', role: 'Executive chef', image: av(51), bio: '' }, { name: 'Aisha Rahman', role: 'Pastry chef', image: av(31) }, { name: 'Kenji Mori', role: 'Sous chef', image: av(54) }] })),
  sec('saffron-specials', 'Chef’s specials', 'Food carousel with overlay captions',
    S('cardCarousel', { eyebrow: 'This week', title: 'Chef’s specials', cardStyle: 'overlay', size: 'md', items: FOOD.map((id, i) => ({ image: un(id, 900), tag: ['Starter', 'Main', 'Pizza', 'Salad', 'Brunch', 'Dessert'][i], title: ['Charred spring vegetables', 'Slow-roasted lamb', 'Wood-fired margherita', 'Garden harvest bowl', 'Buttermilk pancakes', 'Berry pavlova'][i], text: 'Seasonal, local, made from scratch.', url: '/menu' })) })),
  sec('saffron-farm', 'Farm to table', 'Scroll-filled vertical story',
    S('steps', { eyebrow: 'Our story', title: 'From farm to your table', variant: 'vertical', items: [
      { icon: 'Leaf', title: 'Sourced locally', text: 'Vegetables from farms within 50 km, picked that morning.' }, { icon: 'Flame', title: 'Cooked over fire', text: 'Our wood-fired oven and grill are the heart of the kitchen.' }, { icon: 'ChefHat', title: 'Plated with care', text: 'Simple dishes, perfectly executed.' }, { icon: 'Wine', title: 'Paired thoughtfully', text: 'Natural wines and house-made drinks.' },
    ] }, SURFACE)),
  sec('saffron-wine-dinner', 'Event countdown', 'Countdown over a dining-room photo',
    S('countdown', { eyebrow: 'Special event', title: 'Five-course wine dinner', text: 'One night only. Limited to 40 guests.', date: '2027-02-14T19:00', variant: 'image', image: un('1414235077428-338989a2e8c0', 2000), buttonLabel: 'Reserve a seat', buttonUrl: '/reservations' }, { paddingY: 'md', width: 'wide' })),
  sec('saffron-tour', 'Kitchen video', 'Full-width video lightbox',
    S('videoLightbox', { eyebrow: 'Behind the pass', title: 'A night in our kitchen', poster: un('1517248135467-4c7edcad34c4', 1800), videoUrl: yt(FILM.coffee), layout: 'full', duration: '3:04' })),
  sec('saffron-press', 'As seen in', 'Press wordmark grid',
    S('logoWall', { title: 'As featured in', variant: 'grid', logos: words(['Food & Wine', 'Bon Appétit', 'Eater', 'Michelin Guide', 'Condé Nast', 'Time Out']) }, { width: 'narrow' })),
  sec('saffron-catering', 'Catering packages', 'Comparison table',
    S('comparison', { eyebrow: 'Private dining & catering', title: 'Celebrate with us', columns: ['Intimate', 'Celebration', 'Grand'], highlight: 2, highlightLabel: 'Popular', groups: false, rows: rows('', [['Guests', 'Up to 12', 'Up to 40', '40 – 120'], ['Set menu', '3 courses', '4 courses', '5 courses'], ['Wine pairing', 'no', 'yes', 'yes'], ['Private room', 'yes', 'yes', 'Full venue'], ['Per guest', '$65', '$95', '$140']]), buttons: [{ label: 'Enquire', url: '/contact' }, { label: 'Enquire', url: '/contact' }, { label: 'Enquire', url: '/contact' }] })),
  sec('saffron-careers', 'Kitchen jobs', 'Filterable openings',
    S('jobs', { eyebrow: 'Careers', title: 'Join our team', subtitle: 'Great food starts with a happy, respected team.', applyEmail: 'jobs@saffron.kitchen', items: [
      { title: 'Line Cook', department: 'Kitchen', location: 'On site', type: 'Full-time', description: 'Grill and sauté station experience preferred.' }, { title: 'Pastry Assistant', department: 'Kitchen', location: 'On site', type: 'Part-time', description: 'Early mornings, laminated doughs and lots of butter.' }, { title: 'Sommelier', department: 'Front of house', location: 'On site', type: 'Full-time', description: 'Curate and share our natural wine list.' },
    ] })),
];

/* ================================= Pulse ================================== */
const pulse = [
  sec('pulse-tabs', 'Product tabs', 'Auto-playing feature tour',
    S('featureTabs', { eyebrow: 'Platform', title: 'Analytics that answer questions', tabs: [
      { icon: 'BarChart3', label: 'Dashboards', title: 'Dashboards in seconds', text: 'Drag metrics onto a canvas and share live dashboards with your team.', bullets: ['50+ chart types', 'Real-time updates'], image: pic('pulse-tab-1', 1200, 900) },
      { icon: 'Target', label: 'Funnels', title: 'Find where users drop off', text: 'Build funnels from any events and compare cohorts side by side.', bullets: ['Cohort comparison', 'Conversion windows'], image: pic('pulse-tab-2', 1200, 900) },
      { icon: 'Zap', label: 'Alerts', title: 'Know before your customers do', text: 'Anomaly detection pings Slack the moment a metric moves.', bullets: ['Slack & email', 'Smart thresholds'], image: pic('pulse-tab-3', 1200, 900) },
      { icon: 'Lock', label: 'Privacy', title: 'Privacy by design', text: 'Cookieless tracking, EU hosting and GDPR tools built in.', bullets: ['No cookies', 'Data residency'], image: pic('pulse-tab-4', 1200, 900) },
    ] }, { background: 'gradient' })),
  sec('pulse-compare', 'Pulse vs alternatives', 'Comparison table',
    S('comparison', { eyebrow: 'Compare', title: 'How Pulse stacks up', columns: ['Pulse', 'Legacy analytics', 'Spreadsheets'], highlight: 1, highlightLabel: 'Recommended', rows: [
      ...rows('Insights', [['Real-time dashboards', 'yes', 'Delayed', 'no'], ['Funnels & cohorts', 'yes', 'yes', 'no'], ['Anomaly alerts', 'yes', 'no', 'no']]),
      ...rows('Privacy', [['Cookieless tracking', 'yes', 'no', 'yes'], ['EU data hosting', 'yes', 'Paid add-on', 'no']]),
      ...rows('Team', [['Setup time', '5 minutes', '2 weeks', 'Days']]),
    ], buttons: [{ label: 'Start free trial', url: '/#pricing' }] })),
  sec('pulse-logos', 'Customer logos', 'Logo marquee',
    S('logoWall', { title: 'Powering product teams at', logos: words(['Linear', 'Vercel', 'Raycast', 'Arc', 'Loom', 'Notion', 'Figma', 'Retool']) }, { paddingY: 'md' })),
  sec('pulse-demo', 'Demo video', 'Split video with stats',
    S('videoLightbox', { eyebrow: 'Demo', title: 'From event to insight in 90 seconds', text: 'Watch a product manager answer five questions without writing SQL.', poster: pic('pulse-demo', 1600, 900), videoUrl: yt(FILM.charge), layout: 'split', duration: '1:30', stats: [{ value: '12k', label: 'Teams' }, { value: '3.2B', label: 'Events / day' }, { value: '99.99%', label: 'Uptime' }] })),
  sec('pulse-onboarding', 'Onboarding', 'Gradient step cards',
    S('steps', { eyebrow: 'Setup', title: 'Live in five minutes', variant: 'cards', items: [
      { icon: 'Code2', title: 'Add the snippet', text: 'One line of JavaScript, or our SDKs.' }, { icon: 'Workflow', title: 'Track events', text: 'Auto-capture clicks and page views.' }, { icon: 'BarChart3', title: 'Build dashboards', text: 'Templates for SaaS, e-commerce and media.' }, { icon: 'Users', title: 'Share insights', text: 'Invite the team and schedule reports.' },
    ] })),
  sec('pulse-launch', 'Launch countdown', 'Glass countdown cards',
    S('countdown', { eyebrow: 'Pulse AI', title: 'Ask your data anything — launching soon', date: '2027-03-15T17:00', variant: 'cards', buttonLabel: 'Get early access', buttonUrl: '/contact' }, { background: 'gradient', paddingY: 'xl' })),
  sec('pulse-team', 'Team', 'Cards with sliding bios',
    S('team', { eyebrow: 'Team', title: 'Built by people who love data', variant: 'cards' })),
  sec('pulse-careers', 'Careers', 'Filterable job board',
    S('jobs', { eyebrow: 'Careers', title: 'Help teams understand their users', applyEmail: 'jobs@pulse.app' })),
];

/* ================================== Lens ================================== */
const lens = [
  sec('lens-retouch', 'Retouching', 'Before/after slider',
    S('beforeAfter', { eyebrow: 'Retouching', title: 'The art of the edit', text: 'Colour grading and careful retouching bring every frame to life.', before: mono('1534528741775-53994a69daeb', 1600), after: un('1534528741775-53994a69daeb', 1600), beforeLabel: 'Raw', afterLabel: 'Edited', layout: 'split', ratio: '4/3' })),
  sec('lens-stories', 'Photo stories', 'Frosted-glass carousel',
    S('cardCarousel', { eyebrow: 'Stories', title: 'Recent sessions', cardStyle: 'glass', size: 'md', items: [['1519741497674-611481863552', 'Weddings', 'Anna & James'], ['1506905925346-21bda4d32df4', 'Landscapes', 'Above the clouds'], ['1494790108377-be9c29b29330', 'Portraits', 'Golden hour'], ['1480714378408-67cf0d13bc1b', 'City', 'Night skyline'], ['1511285560929-80b456fea0bc', 'Weddings', 'Vows at sunset']].map(([id, tag, title]) => ({ image: un(id, 900), tag, title, text: 'View the full story.', url: '/work' })) })),
  sec('lens-session', 'Your session', 'Four-step timeline',
    S('steps', { eyebrow: 'How it works', title: 'Your session, step by step', variant: 'timeline', items: [
      { icon: 'MessageCircle', title: 'Consultation', text: 'We talk about your vision, locations and style.' }, { icon: 'Calendar', title: 'Plan', text: 'Mood boards, timings and a shot list.' }, { icon: 'Camera', title: 'Shoot', text: 'Relaxed, natural and fun — no stiff poses.' }, { icon: 'Image', title: 'Gallery', text: 'Your edited gallery within two weeks.' },
    ] })),
  sec('lens-packages', 'Wedding packages', 'Comparison table',
    S('comparison', { eyebrow: 'Packages', title: 'Wedding collections', columns: ['Essential', 'Signature', 'Heirloom'], highlight: 2, highlightLabel: 'Most booked', groups: false, rows: rows('', [['Coverage', '6 hours', '10 hours', 'Full day'], ['Edited photos', '300+', '600+', '900+'], ['Second photographer', 'no', 'yes', 'yes'], ['Engagement session', 'no', 'yes', 'yes'], ['Fine-art album', 'no', 'no', 'yes'], ['Investment', '$2,400', '$3,900', '$5,800']]), buttons: [{ label: 'Enquire', url: '/contact' }, { label: 'Enquire', url: '/contact' }, { label: 'Enquire', url: '/contact' }] })),
  sec('lens-showreel', 'Showreel', 'Full-width video lightbox',
    S('videoLightbox', { eyebrow: 'Showreel', title: 'A year behind the lens', poster: un('1493246507139-91e8fad9978e', 1800), videoUrl: yt(FILM.spring), layout: 'full', duration: '7:44' }, DARK)),
  sec('lens-specialities', 'Specialities', 'Accordion with changing photo',
    S('accordionImage', { eyebrow: 'Specialities', title: 'What I photograph', items: [
      { title: 'Weddings', text: 'Honest, unposed storytelling from first look to last dance.', image: un('1519741497674-611481863552', 1200) }, { title: 'Portraits', text: 'Editorial and personal portraits, in studio or on location.', image: un('1494790108377-be9c29b29330', 1200) }, { title: 'Landscapes', text: 'Fine-art prints of mountains, coasts and quiet places.', image: un('1506905925346-21bda4d32df4', 1200) }, { title: 'City', text: 'Architecture and street photography after dark.', image: un('1477959858617-67f85cf4f1df', 1200) },
    ] })),
  sec('lens-studio', 'The studio', 'Tall portraits',
    S('team', { eyebrow: 'The studio', title: 'Behind the camera', variant: 'portrait', columns: 3, members: [{ name: 'Aria Novak', role: 'Lead photographer', image: un('1534528741775-53994a69daeb', 800) }, { name: 'Theo Grant', role: 'Second shooter', image: un('1507003211169-0a1dd7228f2d', 800) }, { name: 'Lina Weiss', role: 'Retoucher', image: un('1494790108377-be9c29b29330', 800) }] })),
];

export const THEME_SECTIONS = {
  nova, 'nova-luxe': novaLuxe,
  herald, 'herald-luxe': heraldLuxe,
  vidora, 'vidora-luxe': vidoraLuxe,
  marquee, 'marquee-luxe': marqueeLuxe,
  waveform, 'waveform-luxe': waveformLuxe,
  folio, 'folio-luxe': folioLuxe,
  saffron, pulse, lens,
  ...BUSINESS_SECTIONS,
};

// Complete page starters per theme, built from the theme's sections (+ a generic page header when the first key is 'header').
export const THEME_PAGE_DESIGNS = {
  nova: [
    { key: 'about', label: 'About the company', sections: ['nova-intro', 'nova-accordion', 'nova-team', 'nova-logos', 'nova-careers'] },
    { key: 'product', label: 'Product tour', sections: ['header', 'nova-tabs', 'nova-video', 'nova-process', 'nova-compare'] },
    { key: 'launch', label: 'Launch / waitlist', sections: ['nova-launch', 'nova-tabs', 'nova-logos'] },
  ],
  'nova-luxe': [{ key: 'studio', label: 'The studio', sections: ['header', 'nova-luxe-method', 'nova-luxe-works', 'nova-luxe-atelier', 'nova-luxe-clients'] }],
  herald: [
    { key: 'about', label: 'About the newsroom', sections: ['header', 'herald-standards', 'herald-newsroom', 'herald-columnists', 'herald-partners'] },
    { key: 'election', label: 'Election hub', sections: ['herald-election', 'herald-explainers', 'herald-video'] },
    { key: 'subscribe', label: 'Subscribe page', sections: ['header', 'herald-subscribe-plans', 'herald-standards'] },
    { key: 'careers', label: 'Careers', sections: ['header', 'herald-newsroom', 'herald-careers'] },
  ],
  'herald-luxe': [{ key: 'weekend', label: 'Weekend edition', sections: ['header', 'herald-luxe-weekend', 'herald-luxe-archive', 'herald-luxe-editors', 'herald-luxe-standards'] }],
  vidora: [
    { key: 'creators', label: 'Creator program', sections: ['header', 'vidora-creator-program', 'vidora-studio', 'vidora-creators'] },
    { key: 'premium', label: 'Premium', sections: ['vidora-trailer', 'vidora-premium', 'vidora-collections'] },
    { key: 'premiere', label: 'Premiere event', sections: ['vidora-live', 'vidora-premiere', 'vidora-collections'] },
  ],
  'vidora-luxe': [{ key: 'festival', label: 'Film festival', sections: ['vidora-luxe-festival', 'vidora-luxe-signature', 'vidora-luxe-reels', 'vidora-luxe-filmmakers'] }],
  marquee: [
    { key: 'title', label: 'Title page', sections: ['marquee-trailer', 'marquee-cast', 'marquee-collections'], style: DARK },
    { key: 'plans', label: 'Plans & sign-up', sections: ['marquee-how', 'marquee-plans', 'marquee-devices'], style: DARK },
    { key: 'coming', label: 'Coming soon', sections: ['marquee-coming-soon', 'marquee-trailer', 'marquee-collections'], style: DARK },
  ],
  'marquee-luxe': [{ key: 'members', label: 'Membership', sections: ['marquee-luxe-premiere', 'marquee-luxe-membership', 'marquee-luxe-screening', 'marquee-luxe-ensemble'] }],
  waveform: [
    { key: 'about', label: 'About the show', sections: ['header', 'waveform-hosts', 'waveform-latest', 'waveform-listen'] },
    { key: 'advertise', label: 'Advertise', sections: ['header', 'waveform-studio', 'waveform-sponsor'] },
    { key: 'guest', label: 'Be a guest', sections: ['header', 'waveform-guest', 'waveform-guests'] },
    { key: 'live', label: 'Live show', sections: ['waveform-live', 'waveform-hosts', 'waveform-studio'] },
  ],
  'waveform-luxe': [{ key: 'salon', label: 'The salon', sections: ['header', 'waveform-luxe-salon', 'waveform-luxe-hosts', 'waveform-luxe-evening', 'waveform-luxe-patrons'] }],
  folio: [
    { key: 'services', label: 'Services', sections: ['header', 'folio-services', 'folio-process', 'folio-engagement'] },
    { key: 'work', label: 'Case studies', sections: ['header', 'folio-cases', 'folio-modernise', 'folio-walkthrough'] },
    { key: 'hire', label: 'Hire me', sections: ['header', 'folio-why', 'folio-stack', 'folio-engagement'] },
  ],
  'folio-luxe': [{ key: 'works', label: 'Works', sections: ['header', 'folio-luxe-works', 'folio-luxe-approach', 'folio-luxe-engagements', 'folio-luxe-stack'] }],
  saffron: [
    { key: 'story', label: 'Our story', sections: ['header', 'saffron-farm', 'saffron-kitchen', 'saffron-press'] },
    { key: 'events', label: 'Events & catering', sections: ['saffron-wine-dinner', 'saffron-catering', 'saffron-tour'] },
    { key: 'careers', label: 'Careers', sections: ['header', 'saffron-kitchen', 'saffron-careers'] },
  ],
  pulse: [
    { key: 'product', label: 'Product', sections: ['header', 'pulse-tabs', 'pulse-demo', 'pulse-onboarding', 'pulse-logos'] },
    { key: 'compare', label: 'Compare', sections: ['header', 'pulse-compare', 'pulse-logos'] },
    { key: 'company', label: 'Company', sections: ['header', 'pulse-team', 'pulse-careers'] },
  ],
  lens: [
    { key: 'weddings', label: 'Weddings', sections: ['header', 'lens-stories', 'lens-session', 'lens-packages'] },
    { key: 'about', label: 'About the studio', sections: ['header', 'lens-specialities', 'lens-retouch', 'lens-studio', 'lens-showreel'] },
  ],
  ...BUSINESS_PAGE_DESIGNS,
};

// Sections for the active theme: its own first, then (for Luxe versions) the classic family's.
export function sectionsFor(theme) {
  if (!theme) return [];
  const groups = [];
  if (THEME_SECTIONS[theme.id]) groups.push({ label: theme.name, items: THEME_SECTIONS[theme.id] });
  if (theme.variantOf && THEME_SECTIONS[theme.variantOf]) groups.push({ label: `${theme.variantOf[0].toUpperCase()}${theme.variantOf.slice(1)} classic`, items: THEME_SECTIONS[theme.variantOf] });
  return groups;
}

export const allSections = () => Object.entries(THEME_SECTIONS).flatMap(([themeId, items]) => items.map((s) => ({ ...s, themeId })));
export const findSection = (key) => allSections().find((s) => s.key === key);

// Turn a section preset into real blocks (fresh ids, defaults merged in).
export function instantiateSection(section, style = {}) {
  return section.blocks.map((b) => ({
    id: uid(),
    type: b.type,
    data: { ...structuredClone(BLOCKS[b.type].defaults), ...structuredClone(b.data) },
    style: { ...DEFAULT_STYLE, ...style, ...b.style },
  }));
}

// First image in a section — used as its thumbnail in the builder.
export function sectionThumb(section) {
  const find = (v) => {
    if (!v) return null;
    if (typeof v === 'string') return /^https?:\/\/.+\.(jpe?g|png|webp)|images\.unsplash|picsum|pravatar|ytimg/.test(v) ? v : null;
    if (Array.isArray(v)) { for (const x of v) { const r = find(x); if (r) return r; } return null; }
    if (typeof v === 'object') { for (const k of ['poster', 'image', 'after', 'items', 'tabs', 'members']) { const r = find(v[k]); if (r) return r; } }
    return null;
  };
  for (const b of section.blocks) { const r = find(b.data); if (r) return r; }
  return null;
}
