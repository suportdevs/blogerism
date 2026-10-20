import { ICON_NAMES } from './icons';

/*
 * Page builder block registry.
 * Each block declares: label, description, category, icon (lucide name), default data and a field schema.
 * Field types: text | textarea | richtext | image | url | select | number | toggle | stringList | list | icon
 * The admin editor renders forms from this schema; components/site/blocks renders the output.
 */

const button = (prefix, label) => [
  { name: `${prefix}Label`, label: `${label} label`, type: 'text', half: true },
  { name: `${prefix}Url`, label: `${label} link`, type: 'url', half: true },
];
const heading = [
  { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
  { name: 'title', label: 'Title', type: 'text' },
];

// Shared "data source" fields for dynamic news / media blocks.
const FORMAT_OPTIONS = [['', 'Any'], ['STANDARD', 'Articles'], ['VIDEO', 'Videos'], ['AUDIO', 'Audio'], ['GALLERY', 'Galleries']];
const SERIES_TYPE_OPTIONS = [['', 'Any'], ['SHOW', 'Shows'], ['PLAYLIST', 'Playlists'], ['PODCAST', 'Podcasts']];
const SORT = { name: 'sort', label: 'Sort', type: 'select', half: true, options: [['latest', 'Latest'], ['popular', 'Most viewed'], ['liked', 'Most liked'], ['episodes', 'Episode order']] };
const COUNT = { name: 'count', label: 'Number of items', type: 'number', half: true };
const QUERY = [
  { name: 'category', label: 'Category', type: 'category', half: true },
  { name: 'format', label: 'Format', type: 'select', options: FORMAT_OPTIONS, half: true },
  SORT,
];

export const BLOCKS = {
  hero: {
    label: 'Hero', category: 'Headers', icon: 'Sparkles', description: 'Big headline with buttons and image',
    defaults: { variant: 'centered', eyebrow: 'New', title: 'Your big, bold headline', subtitle: 'Explain what you do in one or two compelling sentences.', primaryLabel: 'Get started', primaryUrl: '/contact', secondaryLabel: 'Learn more', secondaryUrl: '/about', image: '' },
    fields: [
      { name: 'variant', label: 'Layout', type: 'select', options: [['centered', 'Centered'], ['split', 'Split with image'], ['background', 'Image background']] },
      ...heading,
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      ...button('primary', 'Primary button'),
      ...button('secondary', 'Secondary button'),
      { name: 'image', label: 'Image', type: 'image' },
    ],
  },
  pageHeader: {
    label: 'Page header', category: 'Headers', icon: 'PanelTop', description: 'Simple title & subtitle banner',
    defaults: { title: 'Page title', subtitle: 'A short description of this page.' },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'subtitle', label: 'Subtitle', type: 'textarea' }],
  },
  features: {
    label: 'Features grid', category: 'Content', icon: 'LayoutGrid', description: 'Icon cards in a grid',
    defaults: { eyebrow: 'Features', title: 'Why choose us', subtitle: '', columns: 3, items: [{ icon: 'Zap', title: 'Fast', text: 'Lightning quick performance.' }, { icon: 'ShieldCheck', title: 'Secure', text: 'Security built in from day one.' }, { icon: 'Palette', title: 'Beautiful', text: 'Pixel-perfect design everywhere.' }] },
    fields: [
      ...heading,
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'columns', label: 'Columns', type: 'select', options: [[2, '2'], [3, '3'], [4, '4']] },
      { name: 'items', label: 'Features', type: 'list', itemLabel: 'title', defaults: { icon: 'Star', title: 'Feature', text: 'Describe it.' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES },
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'text', label: 'Text', type: 'textarea' },
      ] },
    ],
  },
  imageText: {
    label: 'Image + text', category: 'Content', icon: 'Columns2', description: 'Media beside copy with bullets',
    defaults: { eyebrow: '', title: 'Tell your story', text: 'Pair a compelling image with supporting copy.', image: '', imagePosition: 'right', bullets: ['First benefit', 'Second benefit'], buttonLabel: '', buttonUrl: '' },
    fields: [
      ...heading,
      { name: 'text', label: 'Text', type: 'textarea' },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'imagePosition', label: 'Image position', type: 'select', options: [['left', 'Left'], ['right', 'Right']] },
      { name: 'bullets', label: 'Bullet points', type: 'stringList' },
      ...button('button', 'Button'),
    ],
  },
  richText: {
    label: 'Rich text', category: 'Content', icon: 'Type', description: 'Free-form formatted text',
    defaults: { html: '<h2>Heading</h2><p>Start writing your content here…</p>' },
    fields: [{ name: 'html', label: 'Content', type: 'richtext' }],
  },
  stats: {
    label: 'Stats', category: 'Content', icon: 'BarChart3', description: 'Big numbers that impress',
    defaults: { items: [{ value: '10k+', label: 'Customers' }, { value: '99%', label: 'Satisfaction' }, { value: '24/7', label: 'Support' }] },
    fields: [{ name: 'items', label: 'Stats', type: 'list', itemLabel: 'label', defaults: { value: '100', label: 'Label' }, fields: [{ name: 'value', label: 'Value', type: 'text', half: true }, { name: 'label', label: 'Label', type: 'text', half: true }] }],
  },
  logos: {
    label: 'Logo cloud', category: 'Content', icon: 'Building2', description: 'Scrolling brand names',
    defaults: { title: 'Trusted by', items: ['Acme', 'Globex', 'Initech', 'Umbrella'] },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'items', label: 'Names', type: 'stringList' }],
  },
  gallery: {
    label: 'Gallery', category: 'Media', icon: 'Images', description: 'Responsive image grid',
    defaults: { title: 'Gallery', columns: 3, images: [] },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'columns', label: 'Columns', type: 'select', options: [[2, '2'], [3, '3'], [4, '4']] },
      { name: 'images', label: 'Images', type: 'list', itemLabel: 'caption', defaults: { src: '', caption: '' }, fields: [{ name: 'src', label: 'Image', type: 'image' }, { name: 'caption', label: 'Caption', type: 'text' }] },
    ],
  },
  video: {
    label: 'Video', category: 'Media', icon: 'PlayCircle', description: 'YouTube / Vimeo embed',
    defaults: { title: '', url: 'https://www.youtube.com/watch?v=dQw4w9WgXcQ' },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'url', label: 'Video URL', type: 'url', hint: 'YouTube or Vimeo link' }],
  },
  latestPosts: {
    label: 'Latest posts', category: 'Dynamic', icon: 'Newspaper', description: 'Recent blog articles',
    defaults: { eyebrow: 'Blog', title: 'Latest articles', count: 3, buttonLabel: 'View all', buttonUrl: '/blog' },
    fields: [...heading, { name: 'count', label: 'Number of posts', type: 'number' }, ...button('button', 'Button')],
  },
  testimonials: {
    label: 'Testimonials', category: 'Dynamic', icon: 'Quote', description: 'Customer quotes (from Testimonials)',
    defaults: { eyebrow: 'Testimonials', title: 'What people say' },
    fields: heading,
  },
  faq: {
    label: 'FAQ', category: 'Dynamic', icon: 'HelpCircle', description: 'Accordion of your FAQs',
    defaults: { eyebrow: 'FAQ', title: 'Frequently asked questions' },
    fields: heading,
  },
  pricing: {
    label: 'Pricing', category: 'Conversion', icon: 'CreditCard', description: 'Plan comparison cards',
    defaults: { eyebrow: 'Pricing', title: 'Choose your plan', plans: [{ name: 'Basic', price: '$9', period: '/mo', description: 'For individuals', features: ['Feature one', 'Feature two'], buttonLabel: 'Choose', buttonUrl: '/contact', highlighted: false }, { name: 'Pro', price: '$29', period: '/mo', description: 'For teams', features: ['Everything in Basic', 'Feature three'], buttonLabel: 'Choose', buttonUrl: '/contact', highlighted: true }] },
    fields: [...heading, { name: 'plans', label: 'Plans', type: 'list', itemLabel: 'name', defaults: { name: 'Plan', price: '$0', period: '/mo', description: '', features: [], buttonLabel: 'Choose', buttonUrl: '/contact', highlighted: false }, fields: [
      { name: 'name', label: 'Name', type: 'text', half: true },
      { name: 'price', label: 'Price', type: 'text', half: true },
      { name: 'period', label: 'Period', type: 'text', half: true },
      { name: 'highlighted', label: 'Highlight', type: 'toggle', half: true },
      { name: 'description', label: 'Description', type: 'text' },
      { name: 'features', label: 'Features', type: 'stringList' },
      { name: 'buttonLabel', label: 'Button label', type: 'text', half: true },
      { name: 'buttonUrl', label: 'Button link', type: 'url', half: true },
    ] }],
  },
  cta: {
    label: 'Call to action', category: 'Conversion', icon: 'Megaphone', description: 'Bold banner with buttons',
    defaults: { title: 'Ready to get started?', text: 'Join us today.', primaryLabel: 'Get started', primaryUrl: '/contact', secondaryLabel: '', secondaryUrl: '' },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea' }, ...button('primary', 'Primary button'), ...button('secondary', 'Secondary button')],
  },
  newsletter: {
    label: 'Newsletter', category: 'Conversion', icon: 'Mail', description: 'Email signup form',
    defaults: { title: 'Subscribe to our newsletter', text: 'Get the latest updates delivered to your inbox.' },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea' }],
  },
  contactForm: {
    label: 'Contact form', category: 'Conversion', icon: 'Send', description: 'Form + contact details',
    defaults: { title: 'Get in touch', text: 'We usually reply within one business day.', showInfo: true },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea' }, { name: 'showInfo', label: 'Show contact details', type: 'toggle' }],
  },
  /* ------------------------------ News ------------------------------ */
  breakingNews: {
    label: 'Breaking ticker', category: 'News', icon: 'Zap', description: 'Scrolling breaking-news bar',
    defaults: { label: 'Breaking', breakingOnly: true, format: '', category: '', count: 8, speed: 40 },
    fields: [
      { name: 'label', label: 'Label', type: 'text', half: true },
      { name: 'speed', label: 'Scroll duration (s)', type: 'number', half: true },
      { name: 'breakingOnly', label: 'Only posts marked “breaking”', type: 'toggle' },
      ...QUERY.slice(0, 2), COUNT,
    ],
  },
  newsHero: {
    label: 'News headline', category: 'News', icon: 'Newspaper', description: 'Lead story + top headlines',
    defaults: { layout: 'lead-left', category: '', format: 'STANDARD', sort: 'latest', count: 5, featuredOnly: false },
    fields: [
      { name: 'layout', label: 'Layout', type: 'select', options: [['lead-left', 'Lead + side list'], ['lead-center', 'Center lead, side columns'], ['mosaic', 'Mosaic grid']] },
      ...QUERY, COUNT,
      { name: 'featuredOnly', label: 'Only featured posts', type: 'toggle' },
    ],
  },
  newsSection: {
    label: 'Category section', category: 'News', icon: 'LayoutList', description: 'Headed section of stories',
    defaults: { title: 'Section title', category: '', format: '', sort: 'latest', layout: 'lead-list', count: 4, linkLabel: 'See all' },
    fields: [
      { name: 'title', label: 'Title', type: 'text', half: true },
      { name: 'linkLabel', label: '“See all” label', type: 'text', half: true },
      { name: 'layout', label: 'Layout', type: 'select', options: [['lead-list', 'Lead + list'], ['grid', 'Card grid'], ['overlay', 'Image overlay'], ['headlines', 'Text headlines']] },
      ...QUERY, COUNT,
    ],
  },
  newsColumns: {
    label: 'Category columns', category: 'News', icon: 'Columns3', description: 'Several categories side by side',
    defaults: { count: 4, columns: [{ title: 'Politics', category: '' }, { title: 'Business', category: '' }, { title: 'Sports', category: '' }] },
    fields: [
      COUNT,
      { name: 'columns', label: 'Columns', type: 'list', itemLabel: 'title', defaults: { title: 'Column', category: '' }, fields: [{ name: 'title', label: 'Title', type: 'text', half: true }, { name: 'category', label: 'Category', type: 'category', half: true }] },
    ],
  },
  latestWithSidebar: {
    label: 'Latest + most read', category: 'News', icon: 'PanelRight', description: 'News feed with ranked sidebar',
    defaults: { title: 'Latest news', sidebarTitle: 'Most read', category: '', format: 'STANDARD', count: 6, sidebarCount: 5 },
    fields: [
      { name: 'title', label: 'Feed title', type: 'text', half: true },
      { name: 'sidebarTitle', label: 'Sidebar title', type: 'text', half: true },
      ...QUERY.slice(0, 2),
      { name: 'count', label: 'Feed items', type: 'number', half: true },
      { name: 'sidebarCount', label: 'Sidebar items', type: 'number', half: true },
    ],
  },

  /* ------------------------------ Video ------------------------------ */
  videoFeature: {
    label: 'Featured video', category: 'Video', icon: 'MonitorPlay', description: 'Big player + up-next list',
    defaults: { title: '', category: '', series: '', format: 'VIDEO', sort: 'popular', count: 6 },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'category', label: 'Category', type: 'category', half: true }, { name: 'series', label: 'Series / playlist', type: 'series', half: true }, SORT, COUNT],
  },
  videoGrid: {
    label: 'Video grid', category: 'Video', icon: 'LayoutGrid', description: 'Thumbnail grid with filter chips',
    defaults: { title: 'Recommended', showChips: true, category: '', series: '', sort: 'latest', count: 12, columns: 4 },
    fields: [
      { name: 'title', label: 'Title', type: 'text', half: true },
      { name: 'columns', label: 'Columns', type: 'select', options: [[2, '2'], [3, '3'], [4, '4']], half: true },
      { name: 'category', label: 'Category', type: 'category', half: true }, { name: 'series', label: 'Series / playlist', type: 'series', half: true },
      SORT, COUNT,
      { name: 'showChips', label: 'Show category filter chips', type: 'toggle' },
    ],
  },
  mediaRail: {
    label: 'Media row', category: 'Video', icon: 'GalleryHorizontal', description: 'Horizontal scrolling row (streaming style)',
    defaults: { title: 'Trending now', source: 'posts', format: 'VIDEO', category: '', series: '', seriesType: '', sort: 'latest', count: 10, cardStyle: 'landscape', linkLabel: '', linkUrl: '' },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'source', label: 'Show', type: 'select', options: [['posts', 'Posts / episodes'], ['series', 'Series (shows, playlists, podcasts)']] },
      { name: 'cardStyle', label: 'Card style', type: 'select', options: [['landscape', 'Landscape 16:9'], ['poster', 'Poster 2:3'], ['square', 'Square']] },
      { name: 'format', label: 'Format', type: 'select', options: FORMAT_OPTIONS, half: true, showIf: (d) => d.source !== 'series' },
      { name: 'category', label: 'Category', type: 'category', half: true, showIf: (d) => d.source !== 'series' },
      { name: 'series', label: 'Series', type: 'series', showIf: (d) => d.source !== 'series' },
      { name: 'seriesType', label: 'Series type', type: 'select', options: SERIES_TYPE_OPTIONS, showIf: (d) => d.source === 'series' },
      { name: 'sort', label: 'Sort', type: 'select', options: [['latest', 'Latest'], ['popular', 'Most viewed'], ['episodes', 'Episode order']], half: true },
      COUNT,
      { name: 'linkLabel', label: 'Link label', type: 'text', half: true }, { name: 'linkUrl', label: 'Link URL', type: 'url', half: true },
    ],
  },
  billboard: {
    label: 'Billboard', category: 'Video', icon: 'Clapperboard', description: 'Full-bleed featured show banner',
    defaults: { series: '', seriesType: 'SHOW' },
    fields: [
      { name: 'series', label: 'Series', type: 'series', hint: 'Leave empty to use the first featured series.' },
      { name: 'seriesType', label: 'Series type (when empty)', type: 'select', options: SERIES_TYPE_OPTIONS },
    ],
  },
  top10: {
    label: 'Top 10', category: 'Video', icon: 'Trophy', description: 'Ranked row with big numbers',
    defaults: { title: 'Top 10 today', source: 'series', seriesType: 'SHOW', format: 'VIDEO' },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'source', label: 'Rank', type: 'select', options: [['series', 'Series'], ['posts', 'Posts / videos']] },
      { name: 'seriesType', label: 'Series type', type: 'select', options: SERIES_TYPE_OPTIONS, showIf: (d) => d.source === 'series' },
      { name: 'format', label: 'Format', type: 'select', options: FORMAT_OPTIONS, showIf: (d) => d.source !== 'series' },
    ],
  },
  seriesGrid: {
    label: 'Series grid', category: 'Video', icon: 'Library', description: 'Shows, playlists or podcasts',
    defaults: { title: 'Browse', seriesType: '', count: 8, cardStyle: 'poster' },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'seriesType', label: 'Type', type: 'select', options: SERIES_TYPE_OPTIONS, half: true },
      { name: 'cardStyle', label: 'Card style', type: 'select', options: [['poster', 'Poster 2:3'], ['square', 'Square'], ['landscape', 'Landscape']], half: true },
      COUNT,
    ],
  },

  /* ------------------------------ Audio ------------------------------ */
  audioPlaylist: {
    label: 'Audio playlist', category: 'Audio', icon: 'ListMusic', description: 'Episode list with persistent player',
    defaults: { title: 'Latest episodes', series: '', category: '', sort: 'latest', count: 8 },
    fields: [{ name: 'title', label: 'Title', type: 'text' }, { name: 'series', label: 'Podcast / series', type: 'series', half: true }, { name: 'category', label: 'Category', type: 'category', half: true }, SORT, COUNT],
  },

  /* ---------------------------- Portfolio ---------------------------- */
  profileHero: {
    label: 'Profile hero', category: 'Portfolio', icon: 'UserRound', description: 'Name, rotating roles, socials & code card',
    defaults: { availability: 'Available for new projects', greeting: 'Hi, I’m', name: 'Your Name', roles: ['Full Stack Developer'], intro: 'A short introduction about you.', location: '', image: '', primaryLabel: 'View my work', primaryUrl: '#projects', secondaryLabel: 'Contact me', secondaryUrl: '#contact', github: '', linkedin: '', email: '', stack: ['React', 'Node.js'], badges: [] },
    fields: [
      { name: 'availability', label: 'Availability badge', type: 'text' },
      { name: 'greeting', label: 'Greeting', type: 'text', half: true },
      { name: 'name', label: 'Name', type: 'text', half: true },
      { name: 'roles', label: 'Roles (rotate)', type: 'stringList' },
      { name: 'intro', label: 'Intro', type: 'textarea' },
      { name: 'location', label: 'Location', type: 'text' },
      { name: 'image', label: 'Photo (optional — shows a code card when empty)', type: 'image' },
      { name: 'stack', label: 'Code card: tech stack', type: 'stringList' },
      { name: 'badges', label: 'Floating highlight badges', type: 'stringList' },
      { name: 'primaryLabel', label: 'Primary button', type: 'text', half: true }, { name: 'primaryUrl', label: 'Primary link', type: 'url', half: true },
      { name: 'secondaryLabel', label: 'Secondary button', type: 'text', half: true }, { name: 'secondaryUrl', label: 'Secondary link', type: 'url', half: true },
      { name: 'github', label: 'GitHub URL', type: 'url', half: true }, { name: 'linkedin', label: 'LinkedIn URL', type: 'url', half: true },
      { name: 'email', label: 'Email', type: 'text' },
    ],
  },
  devBento: {
    label: 'Developer bento hero', category: 'Portfolio', icon: 'LayoutGrid', description: 'Bento grid: intro, photo, live local time, “currently”, stats, stack marquee & contact',
    defaults: { availability: 'Available for new projects', greeting: '', name: 'Your Name', role: 'Software Engineer', intro: 'I build fast, reliable web products.', photo: '', location: 'Your city', timezone: 'UTC', currentlyLabel: 'Currently', currently: 'Building something new.', stats: [{ value: '5+', label: 'Years experience' }, { value: '20+', label: 'Projects shipped' }, { value: '100%', label: 'Remote-friendly' }], stackLabel: 'Daily stack', stack: [{ label: 'TypeScript', logo: 'typescript', color: '#3178C6', image: '' }, { label: 'React', logo: 'react', color: '#61DAFB', image: '' }], primaryLabel: 'View projects', primaryUrl: '#projects', resumeLabel: 'Résumé', resumeUrl: '/resume', email: 'you@example.com', socials: [{ icon: 'Github', url: 'https://github.com', label: 'GitHub' }, { icon: 'Linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }] },
    fields: [
      { name: 'availability', label: 'Availability badge (empty to hide)', type: 'text' },
      { name: 'greeting', label: 'Greeting (optional)', type: 'text', half: true }, { name: 'name', label: 'Name', type: 'text', half: true },
      { name: 'role', label: 'Role', type: 'text' }, { name: 'intro', label: 'Intro', type: 'textarea', rows: 3 },
      { name: 'photo', label: 'Your photo (optional — shows your initials when empty)', type: 'image' },
      { name: 'location', label: 'Location', type: 'text', half: true }, { name: 'timezone', label: 'Time zone (e.g. Asia/Dhaka)', type: 'text', half: true },
      { name: 'currentlyLabel', label: '“Currently” label', type: 'text', half: true }, { name: 'currently', label: 'Currently doing', type: 'text', half: true },
      { name: 'stats', label: 'Stats (up to 3)', type: 'list', itemLabel: 'label', defaults: { value: '1', label: 'Stat' }, fields: [{ name: 'value', label: 'Value', type: 'text', half: true }, { name: 'label', label: 'Label', type: 'text', half: true }] },
      { name: 'stackLabel', label: 'Stack label', type: 'text' },
      { name: 'stack', label: 'Stack (scrolling)', type: 'list', itemLabel: 'label', defaults: { label: 'Tech', logo: '', color: '', image: '' }, fields: [
        { name: 'label', label: 'Name', type: 'text', half: true }, { name: 'logo', label: 'simpleicons.org slug', type: 'text', half: true },
        { name: 'color', label: 'Logo colour', type: 'color', half: true }, { name: 'image', label: 'Or own logo', type: 'image', half: true },
      ] },
      { name: 'primaryLabel', label: 'Primary button', type: 'text', half: true }, { name: 'primaryUrl', label: 'Primary link', type: 'url', half: true },
      { name: 'resumeLabel', label: 'Résumé button', type: 'text', half: true }, { name: 'resumeUrl', label: 'Résumé link (page or PDF)', type: 'url', half: true },
      { name: 'email', label: 'Email (copy button)', type: 'text' },
      { name: 'socials', label: 'Social links', type: 'list', itemLabel: 'label', defaults: { icon: 'Globe', url: '', label: '' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'label', label: 'Label', type: 'text', half: true }, { name: 'url', label: 'Link', type: 'url' },
      ] },
    ],
  },
  projectShowcase: {
    label: 'Project showcase', category: 'Portfolio', icon: 'FolderGit2', description: 'Filterable project cards with browser frames and Live / Code / Case study links',
    defaults: { eyebrow: '01 · Selected work', title: 'Things I’ve built', subtitle: '', filters: true, buttonLabel: '', buttonUrl: '', items: [{ title: 'Project', category: 'Web app', year: '2025', summary: 'What it does and why it matters.', image: '', stack: ['React'], live: '', code: '', caseStudy: '', featured: true }] },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
      { name: 'filters', label: 'Category filter buttons', type: 'toggle' },
      { name: 'buttonLabel', label: 'Heading button', type: 'text', half: true }, { name: 'buttonUrl', label: 'Heading button link', type: 'url', half: true },
      { name: 'items', label: 'Projects', type: 'list', itemLabel: 'title', defaults: { title: 'Project', category: '', year: '', summary: '', image: '', stack: [], live: '', code: '', caseStudy: '', featured: false }, fields: [
        { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'category', label: 'Category (filter)', type: 'text', half: true },
        { name: 'year', label: 'Year', type: 'text', half: true }, { name: 'featured', label: 'Featured (wide card)', type: 'toggle', half: true },
        { name: 'summary', label: 'Summary', type: 'textarea', rows: 2 }, { name: 'image', label: 'Screenshot', type: 'image' },
        { name: 'stack', label: 'Tech used', type: 'stringList' },
        { name: 'live', label: 'Live URL', type: 'url', half: true }, { name: 'code', label: 'Source code URL', type: 'url', half: true },
        { name: 'caseStudy', label: 'Case study page (e.g. /work/my-project)', type: 'url' },
      ] },
    ],
  },
  stackGrid: {
    label: 'Tech stack grid', category: 'Portfolio', icon: 'Layers', description: 'Grouped skill cards with brand-logo chips',
    defaults: { eyebrow: '02 · Toolbox', title: 'Tech I work with', subtitle: '', groups: [{ icon: 'Server', title: 'Backend', text: '', wide: false, items: [{ label: 'Node.js', logo: 'nodedotjs', color: '#5FA04E', image: '' }] }] },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
      { name: 'groups', label: 'Groups', type: 'list', itemLabel: 'title', defaults: { icon: 'Code2', title: 'Group', text: '', wide: false, items: [] }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
        { name: 'text', label: 'Short text', type: 'text' }, { name: 'wide', label: 'Wide card', type: 'toggle' },
        { name: 'items', label: 'Technologies', type: 'list', itemLabel: 'label', defaults: { label: 'Tech', logo: '', color: '', image: '' }, fields: [
          { name: 'label', label: 'Name', type: 'text', half: true }, { name: 'logo', label: 'simpleicons.org slug', type: 'text', half: true },
          { name: 'color', label: 'Logo colour', type: 'color', half: true }, { name: 'image', label: 'Or own logo', type: 'image', half: true },
        ] },
      ] },
    ],
  },
  workHistory: {
    label: 'Work history', category: 'Portfolio', icon: 'Briefcase', description: 'Expandable roles with highlights and tags',
    defaults: { eyebrow: '03 · Experience', title: 'Where I’ve worked', subtitle: '', buttonLabel: 'Full résumé', buttonUrl: '/resume', items: [{ company: 'Company', role: 'Software Engineer', period: '2022 — Now', location: '', logo: '', summary: '', bullets: ['What you achieved'], tags: [] }] },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
      { name: 'buttonLabel', label: 'Button', type: 'text', half: true }, { name: 'buttonUrl', label: 'Button link', type: 'url', half: true },
      { name: 'items', label: 'Roles', type: 'list', itemLabel: 'role', defaults: { company: 'Company', role: 'Role', period: '', location: '', logo: '', summary: '', bullets: [], tags: [] }, fields: [
        { name: 'role', label: 'Role', type: 'text', half: true }, { name: 'company', label: 'Company', type: 'text', half: true },
        { name: 'period', label: 'Period', type: 'text', half: true }, { name: 'location', label: 'Location', type: 'text', half: true },
        { name: 'logo', label: 'Company logo (optional)', type: 'image' }, { name: 'summary', label: 'Summary', type: 'textarea', rows: 2 },
        { name: 'bullets', label: 'Highlights (“Label: text” for a bold label)', type: 'stringList' }, { name: 'tags', label: 'Tags', type: 'stringList' },
      ] },
    ],
  },
  githubRepos: {
    label: 'GitHub repositories', category: 'Portfolio', icon: 'Github', description: 'Live public repos from GitHub — stars, forks, language',
    defaults: { eyebrow: 'Open source', title: 'On GitHub', subtitle: '', username: 'octocat', sort: 'stars', count: 6, exclude: [], buttonLabel: 'All repositories' },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
      { name: 'username', label: 'GitHub username', type: 'text', half: true },
      { name: 'sort', label: 'Order', type: 'select', options: [['stars', 'Most stars'], ['updated', 'Recently updated']], half: true },
      { name: 'count', label: 'How many', type: 'number', half: true }, { name: 'buttonLabel', label: 'Button text', type: 'text', half: true },
      { name: 'exclude', label: 'Hide repositories (names)', type: 'stringList' },
    ],
  },
  resumeSheet: {
    label: 'Résumé / CV', category: 'Portfolio', icon: 'FileText', description: 'Printable A4 résumé with a “Download PDF” button',
    defaults: { name: 'Your Name', role: 'Software Engineer', email: '', phone: '', location: '', website: '', links: [], summary: '', printLabel: 'Download PDF', note: '', experience: [], projects: [], skills: [], education: [] },
    fields: [
      { name: 'name', label: 'Name', type: 'text', half: true }, { name: 'role', label: 'Role', type: 'text', half: true },
      { name: 'email', label: 'Email', type: 'text', half: true }, { name: 'phone', label: 'Phone', type: 'text', half: true },
      { name: 'location', label: 'Location', type: 'text', half: true }, { name: 'website', label: 'Website', type: 'url', half: true },
      { name: 'links', label: 'Profile links', type: 'list', itemLabel: 'label', defaults: { label: '', url: '' }, fields: [{ name: 'label', label: 'Label', type: 'text', half: true }, { name: 'url', label: 'URL', type: 'url', half: true }] },
      { name: 'summary', label: 'Profile summary', type: 'textarea', rows: 4 },
      { name: 'experience', label: 'Experience', type: 'list', itemLabel: 'role', defaults: { role: '', company: '', period: '', location: '', bullets: [] }, fields: [
        { name: 'role', label: 'Role', type: 'text', half: true }, { name: 'company', label: 'Company', type: 'text', half: true },
        { name: 'period', label: 'Period', type: 'text', half: true }, { name: 'location', label: 'Location', type: 'text', half: true }, { name: 'bullets', label: 'Highlights', type: 'stringList' },
      ] },
      { name: 'projects', label: 'Projects', type: 'list', itemLabel: 'title', defaults: { title: '', url: '', summary: '' }, fields: [{ name: 'title', label: 'Title', type: 'text', half: true }, { name: 'url', label: 'URL', type: 'url', half: true }, { name: 'summary', label: 'Summary', type: 'text' }] },
      { name: 'skills', label: 'Skills', type: 'list', itemLabel: 'title', defaults: { title: '', items: [] }, fields: [{ name: 'title', label: 'Group', type: 'text' }, { name: 'items', label: 'Skills', type: 'stringList' }] },
      { name: 'education', label: 'Education', type: 'list', itemLabel: 'title', defaults: { title: '', org: '', period: '' }, fields: [{ name: 'title', label: 'Qualification', type: 'text' }, { name: 'org', label: 'Institution', type: 'text', half: true }, { name: 'period', label: 'Period', type: 'text', half: true }] },
      { name: 'printLabel', label: 'Button text', type: 'text', half: true }, { name: 'note', label: 'Note above the sheet', type: 'text', half: true },
    ],
  },
  caseStudyHero: {
    label: 'Case study header', category: 'Portfolio', icon: 'Presentation', description: 'Project title, summary, meta (client, role, year), stack, cover & key metrics',
    defaults: { backLabel: 'All projects', backUrl: '/#projects', eyebrow: 'Case study', title: 'Project name', summary: '', client: '', role: '', year: '', duration: '', stack: [], live: '', code: '', cover: '', metrics: [] },
    fields: [
      { name: 'backLabel', label: 'Back link text', type: 'text', half: true }, { name: 'backUrl', label: 'Back link', type: 'url', half: true },
      { name: 'eyebrow', label: 'Eyebrow', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
      { name: 'summary', label: 'Summary', type: 'textarea', rows: 3 },
      { name: 'client', label: 'Client', type: 'text', half: true }, { name: 'role', label: 'My role', type: 'text', half: true },
      { name: 'year', label: 'Year', type: 'text', half: true }, { name: 'duration', label: 'Duration', type: 'text', half: true },
      { name: 'stack', label: 'Tech stack', type: 'stringList' },
      { name: 'live', label: 'Live URL', type: 'url', half: true }, { name: 'code', label: 'Source URL', type: 'url', half: true },
      { name: 'cover', label: 'Cover image', type: 'image' },
      { name: 'metrics', label: 'Key results', type: 'list', itemLabel: 'label', defaults: { value: '', label: '' }, fields: [{ name: 'value', label: 'Value', type: 'text', half: true }, { name: 'label', label: 'Label', type: 'text', half: true }] },
    ],
  },
  glowHero: {
    label: 'Glow name hero', category: 'Portfolio', icon: 'Sparkles', description: 'Huge glowing name, floating link chips and glowing social tiles',
    defaults: { greeting: 'Hi, I am', name: 'Your name', role: 'Full Stack Developer', intro: '', chips: [{ label: 'About me', url: '#about', position: 'tl' }, { label: 'Tech', url: '#skills', position: 'br' }], socials: [{ icon: 'Github', url: 'https://github.com', label: 'GitHub' }, { icon: 'Linkedin', url: 'https://linkedin.com', label: 'LinkedIn' }, { icon: 'Mail', url: 'mailto:you@example.com', label: 'Email' }] },
    fields: [
      { name: 'greeting', label: 'Greeting', type: 'text', half: true }, { name: 'name', label: 'Name', type: 'text', half: true },
      { name: 'role', label: 'Role', type: 'text' }, { name: 'intro', label: 'Short intro (optional)', type: 'textarea', rows: 2 },
      { name: 'chips', label: 'Floating link chips', type: 'list', itemLabel: 'label', defaults: { label: 'Link', url: '#', position: 'tl' }, fields: [
        { name: 'label', label: 'Label', type: 'text', half: true }, { name: 'url', label: 'Link', type: 'url', half: true },
        { name: 'position', label: 'Position (desktop)', type: 'select', options: [['tl', 'Top left'], ['tr', 'Top right'], ['ml', 'Middle left'], ['mr', 'Middle right'], ['bl', 'Lower left'], ['br', 'Lower right']] },
      ] },
      { name: 'socials', label: 'Social tiles', type: 'list', itemLabel: 'label', defaults: { icon: 'Globe', url: '', label: '' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'label', label: 'Label', type: 'text', half: true }, { name: 'url', label: 'Link (https:// or mailto:)', type: 'url' },
      ] },
    ],
  },
  glowTitle: {
    label: 'Stacked outline title', category: 'Portfolio', icon: 'Type', description: 'Giant two-word title — solid word over an outlined word',
    defaults: { solid: 'My', outline: 'Work', align: 'left', size: 'lg', subtitle: '' },
    fields: [
      { name: 'solid', label: 'Solid word', type: 'text', half: true }, { name: 'outline', label: 'Outline word', type: 'text', half: true },
      { name: 'align', label: 'Alignment', type: 'select', options: [['left', 'Left'], ['center', 'Center'], ['right', 'Right']], half: true },
      { name: 'size', label: 'Size', type: 'select', options: [['lg', 'Large'], ['xl', 'Extra large']], half: true },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea', rows: 2 },
    ],
  },
  glowAbout: {
    label: 'Glow about & timeline', category: 'Portfolio', icon: 'IdCard', description: 'Stacked title beside a glass bio card and glowing timelines',
    defaults: { solid: 'About', outline: 'Me', lead: '👋 Hey, I’m …', text: 'Write a few lines about yourself.', groups: [{ title: 'Experience', anchor: 'experience', items: [{ title: 'Role', org: '@Company', period: '2022 – Present', text: '', bullets: ['What you achieved.'] }] }] },
    fields: [
      { name: 'solid', label: 'Solid word', type: 'text', half: true }, { name: 'outline', label: 'Outline word', type: 'text', half: true },
      { name: 'lead', label: 'Opening line', type: 'text' }, { name: 'text', label: 'Bio (blank line between paragraphs)', type: 'textarea', rows: 6 },
      { name: 'groups', label: 'Timeline groups', type: 'list', itemLabel: 'title', defaults: { title: 'Experience', anchor: '', items: [] }, fields: [
        { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'anchor', label: 'Anchor (for menu links)', type: 'text', half: true },
        { name: 'items', label: 'Entries', type: 'list', itemLabel: 'title', defaults: { title: 'Role', org: '', period: '', text: '', bullets: [] }, fields: [
          { name: 'title', label: 'Title', type: 'text' }, { name: 'org', label: 'Organisation', type: 'text', half: true }, { name: 'period', label: 'Period', type: 'text', half: true },
          { name: 'text', label: 'Description', type: 'textarea', rows: 2 }, { name: 'bullets', label: 'Highlights', type: 'stringList' },
        ] },
      ] },
    ],
  },
  glowTech: {
    label: 'Glow tech set', category: 'Portfolio', icon: 'Cpu', description: 'Brand-logo tiles that glow in each brand’s colour, grouped, beside a stacked title',
    defaults: { solid: 'Tech', outline: 'Set', titleSide: 'right', groups: [{ title: 'Core stack', items: [{ label: 'React', logo: 'react', color: '#61DAFB', image: '' }, { label: 'Node.js', logo: 'nodedotjs', color: '#5FA04E', image: '' }] }] },
    fields: [
      { name: 'solid', label: 'Solid word', type: 'text', half: true }, { name: 'outline', label: 'Outline word', type: 'text', half: true },
      { name: 'titleSide', label: 'Title side', type: 'select', options: [['right', 'Right'], ['left', 'Left']] },
      { name: 'groups', label: 'Groups', type: 'list', itemLabel: 'title', defaults: { title: 'Group', items: [] }, fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'items', label: 'Technologies', type: 'list', itemLabel: 'label', defaults: { label: 'Tech', logo: '', color: '#ffffff', image: '' }, fields: [
          { name: 'label', label: 'Name', type: 'text', half: true }, { name: 'color', label: 'Glow colour', type: 'color', half: true },
          { name: 'logo', label: 'Logo slug from simpleicons.org (e.g. react, laravel)', type: 'text' }, { name: 'image', label: 'Or your own logo image', type: 'image' },
        ] },
      ] },
    ],
  },
  aboutMe: {
    label: 'About me', category: 'Portfolio', icon: 'IdCard', description: 'Bio with quick facts',
    defaults: { eyebrow: 'About me', title: 'A little about me', text: 'Write your story here.', facts: [{ label: 'Location', value: 'Your city' }], buttonLabel: '', buttonUrl: '' },
    fields: [
      ...heading,
      { name: 'text', label: 'Bio', type: 'textarea', rows: 6 },
      { name: 'facts', label: 'Quick facts', type: 'list', itemLabel: 'label', defaults: { label: 'Label', value: 'Value' }, fields: [{ name: 'label', label: 'Label', type: 'text', half: true }, { name: 'value', label: 'Value', type: 'text', half: true }] },
      { name: 'buttonLabel', label: 'Button label (e.g. Download CV)', type: 'text', half: true }, { name: 'buttonUrl', label: 'Button link / CV file', type: 'url', half: true },
    ],
  },
  skills: {
    label: 'Skills', category: 'Portfolio', icon: 'Wrench', description: 'Grouped skill cards with chips',
    defaults: { eyebrow: 'Skills', title: 'What I work with', subtitle: '', groups: [{ icon: 'Code2', title: 'Frontend', items: ['React', 'Next.js'] }] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'groups', label: 'Skill groups', type: 'list', itemLabel: 'title', defaults: { icon: 'Code2', title: 'Group', items: [] }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
        { name: 'items', label: 'Skills', type: 'stringList' },
      ] },
    ],
  },
  timeline: {
    label: 'Timeline', category: 'Portfolio', icon: 'Milestone', description: 'Experience or education history',
    defaults: { eyebrow: 'Experience', title: 'Where I’ve worked', items: [{ period: '2022 – Present', title: 'Role', org: 'Company', location: '', description: '', bullets: [], tags: [] }] },
    fields: [
      ...heading,
      { name: 'items', label: 'Entries', type: 'list', itemLabel: 'title', defaults: { period: '', title: 'Role', org: '', location: '', description: '', bullets: [], tags: [] }, fields: [
        { name: 'title', label: 'Title / degree', type: 'text', half: true }, { name: 'period', label: 'Period', type: 'text', half: true },
        { name: 'org', label: 'Company / school', type: 'text', half: true }, { name: 'location', label: 'Location', type: 'text', half: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'bullets', label: 'Highlights (use “Label: text” for a bold label)', type: 'stringList' },
        { name: 'tags', label: 'Tags', type: 'stringList' },
      ] },
    ],
  },
  projects: {
    label: 'Projects', category: 'Portfolio', icon: 'FolderKanban', description: 'Project cards with links & tags',
    defaults: { eyebrow: 'Projects', title: 'Selected work', subtitle: '', items: [{ title: 'Project', url: '', category: '', description: '', tags: [], image: '', featured: false }] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'items', label: 'Projects', type: 'list', itemLabel: 'title', defaults: { title: 'Project', url: '', category: '', description: '', tags: [], image: '', featured: false }, fields: [
        { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'category', label: 'Category', type: 'text', half: true },
        { name: 'url', label: 'Live URL', type: 'url', half: true }, { name: 'featured', label: 'Featured (wide card)', type: 'toggle', half: true },
        { name: 'description', label: 'Description', type: 'textarea' },
        { name: 'tags', label: 'Tags', type: 'stringList' },
        { name: 'image', label: 'Screenshot (optional)', type: 'image' },
      ] },
    ],
  },

  /* ---------------------------- Luxury ---------------------------- */
  luxeHero: {
    label: 'Luxe hero', category: 'Luxury', icon: 'Crown', description: 'Framed full-screen image or video, serif title',
    defaults: { image: '', video: '', overline: 'Since 2019', title: 'Timeless by', italic: 'design', subtitle: '', buttonLabel: 'Discover', buttonUrl: '#', height: 'full', align: 'center', overlay: 40 },
    fields: [
      { name: 'image', label: 'Image (also video poster)', type: 'image' },
      { name: 'video', label: 'Background video (MP4, optional)', type: 'url' },
      { name: 'overline', label: 'Overline', type: 'text' },
      { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'italic', label: 'Italic gold line', type: 'text', half: true },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'buttonLabel', label: 'Button', type: 'text', half: true }, { name: 'buttonUrl', label: 'Button link', type: 'url', half: true },
      { name: 'height', label: 'Height', type: 'select', options: [['full', 'Full screen'], ['tall', 'Tall']], half: true },
      { name: 'align', label: 'Alignment', type: 'select', options: [['center', 'Center'], ['left', 'Left']], half: true },
      { name: 'overlay', label: 'Darken image (%)', type: 'number' },
    ],
  },
  luxeStatement: {
    label: 'Statement', category: 'Luxury', icon: 'ScrollText', description: 'Large centered serif statement',
    defaults: { overline: 'Our philosophy', text: 'A short, confident statement about what you stand for.', signature: '' },
    fields: [{ name: 'overline', label: 'Overline', type: 'text' }, { name: 'text', label: 'Statement', type: 'textarea', rows: 4 }, { name: 'signature', label: 'Signature', type: 'text' }],
  },
  luxeSplit: {
    label: 'Framed split', category: 'Luxury', icon: 'Frame', description: 'Numbered image + text with offset frame',
    defaults: { number: '01', overline: 'Craft', title: 'Made with care', text: 'Tell the story behind this section.', image: '', imagePosition: 'left', buttonLabel: 'Discover', buttonUrl: '#' },
    fields: [
      { name: 'number', label: 'Number', type: 'text', half: true }, { name: 'imagePosition', label: 'Image side', type: 'select', options: [['left', 'Left'], ['right', 'Right']], half: true },
      { name: 'overline', label: 'Overline', type: 'text' }, { name: 'title', label: 'Title', type: 'text' },
      { name: 'text', label: 'Text (blank line = new paragraph)', type: 'textarea', rows: 5 }, { name: 'image', label: 'Image', type: 'image' },
      { name: 'buttonLabel', label: 'Link label', type: 'text', half: true }, { name: 'buttonUrl', label: 'Link', type: 'url', half: true },
    ],
  },
  luxeList: {
    label: 'Editorial list', category: 'Luxury', icon: 'ListOrdered', description: 'Numbered rows, image follows the cursor',
    defaults: { overline: 'Selected', title: 'The collection', source: 'posts', format: '', category: '', series: '', seriesType: '', sort: 'latest', count: 6, linkLabel: '', linkUrl: '' },
    fields: [
      { name: 'overline', label: 'Overline', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
      { name: 'source', label: 'Show', type: 'select', options: [['posts', 'Posts / episodes'], ['series', 'Series']] },
      { name: 'format', label: 'Format', type: 'select', options: FORMAT_OPTIONS, half: true, showIf: (d) => d.source !== 'series' },
      { name: 'category', label: 'Category', type: 'category', half: true, showIf: (d) => d.source !== 'series' },
      { name: 'series', label: 'Series', type: 'series', showIf: (d) => d.source !== 'series' },
      { name: 'seriesType', label: 'Series type', type: 'select', options: SERIES_TYPE_OPTIONS, showIf: (d) => d.source === 'series' },
      SORT, COUNT,
      { name: 'linkLabel', label: 'Link label', type: 'text', half: true }, { name: 'linkUrl', label: 'Link URL', type: 'url', half: true },
    ],
  },
  luxeFeatured: {
    label: 'Magazine feature', category: 'Luxury', icon: 'BookOpen', description: 'Cover story + numbered side stories',
    defaults: { overline: 'The journal', title: 'Featured stories', category: '', format: 'STANDARD', sort: 'latest', count: 5, linkLabel: 'View all', linkUrl: '/blog' },
    fields: [
      { name: 'overline', label: 'Overline', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
      ...QUERY, COUNT,
      { name: 'linkLabel', label: 'Link label', type: 'text', half: true }, { name: 'linkUrl', label: 'Link URL', type: 'url', half: true },
    ],
  },
  luxeQuote: {
    label: 'Quote carousel', category: 'Luxury', icon: 'MessageSquareQuote', description: 'One testimonial at a time (from Testimonials)',
    defaults: { overline: 'Kind words', title: '' },
    fields: [{ name: 'overline', label: 'Overline', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true }],
  },
  luxeCta: {
    label: 'Parallax CTA', category: 'Luxury', icon: 'Gem', description: 'Fixed-background image call to action',
    defaults: { image: '', overline: 'Begin', title: 'Let us create something timeless', text: '', buttonLabel: 'Enquire', buttonUrl: '/contact' },
    fields: [
      { name: 'image', label: 'Background image', type: 'image' }, { name: 'overline', label: 'Overline', type: 'text' }, { name: 'title', label: 'Title', type: 'text' },
      { name: 'text', label: 'Text', type: 'textarea' },
      { name: 'buttonLabel', label: 'Button', type: 'text', half: true }, { name: 'buttonUrl', label: 'Button link', type: 'url', half: true },
    ],
  },

  /* ---------------------------- Showcase ---------------------------- */
  heroSlideshow: {
    label: 'Hero slideshow', category: 'Headers', icon: 'GalleryThumbnails', description: 'Full-screen crossfading slides with zoom',
    defaults: { height: 'full', align: 'left', interval: 6, slides: [{ image: '', eyebrow: 'Welcome', title: 'Slide title', subtitle: '', buttonLabel: 'Discover', buttonUrl: '#' }] },
    fields: [
      { name: 'height', label: 'Height', type: 'select', options: [['full', 'Full screen'], ['tall', 'Tall']], half: true },
      { name: 'align', label: 'Text position', type: 'select', options: [['left', 'Bottom left'], ['center', 'Center']], half: true },
      { name: 'interval', label: 'Seconds per slide', type: 'number' },
      { name: 'slides', label: 'Slides', type: 'list', itemLabel: 'title', defaults: { image: '', eyebrow: '', title: 'Slide', subtitle: '', buttonLabel: '', buttonUrl: '' }, fields: [
        { name: 'image', label: 'Image', type: 'image' },
        { name: 'eyebrow', label: 'Eyebrow', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
        { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
        { name: 'buttonLabel', label: 'Button label', type: 'text', half: true }, { name: 'buttonUrl', label: 'Button link', type: 'url', half: true },
      ] },
    ],
  },
  spotlightHero: {
    label: 'Spotlight hero', category: 'Headers', icon: 'MousePointerClick', description: 'Aurora glow + 3D product mockup',
    defaults: { badge: 'Just launched — v2.0', badgeUrl: '#', title: 'The product your team', highlight: 'will love', subtitle: 'Explain your product in one compelling sentence.', primaryLabel: 'Start free', primaryUrl: '#', secondaryLabel: 'Book a demo', secondaryUrl: '#', note: 'Loved by 2,000+ teams', domain: 'yourapp.com', image: '' },
    fields: [
      { name: 'badge', label: 'Badge text', type: 'text', half: true }, { name: 'badgeUrl', label: 'Badge link', type: 'url', half: true },
      { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'highlight', label: 'Gradient words', type: 'text', half: true },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'primaryLabel', label: 'Primary button', type: 'text', half: true }, { name: 'primaryUrl', label: 'Primary link', type: 'url', half: true },
      { name: 'secondaryLabel', label: 'Secondary button', type: 'text', half: true }, { name: 'secondaryUrl', label: 'Secondary link', type: 'url', half: true },
      { name: 'note', label: 'Social proof line', type: 'text', half: true }, { name: 'domain', label: 'Mock browser domain', type: 'text', half: true },
      { name: 'image', label: 'Product screenshot (empty = built-in dashboard)', type: 'image' },
    ],
  },
  masonryGallery: {
    label: 'Masonry gallery', category: 'Media', icon: 'LayoutDashboard', description: 'Filterable photo grid with lightbox',
    defaults: { eyebrow: 'Portfolio', title: 'Selected work', subtitle: '', columns: 3, filters: true, items: [] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'columns', label: 'Columns', type: 'select', options: [[2, '2'], [3, '3'], [4, '4']], half: true },
      { name: 'filters', label: 'Category filter', type: 'toggle', half: true },
      { name: 'items', label: 'Photos', type: 'list', itemLabel: 'title', defaults: { src: '', title: '', category: '', caption: '' }, fields: [
        { name: 'src', label: 'Image', type: 'image' },
        { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'category', label: 'Category', type: 'text', half: true },
        { name: 'caption', label: 'Caption', type: 'text' },
      ] },
    ],
  },
  bentoGrid: {
    label: 'Bento grid', category: 'Content', icon: 'LayoutGrid', description: 'Mixed-size feature tiles with spotlight hover',
    defaults: { eyebrow: 'Features', title: 'Everything you need', subtitle: '', items: [{ icon: 'Zap', title: 'Fast', text: 'Describe it.', size: 'wide', visual: 'chart', image: '' }] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'items', label: 'Tiles', type: 'list', itemLabel: 'title', defaults: { icon: 'Star', title: 'Feature', text: '', size: 'sm', visual: '', image: '' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
        { name: 'text', label: 'Text', type: 'textarea' },
        { name: 'size', label: 'Size', type: 'select', options: [['sm', 'Small'], ['wide', 'Wide'], ['tall', 'Tall'], ['lg', 'Large']], half: true },
        { name: 'visual', label: 'Visual', type: 'select', options: [['', 'None'], ['chart', 'Bar chart'], ['code', 'Code snippet'], ['avatars', 'Avatars'], ['globe', 'Globe'], ['metrics', 'Metrics']], half: true },
        { name: 'image', label: 'Background image', type: 'image' },
      ] },
    ],
  },
  pricingToggle: {
    label: 'Pricing (monthly/yearly)', category: 'Conversion', icon: 'ToggleRight', description: 'Plans with a billing toggle',
    defaults: { eyebrow: 'Pricing', title: 'Simple pricing', subtitle: '', currency: '$', yearlyNote: '-20%', plans: [{ name: 'Starter', description: '', monthly: '19', yearly: '15', features: ['Feature one'], buttonLabel: 'Get started', buttonUrl: '#', highlighted: false }] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'currency', label: 'Currency symbol', type: 'text', half: true }, { name: 'yearlyNote', label: 'Yearly badge', type: 'text', half: true },
      { name: 'plans', label: 'Plans', type: 'list', itemLabel: 'name', defaults: { name: 'Plan', description: '', monthly: '0', yearly: '0', features: [], buttonLabel: 'Choose', buttonUrl: '#', highlighted: false }, fields: [
        { name: 'name', label: 'Name', type: 'text', half: true }, { name: 'highlighted', label: 'Highlight', type: 'toggle', half: true },
        { name: 'description', label: 'Description', type: 'text' },
        { name: 'monthly', label: 'Monthly price', type: 'text', half: true }, { name: 'yearly', label: 'Yearly (per month)', type: 'text', half: true },
        { name: 'features', label: 'Features', type: 'stringList' },
        { name: 'buttonLabel', label: 'Button label', type: 'text', half: true }, { name: 'buttonUrl', label: 'Button link', type: 'url', half: true },
      ] },
    ],
  },
  textMarquee: {
    label: 'Text marquee', category: 'Layout', icon: 'MoveHorizontal', description: 'Giant scrolling words',
    defaults: { items: ['Design', 'Build', 'Launch'], speed: 40, twoRows: false },
    fields: [{ name: 'items', label: 'Words', type: 'stringList' }, { name: 'speed', label: 'Duration (s)', type: 'number', half: true }, { name: 'twoRows', label: 'Second row (reverse)', type: 'toggle', half: true }],
  },
  menuList: {
    label: 'Food menu', category: 'Restaurant', icon: 'UtensilsCrossed', description: 'Tabbed menu with prices & tags',
    defaults: { eyebrow: 'Our menu', title: 'Made fresh daily', subtitle: '', currency: '$', layout: 'tabs', sections: [{ name: 'Starters', note: '', items: [{ name: 'Dish', description: '', price: '9', tags: [], image: '' }] }] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'currency', label: 'Currency', type: 'text', half: true },
      { name: 'layout', label: 'Layout', type: 'select', options: [['tabs', 'Tabs'], ['list', 'All sections']], half: true },
      { name: 'sections', label: 'Menu sections', type: 'list', itemLabel: 'name', defaults: { name: 'Section', note: '', items: [] }, fields: [
        { name: 'name', label: 'Section name', type: 'text', half: true }, { name: 'note', label: 'Note', type: 'text', half: true },
        { name: 'items', label: 'Dishes', type: 'list', itemLabel: 'name', defaults: { name: 'Dish', description: '', price: '', tags: [], image: '' }, fields: [
          { name: 'name', label: 'Name', type: 'text', half: true }, { name: 'price', label: 'Price', type: 'text', half: true },
          { name: 'description', label: 'Description', type: 'textarea', rows: 2 },
          { name: 'tags', label: 'Tags (Vegan, Spicy…)', type: 'stringList' },
          { name: 'image', label: 'Photo', type: 'image' },
        ] },
      ] },
    ],
  },
  hours: {
    label: 'Opening hours & location', category: 'Restaurant', icon: 'Clock', description: 'Live “open now” + map',
    defaults: { eyebrow: 'Visit us', title: 'Hours & location', address: '', phone: '', email: '', mapEmbedUrl: '', image: '', rows: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({ day, open: '11:00', close: '22:00', closed: false })) },
    fields: [
      ...heading,
      { name: 'rows', label: 'Opening hours', type: 'list', itemLabel: 'day', defaults: { day: 'Monday', open: '11:00', close: '22:00', closed: false }, fields: [
        { name: 'day', label: 'Day', type: 'select', options: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((x) => [x, x]) },
        { name: 'open', label: 'Opens', type: 'text', half: true }, { name: 'close', label: 'Closes', type: 'text', half: true },
        { name: 'closed', label: 'Closed all day', type: 'toggle' },
      ] },
      { name: 'address', label: 'Address (default: Settings → Contact)', type: 'text' },
      { name: 'phone', label: 'Phone', type: 'text', half: true }, { name: 'email', label: 'Email', type: 'text', half: true },
      { name: 'mapEmbedUrl', label: 'Google Maps embed URL', type: 'url' },
      { name: 'image', label: 'Image (when no map)', type: 'image' },
    ],
  },
  reservation: {
    label: 'Table reservation', category: 'Restaurant', icon: 'CalendarCheck', description: 'Booking form → Messages inbox',
    defaults: { eyebrow: 'Reservations', title: 'Book a table', text: '', image: '', maxGuests: 10, firstSlot: '12:00', lastSlot: '21:30' },
    fields: [
      ...heading, { name: 'text', label: 'Text', type: 'textarea' }, { name: 'image', label: 'Image', type: 'image' },
      { name: 'maxGuests', label: 'Max guests', type: 'number' },
      { name: 'firstSlot', label: 'First time slot', type: 'text', half: true }, { name: 'lastSlot', label: 'Last time slot', type: 'text', half: true },
    ],
  },

  /* ---------------------------- Interactive ---------------------------- */
  team: {
    label: 'Team', category: 'Interactive', icon: 'Users', description: 'People with hover bios & social links',
    defaults: { eyebrow: 'Our people', title: 'Meet the team', subtitle: '', variant: 'cards', columns: 4, members: [
      { name: 'Ava Thompson', role: 'Founder & CEO', image: 'https://i.pravatar.cc/600?img=47', bio: 'Leads strategy and keeps the team pointed at what matters.', linkedin: '#', twitter: '#', email: '' },
      { name: 'Noah Patel', role: 'Head of Design', image: 'https://i.pravatar.cc/600?img=12', bio: 'Obsessed with typography, motion and the details nobody notices.', linkedin: '#', twitter: '', email: '' },
      { name: 'Mia Rossi', role: 'Lead Engineer', image: 'https://i.pravatar.cc/600?img=32', bio: 'Builds fast, accessible products that scale.', linkedin: '#', twitter: '#', email: '' },
      { name: 'Leo Kim', role: 'Customer Success', image: 'https://i.pravatar.cc/600?img=15', bio: 'Makes sure every customer feels looked after.', linkedin: '#', twitter: '', email: '' },
    ] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'variant', label: 'Design', type: 'select', options: [['cards', 'Cards — bio slides up'], ['portrait', 'Tall portraits — colour on hover'], ['round', 'Round avatars']], half: true },
      { name: 'columns', label: 'Columns', type: 'select', options: [[3, '3'], [4, '4']], half: true },
      { name: 'members', label: 'Members', type: 'list', itemLabel: 'name', defaults: { name: 'Name', role: 'Role', image: '', bio: '', linkedin: '', twitter: '', email: '' }, fields: [
        { name: 'image', label: 'Photo', type: 'image' },
        { name: 'name', label: 'Name', type: 'text', half: true }, { name: 'role', label: 'Role', type: 'text', half: true },
        { name: 'bio', label: 'Short bio', type: 'textarea', rows: 2 },
        { name: 'linkedin', label: 'LinkedIn URL', type: 'url', half: true }, { name: 'twitter', label: 'X / Twitter URL', type: 'url', half: true },
        { name: 'email', label: 'Email', type: 'text' },
      ] },
    ],
  },
  steps: {
    label: 'Process steps', category: 'Interactive', icon: 'Footprints', description: 'Numbered steps with a progress line',
    defaults: { eyebrow: 'How it works', title: 'From idea to launch in four steps', subtitle: '', variant: 'timeline', items: [
      { icon: 'MessageCircle', title: 'Discover', text: 'We listen, ask questions and map out what success looks like.' },
      { icon: 'PenTool', title: 'Design', text: 'Wireframes and visual design, reviewed together every week.' },
      { icon: 'Code2', title: 'Build', text: 'Clean, fast code with a preview link you can click any time.' },
      { icon: 'Rocket', title: 'Launch', text: 'We ship, measure and keep improving after go-live.' },
    ] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'variant', label: 'Design', type: 'select', options: [['timeline', 'Horizontal timeline'], ['cards', 'Gradient cards'], ['vertical', 'Vertical — fills as you scroll']] },
      { name: 'items', label: 'Steps', type: 'list', itemLabel: 'title', defaults: { icon: 'Star', title: 'Step', text: '' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES }, { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 2 },
      ] },
    ],
  },
  featureTabs: {
    label: 'Feature tabs', category: 'Interactive', icon: 'PanelsTopLeft', description: 'Auto-playing tabs that swap image & copy',
    defaults: { eyebrow: 'Features', title: 'One platform, every workflow', subtitle: '', variant: 'top', autoplay: true, tabs: [
      { icon: 'PenTool', label: 'Create', title: 'Write and design visually', text: 'Compose pages from beautiful blocks and see every change live.', bullets: ['Drag & drop builder', 'Live preview'], image: 'https://picsum.photos/seed/tab-create/1200/800', buttonLabel: '', buttonUrl: '' },
      { icon: 'Users', label: 'Collaborate', title: 'Work together, in real time', text: 'Roles and permissions keep everyone in their lane.', bullets: ['Editors & authors', 'Activity log'], image: 'https://picsum.photos/seed/tab-collab/1200/800', buttonLabel: '', buttonUrl: '' },
      { icon: 'Rocket', label: 'Publish', title: 'Ship with confidence', text: 'Schedule posts, manage SEO and publish in one click.', bullets: ['Scheduling', 'SEO controls'], image: 'https://picsum.photos/seed/tab-publish/1200/800', buttonLabel: '', buttonUrl: '' },
    ] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'variant', label: 'Tab position', type: 'select', options: [['top', 'Tabs on top'], ['side', 'Tabs on the side']], half: true },
      { name: 'autoplay', label: 'Auto-advance', type: 'toggle', half: true },
      { name: 'tabs', label: 'Tabs', type: 'list', itemLabel: 'label', defaults: { icon: 'Star', label: 'Tab', title: 'Title', text: '', bullets: [], image: '', buttonLabel: '', buttonUrl: '' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'label', label: 'Tab label', type: 'text', half: true },
        { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 2 },
        { name: 'bullets', label: 'Bullets', type: 'stringList' }, { name: 'image', label: 'Image', type: 'image' },
        { name: 'buttonLabel', label: 'Button', type: 'text', half: true }, { name: 'buttonUrl', label: 'Button link', type: 'url', half: true },
      ] },
    ],
  },
  comparison: {
    label: 'Comparison table', category: 'Interactive', icon: 'Table2', description: 'Plans / products side by side',
    defaults: { eyebrow: 'Compare', title: 'Find the right plan', subtitle: '', columns: ['Starter', 'Pro', 'Business'], highlight: 1, highlightLabel: 'Most popular', groups: true, rows: [
      { group: 'Essentials', feature: 'Pages', values: ['10', 'Unlimited', 'Unlimited'] },
      { group: 'Essentials', feature: 'Custom domain', values: ['yes', 'yes', 'yes'] },
      { group: 'Essentials', feature: 'Storage', values: ['1 GB', '50 GB', '1 TB'] },
      { group: 'Collaboration', feature: 'Team members', values: ['1', '5', 'Unlimited'] },
      { group: 'Collaboration', feature: 'Roles & permissions', values: ['no', 'yes', 'yes'] },
      { group: 'Support', feature: 'Priority support', values: ['no', 'no', 'yes'] },
    ], buttons: [{ label: 'Start free', url: '#' }, { label: 'Go Pro', url: '#' }, { label: 'Contact sales', url: '/contact' }] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'columns', label: 'Columns (plans / products)', type: 'stringList' },
      { name: 'highlight', label: 'Highlighted column (1 = first, 0 = none)', type: 'number', half: true }, { name: 'highlightLabel', label: 'Highlight badge', type: 'text', half: true },
      { name: 'groups', label: 'Show group headings', type: 'toggle' },
      { name: 'rows', label: 'Rows', type: 'list', itemLabel: 'feature', hint: 'Values: “yes”, “no” or any text', defaults: { group: '', feature: 'Feature', values: [] }, fields: [
        { name: 'group', label: 'Group', type: 'text', half: true }, { name: 'feature', label: 'Feature', type: 'text', half: true },
        { name: 'values', label: 'Values (one per column: yes / no / text)', type: 'stringList' },
      ] },
      { name: 'buttons', label: 'Buttons under each column', type: 'list', itemLabel: 'label', defaults: { label: 'Choose', url: '#' }, fields: [
        { name: 'label', label: 'Label', type: 'text', half: true }, { name: 'url', label: 'Link', type: 'url', half: true },
      ] },
    ],
  },
  beforeAfter: {
    label: 'Before / after', category: 'Interactive', icon: 'SplitSquareHorizontal', description: 'Drag a handle to compare two images',
    defaults: { eyebrow: 'Transformation', title: 'See the difference', text: 'Drag the handle to compare.', before: 'https://picsum.photos/seed/ba-before/1600/1000?grayscale', after: 'https://picsum.photos/seed/ba-before/1600/1000', beforeLabel: 'Before', afterLabel: 'After', start: 50, layout: 'stacked', ratio: '16/9' },
    fields: [
      ...heading, { name: 'text', label: 'Text', type: 'textarea' },
      { name: 'before', label: 'Before image', type: 'image' }, { name: 'after', label: 'After image', type: 'image' },
      { name: 'beforeLabel', label: 'Before label', type: 'text', half: true }, { name: 'afterLabel', label: 'After label', type: 'text', half: true },
      { name: 'start', label: 'Start position (%)', type: 'number', half: true },
      { name: 'ratio', label: 'Shape', type: 'select', options: [['16/9', 'Wide 16:9'], ['4/3', 'Classic 4:3'], ['1/1', 'Square']], half: true },
      { name: 'layout', label: 'Layout', type: 'select', options: [['stacked', 'Heading above'], ['split', 'Text beside']] },
    ],
  },
  accordionImage: {
    label: 'Accordion + image', category: 'Interactive', icon: 'ListCollapse', description: 'Expanding items that swap a large image',
    defaults: { eyebrow: 'Why us', title: 'Built around how you work', subtitle: '', imagePosition: 'right', autoplay: true, items: [
      { title: 'Thoughtful by default', text: 'Sensible defaults mean you spend time on content, not configuration.', image: 'https://picsum.photos/seed/acc-1/1200/1000' },
      { title: 'Fast everywhere', text: 'Optimised images and server rendering keep every page snappy.', image: 'https://picsum.photos/seed/acc-2/1200/1000' },
      { title: 'Yours to customise', text: 'Colours, fonts, layout and blocks — make it unmistakably yours.', image: 'https://picsum.photos/seed/acc-3/1200/1000' },
    ] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'imagePosition', label: 'Image side', type: 'select', options: [['right', 'Right'], ['left', 'Left']], half: true },
      { name: 'autoplay', label: 'Auto-advance', type: 'toggle', half: true },
      { name: 'items', label: 'Items', type: 'list', itemLabel: 'title', defaults: { title: 'Item', text: '', image: '' }, fields: [
        { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 3 }, { name: 'image', label: 'Image', type: 'image' },
      ] },
    ],
  },
  logoWall: {
    label: 'Logo wall', category: 'Interactive', icon: 'Building2', description: 'Infinite logo marquee or hover grid',
    defaults: { title: 'Trusted by teams at', variant: 'marquee', speed: 30, logos: ['Northwind', 'Lumen', 'Stackwise', 'Acme', 'Globex', 'Initech', 'Umbrella', 'Hooli'].map((name) => ({ name, image: '', url: '' })) },
    fields: [
      { name: 'title', label: 'Title', type: 'text' },
      { name: 'variant', label: 'Design', type: 'select', options: [['marquee', 'Scrolling marquee'], ['grid', 'Bordered grid']], half: true },
      { name: 'speed', label: 'Marquee duration (s)', type: 'number', half: true },
      { name: 'logos', label: 'Logos', type: 'list', itemLabel: 'name', defaults: { name: 'Brand', image: '', url: '' }, fields: [
        { name: 'name', label: 'Name (shown when no image)', type: 'text' }, { name: 'image', label: 'Logo image', type: 'image' }, { name: 'url', label: 'Link', type: 'url' },
      ] },
    ],
  },
  videoLightbox: {
    label: 'Video lightbox', category: 'Interactive', icon: 'Clapperboard', description: 'Cinematic poster that opens a video popup',
    defaults: { eyebrow: 'Watch', title: 'See it in action', text: 'Two minutes that explain everything.', poster: 'https://picsum.photos/seed/video-poster/1800/1000', videoUrl: 'https://www.youtube.com/watch?v=aqz-KE-bpKQ', layout: 'full', duration: '2:14', stats: [] },
    fields: [
      ...heading, { name: 'text', label: 'Text', type: 'textarea' },
      { name: 'poster', label: 'Poster image', type: 'image' },
      { name: 'videoUrl', label: 'Video (YouTube, Vimeo or MP4)', type: 'url' },
      { name: 'layout', label: 'Layout', type: 'select', options: [['full', 'Full-width poster'], ['split', 'Text beside video']], half: true },
      { name: 'duration', label: 'Duration label', type: 'text', half: true },
      { name: 'stats', label: 'Stats under the text', type: 'list', itemLabel: 'label', defaults: { value: '10k', label: 'Label' }, fields: [
        { name: 'value', label: 'Value', type: 'text', half: true }, { name: 'label', label: 'Label', type: 'text', half: true },
      ] },
    ],
  },
  cardCarousel: {
    label: 'Card carousel', category: 'Interactive', icon: 'GalleryHorizontalEnd', description: 'Swipeable cards with arrows & progress',
    defaults: { eyebrow: 'Explore', title: 'Featured collection', subtitle: '', cardStyle: 'overlay', size: 'md', items: [1, 2, 3, 4, 5, 6].map((i) => ({ image: `https://picsum.photos/seed/carousel-${i}/900/1100`, tag: 'Category', title: `Card title ${i}`, text: 'A short description for this card.', url: '#' })) },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'cardStyle', label: 'Card design', type: 'select', options: [['overlay', 'Text over image'], ['stacked', 'Text below image'], ['glass', 'Frosted glass caption']], half: true },
      { name: 'size', label: 'Card size', type: 'select', options: [['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large']], half: true },
      { name: 'items', label: 'Cards', type: 'list', itemLabel: 'title', defaults: { image: '', tag: '', title: 'Card', text: '', url: '' }, fields: [
        { name: 'image', label: 'Image', type: 'image' },
        { name: 'tag', label: 'Tag', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
        { name: 'text', label: 'Text', type: 'textarea', rows: 2 }, { name: 'url', label: 'Link', type: 'url' },
      ] },
    ],
  },
  jobs: {
    label: 'Careers / jobs', category: 'Interactive', icon: 'Briefcase', description: 'Filterable openings that expand',
    defaults: { eyebrow: 'Careers', title: 'Join us', subtitle: 'We hire curious, kind people who love their craft.', applyEmail: 'jobs@example.com', items: [
      { title: 'Senior Frontend Engineer', department: 'Engineering', location: 'Remote', type: 'Full-time', description: 'Own our design system and help ship delightful product experiences.', url: '' },
      { title: 'Product Designer', department: 'Design', location: 'Dhaka', type: 'Full-time', description: 'Shape flows end to end, from research to polished UI.', url: '' },
      { title: 'Content Marketer', department: 'Marketing', location: 'Remote', type: 'Contract', description: 'Tell our story through articles, newsletters and video.', url: '' },
    ] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'applyEmail', label: 'Apply email (used when a job has no link)', type: 'text' },
      { name: 'items', label: 'Openings', type: 'list', itemLabel: 'title', defaults: { title: 'Role', department: 'Team', location: 'Remote', type: 'Full-time', description: '', url: '' }, fields: [
        { name: 'title', label: 'Title', type: 'text' },
        { name: 'department', label: 'Department', type: 'text', half: true }, { name: 'location', label: 'Location', type: 'text', half: true },
        { name: 'type', label: 'Type', type: 'text', half: true }, { name: 'url', label: 'Apply link', type: 'url', half: true },
        { name: 'description', label: 'Description', type: 'textarea', rows: 3 },
      ] },
    ],
  },
  countdown: {
    label: 'Countdown', category: 'Interactive', icon: 'Timer', description: 'Live timer to a launch or event',
    defaults: { eyebrow: 'Coming soon', title: 'Something big is on the way', text: '', date: '2027-01-01T10:00', variant: 'cards', image: '', expiredText: 'It’s live!', buttonLabel: 'Notify me', buttonUrl: '#' },
    fields: [
      ...heading, { name: 'text', label: 'Text', type: 'textarea' },
      { name: 'date', label: 'Target date & time (YYYY-MM-DDTHH:MM)', type: 'text', half: true },
      { name: 'variant', label: 'Design', type: 'select', options: [['cards', 'Glass cards'], ['minimal', 'Big minimal digits'], ['image', 'Over background image']], half: true },
      { name: 'image', label: 'Background image (image design)', type: 'image' },
      { name: 'expiredText', label: 'Text when finished', type: 'text' },
      ...button('button', 'Button'),
    ],
  },
  episodeSpotlight: {
    label: 'Episode spotlight', category: 'Interactive', icon: 'Disc3', description: 'Featured video/episode with “up next” (dynamic)',
    defaults: { eyebrow: 'Now playing', title: '', format: 'AUDIO', series: '', category: '', sort: 'latest', count: 4, linkLabel: 'All episodes', linkUrl: '' },
    fields: [
      ...heading,
      { name: 'format', label: 'Content', type: 'select', options: [['AUDIO', 'Audio / podcast'], ['VIDEO', 'Video'], ['STANDARD', 'Articles']], half: true },
      { name: 'series', label: 'Series', type: 'series', half: true },
      { name: 'category', label: 'Category', type: 'category', half: true }, SORT,
      { name: 'count', label: 'Items (1 featured + up next)', type: 'number' },
      { name: 'linkLabel', label: 'Link label', type: 'text', half: true }, { name: 'linkUrl', label: 'Link URL', type: 'url', half: true },
    ],
  },

  /* ---------------------------- Business ---------------------------- */
  splitHero: {
    label: 'Split hero', category: 'Headers', icon: 'PanelLeft', description: 'Headline beside an image collage or arch with floating stat cards',
    defaults: { variant: 'collage', eyebrow: 'Welcome', title: 'A headline that', highlight: 'earns trust', subtitle: 'One or two sentences that explain what you do and who it is for.', primaryLabel: 'Get started', primaryUrl: '/contact', secondaryLabel: 'Learn more', secondaryUrl: '/about', image: 'https://picsum.photos/seed/split-1/1000/1200', image2: 'https://picsum.photos/seed/split-2/800/800', bullets: [], badges: [{ icon: 'Award', value: '15+', label: 'Years of experience' }], proof: 'Rated 4.9/5 by 1,200+ clients', avatars: [] },
    fields: [
      { name: 'variant', label: 'Design', type: 'select', options: [['collage', 'Image collage'], ['arch', 'Arch image'], ['framed', 'Framed card']] },
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'highlight', label: 'Highlighted words', type: 'text', half: true },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'bullets', label: 'Check-list (optional)', type: 'stringList' },
      ...button('primary', 'Primary button'),
      ...button('secondary', 'Secondary button'),
      { name: 'image', label: 'Main image', type: 'image' }, { name: 'image2', label: 'Second image (collage)', type: 'image' },
      { name: 'badges', label: 'Floating cards (max 2)', type: 'list', itemLabel: 'label', defaults: { icon: 'Star', value: '100+', label: 'Label' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'value', label: 'Value', type: 'text', half: true }, { name: 'label', label: 'Label', type: 'text' },
      ] },
      { name: 'proof', label: 'Social proof line', type: 'text' },
      { name: 'avatars', label: 'Proof avatars (image URLs)', type: 'stringList' },
    ],
  },
  searchHero: {
    label: 'Search hero', category: 'Headers', icon: 'SearchCheck', description: 'Full-bleed image with a tabbed search / booking bar',
    defaults: { image: 'https://picsum.photos/seed/search-hero/2000/1200', overlay: 45, height: 'tall', align: 'center', eyebrow: 'Find your place', title: 'Search made beautifully simple', subtitle: '', tabs: ['Buy', 'Rent'], buttonLabel: 'Search', action: '/contact', fields: [{ label: 'Location', icon: 'MapPin', type: 'text', placeholder: 'City or neighbourhood', options: [] }, { label: 'Type', icon: 'Home', type: 'select', placeholder: '', options: ['House', 'Apartment', 'Villa'] }], stats: [] },
    fields: [
      { name: 'image', label: 'Background image', type: 'image' },
      { name: 'overlay', label: 'Darken image (%)', type: 'number', half: true },
      { name: 'height', label: 'Height', type: 'select', options: [['full', 'Full screen'], ['tall', 'Tall']], half: true },
      { name: 'align', label: 'Text position', type: 'select', options: [['center', 'Center'], ['left', 'Left']] },
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'title', label: 'Title', type: 'text' }, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'tabs', label: 'Tabs (optional)', type: 'stringList' },
      { name: 'fields', label: 'Search fields', type: 'list', itemLabel: 'label', defaults: { label: 'Field', icon: 'Search', type: 'text', placeholder: '', options: [] }, fields: [
        { name: 'label', label: 'Label', type: 'text', half: true }, { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true },
        { name: 'type', label: 'Input', type: 'select', options: [['text', 'Text'], ['select', 'Dropdown'], ['date', 'Date']], half: true }, { name: 'placeholder', label: 'Placeholder', type: 'text', half: true },
        { name: 'options', label: 'Dropdown options', type: 'stringList' },
      ] },
      { name: 'buttonLabel', label: 'Button', type: 'text', half: true }, { name: 'action', label: 'Submit to (page URL)', type: 'url', half: true },
      { name: 'buttonIcon', label: 'Button icon', type: 'icon', options: ICON_NAMES },
      { name: 'stats', label: 'Stats under the bar', type: 'list', itemLabel: 'label', defaults: { value: '100+', label: 'Label' }, fields: [{ name: 'value', label: 'Value', type: 'text', half: true }, { name: 'label', label: 'Label', type: 'text', half: true }] },
    ],
  },
  kineticHero: {
    label: 'Kinetic type hero', category: 'Headers', icon: 'Type', description: 'Giant typography, rotating word, spinning badge & marquee',
    defaults: { eyebrow: 'Independent studio', lines: ['We make', 'brands'], rotate: ['bold', 'loved', 'unforgettable'], subtitle: 'Strategy, identity and digital products for ambitious companies.', primaryLabel: 'See our work', primaryUrl: '#work', secondaryLabel: 'Start a project', secondaryUrl: '/contact', image: 'https://picsum.photos/seed/kinetic/600/600', badge: 'Scroll to explore • Scroll to explore • ', marquee: ['Branding', 'Web design', 'Motion', 'Strategy'] },
    fields: [
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' },
      { name: 'lines', label: 'Headline lines', type: 'stringList' },
      { name: 'rotate', label: 'Rotating words (last line)', type: 'stringList' },
      { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      ...button('primary', 'Primary button'),
      ...button('secondary', 'Secondary button'),
      { name: 'image', label: 'Round image beside the badge', type: 'image' },
      { name: 'badge', label: 'Spinning badge text', type: 'text' },
      { name: 'marquee', label: 'Marquee words', type: 'stringList' },
    ],
  },
  trustBar: {
    label: 'Trust bar', category: 'Business', icon: 'BadgeCheck', description: 'Row of icon highlights — can overlap the hero above',
    defaults: { variant: 'overlap', items: [{ icon: 'ShieldCheck', title: 'Licensed & insured', text: 'Fully certified team.' }, { icon: 'Clock', title: 'Fast response', text: 'Replies within 24 hours.' }, { icon: 'Award', title: 'Award winning', text: 'Recognised by our peers.' }] },
    fields: [
      { name: 'variant', label: 'Design', type: 'select', options: [['overlap', 'Card overlapping the section above'], ['strip', 'Divided strip'], ['pills', 'Centered pills']] },
      { name: 'items', label: 'Highlights', type: 'list', itemLabel: 'title', defaults: { icon: 'Star', title: 'Highlight', text: '' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'text', label: 'Text', type: 'text' },
      ] },
    ],
  },
  serviceCards: {
    label: 'Service cards', category: 'Business', icon: 'LayoutTemplate', description: 'Services as image cards, icon tiles or numbered rows',
    defaults: { eyebrow: 'Services', title: 'What we do', subtitle: '', variant: 'image', columns: 3, buttonLabel: '', buttonUrl: '', items: [1, 2, 3].map((i) => ({ icon: 'Star', title: `Service ${i}`, text: 'A short description of this service.', image: `https://picsum.photos/seed/service-${i}/900/700`, url: '/contact', linkLabel: 'Learn more' })) },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'variant', label: 'Design', type: 'select', options: [['image', 'Image cards'], ['icon', 'Icon tiles — fill on hover'], ['rows', 'Numbered rows']], half: true },
      { name: 'columns', label: 'Columns', type: 'select', options: [[2, '2'], [3, '3'], [4, '4']], half: true },
      ...button('button', 'Heading button'),
      { name: 'items', label: 'Services', type: 'list', itemLabel: 'title', defaults: { icon: 'Star', title: 'Service', text: '', image: '', url: '', linkLabel: 'Learn more' }, fields: [
        { name: 'icon', label: 'Icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
        { name: 'text', label: 'Text', type: 'textarea', rows: 2 }, { name: 'image', label: 'Image', type: 'image' },
        { name: 'linkLabel', label: 'Link label', type: 'text', half: true }, { name: 'url', label: 'Link', type: 'url', half: true },
      ] },
    ],
  },
  listingCards: {
    label: 'Listings', category: 'Business', icon: 'LayoutList', description: 'Properties, rooms, tours or courses with price, meta & filters',
    defaults: { eyebrow: 'Featured', title: 'Latest listings', subtitle: '', columns: 3, filters: true, subtitleIcon: 'MapPin', variant: 'card', buttonLabel: 'View all', buttonUrl: '/contact', items: [1, 2, 3].map((i) => ({ image: `https://picsum.photos/seed/listing-${i}/900/700`, badge: 'New', category: 'Category', title: `Listing ${i}`, subtitle: 'Location', price: '$1,200', period: '/month', rating: '4.9', meta: ['BedDouble: 3 beds', 'Bath: 2 baths'], url: '/contact' })) },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'variant', label: 'Card design', type: 'select', options: [['card', 'Image + details'], ['overlay', 'Text over image']], half: true },
      { name: 'columns', label: 'Columns', type: 'select', options: [[2, '2'], [3, '3'], [4, '4']], half: true },
      { name: 'filters', label: 'Category filter tabs', type: 'toggle', half: true },
      { name: 'subtitleIcon', label: 'Subtitle icon', type: 'icon', options: ICON_NAMES, half: true },
      ...button('button', 'Button'),
      { name: 'items', label: 'Listings', type: 'list', itemLabel: 'title', hint: 'Meta: “Icon: text” (e.g. “BedDouble: 3 beds”) or plain text', defaults: { image: '', badge: '', category: '', title: 'Listing', subtitle: '', price: '', period: '', rating: '', meta: [], url: '' }, fields: [
        { name: 'image', label: 'Image', type: 'image' },
        { name: 'title', label: 'Title', type: 'text', half: true }, { name: 'subtitle', label: 'Location / subtitle', type: 'text', half: true },
        { name: 'category', label: 'Category (filter)', type: 'text', half: true }, { name: 'badge', label: 'Badge', type: 'text', half: true },
        { name: 'price', label: 'Price', type: 'text', half: true }, { name: 'period', label: 'Price suffix', type: 'text', half: true },
        { name: 'rating', label: 'Rating', type: 'text', half: true }, { name: 'url', label: 'Link', type: 'url', half: true },
        { name: 'meta', label: 'Details', type: 'stringList' },
      ] },
    ],
  },
  caseStudies: {
    label: 'Case studies', category: 'Business', icon: 'Layers', description: 'Results-driven stories — cards stack as you scroll',
    defaults: { eyebrow: 'Case studies', title: 'Results we are proud of', subtitle: '', variant: 'stack', items: [1, 2, 3].map((i) => ({ image: `https://picsum.photos/seed/case-${i}/1200/900`, client: `Client ${i}`, title: 'A headline result for this client', text: 'What the challenge was, what we did and what changed.', metrics: [{ value: '+120%', label: 'Growth' }, { value: '3x', label: 'ROI' }], tags: ['Strategy'], url: '/contact' })) },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'variant', label: 'Design', type: 'select', options: [['stack', 'Sticky stacking cards'], ['grid', 'Two-column grid']] },
      { name: 'items', label: 'Case studies', type: 'list', itemLabel: 'title', defaults: { image: '', client: 'Client', title: 'Result', text: '', metrics: [], tags: [], url: '' }, fields: [
        { name: 'image', label: 'Image', type: 'image' },
        { name: 'client', label: 'Client', type: 'text', half: true }, { name: 'url', label: 'Link', type: 'url', half: true },
        { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea', rows: 3 },
        { name: 'metrics', label: 'Metrics', type: 'list', itemLabel: 'label', defaults: { value: '+50%', label: 'Metric' }, fields: [{ name: 'value', label: 'Value', type: 'text', half: true }, { name: 'label', label: 'Label', type: 'text', half: true }] },
        { name: 'tags', label: 'Tags', type: 'stringList' },
      ] },
    ],
  },
  schedule: {
    label: 'Schedule', category: 'Business', icon: 'CalendarDays', description: 'Day tabs with sessions — classes, agenda or itinerary',
    defaults: { eyebrow: 'Schedule', title: 'This week', subtitle: '', buttonLabel: 'Book', buttonUrl: '/contact', hostIcon: 'Users', locationIcon: 'Clock', days: [{ label: 'Monday', sessions: [{ time: '07:00', title: 'Session', host: 'Host', location: 'Room 1', tag: '' }] }] },
    fields: [
      ...heading, { name: 'subtitle', label: 'Subtitle', type: 'textarea' },
      { name: 'buttonLabel', label: 'Row button', type: 'text', half: true }, { name: 'buttonUrl', label: 'Row button link', type: 'url', half: true },
      { name: 'hostIcon', label: 'Host icon', type: 'icon', options: ICON_NAMES, half: true }, { name: 'locationIcon', label: 'Place / duration icon', type: 'icon', options: ICON_NAMES, half: true },
      { name: 'days', label: 'Tabs (days)', type: 'list', itemLabel: 'label', defaults: { label: 'Day', sessions: [] }, fields: [
        { name: 'label', label: 'Tab label', type: 'text' },
        { name: 'sessions', label: 'Sessions', type: 'list', itemLabel: 'title', defaults: { time: '09:00', title: 'Session', host: '', location: '', tag: '' }, fields: [
          { name: 'time', label: 'Time', type: 'text', half: true }, { name: 'title', label: 'Title', type: 'text', half: true },
          { name: 'host', label: 'Host / coach', type: 'text', half: true }, { name: 'location', label: 'Place / duration', type: 'text', half: true },
          { name: 'tag', label: 'Tag', type: 'text' },
        ] },
      ] },
    ],
  },
  donation: {
    label: 'Donation', category: 'Business', icon: 'HandHeart', description: 'Fundraising goal, amount chips & monthly toggle',
    defaults: { eyebrow: 'Donate', title: 'Your gift changes lives', text: '', image: 'https://picsum.photos/seed/donate/1000/1200', currency: '$', goal: 50000, raised: 32400, supporters: 812, amounts: ['25', '50', '100', '250'], impact: [{ amount: '25', text: 'Buys school supplies for one child' }], buttonLabel: 'Donate now', url: '/contact', monthly: true },
    fields: [
      ...heading, { name: 'text', label: 'Text', type: 'textarea' }, { name: 'image', label: 'Image', type: 'image' },
      { name: 'currency', label: 'Currency symbol', type: 'text', half: true }, { name: 'supporters', label: 'Supporters', type: 'number', half: true },
      { name: 'goal', label: 'Goal', type: 'number', half: true }, { name: 'raised', label: 'Raised so far', type: 'number', half: true },
      { name: 'amounts', label: 'Amount options', type: 'stringList' },
      { name: 'impact', label: 'What each amount does', type: 'list', itemLabel: 'amount', defaults: { amount: '50', text: '' }, fields: [{ name: 'amount', label: 'Amount', type: 'text', half: true }, { name: 'text', label: 'Impact', type: 'text', half: true }] },
      { name: 'monthly', label: 'Offer monthly giving', type: 'toggle' },
      { name: 'buttonLabel', label: 'Button', type: 'text', half: true }, { name: 'url', label: 'Donate page (amount is appended)', type: 'url', half: true },
    ],
  },
  appointment: {
    label: 'Appointment booking', category: 'Business', icon: 'CalendarClock', description: 'Service, date & time booking form → Messages inbox',
    defaults: { eyebrow: 'Appointments', title: 'Book a visit', text: 'Pick a time that suits you — we will confirm by email.', serviceLabel: 'Service', services: ['Consultation', 'Follow-up'], firstSlot: '09:00', lastSlot: '17:00', interval: 30, image: '', phone: '', bullets: [] },
    fields: [
      ...heading, { name: 'text', label: 'Text', type: 'textarea' },
      { name: 'requestType', label: 'Request type (shown in Messages → Bookings)', type: 'select', half: true, options: [['appointment', 'Appointment'], ['reservation', 'Reservation'], ['consultation', 'Consultation'], ['valuation', 'Valuation'], ['booking', 'Booking'], ['enquiry', 'Enquiry'], ['enrolment', 'Enrolment']] },
      { name: 'buttonLabel', label: 'Button text (optional)', type: 'text', half: true },
      { name: 'serviceLabel', label: 'Service field label', type: 'text', half: true }, { name: 'phone', label: 'Phone shown beside the form', type: 'text', half: true },
      { name: 'services', label: 'Services', type: 'stringList' },
      { name: 'firstSlot', label: 'First slot', type: 'text', half: true }, { name: 'lastSlot', label: 'Last slot', type: 'text', half: true },
      { name: 'interval', label: 'Minutes between slots', type: 'number' },
      { name: 'bullets', label: 'Reassurance points', type: 'stringList' },
      { name: 'image', label: 'Image (optional)', type: 'image' },
    ],
  },
  ctaBanner: {
    label: 'CTA banner', category: 'Business', icon: 'RectangleHorizontal', description: 'Image-backed call to action with phone number',
    defaults: { variant: 'image', image: 'https://picsum.photos/seed/cta-banner/1800/900', eyebrow: 'Get in touch', title: 'Ready when you are', text: 'Talk to our team today — no obligation.', primaryLabel: 'Contact us', primaryUrl: '/contact', secondaryLabel: '', secondaryUrl: '', phone: '' },
    fields: [
      { name: 'variant', label: 'Design', type: 'select', options: [['image', 'Image with colour wash'], ['split', 'Colour panel + image']] },
      { name: 'image', label: 'Image', type: 'image' },
      { name: 'eyebrow', label: 'Eyebrow', type: 'text' }, { name: 'title', label: 'Title', type: 'text' }, { name: 'text', label: 'Text', type: 'textarea' },
      ...button('primary', 'Primary button'),
      ...button('secondary', 'Secondary button'),
      { name: 'phone', label: 'Phone number (optional)', type: 'text' },
    ],
  },

  spacer: {
    label: 'Spacer', category: 'Layout', icon: 'MoveVertical', description: 'Vertical whitespace / divider',
    defaults: { size: 64, divider: false },
    fields: [{ name: 'size', label: 'Height (px)', type: 'number' }, { name: 'divider', label: 'Show divider line', type: 'toggle' }],
  },
  html: {
    label: 'Custom HTML', category: 'Layout', icon: 'Code2', description: 'Embed raw HTML / widgets',
    defaults: { code: '<div style="text-align:center">Custom HTML</div>' },
    fields: [{ name: 'code', label: 'HTML', type: 'textarea', mono: true, rows: 10 }],
  },
};

export const STYLE_FIELDS = [
  { name: 'background', label: 'Background', type: 'select', options: [['none', 'None'], ['surface', 'Surface'], ['primary', 'Primary color'], ['gradient', 'Gradient glow'], ['dark', 'Dark'], ['image', 'Image']] },
  { name: 'backgroundImage', label: 'Background image', type: 'image', showIf: (s) => s.background === 'image' },
  { name: 'paddingY', label: 'Vertical padding', type: 'select', options: [['none', 'None'], ['sm', 'Small'], ['md', 'Medium'], ['lg', 'Large'], ['xl', 'Extra large']] },
  { name: 'width', label: 'Content width', type: 'select', options: [['narrow', 'Narrow'], ['normal', 'Normal'], ['wide', 'Wide'], ['full', 'Full width']] },
  { name: 'align', label: 'Text alignment', type: 'select', options: [['', 'Default'], ['left', 'Left'], ['center', 'Center']] },
  { name: 'animate', label: 'Animate on load', type: 'toggle' },
  { name: 'anchor', label: 'Anchor ID', type: 'text', hint: 'Link to it with #anchor' },
  { name: 'className', label: 'Custom CSS class', type: 'text' },
  { name: 'hidden', label: 'Hide this block', type: 'toggle' },
];

export const DEFAULT_STYLE = { background: 'none', paddingY: 'lg', width: 'normal', align: '', animate: true };

export const BLOCK_CATEGORIES = ['Headers', 'Luxury', 'Content', 'Business', 'Interactive', 'Media', 'Portfolio', 'Restaurant', 'News', 'Video', 'Audio', 'Dynamic', 'Conversion', 'Layout'];

// Ready-made page templates for "New page".
export const PAGE_TEMPLATES = {
  blank: { label: 'Blank page', blocks: [] },
  landing: { label: 'Landing page', blocks: ['hero', 'logos', 'features', 'stats', 'testimonials', 'pricing', 'faq', 'cta'] },
  about: { label: 'About page', blocks: ['pageHeader', 'imageText', 'stats', 'richText', 'cta'] },
  contact: { label: 'Contact page', blocks: ['pageHeader', 'contactForm', 'faq'] },
  content: { label: 'Content page', blocks: ['pageHeader', 'richText'] },
  news: { label: 'News portal', blocks: ['breakingNews', 'newsHero', 'newsColumns', 'latestWithSidebar', 'mediaRail', 'newsSection'] },
  video: { label: 'Video platform', blocks: ['videoFeature', 'videoGrid', 'mediaRail'] },
  streaming: { label: 'Streaming service', blocks: ['billboard', 'top10', 'mediaRail', 'mediaRail'], style: { background: 'dark' } },
  portfolio: { label: 'Personal portfolio', blocks: ['profileHero', 'stats', 'aboutMe', 'skills', 'timeline', 'projects', 'contactForm'] },
  luxury: { label: 'Luxury landing', blocks: ['luxeHero', 'luxeStatement', 'luxeSplit', 'luxeFeatured', 'luxeQuote', 'luxeCta'] },
  restaurant: { label: 'Restaurant', blocks: ['heroSlideshow', 'imageText', 'menuList', 'reservation', 'hours'] },
  saas: { label: 'SaaS landing', blocks: ['spotlightHero', 'logos', 'bentoGrid', 'stats', 'testimonials', 'pricingToggle', 'faq', 'cta'] },
  photography: { label: 'Photography', blocks: ['heroSlideshow', 'textMarquee', 'masonryGallery', 'contactForm'] },
  podcast: { label: 'Podcast hub', blocks: ['pageHeader', 'seriesGrid', 'audioPlaylist'] },
  company: { label: 'Company / team', blocks: ['pageHeader', 'accordionImage', 'steps', 'team', 'logoWall', 'jobs'] },
  productTour: { label: 'Product tour', blocks: ['featureTabs', 'videoLightbox', 'steps', 'comparison', 'logoWall'] },
  event: { label: 'Event / launch', blocks: ['countdown', 'featureTabs', 'cardCarousel', 'cta'] },
};
