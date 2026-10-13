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

export const BLOCK_CATEGORIES = ['Headers', 'Content', 'Media', 'Portfolio', 'Restaurant', 'News', 'Video', 'Audio', 'Dynamic', 'Conversion', 'Layout'];

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
  restaurant: { label: 'Restaurant', blocks: ['heroSlideshow', 'imageText', 'menuList', 'reservation', 'hours'] },
  saas: { label: 'SaaS landing', blocks: ['spotlightHero', 'logos', 'bentoGrid', 'stats', 'testimonials', 'pricingToggle', 'faq', 'cta'] },
  photography: { label: 'Photography', blocks: ['heroSlideshow', 'textMarquee', 'masonryGallery', 'contactForm'] },
  podcast: { label: 'Podcast hub', blocks: ['pageHeader', 'seriesGrid', 'audioPlaylist'] },
};
