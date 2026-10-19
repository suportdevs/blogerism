// Ten homepage demos for Marquee. Same shows & episodes as Marquee Classic, each with its own header, homepage and style.
// Shows: open-movie-originals, llama-tales, agents-heroes, night-shift, deep-blue, the-makers, northern-lights, paper-kingdoms.
// Categories: animation, documentary, drama.
const { B: block, un, demoVariant, FILMS } = require('./helpers');
const marquee = require('./marquee');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };
const W = { width: 'wide' };
const yt = (k) => `https://www.youtube.com/watch?v=${FILMS[k][0]}`;
const thumb = (k) => `https://i.ytimg.com/vi/${FILMS[k][0]}/${k === 'sintel' ? 'hqdefault' : 'maxresdefault'}.jpg`;
const demo = (def) => demoVariant(marquee, { source: 'marquee-demos.js', blocks: ['Video', 'Luxury', 'Showcase'], ...def });

const IMG = { seats: '1489599849927-2ee91cede3ba', cinema: '1536440136628-849c177e76a1', projector: '1478720568477-152d9b164e26', reels: '1440404653325-ab127d49abc1', clapper: '1485846234645-a62644f84728', lake: '1493246507139-91e8fad9978e', photographer: '1492691527719-9d1e07e534b4', mountains: '1464822759023-fed622ff2c3b', ocean: '1514282401047-d79a71a590e8', laptop: '1498050108023-c5249f4df085' };

const rail = (title, series) => B('mediaRail', { title, source: 'posts', format: 'VIDEO', series, sort: 'episodes', count: 12, cardStyle: 'landscape', linkLabel: 'View show', linkUrl: `/series/${series}` }, { paddingY: 'sm', ...W });
const plans = (style = {}) => B('pricingToggle', { eyebrow: 'Plans', title: 'Pick a plan. Cancel anytime.', subtitle: 'Every plan includes the full catalogue — no ads, ever.', currency: '$', yearlyNote: '2 months free', plans: [
  { name: 'Basic', description: 'One screen, HD', monthly: '7', yearly: '6', features: ['Full catalogue', 'HD streaming', '1 screen'], buttonLabel: 'Start watching', buttonUrl: '/contact', highlighted: false },
  { name: 'Standard', description: 'Two screens, Full HD', monthly: '12', yearly: '10', features: ['Everything in Basic', 'Full HD', '2 screens', 'Downloads'], buttonLabel: 'Start watching', buttonUrl: '/contact', highlighted: true },
  { name: 'Premium', description: 'Four screens, 4K', monthly: '18', yearly: '15', features: ['Everything in Standard', '4K + HDR', '4 screens', 'Spatial audio'], buttonLabel: 'Start watching', buttonUrl: '/contact', highlighted: false },
] }, { paddingY: 'xl', ...style });

/* 1 ─ Prime: blue premium streaming */
const prime = demo({
  id: 'marquee-prime', name: 'Prime',
  description: 'A premium blue streaming hub: cinematic header, billboard, Top 10, show-by-show rows, plans with yearly toggle and FAQ.',
  layout: { header: 'streaming' },
  appearance: { primaryColor: '#0ea5e9', accentColor: '#facc15', backgroundColor: '#f8fbff', surfaceColor: '#edf3fa', textColor: '#0a1220', darkBackgroundColor: '#050b16', darkSurfaceColor: '#0d1726', darkTextColor: '#e8f0fb', headingFont: 'Outfit', bodyFont: 'Inter', radius: 10, colorMode: 'dark', footerStyle: 'simple' },
  home: () => [
    B('billboard', { series: '', seriesType: 'SHOW' }, HERO),
    B('top10', { title: 'Top 10 shows today', source: 'series', seriesType: 'SHOW' }, { paddingY: 'sm', ...W }),
    B('mediaRail', { title: 'Prime originals', source: 'series', seriesType: 'SHOW', count: 12, cardStyle: 'poster' }, { paddingY: 'sm', ...W }),
    rail('Deep Blue', 'deep-blue'),
    rail('Night Shift', 'night-shift'),
    plans({ background: 'surface' }),
    B('faq', { eyebrow: 'Help', title: 'Frequently asked questions' }, { paddingY: 'xl' }),
  ],
});

/* 2 ─ Kids */
const kids = demo({
  id: 'marquee-kids', name: 'Kids',
  description: 'A bright, safe streaming space for kids: glass header, playful slideshow, safety pills, square show tiles and favourite-show rows.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#f59e0b', accentColor: '#10b981', backgroundColor: '#fffdf5', surfaceColor: '#fef6dc', textColor: '#1e1a0c', darkBackgroundColor: '#131005', darkSurfaceColor: '#1f1a0b', darkTextColor: '#fbf3db', headingFont: 'Bricolage Grotesque', bodyFont: 'Nunito', radius: 28, colorMode: 'light', headerStyle: 'glass', footerStyle: 'columns' },
  home: () => [
    B('heroSlideshow', { height: 'tall', align: 'center', interval: 5, slides: [
      { image: thumb('llama2'), eyebrow: 'Llama Tales', title: 'One llama. Endless trouble.', subtitle: 'New episodes every week.', buttonLabel: 'Watch now', buttonUrl: '/series/llama-tales' },
      { image: thumb('bunny'), eyebrow: 'Paper Kingdoms', title: 'Small worlds, big adventures', subtitle: '', buttonLabel: 'Watch now', buttonUrl: '/series/paper-kingdoms' },
      { image: thumb('coffee'), eyebrow: 'Just added', title: 'Coffee Run', subtitle: 'A sweet little caffeinated chase.', buttonLabel: 'Watch now', buttonUrl: '/shows' },
    ] }, HERO),
    B('trustBar', { variant: 'pills', items: [{ icon: 'ShieldCheck', title: 'Kid-safe profiles' }, { icon: 'Lock', title: 'Parental PIN' }, { icon: 'Smile', title: 'No ads' }, { icon: 'Download', title: 'Watch offline' }] }, { paddingY: 'md' }),
    B('seriesGrid', { title: 'Favourite shows', seriesType: 'SHOW', count: 8, cardStyle: 'square' }, { paddingY: 'lg', ...W }),
    rail('Llama Tales', 'llama-tales'),
    rail('Paper Kingdoms', 'paper-kingdoms'),
    B('mediaRail', { title: 'Animation', source: 'posts', format: 'VIDEO', category: 'animation', sort: 'popular', count: 12, cardStyle: 'landscape' }, { background: 'surface', ...W }),
  ],
});

/* 3 ─ Docs: nature & documentary */
const docs = demo({
  id: 'marquee-docs', name: 'Docs',
  description: 'A documentary channel in the luxe language: framed landscape hero, serif statement, cursor-preview show list, framed features and parallax CTA.',
  layout: { header: 'luxe', style: 'luxe' },
  appearance: { primaryColor: '#4d7c0f', accentColor: '#a16207', backgroundColor: '#f6f5ef', surfaceColor: '#eceae0', textColor: '#171a12', darkBackgroundColor: '#0b0d08', darkSurfaceColor: '#15180f', darkTextColor: '#ebeee2', headingFont: 'Cormorant Garamond', bodyFont: 'Jost', radius: 0, colorMode: 'light', footerStyle: 'luxe', headerCta: { enabled: true, label: 'Start watching', url: '/shows' } },
  home: () => [
    B('luxeHero', { image: un(IMG.lake, 2200), video: '', overline: 'Marquee Docs', title: 'The world,', italic: 'up close', subtitle: 'Nature, science and the people who make things — documentaries made with patience.', buttonLabel: 'Explore', buttonUrl: '/shows', height: 'full', align: 'center', overlay: 40 }, HERO),
    B('luxeStatement', { overline: 'Our promise', text: 'We commission documentaries that take their time — and trust you to take yours.', signature: 'Marquee Docs' }, { paddingY: 'xl' }),
    B('luxeList', { overline: 'The collection', title: 'Series', source: 'series', format: '', category: '', series: '', seriesType: 'SHOW', sort: 'popular', count: 8, linkLabel: 'All shows', linkUrl: '/shows' }, { paddingY: 'xl', ...W }),
    B('luxeSplit', { number: '01', overline: 'Deep Blue', title: 'Journeys beneath the surface', text: 'A series about the oceans we think we know.\n\nShot over three years on five continents.', image: un(IMG.ocean, 1200), imagePosition: 'left', buttonLabel: 'Watch Deep Blue', buttonUrl: '/series/deep-blue' }, { paddingY: 'xl', ...W }),
    B('luxeSplit', { number: '02', overline: 'The Makers', title: 'Inside the studios that build worlds', text: 'Animators, engineers and dreamers — at work.', image: un(IMG.photographer, 1200), imagePosition: 'right', buttonLabel: 'Watch The Makers', buttonUrl: '/series/the-makers' }, { paddingY: 'xl', ...W }),
    B('mediaRail', { title: 'Documentaries', source: 'posts', format: 'VIDEO', category: 'documentary', sort: 'latest', count: 12, cardStyle: 'landscape' }, { background: 'surface', ...W }),
    B('luxeCta', { image: un(IMG.mountains, 2000), overline: 'Members', title: 'Slow television for curious minds', text: '', buttonLabel: 'Start watching', buttonUrl: '/shows' }, { paddingY: 'none', width: 'full' }),
  ],
});

/* 4 ─ Anime: neon fantasy */
const anime = demo({
  id: 'marquee-anime', name: 'Anime',
  description: 'A neon fantasy & animation service: bold header, kinetic type hero, Top 10, poster rows and a series wall.',
  layout: { header: 'bold' },
  appearance: { primaryColor: '#8b5cf6', accentColor: '#f43f5e', backgroundColor: '#faf8ff', surfaceColor: '#f0ecfb', textColor: '#120d22', darkBackgroundColor: '#07040f', darkSurfaceColor: '#120c22', darkTextColor: '#eee8fd', headingFont: 'Unbounded', bodyFont: 'Inter', radius: 14, colorMode: 'dark', footerStyle: 'big', headerCta: { enabled: true, label: 'Watch free', url: '/shows' } },
  home: () => [
    B('kineticHero', { eyebrow: 'Marquee Anime', lines: ['Worlds'], rotate: ['collide.', 'awaken.', 'await you.'], subtitle: 'Fantasy, sci-fi and adventure — animated with heart and streaming in 4K.', primaryLabel: 'Browse shows', primaryUrl: '/shows', secondaryLabel: 'New episodes', secondaryUrl: '#new', image: thumb('sintel'), badge: 'Stream now ✦ Stream now ✦ ', marquee: ['Fantasy', 'Sci-fi', 'Adventure', 'Comedy', 'Action'] }, { paddingY: 'xl', width: 'wide', animate: false }),
    B('top10', { title: 'Top 10 this season', source: 'series', seriesType: 'SHOW' }, { paddingY: 'lg', ...W }),
    B('mediaRail', { title: 'New episodes', source: 'posts', format: 'VIDEO', sort: 'latest', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', anchor: 'new', ...W }),
    B('seriesGrid', { title: 'All series', seriesType: 'SHOW', count: 12, cardStyle: 'poster' }, { paddingY: 'lg', ...W }),
  ],
});

/* 5 ─ Premiere: rentals & new releases */
const premiere = demo({
  id: 'marquee-premiere', name: 'Premiere',
  description: 'A rent-and-buy movie store: floating header, release slideshow, premiere countdown, film cards with prices, trailer and rows.',
  layout: { header: 'floating' },
  appearance: { primaryColor: '#e11d48', accentColor: '#f59e0b', backgroundColor: '#fff8f9', surfaceColor: '#fdeef1', textColor: '#1b0b10', darkBackgroundColor: '#0c0507', darkSurfaceColor: '#190c10', darkTextColor: '#f9e8ec', headingFont: 'Sora', bodyFont: 'Inter', radius: 16, colorMode: 'dark', footerStyle: 'big', headerCta: { enabled: true, label: 'My films', url: '/saved' } },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'left', interval: 6, slides: [
      { image: thumb('cosmos'), eyebrow: 'New release', title: 'Cosmos Laundromat', subtitle: 'Rent in 4K · 12 min', buttonLabel: 'Rent now', buttonUrl: '#store' },
      { image: thumb('steel'), eyebrow: 'Now available', title: 'Tears of Steel', subtitle: 'Buy or rent in HD', buttonLabel: 'Rent now', buttonUrl: '#store' },
    ] }, HERO),
    B('countdown', { eyebrow: 'World premiere', title: 'Charge premieres in', text: 'Pre-order now and watch the moment it drops.', date: '2027-03-21T20:00', variant: 'image', image: thumb('charge'), expiredText: 'Out now!', buttonLabel: 'Pre-order', buttonUrl: '/contact' }, { paddingY: 'xl', ...W }),
    B('listingCards', { eyebrow: 'Store', title: 'Rent or buy', subtitle: 'Watch within 30 days, finish within 48 hours.', variant: 'card', columns: 4, filters: true, subtitleIcon: 'Film', buttonLabel: '', buttonUrl: '', items: [['sintel', 'Fantasy', '$3.99'], ['steel', 'Sci-fi', '$3.99'], ['cosmos', 'Fantasy', '$4.99'], ['agent', 'Comedy', '$2.99'], ['sprite', 'Comedy', '$2.99'], ['spring', 'Fantasy', '$2.99'], ['hero', 'Action', '$1.99'], ['bunny', 'Comedy', '$1.99']].map(([k, category, price], i) => ({ image: thumb(k), badge: i < 2 ? 'New' : '', category, title: FILMS[k][1], subtitle: `Blender Studio · ${Math.round(FILMS[k][2] / 60)} min`, price, period: ' rent', rating: (4.6 + (i % 4) / 10).toFixed(1), meta: ['Monitor: 4K', 'Clock: 48h rental'], url: '/shows' })) }, { paddingY: 'xl', anchor: 'store', ...W }),
    B('videoLightbox', { eyebrow: 'Trailer', title: 'Sintel', text: 'A lonely girl searches for her dragon — an epic in fifteen minutes.', poster: thumb('sintel'), videoUrl: yt('sintel'), layout: 'split', duration: '14:48', stats: [{ value: '4.9', label: 'Rating' }, { value: '4K', label: 'Quality' }] }, { background: 'surface', paddingY: 'xl', ...W }),
    B('mediaRail', { title: 'Most rented', source: 'posts', format: 'VIDEO', sort: 'popular', count: 12, cardStyle: 'landscape' }, { paddingY: 'md', ...W }),
  ],
});

/* 6 ─ Binge: show-by-show marathon */
const binge = demo({
  id: 'marquee-binge', name: 'Binge',
  description: 'A binge-watcher’s dashboard: dark sidebar navigation, “up next” spotlight, Top 10 episodes and one row per show.',
  layout: { header: 'sidebar' },
  appearance: { primaryColor: '#f97316', accentColor: '#22d3ee', backgroundColor: '#fafaf9', surfaceColor: '#f1f0ee', textColor: '#141210', darkBackgroundColor: '#0a0908', darkSurfaceColor: '#151311', darkTextColor: '#efece8', headingFont: 'Outfit', bodyFont: 'Inter', radius: 12, colorMode: 'dark', footerStyle: 'simple', headerCta: { enabled: true, label: 'Continue watching', url: '/saved' } },
  home: () => [
    B('episodeSpotlight', { eyebrow: 'Up next', title: '', format: 'VIDEO', series: 'open-movie-originals', category: '', sort: 'episodes', count: 4, linkLabel: 'All episodes', linkUrl: '/series/open-movie-originals' }, { paddingY: 'lg', ...W }),
    B('top10', { title: 'Top 10 episodes', source: 'posts', format: 'VIDEO', seriesType: '' }, { paddingY: 'sm', ...W }),
    rail('Open Movie Originals', 'open-movie-originals'),
    rail('Agents & Heroes', 'agents-heroes'),
    rail('Northern Lights', 'northern-lights'),
    rail('The Makers', 'the-makers'),
  ],
});

/* 7 ─ Indie: minimal film club */
const indie = demo({
  id: 'marquee-indie', name: 'Indie',
  description: 'A minimal indie film club: transparent minimal header, stills slideshow, filterable stills wall, curated list and newsletter.',
  layout: { header: 'minimal' },
  appearance: { primaryColor: '#eab308', accentColor: '#f97316', backgroundColor: '#fafaf7', surfaceColor: '#f1f0ea', textColor: '#111110', darkBackgroundColor: '#0b0b0a', darkSurfaceColor: '#151513', darkTextColor: '#f0efe8', headingFont: 'Syne', bodyFont: 'Inter', radius: 0, colorMode: 'dark', footerStyle: 'simple' },
  home: () => [
    B('heroSlideshow', { height: 'full', align: 'left', interval: 7, slides: [
      { image: thumb('spring'), eyebrow: 'This month’s pick', title: 'Spring', subtitle: 'Ancient spirits, one brave shepherd.', buttonLabel: 'Watch', buttonUrl: '/shows' },
      { image: thumb('elephants'), eyebrow: 'From the archive', title: 'Elephants Dream', subtitle: 'Where it all began.', buttonLabel: 'Watch', buttonUrl: '/shows' },
    ] }, HERO),
    B('masonryGallery', { eyebrow: 'Stills', title: 'Frames we love', subtitle: '', columns: 3, filters: true, items: [['sintel', 'Fantasy'], ['spring', 'Fantasy'], ['steel', 'Sci-fi'], ['charge', 'Sci-fi'], ['sprite', 'Comedy'], ['agent', 'Comedy']].map(([k, category]) => ({ src: thumb(k), title: FILMS[k][1], category, caption: '' })) }, { paddingY: 'xl', ...W }),
    B('luxeList', { overline: 'The club', title: 'Now showing', source: 'series', format: '', category: '', series: '', seriesType: 'SHOW', sort: 'latest', count: 8, linkLabel: 'All shows', linkUrl: '/shows' }, { background: 'surface', paddingY: 'xl', ...W }),
    B('newsletter', { title: 'One film a week', text: 'Our curator’s pick, with notes, every Sunday.' }, { paddingY: 'lg' }),
  ],
});

/* 8 ─ Landing: sign-up page */
const landing = demo({
  id: 'marquee-landing', name: 'Landing',
  description: 'A sign-up landing page for new members: transparent header, cinema hero with email bar, device tabs, plans, FAQ and final CTA.',
  layout: { header: 'overlay' },
  appearance: { primaryColor: '#22c55e', accentColor: '#facc15', backgroundColor: '#f7faf7', surfaceColor: '#ecf3ec', textColor: '#0c140d', darkBackgroundColor: '#050906', darkSurfaceColor: '#0d150e', darkTextColor: '#e6efe7', headingFont: 'Outfit', bodyFont: 'Inter', radius: 10, colorMode: 'dark', footerStyle: 'simple', headerCta: { enabled: true, label: 'Sign in', url: '/contact' } },
  home: () => [
    B('searchHero', { image: un(IMG.seats, 2200), overlay: 60, height: 'full', align: 'center', eyebrow: 'First month free', title: 'Unlimited originals. Watch anywhere.', subtitle: 'Ready to watch? Enter your email to create your membership.', tabs: [], buttonLabel: 'Get started', buttonIcon: 'Play', action: '/contact', fields: [{ label: 'Email address', icon: 'Mail', type: 'text', placeholder: 'you@example.com', options: [] }], stats: [{ value: '8', label: 'Original series' }, { value: '4K', label: 'HDR streaming' }, { value: '0', label: 'Ads, ever' }] }, HERO),
    B('featureTabs', { eyebrow: 'Watch everywhere', title: 'On every screen you own', subtitle: '', variant: 'top', autoplay: true, tabs: [
      { icon: 'Tv', label: 'TV', title: 'Enjoy on your TV', text: 'Smart TVs, consoles, streaming sticks and more.', bullets: ['4K + HDR', 'Spatial audio'], image: thumb('cosmos'), buttonLabel: '', buttonUrl: '' },
      { icon: 'Smartphone', label: 'Mobile', title: 'Download and go', text: 'Save episodes and watch offline anywhere.', bullets: ['Smart downloads', 'Data saver'], image: thumb('hero'), buttonLabel: '', buttonUrl: '' },
      { icon: 'Laptop', label: 'Laptop', title: 'Stream in your browser', text: 'No app needed — just sign in and press play.', bullets: ['All browsers', 'Picture-in-picture'], image: thumb('steel'), buttonLabel: '', buttonUrl: '' },
    ] }, { paddingY: 'xl' }),
    plans({ background: 'surface' }),
    B('faq', { eyebrow: 'FAQ', title: 'Questions? We have answers' }, { paddingY: 'xl' }),
    B('ctaBanner', { variant: 'image', image: un(IMG.cinema, 1800), eyebrow: 'Start today', title: 'Your first month is on us', text: 'Cancel online in two clicks, anytime.', primaryLabel: 'Get started', primaryUrl: '/contact', phone: '' }, { paddingY: 'lg', ...W }),
  ],
});

/* 9 ─ Noir: classic cinema gazette */
const noir = demo({
  id: 'marquee-noir', name: 'Noir',
  description: 'A black-and-white cinema gazette: newspaper masthead, magazine cover feature, Top 10, poster rows and a cursor-preview show list.',
  layout: { header: 'masthead' },
  appearance: { primaryColor: '#dc2626', accentColor: '#a3a3a3', backgroundColor: '#f5f5f4', surfaceColor: '#e7e5e4', textColor: '#0c0a09', darkBackgroundColor: '#0a0a0a', darkSurfaceColor: '#171717', darkTextColor: '#f5f5f5', headingFont: 'Playfair Display', bodyFont: 'Inter', radius: 0, colorMode: 'dark', footerStyle: 'luxe' },
  home: () => [
    B('luxeFeatured', { overline: 'Tonight’s feature', title: '', category: '', format: 'VIDEO', sort: 'popular', count: 5, linkLabel: 'All episodes', linkUrl: '/new-popular' }, { paddingY: 'lg', ...W }),
    B('top10', { title: 'The charts', source: 'series', seriesType: 'SHOW' }, { paddingY: 'md', ...W }),
    B('mediaRail', { title: 'Drama', source: 'posts', format: 'VIDEO', category: 'drama', sort: 'latest', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', ...W }),
    B('luxeList', { overline: 'Repertory', title: 'The shows', source: 'series', format: '', category: '', series: '', seriesType: 'SHOW', sort: 'popular', count: 8, linkLabel: 'All shows', linkUrl: '/shows' }, { background: 'surface', paddingY: 'xl', ...W }),
    B('mediaRail', { title: 'Originals', source: 'series', seriesType: 'SHOW', count: 12, cardStyle: 'poster' }, { paddingY: 'md', ...W }),
  ],
});

/* 10 ─ Family: something for everyone */
const family = demo({
  id: 'marquee-family', name: 'Family',
  description: 'A friendly family plan: centered header, collage hero, poster grid, one row per genre, family pricing and FAQ.',
  layout: { header: 'default' },
  appearance: { primaryColor: '#2563eb', accentColor: '#f43f5e', backgroundColor: '#ffffff', surfaceColor: '#f2f5fc', textColor: '#0c1427', darkBackgroundColor: '#070c18', darkSurfaceColor: '#0f1728', darkTextColor: '#e6ebf6', headingFont: 'Lexend', bodyFont: 'Figtree', radius: 18, colorMode: 'light', headerStyle: 'centered', footerStyle: 'columns', headerCta: { enabled: true, label: 'Try free', url: '/contact' } },
  home: () => [
    B('splitHero', { variant: 'collage', eyebrow: 'One plan, the whole family', title: 'Something for', highlight: 'everyone', subtitle: 'Cartoons for the kids, documentaries for the curious and drama for after bedtime — with up to six profiles.', bullets: ['Up to 6 profiles', 'Kids mode', 'Downloads', 'No ads'], primaryLabel: 'Try it free', primaryUrl: '/contact', secondaryLabel: 'Browse shows', secondaryUrl: '/shows', image: thumb('bunny'), image2: thumb('llama3'), badges: [{ icon: 'Users', value: '6', label: 'Profiles per plan' }, { icon: 'Star', value: '4.8', label: 'App rating' }], proof: '', avatars: [] }, { background: 'surface', paddingY: 'xl', animate: false }),
    B('seriesGrid', { title: 'Popular with families', seriesType: 'SHOW', count: 8, cardStyle: 'poster' }, { paddingY: 'lg', ...W }),
    B('mediaRail', { title: 'Animation', source: 'posts', format: 'VIDEO', category: 'animation', sort: 'popular', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', ...W }),
    B('mediaRail', { title: 'Documentaries', source: 'posts', format: 'VIDEO', category: 'documentary', sort: 'popular', count: 12, cardStyle: 'landscape' }, { paddingY: 'sm', ...W }),
    B('mediaRail', { title: 'Drama', source: 'posts', format: 'VIDEO', category: 'drama', sort: 'popular', count: 12, cardStyle: 'landscape' }, { paddingY: 'md', ...W }),
    plans({ background: 'surface' }),
    B('faq', { eyebrow: 'FAQ', title: 'Good to know' }, { paddingY: 'xl' }),
  ],
});

module.exports = [prime, kids, docs, anime, premiere, binge, indie, landing, noir, family];
