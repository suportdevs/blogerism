// Luxury design versions of the classic themes. Each luxe theme keeps its classic sibling's content
// model and demo content, but has its own design language: luxe header with full-screen menu,
// serif typography, gold hairlines, magazine article pages and luxury page-builder blocks.
const { B: block, un } = require('./helpers');
const nova = require('./nova');
const herald = require('./herald');
const vidora = require('./vidora');
const marquee = require('./marquee');
const waveform = require('./waveform');
const folio = require('./folio');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };
const FULL = { paddingY: 'none', width: 'full' };

const luxeAppearance = (colors) => ({
  radius: 0, containerWidth: 1280, footerStyle: 'luxe', backToTop: true, headerSticky: true, blogLayout: 'grid',
  showAuthor: true, showReadingTime: true, baseFontSize: 16,
  announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  ...colors,
});

// Builds a luxe variant from a classic theme.
function variant(base, overrides) {
  const { home, layout, ...rest } = overrides;
  return {
    ...base,
    ...rest,
    variantOf: base.id,
    variantName: 'Luxe',
    features: { ...base.features, blocks: ['Luxury', ...base.features.blocks] },
    layout: { ...base.layout, header: 'luxe', style: 'luxe', ...(layout || {}) },
    pages: () => [home(), ...base.pages().filter((p) => !p.home)],
    demo: base.demo,
  };
}

/* ------------------------------ Nova Luxe ------------------------------ */
const novaLuxe = variant(nova, {
  id: 'nova-luxe',
  name: 'Nova Luxe',
  description: 'A quiet-luxury studio website: framed full-screen hero, serif statements, offset-frame stories, quote carousel and a magazine journal.',
  layout: { article: 'luxe', listing: 'luxe' },
  general: { siteName: 'Nova Maison', tagline: 'A digital atelier for considered brands' },
  appearance: luxeAppearance({
    preset: 'nova-luxe', primaryColor: '#a8834a', accentColor: '#1c1a16', backgroundColor: '#f7f3ec', surfaceColor: '#efe8dc', textColor: '#1c1a16',
    darkBackgroundColor: '#0d0c0a', darkSurfaceColor: '#16140f', darkTextColor: '#ede6da', headingFont: 'Cormorant Garamond', bodyFont: 'Jost',
    colorMode: 'light', footerText: 'Crafted with intention.', headerCta: { enabled: true, label: 'Enquire', url: '/contact' },
  }),
  menus: {
    ...nova.menus,
    header: { name: 'Main menu', items: [{ label: 'Home', url: '/', children: [] }, { label: 'Journal', url: '/blog', children: [] }, { label: 'About', url: '/about', children: [] }, { label: 'FAQ', url: '/faq', children: [] }, { label: 'Contact', url: '/contact', children: [] }] },
  },
  home: () => ({
    slug: 'nova-luxe-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Nova Maison — a digital atelier',
    blocks: [
      B('luxeHero', { image: un('1600585154340-be6161a56a0c', 2200), overline: 'Est. 2019 · Digital atelier', title: 'Crafting digital', italic: 'experiences', subtitle: 'We design and build websites for brands that value craft, clarity and timeless design.', buttonLabel: 'Discover our work', buttonUrl: '#story', height: 'full', align: 'center', overlay: 35 }, HERO),
      B('luxeStatement', { overline: 'Our philosophy', text: 'The finest digital experiences are quiet, considered and made to last — every detail designed with intention, nothing added without reason.', signature: 'The Nova studio' }, { paddingY: 'xl', anchor: 'story' }),
      B('luxeSplit', { number: '01', overline: 'Strategy', title: 'Considered from the very first sketch', text: 'Every engagement begins with listening. We study your brand, your audience and your ambitions before a single pixel is placed.\n\nThe result is a clear direction that guides every decision that follows.', image: un('1497366216548-37526070297c', 1200), imagePosition: 'left', buttonLabel: 'Our approach', buttonUrl: '/about' }, { paddingY: 'xl', width: 'wide' }),
      B('luxeSplit', { number: '02', overline: 'Craft', title: 'Built with uncompromising care', text: 'Typography set with precision. Interactions tuned by hand. Performance treated as a feature.\n\nWe build websites that feel as good as they look — on every screen.', image: un('1618221195710-dd6b41faaea6', 1200), imagePosition: 'right', buttonLabel: 'Read the journal', buttonUrl: '/blog' }, { paddingY: 'xl', width: 'wide' }),
      B('stats', { items: [{ value: '7', label: 'Years of practice' }, { value: '120+', label: 'Brands served' }, { value: '18', label: 'Design awards' }, { value: '98%', label: 'Return clients' }] }, { background: 'surface', paddingY: 'lg' }),
      B('luxeQuote', { overline: 'In their words', title: '' }, { paddingY: 'xl' }),
      B('luxeFeatured', { overline: 'The journal', title: 'Notes on design & craft', format: 'STANDARD', sort: 'latest', count: 4, linkLabel: 'All stories', linkUrl: '/blog' }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
      B('luxeCta', { image: un('1600607687939-ce8a6c25118c', 2000), overline: 'Begin a conversation', title: 'Let us create something timeless', text: 'Tell us about your brand — we take on a small number of projects each season.', buttonLabel: 'Enquire', buttonUrl: '/contact' }, FULL),
    ],
  }),
});

/* ------------------------------ Herald Luxe ------------------------------ */
const heraldLuxe = variant(herald, {
  id: 'herald-luxe',
  name: 'Herald Luxe',
  description: 'A premium magazine edition: Bodoni headlines, cover story layout, editor’s letter, cursor-preview reading list and long-form article pages.',
  layout: { article: 'luxe', listing: 'luxe', overlay: false },
  general: { siteName: 'The Herald', tagline: 'The weekend edition' },
  appearance: luxeAppearance({
    preset: 'herald-luxe', primaryColor: '#9c7a3c', accentColor: '#111111', backgroundColor: '#faf8f4', surfaceColor: '#f1ede5', textColor: '#121212',
    darkBackgroundColor: '#0e0e0e', darkSurfaceColor: '#181818', darkTextColor: '#ece9e2', headingFont: 'Bodoni Moda', bodyFont: 'Jost',
    colorMode: 'light', footerText: 'Independent journalism since 1924.', headerCta: { enabled: true, label: 'Subscribe', url: '/contact' },
  }),
  home: () => ({
    slug: 'herald-luxe-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'The Herald — the weekend edition',
    blocks: [
      B('breakingNews', { label: 'Breaking', count: 6, breakingOnly: true, format: '', speed: 50 }, { paddingY: 'none', width: 'wide', animate: false }),
      B('luxeFeatured', { overline: 'The cover story', title: '', format: 'STANDARD', sort: 'latest', count: 5, linkLabel: '', linkUrl: '' }, { paddingY: 'lg', width: 'wide', animate: false }),
      B('luxeStatement', { overline: 'Editor’s letter', text: 'In a week of historic agreements and quiet revolutions, we went looking for the people behind the headlines. Their stories are in this edition.', signature: 'The Editors' }, { background: 'surface', paddingY: 'xl' }),
      B('luxeList', { overline: 'Most read', title: 'This week’s essential reading', source: 'posts', format: 'STANDARD', sort: 'popular', count: 6, linkLabel: 'All stories', linkUrl: '/blog' }, { paddingY: 'xl', width: 'wide' }),
      B('newsColumns', { count: 4, columns: [{ title: 'Politics', category: 'politics' }, { title: 'Business', category: 'business' }, { title: 'Culture', category: 'entertainment' }] }, { paddingY: 'lg', width: 'wide' }),
      B('luxeCta', { image: un('1504711434969-e33886168f5c', 2000), overline: 'The weekend edition', title: 'Long reads, delivered every Saturday', text: 'Join 120,000 readers who start their weekend with The Herald.', buttonLabel: 'Subscribe', buttonUrl: '/contact' }, FULL),
      B('luxeFeatured', { overline: 'World', title: 'Dispatches from abroad', category: 'world', format: 'STANDARD', sort: 'latest', count: 4, linkLabel: 'More world news', linkUrl: '/category/world' }, { paddingY: 'xl', width: 'wide' }),
      B('mediaRail', { title: 'Watch', source: 'posts', format: 'VIDEO', count: 10, cardStyle: 'landscape', linkLabel: 'All videos', linkUrl: '/category/video' }, { background: 'dark', paddingY: 'lg', width: 'wide' }),
    ],
  }),
});

/* ------------------------------ Vidora Luxe ------------------------------ */
const vidoraLuxe = variant(vidora, {
  id: 'vidora-luxe',
  name: 'Vidora Luxe',
  description: 'A curated cinema-gallery for films: background-video hero, featured screening, cursor-preview collection list and elegant playlists.',
  layout: { article: 'blog', listing: 'video' },
  general: { siteName: 'Vidora Signature', tagline: 'A curated home for films & visual stories' },
  appearance: luxeAppearance({
    preset: 'vidora-luxe', primaryColor: '#c9a66b', accentColor: '#8a6d3b', backgroundColor: '#f6f2ea', surfaceColor: '#ebe4d6', textColor: '#16130f',
    darkBackgroundColor: '#0b0a09', darkSurfaceColor: '#151310', darkTextColor: '#efe8dc', headingFont: 'Marcellus', bodyFont: 'Jost',
    colorMode: 'dark', footerText: 'Films chosen by hand.', headerCta: { enabled: true, label: 'Subscribe', url: '/contact' },
  }),
  home: () => ({
    slug: 'vidora-luxe-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Vidora Signature — curated films',
    blocks: [
      B('luxeHero', { video: 'https://interactive-examples.mdn.mozilla.net/media/cc0-videos/flower.mp4', image: un('1492691527719-9d1e07e534b4', 2000), overline: 'Vidora Signature', title: 'Stories in', italic: 'motion', subtitle: 'A curated home for short films, animation and visual storytelling.', buttonLabel: 'Start watching', buttonUrl: '#featured', height: 'full', align: 'center', overlay: 45 }, HERO),
      B('luxeStatement', { overline: 'The collection', text: 'Every film here is chosen by hand — for its craft, its daring and the way it stays with you long after the credits.', signature: 'Vidora curators' }, { paddingY: 'xl' }),
      B('videoFeature', { title: 'Featured screening', count: 5, sort: 'popular' }, { paddingY: 'lg', width: 'wide', anchor: 'featured' }),
      B('luxeList', { overline: 'Now showing', title: 'The collection', source: 'posts', format: 'VIDEO', sort: 'latest', count: 8, linkLabel: 'Browse all', linkUrl: '/trending' }, { paddingY: 'xl', width: 'wide' }),
      B('mediaRail', { title: 'Curated playlists', source: 'series', seriesType: 'PLAYLIST', count: 10, cardStyle: 'landscape', linkLabel: 'All playlists', linkUrl: '/playlists' }, { background: 'surface', paddingY: 'lg', width: 'wide' }),
      B('luxeCta', { image: un('1516035069371-29a1b244cc32', 2000), overline: 'For filmmakers', title: 'Share your work with a discerning audience', buttonLabel: 'Submit a film', buttonUrl: '/contact' }, FULL),
    ],
  }),
});

/* ------------------------------ Marquee Luxe ------------------------------ */
const marqueeLuxe = variant(marquee, {
  id: 'marquee-luxe',
  name: 'Marquee Luxe',
  description: 'A prestige streaming experience: cinema-hall hero, Cinzel titles, gold accents, Top 10 and a cursor-preview list of originals.',
  layout: { article: 'blog', listing: 'video' },
  general: { siteName: 'Marquee Prestige', tagline: 'Award-winning originals, privately screened' },
  appearance: luxeAppearance({
    preset: 'marquee-luxe', primaryColor: '#d4af37', accentColor: '#8c6d1f', backgroundColor: '#f5f1e8', surfaceColor: '#e9e2d1', textColor: '#14110b',
    darkBackgroundColor: '#080706', darkSurfaceColor: '#12100d', darkTextColor: '#f1ead9', headingFont: 'Cinzel', bodyFont: 'Jost',
    colorMode: 'dark', footerText: 'Cinema, reimagined.', headerCta: { enabled: true, label: 'Start watching', url: '/shows' },
  }),
  home: () => ({
    slug: 'marquee-luxe-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Marquee Prestige — originals & series',
    blocks: [
      B('luxeHero', { image: un('1489599849927-2ee91cede3ba', 2200), overline: 'Marquee Prestige', title: 'Cinema,', italic: 'reimagined', subtitle: 'Award-winning originals from independent studios — screened privately, wherever you are.', buttonLabel: 'Explore the originals', buttonUrl: '/shows', height: 'full', align: 'center', overlay: 40 }, HERO),
      B('top10', { title: 'Top 10 this week', source: 'series', seriesType: 'SHOW' }, { paddingY: 'lg', width: 'wide' }),
      B('luxeList', { overline: 'Marquee originals', title: 'The prestige collection', source: 'series', seriesType: 'SHOW', sort: 'popular', count: 8, linkLabel: 'All shows', linkUrl: '/shows' }, { paddingY: 'xl', width: 'wide' }),
      B('luxeStatement', { overline: 'Our promise', text: 'Every series is commissioned from independent studios and presented without compromise — no clutter, no noise, only cinema.', signature: 'Marquee Prestige' }, { background: 'surface', paddingY: 'xl' }),
      B('mediaRail', { title: 'New episodes', source: 'posts', format: 'VIDEO', sort: 'latest', count: 12, cardStyle: 'landscape' }, { paddingY: 'lg', width: 'wide' }),
      B('luxeCta', { image: un('1440404653325-ab127d49abc1', 2000), overline: 'Members', title: 'Your private screening awaits', buttonLabel: 'Start watching', buttonUrl: '/shows' }, FULL),
    ],
  }),
});

/* ------------------------------ Waveform Luxe ------------------------------ */
const waveformLuxe = variant(waveform, {
  id: 'waveform-luxe',
  name: 'Waveform Luxe',
  description: 'An intimate audio salon: ivory & burgundy palette, editorial programme list, play-anywhere episodes and the persistent player.',
  layout: { article: 'blog', listing: 'audio' },
  general: { siteName: 'Waveform Salon', tagline: 'Conversations worth savouring' },
  appearance: luxeAppearance({
    preset: 'waveform-luxe', primaryColor: '#7a1f2b', accentColor: '#b08d57', backgroundColor: '#f6f1ea', surfaceColor: '#ece3d6', textColor: '#20140f',
    darkBackgroundColor: '#120b0a', darkSurfaceColor: '#1d1311', darkTextColor: '#f2e8e0', headingFont: 'Cormorant Garamond', bodyFont: 'Jost',
    colorMode: 'light', footerText: 'Slow audio for curious minds.', headerCta: { enabled: true, label: 'Listen', url: '/episodes' },
  }),
  home: () => ({
    slug: 'waveform-luxe-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Waveform Salon — conversations worth savouring',
    blocks: [
      B('luxeHero', { image: un('1590602847861-f357a9332bbc', 2200), overline: 'Waveform Salon', title: 'Conversations', italic: 'worth savouring', subtitle: 'Thoughtful podcasts on design, technology and culture — press play and keep wandering.', buttonLabel: 'Listen now', buttonUrl: '/episodes', height: 'full', align: 'center', overlay: 40 }, HERO),
      B('luxeStatement', { overline: 'The salon', text: 'We make slow, carefully produced audio for people who still love a long conversation — no hot takes, only good questions.', signature: 'The Waveform editors' }, { paddingY: 'xl' }),
      B('seriesGrid', { title: 'Our programmes', seriesType: 'PODCAST', count: 6, cardStyle: 'square' }, { background: 'surface', paddingY: 'xl' }),
      B('luxeList', { overline: 'The latest', title: 'Recent episodes', source: 'posts', format: 'AUDIO', sort: 'latest', count: 6, linkLabel: 'All episodes', linkUrl: '/episodes' }, { paddingY: 'xl', width: 'wide' }),
      B('audioPlaylist', { title: 'Listen in full', series: '', count: 4, sort: 'popular' }, { background: 'surface', paddingY: 'lg', width: 'narrow' }),
      B('luxeCta', { image: un('1511379938547-c1f69419868d', 2000), overline: 'Join the salon', title: 'New episodes, every Friday', text: 'Subscribe for show notes, reading lists and early releases.', buttonLabel: 'Subscribe', buttonUrl: '/contact' }, FULL),
    ],
  }),
});

/* ------------------------------ Folio Luxe ------------------------------ */
const folioBlocks = folio.pages().find((p) => p.home).blocks;
const folioData = (type, n = 0) => folioBlocks.filter((b) => b.type === type)[n]?.data || {};
const hero = folioData('profileHero');
const about = folioData('aboutMe');

const folioLuxe = variant(folio, {
  id: 'folio-luxe',
  name: 'Folio Luxe',
  description: 'A refined black-and-gold portfolio: framed hero, editorial about section, skills, timeline, projects and a parallax invitation.',
  layout: { article: 'luxe', listing: 'luxe' },
  appearance: luxeAppearance({
    preset: 'folio-luxe', primaryColor: '#c6a15b', accentColor: '#8a6d3b', backgroundColor: '#f6f2ea', surfaceColor: '#ece5d8', textColor: '#14120e',
    darkBackgroundColor: '#0a0a0a', darkSurfaceColor: '#141414', darkTextColor: '#ece8df', headingFont: 'Bodoni Moda', bodyFont: 'Jost',
    colorMode: 'dark', footerText: 'Designed & engineered with care.', headerCta: { enabled: true, label: 'Hire me', url: '/#contact' },
  }),
  home: () => ({
    slug: 'folio-luxe-home', title: 'Home', home: true, template: 'full-width', seoTitle: `${hero.name} — Full Stack Web Developer`,
    blocks: [
      B('luxeHero', { image: un('1498050108023-c5249f4df085', 2200), overline: 'Portfolio · Full Stack Web Developer', title: 'Md. Mamunur', italic: 'Rashid', subtitle: 'Enterprise ERPs, multi-tenant SaaS and high-performance APIs — 18+ applications running in production.', buttonLabel: 'View selected work', buttonUrl: '#projects', height: 'full', align: 'center', overlay: 55 }, HERO),
      B('luxeStatement', { overline: 'Profile', text: 'I build, scale and maintain enterprise-grade web applications — software that real teams depend on every single day.', signature: hero.name }, { paddingY: 'xl' }),
      B('stats', folioData('stats'), { background: 'surface', paddingY: 'lg' }),
      B('luxeSplit', { number: '01', overline: 'About', title: about.title, text: about.text, image: un('1517694712202-14dd9538aa97', 1200), imagePosition: 'left', buttonLabel: 'Get in touch', buttonUrl: '#contact' }, { paddingY: 'xl', width: 'wide', anchor: 'about' }),
      B('skills', folioData('skills'), { background: 'surface', paddingY: 'xl', anchor: 'skills' }),
      B('timeline', folioData('timeline', 0), { paddingY: 'xl', width: 'narrow', anchor: 'experience' }),
      B('projects', folioData('projects'), { paddingY: 'xl', width: 'wide', anchor: 'projects' }),
      B('timeline', folioData('timeline', 1), { background: 'surface', paddingY: 'xl', width: 'narrow', anchor: 'education' }),
      B('luxeCta', { image: un('1461749280684-dccba630e2f6', 2000), overline: 'Available for new projects', title: 'Let us build something exceptional', buttonLabel: 'Start a conversation', buttonUrl: '#contact' }, FULL),
      B('contactForm', { title: 'Let’s work together', text: 'Send me a message and I’ll get back to you within 24 hours.', showInfo: true }, { paddingY: 'xl', anchor: 'contact' }),
    ],
  }),
});

module.exports = [novaLuxe, heraldLuxe, vidoraLuxe, marqueeLuxe, waveformLuxe, folioLuxe];
