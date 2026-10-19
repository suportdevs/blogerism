// Homepage demos for Vidora. The first ten share Vidora's videos & playlists; "Porda" (a Bengali OTT service)
// also ships its own Bengali demo content, installed when you activate it with "Install demo content".
// Categories: animation, short-films, clips. Playlists: blender-studio-classics, caminandes-collection, spies-heroes-caffeine.
const { B: block, m, un, face, demoVariant, FILMS, MDN_VIDEO, hoursAgo, rand, seedFaqs } = require('./helpers');
const vidora = require('./vidora');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };
const W = { width: 'wide' };
const yt = (k) => `https://www.youtube.com/watch?v=${FILMS[k][0]}`;
// Sintel has no maxres thumbnail on YouTube.
const thumb = (k) => `https://i.ytimg.com/vi/${FILMS[k][0]}/${k === 'sintel' ? 'hqdefault' : 'maxresdefault'}.jpg`;
const demo = (def) => demoVariant(vidora, { source: 'vidora-demos.js', blocks: ['Video', 'Luxury', 'Showcase'], ...def });

const IMG = { camera: '1516035069371-29a1b244cc32', clapper: '1485846234645-a62644f84728', projector: '1478720568477-152d9b164e26', reels: '1440404653325-ab127d49abc1', seats: '1489599849927-2ee91cede3ba', cinema: '1536440136628-849c177e76a1', laptop: '1498050108023-c5249f4df085', code: '1587620962725-abab7fe55159', stage: '1514525253161-7a46d19cd819', mic: '1590602847861-f357a9332bbc', designer: '1542744094-3a31f272c490' };

/* 1 ─ Creator Hub */
const creators = demo({
  id: 'vidora-creators', name: 'Creator Hub',
  description: 'A platform for creators: floating header, collage hero, recommended grid, upload steps, featured creators and creator plans.',
  layout: { header: 'floating' },
  appearance: { primaryColor: '#f43f5e', accentColor: '#8b5cf6', backgroundColor: '#fffbfc', surfaceColor: '#fdf0f3', textColor: '#1a0d12', darkBackgroundColor: '#0d0609', darkSurfaceColor: '#1a0f13', darkTextColor: '#f7e9ee', headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter', radius: 20, colorMode: 'light', footerStyle: 'big', headerCta: { enabled: true, label: 'Start creating', url: '/contact' } },
  home: () => [
    B('splitHero', { variant: 'collage', eyebrow: 'For creators', title: 'Share your films with', highlight: 'people who care', subtitle: 'Upload in minutes, grow an audience that actually watches, and get paid for the work you love.', bullets: ['4K streaming', 'Playlists & series', 'Fair revenue share', 'No ad clutter'], primaryLabel: 'Start creating', primaryUrl: '/contact', secondaryLabel: 'Watch now', secondaryUrl: '#watch', image: thumb('bunny'), image2: thumb('coffee'), badges: [{ icon: 'Users', value: '2M+', label: 'Monthly viewers' }, { icon: 'Play', value: '40k', label: 'Creators' }], proof: 'Loved by independent filmmakers', avatars: [face('w1', 120), face('m2', 120), face('w3', 120), face('m6', 120)] }, { paddingY: 'xl', animate: false }),
    B('videoGrid', { title: 'Recommended for you', showChips: true, count: 8, sort: 'latest', columns: 4 }, { anchor: 'watch', ...W }),
    B('steps', { eyebrow: 'How it works', title: 'From idea to audience', variant: 'cards', items: [{ icon: 'Download', title: 'Upload', text: 'Drag in your file — we handle the encoding.' }, { icon: 'PenTool', title: 'Polish', text: 'Add chapters, captions and a custom thumbnail.' }, { icon: 'Send', title: 'Publish', text: 'Share to playlists, embed anywhere.' }, { icon: 'Wallet', title: 'Earn', text: 'Get paid monthly from views and memberships.' }] }, { background: 'surface', paddingY: 'xl' }),
    B('team', { eyebrow: 'Featured creators', title: 'Meet the people behind the films', variant: 'cards', columns: 4, members: [
      { name: 'Lina Park', role: 'Animator', image: face('w4'), bio: 'Hand-drawn shorts with 400k subscribers.', linkedin: '', twitter: '#', email: '' },
      { name: 'Marco Bell', role: 'Documentary maker', image: face('m3'), bio: 'Stories from the edges of the map.', linkedin: '', twitter: '#', email: '' },
      { name: 'Aisha Noor', role: 'Music videos', image: face('w2'), bio: 'Colour, rhythm and movement.', linkedin: '', twitter: '#', email: '' },
      { name: 'Tom Reyes', role: 'Short films', image: face('m6'), bio: 'Comedy in under ten minutes.', linkedin: '', twitter: '#', email: '' },
    ] }, { paddingY: 'xl' }),
    B('pricingToggle', { eyebrow: 'Creator plans', title: 'Grow at your own pace', subtitle: 'Start free. Upgrade when your audience does.', currency: '$', yearlyNote: '-20%', plans: [
      { name: 'Free', description: 'For getting started', monthly: '0', yearly: '0', features: ['10 uploads / month', '1080p streaming', 'Basic analytics'], buttonLabel: 'Start free', buttonUrl: '/contact', highlighted: false },
      { name: 'Pro', description: 'For growing channels', monthly: '12', yearly: '9', features: ['Unlimited uploads', '4K streaming', 'Memberships', 'Advanced analytics'], buttonLabel: 'Go Pro', buttonUrl: '/contact', highlighted: true },
      { name: 'Studio', description: 'For teams & studios', monthly: '39', yearly: '31', features: ['Everything in Pro', '5 team seats', 'Custom player branding', 'Priority support'], buttonLabel: 'Contact us', buttonUrl: '/contact', highlighted: false },
    ] }, { background: 'surface', paddingY: 'xl' }),
  ],
});

/* 2 ─ Toons: animation for families */
const toons = demo({
  id: 'vidora-toons', name: 'Toons',
  description: 'A bright animation channel for families: glass header, playful slideshow, playlist carousel, animation grid and safety badges.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#f97316', accentColor: '#0ea5e9', backgroundColor: '#fffaf0', surfaceColor: '#fff1db', textColor: '#1f160c', darkBackgroundColor: '#140e06', darkSurfaceColor: '#21170b', darkTextColor: '#fbeedd', headingFont: 'Bricolage Grotesque', bodyFont: 'Nunito', radius: 26, colorMode: 'light', headerStyle: 'glass', footerStyle: 'columns' },
  home: () => [
    B('heroSlideshow', { height: 'tall', align: 'left', interval: 5, slides: [
      { image: thumb('bunny'), eyebrow: 'Now streaming', title: 'Big Buck Bunny', subtitle: 'The gentle giant who finally has enough.', buttonLabel: 'Watch now', buttonUrl: '/category/animation' },
      { image: thumb('llama3'), eyebrow: 'Caminandes', title: 'One llama. Endless trouble.', subtitle: 'The funniest llama in Patagonia is back.', buttonLabel: 'Watch the series', buttonUrl: '/playlists' },
      { image: thumb('coffee'), eyebrow: 'New', title: 'Coffee Run', subtitle: 'A short, sweet, caffeinated adventure.', buttonLabel: 'Watch', buttonUrl: '/category/animation' },
    ] }, HERO),
    B('trustBar', { variant: 'pills', items: [{ icon: 'ShieldCheck', title: 'Kid-safe' }, { icon: 'Smile', title: 'No scary ads' }, { icon: 'Heart', title: 'Parent approved' }, { icon: 'Download', title: 'Watch offline' }] }, { paddingY: 'md' }),
    B('cardCarousel', { eyebrow: 'Collections', title: 'Pick a playlist', subtitle: '', cardStyle: 'overlay', size: 'md', items: [['llama2', 'Series', 'Caminandes collection', '/playlists'], ['bunny', 'Classics', 'Blender Studio classics', '/playlists'], ['agent', 'Action', 'Spies, heroes & caffeine', '/playlists'], ['sprite', 'Adventure', 'Sprite Fright', '/category/animation'], ['spring', 'Fantasy', 'Spring', '/category/animation']].map(([k, tag, title, url]) => ({ image: thumb(k), tag, title, text: 'Tap to watch', url })) }, { paddingY: 'lg', ...W }),
    B('videoGrid', { title: 'Animation', showChips: false, category: 'animation', count: 8, sort: 'popular', columns: 4 }, W),
    B('mediaRail', { title: 'Playlists', source: 'series', seriesType: 'PLAYLIST', count: 10, cardStyle: 'square', linkLabel: 'All playlists', linkUrl: '/playlists' }, { background: 'surface', ...W }),
    B('newsletter', { title: 'New cartoons every Friday', text: 'A weekly email for grown-ups with what’s new for the little ones.' }, { paddingY: 'lg' }),
  ],
});

/* 3 ─ Festival: short film festival */
const festival = demo({
  id: 'vidora-festival', name: 'Festival',
  description: 'A short-film festival site: transparent header over a video hero, opening countdown, featured screening, programme schedule and submissions.',
  layout: { header: 'overlay' },
  appearance: { primaryColor: '#c9a227', accentColor: '#7f1d1d', backgroundColor: '#f8f5ee', surfaceColor: '#eee8da', textColor: '#17140d', darkBackgroundColor: '#0b0a07', darkSurfaceColor: '#16140e', darkTextColor: '#f1ead9', headingFont: 'Bodoni Moda', bodyFont: 'Jost', radius: 2, colorMode: 'dark', footerStyle: 'luxe', headerCta: { enabled: true, label: 'Tickets', url: '/contact' } },
  home: () => [
    B('luxeHero', { image: thumb('sintel'), video: `${MDN_VIDEO}/flower.mp4`, overline: 'International short film festival · 12th edition', title: 'Ten days of', italic: 'cinema', subtitle: '86 films. 24 countries. One unforgettable week of independent storytelling.', buttonLabel: 'See the programme', buttonUrl: '#programme', height: 'full', align: 'center', overlay: 50 }, HERO),
    B('countdown', { eyebrow: 'Opening night', title: 'The festival opens in', text: 'Red carpet, premiere screening and the opening party.', date: '2027-04-17T19:00', variant: 'image', image: un(IMG.seats, 2000), expiredText: 'The festival is on!', buttonLabel: 'Book tickets', buttonUrl: '/contact' }, { paddingY: 'xl', ...W }),
    B('videoFeature', { title: 'Opening film', category: 'short-films', series: '', format: 'VIDEO', sort: 'popular', count: 5 }, W),
    B('schedule', { eyebrow: 'Programme', title: 'Screenings', subtitle: '', buttonLabel: 'Tickets', buttonUrl: '/contact', hostIcon: 'MapPin', locationIcon: 'Clock', days: [
      { label: 'Day 1', sessions: [{ time: '18:00', title: 'Opening gala: Spring', host: 'Grand Cinema', location: '8 min + Q&A', tag: 'Premiere' }, { time: '20:30', title: 'Shorts programme A', host: 'Studio 2', location: '90 min', tag: '' }] },
      { label: 'Day 2', sessions: [{ time: '14:00', title: 'Animation showcase', host: 'Grand Cinema', location: '75 min', tag: 'Family' }, { time: '19:00', title: 'Director in conversation', host: 'Main Hall', location: '60 min', tag: 'Talk' }] },
      { label: 'Day 3', sessions: [{ time: '16:00', title: 'Sci-fi night: Tears of Steel', host: 'Studio 1', location: '12 min + panel', tag: '' }, { time: '21:00', title: 'Awards ceremony', host: 'Grand Cinema', location: '2 hrs', tag: 'Closing' }] },
    ] }, { background: 'surface', paddingY: 'xl', anchor: 'programme' }),
    B('luxeList', { overline: 'In competition', title: 'Official selection', source: 'posts', format: 'VIDEO', category: '', series: '', seriesType: '', sort: 'latest', count: 8, linkLabel: 'All films', linkUrl: '/trending' }, { paddingY: 'xl', ...W }),
    B('ctaBanner', { variant: 'image', image: un(IMG.clapper, 1800), eyebrow: 'Submissions', title: 'Made a short film? Send it to us', text: 'Submissions for next year open in June. Films under 20 minutes, any genre.', primaryLabel: 'Submit a film', primaryUrl: '/contact', phone: '' }, { paddingY: 'lg', ...W }),
  ],
});

/* 4 ─ Academy: learn by watching */
const academy = demo({
  id: 'vidora-academy', name: 'Academy',
  description: 'A video learning platform: solid header, framed hero, auto-playing feature tabs, lesson grid, free-vs-pro comparison and FAQ.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#2563eb', accentColor: '#f59e0b', backgroundColor: '#ffffff', surfaceColor: '#f3f6fd', textColor: '#0b1328', darkBackgroundColor: '#070c1a', darkSurfaceColor: '#0f172b', darkTextColor: '#e5ebf8', headingFont: 'Plus Jakarta Sans', bodyFont: 'Inter', radius: 14, colorMode: 'light', headerStyle: 'solid', footerStyle: 'columns', headerCta: { enabled: true, label: 'Start learning', url: '/contact' } },
  home: () => [
    B('splitHero', { variant: 'framed', eyebrow: 'Video courses', title: 'Learn anything by', highlight: 'watching experts', subtitle: 'Bite-sized video lessons on animation, filmmaking and design — at your pace.', bullets: ['Short lessons', 'Downloadable projects', 'Certificates', 'Offline viewing'], primaryLabel: 'Browse lessons', primaryUrl: '#lessons', secondaryLabel: 'See plans', secondaryUrl: '#plans', image: un(IMG.laptop, 1200), image2: '', badges: [{ icon: 'Play', value: '1,200+', label: 'Video lessons' }, { icon: 'Star', value: '4.9', label: 'Average rating' }], proof: '', avatars: [] }, { background: 'surface', paddingY: 'xl', animate: false }),
    B('featureTabs', { eyebrow: 'Why Academy', title: 'Built for learning, not scrolling', subtitle: '', variant: 'side', autoplay: true, tabs: [
      { icon: 'Video', label: 'Watch', title: 'Short, focused lessons', text: 'Every lesson teaches one thing well — in under ten minutes.', bullets: ['Chapters & transcripts', 'Speed controls'], image: thumb('spring'), buttonLabel: '', buttonUrl: '' },
      { icon: 'PenTool', label: 'Practise', title: 'Learn by doing', text: 'Download project files and follow along.', bullets: ['Project files', 'Quizzes'], image: thumb('charge'), buttonLabel: '', buttonUrl: '' },
      { icon: 'Award', label: 'Prove it', title: 'Earn certificates', text: 'Share verified certificates on your profile and CV.', bullets: ['Verified certificates', 'Skill badges'], image: thumb('hero'), buttonLabel: '', buttonUrl: '' },
    ] }, { paddingY: 'xl' }),
    B('videoGrid', { title: 'Popular lessons', showChips: true, count: 8, sort: 'popular', columns: 4 }, { anchor: 'lessons', ...W }),
    B('comparison', { eyebrow: 'Plans', title: 'Free to start, Pro to master', columns: ['Free', 'Pro'], highlight: 2, highlightLabel: 'Most popular', groups: false, rows: [
      { group: '', feature: 'Video lessons', values: ['100+', '1,200+'] }, { group: '', feature: 'Project files', values: ['no', 'yes'] }, { group: '', feature: 'Certificates', values: ['no', 'yes'] }, { group: '', feature: 'Offline viewing', values: ['no', 'yes'] }, { group: '', feature: 'Price', values: ['$0', '$15 / month'] },
    ], buttons: [{ label: 'Start free', url: '/contact' }, { label: 'Go Pro', url: '/contact' }] }, { background: 'surface', paddingY: 'xl', anchor: 'plans' }),
    B('faq', { eyebrow: 'FAQ', title: 'Questions, answered' }, { paddingY: 'xl' }),
  ],
});

/* 5 ─ Neon: music & nightlife video */
const neon = demo({
  id: 'vidora-neon', name: 'Neon',
  description: 'A neon after-dark channel: cinematic streaming header, full-screen slideshow, Top 10 ranking, giant word marquee and trending grid.',
  layout: { header: 'streaming' },
  appearance: { primaryColor: '#d946ef', accentColor: '#22d3ee', backgroundColor: '#ffffff', surfaceColor: '#faf5ff', textColor: '#18111f', darkBackgroundColor: '#07040d', darkSurfaceColor: '#130b1e', darkTextColor: '#f3e8ff', headingFont: 'Unbounded', bodyFont: 'Inter', radius: 18, colorMode: 'dark', footerStyle: 'simple' },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'left', interval: 6, slides: [
      { image: thumb('agent'), eyebrow: 'Trending #1', title: 'Agent 327', subtitle: 'Operation Barbershop — the spy caper everyone is watching.', buttonLabel: 'Play', buttonUrl: '/trending' },
      { image: thumb('sprite'), eyebrow: 'After dark', title: 'Sprite Fright', subtitle: 'A forest walk goes very, very wrong.', buttonLabel: 'Play', buttonUrl: '/trending' },
      { image: thumb('steel'), eyebrow: 'Sci-fi', title: 'Tears of Steel', subtitle: 'Robots, romance and Amsterdam.', buttonLabel: 'Play', buttonUrl: '/trending' },
    ] }, HERO),
    B('top10', { title: 'Top 10 this week', source: 'posts', format: 'VIDEO', seriesType: '' }, { paddingY: 'lg', ...W }),
    B('textMarquee', { items: ['Watch', 'Vibe', 'Replay', 'Share'], speed: 28, twoRows: true }, { background: 'dark', paddingY: 'md', width: 'full', animate: false }),
    B('mediaRail', { title: 'Fresh drops', source: 'posts', format: 'VIDEO', sort: 'latest', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', ...W }),
    B('videoGrid', { title: 'Most liked', showChips: false, count: 8, sort: 'liked', columns: 4 }, { paddingY: 'md', ...W }),
  ],
});

/* 6 ─ Newsroom: video news */
const newsroom = demo({
  id: 'vidora-news', name: 'Newsroom',
  description: 'A video-first news channel: newspaper masthead, breaking ticker, mosaic of video headlines, ranked feed and video rows.',
  layout: { header: 'masthead' },
  appearance: { primaryColor: '#dc2626', accentColor: '#1d4ed8', backgroundColor: '#ffffff', surfaceColor: '#f4f4f5', textColor: '#111111', darkBackgroundColor: '#0e0e10', darkSurfaceColor: '#18181b', darkTextColor: '#ededed', headingFont: 'Red Hat Display', bodyFont: 'Inter', radius: 4, colorMode: 'light', footerStyle: 'columns' },
  home: () => [
    B('breakingNews', { label: 'Now playing', count: 8, breakingOnly: false, format: 'VIDEO', speed: 45 }, { paddingY: 'none', width: 'full', animate: false }),
    B('newsHero', { layout: 'mosaic', category: '', format: 'VIDEO', count: 5, sort: 'popular' }, { paddingY: 'md', ...W }),
    B('latestWithSidebar', { title: 'Latest videos', sidebarTitle: 'Most watched', format: 'VIDEO', count: 6, sidebarCount: 5 }, W),
    B('mediaRail', { title: 'Playlists', source: 'series', seriesType: 'PLAYLIST', count: 10, cardStyle: 'landscape', linkLabel: 'All playlists', linkUrl: '/playlists' }, { background: 'surface', ...W }),
    B('newsSection', { title: 'Animation', category: 'animation', format: 'VIDEO', layout: 'overlay', count: 4, linkLabel: 'More animation' }, W),
    B('newsletter', { title: 'The video briefing', text: 'The day’s most-watched stories, every evening.' }, { background: 'surface', paddingY: 'lg' }),
  ],
});

/* 7 ─ Gallery: minimal curated wall */
const gallery = demo({
  id: 'vidora-gallery', name: 'Gallery',
  description: 'A minimal, gallery-like collection: transparent minimal header, full-screen stills, filterable film wall, cursor-preview list and a trailer.',
  layout: { header: 'minimal' },
  appearance: { primaryColor: '#111111', accentColor: '#ef4444', backgroundColor: '#ffffff', surfaceColor: '#f4f4f4', textColor: '#0a0a0a', darkBackgroundColor: '#0a0a0a', darkSurfaceColor: '#151515', darkTextColor: '#f2f2f2', headingFont: 'Syne', bodyFont: 'Inter', radius: 0, colorMode: 'light', footerStyle: 'simple' },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'left', interval: 7, slides: [
      { image: thumb('cosmos'), eyebrow: 'Collection', title: 'Cosmos Laundromat', subtitle: 'A suicidal sheep. A mysterious salesman. Infinite lives.', buttonLabel: 'View', buttonUrl: '/trending' },
      { image: thumb('spring'), eyebrow: 'Collection', title: 'Spring', subtitle: 'A shepherd girl and her dog face ancient spirits.', buttonLabel: 'View', buttonUrl: '/trending' },
    ] }, HERO),
    B('masonryGallery', { eyebrow: 'The wall', title: 'Every frame tells a story', subtitle: '', columns: 3, filters: true, items: [['bunny', 'Comedy'], ['sintel', 'Fantasy'], ['steel', 'Sci-fi'], ['cosmos', 'Fantasy'], ['agent', 'Comedy'], ['sprite', 'Horror'], ['charge', 'Sci-fi'], ['hero', 'Action'], ['spring', 'Fantasy']].map(([k, category]) => ({ src: thumb(k), title: FILMS[k][1], category, caption: '' })) }, { paddingY: 'xl', ...W }),
    B('luxeList', { overline: 'Index', title: 'All films', source: 'posts', format: 'VIDEO', category: '', series: '', seriesType: '', sort: 'latest', count: 10, linkLabel: 'Browse', linkUrl: '/trending' }, { background: 'surface', paddingY: 'xl', ...W }),
    B('videoLightbox', { eyebrow: 'Trailer', title: 'Elephants Dream', text: 'The first open movie, restored.', poster: thumb('elephants'), videoUrl: yt('elephants'), layout: 'full', duration: '10:54', stats: [] }, { paddingY: 'xl', ...W }),
  ],
});

/* 8 ─ Shorts: snackable clips */
const shorts = demo({
  id: 'vidora-shorts', name: 'Shorts',
  description: 'A snackable shorts app: bold athletic header, kinetic hero, poster-format clip rail, bento features and an app download banner.',
  layout: { header: 'bold' },
  appearance: { primaryColor: '#ff2d55', accentColor: '#00e5ff', backgroundColor: '#fafafa', surfaceColor: '#f0f0f2', textColor: '#0a0a0c', darkBackgroundColor: '#050507', darkSurfaceColor: '#111115', darkTextColor: '#f1f1f4', headingFont: 'Archivo', bodyFont: 'Inter', radius: 22, colorMode: 'dark', footerStyle: 'big', headerCta: { enabled: true, label: 'Get the app', url: '/contact' } },
  home: () => [
    B('kineticHero', { eyebrow: 'Vidora Shorts', lines: ['Watch.', 'Scroll.'], rotate: ['Repeat.', 'Laugh.', 'Share.'], subtitle: 'Bite-sized clips from the best creators — vertical, fast and endlessly fun.', primaryLabel: 'Start watching', primaryUrl: '#clips', secondaryLabel: 'Get the app', secondaryUrl: '/contact', image: thumb('coffee'), badge: 'Swipe up ✦ Swipe up ✦ ', marquee: ['Comedy', 'Animation', 'Behind the scenes', 'Tutorials', 'Music'] }, { paddingY: 'xl', width: 'wide', animate: false }),
    B('mediaRail', { title: 'Clips', source: 'posts', format: 'VIDEO', category: 'clips', sort: 'latest', count: 12, cardStyle: 'poster' }, { paddingY: 'md', anchor: 'clips', ...W }),
    B('bentoGrid', { eyebrow: 'Why Shorts', title: 'Made for your thumb', subtitle: '', items: [
      { icon: 'Zap', title: 'Instant play', text: 'No buffering, no waiting — clips start the moment you land.', size: 'lg', visual: 'metrics', image: '' },
      { icon: 'Heart', title: 'Made for you', text: 'A feed that learns what you love.', size: 'tall', visual: 'avatars', image: '' },
      { icon: 'Download', title: 'Save for later', text: 'Keep clips offline.', size: 'sm', visual: '', image: '' },
      { icon: 'Send', title: 'Share anywhere', text: 'One tap to any app.', size: 'wide', visual: '', image: '' },
    ] }, { paddingY: 'xl', ...W }),
    B('videoGrid', { title: 'Popular right now', showChips: false, count: 8, sort: 'popular', columns: 4 }, W),
    B('ctaBanner', { variant: 'split', image: thumb('hero'), eyebrow: 'Mobile app', title: 'Shorts are better on your phone', text: 'Free on iOS and Android.', primaryLabel: 'Download', primaryUrl: '/contact', phone: '' }, { paddingY: 'lg', ...W }),
  ],
});

/* 9 ─ Studio: production company channel */
const studio = demo({
  id: 'vidora-studio', name: 'Studio',
  description: 'An animation studio’s showcase: floating pill header, arch hero, stacking film case studies, film grid, partner logos and contact.',
  layout: { header: 'portfolio' },
  appearance: { primaryColor: '#7c3aed', accentColor: '#f472b6', backgroundColor: '#fbfaff', surfaceColor: '#f1effb', textColor: '#14102a', darkBackgroundColor: '#0a0816', darkSurfaceColor: '#141027', darkTextColor: '#ece8fa', headingFont: 'Outfit', bodyFont: 'Inter', radius: 20, colorMode: 'light', footerStyle: 'big', headerCta: { enabled: true, label: 'Work with us', url: '/contact' } },
  home: () => [
    B('splitHero', { variant: 'arch', eyebrow: 'Independent animation studio', title: 'We make films that', highlight: 'travel the world', subtitle: 'Original shorts, series and branded animation — made by a small team with big ideas.', bullets: [], primaryLabel: 'See our films', primaryUrl: '#films', secondaryLabel: 'Work with us', secondaryUrl: '/contact', image: thumb('spring'), image2: '', badges: [{ icon: 'Award', value: '27', label: 'Festival awards' }, { icon: 'Play', value: '90M', label: 'Views' }], proof: '', avatars: [] }, { paddingY: 'xl', animate: false }),
    B('caseStudies', { eyebrow: 'Selected films', title: 'Our work', variant: 'stack', items: [
      { image: thumb('cosmos'), client: 'Original short', title: 'Cosmos Laundromat', text: 'A pilot that became a festival favourite and an experiment in open production.', metrics: [{ value: '12', label: 'Awards' }, { value: '8M', label: 'Views' }], tags: ['Animation', 'Pilot'], url: '/trending' },
      { image: thumb('sprite'), client: 'Original short', title: 'Sprite Fright', text: 'An 80s-inspired horror comedy that proved small teams can make big films.', metrics: [{ value: '10.5M', label: 'Views' }, { value: '30', label: 'Crew' }], tags: ['Comedy', 'Horror'], url: '/trending' },
      { image: thumb('charge'), client: 'Original short', title: 'Charge', text: 'A cyberpunk action short built to test real-time rendering.', metrics: [{ value: '4K', label: 'Real-time' }, { value: '5M', label: 'Views' }], tags: ['Sci-fi'], url: '/trending' },
    ] }, { paddingY: 'xl', anchor: 'films', ...W }),
    B('videoGrid', { title: 'Watch the full catalogue', showChips: true, count: 8, sort: 'latest', columns: 4 }, { background: 'surface', ...W }),
    B('logoWall', { title: 'Our films have screened at', variant: 'grid', speed: 30, logos: ['Annecy Shorts', 'Northlight Fest', 'Pixel Week', 'Indie Frame', 'Open Screen', 'Motion Days'].map((name) => ({ name, image: '', url: '' })) }, { paddingY: 'lg' }),
    B('contactForm', { title: 'Have a story to tell?', text: 'We take on a handful of commissioned projects every year.', showInfo: true }, { background: 'surface', paddingY: 'xl' }),
  ],
});

/* 10 ─ Live: streams & premieres */
const live = demo({
  id: 'vidora-live', name: 'Live',
  description: 'A live-streaming channel: dark sidebar navigation, “now playing” spotlight, next-stream countdown, stream schedule and playlists.',
  layout: { header: 'sidebar' },
  appearance: { primaryColor: '#ef4444', accentColor: '#8b5cf6', backgroundColor: '#fafafa', surfaceColor: '#f2f2f4', textColor: '#101014', darkBackgroundColor: '#08080b', darkSurfaceColor: '#131318', darkTextColor: '#ededf2', headingFont: 'Sora', bodyFont: 'Inter', radius: 14, colorMode: 'dark', footerStyle: 'simple', headerCta: { enabled: true, label: 'Go live', url: '/contact' } },
  home: () => [
    B('episodeSpotlight', { eyebrow: 'Live now', title: '', format: 'VIDEO', series: '', category: '', sort: 'popular', count: 4, linkLabel: 'All streams', linkUrl: '/trending' }, { paddingY: 'lg', ...W }),
    B('countdown', { eyebrow: 'Next premiere', title: 'Watch party starts in', text: 'Join the chat and watch the premiere together.', date: '2027-02-20T20:00', variant: 'cards', image: '', expiredText: 'We are live!', buttonLabel: 'Remind me', buttonUrl: '/contact' }, { background: 'surface', paddingY: 'xl' }),
    B('schedule', { eyebrow: 'Schedule', title: 'Upcoming streams', subtitle: '', buttonLabel: 'Remind me', buttonUrl: '/contact', hostIcon: 'Mic', locationIcon: 'Clock', days: [
      { label: 'Today', sessions: [{ time: '18:00', title: 'Animators’ hangout', host: 'Lina Park', location: '90 min', tag: 'Live' }, { time: '21:00', title: 'Watch party: Sintel', host: 'Vidora team', location: '30 min', tag: 'Premiere' }] },
      { label: 'Tomorrow', sessions: [{ time: '17:00', title: 'Blender basics, live', host: 'Marco Bell', location: '60 min', tag: 'Tutorial' }] },
    ] }, { paddingY: 'xl' }),
    B('videoGrid', { title: 'Past streams', showChips: false, count: 8, sort: 'latest', columns: 4 }, W),
    B('seriesGrid', { title: 'Playlists', seriesType: 'PLAYLIST', count: 6, cardStyle: 'landscape' }, { background: 'surface', ...W }),
  ],
});

/* 11 ─ Porda: a Bengali OTT service (original brand, in the style of Bengali streaming apps) */
// Bengali titles for the Creative Commons Blender films used as placeholder content.
const BN = {
  sintel: ['সিন্টেল', 'হারানো ড্রাগনের খোঁজে এক একাকী মেয়ের মহাকাব্যিক যাত্রা।'],
  bunny: ['বিগ বাক বানি', 'শান্ত এক বিশাল খরগোশ আর তিন দুষ্টু বন্ধুর মজার গল্প।'],
  steel: ['টিয়ার্স অফ স্টিল', 'রোবট, প্রেম আর ভবিষ্যতের আমস্টারডাম।'],
  cosmos: ['কসমস লন্ড্রোম্যাট', 'এক ভেড়া, এক রহস্যময় বিক্রেতা আর অসংখ্য জীবন।'],
  spring: ['স্প্রিং', 'প্রাচীন আত্মাদের মুখোমুখি এক রাখাল মেয়ে আর তার কুকুর।'],
  sprite: ['স্প্রাইট ফ্রাইট', 'জঙ্গলে বেড়াতে গিয়ে ভয়ংকর আর হাসির কাণ্ড।'],
  charge: ['চার্জ', 'সাইবারপাঙ্ক শহরে শ্বাসরুদ্ধকর অ্যাকশন।'],
  agent: ['এজেন্ট ৩২৭', 'নাপিতের দোকানে এক গোপন এজেন্টের অভিযান।'],
  hero: ['হিরো', 'রঙ-তুলিতে আঁকা এক সাহসী লড়াই।'],
  coffee: ['কফি রান', 'এক কাপ কফির জন্য দুর্দান্ত দৌড়।'],
  elephants: ['এলিফ্যান্টস ড্রিম', 'এক অদ্ভুত যন্ত্রের দুনিয়ায় দুই অভিযাত্রী।'],
  llama2: ['কামিনান্ডেস: গ্রান ডিলামা', 'বেড়ার ওপারে যেতে চায় এক জেদি লামা।'],
  llama3: ['কামিনান্ডেস: লামিগোস', 'লামা আর পেঙ্গুইনের খাবার নিয়ে লড়াই।'],
};
const BN_DIGITS = '০১২৩৪৫৬৭৮৯';
const PORDA_SERIES = [
  { slug: 'rohosyer-khoje', title: 'রহস্যের খোঁজে', tagline: 'প্রতিটি এপিসোডে নতুন রহস্য।', genres: ['থ্রিলার', 'অ্যাকশন'], films: ['agent', 'charge', 'hero'], cat: 'thriller', featured: true },
  { slug: 'tarar-pothe', title: 'তারার পথে', tagline: 'ভবিষ্যতের গল্প, আজই।', genres: ['সাই-ফাই'], films: ['steel', 'cosmos', 'sintel'], cat: 'thriller' },
  { slug: 'shopner-deshe', title: 'স্বপ্নের দেশে', tagline: 'পরিবারের সবার জন্য রূপকথা।', genres: ['পরিবার', 'ফ্যান্টাসি'], films: ['bunny', 'spring', 'elephants'], cat: 'family' },
  { slug: 'hasir-haat', title: 'হাসির হাট', tagline: 'হাসতে হাসতে পেট ব্যথা!', genres: ['কমেডি'], films: ['llama2', 'llama3', 'coffee', 'sprite'], cat: 'comedy' },
];

async function pordaDemo(prisma, { authors }) {
  const cats = {};
  for (const [order, [key, name, color]] of [['thriller', 'থ্রিলার', '#ef4444'], ['comedy', 'কমেডি', '#f59e0b'], ['family', 'পরিবার', '#10b981'], ['animation', 'অ্যানিমেশন', '#8b5cf6']].entries()) {
    cats[key] = await prisma.category.create({ data: { name, slug: key, color, order, description: `${name} — সেরা সব ভিডিও।` } });
  }
  let n = 0;
  for (const [order, s] of PORDA_SERIES.entries()) {
    const series = await prisma.series.create({ data: { title: s.title, slug: s.slug, type: 'PLAYLIST', tagline: s.tagline, genres: s.genres, featured: !!s.featured, poster: thumb(s.films[0]), backdrop: thumb(s.films[0]), year: 2026, maturity: '13+', order } });
    for (const [i, key] of s.films.entries()) {
      n += 1;
      const [title, excerpt] = BN[key];
      await prisma.post.create({
        data: {
          title: `${s.title} — পর্ব ${BN_DIGITS[i + 1]}: ${title}`, slug: `${s.slug}-ep-${i + 1}`, format: 'VIDEO', videoUrl: yt(key), coverImage: thumb(key), duration: FILMS[key][2],
          status: 'PUBLISHED', publishedAt: hoursAgo(n * 7), excerpt, content: `<p><strong>${title}</strong> — ${excerpt}</p><p>Blender Studio-র ওপেন মুভি, Creative Commons লাইসেন্সে প্রকাশিত।</p>`,
          views: rand(8000, 400000), likes: rand(300, 20000), featured: n === 1, seriesId: series.id, season: 1, episode: i + 1,
          authorId: authors[n % authors.length].id, categories: { connect: [{ id: cats[s.cat].id }, { id: cats.animation.id }] },
        },
      });
    }
  }
  await seedFaqs(prisma, [
    ['পর্দা কী?', 'পর্দা একটি বাংলা স্ট্রিমিং প্ল্যাটফর্ম — সিনেমা, অরিজিনাল সিরিজ আর শর্ট ফিল্ম, যেকোনো ডিভাইসে।'],
    ['সাবস্ক্রিপশনের দাম কত?', 'মোবাইল প্ল্যান মাসে ৳৯৯ থেকে শুরু। বার্ষিক প্ল্যানে বড় ছাড় পাবেন।'],
    ['কীভাবে পেমেন্ট করব?', 'বিকাশ, নগদ, কার্ড বা মোবাইল ব্যালেন্স দিয়ে পেমেন্ট করতে পারবেন।'],
    ['অফলাইনে দেখা যাবে?', 'হ্যাঁ, অ্যাপে এপিসোড ডাউনলোড করে ইন্টারনেট ছাড়াই দেখতে পারবেন।'],
    ['কতগুলো ডিভাইসে দেখা যাবে?', 'প্রিমিয়াম প্ল্যানে একসাথে ৪টি স্ক্রিনে দেখা যায়।'],
  ]);
}

const porda = {
  ...demo({
    id: 'vidora-porda', name: 'Porda',
    description: 'A Bengali OTT streaming service with its own Bengali demo content: dark cinematic header, full-screen slideshow, Top 10, original series and new-release rows, genre carousel, ৳ plans and a Bengali FAQ.',
    layout: { header: 'streaming' },
    appearance: { primaryColor: '#e11d48', accentColor: '#fbbf24', backgroundColor: '#ffffff', surfaceColor: '#f4f4f5', textColor: '#0f0f10', darkBackgroundColor: '#0b0b0d', darkSurfaceColor: '#17171b', darkTextColor: '#f4f4f5', headingFont: 'Noto Sans Bengali', bodyFont: 'Hind Siliguri', radius: 10, colorMode: 'dark', footerStyle: 'simple', containerWidth: 1600, headerCta: { enabled: true, label: 'সাবস্ক্রাইব', url: '/#plans' } },
    menus: {
      header: { name: 'ব্রাউজ', items: [m('হোম', '/'), m('সিনেমা', '/trending'), m('সিরিজ', '/playlists'), m('থ্রিলার', '/category/thriller'), m('কমেডি', '/category/comedy'), m('প্ল্যান', '/#plans')] },
      footer: { name: 'পর্দা', items: [m('আমাদের সম্পর্কে', '/about'), m('যোগাযোগ', '/contact'), m('সাধারণ প্রশ্ন', '/faq'), m('গোপনীয়তা', '/privacy-policy')] },
    },
    seoTitle: 'পর্দা — বাংলা সিনেমা ও অরিজিনাল সিরিজ',
    home: () => [
      B('heroSlideshow', { height: 'full', align: 'left', interval: 6, slides: [
        { image: thumb('agent'), eyebrow: 'পর্দা অরিজিনাল · থ্রিলার', title: 'রহস্যের খোঁজে', subtitle: 'প্রতিটি এপিসোডে নতুন রহস্য। নতুন সিজন এখন স্ট্রিমিং।', buttonLabel: 'এখনই দেখুন', buttonUrl: '/series/rohosyer-khoje' },
        { image: thumb('sintel'), eyebrow: 'নতুন রিলিজ', title: 'তারার পথে', subtitle: 'ভবিষ্যতের গল্প, আজই — শুধুমাত্র পর্দায়।', buttonLabel: 'ট্রেলার দেখুন', buttonUrl: '/series/tarar-pothe' },
        { image: thumb('bunny'), eyebrow: 'পরিবারের জন্য', title: 'স্বপ্নের দেশে', subtitle: 'ছোট-বড় সবার জন্য রূপকথার সিরিজ।', buttonLabel: 'এখনই দেখুন', buttonUrl: '/series/shopner-deshe' },
      ] }, HERO),
      B('top10', { title: 'আজকের সেরা ১০', source: 'posts', format: 'VIDEO', seriesType: '' }, { paddingY: 'md', ...W }),
      B('mediaRail', { title: 'পর্দা অরিজিনাল সিরিজ', source: 'series', seriesType: 'PLAYLIST', count: 10, cardStyle: 'poster', linkLabel: 'সব সিরিজ', linkUrl: '/playlists' }, { paddingY: 'sm', ...W }),
      B('mediaRail', { title: 'নতুন রিলিজ', source: 'posts', format: 'VIDEO', sort: 'latest', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', ...W }),
      B('cardCarousel', { eyebrow: 'জনরা', title: 'আজ কী দেখবেন?', subtitle: '', cardStyle: 'overlay', size: 'sm', items: [['charge', 'থ্রিলার', 'শ্বাসরুদ্ধকর', '/category/thriller'], ['llama3', 'কমেডি', 'হাসির রাজ্য', '/category/comedy'], ['spring', 'পরিবার', 'সবাই মিলে', '/category/family'], ['steel', 'সাই-ফাই', 'ভবিষ্যতের গল্প', '/category/thriller'], ['sprite', 'অ্যানিমেশন', 'রঙিন দুনিয়া', '/category/animation']].map(([k, tag, title, url]) => ({ image: thumb(k), tag, title, text: 'দেখুন', url })) }, { paddingY: 'lg', ...W }),
      B('mediaRail', { title: 'হাসির হাট — সব পর্ব', source: 'posts', format: 'VIDEO', series: 'hasir-haat', sort: 'episodes', count: 12, cardStyle: 'landscape', linkLabel: 'সিরিজ দেখুন', linkUrl: '/series/hasir-haat' }, { paddingY: 'sm', ...W }),
      B('mediaRail', { title: 'সবচেয়ে বেশি দেখা', source: 'posts', format: 'VIDEO', sort: 'popular', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', ...W }),
      B('videoLightbox', { eyebrow: 'ট্রেলার', title: 'তারার পথে — অফিসিয়াল ট্রেলার', text: 'রোবট, প্রেম আর ভবিষ্যতের শহর। নতুন সিরিজ, শুধুমাত্র পর্দায়।', poster: thumb('steel'), videoUrl: yt('steel'), layout: 'split', duration: '12:14', stats: [{ value: '4K', label: 'আল্ট্রা এইচডি' }, { value: '১৩+', label: 'বয়সসীমা' }] }, { background: 'surface', paddingY: 'xl', ...W }),
      B('trustBar', { variant: 'pills', items: [{ icon: 'Smartphone', title: 'মোবাইল ও টিভিতে' }, { icon: 'Download', title: 'অফলাইনে দেখুন' }, { icon: 'Smile', title: 'কোনো বিজ্ঞাপন নেই' }, { icon: 'Wallet', title: 'বিকাশ ও নগদে পেমেন্ট' }] }, { paddingY: 'md' }),
      B('pricingToggle', { eyebrow: 'প্ল্যান', title: 'আপনার প্ল্যান বেছে নিন', subtitle: 'যেকোনো সময় বাতিল করা যাবে। বার্ষিক প্ল্যানে বড় ছাড়।', currency: '৳', yearlyNote: '২ মাস ফ্রি', plans: [
        { name: 'মোবাইল', description: '১টি মোবাইল স্ক্রিন, HD', monthly: '99', yearly: '82', features: ['সব সিনেমা ও সিরিজ', 'HD কোয়ালিটি', 'ডাউনলোড সুবিধা'], buttonLabel: 'শুরু করুন', buttonUrl: '/contact', highlighted: false },
        { name: 'প্রিমিয়াম', description: '৪টি স্ক্রিন, 4K', monthly: '199', yearly: '166', features: ['মোবাইল প্ল্যানের সবকিছু', '4K + ডলবি সাউন্ড', 'টিভিতে দেখুন', 'একসাথে ৪টি স্ক্রিন'], buttonLabel: 'শুরু করুন', buttonUrl: '/contact', highlighted: true },
      ] }, { paddingY: 'xl', anchor: 'plans' }),
      B('faq', { eyebrow: 'সাহায্য', title: 'সাধারণ প্রশ্ন' }, { background: 'surface', paddingY: 'xl' }),
      B('ctaBanner', { variant: 'image', image: thumb('cosmos'), eyebrow: 'পর্দা অ্যাপ', title: 'যেখানে খুশি, যখন খুশি দেখুন', text: 'অ্যান্ড্রয়েড, আইফোন আর স্মার্ট টিভিতে ফ্রি ডাউনলোড করুন।', primaryLabel: 'অ্যাপ ডাউনলোড', primaryUrl: '/contact', secondaryLabel: 'প্ল্যান দেখুন', secondaryUrl: '#plans', phone: '' }, { paddingY: 'lg', ...W }),
    ],
  }),
  general: { siteName: 'পর্দা', tagline: 'বাংলা সিনেমা আর অরিজিনাল সিরিজ — যেকোনো ডিভাইসে।', postsPerPage: 16 },
  // "Install demo content" for this demo replaces the Vidora family's content with Bengali movies & series.
  demo: pordaDemo,
};

module.exports = [creators, toons, festival, academy, neon, newsroom, gallery, shorts, studio, live, porda];
