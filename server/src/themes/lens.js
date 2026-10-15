const { B: block, m, un, commonPages, seedFaqs } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });

const PHOTOS = [
  ['1506905925346-21bda4d32df4', 'Above the clouds', 'Landscapes'],
  ['1494790108377-be9c29b29330', 'Golden hour portrait', 'Portraits'],
  ['1519741497674-611481863552', 'The first dance', 'Weddings'],
  ['1477959858617-67f85cf4f1df', 'City in motion', 'City'],
  ['1469474968028-56623f02e42e', 'Valley light', 'Landscapes'],
  ['1500648767791-00dcc994a43e', 'Quiet confidence', 'Portraits'],
  ['1511285560929-80b456fea0bc', 'Vows at sunset', 'Weddings'],
  ['1480714378408-67cf0d13bc1b', 'Night skyline', 'City'],
  ['1501785888041-af3ef285b470', 'Still waters', 'Landscapes'],
  ['1534528741775-53994a69daeb', 'Studio light', 'Portraits'],
  ['1449824913935-59a10b8d2000', 'Streets after rain', 'City'],
  ['1470071459604-3b5ec3a7fe05', 'Morning fog', 'Landscapes'],
  ['1507003211169-0a1dd7228f2d', 'The thinker', 'Portraits'],
  ['1441974231531-c6227db76b6e', 'Forest cathedral', 'Landscapes'],
  ['1493246507139-91e8fad9978e', 'Alpine stillness', 'Landscapes'],
  ['1472214103451-9374bd1c798e', 'Rolling hills', 'Landscapes'],
];
const gallery = (n) => PHOTOS.slice(0, n).map(([id, title, category]) => ({ src: un(id, 1000), title, category, caption: '' }));

module.exports = {
  id: 'lens',
  name: 'Lens',
  category: 'Photography & studio',
  description: 'A cinematic, minimal studio site: Ken Burns slideshow, giant scrolling type, filterable masonry gallery with lightbox.',
  features: { formats: ['STANDARD', 'GALLERY'], series: [], blocks: ['Headers', 'Interactive', 'Media', 'Content', 'Conversion', 'Layout'] },
  layout: { header: 'minimal', article: 'blog', listing: 'cards' },
  general: { siteName: 'Lens Studio', tagline: 'Photography by Aria Lens' },
  contact: { email: 'studio@lens.example', phone: '+44 20 7946 0000', address: 'Shoreditch, London', workingHours: 'By appointment' },
  social: { instagram: 'https://instagram.com', facebook: '', twitter: '', linkedin: '', github: '', youtube: 'https://youtube.com' },
  seo: { metaTitle: 'Lens Studio — portrait, wedding & landscape photography', metaDescription: 'Timeless photography for people, places and the moments in between.' },
  appearance: {
    preset: 'lens', primaryColor: '#c8a97e', accentColor: '#8f7a5e', backgroundColor: '#f7f5f2', surfaceColor: '#efebe5', textColor: '#141312',
    darkBackgroundColor: '#0b0b0b', darkSurfaceColor: '#151515', darkTextColor: '#ecebe8', headingFont: 'Cormorant Garamond', bodyFont: 'Inter',
    radius: 4, colorMode: 'dark', footerStyle: 'simple', containerWidth: 1320, backToTop: true,
    footerText: 'Light, story and feeling.',
    headerCta: { enabled: false, label: '', url: '' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: { name: 'Main menu', items: [m('Home', '/'), m('Work', '/work'), m('About', '/about'), m('Contact', '/contact')] },
    footer: { name: 'Studio', items: [m('Work', '/work'), m('About', '/about'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'lens-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Lens Studio — photography',
      blocks: [
        B('heroSlideshow', { height: 'full', align: 'left', interval: 7, slides: [
          { image: un('1493246507139-91e8fad9978e', 2200), eyebrow: 'Landscapes', title: 'Light, story & feeling', subtitle: 'Photography for people, places and the moments in between.', buttonLabel: 'View the work', buttonUrl: '/work' },
          { image: un('1519741497674-611481863552', 2200), eyebrow: 'Weddings', title: 'Your day, remembered', subtitle: 'Honest, unposed storytelling from first look to last dance.', buttonLabel: 'Wedding collections', buttonUrl: '/contact' },
          { image: un('1534528741775-53994a69daeb', 2200), eyebrow: 'Portraits', title: 'Be seen as you are', subtitle: 'Editorial and personal portraits in studio or on location.', buttonLabel: 'Book a session', buttonUrl: '/contact' },
        ] }, { paddingY: 'none', width: 'full', animate: false }),
        B('textMarquee', { items: ['Portraits', 'Weddings', 'Landscapes', 'Editorial', 'Travel'], speed: 45, twoRows: true }, { paddingY: 'lg', width: 'full' }),
        B('masonryGallery', { eyebrow: 'Selected work', title: 'Stories in frames', subtitle: '', columns: 3, filters: true, items: gallery(12) }, { paddingY: 'xl', width: 'wide' }),
        B('imageText', { eyebrow: 'About', title: 'Hi, I’m Aria — I chase light for a living', text: 'For over a decade I’ve photographed weddings across Europe, portraits for magazines and landscapes from the Alps to the Highlands. My work is quiet, natural and built to last.', image: un('1494790108377-be9c29b29330', 1200), imagePosition: 'left', bullets: ['Featured in Vogue Weddings & National Geographic Traveller', 'Natural light & film-inspired editing', 'Available worldwide'], buttonLabel: 'More about me', buttonUrl: '/about' }, { paddingY: 'xl' }),
        B('features', { eyebrow: 'Services', title: 'How we can work together', subtitle: '', columns: 3, items: [
          { icon: 'Heart', title: 'Weddings', text: 'Full-day coverage, engagement sessions and handcrafted albums.' },
          { icon: 'Star', title: 'Portraits', text: 'Personal branding, editorial and family portraits.' },
          { icon: 'Globe', title: 'Travel & landscape', text: 'Commissioned travel stories and fine-art prints.' },
        ] }, { background: 'surface', paddingY: 'xl' }),
        B('testimonials', { eyebrow: 'Kind words', title: 'From people I’ve photographed' }, { paddingY: 'xl' }),
        B('cta', { title: 'Let’s create something timeless', text: 'Tell me about your story — I reply within 24 hours.', primaryLabel: 'Get in touch', primaryUrl: '/contact', secondaryLabel: 'View the work', secondaryUrl: '/work' }, { paddingY: 'lg' }),
      ],
    },
    {
      slug: 'work', title: 'Work', template: 'full-width', seoTitle: 'Work — Lens Studio',
      blocks: [
        B('pageHeader', { title: 'The work', subtitle: 'Portraits, weddings, landscapes and cities — click any image to view it full screen.' }, { paddingY: 'lg' }),
        B('masonryGallery', { eyebrow: '', title: '', subtitle: '', columns: 3, filters: true, items: gallery(16) }, { paddingY: 'md', width: 'wide' }),
        B('textMarquee', { items: ['Available worldwide', 'Booking 2027'], speed: 35, twoRows: false }, { paddingY: 'lg', width: 'full' }),
      ],
    },
    commonPages.about('Lens Studio', 'Aria Lens is a London-based photographer working worldwide.'),
    commonPages.privacy(),
  ],

  async demo(prisma) {
    await prisma.testimonial.createMany({
      data: [
        { name: 'Olivia & James', position: 'Married in Tuscany', company: '', avatar: 'https://i.pravatar.cc/200?img=26', content: 'Aria captured our day exactly as it felt. Every time we open the album we’re back on that hillside.', rating: 5, order: 0 },
        { name: 'Marcus Reed', position: 'Creative Director', company: 'Northwind Magazine', avatar: 'https://i.pravatar.cc/200?img=60', content: 'A rare eye for natural light. Our editorial portraits have never looked better.', rating: 5, order: 1 },
        { name: 'Hana Sato', position: 'Founder', company: 'Bloom Studio', avatar: 'https://i.pravatar.cc/200?img=20', content: 'Relaxed, professional and the images were delivered ahead of schedule. Highly recommended.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['Do you travel for weddings?', 'Yes — I photograph weddings worldwide. Travel is quoted per location.'],
      ['When will I receive my photos?', 'Portrait galleries within two weeks, weddings within six weeks.'],
      ['Can I order prints?', 'Every gallery includes an online print shop with archival-quality prints.'],
    ]);
  },
};
