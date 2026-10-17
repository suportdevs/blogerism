const { B: block, m, un, face, slug, rand, seedFaqs, commonPages } = require('./helpers');

const B = (type, data, style = {}) => block(type, data, { animate: true, ...style });
const HERO = { paddingY: 'none', width: 'full', animate: false };
const FULL = { paddingY: 'none', width: 'full' };

const P = {
  poolNight: '1571896349842-33c89424de2d', poolDusk: '1551882547-ff40c63fe5fa', infinity: '1584132967334-10e028bd69f7', resort: '1520250497591-112f2f40a3f4',
  loungers: '1566073771259-6a8506099945', whitePool: '1564501049412-61c2a3083791', courtyard: '1455587734955-081b22074882', rooftop: '1445019980597-93fa8acb246c',
  nightHotel: '1542314831-068cd1dbfeeb', tower: '1568084680786-a84f91d1153c', suite: '1578683010236-d716f9a3f461', roomWood: '1611892440504-42a792e24d32',
  roomModern: '1631049307264-da0ec9d70304', roomClassic: '1590490360182-c33d57733427', roomWarm: '1582719478250-c89cae4dc85b', lakeBed: '1596394516093-501ba68a0ba6',
  massage: '1544161515-4ab6ce6db874', towels: '1540555700478-4be289fbecef', stones: '1600334089648-b0d9d3028eb2', oil: '1515377905703-c4788e51af15',
  dining: '1414235077428-338989a2e8c0', plate: '1544025162-d76694265947', drinks: '1514933651103-005eec06c04b', coffee: '1495474472287-4d71bcdd2085',
};

const room = (image, badge, category, title, subtitle, price, bed, size, guests) => ({
  image: un(image, 1100), badge, category, title, subtitle, price, period: ' / night', rating: '', url: '/rooms#book',
  meta: [`BedDouble: ${bed}`, `Ruler: ${size}`, `Users: ${guests} guests`],
});

const ROOMS = [
  room(P.roomModern, '', 'Classic', 'Garden Room', 'Courtyard views · Rain shower', '$340', 'King bed', '32 m²', 2),
  room(P.roomWood, 'Guest favourite', 'Suite', 'Terrace Suite', 'Private terrace · Soaking tub', '$520', 'King bed', '48 m²', 2),
  room(P.suite, '', 'Suite', 'Panorama Suite', 'Floor-to-ceiling views · Lounge', '$780', 'Super king', '65 m²', 3),
  room(P.roomClassic, '', 'Classic', 'Heritage Room', 'Original 1898 features', '$410', 'Queen bed', '36 m²', 2),
  room(P.roomWarm, '', 'Classic', 'Spa Retreat Room', 'Direct spa access · Balcony', '$460', 'King bed', '40 m²', 2),
  room(P.lakeBed, 'Signature', 'Signature', 'The Lake Pavilion', 'Private deck · Butler service', '$1,450', 'Super king', '110 m²', 4),
];

const TREATMENTS = [
  ['Flower2', 'Signature ritual', '120 minutes · Scrub, wrap and full-body massage with warm oils.', P.massage],
  ['Gem', 'Hot stone therapy', '90 minutes · Deeply relaxing massage with heated basalt stones.', P.stones],
  ['Droplets', 'Botanical facial', '60 minutes · Organic botanicals tailored to your skin.', P.oil],
  ['Waves', 'Thermal journey', 'Unlimited · Sauna, steam room, plunge pool and relaxation lounge.', P.towels],
];

const POSTS = [
  ['Journal', 'A perfect weekend at Aurelia', 'From sunrise yoga to candlelit dinners — how to spend 48 hours with us.', P.loungers],
  ['Spa', 'The art of slowing down: our spa philosophy', 'Why we designed our treatments around time, not techniques.', P.massage],
  ['Dining', 'Meet our chef: seasonal cooking with a view', 'A conversation about local farms, open fire and the perfect sunset table.', P.dining],
  ['Journal', 'Five walks from our doorstep', 'Lakeside paths, vineyards and a hidden waterfall — all within an hour.', P.rooftop],
];

const body = (t) => `<p>${t}. Stories from the hotel, written by the people who make it.</p><h2>Take your time</h2><p>At Aurelia there is no rush. Breakfast is served until noon, the spa stays open late and every room has a view worth sitting with.</p><blockquote><p>“Luxury is not more — it is enough, done beautifully.”</p></blockquote><p>Ready to visit? <a href="/rooms">Reserve your stay</a> — best rates are always found here.</p>`;

module.exports = {
  id: 'aurelia',
  name: 'Aurelia',
  category: 'Hotel & spa',
  description: 'A boutique hotel & spa in the luxe design language: framed full-screen hero, editorial statements, room cards with nightly rates, spa treatments, dining, gallery and a reservation request.',
  features: { formats: ['STANDARD', 'GALLERY'], series: [], blocks: ['Luxury', 'Headers', 'Business', 'Interactive', 'Media', 'Content', 'Conversion', 'Restaurant', 'Layout'] },
  layout: { header: 'luxe', style: 'luxe', article: 'luxe', listing: 'luxe' },
  general: { siteName: 'Aurelia', tagline: 'Boutique hotel & spa on the lake' },
  contact: { email: 'stay@aurelia-hotel.example', phone: '+41 91 555 01 98', address: 'Via del Lago 12, 6900 Lugano, Switzerland', workingHours: 'Reception 24 hours' },
  social: { instagram: 'https://instagram.com', facebook: 'https://facebook.com', youtube: '', twitter: '', linkedin: '', github: '' },
  seo: { metaTitle: 'Aurelia — Boutique hotel & spa on the lake', metaDescription: 'Thirty-two rooms and suites, an award-winning spa and lakeside dining. Book direct for the best rate.' },
  appearance: {
    preset: 'aurelia', primaryColor: '#8a6a3f', accentColor: '#3f5a4a', backgroundColor: '#f8f5ef', surfaceColor: '#efe9df', textColor: '#1d1a16',
    darkBackgroundColor: '#0e0d0b', darkSurfaceColor: '#191713', darkTextColor: '#efe8dc', headingFont: 'Cormorant Garamond', bodyFont: 'Montserrat',
    radius: 0, colorMode: 'light', headerStyle: 'solid', headerSticky: true, footerStyle: 'luxe', containerWidth: 1280, backToTop: true, blogLayout: 'grid',
    showAuthor: true, showReadingTime: true, baseFontSize: 16,
    footerText: 'A member of independent small luxury hotels.',
    headerCta: { enabled: true, label: 'Reserve', url: '/rooms#book' },
    announcement: { enabled: false, text: '', linkLabel: '', url: '' },
  },
  menus: {
    header: { name: 'Main menu', items: [m('Home', '/'), m('Rooms & suites', '/rooms'), m('Spa', '/spa'), m('Dining', '/#dining'), m('Journal', '/blog'), m('Contact', '/contact')] },
    footer: { name: 'Stay', items: [m('Rooms & suites', '/rooms'), m('Spa', '/spa'), m('Dining', '/#dining'), m('Gift vouchers', '/contact')] },
    'footer-2': { name: 'Hotel', items: [m('About', '/about'), m('Journal', '/blog'), m('FAQ', '/faq'), m('Contact', '/contact'), m('Privacy', '/privacy-policy')] },
  },
  pages: () => [
    {
      slug: 'aurelia-home', title: 'Home', home: true, template: 'full-width', seoTitle: 'Aurelia — Boutique hotel & spa on the lake',
      blocks: [
        B('luxeHero', { image: un(P.poolNight, 2200), video: '', overline: 'Boutique hotel & spa · Since 1898', title: 'Where time', italic: 'slows down', subtitle: 'Thirty-two rooms on the shore of Lake Lugano — with a spa, a kitchen garden and nowhere you need to be.', buttonLabel: 'Reserve your stay', buttonUrl: '/rooms#book', height: 'full', align: 'center', overlay: 40 }, HERO),
        B('luxeStatement', { overline: 'Welcome', text: 'A grand lakeside villa reimagined as a small, quiet hotel — where mornings are slow, service is intuitive and every window frames the water.', signature: 'The Aurelia family' }, { paddingY: 'xl' }),
        B('listingCards', { eyebrow: 'Rooms & suites', title: 'A room for every kind of escape', subtitle: '', variant: 'card', columns: 3, filters: false, subtitleIcon: 'Sparkles', buttonLabel: 'All rooms', buttonUrl: '/rooms', items: ROOMS }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
        B('luxeSplit', { number: '01', overline: 'The spa', title: 'Two floors devoted to rest', text: 'Thermal pools, a cedar sauna and six treatment rooms overlooking the lake.\n\nOur therapists work with organic botanicals grown in the hotel garden.', image: un(P.massage, 1200), imagePosition: 'left', buttonLabel: 'Discover the spa', buttonUrl: '/spa' }, { paddingY: 'xl', width: 'wide' }),
        B('luxeSplit', { number: '02', overline: 'Dining', title: 'From the garden to the terrace', text: 'Seasonal plates, local wines and long lakeside dinners under the plane trees.\n\nBreakfast is served until noon — because holidays should start slowly.', image: un(P.dining, 1200), imagePosition: 'right', buttonLabel: 'Reserve a table', buttonUrl: '/contact' }, { paddingY: 'xl', width: 'wide', anchor: 'dining' }),
        B('stats', { items: [{ value: '32', label: 'Rooms & suites' }, { value: '1898', label: 'Built' }, { value: '1,200 m²', label: 'Spa & wellness' }, { value: '9.6', label: 'Guest rating' }] }, { background: 'surface', paddingY: 'lg' }),
        B('cardCarousel', { eyebrow: 'Experiences', title: 'Ways to spend your days', subtitle: '', cardStyle: 'glass', size: 'md', items: [
          [P.infinity, 'Wellness', 'Sunrise yoga', 'Daily sessions on the lake terrace.'], [P.drinks, 'Evenings', 'Aperitivo hour', 'Local wines and small plates at sunset.'],
          [P.rooftop, 'Outdoors', 'Vineyard walks', 'Guided hikes to family-run wineries.'], [P.stones, 'Spa', 'Couples rituals', 'Two hours, side by side, lake view.'],
          [P.coffee, 'Mornings', 'Slow breakfasts', 'Served until noon, wherever you like.'], [P.resort, 'Summer', 'Private boat trips', 'Explore hidden coves of the lake.'],
        ].map(([id, tag, title, text]) => ({ image: un(id, 900), tag, title, text, url: '/contact' })) }, { paddingY: 'xl', width: 'wide' }),
        B('masonryGallery', { eyebrow: 'Gallery', title: 'A glimpse of Aurelia', subtitle: '', columns: 3, filters: false, items: [P.poolDusk, P.suite, P.courtyard, P.towels, P.whitePool, P.drinks, P.nightHotel, P.roomWood, P.loungers].map((id) => ({ src: un(id, 900), title: '', category: '', caption: '' })) }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
        B('luxeQuote', { overline: 'Guest book', title: '' }, { paddingY: 'xl' }),
        B('luxeCta', { image: un(P.infinity, 2000), overline: 'Book direct', title: 'Your lakeside escape awaits', text: 'Best rate guaranteed, breakfast included and a welcome glass of local wine.', buttonLabel: 'Reserve', buttonUrl: '/rooms#book' }, FULL),
      ],
    },
    {
      slug: 'rooms', title: 'Rooms & suites', template: 'default', seoTitle: 'Rooms & suites — Aurelia',
      blocks: [
        B('luxeHero', { image: un(P.suite, 2200), video: '', overline: 'Rooms & suites', title: 'Rest,', italic: 'beautifully', subtitle: 'Thirty-two rooms, each one different, all with a view of the water or the garden.', buttonLabel: 'Check availability', buttonUrl: '#book', height: 'tall', align: 'center', overlay: 35 }, HERO),
        B('listingCards', { eyebrow: '', title: '', subtitle: '', variant: 'card', columns: 3, filters: true, subtitleIcon: 'Sparkles', buttonLabel: '', buttonUrl: '', items: ROOMS }, { paddingY: 'xl', width: 'wide' }),
        B('comparison', { eyebrow: 'Every stay includes', title: 'Compare our rooms', columns: ['Garden', 'Terrace Suite', 'Panorama', 'Lake Pavilion'], highlight: 2, highlightLabel: 'Guest favourite', groups: false, rows: [
          { group: '', feature: 'Size', values: ['32 m²', '48 m²', '65 m²', '110 m²'] },
          { group: '', feature: 'Lake view', values: ['no', 'yes', 'yes', 'yes'] },
          { group: '', feature: 'Private terrace', values: ['no', 'yes', 'no', 'yes'] },
          { group: '', feature: 'Spa access', values: ['yes', 'yes', 'yes', 'yes'] },
          { group: '', feature: 'Butler service', values: ['no', 'no', 'no', 'yes'] },
        ], buttons: [] }, { background: 'surface', paddingY: 'xl', width: 'wide' }),
        B('appointment', { eyebrow: 'Reservations', title: 'Request your stay', text: 'Tell us your arrival date and preferred room — our reservations team will confirm availability within the hour.', serviceLabel: 'Room', services: ROOMS.map((r) => r.title), firstSlot: '14:00', lastSlot: '22:00', interval: 60, image: un(P.courtyard, 1000), phone: '+41 91 555 01 98', bullets: ['Best rate guaranteed when you book direct', 'Breakfast and spa access included', 'Free cancellation up to 7 days before arrival'] }, { paddingY: 'xl', anchor: 'book' }),
      ],
    },
    {
      slug: 'spa', title: 'Spa', template: 'default', seoTitle: 'The spa — Aurelia',
      blocks: [
        B('luxeHero', { image: un(P.towels, 2200), video: '', overline: 'The spa', title: 'Two floors', italic: 'of stillness', subtitle: 'Thermal pools, cedar sauna and treatments inspired by the garden.', buttonLabel: 'Book a treatment', buttonUrl: '#treatments', height: 'tall', align: 'center', overlay: 40 }, HERO),
        B('serviceCards', { eyebrow: 'Treatments', title: 'Signature treatments', subtitle: '', variant: 'image', columns: 4, buttonLabel: '', buttonUrl: '', items: TREATMENTS.map(([icon, title, text, img]) => ({ icon, title, text, image: un(img, 800), url: '/contact', linkLabel: 'Book' })) }, { paddingY: 'xl', width: 'wide', anchor: 'treatments' }),
        B('hours', { eyebrow: 'Visit the spa', title: 'Opening hours', address: '', phone: '', email: '', mapEmbedUrl: '', image: un(P.stones, 1200), rows: ['Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday', 'Sunday'].map((day) => ({ day, open: '07:00', close: '22:00', closed: false })) }, { background: 'surface', paddingY: 'xl' }),
      ],
    },
    commonPages.about('Aurelia', 'A family-run lakeside villa, welcoming guests since 1898.'),
    commonPages.privacy(),
  ],

  async demo(prisma, { authors }) {
    const cats = {};
    for (const [order, [name, color]] of [['Journal', '#8a6a3f'], ['Spa', '#3f5a4a'], ['Dining', '#9a3412']].entries()) {
      cats[name] = await prisma.category.create({ data: { name, slug: slug(name), color, order } });
    }
    for (const [i, [cat, title, excerpt, img]] of POSTS.entries()) {
      const date = new Date(Date.now() - (i + 1) * 7 * 864e5);
      await prisma.post.create({
        data: {
          title, slug: slug(title), excerpt, content: body(title), coverImage: un(img, 1600), status: 'PUBLISHED', featured: i === 0,
          publishedAt: date, createdAt: date, readingTime: 4, views: rand(200, 3000), authorId: authors[i % authors.length].id,
          categories: { connect: [{ id: cats[cat].id }] },
        },
      });
    }
    await prisma.testimonial.createMany({
      data: [
        { name: 'Charlotte Dubois', position: 'Paris', company: '', avatar: face('w1', 200), content: 'The most peaceful three days of my year. Waking up to the lake from the Terrace Suite is something I will never forget.', rating: 5, order: 0 },
        { name: 'James Whitmore', position: 'London', company: '', avatar: face('m1', 200), content: 'Impeccable, unhurried service and the finest spa I have visited in Europe. We have already booked our anniversary.', rating: 5, order: 1 },
        { name: 'Yuki Sato', position: 'Tokyo', company: '', avatar: face('w4', 200), content: 'Every detail felt considered — from the garden breakfast to the turndown notes. A truly special place.', rating: 5, order: 2 },
      ],
    });
    await seedFaqs(prisma, [
      ['What time is check-in and check-out?', 'Check-in is from 15:00 and check-out until 12:00. Early arrivals are welcome to use the spa while your room is prepared.'],
      ['Is breakfast included?', 'Yes, breakfast is included in every direct booking and is served until noon.'],
      ['Do you have parking?', 'Complimentary valet parking and electric-vehicle charging are available.'],
      ['Are children welcome?', 'Children aged 12 and over are welcome. The spa is reserved for guests aged 16 and above.'],
      ['Can non-residents book the spa?', 'Yes — day passes and treatments are available to non-residents, subject to availability.'],
    ]);
  },
};
